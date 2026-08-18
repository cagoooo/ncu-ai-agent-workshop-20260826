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
    ".pwa-update-prompt{position:fixed!important;right:20px!important;bottom:20px!important;z-index:10000!important;width:min(440px,calc(100vw - 28px))!important;padding:18px 20px!important;border:1.5px solid rgba(85,167,255,.6)!important;border-radius:20px!important;background:rgba(7,19,31,.97)!important;color:#f7fafc!important;box-shadow:0 20px 60px rgba(0,0,0,.45),0 0 0 1px rgba(85,167,255,.2) inset!important;font:14px/1.55 \"Noto Sans TC\",\"Microsoft JhengHei\",system-ui,sans-serif!important;backdrop-filter:blur(20px)!important;animation:pwaSlideUp .3s ease-out!important}",
    "@keyframes pwaSlideUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}",
    ".pwa-update-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;margin-bottom:8px!important}",
    ".pwa-update-badge{display:inline-flex!important;align-items:center!important;padding:3px 9px!important;border-radius:999px!important;background:#256fe8!important;color:#fff!important;font-size:11px!important;font-weight:800!important;letter-spacing:.04em!important}",
    ".pwa-update-prompt strong{font-size:16px!important;font-weight:800!important;color:#fff!important;margin:0!important}",
    ".pwa-update-prompt p{margin:0 0 14px!important;color:#c4d3e1!important;font-size:13px!important;line-height:1.6!important}",
    ".pwa-update-actions{display:flex!important;gap:10px!important;justify-content:flex-end!important}",
    ".pwa-update-actions button{border:1px solid #2a4761!important;border-radius:999px!important;padding:8px 16px!important;background:#102438!important;color:#dce9f4!important;cursor:pointer!important;font:inherit!important;font-size:13px!important;font-weight:600!important;transition:all .2s!important}",
    ".pwa-update-actions .pwa-update-primary{border-color:#55a7ff!important;background:#256fe8!important;color:#fff!important;font-weight:800!important;box-shadow:0 4px 14px rgba(37,111,232,.35)!important}",
    ".pwa-update-actions button:hover{filter:brightness(1.15)!important;transform:translateY(-1px)!important}",
    ".pwa-update-actions button:disabled{cursor:wait!important;opacity:.72!important;transform:none!important}",
    "@media (max-width:600px){.pwa-update-prompt{right:12px!important;bottom:12px!important;left:12px!important;width:auto!important;padding:15px 16px!important}}"
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

  let latestRemoteData = null;
  function showUpdatePrompt(details = {}) {
    const targetVersion = details.version || latestRemoteVersion || "";
    const promptDesc = details.description || latestRemoteData?.description || "為確保檢視最新版簡報、微插圖與 0ms 全螢幕體驗，請立即載入最新版本。";
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
      "<p>" + promptDesc + "</p>" +
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
        latestRemoteData = data;
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

  function initSW() {
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
      if (inSilence()) return;
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
    window.setTimeout(() => checkVersion(true), 800);
    window.setInterval(() => checkVersion(true), 2 * 60 * 1000);
  }

  // 確保完全不阻礙頁面首屏繪製，在 load 事件觸發後才註冊 SW
  if (document.readyState === "complete") {
    initSW();
  } else {
    window.addEventListener("load", initSW, { once: true });
  }
})();
