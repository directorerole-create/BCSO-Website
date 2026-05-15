import React from "react";
import { FileText } from "lucide-react";

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded bg-[var(--badge)]/8 ${className ?? ""}`} style={style} />
  );
}

export default function DeptPoliciesLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-5 border-b border-[var(--border)]">
        <Skeleton className="h-2.5 w-36 mb-3" />
        <div className="flex items-center gap-2 sm:gap-3">
          <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-badge/30 flex-shrink-0" strokeWidth={1.5} />
          <span className="font-display text-xl sm:text-3xl font-bold text-primary-color tracking-tight opacity-40">
            DEPARTMENT POLICIES
          </span>
        </div>
        <Skeleton className="h-3 w-72 mt-2" />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden justify-center" style={{ height: "calc(100vh - 140px)" }}>
        <div className="flex w-full max-w-6xl min-w-0">

          {/* Sidebar skeleton */}
          <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-[var(--border)]/50 flex-col gap-3 px-4 py-5">
            <Skeleton className="h-2 w-28 mb-2" />
            {[75, 60, 88, 70, 55, 80, 65, 72, 58].map((w, i) => (
              <Skeleton key={i} className="h-8 rounded" style={{ width: `${w}%` }} />
            ))}
          </aside>

          {/* Document skeleton */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
            <div className="max-w-3xl mx-auto">
              {/* Document header card */}
              <div className="rounded-t-lg overflow-hidden border border-[var(--badge)]/20 mb-8">
                <div className="flex items-stretch">
                  <div className="flex-1 bg-[var(--bg-panel-alt)] px-6 py-5">
                    <Skeleton className="h-2 w-24 mb-3" />
                    <Skeleton className="h-7 w-64" />
                  </div>
                  <div className="w-24 bg-badge/80 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/20" />
                  </div>
                </div>
                <div className="bg-[var(--bg-panel)] border-t border-[var(--badge)]/15 px-6 py-3 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i}>
                      <Skeleton className="h-2 w-20 mb-1.5" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section blocks */}
              <div className="space-y-8 panel px-6 sm:px-8 py-8">
                {[1, 2, 3].map(s => (
                  <div key={s}>
                    <Skeleton className="h-4 w-32 mb-3 pb-1.5" />
                    <div className="space-y-2 pl-1">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-11/12" />
                      <Skeleton className="h-3 w-4/5" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--badge)]/20 bg-[var(--bg-panel)] shadow-lg">
        <span className="w-2 h-2 rounded-full bg-badge animate-pulse" />
        <span className="font-display text-[10px] tracking-[0.35em] text-[var(--text-muted)] uppercase">
          Loading Policies…
        </span>
      </div>
    </div>
  );
}
