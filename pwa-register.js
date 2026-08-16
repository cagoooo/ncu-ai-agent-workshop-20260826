(() => {
  const currentScript = document.currentScript || document.querySelector('script[src*="pwa-register.js"]');
  const rootUrl = new URL("./", currentScript?.src || window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "/"));
  const appVersion = document.body?.dataset.appVersion || "dev";
  const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
  if (!isHttp || !("serviceWorker" in navigator)) return;

  const swUrl = new URL("sw.js", rootUrl);
  const versionUrl = new URL("version.json", rootUrl);
  let localVersion = appVersion;

  // ── SILENCE WINDOW：剛透過 __sw_refresh 重載的頁面，15 秒內不彈更新通知
  //    防止「點立即更新 → 重載 → 瀏覽器立刻發現更新 → 又彈窗」的迴圈。
  const justRefreshed = new URL(location.href).searchParams.has("__sw_refresh");
  const silenceUntil = justRefreshed ? Date.now() + 15000 : 0;
  function inSilence() { return Date.now() < silenceUntil; }
  let latestRemoteVersion = "";
  let waitingWorker = null;
  let activeRegistration = null;
  let refreshing = false;
  let reloadStarted = false;
  let lastCheckTime = 0;

  const style = document.createElement("style");
  style.textContent = [
    ".pwa-update-prompt{position:fixed;right:20px;bottom:20px;z-index:10000;width:min(440px,calc(100vw - 28px));padding:18px 20px;border:1.5px solid rgba(85,167,255,.6);border-radius:20px;background:rgba(7,19,31,.97);color:#f7fafc;box-shadow:0 20px 60px rgba(0,0,0,.45),0 0 0 1px rgba(85,167,255,.2) inset;font:14px/1.55 \"Noto Sans TC\",\"Microsoft JhengHei\",system-ui,sans-serif;backdrop-filter:blur(20px);animation:pwaSlideUp .3s ease-out}",
    "@keyframes pwaSlideUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}",
    ".pwa-update-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}",
    ".pwa-update-badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:999px;background:#256fe8;color:#fff;font-size:11px;font-weight:800;letter-spacing:.04em}",
    ".pwa-update-prompt strong{font-size:16px;font-weight:800;color:#fff;margin:0}",
    ".pwa-update-prompt p{margin:0 0 14px;color:#c4d3e1;font-size:13px;line-height:1.6}",
    ".pwa-update-actions{display:flex;gap:10px;justify-content:flex-end}",
    ".pwa-update-actions button{border:1px solid #2a4761;border-radius:999px;padding:8px 16px;background:#102438;color:#dce9f4;cursor:pointer;font:inherit;font-size:13px;transition:all .2s}",
    ".pwa-update-actions .pwa-update-primary{border-color:#55a7ff;background:#256fe8;color:#fff;font-weight:700;box-shadow:0 4px 14px rgba(37,111,232,.35)}",
    ".pwa-update-actions button:hover{filter:brightness(1.15);transform:translateY(-1px)}",
    ".pwa-update-actions button:disabled{cursor:wait;opacity:.72;transform:none}",
    "@media (max-width:600px){.pwa-update-prompt{right:12px;bottom:12px;left:12px;width:auto;padding:15px 16px}}"
  ].join("");
  document.head.append(style);

  function forceReload() {
    if (reloadStarted) return;
    reloadStarted = true;
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("__sw_refresh", String(Date.now()));
    window.location.replace(nextUrl.href);
  }

  function waitForControllerChange() {
    const fallback = window.setTimeout(() => forceReload(), 5000);
    const onChange = () => {
      window.clearTimeout(fallback);
      navigator.serviceWorker.removeEventListener("controllerchange", onChange);
      forceReload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onChange, { once: true });
  }

  async function requestUpdate(panel) {
    if (refreshing) return;
    refreshing = true;
    const button = panel.querySelector("[data-pwa-refresh]");
    const later = panel.querySelector("[data-pwa-later]");
    if (button) {
      button.disabled = true;
      button.textContent = "更新中…";
    }
    if (later) later.disabled = true;

    // ── ACK GATE：點更新前先把目標版本存入 sessionStorage，
    //    重載後所有頁面收到 SW_ACTIVATED 時若版本已 ack 就靜默略過，
    //    防止 SW_ACTIVATED 在重載後再度觸發無限更新提示迴圈。
    const ackVersion = latestRemoteVersion || localVersion;
    try { sessionStorage.setItem("pwa_ack_version", ackVersion); } catch {}

    let worker = waitingWorker;
    if (!worker && activeRegistration) {
      try {
        await activeRegistration.update();
        worker = activeRegistration.waiting || waitingWorker;
      } catch {
        // 網路暫時不可用時，仍以 cache-busted 導覽嘗試載入最新版。
      }
    }
    if (worker) {
      waitingWorker = worker;
      waitForControllerChange();
      worker.postMessage({ type: "SKIP_WAITING" });
    } else {
      forceReload();
    }
  }

  function showUpdatePrompt(details = {}) {
    const targetVersion = details.version || latestRemoteVersion || "";
    // 靜默期：剛重載後 15 秒不彈窗
    if (inSilence()) return;
    if (targetVersion) {
      try {
        // 已確認更新（ack）或已稍後再說（dismissed）→ 靜默略過
        const ack = sessionStorage.getItem("pwa_ack_version");
        if (ack === targetVersion) return;
        const dismissed = sessionStorage.getItem("pwa_dismissed_version");
        if (dismissed === targetVersion) return;
      } catch {}
      // 版本與目前頁面相同 → 不需要更新
      if (targetVersion === localVersion) return;
    }

    if (refreshing || document.querySelector(".pwa-update-prompt")) return;
    const panel = document.createElement("aside");
    panel.className = "pwa-update-prompt";
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    const versionLabel = targetVersion ? " v" + targetVersion : "";
    panel.innerHTML =
      "<div class=\"pwa-update-head\"><span class=\"pwa-update-badge\">⚡ 系統更新</span><strong>網站有新版可用" + versionLabel + "</strong></div>" +
      "<p>為確保能檢視最新版 RAG/Harness 概念看板、工具與無閃爍簡報，請立即載入最新版本。</p>" +
      "<div class=\"pwa-update-actions\"><button type=\"button\" data-pwa-later>稍後再說</button>" +
      "<button type=\"button\" class=\"pwa-update-primary\" data-pwa-refresh>立即更新 🚀</button></div>";
    panel.querySelector("[data-pwa-later]").addEventListener("click", () => {
      if (targetVersion) {
        try {
          sessionStorage.setItem("pwa_dismissed_version", targetVersion);
        } catch {}
      }
      panel.remove();
    });
    panel.querySelector("[data-pwa-refresh]").addEventListener("click", () => requestUpdate(panel));
    document.body.append(panel);
  }

  async function fetchRemoteVersion() {
    try {
      const response = await fetch(versionUrl.href + "?t=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return null;
      const data = await response.json();
      if (data.version) {
        latestRemoteVersion = data.version;
        return data.version;
      }
    } catch {}
    return null;
  }

  async function observeRegistration(registration) {
    if (registration.waiting && navigator.serviceWorker.controller) {
      waitingWorker = registration.waiting;
      const ver = await fetchRemoteVersion();
      // 版本與目前一致或在靜默期 → 不彈
      if (!ver || ver === localVersion || inSilence()) return;
      showUpdatePrompt({ version: ver });
    }
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", async () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          waitingWorker = worker;
          const ver = await fetchRemoteVersion();
          if (!ver || ver === localVersion || inSilence()) return;
          showUpdatePrompt({ version: ver });
        }
      });
    });
  }

  navigator.serviceWorker.register(swUrl.href, {
    scope: rootUrl.pathname,
    updateViaCache: "none",
  }).then((registration) => {
    activeRegistration = registration;
    observeRegistration(registration);
  }).catch(() => {});

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) forceReload();
  });
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "SW_ACTIVATED" && event.data.version && event.data.version !== localVersion) {
      if (inSilence()) return;
      try {
        if (sessionStorage.getItem("pwa_ack_version") === event.data.version) return;
      } catch {}
      showUpdatePrompt({ version: event.data.version });
    }
  });

  async function checkVersion(force = false) {
    const now = Date.now();
    if (inSilence()) return; // 靜默期內跳過
    if (!force && now - lastCheckTime < 15000) return;
    lastCheckTime = now;

    if (activeRegistration) {
      try { activeRegistration.update(); } catch {}
    }

    const remoteVer = await fetchRemoteVersion();
    if (remoteVer && localVersion !== "dev" && remoteVer !== localVersion) {
      showUpdatePrompt({ version: remoteVer });
    }
  }

  window.addEventListener("online", () => checkVersion(true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkVersion(true);
  });
  window.setTimeout(() => checkVersion(true), 1500);
  window.setInterval(() => checkVersion(true), 2 * 60 * 1000);
})();
