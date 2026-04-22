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
        }

        .lb-unit {
          position: relative;
          flex: 1;
          height: 11px;
          padding: 1px 3px;
          background-color: #111118;
          border-top: 1px solid #0a0a12;
          border-bottom: 1px solid #222;
          border-left: 1px solid #0a0a12;
          border-right: 1px solid #222;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation-duration: ${DURATION};
          animation-iteration-count: infinite;
          overflow: hidden;
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

        /* Bulb flash (shared) — white light on/off */
        @keyframes lb-bulb-b {
          0%, 25%    { background: linear-gradient(155deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.12) 25%, rgba(255,255,255,0.16) 49%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.75) 100%); box-shadow: 0 0 2px #111; }
          28%, 50%   { background: #fff; box-shadow: 0 0 7px 3px #fff; }
          52%, 55%   { background: linear-gradient(155deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.12) 25%, rgba(255,255,255,0.16) 49%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.75) 100%); box-shadow: 0 0 2px #111; }
          57%, 69%   { background: #fff; box-shadow: 0 0 7px 3px #fff; }
          70%, 71%   { background: linear-gradient(155deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.12) 25%, rgba(255,255,255,0.16) 49%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.75) 100%); box-shadow: 0 0 2px #111; }
          72%, 75%   { background: #fff; box-shadow: 0 0 7px 3px #fff; }
          77%, 100%  { background: linear-gradient(155deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.12) 25%, rgba(255,255,255,0.16) 49%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.75) 100%); box-shadow: 0 0 2px #111; }
        }

        /* Inner-light BLUE glow — deep electric blue */
        @keyframes lb-inner-b {
          0%, 25%    { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          28%, 50%   { opacity: 1; border-color: #2255ff; background: rgba(20,60,255,0.65); box-shadow: 0 0 22px 8px #0022ff, 0 0 6px 2px #0044ff inset; }
          52%, 55%   { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          57%, 69%   { opacity: 1; border-color: #2255ff; background: rgba(20,60,255,0.65); box-shadow: 0 0 22px 8px #0022ff, 0 0 6px 2px #0044ff inset; }
          70%, 71%   { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          72%, 75%   { opacity: 1; border-color: #2255ff; background: rgba(20,60,255,0.65); box-shadow: 0 0 22px 8px #0022ff, 0 0 6px 2px #0044ff inset; }
          77%, 100%  { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
        }

        /* Inner-light RED glow — pure saturated red */
        @keyframes lb-inner-r {
          0%, 25%    { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          28%, 50%   { opacity: 1; border-color: #ff1010; background: rgba(255,10,10,0.65); box-shadow: 0 0 22px 8px #cc0000, 0 0 6px 2px #ff2020 inset; }
          52%, 55%   { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          57%, 69%   { opacity: 1; border-color: #ff1010; background: rgba(255,10,10,0.65); box-shadow: 0 0 22px 8px #cc0000, 0 0 6px 2px #ff2020 inset; }
          70%, 71%   { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
          72%, 75%   { opacity: 1; border-color: #ff1010; background: rgba(255,10,10,0.65); box-shadow: 0 0 22px 8px #cc0000, 0 0 6px 2px #ff2020 inset; }
          77%, 100%  { opacity: 0; background: transparent; box-shadow: none; border-color: transparent; }
        }
      `}</style>
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
          background: radial-gradient(circle, rgba(255,10,10,0.18) 0%, transparent 65%);
          animation: ambientR 0.8s linear infinite;
        }
        .ambient-blue {
          background: radial-gradient(circle, rgba(20,60,255,0.18) 0%, transparent 65%);
          animation: ambientB 0.8s linear infinite;
          animation-delay: 400ms;
        }
        @keyframes ambientR {
          0%,25%   { opacity:0; }
          28%,50%  { opacity:1; }
          52%,55%  { opacity:0; }
          57%,69%  { opacity:1; }
          70%,77%  { opacity:0; }
          72%,75%  { opacity:1; }
          77%,100% { opacity:0; }
        }
        @keyframes ambientB {
          0%,25%   { opacity:0; }
          28%,50%  { opacity:1; }
          52%,55%  { opacity:0; }
          57%,69%  { opacity:1; }
          70%,77%  { opacity:0; }
          72%,75%  { opacity:1; }
          77%,100% { opacity:0; }
        }
      `}</style>
    </div>
  );
}
