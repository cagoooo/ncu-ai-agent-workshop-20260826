# HANDOFF.md｜2026-08-21 本輪 Agent 交接（HTML 瀏覽器動態強化）

稽核時間：2026-08-21（Asia/Taipei；部署後公開狀態已重驗）

---

## 目前進度表（2026-08-21；依本輪實際驗證更新）

本表將 **P0** 定義為公開站可用性、內容完整性與不可回退邊界；**P1** 定義為已交付的體驗能力、維護性與後續可選擴充。下表的「未採納」與「待本人決定」不代表永久不做，而是本輪不自行擴大範圍。

| 編號 | 優先級／狀態 | 項目 | 實際證據／數字 | 後續邊界 |
|---|---|---|---|---|
| P0-01 | 已完成／守門 | `08_HTML簡報` 圖檔版的全螢幕、雙緩衝切換、快取破壞與原有版面 | `node qa_html_deck.mjs` → exit 0；原圖檔上午 39 頁、下午 44 頁，共 83 頁。`git show --format= --numstat d860da2 -- '08_HTML簡報'` → exit 0；本輪僅 3 個 HTML 版本 query 變更，沒有投影片圖片變更 | 後續 HTML 動態功能不得改寫圖檔版的圖片、Hotspot、雙緩衝與全螢幕 CSS SSOT |
| P0-02 | 已完成／公開可用 | `09_HTML動態簡報` 90 頁內容可讀、長標題不裁切、長文字可捲動、桌機／手機／平板 RWD | 本機與 `BASE_URL` 公開 QA 均 exit 0；上午 scenes=240、capability=240，下午 scenes=300、capability=300；兩場垂直捲動探針均 viewports=6、passed=6；兩場捲動重設均 maxResidual=0 | 後續不得以固定高度或隱藏溢位方式回退內容可讀性 |
| P0-03 | 已完成／部署守門 | Service Worker 更新提示、版本快取與 GitHub Pages 發布 | `gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}'` → exit 0、`status=built`；`Invoke-WebRequest version.json` → exit 0、HTTP 200、公開版本 `2026.08.21.01`；帶 `BASE_URL` QA → exit 0 | 每次發布都要重新確認 Pages `built`、`version.json` HTTP 200 與公開 QA |
| P0-04 | 已完成／隔離守門 | HTML 專區獨立於圖檔版；瀏覽器動態呈現，不把 MP4 輸出列為本輪成品 | `npx --yes hyperframes check "09_HTML動態簡報" --json` → exit 0；runtime errorCount=0、layout totalIssueCount=0、contrast checked/passed=87/87；專區 README 保留「不需要輸出 MP4」邊界 | 後續動態化仍以 HTML／CSS／GSAP／HyperFrames seek 為主；Remotion 若採用，須另列規格，不得取代既有圖檔版 |
| P1-01 | 已完成 | HTML 簡報入口、上午／下午場 composition、返回簡報首頁、鍵盤／觸控／總覽／講者備註／閱讀模式／全螢幕 | `node qa_html_deck.mjs` → exit 0；原圖檔上午 39 頁、下午 44 頁；`node qa_github_pages_site.mjs` 帶 `BASE_URL` → exit 0；HTML 動態版上午 40 頁、下午 50 頁 | 後續可在既有導覽上加功能，不重做場次資料結構 |
| P1-02 | 已完成 | CSS／GSAP 分層進場與轉場、HyperFrames 可 seek timeline、減少動態模式 | HTML browser motion QA → exit 0；samples=2、entering=true、transitioning=true、settled=true、overflow=0。HyperFrames lint／validate／inspect／check 均 exit 0；timeline samples=9、layout issues=0 | 目前是可用基線；更精緻的動態節奏列為候選 P1-A，尚未採納 |
| P1-03 | 已完成 | 專區 favicon、PWA icon／manifest、LINE／Facebook／Twitter OG 預覽與公開 meta | 公開資產／meta QA → exit 0；3 個動態頁、9 次資產請求 HTTP 200；OG PNG 為 1200×630。現行公開版本以 version.json HTTP 200、`2026.08.21.01` 確認 | 若要增加多組分享卡或動態預覽，另列候選，不改既有分享圖契約 |
| P1-04 | 基線完成／仍有維護缺口 | QA 已涵蓋短高度桌機、RWD、內層捲動、換頁捲動歸零與公開站；QA 腳本仍在專案外層 | `node --check qa_github_pages_site.mjs` → exit 0；本輪新增 1295×651 短高度桌機與捲動重設檢查；`qa_github_pages_site.mjs` 不在 Pages site repo，版控狀態需另行決定 | 可選 P1-E；未經決定不擴大來源／QA 腳本版控範圍 |
| P1-05 | 待本人決定／未處理 | 正式包 Manifest 與實際檔案數、重複 PDF、來源腳本是否納入 Git、兩份 PDF structure-tree 可及性警告 | 本輪未重驗正式包檔案數；PDF structure-tree 視覺正常但可及性影響未確認 | 不刪檔、不改正式包、不重建 Manifest、不修 PDF，直到老師選定範圍 |
| P1-06 | 待本人決定／未確認 | T-7／T-24h 現場帳號、投影設備、模型名稱與費用方案敘述 | 帳號、現場網路、投影設備與當期方案未確認 | 不切換教授帳號、不猜測模型與費用文字；需先取得現場決策 |

### RDQ 後續候選索引（未採納，等老師挑選）

