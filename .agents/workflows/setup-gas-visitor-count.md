---
description: 設定 Google Apps Script 串接 Google Sheets 作為訪客計數後端
---

// turbo-all

## 步驟一：建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com) 建立新試算表
2. 將 Sheet1 的 **A1** 儲存格設值為 `0`
3. 記下試算表網址列中的 ID（`/d/` 和 `/edit` 之間的那段字串）

## 步驟二：建立 Google Apps Script

1. 在試算表中點選上方選單 **擴充功能 → Apps Script**
2. 刪除預設程式碼，貼上以下內容：

```js
function doGet(e) {
  const hit = e.parameter.hit !== '0'
  const lock = LockService.getScriptLock()

  try {
    lock.waitLock(5000)

    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheets()[0]
    let count = Number(sheet.getRange('A1').getValue()) || 0

    if (hit) {
      count += 1
      sheet.getRange('A1').setValue(count)
    }

    return ContentService
      .createTextOutput(JSON.stringify({ count }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  } finally {
    lock.releaseLock()
  }
}
```

3. 將 `'YOUR_SHEET_ID'` 替換成步驟一記下的 Sheets ID

## 步驟三：部署為 Web App

1. 點選右上角 **部署 → 新增部署作業**
2. 類型選 **網頁應用程式**
3. 設定如下：
   - 執行身分：**我**
   - 存取權限：**任何人**
4. 點選 **部署**，複製產生的 **Web App URL**

## 步驟四：設定前端環境變數

在專案根目錄建立或編輯 `.env.local`：

```
VITE_GAS_URL=https://script.google.com/macros/s/YOUR_DEPLOY_ID/exec
```

> `.env.local` 已在 `.gitignore` 中，不會被提交

## 步驟五：重啟 dev server

重啟後環境變數才會生效：

```powershell
# 先 Ctrl+C 停止現有的 npm run dev，再重新執行
npm run dev
```

## 注意事項

- GAS 每次修改 Script 後必須重新部署（**新版本**），舊的 URL 不會自動更新邏輯
- GAS 冷啟動約 1-2 秒，計數顯示有短暫延遲是正常的
- `LockService` 防止並發寫入導致計數不準
