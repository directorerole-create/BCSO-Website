"use client";
import { useState, useMemo } from "react";
import { Search, Users, FileText } from "lucide-react";
import { RosterMember } from "@/lib/supabase";
import Image from "next/image";

const RANK_TIERS = [
  { key: "admin",   label: "Administration", color: "text-yellow-400", ranks: ["Sheriff","Undersheriff","Chief Deputy","Colonel"] },
  { key: "senior",  label: "Senior Staff",   color: "text-orange-400", ranks: ["Captain","Lieutenant"] },
  { key: "staff",   label: "Staff",          color: "text-blue-400",   ranks: ["Sergeant","Staff Sergeant"] },
  { key: "deputy",  label: "Deputies",       color: "text-[var(--text-secondary)]", ranks: ["Senior Deputy","Deputy","Patrol Deputy","Probationary Deputy","Detective"] },
];

const RANK_ORDER: Record<string, number> = {
  "Sheriff": 1, "Undersheriff": 2, "Chief Deputy": 3, "Colonel": 4,
  "Captain": 5, "Lieutenant": 6,
  "Sergeant": 7, "Staff Sergeant": 8,
  "Senior Deputy": 9, "Detective": 10, "Patrol Deputy": 11,
  "Deputy": 12, "Probationary Deputy": 13,
};

function tierKey(rank: string): string {
  return RANK_TIERS.find(t => t.ranks.includes(rank))?.key ?? "deputy";
}

function rankColor(rank: string): string {
  return RANK_TIERS.find(t => t.ranks.includes(rank))?.color ?? "text-badge";
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "Active" ? "status-active" : status === "LOA" ? "status-loa" : "status-inactive";
  return <span className={`text-[10px] font-display tracking-wider uppercase px-2 py-0.5 rounded font-medium ${cls}`}>{status}</span>;
}

function sortRoster(members: RosterMember[]): RosterMember[] {
  return [...members].sort((a, b) => {
    const ro = (RANK_ORDER[a.rank] ?? 99) - (RANK_ORDER[b.rank] ?? 99);
    if (ro !== 0) return ro;
    return a.name.localeCompare(b.name);
  });
}

