import React from "react";
import { Users, Loader2 } from "lucide-react";

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden rounded bg-[var(--badge)]/6 ${className ?? ""}`} style={style}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-[var(--badge)]/10 to-transparent" />
    </div>
  );
}

export default function RosterLoading() {
  return (
    <>
      <style>{`
        @keyframes shimmer { to { transform: translateX(200%); } }
        @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
      `}</style>

      {/* Top progress bar */}
      <div className="fixed top-0 inset-x-0 h-[2px] z-50 bg-[var(--badge)]/10 overflow-hidden">
        <div className="h-full w-1/3 bg-badge/70 animate-[progress_1.8s_ease-in-out_infinite]" />
      </div>

      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Shimmer className="h-2.5 w-36 mb-3" />
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-badge/25 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-display text-2xl sm:text-3xl font-bold text-primary-color tracking-tight opacity-30">
              PUBLIC ROSTER
            </span>
          </div>
          <Shimmer className="h-3 w-72 mt-2" />
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-1 panel px-2 py-1.5">
            {[48, 80, 68, 56, 48].map((w, i) => (
              <Shimmer key={i} className="h-7 rounded" style={{ width: w }} />
            ))}
          </div>
          <Shimmer className="h-9 w-64 rounded-lg" />
        </div>

        {/* Table panel */}
        <div className="panel overflow-hidden">
          {/* Table header */}
          <div className="border-b border-[var(--border)] px-4 py-2.5 flex gap-4">
            {[60, 160, 90, 180, 150, 100, 80].map((w, i) => (
              <Shimmer key={i} className="h-2" style={{ width: w, flexShrink: 0 }} />
            ))}
          </div>

          {/* Tier groups */}
          {[
            { label: "Administration", count: 4 },
            { label: "Senior Staff",   count: 5 },
            { label: "Staff",          count: 6 },
            { label: "Deputies",       count: 10 },
          ].map(({ label, count }) => (
            <div key={label}>
              <div className="px-4 py-1.5 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]/50">
                <Shimmer className="h-2 w-32" />
              </div>
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="px-4 py-2.5 border-b border-[var(--border)]/30 flex gap-4 items-center last:border-0">
                  <Shimmer className="h-3 rounded" style={{ width: 60,  flexShrink: 0 }} />
                  <Shimmer className="h-3 rounded" style={{ width: 140, flexShrink: 0 }} />
                  <Shimmer className="h-3 rounded" style={{ width: 80,  flexShrink: 0 }} />
                  <Shimmer className="h-3 rounded" style={{ width: 160, flexShrink: 0 }} />
                  <Shimmer className="h-3 rounded" style={{ width: 120, flexShrink: 0 }} />
                  <Shimmer className="h-3 rounded" style={{ width: 90,  flexShrink: 0 }} />
                  <Shimmer className="h-5 w-14 rounded" style={{ flexShrink: 0 }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Loading pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[var(--badge)]/30 bg-[var(--bg-panel)] shadow-xl shadow-black/30">
        <Loader2 className="w-3.5 h-3.5 text-badge animate-spin flex-shrink-0" />
        <span className="font-display text-[10px] tracking-[0.35em] text-[var(--text-secondary)] uppercase whitespace-nowrap">
          Fetching Roster…
        </span>
      </div>
    </>
  );
}
