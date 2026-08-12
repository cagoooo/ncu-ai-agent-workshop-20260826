(() => {
  const currentScript = document.currentScript;
  const rootUrl = new URL("./", currentScript?.src || window.location.href);
  const appVersion = document.body?.dataset.appVersion || "dev";
  const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
  if (!isHttp || !("serviceWorker" in navigator)) return;

  const swUrl = new URL("sw.js", rootUrl);
  const versionUrl = new URL("version.json", rootUrl);
  let localVersion = appVersion;
  let waitingWorker = null;
  let refreshing = false;

  const style = document.createElement("style");
  style.textContent = [
    ".pwa-update-prompt{position:fixed;right:18px;bottom:18px;z-index:10000;width:min(420px,calc(100vw - 28px));padding:16px 17px;border:1px solid rgba(85,167,255,.5);border-radius:18px;background:rgba(7,19,31,.96);color:#f7fafc;box-shadow:0 18px 55px rgba(0,0,0,.36);font:14px/1.55 \"Noto Sans TC\",\"Microsoft JhengHei\",system-ui,sans-serif;backdrop-filter:blur(16px)}",
    ".pwa-update-prompt strong{display:block;margin-bottom:5px;color:#fff;font-size:16px}",
    ".pwa-update-prompt p{margin:0 0 12px;color:#c4d3e1}",
    ".pwa-update-actions{display:flex;gap:8px;justify-content:flex-end}",
    ".pwa-update-actions button{border:1px solid #2a4761;border-radius:999px;padding:8px 13px;background:#102438;color:#dce9f4;cursor:pointer;font:inherit}",
    ".pwa-update-actions .pwa-update-primary{border-color:#55a7ff;background:#256fe8;color:#fff;font-weight:700}",
    ".pwa-update-actions button:hover{filter:brightness(1.12)}",
    "@media (max-width:600px){.pwa-update-prompt{right:14px;bottom:14px}}"
  ].join("");
  document.head.append(style);

  function showUpdatePrompt(details = {}) {
    if (document.querySelector(".pwa-update-prompt")) return;
    const panel = document.createElement("aside");
    panel.className = "pwa-update-prompt";
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    const version = details.version ? "（" + details.version + "）" : "";
    panel.innerHTML = "<strong>網站有新版可用" + version + "</strong>" +
      "<p>為避免看到舊版簡報、工具或快取內容，請重新載入最新版。</p>" +
      "<div class=\"pwa-update-actions\"><button type=\"button\" data-pwa-later>稍後再說</button>" +
      "<button type=\"button\" class=\"pwa-update-primary\" data-pwa-refresh>立即更新</button></div>";
    panel.querySelector("[data-pwa-later]").addEventListener("click", () => panel.remove());
    panel.querySelector("[data-pwa-refresh]").addEventListener("click", () => {
      refreshing = true;
      if (waitingWorker) {
        waitingWorker.postMessage({ type: "SKIP_WAITING" });
      } else {
        window.location.reload();
      }
    });
    document.body.append(panel);
  }

  function observeRegistration(registration) {
    if (registration.waiting && navigator.serviceWorker.controller) {
      waitingWorker = registration.waiting;
      showUpdatePrompt();
    }
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          waitingWorker = worker;
          showUpdatePrompt();
        }
      });
    });
  }

  navigator.serviceWorker.register(swUrl.href, {
    scope: rootUrl.pathname,
    updateViaCache: "none",
  }).then(observeRegistration).catch(() => {});

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) window.location.reload();
  });
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "SW_ACTIVATED" && event.data.version && event.data.version !== localVersion) {
      showUpdatePrompt({ version: event.data.version });
    }
  });

  async function checkVersion() {
    try {
      const response = await fetch(versionUrl.href + "?t=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      if (!data.version) return;
      if (data.version !== localVersion) {
        showUpdatePrompt({ version: data.version });
      }
    } catch {
      // Offline or temporarily unavailable: the Service Worker remains the fallback.
    }
  }

  window.addEventListener("focus", checkVersion);
  window.addEventListener("online", checkVersion);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkVersion();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) checkVersion();
  });
  window.setTimeout(checkVersion, 5000);
  window.setInterval(checkVersion, 3 * 60 * 1000);
})();
