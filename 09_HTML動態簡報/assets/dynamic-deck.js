const data = window.DYNAMIC_DECK_DATA;
const stage = document.getElementById("dynamic-stage");
const body = document.body;
const SLIDE_DURATION = 8;
const enterEases = ["power3.out", "sine.out", "back.out(1.25)", "expo.out", "power2.out"];
const blockEases = ["power2.out", "sine.out", "circ.out", "back.out(1.12)"];

if (!data || !stage) {
  document.body.innerHTML = '<main style="padding:40px;font-family:system-ui">HTML 動態簡報資料載入失敗。</main>';
  throw new Error("Dynamic deck data or stage is missing");
}

const slides = data.slides || [];
const deckKey = data.deck || body.dataset.deck || "dynamic";
const isHyperFrames = Boolean(window.__hyperframes);
if (isHyperFrames) document.documentElement.classList.add("hyperframes-mode");
else body.classList.add("interactive-mode");

const progressBar = document.getElementById("progress-bar");
const currentLabel = document.getElementById("slide-current");
const totalLabel = document.getElementById("slide-total");
const sectionLabel = document.getElementById("slide-section");
const notesPanel = document.getElementById("notes-panel");
const notesTitle = document.getElementById("notes-title");
const notesBody = document.getElementById("notes-body");
const readingPanel = document.getElementById("reading-panel");
const readingTitle = document.getElementById("reading-title");
const readingBody = document.getElementById("reading-body");
const overviewPanel = document.getElementById("overview-panel");
const overviewGrid = document.getElementById("overview-grid");
const immersiveExit = document.querySelector(".immersive-exit");
let activeIndex = 0;
let touchStartX = 0;
let previousRemovalTimer = 0;
let interactiveSceneTimeline = null;
const reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slideTitle(item) {
  return String(item.title || `第 ${item.index} 頁`).trim();
}

