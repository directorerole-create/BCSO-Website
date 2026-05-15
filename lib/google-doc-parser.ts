import { SopSection } from "./sop-data";

export function htmlToText(html: string): string {
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

export function stripTags(html: string): string {
  return htmlToText(html).replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

/** Parse a Google Docs HTML export into SopSection[] (H1 → section, H2 → subsection). */
export function parseDocToSections(html: string): SopSection[] {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
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

  const tokens = body.split(/(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)/gi);

  for (const token of tokens) {
    const hm = token.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i);
    if (hm) {
      const level = parseInt(hm[1]);
      const raw   = stripTags(hm[2]).trim();
      if (!raw) continue;

      const numMatch = raw.match(/^([IVXivx]+\.?|\d+(?:\.\d+)?\.?|[A-Z]{2,6}\.?)\s+(.+)$/);
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
      const text = htmlToText(token).trim();
      if (!text) continue;
      if (currentSub) {
        contentBuffer += (contentBuffer ? "\n\n" : "") + text;
      } else if (currentSection) {
        subIdx++;
        currentSub    = { id: `s${sIdx}_${subIdx}`, number: `${currentSection.number}.1`, title: "Overview", content: "" };
        contentBuffer = text;
      }
    }
  }

  flushSection();
  return sections;
}
