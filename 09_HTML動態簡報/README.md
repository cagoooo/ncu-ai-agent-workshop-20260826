# HTML 動態簡報專區

這是國立中央大學 2026-08-26 AI 教學與研究工作坊的第二套簡報呈現方式。

- `compositions/morning.html`：上午場 44 頁（含「把時間還給生活」收束頁）
- `compositions/afternoon.html`：下午場 52 頁（含 6 頁「從 Agent 到人生」反思章節）
- `overview.html`：跨上午／下午的 96 頁總覽專區，可用關鍵字搜尋、場次篩選並直接跳轉到指定頁面。
- 所有標題、正文、章節、講者備註與連結均為真正的 HTML／文字，不依賴 `08_HTML簡報` 的投影片圖檔。
- `data/` 是從既有 `08_HTML簡報` 的 `deck-data` 抽出的內容快照；原本的圖檔版與切換程式完全保留。
- 場景使用 `data-composition-id`、`data-start`、`data-duration`、`data-track-index` 與 `window.__timelines`；瀏覽器版以 CSS／GSAP 呈現頁面切換、標題、文字卡片、連結與背景的分層動態，HyperFrames 保留可 seek 的 HTML composition 時間軸契約，不需要輸出 MP4。
- 操作型投影片會把「操作步驟」與「完成條件」轉成有標題、編號、勾選與時間標籤的語意化面板；桌機使用不撐高同列卡片的雙欄，手機／平板改為單欄垂直閱讀，長文仍保留內層捲動。
- 本輪新增的 Agent 人生反思內容，完整長文保留於每頁的講者備註與「HTML 完整文字」閱讀模式；舞台只呈現易讀核心句，避免長文破壞 RWD 排版。
- `assets/favicon.svg`、`favicon.ico`、`apple-touch-icon.png` 與 `icon-192/512*.png` 是本專區專用圖示；`manifest.webmanifest` 提供加入主畫面的 app icon 設定。
- `assets/og-dynamic.png` 是 1200×630 的社群分享預覽圖；入口與兩份場次頁均含絕對 URL 的 Open Graph、Twitter Card、尺寸與 `zh_TW` meta 標籤，適合 GitHub Pages、LINE 與 Facebook 爬蟲讀取。

## 入口

開啟 `index.html`，再選擇上午或下午場；若要快速定位，開啟 `overview.html`，可搜尋標題、章節或內容後直接跳轉。兩份 deck 放在 `compositions/`，方便以一個入口管理多個可 seek 的 HTML composition。簡報支援鍵盤方向鍵、Space、總覽、講者備註、閱讀模式、觸控滑動與全螢幕；一般瀏覽器會播放分層轉場，`prefers-reduced-motion` 使用者則自動降低動畫。

## 與既有版本的界線

圖檔簡報與本專區現已同步位於 `08_HTML簡報/` 與 `09_HTML動態簡報/`，上午均為 44 頁、下午均為 52 頁；圖檔版仍保留既有投影片圖片、QR、Hotspot、雙緩衝切換、全螢幕 CSS SSOT 與原有互動邏輯，動態版則以 HTML／CSS／GSAP 呈現同一批新增內容。