function displayTitle(item) {
  const raw = slideTitle(item);
  if (raw.length <= 100) return raw;
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const heading = lines.find((line) => /^#{1,6}\s+/.test(line))?.replace(/^#{1,6}\s+/, "")
    || lines.find((line) => !/^(---|name\s*:|description\s*:)/i.test(line))
    || raw;
  return heading.length > 100 ? `${heading.slice(0, 97)}…` : heading;
}

function splitTitleLines(item) {
  return slideTitle(item).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function cleanBodyBlocks(item) {
  const ignored = new Set([
    ...splitTitleLines(item),
    String(item.eyebrow || "").trim(),
    String(item.section || "").trim(),
    String(item.session || "").trim(),
    String(item.index),
    String(item.index).padStart(2, "0"),
  ]);
  const rawBlocks = String(item.text || "").split(/\n\s*\n/);
  const blocks = [];
  for (const raw of rawBlocks) {
    const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).filter((line) => {
      if (ignored.has(line)) return false;
      if (/^(上午|下午)場[｜|]/.test(line)) return false;
      if (/^https?:\/\//i.test(line) || /^\.\.\//.test(line)) return false;
      return true;
    });
    if (lines.length) blocks.push(lines.join("\n"));
  }
  if (!blocks.length) return [String(item.description || item.text || "此頁沒有額外文字。").split(/\n\s*\n/)[0]];
  return blocks;
}

function parseStructuredStepPanels(item) {
  const ignored = new Set([
    ...splitTitleLines(item),
    String(item.eyebrow || "").trim(),
    String(item.section || "").trim(),
    String(item.session || "").trim(),
    String(item.index),
    String(item.index).padStart(2, "0"),
  ]);
  const lines = String(item.text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    .filter((line) => {
      if (ignored.has(line)) return false;
      if (/^(上午|下午)場[｜|]/.test(line)) return false;
      if (/^https?:\/\//i.test(line) || /^\.\.\//.test(line)) return false;
      return true;
    });
  const steps = [];
  const checks = [];
  let section = "";
  let minutes = "";
  let linksStarted = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (linksStarted) continue;
    if (line.includes("↗")) {
      linksStarted = true;
      continue;
    }
    if (line === "操作步驟") {
      section = "steps";
      continue;
    }
    if (line === "完成條件") {
      section = "checks";
      continue;
    }
    if (/^\d{1,3}$/.test(line) && lines[index + 1] === "分鐘") {
      minutes = `${line} 分鐘`;
      index += 1;
      continue;
    }
    if (section === "steps" && /^\d+$/.test(line)) {
      const parts = [];
      for (index += 1; index < lines.length; index += 1) {
        const next = lines[index];
        if (next === "操作步驟" || next === "完成條件" || /^\d+$/.test(next) || /^✓/.test(next) || next.includes("↗")) {
          index -= 1;
          break;
        }
        if (next !== "→") parts.push(next);
      }
      if (parts.length) steps.push(parts.join(" "));
      continue;
    }
    if (section === "checks" && /^✓/.test(line)) {
      const parts = [line.replace(/^✓\s*/, "")];
      for (index += 1; index < lines.length; index += 1) {
        const next = lines[index];
        if (/^✓/.test(next) || next.includes("↗")) {
          index -= 1;
          break;
        }
        parts.push(next);
      }
      if (parts.length) checks.push(parts.join(" "));
    }
  }

  if (!steps.length && !checks.length) return null;
  return { minutes, steps, checks };
}

function renderStructuredStepPanels(structured) {
  const renderPanel = (kind, title, items, minutes = "") => {
    const listTag = kind === "steps" ? "ol" : "ul";
    const listItems = items.map((item) => `<li><span>${escapeHtml(item)}</span></li>`).join("");
    return `<section class="content-block content-block--${kind}" aria-label="${escapeHtml(title)}">
      <div class="content-block-heading"><span class="content-block-kicker">${escapeHtml(title)}</span>${minutes ? `<span class="content-block-meta">${escapeHtml(minutes)}</span>` : ""}</div>
      <${listTag} class="content-list content-list--${kind}">${listItems}</${listTag}>
    </section>`;
  };
  return [
    structured.steps.length ? renderPanel("steps", "操作步驟", structured.steps, structured.minutes) : "",
    structured.checks.length ? renderPanel("checks", "完成條件", structured.checks) : "",
  ].join("");
}

function layoutFor(item, blocks) {
  const haystack = `${slideTitle(item)}\n${item.text || ""}`;
  if (Number(item.index) === 1) return "hero";
  if (/休息|結語|資源書籤|謝謝|再見/.test(haystack) || blocks.length <= 1) return "quote";
  if (/流程|步驟|成果|規則|弧線|RUN OF SHOW|LEARNING OUTCOMES|PUBLISH PATH|操作步驟|四道門/.test(haystack)) return "steps";
  return Number(item.index) % 3 === 0 ? "data" : "editorial";
}

function compactDescription(item) {
  const source = String(item.description || item.notes || "").split(/\n\s*\n/)[0].trim();
  if (!source) return "HTML 原生場景：標題、正文、備註與連結都可獨立編排。";
  return source.length > 220 ? `${source.slice(0, 217)}…` : source;
}

function renderLinks(links) {
  return (links || []).map((link) => {
    const external = /^https?:\/\//i.test(link.url || "");
    return `<a class="scene-link" href="${escapeHtml(link.url)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(link.label)} ↗</a>`;
  }).join("");
}

function createSlide(item, index) {
  const blocks = cleanBodyBlocks(item);
  const layout = layoutFor(item, blocks);
  const structured = layout === "steps" ? parseStructuredStepPanels(item) : null;
  const blockMarkup = structured
    ? renderStructuredStepPanels(structured)
    : blocks.map((block) => `<div class="content-block"><p>${escapeHtml(block)}</p></div>`).join("");
  const safeTitle = escapeHtml(displayTitle(item));
  const total = String(slides.length).padStart(2, "0");
  const current = String(item.index).padStart(2, "0");
  const article = document.createElement("article");
  article.id = `slide-${item.index}`;
  article.className = `dynamic-slide layout-${layout}`;
  article.dataset.start = String(index * SLIDE_DURATION);
  article.dataset.duration = String(SLIDE_DURATION);
  article.dataset.trackIndex = "0";
  article.dataset.transition = index === 0 ? "hero-reveal" : (index % 4 === 0 ? "zoom-through" : "blur-crossfade");
  article.setAttribute("aria-label", `${item.index}. ${displayTitle(item)}`);
  article.setAttribute("aria-hidden", "true");
  article.innerHTML = `
    <div class="scene-backdrop" aria-hidden="true"><span class="scene-orb"></span></div>
    <div class="scene-transition" aria-hidden="true"></div>
    <div class="scene-content">
      <header class="scene-header"><span class="scene-kicker">${escapeHtml(item.eyebrow || data.session || "HTML NATIVE")}</span><span class="scene-counter">${current} / ${total}</span></header>
      <div class="scene-grid">
        <div class="scene-copy">
          <p class="scene-label">${escapeHtml(item.session || data.session || "WORKSHOP")}</p>
          <h1>${safeTitle}</h1>
          <p class="scene-description">${escapeHtml(compactDescription(item))}</p>
          <div class="scene-rail"><span>SECTION</span><strong>${escapeHtml(item.section || "工作坊場景")}</strong></div>
        </div>
        <div class="scene-body">${blockMarkup}</div>
      </div>
      <div class="scene-footer">${renderLinks(item.links)}</div>
      <details class="scene-transcript"><summary>展開完整文字</summary><p>${escapeHtml(item.text || item.description || "")}</p></details>
    </div>`;
  return article;
}

function renderSlides() {
  const fragment = document.createDocumentFragment();
  slides.forEach((item, index) => fragment.append(createSlide(item, index)));
  stage.replaceChildren(fragment);
  if (totalLabel) totalLabel.textContent = String(slides.length);
}

function renderOverview() {
  if (!overviewGrid) return;
  const fragment = document.createDocumentFragment();
  slides.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "overview-card";
    card.dataset.index = String(index);
    card.innerHTML = `<b>${String(item.index).padStart(2, "0")}</b><strong>${escapeHtml(displayTitle(item))}</strong><small>${escapeHtml(item.section || data.session || "")}</small>`;
    card.addEventListener("click", () => { closeOverview(); show(index, index >= activeIndex ? 1 : -1); });
    fragment.append(card);
  });
  overviewGrid.replaceChildren(fragment);
}

function updatePanels(item) {
  if (notesTitle) notesTitle.textContent = `${String(item.index).padStart(2, "0")}｜${displayTitle(item)}`;
  if (notesBody) notesBody.textContent = item.notes || "此頁沒有額外講者備註。";
  if (readingTitle) readingTitle.textContent = `${String(item.index).padStart(2, "0")}｜${displayTitle(item)}`;
  if (readingBody) readingBody.textContent = item.text || item.notes || item.description || slideTitle(item);
}

function updateOverviewCurrent() {
  overviewGrid?.querySelectorAll(".overview-card").forEach((card, index) => card.classList.toggle("is-current", index === activeIndex));
}

const sceneScrollSelector = ".scene-content, .scene-copy, .scene-body, .scene-transcript p";

function resetSceneScroll(scene) {
  scene?.querySelectorAll(sceneScrollSelector).forEach((element) => {
    element.scrollTop = 0;
    element.scrollLeft = 0;
  });
}

function syncSceneOverflowState(scene) {
  scene?.querySelectorAll(".scene-copy").forEach((copy) => {
    const copyRect = copy.getBoundingClientRect();
    const childEscapesTop = [...copy.children].some((element) => element.getBoundingClientRect().top < copyRect.top - 1);
    copy.classList.toggle("is-overflowing", copy.scrollHeight > copy.clientHeight + 1 || childEscapesTop);
  });
}

function prepareScene(scene) {
  resetSceneScroll(scene);
  syncSceneOverflowState(scene);
}

function clearPreviousSlides() {
  const active = stage.querySelector(".dynamic-slide.is-active");
  stage.querySelectorAll(".dynamic-slide.is-previous").forEach((slide) => {
    if (slide === active) return;
    slide.classList.remove("is-previous");
    slide.setAttribute("aria-hidden", "true");
  });
}

function clearInteractiveSceneState(scene) {
  if (!scene) return;
  if (window.gsap) {
    window.gsap.set(scene.querySelectorAll(".scene-content, .scene-header, .scene-copy, .scene-body, .scene-rail, .scene-transition, .content-block, .scene-link, .scene-orb"), { clearProps: "all" });
  }
  scene.querySelectorAll(".scene-transition").forEach((element) => {
    element.style.opacity = "0";
  });
}

function animateInteractiveScene(scene, direction = 1) {
  if (isHyperFrames || !window.gsap || !scene) return;
  interactiveSceneTimeline?.kill();
  clearInteractiveSceneState(scene);
  if (reduceMotion || document.documentElement.dataset.qaStaticLayout === "true") return;

  const mode = scene.dataset.transition || "blur-crossfade";
  const directionSign = direction >= 0 ? 1 : -1;
  const content = scene.querySelector(".scene-content");
  const header = scene.querySelector(".scene-header");
  const copy = scene.querySelector(".scene-copy");
  const sceneBody = scene.querySelector(".scene-body");
  const rail = scene.querySelector(".scene-rail");
  const transition = scene.querySelector(".scene-transition");
  const blocks = [...scene.querySelectorAll(".content-block")];
  const links = [...scene.querySelectorAll(".scene-link")];
  const orb = scene.querySelector(".scene-orb");
  const zoom = mode === "zoom-through";
  const contentFrom = zoom ? { opacity: 0, y: 18, scale: .94 } : { opacity: 0, y: 34, scale: 1 };
  const copyFrom = zoom ? { opacity: 0, y: 18 } : { opacity: 0, x: -42 * directionSign };
  const bodyFrom = zoom ? { opacity: 0, y: 22, scale: .97 } : { opacity: 0, x: 42 * directionSign };
  const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

  if (content) tl.fromTo(content, contentFrom, { opacity: 1, y: 0, scale: 1, duration: .62, ease: zoom ? "expo.out" : "power3.out" }, .08);
  if (header) tl.fromTo(header, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: .34, ease: "sine.out" }, .12);
  if (copy) tl.fromTo(copy, copyFrom, { opacity: 1, x: 0, y: 0, duration: .58, ease: directionSign > 0 ? "power3.out" : "expo.out" }, .16);
  if (sceneBody) tl.fromTo(sceneBody, bodyFrom, { opacity: 1, x: 0, y: 0, scale: 1, duration: .54, ease: "power2.out" }, .2);
  if (transition) {
    tl.fromTo(transition, { opacity: 0, scale: 1.18 }, { opacity: .62, scale: 1, duration: .44, ease: "power2.out" }, .04);
    tl.to(transition, { opacity: 0, duration: .48, ease: "sine.inOut" }, .38);
  }
  if (rail) tl.fromTo(rail, { opacity: 0, scaleX: .18, transformOrigin: "left center" }, { opacity: 1, scaleX: 1, duration: .42, ease: "expo.out" }, .4);
  if (blocks.length) {
    tl.fromTo(blocks, { opacity: 0, y: 22, scale: .985 }, { opacity: 1, y: 0, scale: 1, duration: .46, ease: "back.out(1.12)", stagger: { each: .065, from: directionSign > 0 ? "start" : "end" } }, .34);
  }
  if (links.length) {
    tl.fromTo(links, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.1)", stagger: .05 }, .58);
  }
  if (orb) tl.fromTo(orb, { opacity: 0, scale: .82, rotation: directionSign > 0 ? -22 : 18 }, { opacity: .72, scale: 1, rotation: directionSign > 0 ? 8 : -12, duration: 1.05, ease: "sine.out" }, .05);
  interactiveSceneTimeline = tl;
}

