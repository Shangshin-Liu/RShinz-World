# RShinz-World

個人作品集網站，基於 Vue 3 + Vite 建置。

## 環境變數設定

部署前請在根目錄建立 `.env.local`（本地開發）或在部署平台設定以下環境變數：

| 變數名稱 | 必填 | 說明 |
|---|---|---|
| `VITE_GAS_URL` | 否 | Google Apps Script Web App 部署 URL，用於訪客計數。未設定時使用 Mock 假資料。 |
| `VITE_TSUMEGO_GAS_URL` | 否 | Google Apps Script Web App 部署 URL，用於動態載入詰棋題目。未設定時使用內建範例題目。 |

### 如何取得 `VITE_GAS_URL`

1. 前往 [Google Apps Script](https://script.google.com) 建立新專案
2. 貼入以下程式碼：

```javascript
const SHEET_NAME = 'visitors'
const COUNT_CELL = 'A1'

function doGet(e) {
  const hit = e.parameter.hit === '1'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)

  let current = Number(sheet.getRange(COUNT_CELL).getValue()) || 0

  if (hit) {
    current += 1
    sheet.getRange(COUNT_CELL).setValue(current)
  }

  return ContentService
    .createTextOutput(JSON.stringify({ count: current }))
    .setMimeType(ContentService.MimeType.JSON)
}
```

3. 「部署」→「新增部署作業」→ 類型選「網頁應用程式」
4. 執行身分：**我**；存取權限：**任何人**
5. 部署後複製 URL 填入 `.env.local`：

```env
VITE_GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 如何取得 `VITE_TSUMEGO_GAS_URL`

1. 建立 Google Sheets，將 Sheet 命名為 `puzzles`
2. 在 `A1` 儲存格貼入 `src/data/tsumegoPuzzles.json` 的內容（整個 JSON 陣列字串）
3. 開啟 Apps Script（試算表 → 擴充功能 → Apps Script），貼入以下程式碼：

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('puzzles')
  const json = sheet.getRange('A1').getValue()
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON)
}
```

4. 「部署」→「新增部署作業」→ 類型選「網頁應用程式」
5. 執行身分：**我**；存取權限：**任何人**
6. 部署後複製 URL 填入 `.env.local`：

```env
VITE_TSUMEGO_GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

> **注意**：`VITE_` 開頭的環境變數需要重啟 `npm run dev` 才會生效。部署到 GitHub Pages 等平台時，需在平台的環境變數設定中加入相同的變數。

## 本地開發

```bash
npm install
npm run dev
```
