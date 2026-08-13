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
const slides = data.slides;
let activeIndex = 0;
let touchStartX = null;
let touchStartY = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  article.innerHTML = '<img class="slide-art" src="' + item.image + '" alt="' + escapedAlt + '" loading="' + (item.index <= 2 ? "eager" : "lazy") + '"><div class="slide-vignette" aria-hidden="true"></div><span class="slide-index-badge" aria-hidden="true">' + String(item.index).padStart(2, "0") + '</span><div class="slide-accessible">' + item.eyebrow + '。標題：' + item.title + '。講者備註：' + (item.notes || "無") + '</div>';
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
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

slides.forEach((item) => stage.append(createSlide(item)));
slides.forEach((item, index) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "overview-card";
  card.innerHTML = '<img src="' + item.image + '" alt="第 ' + item.index + ' 頁：' + item.title + '" loading="lazy"><span><b>' + String(item.index).padStart(2, "0") + '</b> · ' + item.title + '</span>';
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
document.querySelectorAll("[data-action=fullscreen]").forEach((button) => button.addEventListener("click", toggleFullscreen));

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
  }
});

stage.addEventListener("touchstart", (event) => { const touch = event.changedTouches[0]; touchStartX = touch.clientX; touchStartY = touch.clientY; }, { passive: true });
stage.addEventListener("touchend", (event) => { if (touchStartX === null) return; const touch = event.changedTouches[0]; const dx = touch.clientX - touchStartX; const dy = touch.clientY - touchStartY; if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1); touchStartX = null; touchStartY = null; }, { passive: true });

const hashMatch = location.hash.match(/slide-(\d+)/);
window.scrollTo(0, 0);
show(hashMatch ? Number(hashMatch[1]) - 1 : 0, 1, false);
stage.focus({ preventScroll: true });
