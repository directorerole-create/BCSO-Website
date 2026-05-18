import React from "react";
import { Car, Loader2 } from "lucide-react";

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden rounded bg-[var(--badge)]/6 ${className ?? ""}`} style={style}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-[var(--badge)]/10 to-transparent" />
    </div>
  );
}

export default function VehiclesLoading() {
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
        <div className="mb-8">
          <Shimmer className="h-2.5 w-36 mb-3" />
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 sm:w-7 sm:h-7 text-badge/25 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-display text-2xl sm:text-3xl font-bold text-primary-color tracking-tight opacity-30">
              VEHICLE STRUCTURE
            </span>
          </div>
          <Shimmer className="h-3 w-72 mt-2" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg bg-[var(--bg-panel)] border border-[var(--border)]/50 w-fit">
          <Shimmer className="h-8 w-20 rounded" />
          <Shimmer className="h-8 w-20 rounded" />
          <Shimmer className="h-8 w-32 rounded" />
        </div>

        {/* Rank table skeleton */}
        <div className="panel overflow-hidden">
          <div className="grid grid-cols-[180px_1fr] gap-4 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]">
            <Shimmer className="h-2 w-16" />
            <Shimmer className="h-2 w-32" />
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[180px_1fr] gap-4 px-4 py-3 border-b border-[var(--border)]/40 last:border-0 items-start">
              <Shimmer className="h-4 w-36" />
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map((_, j) => (
                  <Shimmer key={j} className="h-6 w-24 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[var(--badge)]/30 bg-[var(--bg-panel)] shadow-xl shadow-black/30">
        <Loader2 className="w-3.5 h-3.5 text-badge animate-spin flex-shrink-0" />
        <span className="font-display text-[10px] tracking-[0.35em] text-[var(--text-secondary)] uppercase whitespace-nowrap">
          Fetching Vehicle Data…
        </span>
      </div>
    </>
  );
}
