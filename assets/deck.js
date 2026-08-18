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

const spotlight = document.getElementById("concept-spotlight");
const spotlightBadge = document.getElementById("spotlight-badge");
const spotlightTitle = document.getElementById("spotlight-title");
const spotlightContent = document.getElementById("spotlight-content");
let spotlightVisible = true;

const CONCEPT_MAP = {
  morning: {
    14: {
      badge: "🛡️ RAG 產線底座",
      title: "RAG（檢索增強生成）打造專屬教學與研究知識庫",
      content: "大模型幻覺的起因是預訓練機率接字補全。本產線將 Gemini Notebook 作為私有 RAG 知識庫，以真實上傳文獻為事實邊界（Grounding Data），先檢索切片再增強生成，從架構層面根治 AI 幻覺。"
    },
    15: {
      badge: "🛡️ RAG 核心公式",
      title: "RAG 檢索增強生成：知識庫錨定架構",
      content: "【真實來源切片】+【向量檢索 (Retrieve)】+【上下文增強 (Augment)】=【零幻覺可驗證生成】。不讓 AI 自由發揮，而是強制在教授提供的文獻庫範圍內推論與引用。"
    },
    16: {
      badge: "🛡️ RAG 防幻覺機制",
      title: "一般對話 vs RAG 資料庫模式：可追查鏈（Audit Trail）",
      content: "一般聊天容易『一本正經胡說八道』；RAG 資料庫模式下，AI 的每一句結論都必須綁定原文引用腳註（In-line Citations）。來源未記載時明確標示『來源無相關資料』，絕不捏造！"
    },
    17: {
      badge: "🛡️ RAG 建庫原則",
      title: "RAG 知識庫 3-2-1 原則：高密度、高相關、少雜訊",
      content: "優質的 RAG 資料庫講求『3 份核心文獻、2 種互補觀點、1 個明確教學/研究目的』。避免塞入海量無關雜訊文件，以確保向量檢索精準度。"
    },
    17: {
      badge: "⚡ Google 最新 Spark",
      title: "Google 生態系新前沿：Gemini Spark 24/7 雲端主動秘書",
      content: "Google 最新推出的 Gemini Spark (Beta) 讓 AI 從『等你提問』進化為『關機也能自主做事』！專為 Google Pro/Ultra 會員打造，全自動深度串聯 Gmail、Drive、Docs、Sheets 與 Calendar 全家桶。使用者只要設定好工作流或定時排程，即使電腦休眠，AI 也會在雲端主動幫教授整理文獻、分類信件、彙整研究進度並提醒重要會議！"
    },
    19: {
      badge: "🛡️ RAG 實戰檢驗",
      title: "RAG 防幻覺邊界測試（Boundary Check）",
      content: "實作防幻覺三部曲：① 檢索事實數據 → ② 跨篇綜合比對 → ③ 故意提問來源未記載的問題，測試系統是否具備誠實拒答的防幻覺邊界。"
    },
    23: {
      badge: "🛡️ Gem 角色固化",
      title: "自訂 Gem：系統提示詞 ＋ RAG 知識庫綁定",
      content: "單純 Prompt 會隨對話輪數增加而發生『角色遺忘』或『幻覺漂移』；自訂 Gem 在系統層鎖定教學方法、評量規準與引用約束，確保輸出始終穩定可靠。"
    },
    27: {
      badge: "🚀 觀念躍升：Gems 不是被淘汰，是該升級！",
      title: "從自訂 Gem 邁向專屬 Agent Skill：讓 Gem 升級成 SKILLS",
      content: "『Gems 不會消失，是該升級成 Skill！』Skill 說穿了就是一份寫給 Agent 看的標準使用說明書（SOP），只要是重複做的流程都能變成技能。結合五層記憶架構：『記憶讓 Agent 知道背景；Skill 讓 Agent 知道方法』，將原本受限於線上純聊天的 Gem（語意記憶），升級為具備檔案讀寫與自主流程的專屬 Skill（程序記憶）！"
    },
    28: {
      badge: "🚀 實戰三部曲 SOP",
      title: "讓 Gem 升級成 SKILLS：備份・升級・分享 完整落地指南",
      content: "① 備份：免費用戶透過 Google Takeout 完整匯出 Gem 系統提示詞與附件；付費用戶由 Spark 自動打包至 Drive → ② 升級：丟 GitHub 套件連結給 Agent 自動盤點＋挑選 11 大能力加值（實例：英文偵錯密碼 Gem 升級為互動闖關網頁）→ ③ 分享：上傳 GitHub repo（.agents/skills/），跨平台換 Agent（Antigravity/Codex/Claude）一鍵安裝，全校共用！"
    }
  },
  afternoon: {
    1: {
      badge: "🎛️ Agent 交往學",
      title: "從 AI 助理走向主動推進任務的 AI Agent",
      content: "Agent 不只是陪你聊天，而是能感知環境、規劃步驟、調度外部工具並交付可驗證成果的數位研究助理。"
    },
    4: {
      badge: "🎛️ Agent Harness 裝具",
      title: "為什麼大語言模型（LLM）本身不是 Agent？",
      content: "LLM 只是運算大腦/引擎（LLM Engine），沒有手腳、無法持久感知環境。Harness（調控裝具 / 控管鞍具）是套在模型外部的控制骨架——如同為火箭引擎配備控制艙、儀表板與安全帶，讓模型在約束邊界內主動做事！"
    },
    5: {
      badge: "🎛️ Harness Engineering",
      title: "Harness Engineering（裝具工程）四大調控支柱",
      content: "① 狀態與記憶管理（Context Management）：過濾雜訊防止 Token 溢出；② 工具與協議調度（Tool Dispatching）：安全調用檔案與命令列；③ 自省評估閉環（Self-Correction Eval Loop）：報錯時自動反思重試；④ 安全沙盒（Sandboxing & Guardrails）：授權隔離與可逆防呆。"
    },
    7: {
      badge: "🎛️ 三大 Agent 調控比較",
      title: "Antigravity vs Codex vs Claude Code 的 Harness 設計差異",
      content: "• Antigravity：Google 開發環境 Harness，具備多模態 Artifacts 即時渲染與自主規劃循環；• Codex：OpenAI 強悍沙盒 Harness，精準掌控終端執行與資料分析；• Claude Code：極致嚴謹的終端 Harness 與上下文壓縮。"
    },
    23: {
      badge: "🎛️ Skill 裝具延伸",
      title: "Agent Skills 的本質：自訂 Harness Extension（承接 Gem 升級）",
      content: "單純的提示詞只是文字建議；Agent Skill 則是透過宣告式 YAML 與命令式工作流程，為 Agent 的 Harness 擴充專屬領域的工具規約與操作 SOP，完整承接上午場「讓 Gem 升級成 SKILLS」的成果！"
    },
    24: {
      badge: "🎛️ 跨 Agent 可攜標準",
      title: "一處定義、三家通用：.agents/skills/ 可攜標準結構",
      content: "遵循 SKILL.md（流程規範）+ scripts/（Python精算）+ references/（參考格式）標準層級，同一份技能可在 Google Antigravity、OpenAI Codex 與 Anthropic Claude Code 之間 100% 無縫共用！"
    },
    26: {
      badge: "🎛️ 11 大加值實戰",
      title: "Agent Skill 11 大加值維度落地實踐",
      content: "透過檔案讀寫（input/output）、確定性精算、DOCX/HTML 直接產出與格式品質驗收器，把原本只能聊天的 Gem 徹底進化為具備生產力的自動化助手。"
    }
  }
};

