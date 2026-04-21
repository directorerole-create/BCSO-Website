"use client";

export function PoliceLightBar({ className = "" }: { className?: string }) {
  const reds = [0, 1, 2, 3];
  const blues = [0, 1, 2, 3];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Red section */}
      <div className="flex gap-[3px]">
        {reds.map((i) => (
          <div
            key={`r${i}`}
            className="light-unit light-red"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>

      {/* Center divider */}
      <div className="w-[2px] h-3 bg-gray-600 mx-1 rounded-full opacity-50" />

      {/* Blue section */}
      <div className="flex gap-[3px]">
        {blues.map((i) => (
          <div
            key={`b${i}`}
            className="light-unit light-blue"
            style={{ animationDelay: `${0.5 + i * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function AmbientPoliceGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Top-left red glow */}
      <div
        className="absolute -top-32 -left-32 w-64 h-64 rounded-full opacity-0 dark:opacity-100"
        style={{
          background: "radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)",
          animation: "ambientRed 2s ease-in-out infinite",
        }}
      />
      {/* Top-right blue glow */}
      <div
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-0 dark:opacity-100"
        style={{
          background: "radial-gradient(circle, rgba(29,111,204,0.08) 0%, transparent 70%)",
          animation: "ambientBlue 2s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes ambientRed {
          0%, 49%, 100% { opacity: 0.6; }
          50%, 99% { opacity: 0.1; }
        }
        @keyframes ambientBlue {
          0%, 49%, 100% { opacity: 0.1; }
          50%, 99% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
