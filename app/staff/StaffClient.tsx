"use client";
import Image from "next/image";

export type CommandMember = {
  id: string;
  name: string;
  badge_number: string | null;
  callsign: string | null;
  rank: string;
  role: string;
  division: string | null;
  status: "Active" | "Inactive" | "LOA";
};

const RANK_CONFIG: Record<string, { color: string; hex: string; order: number; tier: string }> = {
  "Head Administration": { color: "text-yellow-400",  hex: "#facc15", order: 1, tier: "Executive Command" },
  "Sheriff":             { color: "text-yellow-400",  hex: "#facc15", order: 2, tier: "Executive Command" },
  "Undersheriff":        { color: "text-yellow-400",  hex: "#facc15", order: 3, tier: "Executive Command" },
  "Chief Deputy":        { color: "text-orange-400",  hex: "#fb923c", order: 4, tier: "Command Staff"     },
  "Colonel":             { color: "text-orange-400",  hex: "#fb923c", order: 5, tier: "Command Staff"     },
  "Captain":             { color: "text-blue-400",    hex: "#60a5fa", order: 6, tier: "Senior Staff"      },
  "Lieutenant":          { color: "text-blue-300",    hex: "#93c5fd", order: 7, tier: "Senior Staff"      },
};

const RANK_INSIGNIA: Record<string, string> = {
  "Sheriff":      "/3star.png",
  "Undersheriff": "/2star.png",
  "Chief Deputy": "/1star.png",
  "Colonel":      "/colonel.jpg",
};

const TIERS = [
  { label: "Executive Command", key: ["Head Administration", "Sheriff", "Undersheriff"] },
  { label: "Command Staff",     key: ["Chief Deputy", "Colonel"] },
  { label: "Senior Staff",      key: ["Captain", "Lieutenant"] },
];

function statusDot(status: string) {
  if (status === "Active")   return <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" /><span className="text-emerald-400 font-display text-[9px] tracking-widest uppercase">Active</span></span>;
  if (status === "LOA")      return <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" /><span className="text-yellow-400 font-display text-[9px] tracking-widest uppercase">Leave of Absence</span></span>;
  return                            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-500" /><span className="text-gray-500 font-display text-[9px] tracking-widest uppercase">Inactive</span></span>;
}

function getInitials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

