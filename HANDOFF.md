# HANDOFF.md｜2026-08-23 本輪 Agent 交接（OpenClaw、Gemini 3.7 Flash 與個人體感保留）

稽核時間：2026-08-23（Asia/Taipei；本輪本機、正式包與公開部署均已重驗）

---

## 本輪最新完成：OpenClaw 起源、Gemini 3.7 Flash 與 20 倍個人體感（v2026.08.23.03）

- 下午新增第 6 頁「為什麼 Agent 會紅起來？從 OpenClaw 看見『長了手腳』」，完整說明聊天機器人如何透過 MCP、CLI、瀏覽器、檔案與主機工具走向 Agent；同頁保留 OpenClaw 官方網站與 GitHub QR／直接連結。
- 下午第 8 頁保留「Antigravity／Gemini 3.7 Flash 相較其他家 Agent，速度快 20 倍以上，像熱血年輕人」；這是阿凱老師的個人工作流體感，簡報與備註明確標註為個人觀察，不冒充官方 benchmark，也不刪除這項重要經驗。
- 下午第 14 頁新增 Gemini 3.7 Flash 工作馬與 Agent Harness 說明；官方連結保留。Human-in-the-loop 因新增頁面順延為第 7 頁；Antigravity Remote Control 為第 20–21 頁。
- 圖檔／PPTX 版與 HTML 版仍由同一套來源重建；`08_HTML簡報` 圖片、Hotspot、QR、雙緩衝與全螢幕 CSS SSOT 未被 HTML 專區取代；本輪沒有輸出 MP4。

本輪已完成的本機／正式包證據：

```text
node build_decks.mjs → exit 0；PPTX 上午 44 頁、下午 54 頁
node build_html_deck.mjs → exit 0；HTML decks exported: morning=44, afternoon=54
node sync_dynamic_deck.mjs → exit 0；morning=44、afternoon=54、version=2026.08.23.03
node qa_html_deck.mjs → exit 0；HTML deck QA passed
node qa_github_pages_site.mjs → exit 0；總覽 98 卡片／98 直達連結／下午篩選 54；場景上午／下午 264／324；垂直捲動各 6/6；捲動重設各 6/6、maxResidual=0
python -X utf8 qa_qr_codes.py → exit 0；151 rendered QR codes decoded
npx --yes hyperframes check "github_pages_site/09_HTML動態簡報" --json → exit 0；ok=true、lint/runtime/layout/motion/contrast 無 issue，contrast=99/99，lint filesScanned=3
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1）→ exit 0；上午 44/44、下午 54/54
node qa_fullscreen_animation.mjs → exit 0；4 個方向、16 個取樣、failures=0、pageErrors=0
正式包 PDF 匯出 → exit 0；上午 44 頁、下午 54 頁、合計 98 頁
正式包 HTML QA → exit 0；HTML deck QA passed；audit_local_links.mjs → exit 0；86 HTML files、176 local references；qa_workshop_suite.mjs → exit 0；Workshop suite QA passed
python -X utf8 rebuild_release_manifest.py <正式包> → exit 0；total=479、inventory=478、pdf=6、duplicate_pdf_groups=2、pptx=7
git commit -m "新增 OpenClaw 與 Gemini 3.7 Flash 教學內容" → exit 0；323776a
git push origin main → exit 0；5d9a3be..323776a，main → main
gh run watch 32606620803 --repo cagoooo/ncu-ai-agent-workshop-20260826 --exit-status → exit 0；build、report-build-status、deploy 全部成功
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status,url:.html_url}' → exit 0；status=built
Invoke-WebRequest version.json?cb=20260823-03-live → exit 0；HTTP 200、647 bytes、公開 version=2026.08.23.03、title=新增 OpenClaw Agent 起源與 Gemini 3.7 Flash 教學內容
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；公開總覽 98 卡片／98 直達連結／3 篩選器／下午 54 張；上午／下午 scenes=264／324、capability=264／324；垂直捲動各 6/6；捲動重設各 6/6、maxResidual=0
公開資料複核 → exit 0；`09_HTML動態簡報/data/afternoon.js` HTTP 200、94588 bytes，OpenClaw／Gemini 3.7 Flash／速度快 20 倍以上均存在；`08_HTML簡報/afternoon.html` HTTP 200、121796 bytes，afternoon-54.png 存在；afternoon-53.png／afternoon-54.png 均 HTTP 200；公開 CSS HTTP 200、53951 bytes，單一全螢幕動畫控制規則存在
```

## 目前進度表（2026-08-23；依本輪實際驗證更新）

本表將 **P0** 定義為公開站可用性、內容完整性與不可回退邊界；**P1** 定義為已交付的體驗能力、維護性與後續可選擴充。下表的「未採納」與「待本人決定」不代表永久不做，而是本輪不自行擴大範圍。

