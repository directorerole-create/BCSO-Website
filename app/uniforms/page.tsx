export const dynamic = "force-dynamic";
import { UniformsClient } from "./UniformsClient";

const AE_SHEET_ID = "1TpKSyDi3ZaYP-uTRT-vL5-PZdRoIyWUUzzfutcOnPd8";
const AE_GID      = "246884040";

export type AECategory = { name: string; items: string[] };
export type AEData     = { categories: AECategory[]; source: "live" | "fallback" };

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"')            { inQuotes = false; }
      else                            { field += ch; }
    } else {
      if      (ch === '"')                   { inQuotes = true; }
      else if (ch === ',')                   { row.push(field); field = ""; }
      else if (ch === '\r' && next === '\n') { row.push(field); field = ""; rows.push(row); row = []; i++; }
      else if (ch === '\n')                  { row.push(field); field = ""; rows.push(row); row = []; }
      else                                   { field += ch; }
    }
  }
  if (row.length > 0 || field) { row.push(field); rows.push(row); }
  return rows;
}

// ── AE parser ─────────────────────────────────────────────────────────────────

// Category keywords found in AE spreadsheet headers
const CAT_KEYWORDS = /armor|vest|belt|holster|hat|headgear|rank|insignia|camera|mic|body|accessory/i;

function extractItemNums(cells: string[]): string[] {
  const nums: string[] = [];
  for (const cell of cells) {
    // Match #NNN or standalone numbers 2-4 digits
    const matches = [...cell.matchAll(/#(\d{2,4})/g), ...cell.matchAll(/\b(\d{2,4})\b/g)];
    for (const m of matches) {
      const n = `#${m[1]}`;
      if (!nums.includes(n)) nums.push(n);
    }
  }
  return nums;
}

function parseAE(rows: string[][]): AECategory[] {
  const cats: AECategory[] = [];
  let current: AECategory | null = null;

  for (const row of rows) {
    const cells = row.map(c => c.trim());
    const nonEmpty = cells.filter(Boolean);
    if (nonEmpty.length === 0) continue;

    const nums = extractItemNums(nonEmpty);

    if (nums.length > 0) {
      // Row has item numbers — add to current category
      if (!current) {
        current = { name: "General", items: [] };
        cats.push(current);
      }
      for (const n of nums) {
        if (!current.items.includes(n)) current.items.push(n);
      }
    } else {
      // No numbers — check if it's a category header
      const firstCell = nonEmpty[0];
      if (
        firstCell.length > 3 &&
        firstCell.length < 100 &&
        nonEmpty.length <= 4 &&
        CAT_KEYWORDS.test(firstCell)
      ) {
        current = { name: firstCell, items: [] };
        cats.push(current);
      }
    }
  }

  return cats.filter(c => c.items.length > 0);
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function getAEData(): Promise<AEData> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${AE_SHEET_ID}/export?format=csv&gid=${AE_GID}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { categories: [], source: "fallback" };
    const categories = parseAE(parseCSV(await res.text()));
    if (categories.length > 0) return { categories, source: "live" };
  } catch { /* fall through */ }
  return { categories: [], source: "fallback" };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function UniformsPage() {
  const aeData = await getAEData();
  return <UniformsClient aeData={aeData} aeSheetUrl={`https://docs.google.com/spreadsheets/d/${AE_SHEET_ID}/edit?gid=${AE_GID}`} />;
}
