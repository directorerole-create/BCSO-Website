// ─────────────────────────────────────────────────────────────────────────────
// BCSO SOP Sync — Google Apps Script
// Reads a Google Doc formatted as an SOP and pushes it to the website API.
//
// HOW TO USE:
//   1. In your Google Doc: Extensions → Apps Script
//   2. Create a new script file named "bcso-sop-sync"
//   3. Paste this entire file into it
//   4. Fill in SOP_DOC_ID and SYNC_SECRET below
//   5. Run setupSopTriggers() once to enable automatic syncing
//   6. Or run syncSopNow() manually anytime
//
// ── HOW TO FORMAT YOUR GOOGLE DOC ────────────────────────────────────────────
//
//   Use paragraph styles (Format → Paragraph styles) like this:
//
//   [Heading 1]  I. General Provisions
//   [Heading 2]  1.1 Purpose & Scope
//   [Normal]     Your content text goes here. This can span
//                multiple lines and will be combined.
//   [Normal]     A blank line in the doc creates a paragraph break.
//   [Heading 2]  1.2 Authority of the Sheriff
//   [Normal]     More content...
//   [Heading 1]  II. Administration & Organization
//   [Heading 2]  2.1 Introduction
//   ...
//
//   Bold text within normal paragraphs is preserved as **bold**.
//   Bullet list items are preserved as "- item".
//   Heading 3 paragraphs become bold section labels (**label**).
//
// ─────────────────────────────────────────────────────────────────────────────

// ── CONFIG ───────────────────────────────────────────────────────────────────

const SOP_DOC_ID     = "YOUR_GOOGLE_DOC_ID_HERE";   // ← paste your Doc ID (from the URL)
const SOP_WEBHOOK_URL = "https://bcso-website-ivory.vercel.app/api/sync-sop";
const SOP_SECRET      = "e60cd5bde8ee8866b717c068987a148f"; // ← must match SYNC_SECRET in .env

// ── MAIN SYNC FUNCTION ───────────────────────────────────────────────────────

