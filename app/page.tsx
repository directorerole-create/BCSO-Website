export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { Users, BookOpen, FileText, ChevronRight, TrendingUp, Clock, ClipboardList, Shield } from "lucide-react";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1E_tIWj0bcgdLBf5bdDCjH3nMhxUtO73TNlRW2CwSIkk/export?format=csv&gid=2065550040";

const COL = {
  name:      3,
  rank:      5,
  status:    10,
  curr_act:  11,
  curr_pat:  12,
  curr_logs: 14,
};

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

function num(row: string[], idx: number): number {
  return parseFloat(row[idx]?.trim() || "0") || 0;
}
function cell(row: string[], idx: number): string {
  return row[idx]?.trim() || "";
}

type Performer = { name: string; rank: string; patrolHours: number; patrolLogs: number };

async function getDashboardStats() {
  try {
    const res = await fetch(CSV_URL, { cache: "no-store" });
    if (!res.ok) return null;

    const rows = parseCSV(await res.text()).filter(r => r.some(c => c.trim()));

    let headerIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 20); i++) {
      const lower = rows[i].map(c => c.toLowerCase().trim());
      if (lower.includes("name") && lower.includes("rank")) { headerIdx = i; break; }
    }
    if (headerIdx === -1) return null;

    // Try to read the month label from the column header
    const h = rows[headerIdx];
    const monthLabel = (h[COL.curr_pat] ?? "").replace(/patrol\s*hours?/i, "").replace(/[-–]/g, "").trim() || null;

    let activeCount = 0;
    let totalPatrolHours = 0;
    let totalPatrolLogs = 0;
    let totalActivity = 0;
    const performers: Performer[] = [];

    for (const row of rows.slice(headerIdx + 1)) {
      const name   = cell(row, COL.name);
      const rank   = cell(row, COL.rank);
      const status = cell(row, COL.status).toLowerCase();
      if (!name || !rank) continue;

      const pat  = num(row, COL.curr_pat);
      const logs = num(row, COL.curr_logs);
      const act  = num(row, COL.curr_act);

      if (status === "active") {
        activeCount++;
        totalPatrolHours += pat;
        totalPatrolLogs  += logs;
        totalActivity    += act;
        if (pat > 0) performers.push({ name, rank, patrolHours: pat, patrolLogs: logs });
      }
    }

    performers.sort((a, b) => b.patrolHours - a.patrolHours);

    return {
      monthLabel,
      activeCount,
      totalPatrolHours: Math.round(totalPatrolHours * 10) / 10,
      totalPatrolLogs,
      totalActivity: Math.round(totalActivity * 10) / 10,
      topPerformers: performers.slice(0, 5),
    };
  } catch {
    return null;
  }
}

const quickLinks = [
  { href: "/roster",               icon: Users,      label: "Personnel Roster",    description: "Active deputies, ranks & activity",       color: "text-blue-400",    border: "border-blue-500/20 hover:border-blue-500/40",    bg: "hover:bg-blue-500/5" },
  { href: "/department-policies",  icon: FileText,   label: "Department Policies", description: "Official directives & department orders",  color: "text-badge",       border: "border-[var(--badge)]/20 hover:border-[var(--badge)]/40", bg: "hover:bg-[var(--badge)]/5" },
  { href: "/policies",             icon: BookOpen,   label: "SOP",                 description: "Standard operating procedures",           color: "text-emerald-400", border: "border-emerald-500/20 hover:border-emerald-500/40", bg: "hover:bg-emerald-500/5" },
  { href: "/staff",                icon: Shield,     label: "Chain of Command",    description: "Command staff & leadership",               color: "text-purple-400",  border: "border-purple-500/20 hover:border-purple-500/40",  bg: "hover:bg-purple-500/5" },
];

const RANK_SHORT: Record<string, string> = {
  "Sheriff":           "Sheriff",
  "Undersheriff":      "Undersheriff",
  "Assistant Sheriff": "Asst. Sheriff",
  "Chief Deputy":      "Chief Deputy",
  "Major":             "Major",
  "Captain":           "Captain",
  "Lieutenant":        "Lieutenant",
  "Sergeant":          "Sergeant",
  "Staff Sergeant":    "Staff Sgt.",
  "Corporal":          "Corporal",
};