function show(index, direction = 1, updateHash = true) {
  const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
  const current = stage.children[nextIndex];
  if (!current) return;
  window.clearTimeout(previousRemovalTimer);
  previousRemovalTimer = 0;
  clearPreviousSlides();
  const previous = stage.querySelector(".is-active");
  if (previous && previous !== current) {
    resetSceneScroll(previous);
    if (!isHyperFrames) clearInteractiveSceneState(previous);
    previous.classList.remove("is-active");
    previous.classList.add("is-previous");
    previousRemovalTimer = window.setTimeout(() => {
      previous.classList.remove("is-previous");
      if (previous !== stage.querySelector(".is-active")) previous.setAttribute("aria-hidden", "true");
      previousRemovalTimer = 0;
    }, 720);
  }
  current.classList.remove("is-previous");
  current.classList.add("is-active");
  current.setAttribute("aria-hidden", "false");
  if (previous && previous !== current) previous.setAttribute("aria-hidden", "true");
  activeIndex = nextIndex;
  const item = slides[nextIndex];
  if (currentLabel) currentLabel.textContent = String(item.index);
  if (sectionLabel) sectionLabel.textContent = item.section || data.session || "HTML 動態簡報";
  if (progressBar) progressBar.style.width = `${((nextIndex + 1) / slides.length) * 100}%`;
  document.title = `${String(item.index).padStart(2, "0")}｜${displayTitle(item)}｜${data.title || "HTML 動態簡報"}`;
  updatePanels(item);
  updateOverviewCurrent();
  if (updateHash) history.replaceState(null, "", `#slide-${item.index}`);
  stage.scrollTop = 0;
  stage.scrollLeft = 0;
  prepareScene(current);
  stage.dataset.direction = direction > 0 ? "next" : "prev";
  animateInteractiveScene(current, direction);
}

