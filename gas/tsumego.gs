// Google Apps Script - tsumego puzzles endpoint
// 部署為 Web App（任何人均可存取）後，貼上 URL 至 VITE_TSUMEGO_GAS_URL

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('puzzles');
    if (!sheet) throw new Error('Sheet "puzzles" not found');
    const json = sheet.getRange('A1').getValue();
    if (!json) throw new Error('Cell A1 is empty');
    // Validate JSON
    JSON.parse(json);
    return ContentService
      .createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
