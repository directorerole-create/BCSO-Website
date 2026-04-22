"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { STAFF_DATA, StaticStaffMember } from "@/lib/staff-data";

const RANK_CONFIG: Record<string, {
  color: string;
  border: string;
  bg: string;
  order: number;
  tier: string;
}> = {
  Sheriff:        { color: "#c9a227", border: "rgba(201,162,39,0.4)",  bg: "rgba(201,162,39,0.06)", order: 1, tier: "Executive Command" },
  Undersheriff:   { color: "#c9a227", border: "rgba(201,162,39,0.3)",  bg: "rgba(201,162,39,0.04)", order: 2, tier: "Executive Command" },
  "Chief Deputy": { color: "#d97706", border: "rgba(217,119,6,0.35)",  bg: "rgba(217,119,6,0.05)",  order: 3, tier: "Command Staff" },
  Colonel:        { color: "#d97706", border: "rgba(217,119,6,0.3)",   bg: "rgba(217,119,6,0.04)",  order: 4, tier: "Command Staff" },
};

function getInitials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

// ── Rank Insignia Images ────────────────────────────────────────────────────

const RANK_INSIGNIA_SRC: Record<string, string> = {
  Sheriff:        "/3star.png",
  Undersheriff:   "/2star.png",
  "Chief Deputy": "/1star.png",
  Colonel:        "/colonel.jpg",
};

function RankInsignia({ rank }: { rank: string }) {
  const src = RANK_INSIGNIA_SRC[rank];
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={`${rank} insignia`}
      width={56}
      height={56}
      className="object-contain"
      style={{ filter: "drop-shadow(0 0 4px rgba(201,162,39,0.4))" }}
    />
  );
}

function StaffCard({ member, index }: { member: StaticStaffMember; index: number }) {
  const cfg = RANK_CONFIG[member.rank] ?? RANK_CONFIG["Colonel"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-lg overflow-hidden border flex flex-col sm:flex-row"
      style={{ borderColor: cfg.border, background: "var(--bg-panel)" }}
    >
      {/* Top accent bar — mobile */}
      <div className="sm:hidden h-1 w-full" style={{ background: `linear-gradient(to right, ${cfg.color}, ${cfg.color}44)` }} />
      {/* Left accent bar — desktop */}
      <div className="hidden sm:block w-1 flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${cfg.color}, ${cfg.color}88)` }} />

      {/* Avatar column */}
      <div className="flex-shrink-0 flex sm:flex-col items-center gap-4 sm:gap-0 sm:justify-center px-5 sm:px-7 py-4 sm:py-6 border-b sm:border-b-0 sm:border-r"
        style={{ borderColor: cfg.border, background: cfg.bg }}>
        <div className="font-mono text-[10px] tracking-widest hidden sm:block sm:mb-3" style={{ color: `${cfg.color}80` }}>
          #{cfg.order.toString().padStart(2, "0")}
        </div>
        {/* Avatar */}
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 sm:mb-4 flex-shrink-0"
          style={{ borderColor: cfg.border, background: `rgba(0,0,0,0.4)` }}>
          <span className="font-display text-lg sm:text-2xl font-black" style={{ color: cfg.color }}>
            {getInitials(member.name)}
          </span>
        </div>
        {/* Insignia */}
        <div className="flex items-center justify-center">
          <RankInsignia rank={member.rank} />
        </div>
      </div>

      {/* Details column */}
      <div className="flex-1 px-4 sm:px-6 py-4 sm:py-5 flex flex-col justify-center">
        {/* Tier label */}
        <span className="font-display text-[8px] tracking-[0.4em] uppercase mb-1" style={{ color: `${cfg.color}90` }}>
          {cfg.tier}
        </span>

        {/* Rank */}
        <p className="font-display text-xs tracking-[0.2em] uppercase font-semibold mb-1" style={{ color: cfg.color }}>
          {member.rank}
        </p>

        {/* Name */}
        <h3 className="font-display text-xl font-black text-[var(--text-primary)] tracking-wide mb-3">
          {member.name}
        </h3>

        {/* Divider */}
        <div className="h-[1px] mb-3" style={{ background: `linear-gradient(90deg, ${cfg.border}, transparent)` }} />

        {/* Info grid */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[8px] tracking-[0.3em] text-[var(--text-muted)] uppercase w-14 flex-shrink-0">Badge</span>
            <span className="font-mono text-sm font-bold" style={{ color: cfg.color }}>#{member.badge_number}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[8px] tracking-[0.3em] text-[var(--text-muted)] uppercase w-14 flex-shrink-0">Title</span>
            <span className="text-[12px] text-[var(--text-secondary)] leading-tight">{member.role}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[8px] tracking-[0.3em] text-[var(--text-muted)] uppercase w-14 flex-shrink-0">Bureau</span>
            <span className="text-[12px] text-[var(--text-secondary)]">{member.division}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 mt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 5px #34d399" }} />
          <span className="font-display text-[8px] tracking-[0.3em] text-emerald-400 uppercase">Active Duty</span>
        </div>
      </div>
    </motion.div>
  );
}

const TIERS = [
  { label: "Executive Command", color: "#c9a227", border: "rgba(201,162,39,0.3)", ranks: ["Sheriff", "Undersheriff"] },
  { label: "Command Staff",     color: "#d97706", border: "rgba(217,119,6,0.3)",   ranks: ["Chief Deputy", "Colonel"] },
];

export default function StaffPage() {
  const sorted = [...STAFF_DATA].sort((a, b) => (RANK_CONFIG[a.rank]?.order ?? 99) - (RANK_CONFIG[b.rank]?.order ?? 99));

  return (
    <div className="min-h-screen pb-20">
      {/* Page header */}
      <div className="px-8 pt-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-5">
          <Image src="/BCSOBadge.png" alt="BCSO" width={52} height={52}
            style={{ filter: "drop-shadow(0 0 12px rgba(201,162,39,0.5))" }} />
          <div>
            <span className="font-display text-[9px] tracking-[0.5em] text-badge uppercase block mb-1">Department Portal</span>
            <h1 className="font-display text-3xl font-black text-primary-color tracking-tight">COMMAND STAFF</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              Blaine County Sheriff&apos;s Office &mdash; Chain of Command
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 py-10 space-y-12">
        {TIERS.map((tier, ti) => {
          const members = sorted.filter(m => tier.ranks.includes(m.rank));
          return (
            <section key={tier.label}>
              {/* Tier header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: ti * 0.2 }}
                className="flex items-center gap-4 mb-5"
              >
                <div className="h-[1px] flex-1" style={{ background: `linear-gradient(to right, transparent, ${tier.border})` }} />
                <span className="font-display text-[9px] tracking-[0.4em] uppercase px-4 py-1 border rounded-sm"
                  style={{ color: tier.color, borderColor: tier.border, background: `${tier.border.replace("0.3", "0.06")}` }}>
                  {tier.label}
                </span>
                <div className="h-[1px] flex-1" style={{ background: `linear-gradient(to left, transparent, ${tier.border})` }} />
              </motion.div>

              {/* Cards */}
              <div className="space-y-4">
                {members.map((m, i) => (
                  <StaffCard key={m.id} member={m} index={ti * 2 + i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
