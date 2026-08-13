const data = JSON.parse(document.getElementById("deck-data").textContent);
const stage = document.getElementById("deck-stage");
const progressBar = document.getElementById("progress-bar");
const currentLabel = document.getElementById("slide-current");
const sectionLabel = document.getElementById("slide-section");
const linkStrip = document.getElementById("link-strip");
const notesPanel = document.getElementById("notes-panel");
const notesTitle = document.getElementById("notes-title");
const notesBody = document.getElementById("notes-body");
const readingPanel = document.getElementById("reading-panel");
const readingTitle = document.getElementById("reading-title");
const readingSection = document.getElementById("reading-section");
const readingBody = document.getElementById("reading-body");
const overview = document.getElementById("overview");
const overviewGrid = document.getElementById("overview-grid");
const fullscreenButtons = [...document.querySelectorAll("[data-action=fullscreen]")];
const immersiveExit = document.querySelector(".immersive-exit");
const slides = data.slides;
let activeIndex = 0;
let touchStartX = null;
let touchStartY = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let hiResTimer = 0;

function enableHiResImage(article) {
  const art = article?.querySelector(".slide-art");
  const source = art?.dataset.hiresSrc;
  if (!art || !source || art.dataset.hiresRequested === "true") return;
  ensureSlideImage(article);
  art.dataset.hiresRequested = "true";
  const preload = new Image();
  preload.decoding = "async";
  preload.onload = () => {
    if (!art.isConnected) return;
    art.src = source;
    art.dataset.hiresReady = "true";
  };
  preload.src = source;
}

function scheduleHiResImage(article, delay = 900) {
  window.clearTimeout(hiResTimer);
  hiResTimer = window.setTimeout(() => {
    if (article?.classList.contains("is-active")) enableHiResImage(article);
  }, delay);
}

function ensureSlideImage(article) {
  const art = article?.querySelector(".slide-art");
  const source = art?.dataset.slideSrc;
  if (!art || !source || art.dataset.sourceReady === "true") return;
  art.src = source;
  art.dataset.sourceReady = "true";
}