| 編號 | 優先級／狀態 | 項目 | 實際證據／數字 | 後續邊界 |
|---|---|---|---|---|
| P0-01 | 已完成／守門 | `08_HTML簡報` 圖檔版的全螢幕、雙緩衝切換、快取破壞、原有版面與新增教學內容 | `node build_decks.mjs` → exit 0；PPTX／圖檔版上午 44 頁、下午 54 頁，共 98 頁；`node qa_html_deck.mjs` → exit 0；本輪只從 `build_decks.mjs` 來源重建，既有 Hotspot、QR、雙緩衝與全螢幕邏輯保留 | 後續 HTML 動態功能不得改寫圖檔版的圖片、Hotspot、雙緩衝與全螢幕 CSS SSOT；若要再改內容，必須回到簡報來源重建 |
| P0-02 | 已完成／公開可用 | `09_HTML動態簡報` 98 頁內容可讀、長標題不裁切、長文字可捲動、桌機／手機／平板 RWD；操作型頁面改為語意化步驟／完成面板 | 本機與公開 `BASE_URL` 的 `node qa_github_pages_site.mjs` 均 exit 0；總覽 98 卡片／98 直達連結；上午 scenes=264、capability=264，下午 scenes=324、capability=324；兩場垂直捲動探針 viewports=6、passed=6；兩場捲動重設 maxResidual=0；桌機水平溢位=0；正式包 HTML QA → exit 0 | 後續不得以固定高度或隱藏溢位方式回退內容可讀性 |
| P0-03 | 已完成／公開可用 | Service Worker 更新提示、版本快取與 GitHub Pages 發布 | `gh run watch 32606620803 --repo cagoooo/ncu-ai-agent-workshop-20260826 --exit-status` → exit 0；`gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status,url:.html_url}'` → exit 0、`status=built`；`Invoke-WebRequest .../version.json?cb=20260823-03-live` → exit 0、HTTP 200、647 bytes、公開 version=`2026.08.23.03`；公開 `BASE_URL` QA → exit 0 | 每次發布都要重新確認 Pages `built`、`version.json` HTTP 200 與公開 QA |
| P0-04 | 已完成／隔離守門 | HTML 專區獨立於圖檔版；瀏覽器動態呈現，不把 MP4 輸出列為本輪成品 | `npx --yes hyperframes check "github_pages_site/09_HTML動態簡報" --json` → exit 0；`ok=true`、filesScanned=3、lint error/warning/info=0、runtime error/warning/info=0、layout totalIssueCount=0、motion ok=true（本次 CLI motion enabled=false、samples=0）、contrast=99/99；專區 README 保留「不需要輸出 MP4」邊界；08 圖檔架構未改寫 | 後續動態化仍以 HTML／CSS／GSAP／HyperFrames seek 為主；Remotion 若採用，須另列規格，不得取代既有圖檔版 |
| P1-01 | 已完成 | HTML 簡報入口、上午／下午場 composition、返回簡報首頁、鍵盤／觸控／單場快速總覽／跨場總覽專區／講者備註／閱讀模式／全螢幕 | `node qa_html_deck.mjs` → exit 0；圖檔版與 HTML 動態版均為上午 44 頁、下午 54 頁，共 98 頁 | 後續可在既有導覽上加功能，不重做場次資料結構 |
| P1-02 | 已完成 | CSS／GSAP 分層進場與轉場、HyperFrames 可 seek timeline、減少動態模式 | HTML browser motion QA → exit 0；samples=2、entering=true、transitioning=true、settled=true、overflow=0。HyperFrames check → exit 0；lint／runtime／layout 問題均為 0、contrast=99/99；CLI motion enabled=false、samples=0 | 目前是可用基線；更精緻的動態節奏列為候選 P1-A，尚未採納 |
| P1-03 | 已完成／公開可用 | 專區 favicon、PWA icon／manifest、LINE／Facebook／Twitter OG 預覽與公開 meta | 公開 `BASE_URL` QA → exit 0；總覽與 4 個動態頁的 meta／favicon／manifest 與資產契約均通過；公開 version=`2026.08.23.03`、OG PNG=1200×630 | 若要增加多組分享卡或動態預覽，另列候選，不改既有分享圖契約 |
| P1-04 | 基線完成／公開可用，仍有維護缺口 | QA 已涵蓋 encoded 中文路徑、短高度桌機、RWD、內層捲動、換頁捲動歸零、跨場總覽與公開站；QA 腳本仍在專案外層 | `node --check qa_github_pages_site.mjs` → exit 0；公開上午／下午捲動容器 264/264、324/324，探針與重設各 6/6、maxResidual=0；總覽卡片 98 張、直接連結 98 個、RWD 3 種尺寸；公開版本 `.03` | QA 腳本仍不在 Pages site repo，版控狀態需另行決定；可選 P1-E |
| P1-05 | 部分完成／仍有決策邊界 | 正式包 Manifest、實際檔案數與重複 PDF 盤點；來源腳本是否納入 Git、PDF structure-tree 可及性仍待決定 | `rebuild_release_manifest.py` → exit 0；正式包總數 479、SHA-256 inventory=478、missing=0、mismatch=0；正式包 PDF 6 份、重複 PDF 群組 2 組、PPTX 7 個；PDF 頁數上午 44、下午 54、合計 98；正式包 `audit_local_links.mjs` → exit 0（86 HTML、176 references）；`qa_workshop_suite.mjs` 與正式包 `qa_html_deck.mjs` 均 exit 0 | 重複 PDF 已依老師決定保留；不刪除原 v1.0 歷史清單；來源納入 Git 與 PDF 完整可及性驗收仍不自行決定 |
| P1-06 | 已完成／公開可用 | 901px 以上橫向全螢幕的內容放大、可用寬度釋放、長文垂直捲動與大型觸控螢幕相容 | `node qa_fullscreen_dynamic.mjs`（FULLSCREEN_ALL=1）→ exit 0；上午 44/44、下午 54/54，全螢幕舞台 1912×1078、水平溢位 0；第 4 頁標題 84.128px、說明 24.856px；公開 CSS `Invoke-WebRequest` → exit 0、HTTP 200、bytes=53951，單一動畫控制規則存在 | 僅改 `09_HTML動態簡報` CSS 最末層；不得回退既有手機／平板 RWD、長文捲動、轉場或 `08_HTML簡報` 圖檔架構 |
| P1-07 | 已完成／公開可用 | 跨上午／下午的 HTML 簡報總覽專區、場次篩選、關鍵字搜尋與指定頁直接跳轉 | `node qa_github_pages_site.mjs` → exit 0；總覽卡片 98 張（上午 44／下午 54）、直接連結 98 個、篩選按鈕 3 個；下午篩選 54 張；`Codex` 搜尋命中 32 張；RWD 393×852、932×430、820×1180 共 3 種尺寸均無水平溢位 | 維持 `overview.html` 為跨場索引；單場頁的 `O` 快速總覽保留，不互相取代 |
| P1-08 | 已完成／公開可用 | Antigravity Remote Control 下午場最新功能：手機瀏覽器接手桌面 Agent、啟用與遠端修正流程 | `node build_decks.mjs`／`node build_html_deck.mjs`／`node sync_dynamic_deck.mjs` 均 exit 0；Remote Control 實際為下午第 20–21 頁；公開 `09_HTML動態簡報/data/afternoon.js` HTTP 200 且官方來源與新頁資料存在；公開 `08_HTML簡報/afternoon.html` HTTP 200 | 官方功能逐步開放，需同一 Google 帳號、桌面端開啟 Remote Control 且主機保持連線；不得把 rollout／方案可用性寫成所有帳號已啟用 |
| P1-09 | 已完成／公開可用 | 操作型 HTML 投影片右側卡片 UI／UX：步驟、完成條件、編號、勾選、時間標籤與連結分層；避免最高卡片撐高同列空白 | `node --check github_pages_site/09_HTML動態簡報/assets/dynamic-deck.js` → exit 0；全螢幕上午 44/44、下午 54/54；HyperFrames `check` → exit 0、lint/runtime/layout/motion 問題 0、contrast=99/99；正式包 HTML QA → exit 0；公開 QA → exit 0 | 新增操作型頁面時優先提供清楚的步驟／驗收資料；不回寫 `08_HTML簡報` 圖檔內容 |
| P1-10 | 已完成／公開可用 | 全螢幕 HTML 互動轉場單一動畫控制：外層雙緩衝不再與 GSAP 重複淡入／模糊／縮放，保留內容分層進場 | `node qa_fullscreen_animation.mjs` → exit 0；1912×1078；上午／下午前進與後退共 4 個方向、16 個取樣、failures=0、pageErrors=0；`node qa_fullscreen_dynamic.mjs`（FULLSCREEN_ALL=1）→ exit 0；上午 44/44、下午 54/54、水平溢位=0；公開 CSS HTTP 200、bytes=53951、單一動畫控制規則存在；`08_HTML簡報` 未改投影片圖片 | 後續若要增加轉場效果，必須先通過全螢幕動畫 QA，不得讓投影片外層與內容層同時控制同一個 opacity／filter／transform |
| P1-11 | 已完成／公開可用 | 上午開場「降本增效」與下午 Human-in-the-loop 教學內容 | `node build_decks.mjs` → exit 0；PPTX 上午 44 頁、下午 54 頁；`node build_html_deck.mjs` → exit 0；HTML morning=44、afternoon=54；`node sync_dynamic_deck.mjs` → exit 0、version=`2026.08.23.03`；公開 `BASE_URL` QA → exit 0 且公開資料含新增文字 | 上午以開場標題／章節帶入「降本增效」；下午 Human-in-the-loop 實際為第 7 頁；圖檔版與 HTML 版均由同一來源重建 |
| P1-12 | 已完成／公開可用 | 下午新增「為什麼 Agent 會紅起來？」OpenClaw（小龍蝦）脈絡，以及 Gemini 3.7 Flash 工作馬與個人速度體感 | `node build_decks.mjs` → exit 0；OpenClaw 第 6 頁、工具比較第 8 頁、Gemini 3.7 Flash 第 14 頁；`python -X utf8 qa_qr_codes.py` → exit 0、151 rendered QR codes decoded；公開資料 HTTP 200 且 OpenClaw／Gemini 3.7 Flash／速度快 20 倍以上均存在；正式包 PDF 54 頁 | OpenClaw「爆紅」作為社群／教學脈絡，不宣稱單一事件造成產業因果；Gemini 官方能力與現場帳號可用性仍應分開說明 |

