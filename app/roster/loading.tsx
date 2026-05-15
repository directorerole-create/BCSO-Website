import React from "react";
import { Users } from "lucide-react";

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded bg-[var(--badge)]/8 ${className ?? ""}`} style={style} />
  );
}

export default function RosterLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-5 border-b border-[var(--border)]">
        <Skeleton className="h-2.5 w-32 mb-3" />
        <div className="flex items-center gap-2 sm:gap-3">
          <Users className="w-5 h-5 sm:w-7 sm:h-7 text-badge/30 flex-shrink-0" strokeWidth={1.5} />
          <span className="font-display text-xl sm:text-3xl font-bold text-primary-color tracking-tight opacity-40">
            PERSONNEL ROSTER
          </span>
        </div>
        <Skeleton className="h-3 w-64 mt-2" />
      </div>

      {/* Search / filter bar skeleton */}
      <div className="px-4 sm:px-6 py-3 border-b border-[var(--border)]/50 flex gap-3">
        <Skeleton className="h-9 flex-1 max-w-sm rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Table header skeleton */}
      <div className="px-4 sm:px-6 py-2 border-b border-[var(--border)]/30">
        <div className="flex gap-4">
          {[10, 18, 14, 14, 10, 10, 10, 10].map((w, i) => (
            <Skeleton key={i} className="h-2.5" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* Row skeletons — group by tier */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">
        {["Administration", "Senior Staff", "Deputies"].map(tier => (
          <div key={tier}>
            <Skeleton className="h-3 w-32 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: tier === "Administration" ? 3 : tier === "Senior Staff" ? 4 : 8 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center py-1.5">
                  <Skeleton className="h-3" style={{ width: "10%" }} />
                  <Skeleton className="h-3" style={{ width: "18%" }} />
                  <Skeleton className="h-3" style={{ width: "14%" }} />
                  <Skeleton className="h-3" style={{ width: "14%" }} />
                  <Skeleton className="h-3" style={{ width: "10%" }} />
                  <Skeleton className="h-3" style={{ width: "10%" }} />
                  <Skeleton className="h-3" style={{ width: "10%" }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Loading pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--badge)]/20 bg-[var(--bg-panel)] shadow-lg">
        <span className="w-2 h-2 rounded-full bg-badge animate-pulse" />
        <span className="font-display text-[10px] tracking-[0.35em] text-[var(--text-muted)] uppercase">
          Loading Roster…
        </span>
      </div>
    </div>
  );
}
