// ─────────────────────────────────────────────────────────────────────────────
// BCSO SOP Sync — Google Apps Script (Document Tabs edition)
// Each tab in the Google Doc = one SOP section.
// Heading 2 inside a tab = subsection. Normal text = content.
//
// HOW TO FORMAT YOUR DOC TABS:
//   Tab title:   "I. General Provisions"   (number + period + title)
//   [Heading 2]  1.1 Purpose & Scope
//   [Normal]     Content text...
//   [Heading 2]  1.2 Authority of the Sheriff
//   [Normal]     More content...
//
//   Bold text within normal paragraphs is preserved as **bold**.
//   Bullet list items are preserved as "- item".
//   Heading 3 lines become bold labels (**label**).
// ─────────────────────────────────────────────────────────────────────────────

// ── CONFIG ───────────────────────────────────────────────────────────────────

const SOP_DOC_ID     = "1uqbbzk089ljISPFS5FK78JoPHuEJtVBu-U1SbQYMygQ";   // ← paste your Doc ID (from the URL)
const SOP_WEBHOOK_URL = "https://bcso-website-ivory.vercel.app/api/sync-sop";
const SOP_SECRET      = "e60cd5bde8ee8866b717c068987a148f"; // ← must match SYNC_SECRET in .env

// ── MAIN SYNC FUNCTION ───────────────────────────────────────────────────────

