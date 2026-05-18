import React from "react";
import { Layers, Loader2 } from "lucide-react";

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden rounded bg-[var(--badge)]/6 ${className ?? ""}`} style={style}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-[var(--badge)]/10 to-transparent" />
    </div>
  );
}

function UniformCardSkeleton() {
  return (
    <div className="panel flex flex-col overflow-hidden border border-[var(--badge)]/10">
      <Shimmer className="w-full" style={{ height: 180 }} />
      <div className="px-4 pt-3.5 pb-2 border-b border-[var(--border)]/50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Shimmer className="h-4 w-28" />
          <Shimmer className="h-4 w-20 rounded-full" />
        </div>
      </div>
      <div className="flex-1 px-4 py-3 space-y-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="flex justify-between items-center">
            <Shimmer className="h-2.5 w-28" />
            <Shimmer className="h-5 w-12 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UniformsLoading() {
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

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-5 border-b border-[var(--border)]">
          <Shimmer className="h-2.5 w-36 mb-2" />
          <div className="flex items-center gap-2 sm:gap-3">
            <Layers className="w-5 h-5 sm:w-7 sm:h-7 text-badge/25 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-display text-xl sm:text-3xl font-bold text-primary-color tracking-tight opacity-30">
              UNIFORM STRUCTURE
            </span>
          </div>
          <Shimmer className="h-3 w-80 mt-2" />
        </div>

        <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
          {/* Grooming section skeleton */}
          <Shimmer className="h-14 w-full rounded-lg mb-8" />

          {/* Tab switcher */}
          <div className="flex gap-1 mb-6 p-1 rounded-lg bg-[var(--bg-panel)] border border-[var(--border)]/50 w-fit">
            <Shimmer className="h-8 w-20 rounded" />
            <Shimmer className="h-8 w-20 rounded" />
          </div>

          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <UniformCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Loading pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[var(--badge)]/30 bg-[var(--bg-panel)] shadow-xl shadow-black/30">
        <Loader2 className="w-3.5 h-3.5 text-badge animate-spin flex-shrink-0" />
        <span className="font-display text-[10px] tracking-[0.35em] text-[var(--text-secondary)] uppercase whitespace-nowrap">
          Loading Uniforms…
        </span>
      </div>
    </>
  );
}
