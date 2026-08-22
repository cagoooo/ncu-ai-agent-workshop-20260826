(() => {
  const decks = window.__OVERVIEW_DECKS || {};
  const root = document.getElementById("overview-root");
  const deckRoot = document.getElementById("overview-decks");
  const searchInput = document.getElementById("overview-search-input");
  const emptyState = document.getElementById("overview-empty");
  const visibleCount = document.getElementById("overview-visible-count");
  const totalCount = document.getElementById("overview-total-count");
  const resultNote = document.getElementById("overview-result-note");
  const filterButtons = [...document.querySelectorAll("[data-session-filter]")];
  const sessionMeta = {
    morning: { label: "上午場", title: "AI 教學與研究工作室", theme: "morning", href: "compositions/morning.html#slide-1" },
    afternoon: { label: "下午場", title: "會做事的 AI Agent", theme: "afternoon", href: "compositions/afternoon.html#slide-1" },
  };
  const state = { session: new URLSearchParams(location.search).get("session") || "all", query: "" };

  function slideTitle(item) {
    const raw = String(item?.title || `第 ${item?.index || ""} 頁`).trim();
    if (raw.length <= 100) return raw;
    const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const heading = lines.find((line) => /^#{1,6}\s+/.test(line))?.replace(/^#{1,6}\s+/, "")
      || lines.find((line) => !/^(---|name\s*:|description\s*:)/i.test(line))
      || raw;
    return heading.length > 100 ? `${heading.slice(0, 97)}…` : heading;
  }

  function searchText(item, meta) {
    return [meta.label, meta.title, item.section, item.title, item.text, item.description, item.notes]
      .filter(Boolean).join(" ").toLocaleLowerCase();
  }

  function makeCard(deckKey, item, meta) {
    const card = document.createElement("a");
    const number = String(item.index).padStart(2, "0");
    card.className = `overview-slide-card overview-slide-card--${meta.theme}`;
    card.href = `${meta.href.replace("#slide-1", "")}#slide-${item.index}`;
    card.dataset.session = deckKey;
    card.dataset.search = searchText(item, meta);
    card.setAttribute("aria-label", `${meta.label}第 ${item.index} 頁：${slideTitle(item)}`);

    const top = document.createElement("div");
    top.className = "overview-card-top";
    const session = document.createElement("span");
    session.className = "overview-card-session";
    session.textContent = meta.label;
    const page = document.createElement("b");
    page.className = "overview-card-number";
    page.textContent = number;
    top.append(session, page);

    const title = document.createElement("h3");
    title.textContent = slideTitle(item);
    const section = document.createElement("p");
    section.className = "overview-card-section";
    section.textContent = item.section || meta.title;
    const action = document.createElement("span");
    action.className = "overview-card-action";
    action.textContent = "開啟這一頁 →";
    card.append(top, title, section, action);
    return card;
  }

  function matches(deckKey, item) {
    if (state.session !== "all" && state.session !== deckKey) return false;
    if (!state.query) return true;
    return searchText(item, sessionMeta[deckKey]).includes(state.query);
  }

  function render() {
    if (!deckRoot) return;
    const fragment = document.createDocumentFragment();
    let count = 0;
    ["morning", "afternoon"].forEach((deckKey) => {
      const data = decks[deckKey];
      const meta = sessionMeta[deckKey];
      if (!data || !meta) return;
      const items = (data.slides || []).filter((item) => matches(deckKey, item));
      count += items.length;
      if (!items.length) return;

      const section = document.createElement("section");
      section.className = `overview-session overview-session--${meta.theme}`;
      section.dataset.session = deckKey;
      const header = document.createElement("header");
      header.className = "overview-session-head";
      const heading = document.createElement("div");
      const eyebrow = document.createElement("p");
      eyebrow.textContent = `${meta.label} · ${data.slides.length} 頁`;
      const title = document.createElement("h2");
      title.textContent = meta.title;
      heading.append(eyebrow, title);
      const open = document.createElement("a");
      open.className = "overview-session-open";
      open.href = meta.href;
      open.textContent = "從第 1 頁開始 →";
      header.append(heading, open);
      const grid = document.createElement("div");
      grid.className = "overview-card-grid";
      items.forEach((item) => grid.append(makeCard(deckKey, item, meta)));
      section.append(header, grid);
      fragment.append(section);
    });
    deckRoot.replaceChildren(fragment);
    const counts = { morning: decks.morning?.slides?.length || 0, afternoon: decks.afternoon?.slides?.length || 0 };
    const total = counts.morning + counts.afternoon;
    filterButtons.forEach((button) => {
      const key = button.dataset.sessionFilter;
      button.textContent = key === "all" ? `全部 ${total} 頁` : `${sessionMeta[key]?.label || "場次"} ${counts[key] || 0} 頁`;
    });
    const lead = document.querySelector(".overview-lead");
    if (lead) lead.textContent = `上午 ${counts.morning} 頁、下午 ${counts.afternoon} 頁集中在這裡。可以用場次篩選、關鍵字搜尋，或直接點選頁卡，快速跳到想看的 HTML 動態場景。`;
    const kicker = document.querySelector(".overview-topbar .overview-kicker");
    if (kicker) kicker.textContent = `SCENE INDEX · ${total} HTML SLIDES`;
    if (visibleCount) visibleCount.textContent = String(count);
    if (totalCount) totalCount.textContent = String(total);
    if (resultNote) {
      const scope = state.session === "all" ? "全部場次" : sessionMeta[state.session]?.label || "篩選結果";
      resultNote.textContent = state.query ? `搜尋「${state.query}」：${scope}顯示 ${count} 頁` : `顯示${scope} ${count} 頁`;
    }
    if (emptyState) emptyState.hidden = count > 0;
  }

  function setSession(session) {
    state.session = session;
    filterButtons.forEach((button) => {
      const active = button.dataset.sessionFilter === session;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    render();
    const url = new URL(location.href);
    if (session === "all") url.searchParams.delete("session");
    else url.searchParams.set("session", session);
    if (state.query) url.searchParams.set("q", state.query);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);
  }

  filterButtons.forEach((button) => button.addEventListener("click", () => setSession(button.dataset.sessionFilter)));
  searchInput?.addEventListener("input", () => {
    state.query = searchInput.value.trim().toLocaleLowerCase();
    render();
    const url = new URL(location.href);
    if (state.session !== "all") url.searchParams.set("session", state.session);
    if (state.query) url.searchParams.set("q", state.query);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput?.focus();
    }
    if (event.key === "Escape" && document.activeElement === searchInput && searchInput.value) {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
    }
  });

  const query = new URLSearchParams(location.search);
  state.query = (query.get("q") || "").trim().toLocaleLowerCase();
  if (searchInput) searchInput.value = query.get("q") || "";
  if (!sessionMeta[state.session]) state.session = "all";
  setSession(state.session);
  root?.classList.add("is-ready");
})();
