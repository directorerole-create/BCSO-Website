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

function parseColors(rows: string[][]): ColorEntry[] {
  const entries: ColorEntry[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    // Colors come in pairs across the row: Name | (blank) | Yes/No | Name | (blank) | Yes/No
    for (let i = 0; i + 2 < row.length; i += 3) {
      const name = row[i]?.trim();
      const status = row[i + 2]?.trim().toLowerCase();
      if (!name || name.length > 40) continue;
      if (status !== "yes" && status !== "no") continue;
      if (seen.has(name)) continue;
      seen.add(name);
      entries.push({ name, approved: status === "yes" });
    }
  }
  return entries;
}

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
    if (!res.ok) return { colors: [], source: "fallback" };
    const colors = parseColors(parseCSV(await res.text()));
    if (colors.length > 0) return { colors, source: "live" };
  } catch { /* fall through */ }
  return { colors: [], source: "fallback" };
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
