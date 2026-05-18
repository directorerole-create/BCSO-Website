export const dynamic = "force-dynamic";
import { VehiclesClient } from "./VehiclesClient";

const SHEET_ID = "158W4-DS5H19sNJs9uc-TZHPxH0tbZONdDVzIw1hFKxc";
const GID_BCSO   = "1022938058";
const GID_LSCSO  = "132458634";
const GID_COLORS = "89417412";

export type RankVehicles = { rank: string; vehicles: string[] };
export type ColorEntry   = { name: string; approved: boolean };
export type VehicleData  = { ranks: RankVehicles[]; source: "live" | "fallback" };
export type ColorData    = { colors: ColorEntry[];   source: "live" | "fallback" };

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

// ── Vehicle rank parser ───────────────────────────────────────────────────────

const RANK_RE = /^(probationary|patrol|deputy\s*(i{1,3}|ii?)?|reserve|senior\s*reserve?|senior|master|detective|corporal|staff\s*sergeant|sergeant|lieutenant|captain|major|chief\s*deputy|assistant\s*sheriff|undersheriff|sheriff)/i;

function isRankCell(s: string): boolean {
  const t = s.trim();
  return RANK_RE.test(t) && t.length < 60 && !t.includes(":");
}

function isVehicleCell(s: string): boolean {
  const t = s.trim();
  if (!t || t.length > 80) return false;
  if (t.includes("Livery") || t.includes("Restrictions") || t.includes("ALPR") || t.includes("/savevehicle")) return false;
  if (isRankCell(t)) return false;
  return true;
}

function parseRankVehicles(rows: string[][]): RankVehicles[] {
  const result: RankVehicles[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const cells = row.map(c => c.trim());
    // Find rank cell
    const rankIdx = cells.findIndex(c => isRankCell(c));
    if (rankIdx === -1) continue;
    const rank = cells[rankIdx].replace(/\s+/g, " ").trim();
    if (seen.has(rank)) continue;
    // Vehicles: all other non-empty cells in this row
    const vehicles = cells.filter((c, i) => i !== rankIdx && isVehicleCell(c));
    if (vehicles.length === 0) continue;
    seen.add(rank);
    result.push({ rank, vehicles });
  }

  return result;
}

// ── Color parser ──────────────────────────────────────────────────────────────

const SKIP_COLOR_NAMES = /color|approved|denied|sheriff|office|unmarked|classic|metallic/i;

function parseColors(rows: string[][]): ColorEntry[] {
  const entries: ColorEntry[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const cells = row.map(c => c.trim());
    // Scan every cell; when we find a plausible color name look ahead up to 3 cells for Yes/No
    let i = 0;
    while (i < cells.length) {
      const name = cells[i];
      if (!name || name.length > 40 || SKIP_COLOR_NAMES.test(name) || seen.has(name)) {
        i++;
        continue;
      }
      // Look for Yes / No within the next 3 cells
      let statusIdx = -1;
      for (let j = i + 1; j <= Math.min(i + 3, cells.length - 1); j++) {
        const s = cells[j].toLowerCase();
        if (s === "yes" || s === "no") { statusIdx = j; break; }
      }
      if (statusIdx !== -1) {
        seen.add(name);
        entries.push({ name, approved: cells[statusIdx].toLowerCase() === "yes" });
        i = statusIdx + 1;
      } else {
        i++;
      }
    }
  }
  return entries;
}

// Fallback color data (from official spreadsheet — used when live fetch fails)
const FALLBACK_COLORS: ColorEntry[] = [
  { name: "Black",           approved: true  }, { name: "Graphite",        approved: true  },
  { name: "Black Steel",     approved: true  }, { name: "Dark Steel",       approved: true  },
  { name: "Silver",          approved: true  }, { name: "Bluish Silver",    approved: true  },
  { name: "Rolled Steel",    approved: true  }, { name: "Shadow Silver",    approved: true  },
  { name: "Stone Silver",    approved: true  }, { name: "Midnight Silver",  approved: true  },
  { name: "Cast Iron Silver",approved: true  }, { name: "Anthracite Black", approved: true  },
  { name: "Sunset Red",      approved: true  }, { name: "Cabernet Red",     approved: true  },
  { name: "Dark Blue",       approved: true  }, { name: "Diamond Blue",     approved: true  },
  { name: "Midnight Blue",   approved: true  }, { name: "Very Dark Blue",   approved: true  },
  { name: "Carbon Black",    approved: true  }, { name: "Bleached Brown",   approved: true  },
  { name: "Cream",           approved: true  }, { name: "Ice White",        approved: true  },
  { name: "Frost White",     approved: true  },
  { name: "Red",             approved: false }, { name: "Tornio Red",       approved: false },
  { name: "Formula Red",     approved: false }, { name: "Blaze Red",        approved: false },
  { name: "Grace Red",       approved: false }, { name: "Garnet Red",       approved: false },
  { name: "Candy Red",       approved: false }, { name: "Lava Red",         approved: false },
  { name: "Wine Red",        approved: false }, { name: "Orange",           approved: false },
  { name: "Sunrise Orange",  approved: false }, { name: "Bright Orange",    approved: false },
  { name: "Gold",            approved: false }, { name: "Yellow",           approved: false },
  { name: "Race Yellow",     approved: false }, { name: "Dew Yellow",       approved: false },
  { name: "Dark Green",      approved: false }, { name: "Racing Green",     approved: false },
  { name: "Sea Green",       approved: false }, { name: "Olive Green",      approved: false },
  { name: "Bright Green",    approved: false }, { name: "Gasoline Green",   approved: false },
  { name: "Lime Green",      approved: false }, { name: "Galaxy Blue",      approved: false },
  { name: "Saxon Blue",      approved: false }, { name: "Blue",             approved: false },
  { name: "Mariner Blue",    approved: false }, { name: "Harbor Blue",      approved: false },
  { name: "Surf Blue",       approved: false }, { name: "Nautical Blue",    approved: false },
  { name: "Ultra Blue",      approved: false }, { name: "Racing Blue",      approved: false },
  { name: "Light Blue",      approved: false }, { name: "Midnight Purple",  approved: false },
  { name: "Scafter Purple",  approved: false }, { name: "Spinnaker Purple", approved: false },
  { name: "Bright Purple",   approved: false }, { name: "Bronze",           approved: false },
  { name: "Hot Pink",        approved: false }, { name: "Salmon Pink",      approved: false },
  { name: "Pfister Pink",    approved: false },
];

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchVehicleSheet(gid: string): Promise<VehicleData> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { ranks: [], source: "fallback" };
    const ranks = parseRankVehicles(parseCSV(await res.text()));
    if (ranks.length > 0) return { ranks, source: "live" };
  } catch { /* fall through */ }
  return { ranks: [], source: "fallback" };
}

async function fetchColors(): Promise<ColorData> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_COLORS}`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const colors = parseColors(parseCSV(await res.text()));
      if (colors.length > 0) return { colors, source: "live" };
    }
  } catch { /* fall through */ }
  // Use known fallback color list so the tab always shows data
  return { colors: FALLBACK_COLORS, source: "fallback" };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function VehiclesPage() {
  const [bcso, lscso, colorData] = await Promise.all([
    fetchVehicleSheet(GID_BCSO),
    fetchVehicleSheet(GID_LSCSO),
    fetchColors(),
  ]);

  return (
    <VehiclesClient
      bcso={bcso}
      lscso={lscso}
      colorData={colorData}
      sheetId={SHEET_ID}
      gids={{ bcso: GID_BCSO, lscso: GID_LSCSO, colors: GID_COLORS }}
    />
  );
}