## 本輪完成：降本增效與 Human-in-the-loop 教學內容（v2026.08.23.01）

本輪把阿凱老師提出的兩個核心命題納入同一條簡報教學線：上午先以「降本增效」與文組 AI 大航海時代建立動機，下午再以 Human-in-the-loop 說明 Agent 閉環中人類如何監控、判斷與承擔責任。

- 上午開場標題加入「用 AI 降本增效，讓專業飛得更高更遠」；第 2 頁把「降本增效」接到文組的專業理解、脈絡與判斷，沒有插入新頁，因此仍為 44 頁。
- 下午既有第 6 頁改為「Human-in-the-loop：人在 Agent 閉環裡做決策」，以 4 張卡片說明 Agent 閉環、人監控方向、關鍵節點停下與可信交付；講者備註完整保留「全自動較快，但人類介入換取正確性、可追查性與責任清楚」的說明，因此仍為 52 頁。
- `08_HTML簡報` 圖檔版與 `09_HTML動態簡報` 均由 `build_decks.mjs` → `build_html_deck.mjs` → `sync_dynamic_deck.mjs` 重建／同步；既有圖片、Hotspot、QR、雙緩衝、全螢幕 CSS SSOT、RWD 與 HyperFrames 結構保留，沒有輸出 MP4。

本機與正式包的實際驗證：

```text
node --check build_decks.mjs／build_html_deck.mjs／sync_dynamic_deck.mjs／qa_html_deck.mjs／qa_github_pages_site.mjs → exit 0
node build_decks.mjs → exit 0；PPTX 上午 44 頁、下午 52 頁；本輪 1x／2K 圖檔輸出上午各 44 張、下午各 52 張（另有既存的 `@4k` 暫存檔，未納入 HTML 與正式包）
node build_html_deck.mjs → exit 0；HTML decks exported: morning=44, afternoon=52
node sync_dynamic_deck.mjs → exit 0；morning=44、afternoon=52、version=2026.08.23.01
node qa_html_deck.mjs → exit 0；HTML deck QA passed
node qa_github_pages_site.mjs → exit 0；總覽 96 卡片／96 直達連結／3 篩選器／下午 52 張／Codex 32 張；RWD 3 種尺寸；垂直捲動探針上午／下午各 6/6；捲動重設 maxResidual=0
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1，morning）→ exit 0；slides=44、passed=44、failures=0
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1，afternoon）→ exit 0；slides=52、passed=52、failures=0
node qa_fullscreen_animation.mjs → exit 0；1912×1078；4 個方向、16 個取樣、failures=0、pageErrors=0
python -X utf8 qa_qr_codes.py → exit 0；147 rendered QR codes decoded
npx --yes hyperframes check "github_pages_site/09_HTML動態簡報" --json → exit 0；ok=true、filesScanned=3、lint/runtime/layout 問題 0、contrast=99/99
正式包 PDF 匯出 → exit 0；上午 44 頁、下午 52 頁、合計 96 頁
python -X utf8 rebuild_release_manifest.py <正式包> → exit 0；total=474、inventory=473、pdf=6、duplicate_pdf_groups=2
正式包 node audit_local_links.mjs → exit 0；86 HTML files、176 local references
正式包 node qa_html_deck.mjs → exit 0；HTML deck QA passed
正式包 node qa_workshop_suite.mjs → exit 0；Workshop suite QA passed
git push origin main → exit 0；8b0d61c..c022544，main → main
gh run watch 32603641585 --repo cagoooo/ncu-ai-agent-workshop-20260826 --exit-status → exit 0；pages-build-deployment success
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status,url:.html_url}' → exit 0；status=built
Invoke-WebRequest version.json?cb=20260823-01-live → exit 0；HTTP 200、bytes=521、公開 version=2026.08.23.01
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；公開上午／下午 scenes=264／312、capability=264／312；總覽 96 卡片／96 直達連結／3 篩選器／下午 52 張／Codex 32 張；RWD 3 種尺寸；垂直捲動探針各 6/6；捲動重設 maxResidual=0
```

## 本輪完成：全螢幕 HTML 互動轉場單一動畫控制（v2026.08.22.05）

本輪針對桌機與大型觸控螢幕全螢幕切頁時出現的洗白、殘影與整頁模糊問題進行修正。根因是 `.dynamic-slide` 外層的 CSS `opacity／transform／filter` transition 與 `animateInteractiveScene()` 內的 GSAP 分層動畫同時作用；全螢幕時畫面放大，重複控制造成的中間幀更明顯。

本輪修正：

- 在 `09_HTML動態簡報/assets/dynamic-deck.css` 最底層加入互動模式 SSOT：`body.interactive-mode .dynamic-slide` 與 `.scene-transition` 的 CSS transition 統一關閉，保留雙緩衝堆疊與 GSAP 內容分層進場。
- 沒有修改 `dynamic-deck.js` 的換頁資料、場景時間軸或 HyperFrames seek 行為；沒有修改 `08_HTML簡報` 的投影片圖片、Hotspot、QR、雙緩衝與既有圖檔版 CSS 架構。
- 版本快取升至 `2026.08.22.05`，同步根目錄、`08_HTML簡報`、`09_HTML動態簡報`、Service Worker 與正式包；本輪不輸出 MP4。

本機、正式包與公開站證據：

