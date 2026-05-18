export const dynamic = "force-dynamic";
import { Package, ExternalLink } from "lucide-react";

const SHEET_ID = "1TpKSyDi3ZaYP-uTRT-vL5-PZdRoIyWUUzzfutcOnPd8";
const GID      = "246884040";

const CSV_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

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

type AEItem = { number: string; name: string };
type AECategory = { name: string; items: AEItem[] };

function parseAEData(rows: string[][]): AECategory[] {
  const categories: AECategory[] = [];
  let current: AECategory | null = null;

  for (const row of rows) {
    // Find the first non-empty cell
    const cells = row.map(c => c.trim()).filter(Boolean);
    if (cells.length === 0) continue;

    // Look for item number in any cell — pattern like #123 or just a number
    // Try each cell to find an item number vs category header
    let itemNum = "";
    let itemName = "";

    for (const c of cells) {
      const numMatch = c.match(/^#?(\d+)$/);
      if (numMatch) {
        itemNum = `#${numMatch[1]}`;
      } else if (itemNum && !itemName) {
        itemName = c;
      }
    }

    if (itemNum && itemName) {
      if (!current) {
        current = { name: "General", items: [] };
        categories.push(current);
      }
      current.items.push({ number: itemNum, name: itemName });
      continue;
    }

    // If no item number found, treat as category header if it looks like one
    const firstCell = cells[0];
    if (
      cells.length <= 3 &&
      !firstCell.match(/^#?\d+$/) &&
      firstCell.length > 2 &&
      firstCell.length < 80
    ) {
      // Check if it could be a category (not just a stray value)
      const looks_like_category =
        firstCell === firstCell.toUpperCase() ||
        /&|,/.test(firstCell) ||
        firstCell.toLowerCase().includes("vest") ||
        firstCell.toLowerCase().includes("belt") ||
        firstCell.toLowerCase().includes("hat") ||
        firstCell.toLowerCase().includes("rank") ||
        firstCell.toLowerCase().includes("armor") ||
        firstCell.toLowerCase().includes("holster") ||
        firstCell.toLowerCase().includes("camera") ||
        firstCell.toLowerCase().includes("insignia") ||
        firstCell.toLowerCase().includes("accessory");

      if (looks_like_category) {
        current = { name: firstCell, items: [] };
        categories.push(current);
        continue;
      }
    }

    // Single-cell row with a number+name combined like "#85 High-Vis Vest"
    if (cells.length >= 1) {
      const combined = cells.join(" ");
      const match = combined.match(/^#?(\d+)\s+(.+)$/);
      if (match) {
        if (!current) {
          current = { name: "General", items: [] };
          categories.push(current);
        }
        current.items.push({ number: `#${match[1]}`, name: match[2] });
      }
    }
  }

  return categories.filter(c => c.items.length > 0);
}

// Hardcoded fallback matching the known AE structure
const FALLBACK_CATEGORIES: AECategory[] = [
  {
    name: "Body Armor, Chest Mics, & Body Cameras",
    items: [
      { number: "#84",  name: "BC Patrol Approved Vest" },
      { number: "#85",  name: "High Visibility Vest" },
      { number: "#88",  name: "LS Patrol Approved Vest" },
      { number: "#90",  name: "Load Bearing Vest A" },
      { number: "#92",  name: "Load Bearing Vest B" },
      { number: "#93",  name: "BC Patrol Approved Vest Alt" },
      { number: "#113", name: "Body Camera A" },
      { number: "#114", name: "Body Camera B" },
      { number: "#115", name: "Body Camera C" },
      { number: "#116", name: "Body Camera D" },
      { number: "#117", name: "Body Camera E" },
      { number: "#130", name: "LS Patrol Approved Vest Alt A" },
      { number: "#131", name: "LS Patrol Approved Vest Alt B" },
    ],
  },
  {
    name: "Belts & Holsters",
    items: [
      { number: "#208", name: "Hip Holster" },
      { number: "#250", name: "Hip Holster Alt A" },
      { number: "#252", name: "Drop Leg Holster A" },
      { number: "#257", name: "Hip Holster Alt B" },
      { number: "#261", name: "Hip Holster Alt C" },
      { number: "#265", name: "Drop Leg Holster B" },
      { number: "#269", name: "Drop Leg Holster C" },
      { number: "#273", name: "Hip Holster Alt D" },
      { number: "#277", name: "Hip Holster Alt E" },
      { number: "#281", name: "Drop Leg Holster D" },
      { number: "#285", name: "Drop Leg Holster E" },
      { number: "#293", name: "Hip Holster Alt F" },
      { number: "#295", name: "Hip Holster Alt G" },
      { number: "#296", name: "Hip Holster Alt H" },
      { number: "#298", name: "Drop Leg Holster F" },
      { number: "#305", name: "Duty Belt A" },
      { number: "#363", name: "Duty Belt B" },
    ],
  },
  {
    name: "Hats & Headgear",
    items: [
      { number: "#243", name: "Cowboy Hat" },
      { number: "#262", name: "Beanie" },
      { number: "#263", name: "LS Ball Cap" },
      { number: "#268", name: "BC Ball Cap" },
    ],
  },
  {
    name: "Ranks & Insignias",
    items: [
      { number: "#270", name: "Corporal Insignia" },
      { number: "#271", name: "Sergeant Insignia" },
      { number: "#272", name: "Lieutenant Insignia" },
      { number: "#273", name: "Captain Insignia" },
      { number: "#274", name: "Chief Deputy / Command Insignia" },
    ],
  },
];

async function getAEData(): Promise<{ categories: AECategory[]; live: boolean }> {
  try {
    const res = await fetch(CSV_URL, { cache: "no-store" });
    if (!res.ok) return { categories: FALLBACK_CATEGORIES, live: false };
    const rows = parseCSV(await res.text()).filter(r => r.some(c => c.trim()));
    const categories = parseAEData(rows);
    if (categories.length > 0) return { categories, live: true };
  } catch { /* fall through */ }
  return { categories: FALLBACK_CATEGORIES, live: false };
}

export default async function EquipmentPage() {
  const { categories, live } = await getAEData();

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-1">
          Department Portal
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-color tracking-tight flex items-center gap-3">
          <Package className="w-6 h-6 sm:w-7 sm:h-7 text-badge flex-shrink-0" strokeWidth={1.5} />
          AUTHORIZED EQUIPMENT
          {live ? (
            <span className="text-[9px] font-display tracking-[0.3em] uppercase text-emerald-400 font-semibold flex items-center gap-1 mt-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Live
            </span>
          ) : (
            <span className="text-[9px] font-display tracking-[0.3em] uppercase text-[var(--text-muted)] font-semibold flex items-center gap-1 mt-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] inline-block" />Cached
            </span>
          )}
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Sheriff&apos;s Office &mdash; Items approved for use with duty uniforms
        </p>
      </div>

      {/* Category grid */}
      <div className="space-y-8 max-w-5xl">
        {categories.map(cat => (
          <div key={cat.name}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[1px] flex-1 bg-[var(--badge)]/20" />
              <span className="font-display text-[9px] tracking-[0.4em] text-badge uppercase whitespace-nowrap">
                {cat.name}
              </span>
              <div className="h-[1px] flex-1 bg-[var(--badge)]/20" />
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cat.items.map(item => (
                <div
                  key={item.number}
                  className="panel p-3 flex flex-col gap-1.5 border border-[var(--badge)]/10 hover:border-[var(--badge)]/30 transition-colors group"
                >
                  <span className="font-mono text-lg font-black text-badge leading-none group-hover:scale-105 transition-transform inline-block">
                    {item.number}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)] leading-snug">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Source link */}
      <div className="mt-10 flex items-center justify-center">
        <a
          href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${GID}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-display tracking-widest uppercase text-[10px] text-badge/50 hover:text-badge transition-colors py-2"
        >
          <ExternalLink className="w-3 h-3" /> View full spreadsheet
        </a>
      </div>
    </div>
  );
}
