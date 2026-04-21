"use client";

export function PoliceLightBar({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-hidden>
      {/* Red side */}
      <div className="flex gap-[3px]">
        {[0, 1, 2].map(i => (
          <div
            key={`r${i}`}
            className="police-unit police-red"
            style={{ animationDelay: `${i * 0.04}s` }}
          />
        ))}
      </div>

      <div className="w-[1px] h-3 bg-gray-600 mx-1 opacity-30" />

      {/* Blue side */}
      <div className="flex gap-[3px]">
        {[0, 1, 2].map(i => (
          <div
            key={`b${i}`}
            className="police-unit police-blue"
            style={{ animationDelay: `${i * 0.04}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function AmbientPoliceGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Red — top left */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-0 dark:opacity-100 ambient-red" />
      {/* Blue — top right */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-0 dark:opacity-100 ambient-blue" />

      <style>{`
        .ambient-red {
          background: radial-gradient(circle, rgba(230,57,70,0.18) 0%, transparent 65%);
          animation: ambientStrobeRed 1.2s linear infinite;
        }
        .ambient-blue {
          background: radial-gradient(circle, rgba(29,111,204,0.18) 0%, transparent 65%);
          animation: ambientStrobeBlue 1.2s linear infinite;
        }
        @keyframes ambientStrobeRed {
          0%   { opacity: 1; }
          9%   { opacity: 0.05; }
          17%  { opacity: 1; }
          26%  { opacity: 0.05; }
          50%  { opacity: 0.05; }
          100% { opacity: 0.05; }
        }
        @keyframes ambientStrobeBlue {
          0%   { opacity: 0.05; }
          50%  { opacity: 0.05; }
          59%  { opacity: 1; }
          67%  { opacity: 0.05; }
          75%  { opacity: 1; }
          84%  { opacity: 0.05; }
          100% { opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}