```text
node --check qa_fullscreen_animation.mjs → exit 0
node qa_fullscreen_animation.mjs → exit 0；viewport=1912×1078；4 個方向、16 個取樣、failures=0、pageErrors=0
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1；morning）→ exit 0；44/44、failures=0、horizontalOverflow=0
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1；afternoon）→ exit 0；52/52、failures=0、horizontalOverflow=0
node qa_html_deck.mjs → exit 0；HTML deck QA passed
node qa_github_pages_site.mjs → exit 0；總覽 96 卡片／96 直達連結／3 篩選器；上午／下午場 scenes=264／312、capability=264／312；探針與重設各 6/6、maxResidual=0
$env:HTML_ROOT=<正式包>\08_HTML簡報；node qa_html_deck.mjs → exit 0；HTML deck QA passed
$env:WORKSHOP_ROOT=<正式包>；node audit_local_links.mjs → exit 0；86 HTML files、176 local references
$env:WORKSHOP_ROOT=<正式包>；node qa_workshop_suite.mjs → exit 0；Workshop suite QA passed
npx --yes hyperframes check "github_pages_site/09_HTML動態簡報" --json → exit 0；ok=true、filesScanned=3、lint/runtime/layout error/warning=0、contrast=99/99
git diff --check → exit 0
git commit -m "修正全螢幕 HTML 互動轉場動畫" → exit 0；8543a28；12 files changed
git push origin main → exit 0；faa6619..8543a28，main -> main
gh run watch 32576892833 --repo cagoooo/ncu-ai-agent-workshop-20260826 --exit-status → exit 0；build、report-build-status、deploy 全部成功
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status,url:.html_url}' → exit 0；status=built
(Invoke-WebRequest -UseBasicParsing 'https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/version.json?cb=20260822-05-live').Content → exit 0；HTTP 200、公開 version=2026.08.22.05
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'；node qa_github_pages_site.mjs；Remove-Item Env:BASE_URL → exit 0；GitHub Pages site QA passed；總覽 96 卡片／96 直達連結；上午／下午 scenes=264／312；探針與重設各 6/6、maxResidual=0
$r=Invoke-WebRequest -UseBasicParsing 'https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/09_HTML%E5%8B%95%E6%85%8B%E7%B0%A1%E5%A0%B1/assets/dynamic-deck.css?v=2026.08.22.05'；[PSCustomObject]@{status=$r.StatusCode;bytes=$r.RawContentLength;hasSingleAnimationControl=$r.Content.Contains('body.interactive-mode .dynamic-slide') -and $r.Content.Contains('transition: none !important')} | ConvertTo-Json -Compress → exit 0；`{"status":200,"bytes":53951,"hasSingleAnimationControl":true}`
```

以下以「操作型 HTML 簡報卡片 UI／UX 優化（v2026.08.22.04）」為上一輪歷史紀錄，保留當時的公開版本與 commit 證據，不回寫為本輪版本。

## 本輪完成：操作型 HTML 簡報卡片 UI／UX 優化（v2026.08.22.04）

本輪針對截圖所示的右側四張失衡卡片進行結構與 RWD 修正。根因是原本把「12 分鐘、操作步驟、完成條件、連結殘留」以換行文字塞入一般卡片；CSS 網格又會以同列最高卡片的高度撐大其他卡片，因此產生右上大空白、長文字不易閱讀與下方內容被推入捲軸的情況。

本輪修正：

- `09_HTML動態簡報/assets/dynamic-deck.js` 新增操作型文字解析：自動辨識操作步驟、合併續行文字、保留分鐘標籤、拆出完成條件，並把連結殘留交由底部既有連結列呈現。
- `09_HTML動態簡報/assets/dynamic-deck.css` 新增語意化面板樣式：雙欄面板不再被最高卡片撐高，步驟使用編號圓標、完成條件使用勾選圓標；手機／平板改為單欄垂直閱讀，全螢幕維持放大字級與可捲動能力。
- `08_HTML簡報` 只同步版本 query 以更新快取，沒有改寫投影片圖片、Hotspot、QR、雙緩衝切換或既有全螢幕架構；本輪沒有輸出 MP4。
- 正式包已同步 `08_HTML簡報`、`09_HTML動態簡報` 與版本檔；既有 PDF、重複 PDF 與歷史 Manifest 均保留。

本機、正式包與公開站證據：

```text
node --check github_pages_site/09_HTML動態簡報/assets/dynamic-deck.js → exit 0
node qa_html_deck.mjs → exit 0；HTML deck QA passed
python -X utf8 qa_qr_codes.py → exit 0；147 rendered QR codes decoded
node qa_github_pages_site.mjs → exit 0；總覽 96 卡片／96 直達連結／3 篩選器；本機 QA 通過
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1，morning）→ exit 0；44/44
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1，afternoon）→ exit 0；52/52
node qa_ops_checklist.mjs → exit 0；36 interactive items
node qa_workshop_suite.mjs → exit 0；Workshop suite QA passed
npx --yes hyperframes check "github_pages_site/09_HTML動態簡報" --json → exit 0；ok=true、filesScanned=3、lint/runtime/layout error/warning=0、contrast=99/99
$env:HTML_ROOT=<正式包>\08_HTML簡報；node qa_html_deck.mjs → exit 0；HTML deck QA passed
$env:WORKSHOP_ROOT=<正式包>；node audit_local_links.mjs → exit 0；86 HTML files、176 local references
$env:WORKSHOP_ROOT=<正式包>；node qa_workshop_suite.mjs → exit 0；Workshop suite QA passed
python -X utf8 rebuild_release_manifest.py <正式包> → exit 0；total=474、inventory=473、pdf=6、duplicate_pdf_groups=2
git diff --check → exit 0
git commit -m "優化 HTML 動態簡報操作卡片 UIUX" → exit 0；5a71889
git push origin main → exit 0；d905460..5a71889，main -> main
gh run watch 32573195188 --repo cagoooo/ncu-ai-agent-workshop-20260826 --exit-status → exit 0；pages-build-deployment 成功
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0；status=built
Invoke-WebRequest version.json?cb=20260822-04-live → exit 0；HTTP 200、公開 version=2026.08.22.04
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'；node qa_github_pages_site.mjs；Remove-Item Env:BASE_URL → exit 0；GitHub Pages site QA passed；上午／下午 scenes=264／312、capability=264／312；探針各 6/6；重設各 6/6、maxResidual=0
```

## 本輪完成：Antigravity Remote Control 下午場同步（v2026.08.22.03）

本輪依老師提供的最新功能消息，將 Antigravity Remote Control 納入下午場。內容以官方文件為依據：可從手機或其他瀏覽器連線到 Antigravity 2.0 桌面工作階段，查看進行中的對話、開始新任務、檢視計畫與 artifacts；官方目前標示為逐步開放，Google AI Ultra 方案優先，且桌面主機必須保持開機、未睡眠與連線。官方來源：`https://antigravity.google/docs/remote-control/`。

新增頁面：

- 下午第 18 頁「Antigravity 最新功能：手機也能接手電腦 Agent」：說明任務不中斷、手機瀏覽器接手、想到就即時修正與逐步開放限制。
- 下午第 19 頁「手機遠端修正：四步把工作接回來」：依序示範啟用、連線、選機、修正，並保留官方文件連結與講者備註。

同步邊界：

- `08_HTML簡報` 已由 `build_decks.mjs` 來源重建為上午 44 頁／下午 52 頁；新增 4 個新頁面圖檔（1x／2K），既有圖片、Hotspot、QR、雙緩衝與全螢幕架構保留。
- `09_HTML動態簡報` 已同步為上午 44 頁／下午 52 頁／總覽 96 頁；同一內容同時存在於 HTML 文字、分層動態、講者備註與正式包。沒有輸出 MP4，也沒有以 MP4 取代網頁簡報。
- 版本快取同步為 `2026.08.22.03`；SW、根目錄版本資訊、總覽、manifest、README 與正式包均同步。