| 候選編號 | 方向 | 主要內容 | 預估代價／風險 | 建議驗收 |
|---|---|---|---|---|
| P1-A | 動態精緻化 | 依頁型加入 stagger、段落 reveal、卡片連續編排、背景 orb 微動態、轉場語意；同步維護 GSAP 與 HyperFrames seek | 中至高；需維持目前 90 頁不溢位、減少動態與鍵盤／觸控可用性 | motion QA、reduced-motion、90 頁邊界與 HyperFrames 9 個 timeline sample 全數通過 |
| P1-B | 講者模式與導覽 | 章節目錄、頁面搜尋、URL deep link、演講計時器、講者視窗／備註、快速跳頁與目前頁分享 | 中；會增加導覽狀態、視窗同步與手機版操作複雜度 | 鍵盤／觸控／瀏覽器返回、三種主要尺寸與重新整理後 deep link 均通過 |
| P1-C | 無障礙與閱讀模式 | focus-visible、跳至主要內容、ARIA 語意、放大至 200%、高對比、完整鍵盤操作、讀屏文字順序與更完整的 reduced-motion | 中；部分版面需調整，不能只靠顏色或動畫傳達資訊 | 自動檢查加鍵盤人工走查；目前 94 個文字元素 WCAG AA 基線保留，新增項目逐項留證 |
| P1-D | 效能、離線與更新韌性 | 首屏優先、目前／下一頁預載、低網速測試、離線 fallback、SW 更新回復、長時間播放記憶體檢查 | 中；需維護快取策略與兩種網路狀態 | 冷啟動、慢網路、離線、更新提示與重新載入均有可重現指令和結果 |
| P1-E | 內容建置與視覺 QA 自動化 | `deck-data` 單一來源、HTML 重新生成、長文字／頁數 lint、encoded pathname 覆蓋、逐頁 screenshot／視覺差異報告 | 高；可能觸及來源不在 Git、建置腳本與正式包同步方式 | `08_HTML簡報` 圖檔版維持 39／44 頁；`09_HTML動態簡報` 內容變更後仍須通過 40／50 頁文字溢位、連結、版本與視覺差異檢查 |

本索引只供挑選，不是已確認的 RDQ 規格卡；老師選定編號後，下一輪再針對該方向建立 `draft` 規格卡、列出待確認假設與驗收條件，確認前不開始製作。

## 本輪新增內容（v2026.08.21.01；已部署公開站確認）

本輪依 RDQ 將阿凱老師提出的 Agent 時代與人生哲學納入 `09_HTML動態簡報`，內容定位為「能力提升之後，如何把時間還給人生」；`08_HTML簡報` 圖檔版維持上午 39 頁、下午 44 頁，沒有改寫圖片、Hotspot、雙緩衝切換或全螢幕 CSS SSOT。

- 上午場新增第 39 頁「工具幫我們省下時間，但人生不能只剩下更多任務」，接在整合挑戰後、資源書籤前；上午 HTML 動態版由 39 頁增加為 40 頁。
- 下午場新增第 44–49 頁「從 Agent 到人生」反思章節，依序為超能力、從做不到到我可以、多巴胺與一人公司、效率陷阱、Harness 反思、情緒價值，以及把時間還給人生；下午資源書籤順延為第 50 頁，下午 HTML 動態版由 44 頁增加為 50 頁。
- 完整哲學內容保留在各頁 `notes` 講者備註與「HTML 完整文字」閱讀模式；舞台使用分段核心句，降低長文造成的跑版風險。效率「1/10～1/20、至少 20 倍」以老師的觀察語氣呈現，不宣稱為所有任務的普遍測量結果；一人公司／一人獨角獸也以觀察與想像表述。
- `version.json`、`sw.js` 與相關 HTML 靜態資源 query 已提升至 `2026.08.21.01`；PWA 更新提示仍保留，沒有寫入 API key、token 或密碼。

本機已完成的實際驗證：

```text
node --check data/morning.js → exit 0
node --check data/afternoon.js → exit 0
資料結構檢查 → exit 0；上午 40 頁、下午 50 頁，頁碼均連續
node qa_github_pages_site.mjs → exit 0；GitHub Pages site QA passed
HTML browser motion QA → exit 0；samples=2、entering=true、transitioning=true、settled=true、overflow=0
HTML scroll container QA → 上午 scenes=240、capability=240；下午 scenes=300、capability=300
HTML vertical scroll probe → 上午／下午均 viewports=6、passed=6
HTML scroll reset QA → 上午／下午均 viewports=6、passed=6、maxResidual=0
npx --yes hyperframes lint "09_HTML動態簡報" --json → exit 0；filesScanned=3、errorCount=0、warningCount=0、infoCount=0
npx --yes hyperframes validate "09_HTML動態簡報" → exit 0；console errors=0、94 個文字元素通過 WCAG AA
npx --yes hyperframes inspect "09_HTML動態簡報" → exit 0；9 個 timeline sample、layout issues=0
npx --yes hyperframes check "09_HTML動態簡報" --json → exit 0；runtime errorCount=0、layout totalIssueCount=0、contrast checked/passed=87/87
node qa_html_deck.mjs → 首次 exit 1（既有轉場時序檢查偶發 previous slide 可見）；立即重跑 exit 0、`HTML deck QA passed.`，圖檔版仍為上午 39 頁／下午 44 頁，共 83 頁
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0；`status=built`
Invoke-WebRequest version.json → exit 0；HTTP 200、version=2026.08.21.01、title=新增 Agent 時代人生反思內容與 HTML 場次頁
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；`GitHub Pages site QA passed.`；上午 scenes=240、capability=240，下午 scenes=300、capability=300；兩場垂直捲動探針 viewports=6、passed=6；兩場捲動重設 maxResidual=0
```

## 本輪更新（v2026.08.18.14）

本輪針對截圖所示的 HTML 動態簡報內容裁切進行全面檢查與修正；修改範圍只在 `09_HTML動態簡報`，沒有改寫 `08_HTML簡報` 的投影片圖片、Hotspot、雙緩衝切換或全螢幕版面。一般瀏覽器的 CSS／GSAP 分層動畫、HyperFrames 可 seek 時間軸與「不輸出 MP4」邊界均保留。

- 內層捲動：換頁、返回上一頁、瀏覽器 `pageshow` 與視窗尺寸變更時，會將 `.scene-content`、`.scene-copy`、`.scene-body` 與完整文字區的捲動位置歸零，避免標題從上方被裁切。
- 長標題版面：偵測 `.scene-copy` 內容溢位後自動改為從上方排列，保留垂直捲軸讓使用者讀取完整標題、說明與段落，不再以垂直置中把第一行推到容器上方。
- 短高度桌機：1295×651 等短高度桌機將 16:9 舞台縮放至可用高度，鎖定外層頁面捲動，讓裁切只由簡報內層捲動容器承接；手機／平板原有自然增高舞台與 RWD 捲動保留。
- QA：`qa_github_pages_site.mjs` 新增 1295×651 短高度桌機逐頁檢查、桌機外層垂直溢位檢查，以及換頁後內層捲動歸零測試。
- 快取：`version.json`、`sw.js` 與相關 HTML query 版本提升至 `.14`；`08_HTML簡報` 僅更新版本 query，內容圖檔未變更。