function updateSpotlight(index) {
  if (!spotlight) return;
  const sessionKey = document.body.classList.contains("theme-morning") ? "morning" : "afternoon";
  const slideNum = index + 1;
  const concept = CONCEPT_MAP[sessionKey]?.[slideNum];
  if (concept && spotlightVisible) {
    spotlightBadge.textContent = concept.badge;
    spotlightTitle.textContent = concept.title;
    spotlightContent.textContent = concept.content;
    spotlight.hidden = false;
  } else {
    spotlight.hidden = true;
  }
}

function toggleSpotlight(force) {
  spotlightVisible = typeof force === "boolean" ? force : !spotlightVisible;
  if (spotlight) {
    if (!spotlightVisible) spotlight.hidden = true;
    else updateSpotlight(activeIndex);
  }
}

let activeIndex = 0;
let touchStartX = null;
let touchStartY = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let hiResTimer = 0;
let transitionCleanTimer = 0;

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
  const source = art?.dataset.slideSrc || art?.src;
  if (!art || !source) return;
  if (!art.src || art.src.includes("data:image")) {
    art.src = source;
  }
  art.dataset.sourceReady = "true";
}

function preloadSlideImages(centerIndex) {
  for (let offset = -2; offset <= 3; offset++) {
    const target = stage.children[centerIndex + offset];
    if (target) {
      ensureSlideImage(target);
    }
  }
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
  const loading = item.index <= 4 ? "eager" : "lazy";
  const fetchPriority = item.index <= 2 ? ' fetchpriority="high"' : "";
  article.innerHTML = '<img class="slide-art" src="' + item.image + '" data-slide-src="' + item.image + '" data-hires-src="' + hiResImage + '" alt="' + escapedAlt + '" loading="' + loading + '" decoding="async"' + fetchPriority + '><div class="slide-vignette" aria-hidden="true"></div><span class="slide-index-badge" aria-hidden="true">' + String(item.index).padStart(2, "0") + '</span><div class="slide-accessible">' + item.eyebrow + '。標題：' + item.title + '。講者備註：' + (item.notes || "無") + '</div>';
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
  if (item.sticker) {
    const stickerWrap = document.createElement("div");
    stickerWrap.className = "slide-sticker";
    stickerWrap.style.cssText = item.sticker.style;
    const stickerImg = document.createElement("img");
    stickerImg.src = item.sticker.file;
    stickerImg.alt = item.sticker.alt || "裝飾貼圖";
    stickerImg.loading = "lazy";
    stickerWrap.append(stickerImg);
    article.append(stickerWrap);
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

function animateIn(article, direction, isInitial = false) {
  stopArticleMotion(article);
  if (isInitial || reducedMotion) {
    article.style.opacity = "1";
    article.style.transform = "none";
    return;
  }
  const isDarkDeck = document.body.classList.contains("theme-afternoon");
  const distance = isDarkDeck ? 18 : 28;
  const duration = isDarkDeck ? 0.32 : 0.44;
  if (window.gsap) {
    window.gsap.fromTo(article, { x: direction * distance }, { x: 0, duration, ease: "power3.out", clearProps: "transform" });
  } else {
    article.animate([{ transform: "translateX(" + (direction * distance) + "px)" }, { transform: "none" }], { duration: duration * 1000, easing: "cubic-bezier(.16,1,.3,1)", fill: "none" });
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

function show(index, direction = 1, updateHash = true, isInitial = false) {
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
  preloadSlideImages(nextIndex);
  animateIn(current, direction, isInitial);

  const item = slides[nextIndex];
  currentLabel.textContent = String(item.index);
  sectionLabel.textContent = item.section;
  progressBar.style.width = (((nextIndex + 1) / slides.length) * 100) + "%";
  document.title = String(item.index).padStart(2, "0") + "｜" + item.title + "｜" + data.title;
  updateLinks(item);
  updateNotes(item);
  updateSpotlight(nextIndex);
  updateOverviewCurrent();
  if (document.body.classList.contains("is-immersive")) enableHiResImage(current);
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
  if (active) scheduleHiResImage(stage.querySelector(".is-active"), 120);
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
document.querySelectorAll("[data-action=concept-close]").forEach((button) => button.addEventListener("click", () => toggleSpotlight(false)));
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

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input,textarea,select")) return;
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") { event.preventDefault(); go(1); }
  if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); go(-1); }
  if (event.key === "Home") { event.preventDefault(); show(0, -1); }
  if (event.key === "End") { event.preventDefault(); show(slides.length - 1, 1); }
  if (event.key.toLowerCase() === "o") { event.preventDefault(); overview.hidden ? openOverview() : closeOverview(); }
  if (event.key.toLowerCase() === "n") { event.preventDefault(); toggleNotes(); }
  if (event.key.toLowerCase() === "t") { event.preventDefault(); toggleReading(); }
  if (event.key.toLowerCase() === "c") { event.preventDefault(); toggleSpotlight(); }
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
show(hashMatch ? Number(hashMatch[1]) - 1 : 0, 1, false, true);
stage.focus({ preventScroll: true });
