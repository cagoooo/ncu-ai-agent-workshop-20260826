# HANDOFF.md｜2026-08-16 下一位 Agent 交接

稽核時間：2026-08-16 13:20（Asia/Taipei）

## 一句話狀態

工作坊公開站已上線至 `2026.08.16.42`：大幅升級簡報正下方【💡 核心架構概念看板（Concept Spotlight）】之排版與文字大小（標題 17~19px 粗體、內文 15~16px 高對比易讀、外加精緻雙層毛玻璃邊框與立體光暈），在一般與全螢幕投影模式下皆大氣清晰；全套 6 大測試矩陣全部 PASS（Exit Code 0）。

## 接手前先讀

1. `C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site\AGENTS.md`
2. 本檔：`C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site\HANDOFF.md`
3. 專案根 README 與 `RELEASE_MANIFEST_v1.0.txt`

不要把本檔的測試快照當成永久真相；開始工作時重跑 Git 與相關測試。

## 工作區與版本狀態

- Git repo：`C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site`
- 來源／建置／QA：`C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826`
- 正式包：`C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0`
- 分支：`main`
- 公開版本：`2026.08.16.42`
- GitHub Pages：`status=built`，來源 `main / root`
- 公開網址：https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/

測試前實際執行：

```powershell
Set-Location 'C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site'
git status --short
git status --branch --short
git log --oneline -10
```

當時最近 10 筆提交：

```text
ec64f68 🎙️ 加入 ChatGPT Codex 原生語音模式
1455542 ✨ 上午場新增 Typeless 語音輸入實作
7f962ab ⚡ 改用2K素材降低首次全螢幕負載
bbdc81c 🐛 修正首次全螢幕底部黑邊
9b298d0 🐛 修正全螢幕快取與首次切換競速
c2f7420 🐛 修正首次進入全螢幕舞台未滿版
cfd7c3a 🐛 修正首頁 deck.css 缺失導致的樣式崩壞
e57bca1 ✨ 新增4K高解析全螢幕簡報素材
24aacc7 🧩 補充研究與行政痛點案例並更新版本
ca71e9c 🎯 以教學與研究痛點串起工具與 Agent 主軸
```

## 已完成且本輪實際驗證過

### 1. 正式包的互動工具與分支頁

以 `WORKSHOP_ROOT` 明確指向正式包執行：

```powershell
Set-Location 'C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826'
$env:WORKSHOP_ROOT='C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0'
node qa_workshop_suite.mjs
Remove-Item Env:WORKSHOP_ROOT
```

結果：exit 0，`Workshop suite QA passed.`，14.49 秒。實際涵蓋：12 張案例卡、10 個學員任務、11 個分支返回按鈕、11 個 390×844 行動頁、PIRLS 18 筆範例／6 題／86.1% 整體答對率／18 筆 AI 初編匯入、Skill ZIP、Agent 證據 ZIP、跨平台 Skill 驗證器、123 筆案例篩選器與三平台部署精靈。

### 2. 正式包 HTML 簡報、RWD、全螢幕與可點擊連結

```powershell
$env:HTML_ROOT='C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0\08_HTML簡報'
node qa_html_deck.mjs
Remove-Item Env:HTML_ROOT
```

結果：exit 0，`HTML deck QA passed.`，25.45 秒。上午 39 頁、下午 44 頁；兩場都測了第一次與第二次全螢幕、立即隱藏工具列、舞台寬度至少 viewport 的 90%、2K 資產升級、平台與 QR hotspot 點擊、鍵盤換頁、轉場殘影、備註、閱讀模式、總覽、手機直式 393×852、手機橫式 932×430、平板直式 820×1180、平板橫式 1180×820、沉浸模式進出與垂直置中，0 個失敗。

### 3. 場務手冊互動

```powershell
node qa_ops_checklist.mjs
```

結果：exit 0；36 個核取項目、勾選保存、重新整理還原、備註保存、清除、桌機與 390×844 行動版皆通過。

### 4. QR Code

```powershell
python qa_qr_codes.py
```

結果：exit 0；`145 rendered QR codes decoded`，145/145 解碼通過，6.55 秒。注意：這支需要目前 Windows Store Python 3.10 的 `cv2 4.13.0`；bundled Python 3.12 沒有 `cv2`。

### 5. PowerPoint 結構與溢位

用 bundled `slides_test.py` 並設定 `RUNTIME_NODE`、`RUNTIME_NODE_MODULES`、`RUNTIME_BIN_DIR` 後執行兩份 PPTX：