本機、正式包與公開站證據：

```text
node --check build_decks.mjs／build_html_deck.mjs／sync_dynamic_deck.mjs／qa_html_deck.mjs／qa_github_pages_site.mjs → 均 exit 0
python -X utf8 generate_qr_assets.py → exit 0；Generated 63 QR assets
node build_decks.mjs → exit 0；Decks exported；PPTX 上午 44 頁、下午 52 頁
node build_html_deck.mjs → exit 0；HTML decks exported: morning=44, afternoon=52
node sync_dynamic_deck.mjs → exit 0；morning=44、afternoon=52、version=2026.08.22.03
python -X utf8 qa_qr_codes.py → exit 0；QR code QA passed: 147 rendered QR codes decoded
node qa_html_deck.mjs → exit 0；HTML deck QA passed
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1，morning）→ exit 0；slides=44、passed=44、failures=0
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1，afternoon）→ exit 0；slides=52、passed=52、failures=0
node qa_github_pages_site.mjs → exit 0；總覽 96 卡片／96 直達連結／3 篩選器／下午 52 張／Codex 32 張；RWD 3 種尺寸；公開與本機捲動探針各 6/6；重設 maxResidual=0
npx --yes hyperframes check "github_pages_site/09_HTML動態簡報" --json → exit 0；ok=true、filesScanned=3、lint/runtime/layout 問題 0、motion ok=true（CLI motion enabled=false、samples=0）、contrast=99/99
正式包 PDF 匯出 → exit 0；上午 44 頁、下午 52 頁、合計 96 頁
python -X utf8 rebuild_release_manifest.py <正式包> → exit 0；total=474、inventory=473、pdf=6、duplicate_pdf_groups=2
正式包 node audit_local_links.mjs → exit 0；86 HTML files、176 local references
正式包 node qa_html_deck.mjs → exit 0；HTML deck QA passed
正式包 node qa_workshop_suite.mjs → exit 0；Workshop suite QA passed
git diff --check → exit 0
git commit → exit 0；6860258 新增 Antigravity 手機遠端控制下午場內容
git push origin main → exit 0；2fb0dfe..6860258 main -> main
gh run watch 32555478160 --repo cagoooo/ncu-ai-agent-workshop-20260826 --exit-status → exit 0；pages-build-deployment success
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages → exit 0；status=built
Invoke-WebRequest version.json → exit 0；HTTP 200、公開 version=2026.08.22.03
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；GitHub Pages site QA passed；公開上午／下午 scenes=264／312、capability=264／312；探針與捲動重設各 6/6、maxResidual=0
公開 afternoon.js → exit 0；HTTP 200、Remote Control 標題與官方來源均存在
公開 08_HTML簡報/afternoon.html → exit 0；HTTP 200、afternoon-51／52 圖檔均存在
```

## 本輪完成：跨場 HTML 簡報總覽專區（v2026.08.22.02）

本輪新增 `09_HTML動態簡報/overview.html`，將上午 44 頁與下午 50 頁集中成 94 張可點選的 HTML 卡片；支援全部／上午／下午 3 種場次篩選、標題／章節／內容關鍵字搜尋、`/` 聚焦搜尋、`Esc` 清除搜尋，點擊後直接開啟對應的 `compositions/*.html#slide-N`。既有場次頁的單場快速總覽仍保留，並在總覽面板提供跨場專區入口。

入口與 RWD：HTML 動態簡報首頁新增「總覽專區」卡片；總覽頁在桌機以多欄卡片呈現，在手機／平板改為單欄或自適應欄位，保留鍵盤 focus-visible、觸控點擊與頁面垂直捲動；`08_HTML簡報` 只更新版本 query 以同步快取，投影片圖片、Hotspot、QR、雙緩衝與原有版面未改寫。

本機與正式包同步證據：

```text
node --check build_html_deck.mjs／sync_dynamic_deck.mjs／qa_html_deck.mjs／qa_github_pages_site.mjs／09_HTML動態簡報/assets/overview.js → 均 exit 0
node build_html_deck.mjs → exit 0；HTML decks exported: morning=44, afternoon=50
node sync_dynamic_deck.mjs → exit 0；morning=44、afternoon=50、version=2026.08.22.02
python 跨專案資產同步 → exit 0；copied=27、differing=0、overview_exists=True
python -X utf8 rebuild_release_manifest.py <正式包> → exit 0；total=470、inventory=469、pdf=6、duplicate_pdf_groups=2
```

公開部署證據（本輪功能 commit `e24bd3e`）：

```text
git push origin main → exit 0；6e1dfc6..e24bd3e，main -> main
gh run watch 32540418974 --repo cagoooo/ncu-ai-agent-workshop-20260826 --exit-status → exit 0；build、deploy、report-build-status 全部成功
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status,url:.html_url}' → exit 0；status=built
Invoke-WebRequest version.json?cb=20260822-02-live → exit 0；HTTP 200、公開 version=2026.08.22.02
Invoke-WebRequest 09_HTML動態簡報/overview.html?cb=20260822-02-live → exit 0；HTTP 200、Bytes=5858、總覽資料腳本與上午／下午資料均存在
Invoke-WebRequest 09_HTML動態簡報/assets/dynamic-deck.css?v=2026.08.22.02 → exit 0；HTTP 200、Bytes=47986、總覽與全螢幕 CSS 規則存在
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；總覽 94 卡片／94 直達連結／3 篩選器／下午 50 張／Codex 31 張／RWD 3 種尺寸；GitHub Pages site QA passed.
```

## 本輪完成：大型螢幕全螢幕 HTML 呈現優化（v2026.08.22.01）

本輪只在 `09_HTML動態簡報/assets/dynamic-deck.css` 最底層加入大型螢幕全螢幕覆寫：限定 `min-width:901px` 且橫向時放大標題、說明、內容卡片、章節標籤與連結，釋放內容可用寬度；同時保留 `scene-content`、`scene-copy`、`scene-body` 的垂直捲動。`08_HTML簡報` 的投影片圖片、Hotspot、QR、雙緩衝切換與既有全螢幕 CSS SSOT 沒有改寫；版本 query 只用於快取更新。

本機實際驗證：

