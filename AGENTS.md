# AGENTS.md｜中央大學 AI Agent 工作坊

本檔是本專案的操作規範入口。接手前先完整閱讀本檔，再讀同層的 `HANDOFF.md`；不要只看 README 或最近一次 commit 訊息就開始修改。

## 專案位置與責任邊界

- 公開 Git repo：`C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site`
- 產生器與 QA 腳本：`C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826`
- 正式研習包：`C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0`
- GitHub Pages：https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/

只有 `github_pages_site` 是 Git repo。產生器與正式包目前都不在此 repo 的版本控制內；修改來源後必須重新產生、同步、驗證公開站，不能只改生成後的 HTML 或只改正式包。

## 不要破壞的既定決策

- 上午 39 頁、下午 44 頁；現行名稱一律使用「Gemini Notebook」，不要改回 NotebookLM。
- 保留 1280×720 fallback 與 2560×1440 2K 圖片。曾使用 4K，會讓第一次全螢幕載入延遲並出現底部黑邊；未取得新證據前不要恢復 4K。
- HTML 簡報用已驗收的投影片點陣圖維持中文字型穩定，平台文字與 QR Code 由透明 hotspot 疊加以支援全螢幕點擊；不要因為看似「不是純 HTML 文字」就整套改寫。
- 第一次進入全螢幕會先立即套用沉浸狀態，再等待 Fullscreen API；這是為了解決第一次點擊不滿版的競速問題。
- 上午為淺色、下午為深色；下午第 17 頁是留白較多的 Codex 章節轉場，不要把留白誤判成遺漏內容。
- 保留每個分支頁首屏可見的「回到簡報主頁」、主導覽板入口、直接超連結與 QR Code。
- 學生資料分析只能使用合成或去識別資料；AI 是初編與研究輔助，人工複核與最終決定必須分開。
- 學校名稱只可寫「桃園市龍潭區石門國民小學」或「石門國小」。
- **【編碼鐵律】禁止使用 PowerShell 5.1 的 Get-Content / Set-Content 讀寫繁中 HTML/JS/JSON**：PS5 會誤用 CP950 讀取造成多位元組截斷亂碼，且 `-Encoding utf8` 會塞入破壞性的 UTF-8 BOM。版本替換一律使用 Python 專屬腳本（`safe_version_bump.py`）。
- **【PWA 效能鐵律】Service Worker 導覽請求必須採用 Stale-While-Revalidate (SWR)**：HTML 一律 0ms 本地快取秒開瞬出 + 背景靜默非同步更新，嚴禁在 HTML 請求採用 `networkFirst`；Precache 清單禁止塞入 4MB+ 的 OG 高清社群大圖。
- **【全螢幕佈局鐵律】全螢幕尺寸控制 100% 交由現代 CSS，嚴禁 JS 注入 inline px 尺寸**：禁止在進入全螢幕時用 JS 計時器計算或塞入 `style.height/width`（會因全螢幕切換前仍為舊視窗尺寸而導致底部黑底/偏上方）；全螢幕一律使用 `:fullscreen`, `:-webkit-full-screen`, `body.is-immersive` 搭配 `min(100vw, calc(100vh * 16 / 9))` 與 `position: fixed`，實現 0ms 瞬發垂直水平滿版居中。
- **【SW 更新四重防護】Update Prompt 必須包含 Quad-Layer Gate**：(1) 重載後 15 秒 `inSilence` 靜默冷卻；(2) 點更新時寫入 `sessionStorage.pwa_ack_version`；(3) 同版號靜默；(4) `observeRegistration` 彈窗前必須先 fetch version.json 確認真實版號，徹底杜絕無限重複彈窗。

## 修改與發布流程

1. 先讀 `HANDOFF.md`，再跑 `git status --short` 與 `git log --oneline -10`。
2. 優先修改上一層來源檔，而不是直接改 repo 內生成檔。
3. 若重建簡報，必須同步 PPTX、PDF、HTML、QR、正式包與 GitHub Pages；版本號須同時核對 `version.json`、`sw.js`、`pwa-register.js`、HTML 的 `deck.js?v=` 與 QA 期待值。
4. 完整跑 `HANDOFF.md` 的驗收矩陣。不要把中間產物的 PASS 當成正式包或公開站的 PASS。
5. 檢查 staged diff 是否含個資、憑證、API key、token、本機 `href/src=file:///` 或錯誤校名。
6. 小修完成後直接 commit、push `main`，再查 GitHub Pages `status=built` 與公開網址。

## 內容更新邊界

- Claude、Codex、Antigravity、Gemini、ChatGPT Voice 的模型名稱、價格、額度與可用方案會變動；活動前只能依當時官方資料更新，未查證就標示「未確認」。
- 不要自行登入、切換或修改六位教授的帳號、訂閱、權限或學生資料。
- 刪除正式包檔案、改變公開網址、重做 QR、升級到 4K、改頁數或改工作坊主軸前，先取得阿凱老師決定。

