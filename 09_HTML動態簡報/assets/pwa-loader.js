(() => {
  if (window.__hyperframes) return;
  const loaderUrl = new URL(document.currentScript?.src || location.href);
  const version = loaderUrl.searchParams.get("v");
  const siteRoot = new URL("..", document.baseURI);
  const registerScript = document.createElement("script");
  registerScript.defer = true;
  registerScript.src = new URL("pwa-register.js", siteRoot).href + (version ? "?v=" + encodeURIComponent(version) : "");
  document.head.append(registerScript);
})();
