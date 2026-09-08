function doPost(e) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Responses");

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.email || "",
    data.location || "",
    data.virtues || "",
    data.vices || "",
    data.orientation || "",
    data.earth || 0,
    data.water || 0,
    data.fire || 0,
    data.air || 0,
    data.ether || 0
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
