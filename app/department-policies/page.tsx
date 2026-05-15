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

  // State
  let addPoliciesLevel = -1;   // heading level of the "Additional Policies" H1
  let policyLevel      = -1;   // heading level of each individual policy title
  let currentPolicy: (DeptPolicy & { _level: number }) | null = null;
  let currentSection: { heading: string; body: string } | null = null;
  let contentBuffer = "";
  let policyIdx = 0;

  function flushSection() {
    if (currentSection && currentPolicy) {
      currentSection.body = contentBuffer.trim();
      if (currentSection.heading) currentPolicy.sections.push({ ...currentSection });
    }
    currentSection = null;
    contentBuffer = "";
  }

  function flushPolicy() {
    flushSection();
    if (currentPolicy && currentPolicy.sections.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _level, ...policy } = currentPolicy;
      policies.push(policy);
    }
    currentPolicy = null;
  }

  for (const token of tokens) {
    const hm = token.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i);

    if (hm) {
      const level = parseInt(hm[1]);
      const raw   = stripTags(hm[2]).trim();
      if (!raw) continue;

      // ── Find the "Additional Policies" parent heading ──────────────────
      if (addPoliciesLevel === -1) {
        if (/additional\s+polic|additional\s+direct|department\s+polic|bcso\s+polic/i.test(raw)) {
          addPoliciesLevel = level;
          policyLevel      = level + 1; // policies are one level below
        }
        continue;
      }

      // ── Back out to same/higher level → done ───────────────────────────
      if (level <= addPoliciesLevel) {
        flushPolicy();
        break;
      }

      // ── Policy title heading ────────────────────────────────────────────
      if (level === policyLevel) {
        flushPolicy();
        policyIdx++;
        currentPolicy = {
          id:            `bcso-live-${policyIdx}`,
          number:        `BCSO.${policyIdx.toString().padStart(3, "0")}`,
          docNumber:     `BCSO.${policyIdx.toString().padStart(4, "0")}`,
          title:         raw,
          effectiveDate: "",
          lastUpdated:   "",
          sections:      [],
          _level:        level,
        };
        continue;
      }

      // ── Section heading within a policy ────────────────────────────────
      if (currentPolicy && level > policyLevel) {
        flushSection();
        currentSection = { heading: raw, body: "" };
        continue;
      }

    } else if (addPoliciesLevel !== -1 && currentPolicy) {
      // Content block — metadata or section body
      const text = htmlToText(token).trim();
      if (!text) continue;

      if (currentSection) {
        contentBuffer += (contentBuffer ? "\n\n" : "") + text;
      } else {
        // Try to pull directive metadata from body text before the first section heading
        const dir = text.match(/Directive\s*(?:No\.?|Number)[:\s]+([^\n,]+)/i);
        const eff = text.match(/Effective\s*Date[:\s]+([^\n,]+)/i);
        const upd = text.match(/Last\s*Updated[:\s]+([^\n,]+)/i);
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

  // ── Fallback: if no "Additional Policies" heading was found,
  //    try matching any heading that directly starts with BCSO ─────────────
  if (policies.length === 0) {
    let current2: (DeptPolicy & { _level: number }) | null = null;
    let section2: { heading: string; body: string } | null = null;
    let buf2 = "";
    let idx2 = 0;

    function flush2s() {
      if (section2 && current2) {
        section2.body = buf2.trim();
        if (section2.heading) current2.sections.push({ ...section2 });
      }
      section2 = null;
      buf2 = "";
    }
    function flush2p() {
      flush2s();
      if (current2 && current2.sections.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _level, ...p } = current2;
        policies.push(p);
      }
      current2 = null;
    }

    for (const token of tokens) {
      const hm = token.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i);
      if (hm) {
        const level = parseInt(hm[1]);
        const raw   = stripTags(hm[2]).trim();
        if (!raw) continue;

        if (/^BCSO/i.test(raw)) {
          flush2p();
          idx2++;
          const title = raw.replace(/^BCSO\.?\d*\s*[-–—]?\s*/i, "").trim() || raw;
          current2 = {
            id: `bcso-fb-${idx2}`, number: `BCSO.${idx2.toString().padStart(3,"0")}`,
            docNumber: `BCSO.${idx2.toString().padStart(4,"0")}`, title,
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
          const bcso = text.match(/BCSO\.?(\d+)/i);
          const eff  = text.match(/Effective\s*Date[:\s]+([^\n,]+)/i);
          const upd  = text.match(/Last\s*Updated[:\s]+([^\n,]+)/i);
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