```text
node --check build_html_deck.mjs／sync_dynamic_deck.mjs／qa_html_deck.mjs／qa_github_pages_site.mjs／09_HTML動態簡報/assets/dynamic-deck.js／09_HTML動態簡報/assets/pwa-loader.js／pwa-register.js／sw.js → 均 exit 0
node sync_dynamic_deck.mjs → exit 0；morning=44、afternoon=50、version=2026.08.22.01
node qa_html_deck.mjs → exit 0；HTML deck QA passed
node qa_github_pages_site.mjs → exit 0；GitHub Pages site QA passed；上午／下午 scenes=264／300、capability=264／300；垂直捲動探針各 6/6；捲動重設各 6/6、maxResidual=0
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1，morning）→ exit 0；slides=44、passed=44、failures=0
node qa_fullscreen_dynamic.mjs（FULLSCREEN_ALL=1，afternoon）→ exit 0；slides=50、passed=50、failures=0
node qa_fullscreen_dynamic.mjs（原生 Fullscreen API，1912×1078）→ exit 0；舞台=1912×1078、標題=84.128px、說明=24.856px、水平溢位=0
node qa_ops_checklist.mjs → exit 0；36 interactive items
python -X utf8 qa_qr_codes.py → exit 0；145 rendered QR codes decoded
node qa_workshop_suite.mjs → exit 0；Workshop suite QA passed
WORKSHOP_ROOT=<正式包> node audit_local_links.mjs → exit 0；85 HTML files、161 local references
HTML_ROOT=<正式包>\08_HTML簡報 node qa_html_deck.mjs → exit 0；HTML deck QA passed
npx --yes hyperframes lint／validate／inspect／check 09_HTML動態簡報 → 均 exit 0；filesScanned=3、WCAG AA=94、timeline samples=9、layout issues=0、contrast=87/87
python -X utf8 rebuild_release_manifest.py <正式包> → exit 0；total=468、inventory=467、pdf=6、duplicate_pdf_groups=2
```

公開部署驗證：

```text
git push origin main → exit 0；c5f4ec9..2b05af3 main -> main
gh run watch 32536277797 --repo cagoooo/ncu-ai-agent-workshop-20260826 --exit-status → exit 0；build、report-build-status、deploy 均 success
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0；status=built
Invoke-WebRequest -UseBasicParsing 'https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/version.json?cb=20260822-01-live-2' → exit 0；HTTP 200、version=2026.08.22.01
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；GitHub Pages site QA passed；公開上午／下午 scenes=264／300、capability=264／300，兩場垂直捲動探針均 viewports=6、passed=6，兩場捲動重設 maxResidual=0
Invoke-WebRequest '.../09_HTML動態簡報/assets/dynamic-deck.css?v=2026.08.22.01' → exit 0；HTTP 200、bytes=37144、大型螢幕全螢幕規則存在
```

## 本輪新增上午開場「文組的 AI 大航海時代／大藍海時代」（v2026.08.21.04）

本輪依阿凱老師的新想法，在上午場標題頁之後、原有內容之前新增 4 頁開場，將「文組專業 × AI／Agent 技術翅膀」定位為研習的第一個共同命題。內容採正向的能力互補表述：不是文理對立，而是文組的理解、脈絡、辨識、表達、教育／研究判斷與倫理，透過 Agent 補上技術執行能力，形成新的大藍海。

- 第 2 頁：`文組的 AI 大航海時代`——帶著既有專業理解與判斷，進入 AI／Agent 開出的新藍海。
- 第 3 頁：`多一雙翅膀：不會寫程式，也能做出作品`——以 Red Bull／如虎添翼的比喻，說明非程式背景者也能指派 Agent 完成程式與作品；人仍負責目標、脈絡、驗證與責任。
- 第 4 頁：`文組的底子，就是 AI 時代的導航能力`——聚焦理解人與情境、辨識與判斷、語言與敘事、教育／研究倫理 4 項底層優勢。
- 第 5 頁：`大藍海的邀請：帶著你的專業出航`——以真問題、清楚脈絡、Agent 執行、人來驗證、回到生活 5 步驟收束，呼籲教授與社群成員帶著自己的專業變得更強大。

來源與同步路徑：`build_decks.mjs` → PPTX／PDF／`08_HTML簡報`，`build_html_deck.mjs` → HTML 文字簡報，`sync_dynamic_deck.mjs` → `09_HTML動態簡報` 公開資料。兩個 HTML 專區均保留完整文字與講者備註；圖檔版仍是既有圖片＋Hotspot 架構，不輸出 MP4。

本機已完成的實際驗證：

```text
node --check build_decks.mjs → exit 0
node build_decks.mjs → exit 0；PPTX 上午 44 頁、下午 50 頁
node --check build_html_deck.mjs → exit 0
node build_html_deck.mjs → exit 0；HTML decks exported: morning=44, afternoon=50
node sync_dynamic_deck.mjs → exit 0；Dynamic decks synced: morning=44, afternoon=50, version=2026.08.21.04
node qa_html_deck.mjs → exit 0；HTML deck QA passed；圖檔版上午 44 頁、下午 50 頁，共 94 頁
node qa_github_pages_site.mjs → exit 0；上午／下午 scenes=264／300、capability=264／300；垂直捲動探針各 6/6；捲動重設各 6/6、maxResidual=0
PDF 頁數檢查 → exit 0；上午 PDF=44 頁、下午 PDF=50 頁
node qa_ops_checklist.mjs → exit 0；36 interactive items
python -X utf8 qa_qr_codes.py → exit 0；145 rendered QR codes decoded
WORKSHOP_ROOT=<正式包> node audit_local_links.mjs → exit 0；85 HTML files、161 local references
node qa_workshop_suite.mjs → exit 0；Workshop suite QA passed
HTML_ROOT=<正式包>\08_HTML簡報 node qa_html_deck.mjs → exit 0；HTML deck QA passed
npx --yes hyperframes lint／validate／inspect／check 09_HTML動態簡報 → 均 exit 0；filesScanned=3、WCAG AA=94、timeline samples=9、layout issues=0、contrast=87/87
python -X utf8 rebuild_release_manifest.py <正式包> → exit 0；total=468、inventory=467、pdf=6、duplicate_pdf_groups=2
```

部署後公開驗證：

```text
git push origin main → exit 0；7d35bcd..a9c1a50 main -> main
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0；status=built
Invoke-WebRequest -UseBasicParsing 'https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/version.json?cb=20260821-04-live-2' → exit 0；HTTP 200、version=2026.08.21.04
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；GitHub Pages site QA passed；公開上午／下午 scenes=264／300、capability=264／300，兩場垂直捲動探針均 viewports=6、passed=6，兩場捲動重設 maxResidual=0
```

### RDQ 後續候選索引（未採納，等老師挑選）