- 上午：39 張投影片、39 張講者備註，`Test passed. No overflow detected.`
- 下午：44 張投影片、44 張講者備註，`Test passed. No overflow detected.`
- 兩份測試各約 24.2 秒，exit 0。

可複製的環境設定：

```powershell
$env:RUNTIME_NODE='C:\Users\smes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$env:RUNTIME_NODE_MODULES='C:\Users\smes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$env:RUNTIME_BIN_DIR='C:\Users\smes\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\override'
$py='C:\Users\smes\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$test='C:\Users\smes\.codex\plugins\cache\openai-primary-runtime\presentations\26.813.12317\skills\presentations\container_tools\slides_test.py'
& $py $test 'C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0\01_簡報\上午場_打造專屬AI教學與研究工作室_20260826.pptx'
& $py $test 'C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0\01_簡報\下午場_打造會做事的AI教學與研究夥伴_資料分析實戰_20260826.pptx'
```

### 6. 本機與公開 GitHub Pages

```powershell
node qa_github_pages_site.mjs
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'
node qa_github_pages_site.mjs
Remove-Item Env:BASE_URL
```

結果：本機 exit 0（22.39 秒），公開站 exit 0（26.29 秒）。測到根目錄與簡報主頁、favicon、OG、canonical、Service Worker、立即更新流程、3 種首頁 RWD、提示詞面板 5 種 viewport、3 個 P1 工具、123 筆 JSON、公開 PDF／HTML 資源與版本快取字串。

GitHub API 實際回報：`status=built`、`source=main / root`。`gh auth status` 顯示 `cagoooo` 已登入，Git push 使用 HTTPS；不要把遮罩 token 寫入檔案。

### 7. 本機連結、Hash、語法與安全掃描

- `audit_local_links.mjs`：正式包 79 份 HTML、123 個本機相對資源參照，0 缺漏。
- Release Manifest 核心 SHA-256：正式包 28/28 相符；GitHub repo 28/28 相符。
- 語法：10 支 `.mjs` 全部 `node --check` 通過；3 支 `.py` 全部 `ast.parse` 通過。
- 公開 repo 安全字串精準掃描：實際 `href/src=file:///`、錯誤校名全稱、常見 Google/GitHub token 樣式為 0。寬鬆掃描曾出現 4 筆，但都是文件描述禁用字串或驗證器規則，屬誤報。

### 8. 這輪新增的 Typeless × ChatGPT／Codex Voice

- 公開 `version.json`：HTTP 200，版本 `2026.08.15.32`。
- 公開上午與下午 HTML：HTTP 200。
- 上午 HTML 實際有 12 次 `ChatGPT／Codex Voice`、有「不等於離線或零留存」提醒、有 OpenAI 官方說明連結與 `https://chatgpt.com/codex/`。
- 下午 HTML 實際含 `ChatGPT Voice`。
- 人眼重新查看 2K 投影片：上午第 10、11、12、13 頁與下午第 17 頁；雙語音路徑、比較、實作步驟、QR、隱私提醒與 Codex 章節文字均清楚，未見裁切或缺圖。
- 未在真實麥克風、登入帳號與現場網路下實際操作 ChatGPT Voice 或 Typeless；因此只能主張「教材與連結已完成且驗證」，不能主張「現場帳號語音功能已實機驗證」。

### 9. PDF

PyMuPDF 實際開啟並低倍率渲染 91 頁：學員任務書 5 頁、場務手冊 3 頁、上午 39 頁、下午 44 頁，全部產生 raster，exit 0。

但上午與下午簡報 PDF 共 83 頁，每頁都出現 `No common ancestor in structure tree` 警告。畫面渲染沒有失敗，問題疑似出在 tagged PDF／可及性結構樹；尚未確認是否影響螢幕閱讀器或 PDF/UA，不能寫成完全無警告。

## 曾出現但已用正確環境重跑通過的測試錯誤

這些不是目前紅燈，但交接時必須保留，避免下一位重踩：

1. QR 第一次用 bundled Python 3.12 執行時，`ModuleNotFoundError: No module named 'cv2'`。改用目前系統 `python`（Python 3.10，OpenCV 4.13.0）後 145/145 通過。
2. 兩份 `slides_test.py` 第一次未設定 `RUNTIME_NODE`，都以 `RuntimeError: RUNTIME_NODE is required.` 結束。依上方三個 `RUNTIME_*` 變數重跑後兩份皆通過。

