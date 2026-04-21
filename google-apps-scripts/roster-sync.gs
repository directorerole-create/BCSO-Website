/**
 * ROSTER SYNC — Google Apps Script
 * Paste this into your Google Sheet's Apps Script editor (Extensions > Apps Script)
 *
 * SETUP:
 * 1. Open your Roster Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire script
 * 4. Set the constants below (WEBHOOK_URL, SYNC_SECRET)
 * 5. Run setupTrigger() once to install the auto-sync trigger
 *
 * SHEET FORMAT (Row 1 = headers):
 * A: Name | B: Rank | C: Badge Number | D: Callsign | E: Division | F: Status | G: Avatar URL | H: Joined Date
 */

const ROSTER_WEBHOOK_URL = "https://YOUR_VERCEL_DOMAIN/api/sync-roster";
const SYNC_SECRET = "YOUR_SYNC_SECRET_HERE"; // Must match SYNC_SECRET in .env

function syncRosterToWebsite() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    Logger.log("No data rows found.");
    return;
  }

  // Skip header row (row 0)
  const roster = data.slice(1)
    .filter(row => row[0] && row[0].toString().trim() !== "") // skip empty rows
    .map(row => ({
      name:         String(row[0] || "").trim(),
      rank:         String(row[1] || "").trim(),
      badge_number: String(row[2] || "").trim() || null,
      callsign:     String(row[3] || "").trim() || null,
      division:     String(row[4] || "").trim() || null,
      status:       String(row[5] || "Active").trim() || "Active",
      avatar_url:   String(row[6] || "").trim() || null,
      joined_date:  row[7] ? Utilities.formatDate(new Date(row[7]), "UTC", "yyyy-MM-dd") : null,
    }));

  const payload = JSON.stringify({ secret: SYNC_SECRET, roster });

  const options = {
    method: "post",
    contentType: "application/json",
    payload: payload,
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(ROSTER_WEBHOOK_URL, options);
    const result = JSON.parse(response.getContentText());
    Logger.log("Sync result: " + JSON.stringify(result));
  } catch (e) {
    Logger.log("Sync error: " + e.toString());
  }
}

// Run this ONCE to set up an automatic trigger on sheet edits
function setupTrigger() {
  // Remove existing triggers for this function
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === "syncRosterToWebsite") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new on-edit trigger
  ScriptApp.newTrigger("syncRosterToWebsite")
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();

  Logger.log("Trigger installed. Roster will sync automatically on edit.");
}

// Also run on form submit if using Google Forms for roster updates
function onFormSubmit() {
  syncRosterToWebsite();
}