本機實際驗證：

```text
node qa_html_deck.mjs → exit 0；上午 39 頁、下午 44 頁，共 83 頁
node qa_github_pages_site.mjs → exit 0；GitHub Pages site QA passed
HTML scroll container QA → 上午 scenes=234、capability=234；下午 scenes=264、capability=264
HTML vertical scroll probe → 上午 viewports=6、passed=6；下午 viewports=6、passed=6
HTML scroll reset QA → 上午 viewports=6、passed=6、maxResidual=0；下午 viewports=6、passed=6、maxResidual=0
HTML browser motion QA → exit 0；samples=2、entering=true、transitioning=true、settled=true、overflow=0
node --check dynamic-deck.js／pwa-loader.js／sw.js → exit 0
node --check qa_github_pages_site.mjs → exit 0
npx --yes hyperframes lint "09_HTML動態簡報" --json → exit 0；filesScanned=3、errorCount=0、warningCount=0、infoCount=0
npx --yes hyperframes validate "09_HTML動態簡報" → exit 0；console errors=0、94 個文字元素通過 WCAG AA
npx --yes hyperframes inspect "09_HTML動態簡報" → exit 0；9 個 timeline sample、layout issues=0
npx --yes hyperframes check "09_HTML動態簡報" --json → exit 0；runtime errorCount=0、layout totalIssueCount=0、contrast checked/passed=87/87
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0；status=built
Invoke-WebRequest version.json → exit 0；HTTP 200、version=2026.08.18.14
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；GitHub Pages site QA passed；上午 scenes=234、capability=234，下午 scenes=264、capability=264
公開 HTML vertical scroll probe → 上午 viewports=6、passed=6；下午 viewports=6、passed=6
公開 HTML scroll reset QA → 上午 viewports=6、passed=6、maxResidual=0；下午 viewports=6、passed=6、maxResidual=0
公開 Playwright 短高度第 7 頁量測 → exit 0；1295×651、version=.14、copyOverflowing=true、copy scrollHeight/clientHeight=587/240、h1AboveCopy=false、文件水平／垂直溢位=0
```

---

## 本輪更新（v2026.08.18.13）

本輪針對 `09_HTML動態簡報` 的長文字內容補上可讀取的垂直捲動與 RWD 捲動承接；原有 `08_HTML簡報` 圖檔版的投影片圖片、Hotspot、雙緩衝切換與全螢幕 CSS SSOT 均未改動。一般瀏覽器的 CSS／GSAP 分層動畫、HyperFrames 可 seek 時間軸與「不輸出 MP4」邊界均保留。

- 桌機：`.scene-content`、`.scene-copy`、`.scene-body` 提供垂直捲動、長句換行與一致的捲軸樣式，避免字數較多時截斷或重疊。
- 手機／平板：觸控載具在 1200px 以下由 `.dynamic-stage` 承接垂直捲動，涵蓋手機直式／橫式、平板直式／橫式；換頁時會將舞台捲動位置重設至頂端。
- RWD 尺寸：隱藏場景不再保留進場縮放與轉場光暈的溢位尺寸，避免非目前頁面污染舞台水平寬度計算；目前頁面的動畫效果不變。
- 快取：`version.json`、`sw.js` 與所有相關 HTML query 版本提升至 `.13`；版本說明標示本輪長文字垂直捲動修復。
- QA：`qa_github_pages_site.mjs` 新增捲動容器能力與實際捲動探針，保留既有動畫、社群 meta、Service Worker、RWD 與 HyperFrames 檢查。

本輪實際驗證：

```text
node qa_html_deck.mjs → exit 0；上午 39 頁、下午 44 頁，共 83 頁
node qa_github_pages_site.mjs → exit 0；GitHub Pages site QA passed
本機 HTML scroll container QA → 上午 scenes=195、capability=195；下午 scenes=220、capability=220
本機 HTML vertical scroll probe → 上午 viewports=5、passed=5；下午 viewports=5、passed=5
本機 HTML browser motion QA → exit 0；samples=2、entering=true、transitioning=true、settled=true、overflow=0
node --check dynamic-deck.js／pwa-loader.js／sw.js／qa_github_pages_site.mjs → exit 0
version.json／manifest.webmanifest ConvertFrom-Json → exit 0
npx --yes hyperframes lint "09_HTML動態簡報" --json → exit 0；filesScanned=3、errorCount=0、warningCount=0、infoCount=0
npx --yes hyperframes validate "09_HTML動態簡報" → exit 0；console errors=0、94 個文字元素通過 WCAG AA
npx --yes hyperframes inspect "09_HTML動態簡報" → exit 0；9 個 timeline sample、layout issues=0
npx --yes hyperframes check "09_HTML動態簡報" --json → exit 0；runtime errorCount=0、layout totalIssueCount=0、contrast checked/passed=87/87
git diff --check → exit 0
git commit -m "補強 HTML 簡報長文字垂直捲動" → exit 0；commit=46f1ecf
git push origin main → exit 0；main 已推送
gh api .../pages 輪詢 → exit 0；第二次輪詢 status=built
Invoke-WebRequest version.json → exit 0；HTTP 200、version=2026.08.18.13
BASE_URL 公開站 QA → exit 0；GitHub Pages site QA passed
公開 HTML scroll container QA → 上午 scenes=195、capability=195；下午 scenes=220、capability=220
公開 HTML vertical scroll probe → 上午 viewports=5、passed=5；下午 viewports=5、passed=5
公開 HTML browser motion QA → entering=true、transitioning=true、settled=true、overflow=0
```

## 一句話狀態（前一輪 v2026.08.18.12）

