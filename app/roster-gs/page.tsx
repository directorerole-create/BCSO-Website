export const dynamic = "force-dynamic";
import { RosterGSClient } from "./RosterGSClient";
import { RosterMember } from "@/lib/supabase";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1E_tIWj0bcgdLBf5bdDCjH3nMhxUtO73TNlRW2CwSIkk/export?format=csv&gid=2065550040";

// Same skip list as the Apps Script so we ignore header/divider rows
const SKIP_ROWS = new Set([1,2,3,4,5,6,7,8,9,10,11,12,18,25,37,47,147,247,347,480,532,584,636,664]);

// Sheet column header (lowercase, whitespace-normalized) → RosterMember field name
// May = current month → april_* fields (what the table displays as "current")
// April = previous month → march_* fields
const HEADER_MAP: Record<string, string> = {
  "name":                   "name",
  "rank":                   "rank",
  "website id":             "badge_number",
  "callsign":               "callsign",
  "assignment":             "division",
  "activity status":        "status",
  "date of membership":     "joined_date",
  "phone number":           "phone_number",
  "patrol last seen":       "patrol_last_seen",
  "admin last seen":        "admin_last_seen",
  // Current month (May)
  "may total activity":     "april_total_activity",
  "may patrol hour's":      "april_patrol_hours",
  "may admin hour's":       "april_admin_hours",
  "may patrol logs":        "april_patrol_logs",
  // Previous month (April)
  "april total activity":   "march_total_activity",
  "april patrol hour's":    "march_patrol_hours",
  "april admin hour's":     "march_admin_hours",
  "april patrol logs":      "march_patrol_logs",
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch   = text[i];
    const next = text[i + 1];

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

function normalizeStatus(raw: string): "Active" | "Inactive" | "LOA" {
  const s = raw.toLowerCase().trim();
  if (s === "loa" || s.includes("leave")) return "LOA";
  if (s === "inactive")                   return "Inactive";
  return "Active";
}

async function getRoster(): Promise<RosterMember[]> {
  try {
    const res = await fetch(CSV_URL, { cache: "no-store" });
    if (!res.ok) return [];

    const rows = parseCSV(await res.text()).filter(r => r.some(c => c.trim()));

    // Find the first row that has both "Name" and "Rank" columns
    let headerIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 20); i++) {
      const lower = rows[i].map(c => c.toLowerCase().trim());
      if (lower.includes("name") && lower.includes("rank")) { headerIdx = i; break; }
    }
    if (headerIdx === -1) return [];

    // Build field → column-index lookup
    const colOf: Record<string, number> = {};
    rows[headerIdx].forEach((h, i) => {
      const key = h.replace(/\s+/g, " ").trim().toLowerCase();
      const field = HEADER_MAP[key];
      if (field) colOf[field] = i;
    });

    const get = (row: string[], field: string) => {
      const idx = colOf[field];
      return idx !== undefined ? (row[idx]?.trim() || null) : null;
    };

    return rows.slice(headerIdx + 1).flatMap((row, i) => {
      const rowNum = headerIdx + i + 2; // 1-based sheet row number
      if (SKIP_ROWS.has(rowNum)) return [];

      const name = get(row, "name");
      const rank = get(row, "rank");
      if (!name || !rank) return [];

      return [{
        id:                   get(row, "badge_number") ?? String(rowNum),
        name,
        rank,
        badge_number:         get(row, "badge_number"),
        callsign:             get(row, "callsign"),
        division:             get(row, "division"),
        status:               normalizeStatus(get(row, "status") ?? ""),
        avatar_url:           null,
        joined_date:          get(row, "joined_date"),
        phone_number:         get(row, "phone_number"),
        patrol_last_seen:     get(row, "patrol_last_seen"),
        admin_last_seen:      get(row, "admin_last_seen"),
        april_total_activity: null,
        april_patrol_hours:   null,
        april_admin_hours:    null,
        april_patrol_logs:    null,
        march_total_activity: null,
        march_patrol_hours:   null,
        march_admin_hours:    null,
        march_patrol_logs:    null,
        updated_at:           new Date().toISOString(),
      } satisfies RosterMember];
    });
  } catch {
    return [];
  }
}

export default async function RosterGSPage() {
  const roster = await getRoster();
  return <RosterGSClient roster={roster} />;
}
