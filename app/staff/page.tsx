import { StaffClient, CommandMember } from "./StaffClient";

export const dynamic = "force-dynamic";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1E_tIWj0bcgdLBf5bdDCjH3nMhxUtO73TNlRW2CwSIkk/export?format=csv&gid=2065550040";

const COL = {
  badge:    2,  // C  Website ID
  name:     3,  // D  Name
  callsign: 4,  // E  Callsign
  rank:     5,  // F  Rank
  division: 6,  // G  Assignment
  status:   10, // K  Activity Status
};

// Ranks shown on this page and the role title to display for each
const COMMAND_RANKS: Record<string, string> = {
  "Sheriff":           "Chief Executive & Law Enforcement Authority",
  "Undersheriff":      "Second in Command",
  "Assistant Sheriff": "Assistant to the Sheriff",
  "Chief Deputy":      "Operations Commander",
  "Major":           "Senior Field Commander",
  "Captain":           "Bureau Commander",
  "Lieutenant":        "Field Operations Lieutenant",
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"')             { inQuotes = false; }
      else                             { field += ch; }
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

function cell(row: string[], idx: number): string | null {
  return row[idx]?.trim() || null;
}

function normalizeStatus(raw: string): "Active" | "Inactive" | "LOA" {
  const s = raw.toLowerCase().trim();
  if (s === "loa" || s.includes("leave")) return "LOA";
  if (s === "inactive")                   return "Inactive";
  return "Active";
}

async function getCommandStaff(): Promise<CommandMember[]> {
  try {
    const res = await fetch(CSV_URL, { cache: "no-store" });
    if (!res.ok) return [];

    const rows = parseCSV(await res.text()).filter(r => r.some(c => c.trim()));

    let headerIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 20); i++) {
      const lower = rows[i].map(c => c.toLowerCase().trim());
      if (lower.includes("name") && lower.includes("rank")) { headerIdx = i; break; }
    }
    if (headerIdx === -1) return [];

    return rows.slice(headerIdx + 1).flatMap((row, i) => {
      const name = cell(row, COL.name);
      const rank = cell(row, COL.rank);
      if (!name || !rank) return [];
      if (!(rank in COMMAND_RANKS)) return [];

      return [{
        id:           cell(row, COL.badge) ?? String(i),
        name,
        rank,
        badge_number: cell(row, COL.badge),
        callsign:     cell(row, COL.callsign),
        division:     cell(row, COL.division),
        role:         COMMAND_RANKS[rank],
        status:       normalizeStatus(cell(row, COL.status) ?? ""),
      } satisfies CommandMember];
    });
  } catch {
    return [];
  }
}

export default async function StaffPage() {
  const staff = await getCommandStaff();
  return <StaffClient staff={staff} />;
}
