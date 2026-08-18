# HTML 動態簡報專區

這是國立中央大學 2026-08-26 AI 教學與研究工作坊的第二套簡報呈現方式。

- `compositions/morning.html`：上午場 39 頁
- `compositions/afternoon.html`：下午場 44 頁
- 所有標題、正文、章節、講者備註與連結均為真正的 HTML／文字，不依賴 `08_HTML簡報` 的投影片圖檔。
- `data/` 是從既有 `08_HTML簡報` 的 `deck-data` 抽出的內容快照；原本的圖檔版與切換程式完全保留。
- 場景使用 `data-composition-id`、`data-start`、`data-duration`、`data-track-index` 與 `window.__timelines`，可直接作為 HyperFrames HTML composition 的後續動畫基礎。

## 入口

開啟 `index.html`，再選擇上午或下午場。兩份 deck 放在 `compositions/`，方便 HyperFrames 以一個入口管理多個可渲染 composition。簡報支援鍵盤方向鍵、Space、總覽、講者備註、閱讀模式、觸控滑動與全螢幕。

## 與既有版本的界線

既有圖檔簡報仍位於 `08_HTML簡報/`，本專區不修改其投影片圖片、雙緩衝切換、全螢幕 CSS SSOT 或原有互動邏輯。
