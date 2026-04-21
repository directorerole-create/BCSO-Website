/**
 * POLICY SYNC — Google Apps Script
 * Paste this into your Policy Google Doc's Apps Script editor
 *
 * SETUP:
 * 1. Open one of your Policy Google Docs
 * 2. Go to Extensions > Apps Script
 * 3. Paste this script
 * 4. Set the constants below
 * 5. Run setupDocTrigger() once
 *
 * The script reads the Doc's content and syncs it to the website.
 * It uses the Doc ID as the unique identifier for the policy.
 *
 * Add a special first line to your Doc in this format:
 * [POLICY: SOP-001 | Category: Operations]
 * This line is removed from content but used to set metadata.
 */

const POLICY_WEBHOOK_URL = "https://YOUR_VERCEL_DOMAIN/api/sync-policies";
const SYNC_SECRET = "YOUR_SYNC_SECRET_HERE";

function syncPolicyToWebsite() {
  const doc = DocumentApp.getActiveDocument();
  const docId = doc.getId();
  const title = doc.getName();
  const body = doc.getBody().getText();

  // Parse optional metadata line at the top:
  // [POLICY: SOP-001 | Category: Patrol]
  let policyNumber = null;
  let category = "General";
  let content = body;

  const metaMatch = body.match(/^\[POLICY:\s*([^\|]+)\s*\|\s*Category:\s*([^\]]+)\]/i);
  if (metaMatch) {
    policyNumber = metaMatch[1].trim();
    category = metaMatch[2].trim();
    content = body.replace(metaMatch[0], "").trim();
  }

  const payload = JSON.stringify({
    secret: SYNC_SECRET,
    policy: {
      doc_id: docId,
      title: title,
      category: category,
      content: content,
      policy_number: policyNumber,
    },
  });

  const options = {
    method: "post",
    contentType: "application/json",
    payload: payload,
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(POLICY_WEBHOOK_URL, options);
    const result = JSON.parse(response.getContentText());
    Logger.log("Policy sync result: " + JSON.stringify(result));
  } catch (e) {
    Logger.log("Policy sync error: " + e.toString());
  }
}

function setupDocTrigger() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === "syncPolicyToWebsite") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Trigger on document save (time-driven as fallback since Docs don't have onEdit)
  // This syncs every 5 minutes when the doc is open
  ScriptApp.newTrigger("syncPolicyToWebsite")
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log("Trigger installed. Policy syncs every 5 minutes.");
}
