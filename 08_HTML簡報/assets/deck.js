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
const spotlightDismissed = new Set();

const CONCEPT_MAP = {
  morning: {
    5: {
      badge: "🧭 跨界協作新常態",
      title: "職位邊界變薄：每個人都要多走一步",
      content: "AI Agent 讓 PM 能先做原型，也讓工程師更需要理解使用者與情境；未來競爭力不只在職稱，而在能否跨界協作、驗證並交付成果。"
    },
    6: {
      badge: "🧪 PM 原型力",
      title: "PM 先做出能用的版本，再和工程師共作",
      content: "Agent 可以把需求快速推成可操作原型，幫助 PM 釐清想法、邀請使用者試用與收斂需求；正式產品仍需要工程專業的架構、資安與維護把關。"
    },
    7: {
      badge: "🤝 工程師的現場力",
      title: "深度技術之外，還要理解人與工作脈絡",
      content: "當工具降低製作門檻，各角色都要往使用者與跨部門走近；工程師的價值不只是寫程式，也包括理解問題、設計方案與對成果負責。"
    },
    17: {
      badge: "🛡️ RAG 產線底座",
      title: "RAG（檢索增強生成）打造專屬教學與研究知識庫",
      content: "大模型幻覺的起因是預訓練機率接字補全。本產線將 Gemini Notebook 作為私有 RAG 知識庫，以真實上傳文獻為事實邊界（Grounding Data），先檢索切片再增強生成，從架構層面根治 AI 幻覺。"
    },
    18: {
      badge: "🛡️ RAG 核心公式",
      title: "RAG 檢索增強生成：知識庫錨定架構",
      content: "【真實來源切片】+【向量檢索 (Retrieve)】+【上下文增強 (Augment)】=【零幻覺可驗證生成】。不讓 AI 自由發揮，而是強制在教授提供的文獻庫範圍內推論與引用。"
    },
    19: {
      badge: "🛡️ RAG 防幻覺機制",
      title: "一般對話 vs RAG 資料庫模式：可追查鏈（Audit Trail）",
      content: "一般聊天容易『一本正經胡說八道』；RAG 資料庫模式下，AI 的每一句結論都必須綁定原文引用腳註（In-line Citations）。來源未記載時明確標示『來源無相關資料』，絕不捏造！"
    },
    20: {
      badge: "🛡️ RAG 建庫原則",
      title: "RAG 知識庫 3-2-1 原則：高密度、高相關、少雜訊",
      content: "優質的 RAG 資料庫講求『3 份核心文獻、2 種互補觀點、1 個明確教學/研究目的』。避免塞入海量無關雜訊文件，以確保向量檢索精準度。"
    },
    22: {
      badge: "🛡️ RAG 實戰檢驗",
      title: "RAG 防幻覺邊界測試（Boundary Check）",
      content: "實作防幻覺三部曲：① 檢索事實數據 → ② 跨篇綜合比對 → ③ 故意提問來源未記載的問題，測試系統是否具備誠實拒答的防幻覺邊界。"
    },
    26: {
      badge: "🛡️ Gem 角色固化",
      title: "自訂 Gem：系統提示詞 ＋ RAG 知識庫綁定",
      content: "單純 Prompt 會隨對話輪數增加而發生『角色遺忘』或『幻覺漂移』；自訂 Gem 在系統層鎖定教學方法、評量規準與引用約束，確保輸出始終穩定可靠。"
    },
    30: {
      badge: "🚀 觀念躍升：Gems 不是被淘汰，是該升級！",
      title: "從自訂 Gem 邁向專屬 Agent Skill：讓 Gem 升級成 SKILLS",
      content: "『Gems 不會消失，是該升級成 Skill！』Skill 說穿了就是一份寫給 Agent 看的標準使用說明書（SOP），只要是重複做的流程都能變成技能。結合五層記憶架構：『記憶讓 Agent 知道背景；Skill 讓 Agent 知道方法』，將原本受限於線上純聊天的 Gem（語意記憶），升級為具備檔案讀寫與自主流程的專屬 Skill（程序記憶）！"
    },
    31: {
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
    15: {
      badge: "🗄️ 後端資料基礎",
      title: "Agent 做事之外，還要把資料留下來",
      content: "前端讓人操作、Agent 負責推進、後端保存資料與權限；三者一起設計，工具才不會只在展示時會動。"
    },
    16: {
      badge: "🟨 Google 原生後端",
      title: "GAS：先用熟悉的 Sheets 把資料接起來",
      content: "Google Apps Script 可以串起 Sheets、Forms、Drive、通知與排程；先從小型工具的資料流開始，再逐步升級。"
    },
    17: {
      badge: "🧩 Skill 化 GAS 開發",
      title: "CLASP Skill：把一次成功變成下次可重跑",
      content: "把需求、程式、資料、部署與驗收寫成工作流，Agent 才能在下一個班級或下一個工具重複使用。"
    },
    18: {
      badge: "🔥 即時資料與權限",
      title: "Firebase：多人同步之前，先把規則寫清楚",
      content: "Firestore、登入與後端邏輯可以一起規劃；真正的完成條件包含資料結構、權限規則與錯誤回報。"
    },
    19: {
      badge: "🟩 SQL 型後端選擇",
      title: "Supabase：Postgres、Auth 與 API 的另一條路",
      content: "需要關聯資料與 SQL 彈性時可評估 Supabase；目前公開案例資料尚未確認到明確的阿凱 Supabase 卡片，因此不捏造案例。"
    },
    20: {
      badge: "🧭 後端選型判斷",
      title: "選資料路線，不是選流行品牌",
      content: "先問資料關聯、即時同步、登入權限、維護者與驗收證據，再在 GAS、Firebase、Supabase 之間做選擇。"
    },
    29: {
      badge: "🎛️ Skill 裝具延伸",
      title: "Agent Skills 的本質：自訂 Harness Extension（承接 Gem 升級）",
      content: "單純的提示詞只是文字建議；Agent Skill 則是透過宣告式 YAML 與命令式工作流程，為 Agent 的 Harness 擴充專屬領域的工具規約與操作 SOP，完整承接上午場「讓 Gem 升級成 SKILLS」的成果！"
    },
    30: {
      badge: "🎛️ 跨 Agent 可攜標準",
      title: "一處定義、三家通用：.agents/skills/ 可攜標準結構",
      content: "遵循 SKILL.md（流程規範）+ scripts/（Python精算）+ references/（參考格式）標準層級，同一份技能可在 Google Antigravity、OpenAI Codex 與 Anthropic Claude Code 之間 100% 無縫共用！"
    },
    32: {
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
  if (concept && !spotlightDismissed.has(index)) {
    spotlightBadge.textContent = concept.badge;
    spotlightTitle.textContent = concept.title;
    spotlightContent.textContent = concept.content;
    spotlight.hidden = false;
  } else {
    spotlight.hidden = true;
  }
}

function toggleSpotlight(force) {
  if (typeof force === "boolean") {
    if (force) spotlightDismissed.delete(activeIndex);
    else spotlightDismissed.add(activeIndex);
  } else if (spotlightDismissed.has(activeIndex)) {
    spotlightDismissed.delete(activeIndex);
  } else {
    spotlightDismissed.add(activeIndex);
  }
  updateSpotlight(activeIndex);
}

let activeIndex = 0;
let touchStartX = null;
let touchStartY = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ensureSlideImage(article, priority = "auto") {
  const art = article?.querySelector(".slide-art");
  const source = art?.dataset.slideSrc || art?.src;
  if (!art || !source) return;
  if (!art.src || art.src.includes("data:image")) {
    // 只在需要顯示或鄰近預載時才送出請求，避免首次開啟同時競爭所有投影片。
    art.loading = "eager";
    art.fetchPriority = priority;
    art.addEventListener("error", () => {
      const fallback = art.dataset.fallbackSrc;
      if (!fallback || art.dataset.usedFallback === "true") return;
      art.dataset.usedFallback = "true";
      art.src = fallback;
      if (art.decode) art.decode().catch(() => {});
    }, { once: true });
    art.src = source;
  }
  if (art.decode) {
    art.decode().catch(() => {});
  }
  art.dataset.sourceReady = "true";
}

function preloadSlideImages(centerIndex) {
  for (let offset = -3; offset <= 4; offset++) {
    const target = stage.children[centerIndex + offset];
    if (target) {
      ensureSlideImage(target, offset === 0 ? "high" : "auto");
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
  const webpImage = item.image.replace(/\.png$/i, ".webp");
  // src 刻意延後交給 ensureSlideImage：首次開啟只載入目前頁與鄰近頁，不讓 50/68 張圖搶首張解碼。
  article.innerHTML = '<img class="slide-art" data-slide-src="' + webpImage + '" data-fallback-src="' + item.image + '" data-hires-src="' + hiResImage + '" alt="' + escapedAlt + '" loading="lazy" decoding="async"><div class="slide-vignette" aria-hidden="true"></div><span class="slide-index-badge" aria-hidden="true">' + String(item.index).padStart(2, "0") + '</span><div class="slide-accessible">' + item.eyebrow + '。標題：' + item.title + '。講者備註：' + (item.notes || "無") + '</div>';
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

function animateIn(currentArticle, previousArticle, direction, isInitial = false) {
  stopArticleMotion(currentArticle);
  if (previousArticle) stopArticleMotion(previousArticle);

  if (isInitial || reducedMotion) {
    currentArticle.style.opacity = "1";
    currentArticle.style.transform = "none";
    if (previousArticle && previousArticle !== currentArticle) {
      previousArticle.classList.remove("is-previous");
    }
    return;
  }

  const isDarkDeck = document.body.classList.contains("theme-afternoon");
  const distance = isDarkDeck ? 16 : 24;
  const duration = 0.28;

  if (window.gsap) {
    window.gsap.killTweensOf(currentArticle);
    window.gsap.fromTo(
      currentArticle,
      { opacity: 0, x: direction * distance },
      {
        opacity: 1,
        x: 0,
        duration,
        ease: "power2.out",
        clearProps: "transform",
        onComplete: () => {
          if (previousArticle && previousArticle !== currentArticle) {
            previousArticle.classList.remove("is-previous");
            previousArticle.style.removeProperty("opacity");
            previousArticle.style.removeProperty("transform");
          }
        }
      }
    );
  } else {
    currentArticle.style.opacity = "1";
    currentArticle.animate(
      [
        { opacity: 0, transform: "translateX(" + (direction * distance) + "px)" },
        { opacity: 1, transform: "none" }
      ],
      { duration: duration * 1000, easing: "ease-out", fill: "none" }
    ).onfinish = () => {
      if (previousArticle && previousArticle !== currentArticle) {
        previousArticle.classList.remove("is-previous");
      }
    };
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
  const current = stage.children[nextIndex];
  if (!current) return;

  // 關閉提醒只作用於當前頁；離頁後清除狀態，回到該頁時重新提示。
  if (activeIndex !== nextIndex) spotlightDismissed.delete(activeIndex);

  const previous = stage.querySelector(".is-active");

  // 清理其他非當前、非上一張的殘留狀態
  for (let i = 0; i < stage.children.length; i++) {
    const slide = stage.children[i];
    if (slide !== previous && slide !== current) {
      slide.classList.remove("is-active", "is-previous");
      stopArticleMotion(slide);
    }
  }

  if (previous && previous !== current) {
    previous.classList.remove("is-active");
    previous.classList.add("is-previous"); // 讓上一頁保留在底層 (z-index: 1) 托底，杜絕閃黑！
  }

  current.classList.remove("is-previous");
  current.classList.add("is-active");
  ensureSlideImage(current);
  activeIndex = nextIndex;
  preloadSlideImages(nextIndex);
  animateIn(current, previous, direction, isInitial);

  const item = slides[nextIndex];
  currentLabel.textContent = String(item.index);
  sectionLabel.textContent = item.section;
  progressBar.style.width = (((nextIndex + 1) / slides.length) * 100) + "%";
  document.title = String(item.index).padStart(2, "0") + "｜" + item.title + "｜" + data.title;
  updateLinks(item);
  updateNotes(item);
  updateSpotlight(nextIndex);
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
  // 先送出原生全螢幕請求，再由 fullscreenchange 一次套用滿版 UI。
  // 若先套用 is-immersive，舞台會先放大到瀏覽器內容區，原生全螢幕完成後又放大一次，
  // 桌機上會形成可感知的兩段式縮放。API 不可用時才退回既有沉浸模式。
  const entered = await enterNativeFullscreen();
  if (entered || nativeFullscreenElement()) {
    document.body.dataset.fullscreenMode = "native";
    // 原生模式的版面由 fullscreenchange 接手；避免在瀏覽器自身進場動畫中再觸發一次重排。
    return;
  }
  // iOS Safari and embedded browsers may not expose Fullscreen API. Keep a usable
  // touch-friendly immersive mode instead of making the button appear unresponsive.
  document.body.dataset.fullscreenMode = "immersive";
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
  if (!native) {
    if (mode === "native") {
      document.body.dataset.fullscreenMode = "";
      syncFullscreenUi(false);
      return;
    }
    // 原生請求尚在等待時不改變版面；避免先縮放一次再被瀏覽器縮放第二次。
    if (mode === "pending") return;
    syncFullscreenUi(mode === "immersive");
    return;
  }
  document.body.dataset.fullscreenMode = "native";
  syncFullscreenUi(true);
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
