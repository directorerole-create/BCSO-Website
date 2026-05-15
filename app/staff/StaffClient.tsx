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
  "Sheriff":      "/3star.png",
  "Undersheriff": "/2star.png",
  "Chief Deputy": "/1star.png",
  "Colonel":      "/colonel.jpg",
};

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

function StatusPill({ status }: { status: string }) {
  if (status === "Active")
    return <span className="text-[9px] font-display tracking-[0.3em] uppercase text-emerald-400">● Active</span>;
  if (status === "LOA")
    return <span className="text-[9px] font-display tracking-[0.3em] uppercase text-yellow-500">● Leave</span>;
  return   <span className="text-[9px] font-display tracking-[0.3em] uppercase text-[var(--text-muted)]">● Inactive</span>;
}

// ── Card variants ────────────────────────────────────────────────────────────

function ExecutiveCard({ m }: { m: CommandMember }) {
  return (
    <div className="flex items-stretch border border-[var(--border)] rounded bg-[var(--bg-panel)] overflow-hidden">
      {/* Gold stripe */}
      <div className="w-[3px] flex-shrink-0 bg-badge" />

      {/* Insignia */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 px-5 py-5 border-r border-[var(--border)] bg-[var(--bg-panel-alt)] w-24">
        <div className="w-12 h-12 rounded-full border border-[var(--badge)]/40 bg-black/30 flex items-center justify-center">
          <span className="font-display font-black text-base text-badge">{initials(m.name)}</span>
        </div>
        {INSIGNIA[m.rank] && (
          <Image src={INSIGNIA[m.rank]} alt={m.rank} width={36} height={36}
            className="object-contain opacity-80"
            style={{ filter: "drop-shadow(0 0 3px rgba(201,162,39,0.5))" }} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 px-6 py-4 flex flex-col justify-center">
        <p className="font-display text-[8px] tracking-[0.5em] text-badge uppercase mb-0.5">{m.rank}</p>
        <h2 className="font-display text-xl font-black text-[var(--text-primary)] tracking-tight">{m.name}</h2>
        <p className="text-[var(--text-muted)] text-[11px] mt-1">{m.role}</p>
        {m.division && <p className="text-[var(--text-muted)] text-[10px] mt-0.5 opacity-70">{m.division}</p>}
      </div>

      {/* Right meta */}
      <div className="flex-shrink-0 flex flex-col items-end justify-between px-5 py-4 border-l border-[var(--border)]">
        <span className="font-mono text-sm font-bold text-badge">{m.callsign ?? `#${m.badge_number}`}</span>
        <StatusPill status={m.status} />
      </div>
    </div>
  );
}

function OfficerCard({ m }: { m: CommandMember }) {
  return (
    <div className="flex items-stretch border border-[var(--border)] rounded bg-[var(--bg-panel)] overflow-hidden hover:border-[var(--badge)]/25 transition-colors">
      <div className="w-[3px] flex-shrink-0 bg-[var(--badge)]/40" />

      {/* Initials */}
      <div className="flex-shrink-0 flex items-center justify-center px-4 border-r border-[var(--border)] bg-[var(--bg-panel-alt)] w-16">
        <div className="w-9 h-9 rounded-full border border-[var(--badge)]/30 bg-black/30 flex items-center justify-center">
          <span className="font-display font-black text-xs text-[var(--badge)]/80">{initials(m.name)}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 px-4 py-3">
        <p className="font-display text-[8px] tracking-[0.4em] text-[var(--text-muted)] uppercase">{m.rank}</p>
        <p className="font-display text-sm font-bold text-[var(--text-primary)] leading-tight">{m.name}</p>
        {m.division && <p className="text-[var(--text-muted)] text-[10px] mt-0.5 truncate">{m.division}</p>}
      </div>

      {/* Right meta */}
      <div className="flex-shrink-0 flex flex-col items-end justify-between px-4 py-3 border-l border-[var(--border)]">
        <span className="font-mono text-xs text-[var(--badge)]/80">{m.callsign ?? `#${m.badge_number}`}</span>
        <StatusPill status={m.status} />
      </div>
    </div>
  );
}

// ── Hierarchy connector helpers ──────────────────────────────────────────────

function VLine() {
  return <div className="flex justify-center py-0"><div className="w-px h-8 bg-[var(--badge)]/30" /></div>;
}

function BranchLine({ count }: { count: number }) {
  if (count <= 1) return <VLine />;
  return (
    <div className="flex justify-center py-0">
      <div className="flex flex-col items-center">
        <div className="w-px h-4 bg-[var(--badge)]/30" />
        <div className="w-3/4 h-px bg-[var(--badge)]/30" />
        <div className="w-full flex justify-between px-[12.5%]">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="w-px h-4 bg-[var(--badge)]/30" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main client component ────────────────────────────────────────────────────

export function StaffClient({ staff }: { staff: CommandMember[] }) {
  const sorted = [...staff].sort((a, b) =>
    (RANK_ORDER[a.rank] ?? 99) - (RANK_ORDER[b.rank] ?? 99)
  );

  const exec    = sorted.filter(m => ["Sheriff","Undersheriff"].includes(m.rank));
  const command = sorted.filter(m => ["Chief Deputy","Colonel"].includes(m.rank));
  const captains   = sorted.filter(m => m.rank === "Captain");
  const lieutenants = sorted.filter(m => m.rank === "Lieutenant");

  const activeCount = staff.filter(m => m.status === "Active").length;

  return (
    <div className="min-h-screen pb-20">
      {/* Page header */}
      <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-5">
          <Image src="/BCSOBadge.png" alt="BCSO" width={48} height={48}
            style={{ filter: "drop-shadow(0 0 10px rgba(201,162,39,0.4))" }} />
          <div>
            <span className="font-display text-[9px] tracking-[0.5em] text-badge uppercase block mb-1">Department Portal</span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-primary-color tracking-tight">CHAIN OF COMMAND</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              Blaine County Sheriff&apos;s Office &mdash; <span className="text-emerald-400">{activeCount} active</span> of {staff.length} command personnel
            </p>
          </div>
        </div>
      </div>

      {/* Hierarchy */}
      <div className="max-w-2xl mx-auto px-6 sm:px-10 pt-10 pb-16">

        {/* Executive (Sheriff + Undersheriff) — stacked, full width */}
        {exec.length > 0 && (
          <div className="space-y-0">
            {exec.map((m, i) => (
              <div key={m.id}>
                <ExecutiveCard m={m} />
                {/* Connector below, unless last exec item has no one beneath */}
                {(i < exec.length - 1 || command.length > 0 || captains.length > 0) && <VLine />}
              </div>
            ))}
          </div>
        )}

        {/* Command Staff (Chief Deputy / Colonel) */}
        {command.length > 0 && (
          <>
            <div className="space-y-0">
              {command.map((m, i) => (
                <div key={m.id}>
                  <ExecutiveCard m={m} />
                  {(i < command.length - 1 || captains.length > 0 || lieutenants.length > 0) && <VLine />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Captains */}
        {captains.length > 0 && (
          <>
            {captains.length > 1 && (
              <div className="flex justify-center pb-0">
                <div className="flex flex-col items-center w-full">
                  <div className="w-px h-4 bg-[var(--badge)]/30" />
                  <div className="relative w-full flex items-start justify-center">
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-[var(--badge)]/30" style={{ left: `${100 / (captains.length * 2)}%`, right: `${100 / (captains.length * 2)}%` }} />
                    <div className="w-full flex justify-around">
                      {captains.map(c => (
                        <div key={c.id} className="w-px h-4 bg-[var(--badge)]/30" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {captains.length === 1 && <VLine />}

            <div className={`grid gap-3 ${captains.length >= 3 ? "grid-cols-3" : captains.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
              {captains.map(m => <OfficerCard key={m.id} m={m} />)}
            </div>

            {lieutenants.length > 0 && <VLine />}
          </>
        )}

        {/* Lieutenants */}
        {lieutenants.length > 0 && (
          <>
            {lieutenants.length > 1 && (
              <div className="flex justify-center pb-0">
                <div className="flex flex-col items-center w-full">
                  <div className="w-px h-4 bg-[var(--badge)]/30" />
                  <div className="w-full flex justify-around">
                    {lieutenants.map(l => (
                      <div key={l.id} className="w-px h-4 bg-[var(--badge)]/30" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {lieutenants.length === 1 && <VLine />}
            <div className={`grid gap-3 ${lieutenants.length >= 3 ? "grid-cols-3" : lieutenants.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
              {lieutenants.map(m => <OfficerCard key={m.id} m={m} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
