export const dynamic = "force-dynamic";
import { RosterClient } from "./RosterClient";
import { RosterMember } from "@/lib/supabase";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1E_tIWj0bcgdLBf5bdDCjH3nMhxUtO73TNlRW2CwSIkk/export?format=csv&gid=2065550040";

const COL = {
  badge:       2,  // C  Website ID
  name:        3,  // D  Name
  callsign:    4,  // E  Callsign
  rank:        5,  // F  Rank
  division:    6,  // G  Assignment
  joined:      7,  // H  Date of Membership
  phone:       8,  // I  Phone Number
  status:      10, // K  Activity Status
  curr_act:    11, // L  Current month – Total Activity
  curr_pat:    12, // M  Current month – Patrol Hours
  curr_adm:    13, // N  Current month – Admin Hours
  curr_logs:   14, // O  Current month – Patrol Logs
  prev_act:    15, // P  Previous month – Total Activity
  prev_pat:    16, // Q  Previous month – Patrol Hours
  prev_adm:    17, // R  Previous month – Admin Hours
  prev_logs:   18, // S  Previous month – Patrol Logs
  patrol_seen: 19, // T  Patrol Last Seen
};

const FALLBACK_LABELS = [
  "Website ID", "Name", "Callsign", "Rank", "Assignment",
  "Date of Membership", "Phone Number", "Activity Status",
  "Total Activity", "Patrol Hour's", "Admin Hour's", "Patrol Logs",
  "Total Activity", "Patrol Hour's", "Admin Hour's", "Patrol Logs",
  "Patrol Last Seen",
];

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

function cell(row: string[], idx: number): string | null {
  return row[idx]?.trim() || null;
}

async function getRoster(): Promise<{ roster: RosterMember[]; colLabels: string[] }> {
  try {
    const res = await fetch(CSV_URL, { cache: "no-store" });
    if (!res.ok) return { roster: [], colLabels: FALLBACK_LABELS };

    const rows = parseCSV(await res.text()).filter(r => r.some(c => c.trim()));

    let headerIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 20); i++) {
      const lower = rows[i].map(c => c.toLowerCase().trim());
      if (lower.includes("name") && lower.includes("rank")) { headerIdx = i; break; }
    }
    if (headerIdx === -1) return { roster: [], colLabels: FALLBACK_LABELS };

    const h = rows[headerIdx];
    const lbl = (idx: number, fb: string) =>
      (h[idx] ?? "").replace(/\s+/g, " ").trim() || fb;

    const colLabels = [
      lbl(COL.badge,       "Website ID"),
      lbl(COL.name,        "Name"),
      lbl(COL.callsign,    "Callsign"),
      lbl(COL.rank,        "Rank"),
      lbl(COL.division,    "Assignment"),
      lbl(COL.joined,      "Date of Membership"),
      lbl(COL.phone,       "Phone Number"),
      lbl(COL.status,      "Activity Status"),
      lbl(COL.curr_act,    "Total Activity"),
      lbl(COL.curr_pat,    "Patrol Hour's"),
      lbl(COL.curr_adm,    "Admin Hour's"),
      lbl(COL.curr_logs,   "Patrol Logs"),
      lbl(COL.prev_act,    "Total Activity"),
      lbl(COL.prev_pat,    "Patrol Hour's"),
      lbl(COL.prev_adm,    "Admin Hour's"),
      lbl(COL.prev_logs,   "Patrol Logs"),
      lbl(COL.patrol_seen, "Patrol Last Seen"),
    ];

    const roster: RosterMember[] = rows.slice(headerIdx + 1).flatMap((row, i) => {
      const name = cell(row, COL.name);
      const rank = cell(row, COL.rank);
      if (!name || !rank) return [];

      return [{
        id:                   cell(row, COL.badge) ?? String(headerIdx + i + 2),
        name,
        rank,
        badge_number:         cell(row, COL.badge),
        callsign:             cell(row, COL.callsign),
        division:             cell(row, COL.division),
        status:               normalizeStatus(cell(row, COL.status) ?? ""),
        avatar_url:           null,
        joined_date:          cell(row, COL.joined),
        phone_number:         cell(row, COL.phone),
        patrol_last_seen:     cell(row, COL.patrol_seen),
        admin_last_seen:      null,
        april_total_activity: cell(row, COL.curr_act),
        april_patrol_hours:   cell(row, COL.curr_pat),
        april_admin_hours:    cell(row, COL.curr_adm),
        april_patrol_logs:    cell(row, COL.curr_logs),
        march_total_activity: cell(row, COL.prev_act),
        march_patrol_hours:   cell(row, COL.prev_pat),
        march_admin_hours:    cell(row, COL.prev_adm),
        march_patrol_logs:    cell(row, COL.prev_logs),
        updated_at:           new Date().toISOString(),
      } satisfies RosterMember];
    });

    return { roster, colLabels };
  } catch {
    return { roster: [], colLabels: FALLBACK_LABELS };
  }
}

export default async function RosterPage() {
  const { roster, colLabels } = await getRoster();
  return <RosterClient roster={roster} colLabels={colLabels} />;
}