function syncSopNow() {
  var doc  = DocumentApp.openById(SOP_DOC_ID);
  var tabs = doc.getTabs();

  var sections     = [];
  var sectionOrder = 0;

  for (var t = 0; t < tabs.length; t++) {
    var processed = processTab(tabs[t], ++sectionOrder);
    if (processed) sections.push(processed);
  }

  Logger.log("Parsed " + sections.length + " sections from " + tabs.length + " tabs.");

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

// Processes a single tab into a section object.
function processTab(tab, order) {
  var tabTitle = tab.getTitle().trim();
  var docTab   = tab.asDocumentTab();
  var body     = docTab.getBody();
  var numChildren = body.getNumChildren();

  // Parse tab title formats:
  //   "BCSO.001 - Vehicle Pursuit Policy"  → number: "BCSO.001", title: "Vehicle Pursuit Policy"
  //   "I. General Provisions"              → number: "I",         title: "General Provisions"
  //   anything else                        → number: order,       title: full tab title
  var m = tabTitle.match(/^(BCSO\.\d+)\s*[-–—]\s*(.+)$/i)
       || tabTitle.match(/^(?:Section\s+)?([IVXLCDM\d]+)[.\s—\-]+(.+)$/i);

  var section = {
    number:        m ? m[1].trim() : String(order),
    title:         m ? m[2].trim() : tabTitle,
    display_order: order,
    subsections:   [],
  };

  var currentSubsection = null;
  var subsectionOrder   = 0;
  var hasH2 = false;

  for (var i = 0; i < numChildren; i++) {
    var element = body.getChild(i);
    var elType  = element.getType();

    if (elType === DocumentApp.ElementType.PARAGRAPH) {
      var para    = element.asParagraph();
      var heading = para.getHeading();
      var rawText = para.getText().trim();

      if (!rawText) continue;

      if (heading === DocumentApp.ParagraphHeading.HEADING1) {
        // Skip — tab title is already the section title

      } else if (heading === DocumentApp.ParagraphHeading.HEADING2) {
        hasH2 = true;
        // H2 is just a plain title like "Purpose" — no numeric prefix required
        var m2 = rawText.match(/^([\d]+\.[\d]+)[.\s]+(.+)$/);
        currentSubsection = {
          number:        m2 ? m2[1].trim() : "",
          title:         m2 ? m2[2].trim() : rawText,
          display_order: ++subsectionOrder,
          content:       "",
        };
        section.subsections.push(currentSubsection);

      } else if (heading === DocumentApp.ParagraphHeading.HEADING3) {
        if (currentSubsection) {
          if (currentSubsection.content) currentSubsection.content += "\n";
          currentSubsection.content += "**" + rawText + "**";
        }

      } else {
        // Normal text — only add once we have a subsection to attach to
        if (currentSubsection) {
          var parsed = parseParagraphText(para);
          if (parsed) {
            if (currentSubsection.content) currentSubsection.content += "\n";
            currentSubsection.content += parsed;
          }
        }
      }

    } else if (elType === DocumentApp.ElementType.LIST_ITEM) {
      var itemText = element.asListItem().getText().trim();
      if (currentSubsection && itemText) {
        if (currentSubsection.content) currentSubsection.content += "\n";
        currentSubsection.content += "- " + itemText;
      }
    }
  }

  // If no H2 headings were found, collect all text as a single "Overview" subsection
  if (!hasH2) {
    var allText = "";
    for (var i = 0; i < numChildren; i++) {
      var el = body.getChild(i);
      if (el.getType() === DocumentApp.ElementType.PARAGRAPH) {
        var p  = el.asParagraph();
        if (p.getHeading() !== DocumentApp.ParagraphHeading.NORMAL_TEXT &&
            p.getHeading() !== DocumentApp.ParagraphHeading.HEADING1) continue;
        var parsed = parseParagraphText(p);
        if (parsed) {
          if (allText) allText += "\n";
          allText += parsed;
        }
      } else if (el.getType() === DocumentApp.ElementType.LIST_ITEM) {
        var it = el.asListItem().getText().trim();
        if (it) {
          if (allText) allText += "\n";
          allText += "- " + it;
        }
      }
    }
    if (allText) {
      section.subsections.push({
        number: "", title: "Overview", display_order: 1, content: allText,
      });
    }
  }

  return section;
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

function parseParagraphText(para) {
  var numChildren = para.getNumChildren();
  var result = "";

  for (var i = 0; i < numChildren; i++) {
    var child = para.getChild(i);
    if (child.getType() !== DocumentApp.ElementType.TEXT) continue;

    var textEl = child.asText();
    var raw    = textEl.getText();
    if (!raw) continue;

    var inBold = false;
    var chunk  = "";

    for (var j = 0; j < raw.length; j++) {
      var bold = textEl.isBold(j);
      if (bold && !inBold) {
        result += chunk; chunk = "**"; inBold = true;
      } else if (!bold && inBold) {
        result += chunk + "**"; chunk = ""; inBold = false;
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
  var tabs = doc.getTabs();

  Logger.log("=== TABS FOUND: " + tabs.length + " ===");
  for (var t = 0; t < tabs.length; t++) {
    var tab   = tabs[t];
    var title = tab.getTitle();
    var body  = tab.asDocumentTab().getBody();
    var n     = body.getNumChildren();

    Logger.log("Tab " + (t+1) + ": \"" + title + "\" (" + n + " elements)");

    var shown = 0;
    for (var i = 0; i < n && shown < 6; i++) {
      var el = body.getChild(i);
      if (el.getType() === DocumentApp.ElementType.PARAGRAPH) {
        var para = el.asParagraph();
        var text = para.getText().trim();
        if (!text) continue;
        var h = para.getHeading();
        var label = h === DocumentApp.ParagraphHeading.HEADING1 ? "H1"
                  : h === DocumentApp.ParagraphHeading.HEADING2 ? "H2"
                  : h === DocumentApp.ParagraphHeading.HEADING3 ? "H3" : "  ";
        Logger.log("  [" + label + "] " + text.slice(0, 80));
        shown++;
      }
    }

    var childTabs = tab.getChildTabs();
    if (childTabs.length > 0) {
      Logger.log("  └─ " + childTabs.length + " child tab(s):");
      for (var c = 0; c < childTabs.length; c++) {
        Logger.log("     Tab: \"" + childTabs[c].getTitle() + "\"");
      }
    }
  }
  Logger.log("(Run syncSopNow to push to website)");
}

// ── TRIGGER SETUP ────────────────────────────────────────────────────────────

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

  ScriptApp.newTrigger("onSopChange")
    .forDocument(doc)
    .onChange()
    .create();

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