function syncSopNow() {
  var doc  = DocumentApp.openById(SOP_DOC_ID);
  var body = doc.getBody();
  var numChildren = body.getNumChildren();

  var sections = [];
  var currentSection    = null;
  var currentSubsection = null;
  var sectionOrder    = 0;
  var subsectionOrder = 0;

  for (var i = 0; i < numChildren; i++) {
    var element = body.getChild(i);
    var elType  = element.getType();

    if (elType === DocumentApp.ElementType.PARAGRAPH) {
      var para    = element.asParagraph();
      var heading = para.getHeading();
      var rawText = para.getText().trim();

      if (!rawText) continue;

      if (heading === DocumentApp.ParagraphHeading.HEADING1) {
        // "I. General Provisions"  or  "I — General Provisions"
        var m = rawText.match(/^([IVXLCDM\d]+)[.\s—\-]+(.+)$/i);
        currentSection = {
          number:        m ? m[1].trim() : rawText,
          title:         m ? m[2].trim() : rawText,
          display_order: ++sectionOrder,
          subsections:   [],
        };
        sections.push(currentSection);
        currentSubsection = null;
        subsectionOrder   = 0;

      } else if (heading === DocumentApp.ParagraphHeading.HEADING2) {
        // "1.1 Purpose & Scope"
        var m = rawText.match(/^([\d]+\.[\d]+)[.\s]+(.+)$/);
        if (currentSection) {
          currentSubsection = {
            number:        m ? m[1].trim() : rawText,
            title:         m ? m[2].trim() : rawText,
            display_order: ++subsectionOrder,
            content:       "",
          };
          currentSection.subsections.push(currentSubsection);
        }

      } else if (heading === DocumentApp.ParagraphHeading.HEADING3) {
        // Treated as a bold label line
        if (currentSubsection) {
          if (currentSubsection.content) currentSubsection.content += "\n";
          currentSubsection.content += "**" + rawText + "**";
        }

      } else {
        // Normal text — parse inline bold
        if (currentSubsection) {
          var parsed = parseParagraphText(para);
          if (parsed) {
            if (currentSubsection.content) currentSubsection.content += "\n";
            currentSubsection.content += parsed;
          }
        }
      }

    } else if (elType === DocumentApp.ElementType.LIST_ITEM) {
      var item     = element.asListItem();
      var itemText = item.getText().trim();
      if (currentSubsection && itemText) {
        if (currentSubsection.content) currentSubsection.content += "\n";
        currentSubsection.content += "- " + itemText;
      }
    }
  }

  Logger.log("Parsed " + sections.length + " sections.");

  var payload = JSON.stringify({ secret: SOP_SECRET, sections: sections });

  var options = {
    method:      "post",
    contentType: "application/json",
    payload:     payload,
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(SOP_WEBHOOK_URL, options);
  var code     = response.getResponseCode();
  var respBody = response.getContentText();

  if (code === 200) {
    Logger.log("✓ SOP sync complete: " + respBody);
  } else {
    Logger.log("✗ SOP sync failed (" + code + "): " + respBody);
  }
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

// Parses a paragraph's text, wrapping bold runs in **...**
function parseParagraphText(para) {
  var numChildren = para.getNumChildren();
  var result = "";

  for (var i = 0; i < numChildren; i++) {
    var child = para.getChild(i);
    if (child.getType() !== DocumentApp.ElementType.TEXT) continue;

    var textEl  = child.asText();
    var raw     = textEl.getText();
    if (!raw) continue;

    var inBold  = false;
    var chunk   = "";

    for (var j = 0; j < raw.length; j++) {
      var bold = textEl.isBold(j);
      if (bold && !inBold) {
        result += chunk;
        chunk  = "**";
        inBold = true;
      } else if (!bold && inBold) {
        result += chunk + "**";
        chunk  = "";
        inBold = false;
      }
      chunk += raw[j];
    }
    result += inBold ? chunk + "**" : chunk;
  }

  return result.trim();
}

// ── DEBUG ─────────────────────────────────────────────────────────────────────

function debugSop() {
  var doc  = DocumentApp.openById(SOP_DOC_ID);
  var body = doc.getBody();
  var numChildren = body.getNumChildren();

  Logger.log("=== DOC STRUCTURE (first 40 elements) ===");
  for (var i = 0; i < Math.min(numChildren, 40); i++) {
    var el = body.getChild(i);
    if (el.getType() === DocumentApp.ElementType.PARAGRAPH) {
      var para    = el.asParagraph();
      var heading = para.getHeading();
      var text    = para.getText().trim();
      if (!text) continue;
      var label = heading === DocumentApp.ParagraphHeading.HEADING1 ? "H1"
                : heading === DocumentApp.ParagraphHeading.HEADING2 ? "H2"
                : heading === DocumentApp.ParagraphHeading.HEADING3 ? "H3"
                : "  ";
      Logger.log("[" + label + "] " + text.slice(0, 80));
    } else if (el.getType() === DocumentApp.ElementType.LIST_ITEM) {
      Logger.log("[LI] " + el.asListItem().getText().trim().slice(0, 80));
    }
  }
  Logger.log("(Run syncSopNow to push to website)");
}

// ── TRIGGER SETUP ────────────────────────────────────────────────────────────
// Run setupSopTriggers() ONCE from the Apps Script editor.
// Installs:
//   1. onChange — syncs immediately whenever the Doc is edited
//   2. Hourly   — fallback for missed changes

function onSopChange() {
  syncSopNow();
}

function setupSopTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    var fn = triggers[i].getHandlerFunction();
    if (fn === "syncSopNow" || fn === "onSopChange") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  var doc = DocumentApp.openById(SOP_DOC_ID);

  // Trigger 1: sync on any document change
  ScriptApp.newTrigger("onSopChange")
    .forDocument(doc)
    .onChange()
    .create();

  // Trigger 2: hourly fallback
  ScriptApp.newTrigger("syncSopNow")
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log("✓ SOP triggers installed: onChange (instant) + hourly fallback.");
}

function removeSopTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  var removed  = 0;
  for (var i = 0; i < triggers.length; i++) {
    var fn = triggers[i].getHandlerFunction();
    if (fn === "syncSopNow" || fn === "onSopChange") {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  Logger.log("✓ Removed " + removed + " SOP trigger(s).");
}
