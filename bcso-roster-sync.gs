// ─────────────────────────────────────────────────────────────────────────────
// BCSO Roster Sync — Google Apps Script
// Reads the "Public Roster" sheet and pushes data to the website API.
//
// HOW TO USE:
//   1. In your Google Sheet: Extensions → Apps Script
//   2. Click the "+" next to "Files" and create a new script file
//      Name it "bcso-roster-sync" (or anything — just not "Code")
//   3. Paste this entire file into it
//   4. Fill in WEBHOOK_URL and SYNC_SECRET below
//   5. Run setupTrigger() once to enable automatic hourly sync
//   6. Or run syncRosterNow() manually anytime to push immediately
//
// This file does NOT touch row heights and will NOT conflict with
// the runInitialCollapse / onEdit script in the other file.
// ─────────────────────────────────────────────────────────────────────────────

// ── CONFIG — fill these in ───────────────────────────────────────────────────

const SYNC_WEBHOOK_URL = "https://bcso-website-ivory.vercel.app/api/sync-roster";
const SYNC_SECRET      = "e60cd5bde8ee8866b717c068987a148f";             // ← must match SYNC_SECRET in .env
const ROSTER_SHEET     = "Public Roster";                                  // ← sheet tab name

// Rows that are headers/dividers/section labels — skip these entirely.
// Copy the same list from the other script so they stay in sync.
const SKIP_ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 25, 37, 47, 147, 247, 347, 480, 532, 584, 636, 664];

// ── COLUMN MAP ───────────────────────────────────────────────────────────────
// Maps the field name the website expects → the column HEADER text in your sheet.
// Edit the right-hand strings to match your exact column headers.

const COLUMN_MAP = {
  name:             "Name",
  rank:             "Rank",
  badge_number:     "Website ID",
  callsign:         "Callsign",
  division:         "Assignment",
  status:           "Activity Status",
  joined_date:      "Date of Membership",
  phone_number:     "Phone Number",
  patrol_last_seen: "Patrol Last Seen",   // header has a line break — handled below
  admin_last_seen:  "Admin Last Seen",    // same
};

// ── MAIN SYNC FUNCTION ───────────────────────────────────────────────────────