function createSlide(item) {
  const article = document.createElement("article");
  article.className = "deck-slide";
  article.dataset.slideId = "slide-" + item.index;
  article.dataset.start = "0";
  article.dataset.duration = "1";
  article.dataset.trackIndex = "0";
  article.setAttribute("aria-label", item.index + ". " + item.title);
  const alt = (item.session || data.session) + "：" + item.title;
  const escapedAlt = alt.replace(/"/g, "&quot;");
  const hiResImage = item.image.replace(/\.png$/i, "@2k.png");
  const loading = item.index <= 2 ? "eager" : "lazy";
  const fetchPriority = item.index === 1 ? ' fetchpriority="high"' : "";
  const sourceAttrs = item.index === 1 ? 'src="' + item.image + '"' : 'src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-slide-src="' + item.image + '"';
  article.innerHTML = '<img class="slide-art" ' + sourceAttrs + ' data-hires-src="' + hiResImage + '" alt="' + escapedAlt + '" loading="' + loading + '" decoding="async"' + fetchPriority + '><div class="slide-vignette" aria-hidden="true"></div><span class="slide-index-badge" aria-hidden="true">' + String(item.index).padStart(2, "0") + '</span><div class="slide-accessible">' + item.eyebrow + '。標題：' + item.title + '。講者備註：' + (item.notes || "無") + '</div>';
  for (const itemHotspot of item.hotspots || []) {
    const anchor = document.createElement("a");
    anchor.className = "slide-hotspot slide-hotspot-" + itemHotspot.kind;
    anchor.href = itemHotspot.url;
    anchor.style.left = itemHotspot.x + "%";
    anchor.style.top = itemHotspot.y + "%";
    anchor.style.width = itemHotspot.w + "%";
    anchor.style.height = itemHotspot.h + "%";
    anchor.title = itemHotspot.label + "（點擊開啟）";
    anchor.setAttribute("aria-label", itemHotspot.label + "（點擊開啟）");
    anchor.dataset.url = itemHotspot.url;
    if (itemHotspot.url.startsWith("http")) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    article.append(anchor);
  }
  return article;
}

function updateLinks(item) {
  linkStrip.replaceChildren();
  for (const link of item.links || []) {
    const a = document.createElement("a");
    a.className = "resource-link";
    a.href = link.url;
    a.target = link.url.startsWith("http") ? "_blank" : "_self";
    a.rel = "noopener noreferrer";
    a.textContent = link.label + " ↗";
    linkStrip.append(a);
  }
}

function animateIn(article, direction) {
  stopArticleMotion(article);
  if (reducedMotion) {
    return;
  }
  const isDarkDeck = document.body.classList.contains("theme-afternoon");
  const distance = isDarkDeck ? 14 : 28;
  const duration = isDarkDeck ? 0.34 : 0.52;
  const initialScale = isDarkDeck ? 1 : 0.992;
  if (window.gsap) {
    window.gsap.fromTo(article, { opacity: 0, x: direction * distance, scale: initialScale }, { opacity: 1, x: 0, scale: 1, duration, ease: "power3.out", clearProps: "transform,opacity" });
    const art = article.querySelector(".slide-art");
    if (!isDarkDeck) window.gsap.fromTo(art, { scale: 1.02 }, { scale: 1, duration: 1.15, ease: "power2.out", clearProps: "transform" });
  } else {
    article.animate([{ opacity: 0, transform: "translateX(" + (direction * distance) + "px) scale(" + initialScale + ")" }, { opacity: 1, transform: "none" }], { duration: duration * 1000, easing: "cubic-bezier(.16,1,.3,1)", fill: "none" });
  }
}

function stopArticleMotion(article) {
  if (!article) return;
  if (window.gsap) {
    window.gsap.killTweensOf(article);
    const art = article.querySelector(".slide-art");
    if (art) window.gsap.killTweensOf(art);
  }
  article.getAnimations?.().forEach((animation) => animation.cancel());
  article.querySelector(".slide-art")?.getAnimations?.().forEach((animation) => animation.cancel());
  article.style.removeProperty("opacity");
  article.style.removeProperty("transform");
}

function updateNotes(item) {
  notesTitle.textContent = String(item.index).padStart(2, "0") + "｜" + item.title;
  notesBody.textContent = item.notes || "此頁沒有額外講者備註。";
  readingTitle.textContent = String(item.index).padStart(2, "0") + "｜" + item.title;
  readingSection.textContent = item.section || data.session;
  readingBody.textContent = item.text || item.notes || item.title;
}

function updateOverviewCurrent() {
  overviewGrid.querySelectorAll(".overview-card").forEach((card, index) => card.classList.toggle("is-current", index === activeIndex));
}

function show(index, direction = 1, updateHash = true) {
  const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
  const previous = stage.querySelector(".is-active");
  if (previous) {
    stopArticleMotion(previous);
    previous.classList.remove("is-active");
  }
  const current = stage.children[nextIndex];
  if (!current) return;
  current.classList.add("is-active");
  ensureSlideImage(current);
  activeIndex = nextIndex;
  animateIn(current, direction);
  const item = slides[nextIndex];
  currentLabel.textContent = String(item.index);
  sectionLabel.textContent = item.section;
  progressBar.style.width = (((nextIndex + 1) / slides.length) * 100) + "%";
  document.title = String(item.index).padStart(2, "0") + "｜" + item.title + "｜" + data.title;
  updateLinks(item);
  updateNotes(item);
  updateOverviewCurrent();
  if (document.body.classList.contains("is-immersive")) enableHiResImage(current);
  else scheduleHiResImage(current);
  if (updateHash) history.replaceState(null, "", "#slide-" + item.index);
}

function go(delta) {
  show(activeIndex + delta, delta >= 0 ? 1 : -1);
}

function openOverview() {
  overview.hidden = false;
  updateOverviewCurrent();
  document.body.classList.add("overview-open");
}
function closeOverview() { overview.hidden = true; document.body.classList.remove("overview-open"); }
function toggleNotes(force) { notesPanel.hidden = typeof force === "boolean" ? !force : !notesPanel.hidden; }
function toggleReading(force) { readingPanel.hidden = typeof force === "boolean" ? !force : !readingPanel.hidden; }
function nativeFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}
let fullscreenLayoutTimers = [];
function clearFullscreenLayoutTimers() {
  fullscreenLayoutTimers.forEach((timer) => window.clearTimeout(timer));
  fullscreenLayoutTimers = [];
}
function applyFullscreenLayout(active) {
  const stageWrap = document.querySelector(".deck-stage-wrap");
  const deckMain = document.querySelector(".deck-main");
  if (!stageWrap) return;
  if (!active) {
    stageWrap.style.removeProperty("width");
    stageWrap.style.removeProperty("height");
    stageWrap.style.removeProperty("max-width");
    deckMain?.style.removeProperty("width");
    deckMain?.style.removeProperty("min-height");
    deckMain?.style.removeProperty("height");
    return;
  }
  const visualWidth = window.visualViewport?.width || 0;
  const visualHeight = window.visualViewport?.height || 0;
  const viewportWidth = Math.max(1, Math.round(visualWidth || window.innerWidth || document.documentElement.clientWidth));
  const viewportHeight = Math.max(1, Math.round(visualHeight || window.innerHeight || document.documentElement.clientHeight));
  const width = Math.min(viewportWidth, viewportHeight * 16 / 9);
  if (deckMain) {
    deckMain.style.width = viewportWidth + "px";
    deckMain.style.minHeight = viewportHeight + "px";
    deckMain.style.height = viewportHeight + "px";
  }
  stageWrap.style.width = Math.round(width) + "px";
  stageWrap.style.height = Math.round(width * 9 / 16) + "px";
  stageWrap.style.maxWidth = viewportWidth + "px";
  void stageWrap.offsetWidth;
}
function scheduleFullscreenLayout(active) {
  clearFullscreenLayoutTimers();
  applyFullscreenLayout(active);
  if (!active) return;
  [50, 180, 420, 800, 1200].forEach((delay) => {
    fullscreenLayoutTimers.push(window.setTimeout(() => applyFullscreenLayout(true), delay));
  });
}
function syncFullscreenUi(active) {
  document.body.classList.toggle("is-immersive", active);
  fullscreenButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(active));
    const label = button.querySelector(".toolbar-action-label");
    const icon = button.querySelector(".toolbar-action-icon");
    if (label) label.textContent = active ? "退出全螢幕" : "全螢幕";
    if (icon) icon.textContent = active ? "×" : "⛶";
    button.setAttribute("aria-label", active ? "退出全螢幕" : "進入全螢幕");
    button.title = active ? "退出全螢幕（F）" : "全螢幕（F）";
  });
  if (immersiveExit) immersiveExit.hidden = !active;
  scheduleFullscreenLayout(active);
  if (active) scheduleHiResImage(stage.querySelector(".is-active"), 160);
}
async function leaveNativeFullscreen() {
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  if (!exit) return false;
  try {
    await exit.call(document);
    return true;
  } catch {
    return false;
  }
}
async function enterNativeFullscreen() {
  const root = document.documentElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;
  if (!request) return false;
  try {
    await request.call(root, { navigationUI: "hide" });
    return true;
  } catch {
    try {
      await request.call(root);
      return true;
    } catch {
      return false;
    }
  }
}
async function toggleFullscreen() {
  if (nativeFullscreenElement()) {
    await leaveNativeFullscreen();
    if (!nativeFullscreenElement()) {
      document.body.dataset.fullscreenMode = "";
      syncFullscreenUi(false);
    }
    return;
  }
  if (document.body.classList.contains("is-immersive")) {
    document.body.dataset.fullscreenMode = "";
    syncFullscreenUi(false);
    return;
  }
  document.body.dataset.fullscreenMode = "pending";
  // 先立即切換成沉浸式滿版，再等待瀏覽器原生 Fullscreen API 完成。
  // 部分桌機瀏覽器第一次請求會延遲觸發 fullscreenchange；若此時仍顯示一般工具列，
  // 使用者會誤以為按鈕沒有作用。原生全螢幕成功後再由事件同步狀態即可。
  syncFullscreenUi(true);
  const entered = await enterNativeFullscreen();
  // iOS Safari and embedded browsers may not expose Fullscreen API. Keep a usable
  // touch-friendly immersive mode instead of making the button appear unresponsive.
  document.body.dataset.fullscreenMode = entered ? "native" : "immersive";
  syncFullscreenUi(true);
}