export function RosterClient({ roster }: { roster: RosterMember[] }) {
  const [search, setSearch]       = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  const activeCount = roster.filter(m => m.status === "Active").length;

  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { all: roster.length };
    for (const t of RANK_TIERS) counts[t.key] = roster.filter(m => tierKey(m.rank) === t.key).length;
    return counts;
  }, [roster]);

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    const base = tierFilter === "all"
      ? roster
      : roster.filter(m => tierKey(m.rank) === tierFilter);
    return sortRoster(base.filter(m =>
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.rank.toLowerCase().includes(q) ||
      (m.callsign ?? "").toLowerCase().includes(q) ||
      (m.badge_number ?? "").toLowerCase().includes(q) ||
      (m.division ?? "").toLowerCase().includes(q)
    ));
  }, [roster, tierFilter, search]);

  // Group by tier for display
  const grouped = useMemo(() => {
    if (tierFilter !== "all") {
      const tier = RANK_TIERS.find(t => t.key === tierFilter);
      return tier ? [{ tier, members: displayed }] : [];
    }
    return RANK_TIERS
      .map(tier => ({ tier, members: displayed.filter(m => tierKey(m.rank) === tier.key) }))
      .filter(g => g.members.length > 0);
  }, [displayed, tierFilter]);

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-1">Department Portal</span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-color tracking-tight flex items-center gap-3">
          <Users className="w-6 h-6 sm:w-7 sm:h-7 text-badge flex-shrink-0" strokeWidth={1.5} />
          PERSONNEL ROSTER
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Blaine County Sheriff&apos;s Office &mdash; <span className="text-emerald-400">{activeCount} active</span> of {roster.length} total
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-5">
        {/* Tier filter tabs — scrollable on mobile */}
        <div className="flex items-center gap-1 panel px-2 py-1.5 overflow-x-auto">
          <button
            onClick={() => setTierFilter("all")}
            className={`font-display text-[10px] tracking-widest uppercase px-3 py-1.5 rounded transition-all whitespace-nowrap flex-shrink-0 ${
              tierFilter === "all" ? "bg-badge text-[var(--bg-primary)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            All <span className="ml-1 opacity-70">{tierCounts.all}</span>
          </button>
          {RANK_TIERS.map(t => (
            <button key={t.key} onClick={() => setTierFilter(t.key)}
              className={`font-display text-[10px] tracking-widest uppercase px-3 py-1.5 rounded transition-all whitespace-nowrap flex-shrink-0 ${
                tierFilter === t.key
                  ? "bg-[var(--badge)]/15 border border-[var(--badge)]/40 text-badge font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t.label} <span className="ml-1 opacity-70">{tierCounts[t.key]}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search name, rank, callsign, badge..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="search-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" />
        </div>

        <div className="flex items-center gap-1 text-[var(--text-muted)] text-xs font-display tracking-wider">
          <FileText className="w-3 h-3" /> {displayed.length}
        </div>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-3">
        {grouped.length === 0 ? (
          <div className="panel py-12 text-center text-[var(--text-muted)] font-display text-sm tracking-wider">
            No personnel match your search.
          </div>
        ) : grouped.map(({ tier, members }) => (
          <div key={tier.key}>
            <div className={`font-display text-[9px] tracking-[0.3em] uppercase font-semibold ${tier.color} mb-2 px-1`}>
              {tier.label} — {members.length}
            </div>
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.id} className="panel px-4 py-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)] text-sm">{m.name}</p>
                      <p className={`font-display text-xs tracking-wide font-semibold ${rankColor(m.rank)}`}>{m.rank}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {m.badge_number && <div><span className="text-[var(--text-muted)]">Badge: </span><span className="font-mono text-[var(--text-secondary)]">{m.badge_number}</span></div>}
                    {m.callsign && <div><span className="text-[var(--text-muted)]">Callsign: </span><span className={`font-mono font-bold ${rankColor(m.rank)}`}>{m.callsign}</span></div>}
                    {m.division && <div className="col-span-2"><span className="text-[var(--text-muted)]">Assignment: </span><span className="text-[var(--text-secondary)]">{m.division}</span></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block panel overflow-x-auto relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0">
          <div className="relative w-72 h-72">
            <Image src="/BCSOBadge.png" alt="" fill className="object-contain" />
          </div>
        </div>

        <div className="relative z-10 grid roster-cols gap-3 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]">
          {["ID","NAME","CALLSIGN","RANK","ASSIGNMENT","JOINED","PHONE","STATUS","ACTIVITY","PATROL HRS","ADMIN HRS","LOGS"].map(h => (
            <span key={h} className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">{h}</span>
          ))}
        </div>

        <div className="relative z-10">
          {grouped.length === 0 ? (
            <div className="py-16 text-center text-[var(--text-muted)] font-display text-sm tracking-wider">No personnel match your search.</div>
          ) : grouped.map(({ tier, members }) => (
            <div key={tier.key}>
              <div className="px-4 py-1.5 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]/50">
                <span className={`font-display text-[9px] tracking-[0.3em] uppercase font-semibold ${tier.color}`}>{tier.label} &mdash; {members.length}</span>
              </div>
              {members.map(m => (
                <div key={m.id} className="grid roster-cols gap-3 px-4 py-2.5 hover:bg-[var(--badge)]/5 transition-colors text-sm border-b border-[var(--border)]/40 last:border-0">
                  <span className="font-mono text-xs text-[var(--text-muted)]">{m.badge_number ?? "—"}</span>
                  <span className="font-semibold text-[var(--text-primary)] truncate">{m.name}</span>
                  <span className={`font-mono text-xs font-bold ${rankColor(m.rank)}`}>{m.callsign ?? "—"}</span>
                  <span className={`font-display text-xs tracking-wide font-semibold ${rankColor(m.rank)}`}>{m.rank}</span>
                  <span className="text-[var(--text-secondary)] text-xs truncate">{m.division ?? "—"}</span>
                  <span className="text-[var(--text-muted)] text-xs">{m.joined_date ? new Date(m.joined_date).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }) : "—"}</span>
                  <span className="text-[var(--text-muted)] text-xs">{m.phone_number ?? "—"}</span>
                  <StatusBadge status={m.status} />
                  <span className="font-mono text-xs text-[var(--text-secondary)]">{m.april_total_activity ?? "—"}</span>
                  <span className="font-mono text-xs text-[var(--text-secondary)]">{m.april_patrol_hours ?? "—"}</span>
                  <span className="font-mono text-xs text-[var(--text-secondary)]">{m.april_admin_hours ?? "—"}</span>
                  <span className="font-mono text-xs text-[var(--text-secondary)] text-center">{m.april_patrol_logs ?? "—"}</span>
                </div>
              ))}
            </div>
          ))}
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
