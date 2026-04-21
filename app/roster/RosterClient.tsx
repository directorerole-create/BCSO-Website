"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { RosterMember } from "@/lib/supabase";
import Image from "next/image";

const RANK_TIERS: { label: string; ranks: string[]; color: string }[] = [
  { label: "Administration",  ranks: ["Sheriff","Undersheriff","Chief Deputy","Colonel"],                            color: "text-yellow-400" },
  { label: "Senior Staff",    ranks: ["Captain","Lieutenant"],                                                       color: "text-orange-400" },
  { label: "Staff",           ranks: ["Sergeant","Staff Sergeant"],                                                  color: "text-blue-400"   },
  { label: "Deputies",        ranks: ["Senior Deputy","Deputy","Probationary Deputy","Detective","Patrol Deputy"],   color: "text-[var(--text-secondary)]" },
];

function tierOf(rank: string): number {
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (RANK_TIERS[i].ranks.includes(rank)) return i;
  }
  return RANK_TIERS.length;
}

function rankColor(rank: string): string {
  const tier = RANK_TIERS.find(t => t.ranks.includes(rank));
  return tier?.color ?? "text-badge";
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "Active" ? "status-active" : status === "LOA" ? "status-loa" : "status-inactive";
  return <span className={`text-[10px] font-display tracking-wider uppercase px-2 py-0.5 rounded font-medium ${cls}`}>{status}</span>;
}

function groupByTier(members: RosterMember[]) {
  const groups: { tier: typeof RANK_TIERS[0]; members: RosterMember[] }[] = [];
  const sorted = [...members].sort((a, b) => {
    const ta = tierOf(a.rank), tb = tierOf(b.rank);
    if (ta !== tb) return ta - tb;
    const ra = a.rank.localeCompare(b.rank);
    if (ra !== 0) return ra;
    return a.name.localeCompare(b.name);
  });
  for (const tier of RANK_TIERS) {
    const group = sorted.filter(m => tier.ranks.includes(m.rank));
    if (group.length) groups.push({ tier, members: group });
  }
  const ungrouped = sorted.filter(m => tierOf(m.rank) === RANK_TIERS.length);
  if (ungrouped.length) groups.push({ tier: { label: "Personnel", ranks: [], color: "text-[var(--text-muted)]" }, members: ungrouped });
  return groups;
}

function buildTabs(roster: RosterMember[]) {
  const divMap: Record<string, RosterMember[]> = {};
  for (const m of roster) {
    const key = m.division ?? "Unassigned";
    if (!divMap[key]) divMap[key] = [];
    divMap[key].push(m);
  }
  return divMap;
}

