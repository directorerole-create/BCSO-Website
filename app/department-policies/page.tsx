export const dynamic = "force-dynamic";
import { DeptPoliciesClient } from "./DeptPoliciesClient";
import { DeptPolicy, DEPT_POLICIES } from "@/lib/dept-policies-data";

const DOC_ID = "1cLsB7Xgt_2VUI64OdvdFvHLHRBfAZF_FjuS3vrX3p1U";

const POLICY_TABS = [
  "t.62fc2crsz9u0",  // BCSO.001 - Vehicle Pursuit
  "t.ocvm42klu6pd",  // BCSO.002 - Suspect Detention & Arrest
  "t.tt5755as3u6w",  // BCSO.003 - Supervisor Request & Response
  "t.amtk98ms9qa7",  // BCSO.004 - Female Suspect Search
  "t.wrc111um5esm",  // BCSO.005 - Ride-Along
  "t.26qv6ar024aa",  // BCSO.006 - Cruise Lights Usage
  "t.wamcnjh4q9to",  // BCSO.007 - DUI Investigations & SFSTs
  "t.lemffwu40mmu",  // BCSO.008 - Unmarked Vehicle
  "t.krald6ncigxl",  // BCSO.009 - Plain Clothes Usage
  "t.ruu8d15dyyb9",  // BCSO.010 - Firearm Usage
  "t.hwsjacbpp9wh",  // BCSO.011 - UC Vehicle
  "t.mtzc116ol9t",   // BCSO.012 - Off Duty Roleplay
];

const POLICY_NAMES = [
  "Vehicle Pursuit",
  "Suspect Detention & Arrest",
  "Supervisor Request & Response",
  "Female Suspect Search",
  "Ride-Along",
  "Cruise Lights Usage",
  "DUI Investigations & SFSTs",
  "Unmarked Vehicle",
  "Plain Clothes Usage",
  "Firearm Usage",
  "UC Vehicle",
  "Off Duty Roleplay",
];

