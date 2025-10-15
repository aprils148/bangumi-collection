# Bangumi Collection

一個基於 Next.js 14 的動漫作品瀏覽網站，整合 AniList GraphQL API 與維基數據的中文標題、TMDB 的中文介紹，提供熱門/趨勢動漫、放送表、作品詳情與搜尋等功能。界面採用 Tailwind CSS 與 Framer Motion 打造，並支援深色模式。

## 功能特色

- **首頁聚合資訊**：顯示趨勢、熱門與每週放送的動畫作品，並以動態輪播呈現精選作品。
- **中文化內容**：透過本地的 Wikidata 映射表補充中文標題，並可選擇性使用 TMDB API 取得中文簡介。
- **作品搜尋與分類**：提供動畫、漫畫的熱門列表、放送日篩選與關鍵字搜尋功能，均由 AniList GraphQL API 驅動。
- **統一錯誤處理**：以 `app/utils/error-logging.ts` 集中處理 API 錯誤，方便日後整合監控服務。
- **現代化 UI**：採用 Tailwind CSS、next-themes 與 Framer Motion，提供流暢的動畫效果與深色模式支援。

## 專案結構

```
.
├── app/                 # Next.js App Router 目錄，包含頁面、元件、providers 與 API 相關程式碼
│   ├── components/      # Header、Footer、AnimeCard 等 UI 元件
│   ├── lib/             # 與 AniList、TMDB 溝通的 API 封裝與型別定義
│   ├── utils/           # 錯誤處理等共用工具
│   └── globals.css      # Tailwind CSS 全域樣式
├── db/                  # 本地資料來源（例如 Wikidata 的中文標題映射）
├── public/              # 靜態資源
├── package.json         # 指令與依賴設定
└── tailwind.config.js   # Tailwind CSS 設定
```

## 系統需求

- Node.js 18 或更新版本
- npm 8 或更新版本

## 安裝與執行

1. 安裝依賴：

   ```bash
   npm install
   ```

2. 設定環境變數（選用）：若需顯示 TMDB 的中文簡介，請在專案根目錄建立 `.env.local`，加入：

   ```bash
   TMDB_API_KEY=your_tmdb_api_key
   ```

3. 啟動開發伺服器：

   ```bash
   npm run dev
   ```

   預設可於 <http://localhost:3000> 訪問。

4. 其他指令：

   ```bash
   npm run build   # 建置生產版本
   npm run start   # 啟動生產伺服器（需先執行 build）
   npm run lint    # 執行 ESLint 稽核
   ```

## 資料來源

- [AniList GraphQL API](https://anilist.co/graphiql)
- [ani.zip mappings](https://api.ani.zip/)
- [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Wikidata 作品資訊（隨專案提供的 `db/anilist-wikidata/wikidata-anime.json`）

## 開發建議

- 本專案以 Next.js App Router 為核心架構，新增頁面或 API 時建議遵循現有目錄結構。
- API 呼叫請優先封裝於 `app/lib/api.ts`，並透過 `app/utils/error-logging.ts` 統一紀錄錯誤。
- 若需要在 UI 上補充中文標題，可使用 `getAnimeChineseTitle`，其資料源於本地 Wikidata JSON 檔案。

歡迎提交 Issue 或 Pull Request 一同完善專案！