function go(delta) { show(activeIndex + delta, delta >= 0 ? 1 : -1); }
function openOverview() { if (overviewPanel) overviewPanel.hidden = false; body.classList.add("overview-open"); updateOverviewCurrent(); }
function closeOverview() { if (overviewPanel) overviewPanel.hidden = true; body.classList.remove("overview-open"); }
function togglePanel(panel, force) { if (panel) panel.hidden = typeof force === "boolean" ? !force : !panel.hidden; }

function nativeFullscreenElement() { return document.fullscreenElement || document.webkitFullscreenElement; }
async function toggleFullscreen() {
  if (nativeFullscreenElement()) {
    await (document.exitFullscreen?.() || document.webkitExitFullscreen?.());
    return;
  }
  if (body.classList.contains("is-immersive")) {
    body.classList.remove("is-immersive");
    syncFullscreenUi(false);
    return;
  }
  try {
    if (stage.requestFullscreen) await stage.requestFullscreen();
    else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
    else throw new Error("Fullscreen API unavailable");
  } catch {
    body.classList.add("is-immersive");
    syncFullscreenUi(true);
  }
}
function syncFullscreenUi(entered = Boolean(nativeFullscreenElement()) || body.classList.contains("is-immersive")) {
  body.classList.toggle("is-immersive", entered && !nativeFullscreenElement());
  if (immersiveExit) immersiveExit.hidden = !entered;
}