slides.forEach((item) => stage.append(createSlide(item)));
slides.forEach((item, index) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "overview-card";
  const hiResImage = item.image.replace(/\.png$/i, "@2k.png");
  card.innerHTML = '<img src="' + item.image + '" srcset="' + item.image + ' 1280w, ' + hiResImage + ' 2560w" sizes="320px" alt="第 ' + item.index + ' 頁：' + item.title + '" loading="lazy" decoding="async"><span><b>' + String(item.index).padStart(2, "0") + '</b> · ' + item.title + '</span>';
  card.addEventListener("click", () => { closeOverview(); show(index, index >= activeIndex ? 1 : -1); });
  overviewGrid.append(card);
});

document.querySelectorAll("[data-nav]").forEach((button) => button.addEventListener("click", () => go(button.dataset.nav === "next" ? 1 : -1)));
stage.addEventListener("click", (event) => {
  if (event.target.closest(".slide-hotspot")) return;
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const edge = rect.width * 0.18;
  if (x <= edge) go(-1);
  else if (x >= rect.width - edge) go(1);
});
document.querySelectorAll("[data-action=overview],[data-action=overview-close]").forEach((button) => button.addEventListener("click", () => overview.hidden ? openOverview() : closeOverview()));
document.querySelectorAll("[data-action=notes]").forEach((button) => button.addEventListener("click", () => toggleNotes()));
document.querySelectorAll("[data-action=notes-close]").forEach((button) => button.addEventListener("click", () => toggleNotes(false)));
document.querySelectorAll("[data-action=reading]").forEach((button) => button.addEventListener("click", () => toggleReading()));
document.querySelectorAll("[data-action=reading-close]").forEach((button) => button.addEventListener("click", () => toggleReading(false)));
fullscreenButtons.forEach((button) => button.addEventListener("click", toggleFullscreen));
const onFullscreenChange = () => {
  const native = Boolean(nativeFullscreenElement());
  const mode = document.body.dataset.fullscreenMode || "";
  if (!native && mode === "native") {
    document.body.dataset.fullscreenMode = "";
    syncFullscreenUi(false);
    return;
  }
  if (native) document.body.dataset.fullscreenMode = "native";
  syncFullscreenUi(native || mode === "immersive" || mode === "pending");
};
document.addEventListener("fullscreenchange", onFullscreenChange);
document.addEventListener("webkitfullscreenchange", onFullscreenChange);
const handleFullscreenViewportResize = () => {
  if (nativeFullscreenElement() || document.body.classList.contains("is-immersive")) scheduleFullscreenLayout(true);
};
window.addEventListener("resize", handleFullscreenViewportResize);
window.addEventListener("orientationchange", handleFullscreenViewportResize);
window.visualViewport?.addEventListener("resize", handleFullscreenViewportResize);

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input,textarea,select")) return;
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") { event.preventDefault(); go(1); }
  if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); go(-1); }
  if (event.key === "Home") { event.preventDefault(); show(0, -1); }
  if (event.key === "End") { event.preventDefault(); show(slides.length - 1, 1); }
  if (event.key.toLowerCase() === "o") { event.preventDefault(); overview.hidden ? openOverview() : closeOverview(); }
  if (event.key.toLowerCase() === "n") { event.preventDefault(); toggleNotes(); }
  if (event.key.toLowerCase() === "t") { event.preventDefault(); toggleReading(); }
  if (event.key.toLowerCase() === "f") { event.preventDefault(); toggleFullscreen(); }
  if (event.key === "Escape") {
    if (!overview.hidden) closeOverview();
    if (!readingPanel.hidden) toggleReading(false);
    if (!notesPanel.hidden) toggleNotes(false);
    if (document.body.classList.contains("is-immersive") && !nativeFullscreenElement()) syncFullscreenUi(false);
  }
});

stage.addEventListener("touchstart", (event) => { const touch = event.changedTouches[0]; touchStartX = touch.clientX; touchStartY = touch.clientY; }, { passive: true });
stage.addEventListener("touchend", (event) => { if (touchStartX === null) return; const touch = event.changedTouches[0]; const dx = touch.clientX - touchStartX; const dy = touch.clientY - touchStartY; if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1); touchStartX = null; touchStartY = null; }, { passive: true });

const hashMatch = location.hash.match(/slide-(\d+)/);
window.scrollTo(0, 0);
show(hashMatch ? Number(hashMatch[1]) - 1 : 0, 1, false);
stage.focus({ preventScroll: true });