function syncRosterNow() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ROSTER_SHEET);

  if (!sheet) {
    Logger.log("ERROR: Sheet '" + ROSTER_SHEET + "' not found.");
    return;
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < 2 || lastCol < 1) {
    Logger.log("Sheet appears empty.");
    return;
  }

  // Read everything at once (fast — one API call)
  const allData = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  // Find the header row — first row that contains "Name" and "Rank"
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(allData.length, 20); i++) {
    const lower = allData[i].map(function(c) { return String(c).toLowerCase().trim(); });
    if (lower.indexOf("name") !== -1 && lower.indexOf("rank") !== -1) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) {
    Logger.log("ERROR: Could not find a header row containing 'Name' and 'Rank'.");
    return;
  }

  // Normalize headers — collapse all whitespace/newlines to a single space
  const headers = allData[headerRowIdx].map(function(c) {
    return String(c).replace(/\s+/g, " ").trim();
  });

  // Build a lookup: field name → column index
  const colIdx = {};
  for (var field in COLUMN_MAP) {
    var target = COLUMN_MAP[field].replace(/\s+/g, " ").toLowerCase();
    for (var c = 0; c < headers.length; c++) {
      if (headers[c].toLowerCase() === target) {
        colIdx[field] = c;
        break;
      }
    }
  }

  // Require at least name + rank columns
  if (colIdx["name"] === undefined || colIdx["rank"] === undefined) {
    Logger.log("ERROR: Could not locate 'Name' or 'Rank' columns. Check COLUMN_MAP headers match your sheet exactly.");
    Logger.log("Found headers: " + JSON.stringify(headers));
    return;
  }

  // Build roster rows — skip header row, SKIP_ROWS, and fully empty rows
  var roster = [];
  for (var i = headerRowIdx + 1; i < allData.length; i++) {
    var rowNumber = i + 1; // 1-based row number

    if (SKIP_ROWS.indexOf(rowNumber) !== -1) continue;

    var row = allData[i];

    // Skip if name and rank are both blank
    var name = col(row, colIdx, "name");
    var rank = col(row, colIdx, "rank");
    if (!name && !rank) continue;
    if (!name || !rank) continue; // need both to be a valid member

    // Normalise status
    var rawStatus = col(row, colIdx, "status") || "";
    var status = "Active";
    var sl = rawStatus.toLowerCase().trim();
    if (sl === "loa" || sl.indexOf("leave") !== -1) status = "LOA";
    else if (sl === "inactive") status = "Inactive";

    // Normalise date (Google Sheets dates come as Date objects)
    var joinedRaw = colRaw(row, colIdx, "joined_date");
    var joined = null;
    if (joinedRaw instanceof Date && !isNaN(joinedRaw.getTime())) {
      joined = Utilities.formatDate(joinedRaw, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } else if (typeof joinedRaw === "number" && joinedRaw > 0) {
      // Excel serial date fallback
      var d = new Date((joinedRaw - 25569) * 86400 * 1000);
      joined = Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } else if (typeof joinedRaw === "string" && joinedRaw.trim()) {
      joined = joinedRaw.trim();
    }

    roster.push({
      name:             name,
      rank:             rank,
      badge_number:     col(row, colIdx, "badge_number")  || null,
      callsign:         col(row, colIdx, "callsign")      || null,
      division:         col(row, colIdx, "division")      || null,
      status:           status,
      joined_date:      joined,
      phone_number:     col(row, colIdx, "phone_number")  || null,
      patrol_last_seen: col(row, colIdx, "patrol_last_seen") || null,
      admin_last_seen:  col(row, colIdx, "admin_last_seen")  || null,
    });
  }

  Logger.log("Sending " + roster.length + " members to website...");

  var payload = JSON.stringify({ secret: SYNC_SECRET, roster: roster });

  var options = {
    method:      "post",
    contentType: "application/json",
    payload:     payload,
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(SYNC_WEBHOOK_URL, options);
  var code     = response.getResponseCode();
  var body     = response.getContentText();

  if (code === 200) {
    Logger.log("✓ Sync complete: " + body);
  } else {
    Logger.log("✗ Sync failed (" + code + "): " + body);
  }
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

// Returns the cell value as a trimmed string
function col(row, colIdx, field) {
  var idx = colIdx[field];
  if (idx === undefined) return null;
  var v = row[idx];
  if (v === null || v === undefined || v === "") return null;
  return String(v).trim() || null;
}

// Returns the raw cell value (for date handling)
function colRaw(row, colIdx, field) {
  var idx = colIdx[field];
  return idx !== undefined ? row[idx] : null;
}

// ── DEBUG — run this to see exactly what would be sent without hitting the API ─

function debugSync() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ROSTER_SHEET);
  if (!sheet) { Logger.log("Sheet not found: " + ROSTER_SHEET); return; }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const allData = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  // Log raw headers from first 20 rows to help spot mismatches
  Logger.log("=== HEADERS SCAN (first 20 rows) ===");
  for (var i = 0; i < Math.min(allData.length, 20); i++) {
    var rowStr = allData[i].filter(function(c) { return String(c).trim() !== ""; }).join(" | ");
    if (rowStr) Logger.log("Row " + (i+1) + ": " + rowStr);
  }

  // Find header row
  var headerRowIdx = -1;
  for (var i = 0; i < Math.min(allData.length, 20); i++) {
    var lower = allData[i].map(function(c) { return String(c).toLowerCase().trim(); });
    if (lower.indexOf("name") !== -1 && lower.indexOf("rank") !== -1) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) {
    Logger.log("ERROR: No header row found with 'Name' and 'Rank'");
    return;
  }

  var headers = allData[headerRowIdx].map(function(c) {
    return String(c).replace(/\s+/g, " ").trim();
  });
  Logger.log("=== HEADER ROW (row " + (headerRowIdx+1) + ") ===");
  Logger.log(JSON.stringify(headers));

  // Show which COLUMN_MAP entries matched
  Logger.log("=== COLUMN MATCHES ===");
  var colIdx = {};
  for (var field in COLUMN_MAP) {
    var target = COLUMN_MAP[field].replace(/\s+/g, " ").toLowerCase();
    var found = false;
    for (var c = 0; c < headers.length; c++) {
      if (headers[c].toLowerCase() === target) {
        colIdx[field] = c;
        Logger.log("✓ " + field + " → col " + (c+1) + " (" + headers[c] + ")");
        found = true;
        break;
      }
    }
    if (!found) Logger.log("✗ " + field + " — no match for '" + COLUMN_MAP[field] + "'");
  }

  // Show first 3 members that would be sent
  Logger.log("=== FIRST 3 MEMBERS FOUND ===");
  var count = 0;
  for (var i = headerRowIdx + 1; i < allData.length && count < 3; i++) {
    var rowNumber = i + 1;
    if (SKIP_ROWS.indexOf(rowNumber) !== -1) continue;
    var row = allData[i];
    var name = col(row, colIdx, "name");
    var rank = col(row, colIdx, "rank");
    if (!name || !rank) continue;
    Logger.log("Row " + rowNumber + ": " + name + " / " + rank);
    count++;
  }
  Logger.log("(Run syncRosterNow to send all data)");
}

// ── TRIGGER SETUP ────────────────────────────────────────────────────────────
// Run setupTriggers() ONCE from the Apps Script editor.
// This installs two triggers:
//   1. onEdit  — syncs immediately whenever any cell in the roster sheet changes
//   2. Hourly  — catches any missed edits (paste, import, API changes)

function onRosterEdit(e) {
  // Only fire if the edit was on the Public Roster sheet
  if (!e || !e.source) return;
  var sheet = e.source.getActiveSheet();
  if (sheet.getName() !== ROSTER_SHEET) return;
  syncRosterNow();
}

function setupTriggers() {
  // Remove all existing managed triggers to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    var fn = triggers[i].getHandlerFunction();
    if (fn === "syncRosterNow" || fn === "onRosterEdit") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Trigger 1: sync immediately on any edit to the sheet
  ScriptApp.newTrigger("onRosterEdit")
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  // Trigger 2: hourly fallback in case edits are missed (bulk paste, API writes, etc.)
  ScriptApp.newTrigger("syncRosterNow")
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log("✓ Triggers installed: onEdit (instant) + hourly fallback.");
}

// Run this to remove all triggers (pause syncing entirely)
function removeTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  var removed = 0;
  for (var i = 0; i < triggers.length; i++) {
    var fn = triggers[i].getHandlerFunction();
    if (fn === "syncRosterNow" || fn === "onRosterEdit") {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  Logger.log("✓ Removed " + removed + " trigger(s).");
}
