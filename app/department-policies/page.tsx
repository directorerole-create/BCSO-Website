export const dynamic = "force-dynamic";
import { DeptPoliciesClient } from "./DeptPoliciesClient";
import { DeptPolicy, DEPT_POLICIES } from "@/lib/dept-policies-data";

const DOC_ID  = "1cLsB7Xgt_2VUI64OdvdFvHLHRBfAZF_FjuS3vrX3p1U";
const DOC_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=html`;

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

function parseDocToPolicies(html: string): DeptPolicy[] {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const tokens = body.split(/(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)/gi);

  const policies: DeptPolicy[] = [];

  // Phase tracking
  let inPolicies = false;
  let sopH1Level = 1;
  let romanCount = 0;         // how many Roman-numeral H1s we've seen
  let parentLevel = -1;
  let policyLevel = -1;
  let sectionLevel = -1;

  let currentPolicy: (DeptPolicy & { _level: number }) | null = null;
  let currentSection: { heading: string; body: string } | null = null;
  let contentBuffer = "";
  let preContentBuffer = "";  // content before first section heading
  let policyIdx = 0;

  function flushSection() {
    if (currentSection && currentPolicy) {
      currentSection.body = contentBuffer.trim();
      if (currentSection.body) currentPolicy.sections.push({ ...currentSection });
    }
    currentSection = null;
    contentBuffer = "";
  }

  function flushPolicy() {
    flushSection();
    if (currentPolicy) {
      // If there are no H3 sections but we accumulated pre-section content, use it
      if (currentPolicy.sections.length === 0 && preContentBuffer.trim()) {
        currentPolicy.sections.push({ heading: "Policy Details", body: preContentBuffer.trim() });
      }
      if (currentPolicy.sections.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _level, ...policy } = currentPolicy;
        policies.push(policy);
      }
    }
    currentPolicy = null;
    preContentBuffer = "";
  }

  for (const token of tokens) {
    const hm = token.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i);

    if (hm) {
      const level = parseInt(hm[1]);
      const raw   = stripTags(hm[2]).trim();
      if (!raw) continue;

      const numMatch = raw.match(/^([IVXivx]+\.?|\d+(?:\.\d+)?\.?|[A-Z]{2,6}\.?)\s+(.+)$/);
      const num = numMatch ? numMatch[1].replace(/\.$/, "") : "";
      const isRomanNumeral = /^[IVX]+$/i.test(num);

      if (!inPolicies) {
        // Track SOP sections (Roman numeral H1s)
        if (isRomanNumeral && level === 1) {
          romanCount++;
          sopH1Level = level;
          continue;
        }

        // Detect the additional policies parent heading:
        // 1. Explicit text patterns
        const isExplicit = /additional\s*polic|additional\s*direct|bcso\s*(polic|direct)|department\s*polic|supplement|appendix/i.test(raw);
        // 2. Non-Roman-numeral H1 after we've seen at least 3 Roman numeral sections
        const isPostRoman = romanCount >= 3 && level <= sopH1Level && !isRomanNumeral;

        if (isExplicit || isPostRoman) {
          inPolicies = true;
          parentLevel = level;
          policyLevel = level + 1;
          sectionLevel = level + 2;
        }
        continue;
      }

      // ── Inside the policies section ────────────────────────────────────
      {
        // Back to same or higher level → done with policies
        if (level <= parentLevel) {
          flushPolicy();
          break;
        }

        // Policy title heading
        if (level === policyLevel) {
          flushPolicy();
          policyIdx++;
          const bcsoMatch = raw.match(/BCSO\.?(\d+)/i);
          const n = bcsoMatch ? bcsoMatch[1] : policyIdx.toString();
          const title = raw.replace(/^BCSO\.?\d+\s*[-–—]?\s*/i, "").trim() || raw;
          currentPolicy = {
            id:            `bcso-live-${n}`,
            number:        `BCSO.${n.padStart(3, "0")}`,
            docNumber:     `BCSO.${n.padStart(4, "0")}`,
            title,
            effectiveDate: "",
            lastUpdated:   "",
            sections:      [],
            _level:        level,
          };
          continue;
        }

        // Section heading within a policy
        if (currentPolicy && level === sectionLevel) {
          flushSection();
          currentSection = { heading: raw, body: "" };
          continue;
        }

        // Deeper-than-section headings → append as bold text to current section
        if (currentPolicy && level > sectionLevel && currentSection) {
          contentBuffer += (contentBuffer ? "\n\n" : "") + `**${raw}**`;
          continue;
        }
      }

    } else {
      // Non-heading content block
      if (!inPolicies || !currentPolicy) continue;

      const text = htmlToText(token).trim();
      if (!text) continue;

      if (currentSection) {
        contentBuffer += (contentBuffer ? "\n\n" : "") + text;
      } else {
        // Content before the first section heading — extract metadata + accumulate
        preContentBuffer += (preContentBuffer ? "\n\n" : "") + text;

        const dir  = text.match(/Directive\s*(?:No\.?|Number)[:\s]+([^\n,]+)/i);
        const eff  = text.match(/Effective\s*Date[:\s]+([^\n,]+)/i);
        const upd  = text.match(/(?:Last\s*Updated|Revised)[:\s]+([^\n,]+)/i);
        const bcso = text.match(/BCSO\.?(\d+)/i);

        if (dir)  currentPolicy.docNumber     = dir[1].trim();
        if (eff)  currentPolicy.effectiveDate = eff[1].trim();
        if (upd)  currentPolicy.lastUpdated   = upd[1].trim();
        if (bcso) {
          const n = bcso[1];
          currentPolicy.number   = `BCSO.${n.padStart(3, "0")}`;
          currentPolicy.docNumber = `BCSO.${n.padStart(4, "0")}`;
          currentPolicy.id       = `bcso-live-${n}`;
        }
      }
    }
  }

  flushPolicy();

  // ── Fallback: scan for headings that start with BCSO ──────────────────────
  if (policies.length === 0) {
    let current2: (DeptPolicy & { _level: number }) | null = null;
    let section2: { heading: string; body: string } | null = null;
    let buf2 = "";
    let preBuf2 = "";
    let idx2 = 0;

    function flush2s() {
      if (section2 && current2) {
        section2.body = buf2.trim();
        if (section2.body) current2.sections.push({ ...section2 });
      }
      section2 = null;
      buf2 = "";
    }
    function flush2p() {
      flush2s();
      if (current2) {
        if (current2.sections.length === 0 && preBuf2.trim()) {
          current2.sections.push({ heading: "Policy Details", body: preBuf2.trim() });
        }
        if (current2.sections.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _level, ...p } = current2;
          policies.push(p);
        }
      }
      current2 = null;
      preBuf2 = "";
    }

    for (const token of tokens) {
      const hm = token.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i);
      if (hm) {
        const level = parseInt(hm[1]);
        const raw   = stripTags(hm[2]).trim();
        if (!raw) continue;

        if (/^BCSO/i.test(raw) || /\bBCSO\.?\d+/i.test(raw)) {
          flush2p();
          idx2++;
          const title = raw.replace(/^BCSO\.?\d+\s*[-–—]?\s*/i, "").trim() || raw;
          const bcsoM = raw.match(/BCSO\.?(\d+)/i);
          const n = bcsoM ? bcsoM[1] : idx2.toString();
          current2 = {
            id: `bcso-fb-${n}`, number: `BCSO.${n.padStart(3, "0")}`,
            docNumber: `BCSO.${n.padStart(4, "0")}`, title,
            effectiveDate: "", lastUpdated: "", sections: [], _level: level,
          };
        } else if (current2 && level > current2._level) {
          flush2s();
          section2 = { heading: raw, body: "" };
        } else if (current2 && level <= current2._level) {
          flush2p();
        }
      } else if (current2) {
        const text = htmlToText(token).trim();
        if (!text) continue;
        if (section2) {
          buf2 += (buf2 ? "\n\n" : "") + text;
        } else {
          preBuf2 += (preBuf2 ? "\n\n" : "") + text;
          const bcso = text.match(/BCSO\.?(\d+)/i);
          const eff  = text.match(/Effective\s*Date[:\s]+([^\n,]+)/i);
          const upd  = text.match(/(?:Last\s*Updated|Revised)[:\s]+([^\n,]+)/i);
          if (bcso) { const n = bcso[1]; current2.number = `BCSO.${n.padStart(3,"0")}`; current2.docNumber = `BCSO.${n.padStart(4,"0")}`; }
          if (eff)  current2.effectiveDate = eff[1].trim();
          if (upd)  current2.lastUpdated   = upd[1].trim();
        }
      }
    }
    flush2p();
  }

  return policies;
}

async function getDeptPolicies(): Promise<{ policies: DeptPolicy[]; source: "live" | "offline" }> {
  try {
    const res = await fetch(DOC_URL, { cache: "no-store" });
    if (!res.ok) return { policies: DEPT_POLICIES, source: "offline" };

    const html     = await res.text();
    const policies = parseDocToPolicies(html);

    if (policies.length > 0) return { policies, source: "live" };
    return { policies: DEPT_POLICIES, source: "offline" };
  } catch {
    return { policies: DEPT_POLICIES, source: "offline" };
  }
}

export default async function DepartmentPoliciesPage() {
  const { policies, source } = await getDeptPolicies();
  return <DeptPoliciesClient policies={policies} source={source} />;
}
