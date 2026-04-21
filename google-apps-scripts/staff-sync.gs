/**
 * STAFF SYNC — Google Apps Script
 * Paste this into your Staff Google Sheet's Apps Script editor
 *
 * SHEET FORMAT (Row 1 = headers):
 * A: Name | B: Rank | C: Role | D: Bio | E: Avatar URL | F: Badge Number
 * G: Division | H: Join Date | I: Discord | J: Display Order
 */

const STAFF_WEBHOOK_URL = "https://YOUR_VERCEL_DOMAIN/api/sync-staff";
const SYNC_SECRET_STAFF = "YOUR_SYNC_SECRET_HERE";

function syncStaffToWebsite() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) return;

  const staff = data.slice(1)
    .filter(row => row[0] && row[0].toString().trim() !== "")
    .map((row, idx) => ({
      name:            String(row[0] || "").trim(),
      rank:            String(row[1] || "").trim(),
      role:            String(row[2] || "").trim(),
      bio:             String(row[3] || "").trim() || null,
      avatar_url:      String(row[4] || "").trim() || null,
      badge_number:    String(row[5] || "").trim() || null,
      division:        String(row[6] || "").trim() || null,
      join_date:       row[7] ? Utilities.formatDate(new Date(row[7]), "UTC", "yyyy-MM-dd") : null,
      contact_discord: String(row[8] || "").trim() || null,
      display_order:   parseInt(row[9]) || idx,
    }));

  const payload = JSON.stringify({ secret: SYNC_SECRET_STAFF, staff });

  const options = {
    method: "post",
    contentType: "application/json",
    payload: payload,
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(STAFF_WEBHOOK_URL, options);
    Logger.log("Staff sync: " + response.getContentText());
  } catch (e) {
    Logger.log("Staff sync error: " + e.toString());
  }
}

function setupStaffTrigger() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === "syncStaffToWebsite") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger("syncStaffToWebsite")
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();

  Logger.log("Staff trigger installed.");
}