function MemberCard({ m }: { m: CommandMember }) {
  const cfg = RANK_CONFIG[m.rank] ?? RANK_CONFIG["Lieutenant"];
  const insignia = RANK_INSIGNIA[m.rank];

  return (
    <div className="flex flex-col sm:flex-row bg-[var(--bg-panel)] border border-[var(--border)] rounded-lg overflow-hidden hover:border-[var(--badge)]/30 transition-colors">
      {/* Left accent */}
      <div className="w-full sm:w-1 h-1 sm:h-auto flex-shrink-0" style={{ background: cfg.hex }} />

      {/* Avatar block */}
      <div className="flex sm:flex-col items-center gap-4 sm:gap-3 px-5 py-4 sm:py-6 sm:w-28 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-[var(--border)] bg-[var(--bg-panel-alt)]">
        {/* Initials circle */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-black/30"
          style={{ borderColor: cfg.hex }}>
          <span className="font-display font-black text-lg sm:text-xl" style={{ color: cfg.hex }}>
            {getInitials(m.name)}
          </span>
        </div>

        {/* Insignia */}
        {insignia
          ? <Image src={insignia} alt={m.rank} width={44} height={44} className="object-contain opacity-90" style={{ filter: "drop-shadow(0 0 4px rgba(201,162,39,0.5))" }} />
          : <div className="w-11 h-11" />
        }

        {/* Callsign */}
        {m.callsign && (
          <span className="font-mono text-[10px] tracking-widest hidden sm:block text-center" style={{ color: `${cfg.hex}99` }}>
            {m.callsign}
          </span>
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 px-5 sm:px-6 py-4 sm:py-5">
        {/* Rank + tier label */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-display text-[9px] tracking-[0.35em] uppercase font-semibold ${cfg.color}`}>
            {m.rank}
          </span>
          <span className="text-[var(--border)]">·</span>
          <span className="font-display text-[9px] tracking-[0.25em] uppercase text-[var(--text-muted)]">
            {cfg.tier}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-display text-2xl font-black text-[var(--text-primary)] tracking-tight leading-none mb-3">
          {m.name}
        </h3>

        {/* Divider */}
        <div className="border-t border-[var(--border)] mb-3" />

        {/* Detail rows */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
          <div className="flex items-baseline gap-2">
            <dt className="font-display text-[8px] tracking-[0.35em] text-[var(--text-muted)] uppercase w-20 flex-shrink-0">Title</dt>
            <dd className="text-[var(--text-secondary)] text-xs">{m.role}</dd>
          </div>
          {m.division && (
            <div className="flex items-baseline gap-2">
              <dt className="font-display text-[8px] tracking-[0.35em] text-[var(--text-muted)] uppercase w-20 flex-shrink-0">Bureau</dt>
              <dd className="text-[var(--text-secondary)] text-xs">{m.division}</dd>
            </div>
          )}
          {m.badge_number && (
            <div className="flex items-baseline gap-2">
              <dt className="font-display text-[8px] tracking-[0.35em] text-[var(--text-muted)] uppercase w-20 flex-shrink-0">Website ID</dt>
              <dd className="font-mono text-xs" style={{ color: cfg.hex }}>#{m.badge_number}</dd>
            </div>
          )}
          {m.callsign && (
            <div className="flex items-baseline gap-2 sm:hidden">
              <dt className="font-display text-[8px] tracking-[0.35em] text-[var(--text-muted)] uppercase w-20 flex-shrink-0">Callsign</dt>
              <dd className="font-mono text-xs" style={{ color: cfg.hex }}>{m.callsign}</dd>
            </div>
          )}
        </dl>

        {/* Status */}
        <div className="mt-3 pt-2.5 border-t border-[var(--border)]">
          {statusDot(m.status)}
        </div>
      </div>
    </div>
  );
}

export function StaffClient({ staff }: { staff: CommandMember[] }) {
  const sorted = [...staff].sort((a, b) =>
    (RANK_CONFIG[a.rank]?.order ?? 99) - (RANK_CONFIG[b.rank]?.order ?? 99)
  );

  const activeCount = staff.filter(m => m.status === "Active").length;

  return (
    <div className="min-h-screen pb-20">
      {/* Page header */}
      <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-5">
          <Image src="/BCSOBadge.png" alt="BCSO" width={52} height={52}
            style={{ filter: "drop-shadow(0 0 12px rgba(201,162,39,0.5))" }} />
          <div>
            <span className="font-display text-[9px] tracking-[0.5em] text-badge uppercase block mb-1">Department Portal</span>
            <h1 className="font-display text-3xl font-black text-primary-color tracking-tight">COMMAND STAFF</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              Blaine County Sheriff&apos;s Office &mdash; <span className="text-emerald-400">{activeCount} active</span> of {staff.length} command personnel
            </p>
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10 space-y-12">
        {TIERS.map(tier => {
          const members = sorted.filter(m => tier.key.includes(m.rank));
          if (members.length === 0) return null;

          const cfg = RANK_CONFIG[tier.key[0]];

          return (
            <section key={tier.label}>
              {/* Tier divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="font-display text-[9px] tracking-[0.4em] uppercase px-3 py-1 rounded border"
                  style={{ color: cfg.hex, borderColor: `${cfg.hex}40`, background: `${cfg.hex}08` }}>
                  {tier.label}
                </span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>

              {/* Cards — 1 col for exec, 2 col for others */}
              <div className={`grid gap-4 ${tier.label === "Executive Command" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
                {members.map(m => <MemberCard key={m.id} m={m} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