| 候選編號 | 方向 | 主要內容 | 預估代價／風險 | 建議驗收 |
|---|---|---|---|---|
| P1-A | 動態精緻化 | 依頁型加入 stagger、段落 reveal、卡片連續編排、背景 orb 微動態、轉場語意；同步維護 GSAP 與 HyperFrames seek | 中至高；需維持目前 96 頁不溢位、減少動態與鍵盤／觸控可用性 | motion QA、reduced-motion、96 頁邊界與 HyperFrames 檢查全數通過 |
| P1-B | 講者模式與導覽 | 章節目錄、頁面搜尋、URL deep link、演講計時器、講者視窗／備註、快速跳頁與目前頁分享 | 中；會增加導覽狀態、視窗同步與手機版操作複雜度 | 鍵盤／觸控／瀏覽器返回、三種主要尺寸與重新整理後 deep link 均通過 |
| P1-C | 無障礙與閱讀模式 | focus-visible、跳至主要內容、ARIA 語意、放大至 200%、高對比、完整鍵盤操作、讀屏文字順序與更完整的 reduced-motion | 中；部分版面需調整，不能只靠顏色或動畫傳達資訊 | 自動檢查加鍵盤人工走查；目前 HyperFrames contrast=99/99，完整 PDF/UA 與人工讀屏仍逐項留證 |
| P1-D | 效能、離線與更新韌性 | 首屏優先、目前／下一頁預載、低網速測試、離線 fallback、SW 更新回復、長時間播放記憶體檢查 | 中；需維護快取策略與兩種網路狀態 | 冷啟動、慢網路、離線、更新提示與重新載入均有可重現指令和結果 |
| P1-E | 內容建置與視覺 QA 自動化 | `deck-data` 單一來源、HTML 重新生成、長文字／頁數 lint、encoded pathname 覆蓋、逐頁 screenshot／視覺差異報告 | 高；可能觸及來源不在 Git、建置腳本與正式包同步方式 | `08_HTML簡報` 圖檔版與 `09_HTML動態簡報` 均為上午 44／下午 52 頁；內容變更後仍須通過圖檔渲染、HTML 文字溢位、連結、版本與視覺差異檢查 |

本索引只供挑選，不是已確認的 RDQ 規格卡；老師選定編號後，下一輪再針對該方向建立 `draft` 規格卡、列出待確認假設與驗收條件，確認前不開始製作。

## 歷史紀錄：HTML 入口頁數文案與快取修正（v2026.08.21.03；已部署公開站重驗）

本輪先處理已確認的可見技術債：`08_HTML簡報` 分支入口仍顯示過時的「83 頁原生文字場景」，已回到 `build_html_deck.mjs` 建置來源修正為「90 頁原生文字場景（上午 40／下午 50）」；沒有改動投影片圖片、Hotspot、QR、雙緩衝切換或全螢幕邏輯。

- HTML 建置版本提升為 `2026.08.21.03`，同步更新 `version.json`、`sw.js`、相關 HTML query 與 QA 預期值，避免舊 Service Worker 快取入口文案。
- `qa_github_pages_site.mjs` 修正動態 favicon 的 encoded pathname，補回 `09_HTML%E5%8B%95%E6%85%8B%E7%B0%A1%E5%A0%B1` 中遺漏的 `%E6%85%8B`；這是測試判斷修正，不是放寬資產檢查。

本機實際驗證：

```text
node build_html_deck.mjs → exit 0；HTML decks exported: morning=40, afternoon=50
node qa_html_deck.mjs → exit 0；HTML deck QA passed
node qa_github_pages_site.mjs → exit 0；動態 motion overflow=0；上午／下午 scenes=240／300、capability=240／300；垂直捲動探針各 6/6；捲動重設各 6/6、maxResidual=0
node qa_workshop_suite.mjs → exit 0；Workshop suite QA passed
node qa_ops_checklist.mjs → exit 0；36 interactive items
python -X utf8 qa_qr_codes.py → exit 0；145 rendered QR codes decoded
npx --yes hyperframes check "github_pages_site/09_HTML動態簡報" --json → exit 0；filesScanned=3、runtime errorCount=0、layout totalIssueCount=0、contrast checked/passed=87/87
```

部署後公開驗證：

```text
git push origin main → exit 0；main 已推送 commit c26a9e5
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0；status=built
Invoke-WebRequest version.json?cb=20260821-03-live → exit 0；HTTP 200、version=2026.08.21.03
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；GitHub Pages site QA passed；公開上午／下午 scenes=240／300、capability=240／300，兩場垂直捲動探針均 viewports=6、passed=6，兩場捲動重設 maxResidual=0
```

## 歷史紀錄：圖檔／HTML 內容同步（v2026.08.21.02；已部署公開站重驗）

本輪依老師指示，將已完成的 Agent 時代與人生哲學內容同步納入上午／下午兩種版本：`08_HTML簡報` 圖檔版與 `09_HTML動態簡報` HTML 版均由同一批內容重新建置；既有圖檔版型、Hotspot、QR、雙緩衝切換與全螢幕 CSS SSOT 均保留，沒有改成 MP4。

- 上午圖檔版新增第 39 頁「效率提高之後，省下的時間要還給人生」，資源書籤順延為第 40 頁；實際頁數由 39 頁更新為 40 頁。
- 下午圖檔版新增第 44–49 頁 Agent 人生反思章節，依序涵蓋超能力、從做不到到我可以、多巴胺與一人公司、效率陷阱、Harness 反思、情緒價值，以及把時間還給人生；資源書籤順延為第 50 頁，實際頁數由 44 頁更新為 50 頁。
- HTML 動態版同步為上午 40 頁、下午 50 頁；完整內容保留在 HTML 完整文字／講者備註，舞台使用既有分段卡片與流程版型，避免長文造成跑版。
- 來源檔案為 `C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\build_decks.mjs` 與 `build_html_deck.mjs`；正式包同步包含更新後的 PPTX、PDF、`08_HTML簡報` 與 `09_HTML動態簡報`。

本輪已完成的實際驗證：

```text
node --check build_decks.mjs → exit 0
node build_decks.mjs → exit 0；PPTX 渲染頁數：上午 40 頁、下午 50 頁
node --check build_html_deck.mjs → exit 0
node build_html_deck.mjs → exit 0；HTML decks exported: morning=40, afternoon=50
node qa_html_deck.mjs → exit 0；HTML deck QA passed；圖檔版上午 40 頁、下午 50 頁，共 90 頁
PDF 頁數檢查 → exit 0；上午 PDF=40 頁、下午 PDF=50 頁
圖檔／HTML／正式包資產同步 → exit 0；HTML 檔 218 個、HTML 投影片 PNG 180 個、圖檔版 PPTX 2 個、圖檔版 PDF 4 個
```

部署後公開驗證：

```text
git push origin main → exit 0；main 已推送 commit 79049db
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status}' → exit 0；status=built
Invoke-WebRequest version.json?cb=20260821-02-2 → exit 0；HTTP 200、version=2026.08.21.02
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'; node qa_github_pages_site.mjs; Remove-Item Env:BASE_URL → exit 0；GitHub Pages site QA passed；公開上午／下午 scenes=240／300、capability=240／300，兩場垂直捲動探針均 viewports=6、passed=6，兩場捲動重設 maxResidual=0
```

正式包 Manifest 已依本輪實際檔案重建為 `RELEASE_MANIFEST_v1.1.txt`；原 `RELEASE_MANIFEST_v1.0.txt` 與 2 組內容完全相同的備援 PDF 均保留。Manifest 完整性核對 → exit 0；inventory=456、實際總數=457、missing=0、mismatch=0、duplicate_pdf_groups=2。正式包 `node qa_workshop_suite.mjs` 與 `node qa_html_deck.mjs` 均 exit 0；HTML QA 為上午 40 頁、下午 50 頁。來源納入 Git 與 PDF 完整 PDF/UA 可及性驗收仍維持老師決策邊界。