**前一輪為 `09_HTML動態簡報` 加入瀏覽器內的 CSS／GSAP 分層進場與換頁轉場；HyperFrames 可 seek 時間軸仍保留，沒有加入 MP4 輸出流程，原有 `08_HTML簡報` 圖檔設計不變。公開站 `v2026.08.18.12` 已由 Pages built、公開版本、公開頁面檢查與帶 `BASE_URL` 的 QA 實際確認。**

### 前一輪更新內容（v2026.08.18.12）

- 動畫核心：`09_HTML動態簡報/assets/dynamic-deck.js` 在一般瀏覽器模式播放 GSAP timeline，依頁面轉場模式分層處理 scene、標題、說明、正文、內容卡片、連結、裝飾 orb 與轉場光暈。
- HyperFrames 相容：每份 composition 仍以 `window.__timelines[compositionId]` 註冊 paused、可 seek 的時間軸；HyperFrames 模式不啟用一般瀏覽器的互動 timeline，避免時間軸互相搶寫。
- RWD／可及性：保留 `prefers-reduced-motion` 降低動態；QA 量測會在動畫完成或靜態狀態下檢查邊界，沒有用 overflow 白名單掩蓋跑版。
- 視覺互動：內容卡片與外部連結增加細緻 hover feedback；首頁的 orb、文字、場次入口也改為分層進場。
- 快取：`sw.js`、`version.json` 與 HTML query 版本提升至 `.12`；`08_HTML簡報` 僅更新版本 query／版本標記，沒有改動投影片圖片、Hotspot、雙緩衝切換或全螢幕 CSS SSOT。
- 文件：更新 `09_HTML動態簡報/README.md`，明確說明瀏覽器動態與 HyperFrames seek 契約，不把 MP4 當成本輪交付物。

前一輪實際驗證：

```text
node qa_html_deck.mjs → exit 0，HTML deck QA passed；上午 39 頁、下午 44 頁，共 83 頁
node qa_github_pages_site.mjs → exit 0，GitHub Pages site QA passed；83 個動態場景、5 種視窗尺寸
node qa_github_pages_site.mjs 的動畫專項 → exit 0；samples=2、entering=true、transitioning=true、settled=true、overflow=0
node --check 09_HTML動態簡報/assets/dynamic-deck.js → exit 0
node --check qa_github_pages_site.mjs → exit 0
node --check sw.js → exit 0
npx --yes hyperframes lint "09_HTML動態簡報" --json → exit 0；filesScanned=3、errorCount=0、warningCount=0、infoCount=0
npx --yes hyperframes check "09_HTML動態簡報" --json → exit 0；runtime errorCount=0、layout totalIssueCount=0、contrast checked/passed=87/87
git diff --check → exit 0
git commit → exit 0；commit=0c0f501
git push origin main → exit 0；main 已推送
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0；status=built
Invoke-WebRequest version.json → exit 0；HTTP 200、version=2026.08.18.12
BASE_URL 公開站 QA → exit 0，GitHub Pages site QA passed；動畫專項 entering=true、transitioning=true、settled=true、overflow=0
公開頁面 fetch → exit 0；hub HTTP 200、GSAP／HyperFrames／不需要輸出 MP4 均存在，morning HTTP 200、動態 script 與 composition id 均存在
```

## 前一輪更新摘要（v2026.08.18.11）

- 已完成 HTML 動態簡報專區專用 favicon、PWA app icons、manifest 與 LINE／Facebook／Twitter 社群分享預覽；細節保留於下方歷史交接段落。

## 前一輪已保留的功能修復（v2026.08.18.10）

- 根因：桌面版 `.scene-body` 與長文字卡片被固定 16:9 舞台的剩餘高度壓縮；手機與平板仍沿用固定畫布，導致內容被截斷或重疊。
- 修復：步驟型長文字場景改為從上方自然排版、縮小中等寬度的卡片內文；觸控裝置改用單欄自然增高舞台，保留完整標題、說明與內容卡片。
- 導覽：`09_HTML動態簡報` 首頁保留單一「← 回到工作坊主頁」，移除與其相同用途的「↩ 回圖檔簡報首頁」；上午／下午 HTML composition 的工具列與底部控制列均保留「回簡報首頁」。
- HyperFrames：圖檔簡報連結改由執行時解析站點根目錄，避免 `../08_HTML簡報/` 被誤判為越界資產路徑。
- Service Worker：補上 `09_HTML動態簡報` 首頁與兩份 composition 的 `pwa-loader.js`，由共用註冊器顯示更新提示；loader 在 HyperFrames 模式會跳過 SW 註冊，保留離線預覽檢查。
- 快取：`sw.js`、`version.json` 與 HTML query 版本由 `.09` 提升至 `.10`，讓 CSS、資料、頁面與更新通知可被公開站取得。
- `08_HTML簡報` 僅更新版本 query／版本標記，沒有改動投影片圖片、Hotspot、雙緩衝切換或全螢幕 CSS SSOT。

本輪實際驗證：