export default async function HomePage() {
  const stats = await getDashboardStats();

  const statCards = stats ? [
    { icon: Users,         label: "Active Personnel",    value: stats.activeCount,         suffix: "" },
    { icon: Clock,         label: "Patrol Hours",        value: stats.totalPatrolHours,    suffix: "h" },
    { icon: ClipboardList, label: "Patrol Logs",         value: stats.totalPatrolLogs,     suffix: "" },
    { icon: TrendingUp,    label: "Total Activity Hrs",  value: stats.totalActivity,       suffix: "h" },
  ] : [];

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-14 pb-16 px-4 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 relative">
                <Image src="/BCSOBadge.png" alt="BCSO Badge" fill className="object-contain drop-shadow-[0_0_18px_rgba(201,162,39,0.35)]" />
              </div>
              <div className="absolute inset-[-10px] rounded-full border border-[var(--badge)]/20"
                style={{ animation: "spin 20s linear infinite" }} />
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          </div>

          <span className="font-display text-[9px] tracking-[0.5em] text-badge uppercase block mb-3">Official Portal</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-color leading-none tracking-tight mb-2">
            BLAINE COUNTY
            <span className="block text-badge">SHERIFF&apos;S OFFICE</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase font-display mb-6">
            Roleplay Division &mdash; Est. 2022
          </p>

          <div className="flex flex-wrap justify-center gap-2.5">
            {quickLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className="font-display text-[10px] tracking-widest uppercase px-5 py-2.5 rounded border border-[var(--badge)]/30 bg-[var(--badge)]/8 text-badge hover:bg-[var(--badge)]/18 hover:border-[var(--badge)]/55 transition-all flex items-center gap-1.5">
                {label} <ChevronRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      {stats && (
        <section className="border-b border-[var(--border)] bg-[var(--bg-panel)]">
          <div className="max-w-5xl mx-auto px-4 py-1">
            {stats.monthLabel && (
              <p className="text-center font-display text-[9px] tracking-[0.4em] text-badge/50 uppercase pt-3 pb-0">
                {stats.monthLabel} Activity
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[var(--border)]">
              {statCards.map(({ icon: Icon, label, value, suffix }) => (
                <div key={label} className="text-center px-6 py-5">
                  <Icon className="w-4 h-4 text-badge/40 mx-auto mb-2" strokeWidth={1.5} />
                  <div className="font-display text-2xl font-bold text-badge">
                    {value}{suffix}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase mt-1 font-display">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-[1fr_320px] gap-8">

        {/* ── Quick access ─────────────────────────────────────────── */}
        <div>
          <div className="mb-6">
            <span className="font-display text-[9px] tracking-[0.4em] text-badge uppercase">Department Portal</span>
            <h2 className="font-display text-xl font-bold text-primary-color mt-1 tracking-wide">Quick Access</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickLinks.map(({ href, icon: Icon, label, description, color, border, bg }) => (
              <Link key={href} href={href}
                className={`panel p-5 group transition-all duration-200 ${border} ${bg} hover:-translate-y-0.5`}>
                <div className={`w-8 h-8 rounded border ${border} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.5} />
                </div>
                <h3 className={`font-display text-xs font-semibold tracking-wide ${color} mb-1.5 uppercase`}>{label}</h3>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">{description}</p>
                <div className={`mt-3 flex items-center gap-1 text-[10px] ${color} font-display tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Access <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Top Performers ───────────────────────────────────────── */}
        {stats && stats.topPerformers.length > 0 && (
          <div>
            <div className="mb-6">
              <span className="font-display text-[9px] tracking-[0.4em] text-badge uppercase">This Month</span>
              <h2 className="font-display text-xl font-bold text-primary-color mt-1 tracking-wide">Top Patrol</h2>
            </div>
            <div className="panel divide-y divide-[var(--border)]/40">
              {stats.topPerformers.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 px-4 py-3">
                  {/* Rank number */}
                  <span className={`font-display text-sm font-black w-5 text-center flex-shrink-0 ${
                    i === 0 ? "text-badge" : i === 1 ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
                  }`}>
                    {i + 1}
                  </span>
                  {/* Name + rank */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold text-[var(--text-primary)] truncate">{p.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">{RANK_SHORT[p.rank] ?? p.rank}</p>
                  </div>
                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <p className={`font-display text-sm font-bold ${i === 0 ? "text-badge" : "text-[var(--text-secondary)]"}`}>
                      {p.patrolHours}h
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">{p.patrolLogs} logs</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/roster"
              className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-display tracking-widest uppercase text-badge/60 hover:text-badge transition-colors py-2">
              Full Roster <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