## 歷史紀錄：本輪新增 HTML 動態內容（v2026.08.21.01；已部署公開站確認）

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
- **公開版本**：`2026.08.22.03`，`version.json` HTTP 200 已確認。
- **本輪功能 commit**：`6860258 新增 Antigravity 手機遠端控制下午場內容`；本檔更新提交後，以 `git log --oneline -1` 實際確認文件 commit 與工作區狀態。
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

## 歷史紀錄：前一輪已完成且「實際驗證過」的事

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

1. **來源腳本是否納入 Git**：目前 Git 僅追蹤 GitHub Pages 公開站；來源與 QA 腳本仍在專案外層，需老師決定是否擴大版控範圍。
2. **兩份簡報 PDF 共 96 頁的 structure-tree 可及性**：PDF 頁數已重建並驗證為上午 44、下午 52，但完整 PDF/UA 可及性與人工讀屏驗收仍未確認。
3. **各工具是否實際載入全域 SKILL**：目錄存在，但功能性載入測試未做。

---

## 刻意保留、不要順手改掉

- **2K 而非 4K**：4K 載入延遲並出現底部黑邊；未取得新證據前不要恢復。
- **雙緩衝重疊切換（`is-previous` + `img.decode()`）**：本輪核心修復，不要動。
- **全螢幕第一下先進入 `is-immersive` 的競速修正**。
- **上午 44 頁、下午 52 頁，URL hash 對應關係**；下午第 18–19 頁為 Antigravity Remote Control 新增內容。
- **`Gemini Notebook` 現行命名**（不要改回 NotebookLM）。
- **版本號 query（目前 `?v=2026.08.22.03`）**：版本號不可移除，改版時須同步更新 HTML、`version.json` 與 `sw.js`。
- **投影片圖片點陣圖 + Hotspot 疊加架構**：不要因為「不是純 HTML 文字」就整套改寫。
- **來源不在 Git**：改正式包 HTML 的同時必須同步改來源腳本。

---

## 已知問題與技術債

| # | 問題 | 嚴重度 | 說明 |
|---|---|---|---|
| 1 | `qa_github_pages_site.mjs` 位於建置／QA 腳本目錄，不在 Pages site repo | 低 | encoded 中文路徑、動畫進場與公開 RWD QA 均通過；本輪已補動畫專項量測 |
| 2 | 更新後兩份簡報 PDF 共 96 頁的 structure-tree 可及性 | 低 | PDF 頁數已驗證為上午 44、下午 52；完整 PDF/UA 與人工讀屏可及性仍未確認 |
| 3 | SKILL 同步未做功能性測試 | 低 | 目錄存在，但各工具是否真的載入未測 |

---

## 需要阿凱老師本人決定（接手 Agent 不可自作主張）

1. 是否把建置腳本納入 Git 版控，解決「來源沒有 Git」的風險。
2. 是否修復簡報 PDF 的 tagged structure tree 可及性警告，並進行完整 PDF/UA 與人工讀屏驗收。

---

## 環境與外部服務狀態

- **Token 額度**：本對話已接近耗盡，這是換手原因；剩餘量未確認。
- **GitHub CLI**：`cagoooo` 已登入，push 權限可用。
- **公開站版本**：`version.json` HTTP 200，`"version": "2026.08.21.01"`。
- **Pages build 狀態**：本輪功能 commit `65cda07` 與公開驗證文件已推送，Pages API exit 0 回報 `status=built`；帶 `BASE_URL` 的公開站 QA exit 0。
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
公開版本：2026.08.22.03（version.json HTTP 200 已驗）
本機 HTML 簡報 QA：本輪 exit 0，`HTML deck QA passed.`，圖檔版上午 44 頁／下午 52 頁，共 96 頁；HTML 動態版上午 44 頁／下午 52 頁；下午新增第 18–19 頁 Antigravity Remote Control
帶 BASE_URL 的公開站 QA：exit 0，`GitHub Pages site QA passed.`；公開上午／下午 scenes=264／312、capability=264／312，兩場垂直捲動探針均 viewports=6、passed=6，兩場捲動重設 maxResidual=0
Git 工作區：main；公開驗證證據已補入本檔，提交後以 `git status --short` 確認乾淨；最新 commit 以 `git log --oneline -1` 為準

【本輪修復的 Bug（不要回退）】
1. 全螢幕跑版（靠頂、下方大黑底）→ 已修（CSS SSOT 置於最底層）
2. CSS／Service Worker 快取舊版不更新 → 已修（全 HTML 補 ?v=2026.08.22.03，並提升 SW BUILD_VERSION）
3. 全螢幕切換下一頁閃黑 → 已修（移除 enableHiResImage，雙緩衝重疊轉場 + img.decode()）
4. HTML 動態簡報長文字在固定舞台中截斷／重疊 → 已修（桌機長文字自然列高；觸控裝置改單欄自然增高 RWD）
5. HTML 動態簡報直接開啟時沒有 SW 更新通知 → 已修（新增 pwa-loader.js，四個動態頁均接上共用更新提示）
6. HTML 動態簡報頁面切換與區塊呈現缺少分層動態 → 已修（一般瀏覽器播放 CSS／GSAP 進場與轉場；HyperFrames seek timeline 保留；不輸出 MP4）
7. HTML 動態簡報長文字在桌機／手機／平板超出可視範圍 → 已修（桌機內容容器提供垂直捲動；觸控載具由舞台承接捲動；長句自動換行；換頁重設捲動位置）
8. HTML 動態簡報長標題上方裁切／換頁後捲動殘留／短高度桌機外層裁切 → 已修（溢位時從上方排列、所有內層容器換頁歸零、短高度桌機舞台自適應）
9. HTML 簡報頁數多、跨場跳轉不便 → 已修（新增 `overview.html`，96 張卡片、3 種場次篩選、關鍵字搜尋與指定頁直接跳轉）
10. Antigravity 最新 Remote Control 尚未納入下午場 → 已修（新增下午第 18–19 頁；同步 PPTX、PDF、08 圖檔版、09 HTML 動態版與正式包；官方功能仍標示逐步開放）

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
- 正式包 Manifest 已重建為 v1.1；實際總數 474、SHA-256 inventory=473、missing=0、mismatch=0；PDF 6 份、2 組重複 PDF 保留；兩份簡報 PDF 為上午 44／下午 52 頁；原 v1.0 歷史清單保留
- qa_github_pages_site.mjs 現有 encoded 中文 pathname 測試已通過；腳本不在 Git，未擴大版控範圍
- 更新後兩份簡報 PDF 共 96 頁（上午 44、下午 52）的完整 PDF/UA 與人工讀屏可及性仍未確認（視覺頁數已驗證）

【需要阿凱老師決定，不可自作主張】
來源納入 Git、修復 PDF 可及性

【格式規範】
- 所有說明、commit、文件全部使用繁體中文
- 所有完成主張必須附實際指令、exit code 與數字；沒驗證的寫「未確認」
- 完成修改後跑完整測試、commit、push main，再確認 Pages status=built 與公開版本
- 不要在任何地方寫入 API key、token 或密碼
```
