import React from "react";
import { Package, Loader2 } from "lucide-react";

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden rounded bg-[var(--badge)]/6 ${className ?? ""}`} style={style}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-[var(--badge)]/10 to-transparent" />
    </div>
  );
}

export default function EquipmentLoading() {
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
            <Package className="w-6 h-6 sm:w-7 sm:h-7 text-badge/25 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-display text-2xl sm:text-3xl font-bold text-primary-color tracking-tight opacity-30">
              AUTHORIZED EQUIPMENT
            </span>
          </div>
          <Shimmer className="h-3 w-72 mt-2" />
        </div>

        {/* Category blocks */}
        <div className="space-y-8 max-w-5xl">
          {[13, 17, 4, 5].map((count, ci) => (
            <div key={ci}>
              {/* Divider + label */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[1px] flex-1 bg-[var(--badge)]/20" />
                <Shimmer className="h-2 w-48" />
                <div className="h-[1px] flex-1 bg-[var(--badge)]/20" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: count }).map((_, i) => (
                  <div key={i} className="panel p-3 flex flex-col gap-1.5 border border-[var(--badge)]/10">
                    <Shimmer className="h-6 w-12" />
                    <Shimmer className="h-3 w-full" />
                    <Shimmer className="h-3 w-3/4" />
                  </div>
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
          Fetching Equipment…
        </span>
      </div>
    </>
  );
}
