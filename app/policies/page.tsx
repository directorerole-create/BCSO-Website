export const dynamic = "force-dynamic";
import { PoliciesClient } from "./PoliciesClient";
import { SopSection, SOP_SECTIONS } from "@/lib/sop-data";

const DOC_ID  = "1cLsB7Xgt_2VUI64OdvdFvHLHRBfAZF_FjuS3vrX3p1U";
const DOC_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=html`;

// Convert Google Docs HTML fragment to the plain-text-with-markdown format
// that renderContent() in PoliciesClient already understands.
function htmlToText(html: string): string {
  return html
    // Bold spans → **bold**
    .replace(/<(b|strong)[^>]*>([\s\S]*?)<\/(b|strong)>/gi, (_m, _t, inner) =>
      `**${htmlToText(inner).trim()}**`
    )
    // List items → "- item"
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, inner) =>
      `\n- ${htmlToText(inner).trim()}`
    )
    // Block endings → newline
    .replace(/<\/(p|div|tr|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    // Strip remaining tags
    .replace(/<[^>]+>/g, "")
    // HTML entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    // Collapse whitespace while keeping intentional newlines
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripTags(html: string): string {
  return htmlToText(html).replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

function parseDocToSections(html: string): SopSection[] {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch?.[1] ?? html;

  const sections: SopSection[] = [];
  let currentSection: SopSection | null = null;
  let currentSub: { id: string; number: string; title: string; content: string } | null = null;
  let contentBuffer = "";
  let sIdx = 0;
  let subIdx = 0;

  function flushSub() {
    if (currentSub && currentSection) {
      currentSub.content = contentBuffer.trim();
      if (currentSub.title) currentSection.subsections.push({ ...currentSub });
    }
    currentSub = null;
    contentBuffer = "";
  }

  function flushSection() {
    flushSub();
    if (currentSection && currentSection.subsections.length > 0) {
      sections.push(currentSection);
    }
    currentSection = null;
  }

  // Tokenize on heading tags so we can process them sequentially
  const tokens = body.split(/(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)/gi);

  for (const token of tokens) {
    const hm = token.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i);
    if (hm) {
      const level = parseInt(hm[1]);
      const raw   = stripTags(hm[2]).trim();
      if (!raw) continue;

      // Parse leading number/roman-numeral prefix (e.g. "I." / "1.1" / "ADD")
      const numMatch = raw.match(/^([IVXivx]+\.?|\d+(?:\.\d+)?\.?|[A-Z]{2,4}\.?)\s+(.+)$/);
      const num   = numMatch ? numMatch[1].replace(/\.$/, "") : "";
      const title = numMatch ? numMatch[2] : raw;

      if (level === 1) {
        flushSection();
        sIdx++;
        subIdx = 0;
        currentSection = { id: `s${sIdx}`, number: num || String(sIdx), title, subsections: [] };
      } else if (level === 2) {
        flushSub();
        if (!currentSection) {
          sIdx++;
          currentSection = { id: `s${sIdx}`, number: String(sIdx), title: "General", subsections: [] };
        }
        subIdx++;
        currentSub = {
          id:      `s${sIdx}_${subIdx}`,
          number:  num || `${sIdx}.${subIdx}`,
          title,
          content: "",
        };
      }
    } else {
      // Content block — accumulate for current subsection
      const text = htmlToText(token).trim();
      if (!text) continue;

      if (currentSub) {
        contentBuffer += (contentBuffer ? "\n\n" : "") + text;
      } else if (currentSection) {
        // Text before any H2 in this section — create an implicit intro subsection
        subIdx++;
        currentSub    = { id: `s${sIdx}_${subIdx}`, number: `${currentSection.number}.1`, title: "Overview", content: "" };
        contentBuffer = text;
      }
    }
  }

  flushSection();
  return sections;
}

async function getSop(): Promise<{ sections: SopSection[]; source: "live" | "offline" }> {
  try {
    const res = await fetch(DOC_URL, { cache: "no-store" });
    if (!res.ok) return { sections: SOP_SECTIONS, source: "offline" };

    const html     = await res.text();
    const sections = parseDocToSections(html);

    if (sections.length > 2) return { sections, source: "live" };
    return { sections: SOP_SECTIONS, source: "offline" };
  } catch {
    return { sections: SOP_SECTIONS, source: "offline" };
  }
}

export default async function PoliciesPage() {
  const { sections, source } = await getSop();
  return <PoliciesClient sections={sections} source={source} />;
}