function registerHyperFramesTimeline() {
  if (!window.gsap) return null;
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  slides.forEach((item, index) => {
    const scene = stage.children[index];
    const t = index * SLIDE_DURATION;
    const content = scene.querySelector(".scene-content");
    const header = scene.querySelector(".scene-header");
    const copy = scene.querySelector(".scene-copy");
    const sceneBody = scene.querySelector(".scene-body");
    const rail = scene.querySelector(".scene-rail");
    const orb = scene.querySelector(".scene-orb");
    const transition = scene.querySelector(".scene-transition");
    const blocks = [...scene.querySelectorAll(".content-block")];
    const links = [...scene.querySelectorAll(".scene-link")];
    const directionSign = index % 2 === 0 ? 1 : -1;
    const zoom = scene.dataset.transition === "zoom-through";
    tl.fromTo(content, zoom ? { opacity: 0, y: 18, scale: .94 } : { opacity: 0, y: 42, scale: 1 }, { opacity: 1, y: 0, scale: 1, duration: .72, ease: enterEases[index % enterEases.length] }, t + .2);
    if (header) tl.fromTo(header, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: .38, ease: "sine.out" }, t + .24);
    if (copy) tl.fromTo(copy, zoom ? { opacity: 0, y: 18 } : { opacity: 0, x: -38 * directionSign }, { opacity: 1, x: 0, y: 0, duration: .62, ease: index % 2 ? "expo.out" : "power3.out" }, t + .28);
    if (sceneBody) tl.fromTo(sceneBody, zoom ? { opacity: 0, y: 20, scale: .97 } : { opacity: 0, x: 38 * directionSign }, { opacity: 1, x: 0, y: 0, scale: 1, duration: .56, ease: "power2.out" }, t + .3);
    tl.fromTo(transition, { opacity: 0, scale: 1.14 }, { opacity: .7, scale: 1, duration: .55, ease: "power2.out" }, t + .08);
    tl.to(transition, { opacity: 0, duration: .5, ease: "sine.inOut" }, t + .76);
    if (rail) tl.fromTo(rail, { opacity: 0, scaleX: .18, transformOrigin: "left center" }, { opacity: 1, scaleX: 1, duration: .46, ease: "expo.out" }, t + .38);
    blocks.forEach((block, blockIndex) => {
      tl.fromTo(block, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .42, ease: blockEases[(index + blockIndex) % blockEases.length] }, t + .48 + Math.min(blockIndex * .07, .42));
    });
    if (links.length) tl.fromTo(links, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.1)", stagger: .05 }, t + .62);
    if (orb) tl.to(orb, { scale: 1.08, rotation: index % 2 ? -8 : 8, duration: SLIDE_DURATION - .8, ease: "sine.inOut" }, t + .32);
  });
  window.__timelines[stage.dataset.compositionId] = tl;
  return tl;
}