function htmlToText(html: string): string {
  return html
    .replace(/<(b|strong)[^>]*>([\s\S]*?)<\/(b|strong)>/gi, (_m, _t, inner) =>
      `**${htmlToText(inner).trim()}**`
    )
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, inner) =>
      `\n- ${htmlToText(inner).trim()}`
    )
    .replace(/<\/(p|div|tr|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘").replace(/&rsquo;/g, "’")
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function stripTags(html: string): string {
  return htmlToText(html).replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

const SECTION_NAME_RE = /^(purpose|scope|definitions?|directive|policy|procedures?|overview|authorization|background|introduction)\s*$/i;
const ORG_NAME_RE = /^(blaine county|sheriff.?s office|bcso)\s*$/i;

/** Parse a single policy tab's HTML into a DeptPolicy. */
function parseTabToPolicy(html: string, fallbackIndex: number, fallbackName?: string): DeptPolicy | null {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const tokens = body.split(/(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)/gi);

  let title = "";
  let docNumber = "";
  let effectiveDate = "";
  let lastUpdated = "";
  const sections: { heading: string; body: string }[] = [];

  let sectionLevel = -1;
  let foundTitle = false;
  let currentSection: { heading: string; body: string } | null = null;
  let contentBuffer = "";

  function flushSection() {
    if (currentSection) {
      currentSection.body = contentBuffer.trim();
      if (currentSection.body) sections.push({ ...currentSection });
    }
    currentSection = null;
    contentBuffer = "";
  }

  function extractMeta(text: string) {
    const dir  = text.match(/Directive\s*(?:No\.?|Number)[:\s]+([^\n,]+)/i);
    const eff  = text.match(/Effective\s*Date[:\s]+([^\n,]+)/i);
    const upd  = text.match(/(?:Last\s*Updated|Revised)[:\s]+([^\n,]+)/i);
    const bcso = text.match(/BCSO\.?(\d+)/i);
    if (dir  && !docNumber)     docNumber     = dir[1].trim();
    if (eff  && !effectiveDate) effectiveDate = eff[1].trim();
    if (upd  && !lastUpdated)   lastUpdated   = upd[1].trim();
    if (bcso && !docNumber)     docNumber     = `BCSO.${bcso[1].padStart(4, "0")}`;
  }

  for (const token of tokens) {
    const hm = token.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i);

    if (hm) {
      const level = parseInt(hm[1]);
      const raw   = stripTags(hm[2]).trim();
      if (!raw) continue;

      // Always skip org-name / decorative headings
      if (ORG_NAME_RE.test(raw)) continue;

      if (!foundTitle) {
        if (SECTION_NAME_RE.test(raw)) {
          // First heading is a section name, not the policy title.
          // Treat it directly as the first section; title will use fallback.
          foundTitle   = true;
          sectionLevel = level;
          currentSection = { heading: raw, body: "" };
        } else {
          title      = raw;
          foundTitle = true;
        }
        continue;
      }

      // --- post-title headings become sections ---
      if (sectionLevel === -1) sectionLevel = level;

      if (level <= sectionLevel) {
        flushSection();
        if (level < sectionLevel) sectionLevel = level;
        currentSection = { heading: raw, body: "" };
      } else {
        // Deeper heading → bold sub-heading inline
        const bold = `**${raw}**`;
        if (currentSection) {
          contentBuffer += (contentBuffer ? "\n\n" : "") + bold;
        } else {
          sectionLevel   = level;
          currentSection = { heading: raw, body: "" };
        }
      }

    } else {
      const text = htmlToText(token).trim();
      if (!text) continue;

      // Extract metadata from any non-section text (pre-heading or between title and first section)
      if (!foundTitle || !currentSection) {
        extractMeta(text);
      }

      if (!foundTitle) continue;

      if (currentSection) {
        contentBuffer += (contentBuffer ? "\n\n" : "") + text;
      }
    }
  }

  flushSection();

  // If no title heading was found, derive from fallback name or doc number
  if (!title) {
    title = fallbackName || docNumber || "";
  }

  if (!title || sections.length === 0) return null;

  // Build BCSO number, stripping leading zeros to normalise to 3 digits
  const numMatch = docNumber.match(/(\d+)/);
  const raw3 = numMatch
    ? (numMatch[1].replace(/^0+/, "") || "0").padStart(3, "0")
    : (fallbackIndex + 1).toString().padStart(3, "0");

  // Strip any leading "BCSO.NNN — " prefix that ended up in the title
  const cleanTitle = title.replace(/^BCSO\.?\d+\s*[-–—]?\s*/i, "").trim() || title;

  return {
    id:            `bcso-live-${raw3}`,
    number:        `BCSO.${raw3}`,
    docNumber:     docNumber || `BCSO.${raw3.padStart(4, "0")}`,
    title:         cleanTitle,
    effectiveDate,
    lastUpdated,
    sections,
  };
}

async function fetchTab(tabId: string, index: number): Promise<DeptPolicy | null> {
  const url = `https://docs.google.com/document/d/${DOC_ID}/export?format=html&tab=${tabId}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return parseTabToPolicy(await res.text(), index, POLICY_NAMES[index]);
  } catch {
    return null;
  }
}

async function getDeptPolicies(): Promise<{ policies: DeptPolicy[]; source: "live" | "offline" }> {
  try {
    const results  = await Promise.all(POLICY_TABS.map((tab, i) => fetchTab(tab, i)));
    const policies = results.filter((p): p is DeptPolicy => p !== null);
    if (policies.length > 0) return { policies, source: "live" };
  } catch { /* fall through */ }
  return { policies: DEPT_POLICIES, source: "offline" };
}

export default async function DepartmentPoliciesPage() {
  const { policies, source } = await getDeptPolicies();
  return <DeptPoliciesClient policies={policies} source={source} />;
}