```text
node qa_html_deck.mjs → exit 0，`HTML deck QA passed.`；原圖檔上午 39 頁、下午 44 頁，共 83 頁
node qa_github_pages_site.mjs → exit 0，`GitHub Pages site QA passed.`；動態簡報 83 個場景逐頁檢查，涵蓋桌機、手機直式／橫式、平板直式／橫式共 5 種視窗
node --check qa_github_pages_site.mjs → exit 0
node --check 09_HTML動態簡報/assets/pwa-loader.js → exit 0
node --check sw.js → exit 0
node --check pwa-register.js → exit 0
node --check 09_HTML動態簡報/assets/dynamic-deck.js → exit 0
npx --yes hyperframes lint "09_HTML動態簡報" --json → exit 0，filesScanned=3、errorCount=0、warningCount=0、infoCount=4
npx --yes hyperframes validate "09_HTML動態簡報" → exit 0，console errors=0、contrastFailures=0
npx --yes hyperframes inspect "09_HTML動態簡報" → exit 0，9 個 timeline sample、layout issues=0
npx --yes hyperframes check "09_HTML動態簡報" → exit 0，runtime errors=0、layout issues=0、contrast checked/passed=87/87
git diff --check → exit 0
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0，status=built
Invoke-WebRequest -UseBasicParsing 'https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/version.json?cb=20260818-11-live' → exit 0，HTTP 200、version=2026.08.18.11
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0，`GitHub Pages site QA passed.`；83 個場景、5 種視窗
公開社群 meta／資產檢查 → exit 0；3 個動態頁、9 次資產請求全部 HTTP 200，`og:locale=zh_TW`、Twitter `summary_large_image`、favicon／manifest 版本均為 `.11`
公開 OG PNG fetch → exit 0；HTTP 200、631771 bytes、1200×630
公開 Playwright slide-12 量測 → exit 0；桌機 active scene 的 grid/body/copy scrollHeight=clientHeight=488、maxBlockOverflow=0、水平溢位=0；手機舞台 1130/1130、grid 1054/1054、body 684/684、copy 352/352、maxBlockOverflow=0、水平溢位=0
公開 Playwright 首頁量測 → exit 0；保留導覽按鈕=1（文字為「← 回到工作坊主頁」）、動態場次連結=2、可見文字長度=370
公開 Playwright 首頁三尺寸 RWD 量測 → exit 0；桌機／平板橫向／手機直向均為 `nav=1`、重複選擇器=0、水平溢位=0、`pwa-loader=1`、版本=`2026.08.18.11`
公開 Playwright Service Worker 量測（暖機後） → exit 0；動態首頁／上午／下午均為 `pwa-loader=1`、`pwa-register=1`、`controller=true`、`active=true`，scope 為專案根目錄
公開 Playwright 版本差異模擬 → exit 0；模擬遠端 `v2026.08.18.11` 時 `.pwa-update-prompt` 可見，提示文字含「網站有新版可用」與「立即更新」
```

功能 commit：`196428b 新增 HTML 動態簡報 favicon 與社群預覽`，已推送 `main`；本檔為部署後交接資料更新，文件 commit 會在本檔修正後再推送。

---

## 接手前先讀（按順序，不可跳過）

1. `C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site\AGENTS.md`
2. 本檔：`C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site\HANDOFF.md`
3. 上一版 HANDOFF 可透過 `git log -p HANDOFF.md` 查閱。

不要把本檔數字當成永久真相；開始工作時先重跑 git 與相關測試。

---

## 工作區與版本狀態

- **Git repo**：`C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site`
- **建置 / QA 腳本目錄**：`C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826`
- **正式包**：`C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0`
- **分支**：`main`，本輪交接文件修正完成後工作區應保持乾淨
- **公開版本**：`2026.08.21.01`，`version.json` HTTP 200 已確認。
- **本輪功能 commit**：`65cda07 新增 Agent 時代人生哲學 HTML 簡報內容`；文件 commit 後仍以 `git log --oneline -1` 實際確認目前 HEAD。
- **GitHub Pages**：`gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}'` exit 0，`status=built`。

---

## 前一輪 git 實際數字（2026-08-18 11:29；目前狀態請以上方與文末指令為準）

```
git status → nothing to commit, working tree clean

git log --oneline -10：
f6642e0 更新交接驗收紀錄與正式包頁數
4c989db 交接文件升級：更新至 2026-08-18 本輪實際驗證數字，記錄全螢幕閃黑根治與 SKILL 固化
990c049 文檔升級：將全螢幕 SSOT、0 閃爍雙緩衝切換與 Cache-Busting 固化至 AGENTS.md
34f622c 根除全螢幕閃黑：徹底拔除全螢幕動態替換 2K 圖源機制 (enableHiResImage) (v2026.08.18.05)
ebfee17 根除切換下一頁閃黑：實作雙緩衝重疊轉場 (is-previous 托底) + GPU 預先解碼 (img.decode) (v2026.08.18.04)
95b9ae4 快取破壞升級：為 deck.css 加上版本號 query 參數 (v2026.08.18.03)
f8c0b09 修復全螢幕跑版：徹底清理 CSS 覆蓋衝突，SSOT 移至最底層 (v2026.08.18.02)
80901ee 推進至今日版本號 v2026.08.18.01，實作 SW 更新彈窗動態描述與高對比樣式
1ef1f6d docs: 在 AGENTS.md 固化全螢幕純 CSS 0ms 滿版置中鐵律
a7c0677 效能與體驗優化：根除全螢幕切換時的底部黑邊與延遲 (v2026.08.16.65)
17ad069 視覺升級：為簡報重點章節與留白處加入 AI 生成精緻微插圖 (v2026.08.16.64)
5d76e40 簡報升級：融入三師爸最新 Agent Skill 完全攻略實戰三部曲 (v2026.08.16.63)
```

---

## 本輪已完成且「實際驗證過」的事

### 1. 本機 HTML 簡報 QA（`node qa_html_deck.mjs`）

**本輪重跑結果**：exit 0，`HTML deck QA passed.`；上午 39 頁、下午 44 頁，共 83 頁。

測試涵蓋（完整列表）：
- 上午 39 頁、下午 44 頁，初始 slide #1 active = 1 ✓
- Desktop 1440×960 無水平溢位 ✓
- 頁腳含「阿凱老師」✓
- Hotspot QR + Platform + Card 三型全部存在且可命中 ✓
- `deck.js?v=版本號` cache-busting 版本號存在 ✓；公開 repo 本輪版本為 `2026.08.18.13`
- 第一次全螢幕：立即進入沉浸狀態、工具列立即隱藏、舞台寬度 ≥ viewport × 0.9 ✓
- 第二次全螢幕：同上 ✓
- 鍵盤 ArrowRight 換頁至 slide 2 ✓
- 轉場後 350ms 無殘留 `.is-previous` 可見（visibleInactive = 0）✓
- 備註面板、閱讀模式（textLength ≥ 50）✓
- 總覽（overview card 數量符合頁數）、末頁導航 ✓
- Mobile portrait 393×852：無溢位、舞台垂直置中（容差 5px）、工具列 ≥ 90px + 正確 label ✓
- Mobile fullscreen immersive + 退出 ✓
- Mobile landscape 932×430、Tablet portrait 820×1180、Tablet landscape 1180×820：無溢位、置中、label 正確 ✓
- 全螢幕 Hotspot 可點擊、slide 圖片解析度 ≥ 1280px ✓

