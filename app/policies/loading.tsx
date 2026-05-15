import React from "react";
import { BookOpen } from "lucide-react";

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded bg-[var(--badge)]/8 ${className ?? ""}`} style={style} />
  );
}

export default function PoliciesLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — mirrors PoliciesClient header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-5 border-b border-[var(--border)]">
        <Skeleton className="h-2.5 w-32 mb-3" />
        <div className="flex items-center gap-2 sm:gap-3">
          <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-badge/30 flex-shrink-0" strokeWidth={1.5} />
          <span className="font-display text-xl sm:text-3xl font-bold text-primary-color tracking-tight opacity-40">
            STANDARD OPERATING PROCEDURES
          </span>
        </div>
        <Skeleton className="h-3 w-64 mt-2" />
      </div>

      {/* Body — sidebar + content */}
      <div className="flex flex-1 overflow-hidden justify-center" style={{ height: "calc(100vh - 140px)" }}>
        <div className="flex w-full max-w-6xl min-w-0">

          {/* Sidebar skeleton */}
          <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-[var(--border)]/50 flex-col gap-3 px-4 py-5">
            <Skeleton className="h-2 w-28 mb-2" />
            {[80, 65, 90, 72, 58, 75, 68, 55, 80].map((w, i) => (
              <Skeleton key={i} className="h-7 rounded" style={{ width: `${w}%` }} />
            ))}
          </aside>

          {/* Content skeleton */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-3xl mx-auto w-full">
            {/* Section title */}
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-7 w-3/4 mb-6" />
            <div className="border-b border-[var(--border)] mb-8" />

            {/* Subsection blocks */}
            {[1, 2, 3].map(s => (
              <div key={s} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <div className="pl-4 border-l border-[var(--border)] space-y-2.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-11/12" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </main>

        </div>
      </div>

      {/* Centered fetch indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--badge)]/20 bg-[var(--bg-panel)] shadow-lg">
        <span className="w-2 h-2 rounded-full bg-badge animate-pulse" />
        <span className="font-display text-[10px] tracking-[0.35em] text-[var(--text-muted)] uppercase">
          Loading SOP Manual…
        </span>
      </div>
    </div>
  );
}
