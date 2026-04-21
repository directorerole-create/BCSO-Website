"use client";

const CELL_COUNT = 14;

export function PoliceLightBar({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: CELL_COUNT }).map((_, i) => (
        <div
          key={i}
          className={`police-unit ${i % 2 === 0 ? "police-cell-odd" : "police-cell-even"}`}
          style={{ animationDelay: `${i * 0.025}s` }}
        />
      ))}
    </div>
  );
}

export function AmbientPoliceGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-0 dark:opacity-100 ambient-red" />
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-0 dark:opacity-100 ambient-blue" />
      <style>{`
        .ambient-red {
          background: radial-gradient(circle, rgba(230,57,70,0.18) 0%, transparent 65%);
          animation: ambientStrobeRed 1.0s linear infinite;
        }
        .ambient-blue {
          background: radial-gradient(circle, rgba(29,111,204,0.18) 0%, transparent 65%);
          animation: ambientStrobeBlue 1.0s linear infinite;
        }
        @keyframes ambientStrobeRed {
          0%   { opacity: 1; }
          8%   { opacity: 0.05; }
          15%  { opacity: 1; }
          23%  { opacity: 0.05; }
          50%  { opacity: 0.05; }
          100% { opacity: 0.05; }
        }
        @keyframes ambientStrobeBlue {
          0%   { opacity: 0.05; }
          49%  { opacity: 0.05; }
          50%  { opacity: 1; }
          58%  { opacity: 0.05; }
          65%  { opacity: 1; }
          73%  { opacity: 0.05; }
          100% { opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}
