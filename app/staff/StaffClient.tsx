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

const RANK_ORDER: Record<string, number> = {
  "Sheriff": 1, "Undersheriff": 2, "Chief Deputy": 3, "Colonel": 4,
  "Captain": 5, "Lieutenant": 6,
};

const INSIGNIA: Record<string, string> = {
  "Chief Deputy": "/1star.png",
  "Colonel":      "/colonel.jpg",
};

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

// ── Portrait card ────────────────────────────────────────────────────────────

function PersonCard({ m, large = false }: { m: CommandMember; large?: boolean }) {
  const hasInsignia = !!INSIGNIA[m.rank];

  return (
    <div className="flex flex-col items-center text-center">
      {/* Portrait area */}
      <div
        className={`relative overflow-hidden rounded border border-[var(--badge)]/20 bg-[var(--bg-panel-alt)] mb-3 ${
          large ? "w-44 h-52" : "w-36 h-44"
        }`}
      >
        {hasInsignia ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={INSIGNIA[m.rank]}
              alt={m.rank}
              width={large ? 96 : 76}
              height={large ? 96 : 76}
              className="object-contain opacity-90"
              style={{ filter: "drop-shadow(0 0 10px rgba(201,162,39,0.55))" }}
            />
          </div>
        ) : (
          <>
            {/* Faint badge watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Image src="/BCSOBadge.png" alt="" width={120} height={120} className="object-contain" />
            </div>
            {/* Initials */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-display font-black text-badge/70 ${large ? "text-5xl" : "text-4xl"}`}>
                {initials(m.name)}
              </span>
            </div>
          </>
        )}

        {/* Gold top bar */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-badge/60" />
      </div>

      {/* Rank */}
      <p className="font-display text-[8px] tracking-[0.5em] text-badge uppercase mb-0.5">
        {m.rank}
      </p>

      {/* Division */}
      {m.division && (
        <p className="text-[var(--text-muted)] text-[10px] leading-snug mb-1 max-w-[10rem]">
          {m.division}
        </p>
      )}

      {/* Name */}
      <p className={`font-display font-bold text-[var(--text-primary)] leading-tight ${large ? "text-base" : "text-sm"}`}>
        {m.name}
      </p>

      {/* Callsign */}
      {m.callsign && (
        <p className="font-mono text-[10px] text-badge/55 mt-1">{m.callsign}</p>
      )}
    </div>
  );
}

// ── Divider ──────────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-10">
      <div className="flex-1 h-px bg-[var(--badge)]/15" />
      <span className="font-display text-[8px] tracking-[0.55em] text-badge/50 uppercase">
        {label}
      </span>
      <div className="flex-1 h-px bg-[var(--badge)]/15" />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function StaffClient({ staff }: { staff: CommandMember[] }) {
  const sorted = [...staff].sort(
    (a, b) => (RANK_ORDER[a.rank] ?? 99) - (RANK_ORDER[b.rank] ?? 99)
  );

  const exec     = sorted.filter(m => ["Sheriff", "Undersheriff"].includes(m.rank));
  const command  = sorted.filter(m => ["Chief Deputy", "Colonel"].includes(m.rank));
  const captains = sorted.filter(m => m.rank === "Captain");
  const lts      = sorted.filter(m => m.rank === "Lieutenant");

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-5">
          <Image
            src="/BCSOBadge.png"
            alt="BCSO"
            width={48}
            height={48}
            style={{ filter: "drop-shadow(0 0 10px rgba(201,162,39,0.4))" }}
          />
          <div>
            <span className="font-display text-[9px] tracking-[0.5em] text-badge uppercase block mb-1">
              Department Portal
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-primary-color tracking-tight">
              CHAIN OF COMMAND
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              Blaine County Sheriff&apos;s Office &mdash; Command Personnel
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-12">

        {/* Executive — stacked, centered */}
        {exec.length > 0 && (
          <div className="flex flex-col items-center gap-10">
            {exec.map(m => (
              <PersonCard key={m.id} m={m} large />
            ))}
          </div>
        )}

        {/* Command Staff */}
        {command.length > 0 && (
          <>
            <Divider label="Command Staff" />
            <div className={`flex flex-wrap justify-center gap-10`}>
              {command.map(m => <PersonCard key={m.id} m={m} large />)}
            </div>
          </>
        )}

        {/* Captains */}
        {captains.length > 0 && (
          <>
            <Divider label="Bureau Commanders" />
            <div className="flex flex-wrap justify-center gap-10">
              {captains.map(m => <PersonCard key={m.id} m={m} />)}
            </div>
          </>
        )}

        {/* Lieutenants */}
        {lts.length > 0 && (
          <>
            <Divider label="Field Operations" />
            <div className="flex flex-wrap justify-center gap-10">
              {lts.map(m => <PersonCard key={m.id} m={m} />)}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
