/**
 * =========================================================================
 * GOOGLE APPS SCRIPT FOR GOIDE BULLS SERVICES LEAD FORM
 * Spreadsheet ID: 1yDsjYvrYQDEo0g8D4IxLSw4lDZbhnsYcrgOhmoqVlBI
 * =========================================================================
 * 
 * HOW TO INSTALL IN 1 MINUTE:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1yDsjYvrYQDEo0g8D4IxLSw4lDZbhnsYcrgOhmoqVlBI/edit
 * 2. In the top menu, click on "Extensions" -> "Apps Script"
 * 3. Delete any code inside Code.gs and paste THIS WHOLE FILE into Code.gs
 * 4. Click the "Save" (disk icon) button
 * 5. Click the blue "Deploy" button in the top-right corner -> Select "New deployment"
 * 6. Under "Select type" (gear icon), choose "Web app"
 * 7. Set:
 *    - Description: Goide Bulls Leads Form Webhook
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone  (IMPORTANT: Must be "Anyone")
 * 8. Click "Deploy" -> Click "Authorize access" (if asked) -> Choose your Google account -> Click "Advanced" -> "Go to Untitled project (unsafe)" -> Click "Allow"
 * 9. Copy the "Web app URL" (starts with https://script.google.com/macros/s/.../exec)
 * 10. Paste that Web app URL in js/main.js at the GOOGLE_SHEET_WEBHOOK_URL variable!
 * =========================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Auto-create header row if sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Service Category",
        "Full Name",
        "Email / Phone",
        "Details / Note",
        "Submission Source"
      ]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#fee2e2");
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var timestamp = new Date();
    var service = data.service || data.serviceCategory || "N/A";
    var name = data.name || data.fullName || "N/A";
    var contact = data.contact || data.email || data.phone || "N/A";
    var details = data.details || data.note || "N/A";
    var source = data.source || "Website Lead Form";

    sheet.appendRow([
      timestamp,
      service,
      name,
      contact,
      details,
      source
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Lead successfully recorded in Google Sheet!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Goide Bulls Google Sheets Lead Webhook is running."
  })).setMimeType(ContentService.MimeType.JSON);
}
