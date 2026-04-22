"use client";

const BULBS = 6;
const DURATION = "800ms";

export function PoliceLightBar({ className = "" }: { className?: string }) {
  return (
    <div className={`lb-bar ${className}`} aria-hidden>
      {/* Sequence 2: alternating B R B R B R */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const isBlue = i % 2 === 0;
        return (
          <div key={i} className={`lb-unit ${isBlue ? "lb-blue" : "lb-red"}`}>
            <div className={`lb-inner ${isBlue ? "lb-inner-blue" : "lb-inner-red"}`} />
            {Array.from({ length: BULBS }).map((_, j) => (
              <span key={j} className={`lb-bulb ${isBlue ? "lb-bulb-blue" : "lb-bulb-red"}`} />
            ))}
          </div>
        );
      })}

      <style>{`
        .lb-bar {
          display: flex;
          align-items: center;
          gap: 2px;
          width: 100%;
          padding: 3px 2px;
          border-radius: 3px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.2) 100%);
          overflow: hidden;
        }

        .lb-unit {
          position: relative;
          flex: 1;
          height: 12px;
          padding: 1px 3px;
          background-color: #0a0a10;
          border-top: 1px solid #070710;
          border-bottom: 1px solid #1a1a28;
          border-left: 1px solid #070710;
          border-right: 1px solid #1a1a28;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation-duration: ${DURATION};
          animation-iteration-count: infinite;
          overflow: visible;
        }

        .lb-inner {
          position: absolute;
          inset: 0;
          border-radius: 2px;
          opacity: 0;
          border: 1px solid transparent;
          animation-duration: ${DURATION};
          animation-iteration-count: infinite;
        }

        .lb-bulb {
          display: block;
          position: relative;
          z-index: 2;
          border-radius: 50%;
          width: 5px;
          height: 5px;
          box-shadow: 0 0 2px #111;
          background: linear-gradient(155deg,
            rgba(255,255,255,0.22) 0%,
            rgba(255,255,255,0.12) 25%,
            rgba(255,255,255,0.16) 49%,
            rgba(0,0,0,0) 78%,
            rgba(0,0,0,0.75) 100%
          );
          animation-duration: ${DURATION};
          animation-iteration-count: infinite;
        }

        /* ── BLUE (no delay) ── */
        .lb-inner-blue  { animation-name: lb-inner-b; }
        .lb-bulb-blue   { animation-name: lb-bulb-b; }

        /* ── RED (half-cycle delay) ── */
        .lb-inner-red   { animation-name: lb-inner-r; animation-delay: calc(${DURATION} / 2); }
        .lb-bulb-red    { animation-name: lb-bulb-b;  animation-delay: calc(${DURATION} / 2); }

        /* Bulb flash — brilliant white with halo */
        @keyframes lb-bulb-b {
          0%, 25%    { background: linear-gradient(155deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.65) 100%); box-shadow: 0 0 1px #000; }
          28%, 50%   { background: #fff; box-shadow: 0 0 10px 5px rgba(255,255,255,0.9), 0 0 22px 10px rgba(255,255,255,0.45); }
          52%, 55%   { background: linear-gradient(155deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.65) 100%); box-shadow: 0 0 1px #000; }
          57%, 69%   { background: #fff; box-shadow: 0 0 10px 5px rgba(255,255,255,0.9), 0 0 22px 10px rgba(255,255,255,0.45); }
          70%, 71%   { background: linear-gradient(155deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.65) 100%); box-shadow: 0 0 1px #000; }
          72%, 75%   { background: #fff; box-shadow: 0 0 10px 5px rgba(255,255,255,0.9), 0 0 22px 10px rgba(255,255,255,0.45); }
          77%, 100%  { background: linear-gradient(155deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.65) 100%); box-shadow: 0 0 1px #000; }
        }

        /* Inner-light BLUE — vivid electric blue, strong bloom */
        @keyframes lb-inner-b {
          0%, 25%    { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          28%, 50%   { opacity: 1; border-color: #5599ff; background: #2255ff; box-shadow: 0 0 16px 8px #0033ee, 0 0 28px 12px rgba(0,50,230,0.5), 0 0 5px 2px #aaccff inset; }
          52%, 55%   { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          57%, 69%   { opacity: 1; border-color: #5599ff; background: #2255ff; box-shadow: 0 0 16px 8px #0033ee, 0 0 28px 12px rgba(0,50,230,0.5), 0 0 5px 2px #aaccff inset; }
          70%, 71%   { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          72%, 75%   { opacity: 1; border-color: #5599ff; background: #2255ff; box-shadow: 0 0 16px 8px #0033ee, 0 0 28px 12px rgba(0,50,230,0.5), 0 0 5px 2px #aaccff inset; }
          77%, 100%  { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
        }

        /* Inner-light RED — vivid pure red, strong bloom */
        @keyframes lb-inner-r {
          0%, 25%    { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          28%, 50%   { opacity: 1; border-color: #ff5555; background: #ff1111; box-shadow: 0 0 16px 8px #cc0000, 0 0 28px 12px rgba(200,0,0,0.5), 0 0 5px 2px #ffaaaa inset; }
          52%, 55%   { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          57%, 69%   { opacity: 1; border-color: #ff5555; background: #ff1111; box-shadow: 0 0 16px 8px #cc0000, 0 0 28px 12px rgba(200,0,0,0.5), 0 0 5px 2px #ffaaaa inset; }
          70%, 71%   { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          72%, 75%   { opacity: 1; border-color: #ff5555; background: #ff1111; box-shadow: 0 0 16px 8px #cc0000, 0 0 28px 12px rgba(200,0,0,0.5), 0 0 5px 2px #ffaaaa inset; }
          77%, 100%  { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
        }
      `}</style>
    </div>
  );
}

export function AmbientPoliceGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Red — top-left of content area (offset past 240px sidebar) */}
      <div className="absolute ambient-red" style={{ top: -60, left: 200, width: 420, height: 420, borderRadius: "50%" }} />
      {/* Blue — top-right */}
      <div className="absolute ambient-blue" style={{ top: -60, right: -60, width: 420, height: 420, borderRadius: "50%" }} />
      <style>{`
        .ambient-red {
          background: radial-gradient(circle, rgba(255,10,10,0.32) 0%, rgba(255,30,30,0.14) 40%, transparent 70%);
          animation: ambientR 0.8s linear infinite;
          opacity: 0;
        }
        .ambient-blue {
          background: radial-gradient(circle, rgba(30,60,255,0.32) 0%, rgba(30,80,255,0.14) 40%, transparent 70%);
          animation: ambientB 0.8s linear infinite;
          animation-delay: 400ms;
          opacity: 0;
        }
        @keyframes ambientR {
          0%,25%   { opacity:0; }
          28%,50%  { opacity:1; }
          52%,55%  { opacity:0; }
          57%,69%  { opacity:1; }
          70%,71%  { opacity:0; }
          72%,75%  { opacity:1; }
          77%,100% { opacity:0; }
        }
        @keyframes ambientB {
          0%,25%   { opacity:0; }
          28%,50%  { opacity:1; }
          52%,55%  { opacity:0; }
          57%,69%  { opacity:1; }
          70%,71%  { opacity:0; }
          72%,75%  { opacity:1; }
          77%,100% { opacity:0; }
        }
      `}</style>
    </div>
  );
}
