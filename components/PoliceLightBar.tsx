"use client";

const DURATION = "900ms";

export function PoliceLightBar({ className = "" }: { className?: string }) {
  return (
    <div className={`lb-wrap ${className}`} aria-hidden>
      <div className="lb-bar">
        {[0, 1, 2, 3, 4, 5].map(i => {
          const isBlue = i % 2 === 0;
          return (
            <div key={i} className={`lb-unit ${isBlue ? "lb-unit-b" : "lb-unit-r"}`}>
              {/* Colored fill layer */}
              <div className={`lb-fill ${isBlue ? "lb-fill-b" : "lb-fill-r"}`} />
              {/* Decorative bulb dots */}
              {[0,1,2,3,4,5].map(j => (
                <span key={j} className={`lb-dot ${isBlue ? "lb-dot-b" : "lb-dot-r"}`} />
              ))}
            </div>
          );
        })}
      </div>

      <style>{`
        .lb-wrap {
          width: 100%;
          overflow: hidden;
          border-radius: 3px;
        }

        .lb-bar {
          display: flex;
          align-items: center;
          gap: 2px;
          width: 100%;
          padding: 3px 2px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.25) 100%);
        }

        .lb-unit {
          position: relative;
          flex: 1;
          height: 14px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          padding: 0 3px;
          background-color: #080810;
          border: 1px solid #111118;
          overflow: hidden;
        }

        /* Animated colored fill */
        .lb-fill {
          position: absolute;
          inset: 0;
          border-radius: 2px;
          opacity: 0;
          animation-duration: ${DURATION};
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .lb-fill-b {
          background: #1a44ff;
          box-shadow: 0 0 10px 4px #0028dd, 0 0 3px 1px #88aaff inset;
          animation-name: lb-flash;
        }

        .lb-fill-r {
          background: #ff1111;
          box-shadow: 0 0 10px 4px #cc0000, 0 0 3px 1px #ff9999 inset;
          animation-name: lb-flash;
          animation-delay: calc(${DURATION} / 2);
        }

        /* Decorative LED dots */
        .lb-dot {
          display: block;
          position: relative;
          z-index: 2;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          flex-shrink: 0;
          animation-duration: ${DURATION};
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .lb-dot-b {
          background: #2244aa;
          animation-name: lb-dot-flash-b;
        }

        .lb-dot-r {
          background: #aa1111;
          animation-name: lb-dot-flash-r;
          animation-delay: calc(${DURATION} / 2);
        }

        /* Main flash — triple burst pattern */
        @keyframes lb-flash {
          0%,  24%  { opacity: 0; }
          27%, 48%  { opacity: 1; }
          51%, 54%  { opacity: 0; }
          56%, 68%  { opacity: 1; }
          70%, 71%  { opacity: 0; }
          73%, 76%  { opacity: 1; }
          78%, 100% { opacity: 0; }
        }

        /* Dots brighten to near-white when their unit fires */
        @keyframes lb-dot-flash-b {
          0%,  24%  { background: #1a2a66; box-shadow: none; }
          27%, 48%  { background: #aaccff; box-shadow: 0 0 4px 2px rgba(100,160,255,0.8); }
          51%, 54%  { background: #1a2a66; box-shadow: none; }
          56%, 68%  { background: #aaccff; box-shadow: 0 0 4px 2px rgba(100,160,255,0.8); }
          70%, 71%  { background: #1a2a66; box-shadow: none; }
          73%, 76%  { background: #aaccff; box-shadow: 0 0 4px 2px rgba(100,160,255,0.8); }
          78%, 100% { background: #1a2a66; box-shadow: none; }
        }

        @keyframes lb-dot-flash-r {
          0%,  24%  { background: #661111; box-shadow: none; }
          27%, 48%  { background: #ffaaaa; box-shadow: 0 0 4px 2px rgba(255,100,100,0.8); }
          51%, 54%  { background: #661111; box-shadow: none; }
          56%, 68%  { background: #ffaaaa; box-shadow: 0 0 4px 2px rgba(255,100,100,0.8); }
          70%, 71%  { background: #661111; box-shadow: none; }
          73%, 76%  { background: #ffaaaa; box-shadow: 0 0 4px 2px rgba(255,100,100,0.8); }
          78%, 100% { background: #661111; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}

export function AmbientPoliceGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute ambient-red" style={{ top: -120, left: 160, width: 600, height: 600, borderRadius: "50%" }} />
      <div className="absolute ambient-blue" style={{ top: -120, right: -80, width: 600, height: 600, borderRadius: "50%" }} />
      <style>{`
        .ambient-red {
          background: radial-gradient(circle, rgba(220,30,30,0.10) 0%, rgba(200,20,20,0.05) 45%, transparent 70%);
          animation: ambientFlash 0.9s linear infinite;
          opacity: 0;
          filter: blur(24px);
        }
        .ambient-blue {
          background: radial-gradient(circle, rgba(20,50,220,0.10) 0%, rgba(20,40,200,0.05) 45%, transparent 70%);
          animation: ambientFlash 0.9s linear infinite;
          animation-delay: 450ms;
          opacity: 0;
          filter: blur(24px);
        }
        @keyframes ambientFlash {
          0%,  24%  { opacity: 0; }
          27%, 48%  { opacity: 1; }
          51%, 54%  { opacity: 0; }
          56%, 68%  { opacity: 1; }
          70%, 71%  { opacity: 0; }
          73%, 76%  { opacity: 1; }
          78%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
