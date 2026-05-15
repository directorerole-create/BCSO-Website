import React from "react";
import { Users } from "lucide-react";

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded bg-[var(--badge)]/8 ${className ?? ""}`} style={style} />
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col items-center w-40">
      {/* Portrait image area */}
      <div className="w-36 h-44 rounded-lg bg-[var(--bg-panel-alt)] animate-pulse border border-[var(--border)]/30 mb-3" />
      {/* Rank chip */}
      <Skeleton className="h-2.5 w-20 mb-2" />
      {/* Name */}
      <Skeleton className="h-3.5 w-28 mb-1.5" />
      {/* Callsign */}
      <Skeleton className="h-2.5 w-16" />
    </div>
  );
}

export default function StaffLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-5 border-b border-[var(--border)]">
        <Skeleton className="h-2.5 w-32 mb-3" />
        <div className="flex items-center gap-2 sm:gap-3">
          <Users className="w-5 h-5 sm:w-7 sm:h-7 text-badge/30 flex-shrink-0" strokeWidth={1.5} />
          <span className="font-display text-xl sm:text-3xl font-bold text-primary-color tracking-tight opacity-40">
            COMMAND STAFF
          </span>
        </div>
        <Skeleton className="h-3 w-60 mt-2" />
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        {/* Sheriff / Undersheriff tier */}
        <div className="flex justify-center gap-12 mb-12">
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10 max-w-2xl mx-auto">
          <div className="flex-1 h-px bg-[var(--badge)]/15" />
          <Skeleton className="h-2.5 w-24" />
          <div className="flex-1 h-px bg-[var(--badge)]/15" />
        </div>

        {/* Middle tier */}
        <div className="flex justify-center flex-wrap gap-10 mb-12">
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10 max-w-2xl mx-auto">
          <div className="flex-1 h-px bg-[var(--badge)]/15" />
          <Skeleton className="h-2.5 w-20" />
          <div className="flex-1 h-px bg-[var(--badge)]/15" />
        </div>

        {/* Lower tier */}
        <div className="flex justify-center flex-wrap gap-10">
          {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>

      {/* Loading pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--badge)]/20 bg-[var(--bg-panel)] shadow-lg">
        <span className="w-2 h-2 rounded-full bg-badge animate-pulse" />
        <span className="font-display text-[10px] tracking-[0.35em] text-[var(--text-muted)] uppercase">
          Loading Command Staff…
        </span>
      </div>
    </div>
  );
}