export function RosterClient({ roster }: { roster: RosterMember[] }) {
  const [search, setSearch]     = useState("");
  const [activeTab, setActiveTab] = useState("__all__");

  const divTabs = useMemo(() => buildTabs(roster), [roster]);

  const displayed = useMemo(() => {
    const base = activeTab === "__all__" ? roster : (divTabs[activeTab] ?? []);
    const q = search.toLowerCase();
    return base.filter(m =>
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.rank.toLowerCase().includes(q) ||
      (m.callsign ?? "").toLowerCase().includes(q) ||
      (m.badge_number ?? "").toLowerCase().includes(q) ||
      (m.division ?? "").toLowerCase().includes(q)
    );
  }, [roster, activeTab, divTabs, search]);

  const grouped = useMemo(() => groupByTier(displayed), [displayed]);
  const activeCount = roster.filter(m => m.status === "Active").length;

  return (
    <div className="min-h-screen flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-52 flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-panel)] pt-6 pb-10 px-3 flex flex-col gap-5 sticky top-20 self-start h-[calc(100vh-5rem)] overflow-y-auto">

        {/* Department */}
        <div>
          <p className="font-display text-[9px] tracking-[0.3em] text-[var(--text-muted)] uppercase px-2 mb-2">Department</p>
          <TabBtn label="Full Roster" count={roster.length} active={activeTab === "__all__"} onClick={() => setActiveTab("__all__")} />
        </div>

        {/* Divisions */}
        {Object.keys(divTabs).length > 0 && (
          <div>
            <p className="font-display text-[9px] tracking-[0.3em] text-[var(--text-muted)] uppercase px-2 mb-2">Divisions</p>
            {Object.entries(divTabs)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([div, members]) => (
                <TabBtn key={div} label={div} count={members.length}
                  active={activeTab === div} onClick={() => setActiveTab(div)} />
              ))}
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 min-w-0 px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-color tracking-wide">
              {activeTab === "__all__" ? "Full Roster" : activeTab}
            </h1>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">
              {displayed.length} member{displayed.length !== 1 ? "s" : ""}
              {activeTab === "__all__" && <span className="ml-2 text-emerald-400">{activeCount} active</span>}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by name, callsign, rank, or division..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input pl-9 pr-4 py-2 rounded-lg text-sm w-72"
            />
          </div>
        </div>

        {/* Table */}
        <div className="panel overflow-hidden relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0">
            <div className="relative w-72 h-72">
              <Image src="/BCSOBadge.png" alt="" fill className="object-contain" />
            </div>
          </div>

          {/* Table header */}
          <div className="relative z-10 grid roster-cols gap-3 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]">
            {["ID","NAME","CALLSIGN","RANK","ASSIGNMENT","JOINED","PHONE","STATUS","ACTIVITY","PATROL HRS","ADMIN HRS","LOGS"].map(h => (
              <span key={h} className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">{h}</span>
            ))}
          </div>

          {/* Grouped rows */}
          <div className="relative z-10 divide-y divide-[var(--border)]">
            {grouped.length === 0 ? (
              <div className="py-16 text-center text-[var(--text-muted)] font-display text-sm tracking-wider">
                No personnel match your search.
              </div>
            ) : (
              grouped.map(({ tier, members }) => (
                <div key={tier.label}>
                  {/* Tier header */}
                  <div className="px-4 py-1.5 bg-[var(--bg-panel-alt)]/60 border-b border-[var(--border)]">
                    <span className={`font-display text-[9px] tracking-[0.3em] uppercase font-semibold ${tier.color}`}>
                      {tier.label}
                    </span>
                  </div>
                  {members.map(m => (
                    <div key={m.id} className="grid roster-cols gap-3 px-4 py-2.5 hover:bg-[var(--badge)]/5 transition-colors text-sm border-b border-[var(--border)]/50 last:border-0">
                      <span className="font-mono text-xs text-[var(--text-muted)]">{m.badge_number ?? "—"}</span>
                      <span className="font-semibold text-[var(--text-primary)] truncate">{m.name}</span>
                      <span className={`font-mono text-xs font-bold ${rankColor(m.rank)}`}>{m.callsign ?? "—"}</span>
                      <span className={`font-display text-xs tracking-wide font-semibold ${rankColor(m.rank)}`}>{m.rank}</span>
                      <span className="text-[var(--text-secondary)] text-xs truncate">{m.division ?? "—"}</span>
                      <span className="text-[var(--text-muted)] text-xs">
                        {m.joined_date ? new Date(m.joined_date).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }) : "—"}
                      </span>
                      <span className="text-[var(--text-muted)] text-xs">{m.phone_number ?? "—"}</span>
                      <StatusBadge status={m.status} />
                      <span className="font-mono text-xs text-[var(--text-secondary)]">{m.april_total_activity ?? "—"}</span>
                      <span className="font-mono text-xs text-[var(--text-secondary)]">{m.april_patrol_hours ?? "—"}</span>
                      <span className="font-mono text-xs text-[var(--text-secondary)]">{m.april_admin_hours ?? "—"}</span>
                      <span className="font-mono text-xs text-[var(--text-secondary)] text-center">{m.april_patrol_logs ?? "—"}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .roster-cols {
          grid-template-columns: 48px 140px 72px 140px 1fr 90px 110px 80px 80px 80px 80px 48px;
        }
      `}</style>
    </div>
  );
}

function TabBtn({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-left mb-0.5 transition-all group ${
        active
          ? "bg-[var(--badge)]/15 text-badge border border-[var(--badge)]/30"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel-alt)] hover:text-[var(--text-primary)]"
      }`}
    >
      <span className="font-display text-[10px] tracking-wider uppercase truncate">{label}</span>
      <span className={`font-mono text-[10px] ml-1 flex-shrink-0 ${active ? "text-badge" : "text-[var(--text-muted)]"}`}>{count}</span>
    </button>
  );
}