### 2. 本機 GitHub Pages QA（`node qa_github_pages_site.mjs`）

**結果**：本機 exit 0，`GitHub Pages site QA passed.`；本輪含 83 個動態場景、5 種視窗尺寸的 RWD 檢查已完成。

捲動驗證數字：上午 `scenes=195、capability=195`；下午 `scenes=220、capability=220`；上午／下午垂直捲動探針均為 `viewports=5、passed=5`。

帶 `BASE_URL=https://cagoooo.github.io/ncu-ai-agent-workshop-20260826` 的公開站 QA：exit 0，`GitHub Pages site QA passed.`

### 3. 公開 `version.json` 版本確認

```powershell
(Invoke-WebRequest -UseBasicParsing 'https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/version.json?cb=20260818-08').Content
# → HTTP 200，"version": "2026.08.18.13"
```

### 4. 全螢幕跑版修復（v2026.08.18.02）

根本原因：CSS 尾部 Media Query 覆蓋了全螢幕置中規則。
根治：在 `deck.css` 最底層宣告 SSOT，強制 `position: fixed !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important`。
驗證：使用者以無痕視窗確認正常。

### 5. CSS Cache-Busting 補齊（v2026.08.18.03）

`morning.html`、`afternoon.html`、`index.html` 的 CSS/JS 引用全部補上版本號。
驗證：QA 腳本 `deck.js?v=` 版本字串檢查通過。

### 6. 全螢幕切換下一頁閃黑根治（v2026.08.18.04、v2026.08.18.05）

根本原因：`enableHiResImage` 在全螢幕換頁後動態置換 `art.src`，瀏覽器重新點陣化導致 100ms 閃黑。「只有全螢幕切換下一頁」的特徵直接鎖定此機制。
根治：徹底移除 `enableHiResImage`；實作雙緩衝重疊轉場（`is-previous` 托底）+ 原生 `img.decode()` GPU 預解碼 + `will-change: opacity, transform`。
驗證：使用者以無痕視窗確認，QA `visibleInactive = 0` 綠燈。

### 7. 全域 SKILL 固化

建立 `html-deck-fullscreen-smooth-transition` SKILL，同步至 `.claude`、`.codex`、`.agents`、`Cowork\.claude`、`Cowork\.agents` 五個目錄。
⚠️ 目錄存在已確認，但各工具載入時是否確實讀到此 SKILL，**未做功能性測試**。

### 8. 來源與正式包驗收清單同步修正

`workshop_suite_src/06_場務與驗收/PowerPoint實機驗收清單.csv` 與正式包同路徑檔案已同步將「上午 34 頁」修正為「上午 39 頁」。兩檔 SHA-256 均為 `55CF9382D256725F81A1172C77427882E1A490A496B22F673E6CEF18E5D7A22D`。

驗證：`qa_workshop_suite.mjs` exit 0、正式包 `qa_html_deck.mjs` exit 0、`qa_ops_checklist.mjs` exit 0、`qa_qr_codes.py` exit 0（145 個 QR）、`audit_local_links.mjs` exit 0（82 個 HTML、127 個本地引用）。

### 9. HTML 原生動態簡報專區、RWD 與 SW 更新通知（前一輪 v2026.08.18.10）

- 新入口：`09_HTML動態簡報/index.html`。
- 上午 composition：`09_HTML動態簡報/compositions/morning.html`，39 頁。
- 下午 composition：`09_HTML動態簡報/compositions/afternoon.html`，44 頁；合計 83 頁。
- 內容資料取自既有 `08_HTML簡報` 的 `deck-data` 快照；新專區使用 HTML 文字、CSS 版面與連結，不讀取投影片圖檔。資料統計實際為上午 39 頁／85 個連結、下午 44 頁／81 個連結。
- 每頁保留 `data-composition-id`、`data-start`、`data-duration`、`data-track-index`；GSAP timeline 以 `window.__timelines` 註冊並保持可 seek 的 paused 狀態，已可接 HyperFrames。Remotion 本輪未加入，保留後續轉換路徑。
- 桌機長文字：步驟型場景改為上方起始的自然網格列高，並針對 901–1300px 寬度降低卡片內距與字級，避免內容卡片在固定 16:9 舞台中被截斷。
- 觸控 RWD：手機／平板切換為單欄、自然增高的 HTML 舞台，取消場景內部固定高度與不必要的 overflow，支援直式與橫式視窗。
- 導覽：動態專區首頁保留單一「← 回到工作坊主頁」；兩份 composition 均提供工具列與底部「回簡報首頁」連結，沒有改動圖檔簡報首頁的既有設計。
- Service Worker：新增 `09_HTML動態簡報/assets/pwa-loader.js`，三個動態頁均可載入共用 `pwa-register.js`，公開站直接開啟動態頁也會註冊根目錄 scope 並顯示版本更新提示。
- `08_HTML簡報` 本輪只更新版本 query、版本資訊與專區入口，沒有重建或改寫其圖檔投影片、雙緩衝切換、全螢幕 CSS SSOT 或原有互動邏輯。

本輪實際驗證（均為已執行結果）：

```text
node qa_html_deck.mjs → exit 0，`HTML deck QA passed.`（原圖檔上午 39 頁、下午 44 頁）
node qa_github_pages_site.mjs → exit 0，`GitHub Pages site QA passed.`（新專區 83 個場景、5 種視窗尺寸逐頁 RWD 檢查）
node --check qa_github_pages_site.mjs → exit 0
node --check 09_HTML動態簡報/assets/pwa-loader.js → exit 0
node --check sw.js → exit 0
node --check pwa-register.js → exit 0
node --check 09_HTML動態簡報/assets/dynamic-deck.js → exit 0
npx --yes hyperframes lint 09_HTML動態簡報 --json → exit 0，filesScanned=3、errorCount=0、warningCount=0、infoCount=4
npx --yes hyperframes validate 09_HTML動態簡報 → exit 0，console errors=0、contrastFailures=0
npx --yes hyperframes inspect 09_HTML動態簡報 → exit 0，9 個 timeline sample、layout issues=0
npx --yes hyperframes check 09_HTML動態簡報 --json → exit 0，runtime errors=0、layout issues=0、contrast checked/passed=87/87
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0，`GitHub Pages site QA passed.`
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0，status=built
Invoke-WebRequest version.json?cb=20260818-10-final → exit 0，HTTP 200、version=2026.08.18.10
公開 Playwright 動態首頁三尺寸導覽量測 → exit 0；3 個尺寸均為 nav=1、重複選擇器=0、水平溢位=0
公開 Playwright 直接開三個動態頁（暖機後） → exit 0；每頁 pwa-loader=1、pwa-register=1、controller=true、active=true
公開 Playwright 版本差異模擬 → exit 0；遠端版本 v2026.08.18.11 時更新提示可見
```