目前產品測試沒有紅燈；PDF 有 83 筆結構樹警告，不能算無警告。

## 沒做完、被擋住或刻意跳過

- 未在中央大學現場或等效投影環境驗證第一次全螢幕、2K 清晰度、QR 遠距掃描與網路限制；目前只有自動化瀏覽器與阿凱老師先前回報。
- 未登入六位教授的 ChatGPT／Gemini 帳號確認方案、Gem、Gemini Notebook、Antigravity、Codex、Claude 與 ChatGPT Voice 當天可用性。
- 未實機安裝／登入 Typeless，也未測麥克風權限與語音辨識品質。
- 未逐頁人工審閱全部 83 張投影片；本輪只重新人眼查看與語音新增直接相關的 5 張。全 83 張已跑自動溢位與 HTML 渲染測試。
- 未逐一對 145 個外部目的站做 HTTP／登入後功能驗收；QR 解碼與短網址本身已驗證，外部平台可能因登入、反自動化或方案限制回 403。
- 未執行 2026-08-19（T-7）與 2026-08-25（T-24h）平台／連結複核，時間尚未到。
- 未修改、刪除正式包中的重複 PDF，也未重建 Manifest，因為刪檔與重新封裝應由使用者先決定。
- 本輪沒有重新執行 build，驗證的是 2026-08-15 已產生並公開的成品。

## 已知問題與來源漂移

1. 正式包 `RELEASE_MANIFEST_v1.0.txt` 寫「檔案總數 357」，實際是 358。多出的是：
   `C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0\07_備援\morning.pdf`
   它與正式中文檔名的上午場 PDF 大小相同；公開 Git repo 沒有這個檔案。未經使用者決定不要刪。
2. Manifest 內仍寫「66 份 HTML、83 個相對資源連結」，本輪實測是 79 份 HTML、123 個參照。這兩個數字已過期。
3. `build_html_deck.mjs` 內生成 README 的模板仍寫「上午 34 頁」，現有正式包／公開 repo 的 README 已手動是 39 頁。下一次 build 可能把 README 回退成 34；重建前先修來源。
4. `qa_github_pages_site.mjs` 的 CSS 判斷包含一個亂碼 pathname：`/08_HTML蝪∪/index.html`，所以 deck hub 的該分支條件不會命中；根頁 CSS 檢查與 `qa_html_deck.mjs` 仍通過，但這是測試覆蓋缺口。
5. 兩份簡報 PDF 共 83 頁有 PyMuPDF structure-tree 警告；視覺渲染成功，但 PDF 可及性影響未確認。
6. 來源與正式包不在 Git 版控。若下一位只 commit `github_pages_site`，來源修正仍可能遺失。

## 刻意保留、不要順手改掉

- 2K 而非 4K，以及「fallback 先顯示、舞台穩定後升級目前頁 2K」的載入策略。
- 全螢幕第一下先進入沉浸狀態的競速修正。
- 以投影片圖片維持中文排版，再用 hotspot 讓文字連結與 QR 在全螢幕可點。
- 上午淺色／下午深色；下午第 17 頁是簡潔章節轉場。
- 上午 39、下午 44 的頁數與 URL hash。
- `Gemini Notebook` 現行命名、教學／研究／行政「痛點」主軸、AI 初編＋人工複核邊界。
- 61 個 QR 圖檔／短網址入口對應 145 個投影片 QR 實例；不要把兩個數字誤認為應相同。
- PWA 的 waiting worker → `controllerchange` → cache-busted reload 流程與版本化 `deck.js?v=2026.08.15.32`。

## 需要阿凱老師本人決定

1. 是否刪除正式包的重複 `07_備援\morning.pdf`，把總數恢復為 357；或保留並把 Manifest 改成 358。
2. 是否要把上一層的產生器／QA 腳本納入 Git 版控，解決「公開成品有 Git、來源沒有 Git」的風險。
3. 是否要投入時間修復簡報 PDF 的 tagged structure tree／PDF 可及性警告；若只作現場備援投影，可暫不阻擋，但不得稱 PDF/UA 已驗證。
4. T-7、T-24h 要用哪六個帳號與哪一台投影設備驗收；Agent 不可自行切換或修改教授帳號與訂閱。
5. Claude／Codex／Antigravity 的模型與費用敘述是否要在活動前依官方資料刷新；不得由 Agent 猜測新模型名稱或方案。

