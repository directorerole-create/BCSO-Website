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
  const policies: DeptPolicy[] = [];

  let current: (DeptPolicy & { _policyLevel: number }) | null = null;
  let currentSection: { heading: string; body: string } | null = null;
  let contentBuffer = "";
  let policyIdx = 0;

  function flushSection() {
    if (currentSection && current) {
      currentSection.body = contentBuffer.trim();
      if (currentSection.heading) current.sections.push({ ...currentSection });
    }
    currentSection = null;
    contentBuffer = "";
  }

  function flushPolicy() {
    flushSection();
    if (current && current.sections.length > 0) {
      const { _policyLevel: _, ...policy } = current;
      policies.push(policy);
    }
    current = null;
  }

  const tokens = body.split(/(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)/gi);

  for (const token of tokens) {
    const hm = token.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i);
    if (hm) {
      const level = parseInt(hm[1]);
      const raw   = stripTags(hm[2]).trim();
      if (!raw) continue;

      // Detect any heading that starts with BCSO (e.g. "BCSO.001 Vehicle Pursuit Policy")
      const bcsoMatch = raw.match(/^(BCSO\.?\d+)\s*[-–—]?\s*(.*)/i);

      if (bcsoMatch) {
        flushPolicy();
        policyIdx++;
        const num    = bcsoMatch[1].toUpperCase().replace(/^BCSO(\d)/, "BCSO.$1");
        const title  = bcsoMatch[2].trim() || num;
        const docNum = num.replace(/(\d+)$/, n => n.padStart(4, "0"));

        current = {
          id:            `bcso-live-${policyIdx}`,
          number:        num,
          docNumber:     docNum,
          title,
          effectiveDate: "",
          lastUpdated:   "",
          sections:      [],
          _policyLevel:  level,
        };
      } else if (current && level > current._policyLevel) {
        // Sub-heading within this policy → becomes a section
        flushSection();
        currentSection = { heading: raw, body: "" };
      } else if (current && level <= current._policyLevel) {
        // Same or higher level heading outside BCSO → end of policies
        flushPolicy();
      }
    } else if (current) {
      const text = htmlToText(token).trim();
      if (!text) continue;

      if (currentSection) {
        contentBuffer += (contentBuffer ? "\n\n" : "") + text;
      } else {
        // Metadata block before first sub-heading — extract dates
        const eff = text.match(/Effective\s+Date[:\s]+([^\n]+)/i);
        const upd = text.match(/Last\s+Updated[:\s]+([^\n]+)/i);
        const dir = text.match(/Directive\s+Number[:\s]+([^\n]+)/i);
        if (eff) current.effectiveDate = eff[1].trim();
        if (upd) current.lastUpdated   = upd[1].trim();
        if (dir) current.docNumber     = dir[1].trim();
      }
    }
  }

  flushPolicy();
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
