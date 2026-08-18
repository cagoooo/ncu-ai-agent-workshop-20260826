# HANDOFF.md｜2026-08-18 本輪 Agent 交接（接手修正後）

稽核時間：2026-08-18 12:19（Asia/Taipei）

---

## 一句話狀態

**公開站維持 `v2026.08.18.05`，本輪已補跑公開站與正式包完整 QA，並將來源／正式包驗收清單的上午頁數由 34 修正為 39；尚有正式包 Manifest 與 PDF 可及性等需老師決定的事項。**

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
- **公開版本**：`2026.08.18.05`（已驗：`version.json` HTTP 200，版本字串符合）
- **最新 commit**：`990c049`
- **GitHub Pages**：已確認 `status=built`

---

## git 實際數字（稽核時間 2026-08-18 11:29 跑出）

```
git status → nothing to commit, working tree clean

git log --oneline -10：
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

**結果（2026-08-18 12:19 跑出）**：exit 0，`HTML deck QA passed.`；上午 39 頁、下午 44 頁，共 83 頁。

測試涵蓋（完整列表）：
- 上午 39 頁、下午 44 頁，初始 slide #1 active = 1 ✓
- Desktop 1440×960 無水平溢位 ✓
- 頁腳含「阿凱老師」✓
- Hotspot QR + Platform + Card 三型全部存在且可命中 ✓
- `deck.js?v=2026.08.18.05` cache-busting 版本號存在 ✓
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

**結果**：exit 0，`GitHub Pages site QA passed.`

帶 `BASE_URL=https://cagoooo.github.io/ncu-ai-agent-workshop-20260826` 的公開站版本亦已重跑：exit 0，`GitHub Pages site QA passed.`

### 3. 公開 `version.json` 版本確認

```powershell
(Invoke-WebRequest -UseBasicParsing '...version.json?cb=handoff3').Content
# → "version": "2026.08.18.05"（HTTP 200，2026-08-18 11:30 確認）
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

---

## 沒做完、被擋住或刻意跳過

1. **正式包 Manifest 與實際檔案數仍不一致**：目前 Manifest 寫 357，實際檔案數為 423；需老師決定是否以目前正式包為準重建 Manifest。
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
- **`deck.js?v=2026.08.18.05` 版本號**：版本號不可移除。
- **投影片圖片點陣圖 + Hotspot 疊加架構**：不要因為「不是純 HTML 文字」就整套改寫。
- **來源不在 Git**：改正式包 HTML 的同時必須同步改來源腳本。

---

## 已知問題與技術債

| # | 問題 | 嚴重度 | 說明 |
|---|---|---|---|
| 1 | `qa_github_pages_site.mjs` pathname 回歸覆蓋仍未獨立擴充 | 低 | 現有 encoded 中文路徑測試與公開站 QA 均通過；QA 腳本不在 Git，本輪未擴大版控範圍 |
| 2 | 正式包 Manifest 寫 357，實際 423 | 低 | 目前搜尋不到 `07_備援\morning.pdf`；刪除或重建 Manifest 需使用者決定 |
| 3 | 兩份簡報 PDF 共 83 頁有 structure-tree 警告 | 低 | 視覺渲染正常，PDF 可及性影響未確認 |
| 4 | SKILL 同步未做功能性測試 | 低 | 目錄存在，但各工具是否真的載入未測 |

---

## 需要阿凱老師本人決定（接手 Agent 不可自作主張）

1. 是否以目前 423 檔正式包為準重建 Manifest；目前搜尋不到 `07_備援\morning.pdf`。
2. 是否把建置腳本納入 Git 版控，解決「來源沒有 Git」的風險。
3. 是否修復簡報 PDF 的 tagged structure tree 可及性警告。
4. T-7（2026-08-19）與 T-24h（2026-08-25）用哪六個帳號、哪台投影設備做現場驗收。
5. Claude、Codex、Antigravity、Gemini 模型名稱與費用敘述是否要在活動前刷新（不可由 Agent 猜測）。

---

## 環境與外部服務狀態

- **Token 額度**：本對話已接近耗盡，這是換手原因；剩餘量未確認。
- **GitHub CLI**：`cagoooo` 已登入，push 權限可用。
- **公開站版本**：`version.json` HTTP 200，`"version": "2026.08.18.05"`（11:30 實際驗證）。
- **Pages build 狀態**：commit `990c049` 已推送；Pages 重建需數分鐘，接手後請確認 `status=built`。
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

### Step 4：重跑公開站 QA（本輪未跑，接手必補）

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
公開站版本：2026.08.18.05（version.json HTTP 200 已驗）
本機 HTML 簡報 QA：exit 0，HTML deck QA passed（2026-08-18 11:29 跑出）
帶 BASE_URL 的公開站 QA：exit 0，`GitHub Pages site QA passed.`
Git 工作區：本輪交接文件修正後保持乾淨，main 分支；最新 commit 以 `git log --oneline -1` 為準

【本輪修復的 Bug（不要回退）】
1. 全螢幕跑版（靠頂、下方大黑底）→ 已修（CSS SSOT 置於最底層）
2. CSS 快取舊版不更新 → 已修（全 HTML 補 ?v=2026.08.18.05 版本號）
3. 全螢幕切換下一頁閃黑 → 已修（移除 enableHiResImage，雙緩衝重疊轉場 + img.decode()）

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
- 正式包 Manifest 寫 357 檔，實際 423；目前搜尋不到 07_備援\morning.pdf，需老師決定是否重建 Manifest
- 兩份簡報 PDF 共 83 頁有 structure-tree 警告（視覺正常，可及性未確認）

【需要阿凱老師決定，不可自作主張】
刪除重複 PDF、來源納入 Git、修復 PDF 可及性、切換教授帳號、變更模型名稱與方案敘述

【格式規範】
- 所有說明、commit、文件全部使用繁體中文
- 所有完成主張必須附實際指令、exit code 與數字；沒驗證的寫「未確認」
- 完成修改後跑完整測試、commit、push main，再確認 Pages status=built 與公開版本
- 不要在任何地方寫入 API key、token 或密碼
```