以上公開站版本與 Pages built 狀態已在 push 後以實際指令確認；後續仍不可把本機 QA 單獨當成公開部署完成證據。

---

### 10. HTML 動態簡報 favicon、PWA 圖示與社群分享預覽（v2026.08.18.11）

- `09_HTML動態簡報/assets/favicon.svg`：HTML 動態簡報專區專屬向量 favicon；另提供 `.ico`、32×32 PNG、180×180 Apple touch icon、192／512 PWA icons 與 maskable icons。
- `09_HTML動態簡報/assets/og-dynamic.png`：1200×630 PNG，使用 HTML 動態簡報的深色舞台、AI 核心、語法路徑與時間軸視覺，適合作為 LINE／Facebook／Twitter 分享卡片。
- `09_HTML動態簡報/manifest.webmanifest`：設定名稱、短名稱、語系、standalone 顯示模式、主題色與 4 組 app icons。
- `09_HTML動態簡報/index.html`、`compositions/morning.html`、`compositions/afternoon.html`：均加入絕對 OG URL／圖片、`og:image:width=1200`、`og:image:height=630`、`og:locale=zh_TW`、Twitter `summary_large_image` 與相對 favicon／manifest 連結。
- `sw.js`：把本專區 9 個新資產與 manifest 加入版本化預載清單；所有相關 HTML／SW／version query 已提升至 `.11`。
- `08_HTML簡報` 只更新版本 query／版本標記，沒有改動原有投影片圖片、Hotspot、雙緩衝切換、全螢幕 CSS SSOT 或互動邏輯。

本輪實際驗證（均為已執行結果）：

```text
git diff --check → exit 0
node --check sw.js → exit 0
node --check pwa-register.js → exit 0
node --check 09_HTML動態簡報/assets/pwa-loader.js → exit 0
node --check qa_github_pages_site.mjs → exit 0
Get-Content 09_HTML動態簡報/manifest.webmanifest | ConvertFrom-Json → exit 0
magick identify → exit 0；9 個新資產，OG=1200×630／631771B、favicon-32=32×32、Apple=180×180、PWA icons=192×192／512×512
git commit → exit 0，commit=`196428b`
git push origin main → exit 0，`2303386..196428b main -> main`
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0，status=built
Invoke-WebRequest version.json?cb=20260818-11-live → exit 0，HTTP 200、version=2026.08.18.11
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0，`GitHub Pages site QA passed.`；83 個場景、5 種視窗
公開社群 meta／資產檢查 → exit 0；3 個動態頁、9 次資產請求全部 HTTP 200，`og:locale=zh_TW`、Twitter `summary_large_image`、favicon／manifest 版本均為 `.11`
公開 OG PNG fetch → exit 0；HTTP 200、631771 bytes、1200×630
```

---

## 沒做完、被擋住或刻意跳過

1. **正式包 Manifest 與實際檔案數**：本輪未重驗；既有交接紀錄的檔案數字與本輪接手提示不一致，需以老師決定的正式包範圍重新核對，不能自行刪除或重建。
2. **兩份簡報 PDF 共 83 頁的 structure-tree 警告**：視覺渲染正常，PDF 可及性仍未確認。
3. **各工具是否實際載入全域 SKILL**：目錄存在，但功能性載入測試未做。
4. **現場、帳號、設備均未驗證**：ChatGPT Voice、Typeless、教授帳號訂閱、中大網路、投影設備等，全部未確認。

---

## 刻意保留、不要順手改掉

- **2K 而非 4K**：4K 載入延遲並出現底部黑邊；未取得新證據前不要恢復。
- **雙緩衝重疊切換（`is-previous` + `img.decode()`）**：本輪核心修復，不要動。
- **全螢幕第一下先進入 `is-immersive` 的競速修正**。
- **上午 39 頁、下午 44 頁，URL hash 對應關係**。
- **`Gemini Notebook` 現行命名**（不要改回 NotebookLM）。
- **版本號 query（目前 `?v=2026.08.18.14`）**：版本號不可移除，改版時須同步更新 HTML、`version.json` 與 `sw.js`。
- **投影片圖片點陣圖 + Hotspot 疊加架構**：不要因為「不是純 HTML 文字」就整套改寫。
- **來源不在 Git**：改正式包 HTML 的同時必須同步改來源腳本。

---

## 已知問題與技術債

| # | 問題 | 嚴重度 | 說明 |
|---|---|---|---|
| 1 | `qa_github_pages_site.mjs` 位於建置／QA 腳本目錄，不在 Pages site repo | 低 | encoded 中文路徑、動畫進場與公開 RWD QA 均通過；本輪已補動畫專項量測 |
| 2 | 正式包 Manifest 與實際檔案數 | 低 | 本輪未重驗；刪除重複 PDF 或重建 Manifest 需使用者決定 |
| 3 | 兩份簡報 PDF 共 83 頁有 structure-tree 警告 | 低 | 視覺渲染正常，PDF 可及性影響未確認 |
| 4 | SKILL 同步未做功能性測試 | 低 | 目錄存在，但各工具是否真的載入未測 |

---

## 需要阿凱老師本人決定（接手 Agent 不可自作主張）

1. 是否重建正式包 Manifest；本輪未重驗檔案數，且刪除重複 PDF 需老師明確決定。
2. 是否把建置腳本納入 Git 版控，解決「來源沒有 Git」的風險。
3. 是否修復簡報 PDF 的 tagged structure tree 可及性警告。
4. T-7（2026-08-19）與 T-24h（2026-08-25）用哪六個帳號、哪台投影設備做現場驗收。
5. Claude、Codex、Antigravity、Gemini 模型名稱與費用敘述是否要在活動前刷新（不可由 Agent 猜測）。