## 環境與外部服務狀態

- 使用者回報目前這個 Agent 對話的 token 額度快用完；具體剩餘量未確認。
- GitHub CLI：`cagoooo` 已登入，repo push 權限可用；2026-08-16 查詢 Pages 為 `built`。
- GitHub Pages 公開站與 `version.json`：HTTP 200，版本 `2026.08.15.32`。
- OpenAI／ChatGPT、Claude、Gemini／Antigravity、Typeless 的帳號登入、剩餘 token、訂閱額度與 API key：未確認。
- 兩個 Google 帳號的 Gemini／Gem／Notebook 實際可用性：本輪未登入檢查。
- 中央大學 2026-08-26 現場網路、投影、瀏覽器、麥克風與防火牆：未確認。
- 沒有在本檔寫入任何 token、API key 或未遮罩憑證。

## 下一步可直接複製的指令

先取得最新 repo 狀態：

```powershell
$repo='C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site'
$src='C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826'
$formal='C:\Users\smes\Desktop\Cowork\4-投稿與文件\中央大學_AI_Agent工作坊_20260826\研習正式包_v1.0'
Set-Location $repo
Get-Content -Raw -Encoding UTF8 .\AGENTS.md
Get-Content -Raw -Encoding UTF8 .\HANDOFF.md
git status --short
git log --oneline -10
git pull --ff-only
```

只讀確認三個已知漂移，不要先刪檔：

```powershell
Get-Item -LiteralPath (Join-Path $formal '07_備援\morning.pdf') | Select-Object FullName,Length,LastWriteTime
rg -n '上午 34 頁|08_HTML蝪' (Join-Path $src 'build_html_deck.mjs') (Join-Path $src 'qa_github_pages_site.mjs')
(Get-ChildItem -LiteralPath $formal -Recurse -File).Count
```

重跑正式包核心測試：

```powershell
Set-Location $src
$env:WORKSHOP_ROOT=$formal
node qa_workshop_suite.mjs
Remove-Item Env:WORKSHOP_ROOT
$env:HTML_ROOT=(Join-Path $formal '08_HTML簡報')
node qa_html_deck.mjs
Remove-Item Env:HTML_ROOT
node qa_ops_checklist.mjs
python qa_qr_codes.py
$env:WORKSHOP_ROOT=$formal
node audit_local_links.mjs
Remove-Item Env:WORKSHOP_ROOT
$env:BASE_URL='https://cagoooo.github.io/ncu-ai-agent-workshop-20260826'
node qa_github_pages_site.mjs
Remove-Item Env:BASE_URL
```

確認 GitHub Pages 與公開版本：

```powershell
Set-Location $repo
gh auth status
gh api repos/cagoooo/ncu-ai-agent-workshop-20260826/pages --jq '{status:.status,url:.html_url,source:.source}'
Invoke-WebRequest -UseBasicParsing 'https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/version.json?cb=handoff' | Select-Object StatusCode,Content
```

## 可直接貼給接手 Agent 的提示詞

```text
請接手「國立中央大學 2026-08-26 AI 教學與研究工作坊」專案。

開始前請完整閱讀：
1. C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site\AGENTS.md
2. C:\Users\smes\Desktop\Cowork\_暫存_可清\ncu_ai_workshop_20260826\github_pages_site\HANDOFF.md

目前公開站版本是 2026.08.15.32，上午 39 頁、下午 44 頁，Typeless × ChatGPT／Codex Voice、2K 全螢幕、RWD、可點超連結／QR、PWA 更新與各分支頁都已完成自動驗收。下一步先處理 HANDOFF.md 列出的封裝與來源漂移，不要直接繼續加新功能。

先跑 git status --short、git log --oneline -10，並重跑 HANDOFF.md 的正式包核心測試。請特別注意：正式包實際 358 檔但 Manifest 寫 357，存在重複 morning.pdf；build_html_deck.mjs 仍有上午 34 頁舊文案；qa_github_pages_site.mjs 有亂碼 pathname；兩份簡報 PDF 共 83 頁有 structure-tree 警告。刪除重複 PDF、把來源納入 Git、修復 PDF 可及性、切換教授帳號或變更模型／方案敘述，都必須先取得阿凱老師決定。

所有完成主張都要附實際指令、退出碼與數字；沒驗證的寫「未確認」。完成修改後跑完整測試、commit、push main，再確認 GitHub Pages status=built 與公開網址。全程使用繁體中文。
```