function revealInteractiveSceneState() {
  if (isHyperFrames) return;
  interactiveSceneTimeline?.kill();
  clearInteractiveSceneState(stage);
  stage.querySelectorAll(".scene-transition").forEach((element) => {
    element.style.opacity = "0";
  });
}

function readHash() {
  const match = window.location.hash.match(/slide-(\d+)/i);
  if (!match) return 0;
  const wanted = slides.findIndex((item) => Number(item.index) === Number(match[1]));
  return wanted >= 0 ? wanted : 0;
}

renderSlides();
renderOverview();
const deckTimeline = registerHyperFramesTimeline();
if (!isHyperFrames) deckTimeline?.progress(1);
revealInteractiveSceneState();
show(readHash(), 1, false);

document.querySelectorAll("[data-nav=prev]").forEach((button) => button.addEventListener("click", () => go(-1)));
document.querySelectorAll("[data-nav=next]").forEach((button) => button.addEventListener("click", () => go(1)));
document.querySelectorAll("[data-action=overview]").forEach((button) => button.addEventListener("click", openOverview));
document.querySelectorAll("[data-action=overview-close]").forEach((button) => button.addEventListener("click", closeOverview));
document.querySelectorAll("[data-action=notes]").forEach((button) => button.addEventListener("click", () => togglePanel(notesPanel)));
document.querySelectorAll("[data-action=notes-close]").forEach((button) => button.addEventListener("click", () => togglePanel(notesPanel, false)));
document.querySelectorAll("[data-action=reading]").forEach((button) => button.addEventListener("click", () => togglePanel(readingPanel)));
document.querySelectorAll("[data-action=reading-close]").forEach((button) => button.addEventListener("click", () => togglePanel(readingPanel, false)));
document.querySelectorAll("[data-action=fullscreen]").forEach((button) => button.addEventListener("click", toggleFullscreen));
document.addEventListener("fullscreenchange", () => syncFullscreenUi());
document.addEventListener("webkitfullscreenchange", () => syncFullscreenUi());
document.addEventListener("keydown", (event) => {
  if (event.target.matches("input,textarea,select")) return;
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") { event.preventDefault(); go(1); }
  if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); go(-1); }
  if (event.key === "Home") { event.preventDefault(); show(0, -1); }
  if (event.key === "End") { event.preventDefault(); show(slides.length - 1, 1); }
  if (event.key.toLowerCase() === "o") { event.preventDefault(); overviewPanel?.hidden ? openOverview() : closeOverview(); }
  if (event.key.toLowerCase() === "n") { event.preventDefault(); togglePanel(notesPanel); }
  if (event.key.toLowerCase() === "t") { event.preventDefault(); togglePanel(readingPanel); }
  if (event.key.toLowerCase() === "f") { event.preventDefault(); toggleFullscreen(); }
  if (event.key === "Escape") { closeOverview(); togglePanel(notesPanel, false); togglePanel(readingPanel, false); }
});
stage.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
stage.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 48) go(delta < 0 ? 1 : -1);
}, { passive: true });
window.addEventListener("hashchange", () => show(readHash(), 1, false));
window.addEventListener("pageshow", () => prepareScene(stage.querySelector(".is-active")));
let resizeTimer = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => prepareScene(stage.querySelector(".is-active")), 80);
});