---

## 環境與外部服務狀態

- **Token 額度**：本對話已接近耗盡，這是換手原因；剩餘量未確認。
- **GitHub CLI**：`cagoooo` 已登入，push 權限可用。
- **公開站版本**：`version.json` HTTP 200，`"version": "2026.08.21.01"`。
- **Pages build 狀態**：本輪功能 commit `65cda07` 與公開驗證文件已推送，Pages API exit 0 回報 `status=built`；帶 `BASE_URL` 的公開站 QA exit 0。
- **OpenAI / ChatGPT / Claude / Gemini / Antigravity / Typeless 帳號與訂閱**：未確認。
- **中大現場網路、投影、麥克風**：未確認。
- **任何 token、API key、密碼**：本檔均無寫入。

---

## 下一步可直接複製的指令

### Step 1：取得最新狀態

```powershell
$repo='C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site'
$src='C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826'
$formal='C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0'
Set-Location $repo
git status --short
git log --oneline -10
git pull --ff-only
```

### Step 2：確認公開站版本與 Pages 狀態

```powershell
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status,url:.html_url}'
(Invoke-WebRequest -UseBasicParsing 'https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/version.json?cb=new').Content
```

### Step 3：重跑本機 HTML 簡報 QA（必跑）

```powershell
Set-Location $src
node qa_html_deck.mjs
```

### Step 4：重跑公開站 QA（本輪已完成；下次接手仍必跑）

```powershell
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'
node qa_github_pages_site.mjs
Remove-Item Env:BASE_URL
```

### Step 5：重跑正式包 QA（若本輪要動正式包才需要）

```powershell
$env:WORKSHOP_ROOT=$formal
node qa_workshop_suite.mjs
Remove-Item Env:WORKSHOP_ROOT

$env:HTML_ROOT=(Join-Path $formal '08_HTML簡報')
node qa_html_deck.mjs
Remove-Item Env:HTML_ROOT

node qa_ops_checklist.mjs
python qa_qr_codes.py   # 注意：需要系統 Python 3.10（有 cv2），不能用 bundled Python 3.12

$env:WORKSHOP_ROOT=$formal
node audit_local_links.mjs
Remove-Item Env:WORKSHOP_ROOT
```

---

## 給接手 Agent 的完整提示詞（可直接複製貼上）

```text
請接手「國立中央大學 2026-08-26 AI 教學與研究工作坊」專案。

開始前請完整閱讀（按順序，不可跳過）：
1. C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site\AGENTS.md
2. C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site\HANDOFF.md

讀完後再開始做任何事。

【當前狀態】
公開站版本：2026.08.21.01（version.json HTTP 200 已驗）
本機 HTML 簡報 QA：本輪 exit 0，`HTML deck QA passed.`，原圖檔上午 39 頁／下午 44 頁；HTML 動態版上午 40 頁／下午 50 頁
帶 BASE_URL 的公開站 QA：exit 0，`GitHub Pages site QA passed.`
Git 工作區：本輪交接文件修正後保持乾淨，main 分支；最新 commit 以 `git log --oneline -1` 為準

【本輪修復的 Bug（不要回退）】
1. 全螢幕跑版（靠頂、下方大黑底）→ 已修（CSS SSOT 置於最底層）
2. CSS／Service Worker 快取舊版不更新 → 已修（全 HTML 補 ?v=2026.08.21.01，並提升 SW BUILD_VERSION）
3. 全螢幕切換下一頁閃黑 → 已修（移除 enableHiResImage，雙緩衝重疊轉場 + img.decode()）
4. HTML 動態簡報長文字在固定舞台中截斷／重疊 → 已修（桌機長文字自然列高；觸控裝置改單欄自然增高 RWD）
5. HTML 動態簡報直接開啟時沒有 SW 更新通知 → 已修（新增 pwa-loader.js，三個動態頁均接上共用更新提示）
6. HTML 動態簡報頁面切換與區塊呈現缺少分層動態 → 已修（一般瀏覽器播放 CSS／GSAP 進場與轉場；HyperFrames seek timeline 保留；不輸出 MP4）
7. HTML 動態簡報長文字在桌機／手機／平板超出可視範圍 → 已修（桌機內容容器提供垂直捲動；觸控載具由舞台承接捲動；長句自動換行；換頁重設捲動位置）
8. HTML 動態簡報長標題上方裁切／換頁後捲動殘留／短高度桌機外層裁切 → 已修（溢位時從上方排列、所有內層容器換頁歸零、短高度桌機舞台自適應）

【接手後第一步】
先跑以下指令確認狀態，不要憑本檔數字直接做事：

  Set-Location 'C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site'
  git status --short
  git log --oneline -10
  gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}'
  (Invoke-WebRequest -UseBasicParsing 'https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/version.json?cb=new').Content

然後：
  cd ..\
  node qa_html_deck.mjs
  $env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'
  node qa_github_pages_site.mjs
  Remove-Item Env:BASE_URL

【已知技術債（確認是否需要本輪處理）】
- 來源與正式包驗收清單的「上午 34 頁」已同步修正為 39 頁，兩檔 SHA-256 相同
- qa_github_pages_site.mjs 現有 encoded 中文 pathname 測試已通過；腳本不在 Git，未擴大版控範圍
- 正式包 Manifest 與實際檔案數本輪未重驗；是否重建 Manifest 或處理重複 PDF 需老師決定
- 兩份簡報 PDF 共 83 頁有 structure-tree 警告（視覺正常，可及性未確認）

【需要阿凱老師決定，不可自作主張】
刪除重複 PDF、來源納入 Git、修復 PDF 可及性、切換教授帳號、變更模型名稱與方案敘述

【格式規範】
- 所有說明、commit、文件全部使用繁體中文
- 所有完成主張必須附實際指令、exit code 與數字；沒驗證的寫「未確認」
- 完成修改後跑完整測試、commit、push main，再確認 Pages status=built 與公開版本
- 不要在任何地方寫入 API key、token 或密碼
```
