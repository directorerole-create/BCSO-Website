"use client";
import { useState, useMemo } from "react";
import { Search, Shield, Users, Filter, ChevronDown } from "lucide-react";
import { RosterMember } from "@/lib/supabase";

const STATUS_LABELS: Record<string, string> = {
  Active: "Active",
  Inactive: "Inactive",
  LOA: "Leave of Absence",
};

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Active" ? "status-active" :
    status === "LOA" ? "status-loa" :
    "status-inactive";
  return (
    <span className={`text-[10px] font-display tracking-widest uppercase px-2 py-0.5 rounded-sm font-medium ${cls}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function RankBadge({ rank }: { rank: string }) {
  const isCommand = ["Sheriff", "Undersheriff", "Captain"].includes(rank);
  return (
    <span className={`font-display text-xs tracking-wide font-semibold ${isCommand ? "text-badge" : "text-[var(--text-secondary)]"}`}>
      {rank}
    </span>
  );
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full object-cover border border-[var(--border)]" />;
  }
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full border border-[var(--badge)]/30 bg-[var(--badge)]/10 flex items-center justify-center flex-shrink-0">
      <span className="font-display text-xs font-bold text-badge">{initials}</span>
    </div>
  );
}

export function RosterClient({ roster }: { roster: RosterMember[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [divisionFilter, setDivisionFilter] = useState("All");

  const divisions = useMemo(() => {
    const set = new Set(roster.map((m) => m.division).filter(Boolean) as string[]);
    return ["All", ...Array.from(set).sort()];
  }, [roster]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return roster.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.rank.toLowerCase().includes(q) ||
        (m.callsign ?? "").toLowerCase().includes(q) ||
        (m.badge_number ?? "").toLowerCase().includes(q) ||
        (m.division ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || m.status === statusFilter;
      const matchDiv = divisionFilter === "All" || m.division === divisionFilter;
      return matchSearch && matchStatus && matchDiv;
    });
  }, [roster, search, statusFilter, divisionFilter]);

  const activeCount = roster.filter((m) => m.status === "Active").length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-2">Department Portal</span>
            <h1 className="font-display text-4xl font-bold text-primary-color tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-badge" strokeWidth={1.5} />
              PERSONNEL ROSTER
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">
              All sworn and non-sworn personnel &mdash; synced from Google Sheets
            </p>
          </div>
          <div className="flex items-center gap-3 panel px-5 py-3">
            <Users className="w-5 h-5 text-badge" />
            <div>
              <div className="font-display text-xl font-bold text-badge">{activeCount}</div>
              <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase font-display">Active Personnel</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by name, rank, callsign, badge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-body"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="search-input appearance-none pl-4 pr-9 py-2.5 rounded-lg text-sm font-body font-display text-xs tracking-wider cursor-pointer"
            >
              {["All", "Active", "LOA", "Inactive"].map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : STATUS_LABELS[s]}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)] pointer-events-none" />
          </div>

          {/* Division filter */}
          <div className="relative">
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="search-input appearance-none pl-4 pr-9 py-2.5 rounded-lg text-sm font-body font-display text-xs tracking-wider cursor-pointer"
            >
              {divisions.map((d) => (
                <option key={d} value={d}>{d === "All" ? "All Divisions" : d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)] pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] text-xs font-display tracking-wider">
            <Filter className="w-3 h-3" />
            {filtered.length} of {roster.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto">
        <div className="panel overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[2.5rem_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]">
            {["", "Name", "Rank", "Division", "Callsign / Badge", "Status"].map((h) => (
              <span key={h} className="font-display text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center text-[var(--text-muted)] font-display text-sm tracking-wider">
              No personnel match your filters.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filtered.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-1 md:grid-cols-[2.5rem_1fr_1fr_1fr_1fr_1fr] gap-4 items-center px-5 py-4 hover:bg-[var(--bg-panel-alt)] transition-colors group"
                >
                  <Avatar name={member.name} avatarUrl={member.avatar_url} />

                  <div>
                    <div className="font-body font-semibold text-[var(--text-primary)] group-hover:text-badge transition-colors">
                      {member.name}
                    </div>
                    {member.joined_date && (
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        Joined {new Date(member.joined_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                      </div>
                    )}
                  </div>

                  <RankBadge rank={member.rank} />

                  <div className="text-sm text-[var(--text-secondary)]">{member.division ?? "—"}</div>

                  <div className="flex flex-col gap-0.5">
                    {member.callsign && (
                      <span className="font-mono text-xs text-badge tracking-wider">{member.callsign}</span>
                    )}
                    {member.badge_number && (
                      <span className="font-mono text-xs text-[var(--text-muted)]">#{member.badge_number}</span>
                    )}
                  </div>

                  <StatusBadge status={member.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-display tracking-wider text-[var(--text-muted)] uppercase">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />Active</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" />Leave of Absence</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" />Inactive</span>
        </div>
      </div>
    </div>
  );
}
