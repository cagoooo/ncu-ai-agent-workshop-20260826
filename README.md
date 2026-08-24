# 從 AI 教學與研究助理到 AI Agent

國立中央大學｜大學教師的生成式 AI 實作工作坊（2026-08-26）

🌐 **線上網站**：https://cagoooo.github.io/ncu-ai-agent-workshop-20260826/

## 內容

- 上午場：Vibe Coding、Vibe Working、AI 三個 Level、Typeless、ChatGPT／Codex Voice、Gemini Notebook、Gem、Canvas 與網站部署實作（47 頁）
- 下午場：Antigravity、Codex、Agent Skills、資料分析實戰與 Agent 時代人生反思（54 頁；含手機遠端控制更新）
- 桌機首頁滿版寬欄場次導覽：主內容上限 1800px，放大主標、摘要、分支卡片與左右雙欄入口；手機／平板自動堆疊並保留 RWD
- 主導覽板新增 10 個研習分支入口：資源導航、任務書、PIRLS、Skill 驗證、123 案例、部署精靈、提示詞面板、場務手冊、備援與 Canvas 起始站
- 手機／平板 RWD、觸控滑動、總覽、講者備註與閱讀模式
- 手機簡報工具列改為「圖示＋文字」四項操作：總覽、備註、閱讀、全螢幕；直式手機採雙列排列，功能名稱清楚可辨
- 手機／平板簡報舞台會依載具垂直置中並最大化；橫向連結列與導覽控制不覆蓋投影片
- 全螢幕按鈕支援原生 Fullscreen API；iOS／嵌入式瀏覽器不支援時自動切換可退出的沉浸模式
- favicon、LINE／Facebook／Twitter 分享預覽圖與完整 Open Graph meta
- Service Worker 網路優先 HTML 更新策略與新版提示
- 「立即更新」會啟用 waiting worker、等待 controllerchange，再以 cache-busted URL 載入最新版
- `START_HERE_研習資源導航.html`：線上教材、123 個案例（含 12 張精選）、實作工具與下載入口
- `07_備援/index.html`：公開 PDF、PowerPoint、HTML 簡報與學員任務書備援入口
- `09_HTML動態簡報/index.html`：上午 47 頁、下午 54 頁的 HTML 原生文字場景，含 Vibe Coding、Vibe Working、AI 三個 Level 與 Antigravity Remote Control 更新，預留 HyperFrames／Remotion 動態化結構
- `04_實作工具/提示詞快捷面板_研習用.html`：桌機滿寬三欄、放大字級；手機／平板自動切換成觸控友善單欄
- `04_實作工具/04_跨平台Skill驗證器.html`：驗證 `SKILL.md`、資料夾或 ZIP 的跨平台可攜性與安全邊界
- `04_實作工具/05_123個案例需求導向篩選器.html`：依教學／研究需求搜尋 123 筆 Akai 工具案例，提供卡片與應用雙入口
- `04_實作工具/06_部署選擇詳細教學引導解說精靈.html`：比較 Google Sites、GitHub Pages、EZPage 並產出部署計畫
- `05_範例資料/Akai教育科技創新專區_工具目錄_123筆.json`：123 筆工具目錄的可下載資料快照
- 所有實作工具、任務書、場務手冊、備援頁與 Canvas 起始站皆有首屏可見的「回到簡報主頁」按鈕；線上與離線正式包使用同一相對路徑
- HTML 簡報主頁 `08_HTML簡報/index.html` 同步提供上述分支入口，從任何分支都能返回主頁再選擇上午／下午場
- 簡報備註中的工具入口已改用公開 GitHub Pages 網址，不依賴講師個人電腦的本機路徑

本 repo 是純靜態網站，可直接由 GitHub Pages 提供，不需要 Node.js 建置。正式研習包的教材、工具、資料與備援檔案均已同步；`08_HTML簡報/` 內保留互動簡報與各項教學工具。

Made with ❤️ by [阿凱老師](https://www.smes.tyc.edu.tw/modules/school/index.php?department_id=2&zone_id=0&page_id=2&content_id=11&type=news&from_op=all_news#a5) · 桃園市龍潭區石門國民小學
