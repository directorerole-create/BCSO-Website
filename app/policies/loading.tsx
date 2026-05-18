import React from "react";
import { BookOpen, Loader2 } from "lucide-react";

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden rounded bg-[var(--badge)]/6 ${className ?? ""}`} style={style}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-[var(--badge)]/10 to-transparent" />
    </div>
  );
}

export default function PoliciesLoading() {
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
          <Shimmer className="h-2.5 w-36 mb-3" />
          <div className="flex items-center gap-2 sm:gap-3">
            <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-badge/25 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-display text-xl sm:text-3xl font-bold text-primary-color tracking-tight opacity-30">
              STANDARD OPERATING PROCEDURES
            </span>
          </div>
          <Shimmer className="h-3 w-72 mt-2" />
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden justify-center" style={{ height: "calc(100vh - 140px)" }}>
          <div className="flex w-full max-w-6xl min-w-0">

            {/* Sidebar skeleton */}
            <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-[var(--border)]/50 flex-col gap-3 px-4 py-5">
              <Shimmer className="h-2 w-28 mb-2" />
              {[80, 65, 90, 72, 58, 75, 68, 55, 80, 70].map((w, i) => (
                <Shimmer key={i} className="h-8 rounded" style={{ width: `${w}%` }} />
              ))}
            </aside>

            {/* Content skeleton */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
              <div className="max-w-3xl mx-auto">
                <Shimmer className="h-3 w-20 mb-3" />
                <Shimmer className="h-7 w-3/4 mb-6" />
                <div className="border-b border-[var(--border)] mb-8" />
                {[1, 2, 3].map(s => (
                  <div key={s} className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Shimmer className="h-4 w-10" />
                      <Shimmer className="h-5 w-48" />
                    </div>
                    <div className="space-y-2.5 pl-4 border-l border-[var(--border)]">
                      <Shimmer className="h-3 w-full" />
                      <Shimmer className="h-3 w-11/12" />
                      <Shimmer className="h-3 w-4/5" />
                      <Shimmer className="h-3 w-full" />
                      <Shimmer className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </main>

          </div>
        </div>
      </div>

      {/* Loading pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[var(--badge)]/30 bg-[var(--bg-panel)] shadow-xl shadow-black/30">
        <Loader2 className="w-3.5 h-3.5 text-badge animate-spin flex-shrink-0" />
        <span className="font-display text-[10px] tracking-[0.35em] text-[var(--text-secondary)] uppercase whitespace-nowrap">
          Fetching SOP Manual…
        </span>
      </div>
    </>
  );
}
