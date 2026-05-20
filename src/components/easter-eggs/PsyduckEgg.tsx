"use client";

import { useState, useEffect, useRef } from "react";

const SPRITE = "https://play.pokemonshowdown.com/sprites/ani/psyduck.gif";
type Phase = "idle" | "running" | "returning";

// Using @keyframes for run/return (not CSS transitions) because changing both
// `transition` and `transform` in the same React render is unreliable — the browser
// can silently skip the animation. Keyframes define explicit from/to so they
// always fire regardless of previous computed value.

const POOF_STARS = [
  { tx: "-28px", ty: "-34px", rot: "-50deg", delay: 0,  size: 13 },
  { tx:  "26px", ty: "-30px", rot:  "55deg", delay: 15, size: 11 },
  { tx: "-32px", ty:   "6px", rot: "-25deg", delay: 30, size: 10 },
  { tx:  "28px", ty:   "8px", rot:  "40deg", delay: 10, size: 12 },
  { tx:   "2px", ty: "-40px", rot: "-10deg", delay: 20, size: 10 },
];

export default function PsyduckEgg() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showPoof, setShowPoof] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  const handleClick = () => {
    if (phase !== "idle") return;
    setShowPoof(true);
    setPhase("running");
    after(() => setShowPoof(false), 600);
    after(() => setPhase("returning"), 2600); // 600ms run + 2000ms off-screen pause
    after(() => setPhase("idle"),      3400); // + 800ms slide back
  };

  useEffect(() => () => clear(), []);

  const outerAnimation =
    phase === "running"   ? "pdRun    600ms ease-in  forwards" :
    phase === "returning" ? "pdReturn 800ms ease-out forwards" :
    "none";

  // Stars show while confused (idle + stumbling back), hidden while panicking
  const showStars = phase !== "running";

  return (
    <>
      <style>{`
        @keyframes pdHeadTap {
          0%, 100% { transform: rotate(-5deg); }
          50%       { transform: rotate(5deg); }
        }
        @keyframes pdRun {
          from { transform: translateX(0px); }
          to   { transform: translateX(240px); }
        }
        @keyframes pdReturn {
          from { transform: translateX(240px); }
          to   { transform: translateX(0px); }
        }
        @keyframes pdPoofText {
          0%   { transform: scale(0.4) translateY(4px);  opacity: 1; }
          55%  { transform: scale(1.2) translateY(-5px); opacity: 1; }
          100% { transform: scale(1.0) translateY(-14px); opacity: 0; }
        }
        @keyframes pdPoofStar {
          0%   { transform: translate(0,0) scale(0.3) rotate(0deg);            opacity: 1; }
          100% { transform: translate(var(--tx),var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 0; }
        }
        /* Elliptical orbit: rx=36px, ry=14px — wide & flat = tilted ring perspective.
           Scale + opacity simulate near (front, y>0) vs far (back, y<0) depth. */
        @keyframes pdOrbit1 {
          0%   { transform: translate( 36px,   0px) scale(1.0);  opacity: 0.85; }
          25%  { transform: translate(  0px, -14px) scale(0.7);  opacity: 0.4;  }
          50%  { transform: translate(-36px,   0px) scale(1.0);  opacity: 0.85; }
          75%  { transform: translate(  0px,  14px) scale(1.25); opacity: 1.0;  }
          100% { transform: translate( 36px,   0px) scale(1.0);  opacity: 0.85; }
        }
        @keyframes pdOrbit2 {
          0%   { transform: translate(-18px, -12px) scale(0.7);  opacity: 0.4;  }
          25%  { transform: translate(-31px,   7px) scale(1.1);  opacity: 0.85; }
          50%  { transform: translate( 18px,  12px) scale(1.25); opacity: 1.0;  }
          75%  { transform: translate( 31px,  -7px) scale(1.0);  opacity: 0.85; }
          100% { transform: translate(-18px, -12px) scale(0.7);  opacity: 0.4;  }
        }
        @keyframes pdOrbit3 {
          0%   { transform: translate(-18px,  12px) scale(1.25); opacity: 1.0;  }
          25%  { transform: translate( 31px,   7px) scale(1.0);  opacity: 0.85; }
          50%  { transform: translate( 18px, -12px) scale(0.7);  opacity: 0.4;  }
          75%  { transform: translate(-31px,  -7px) scale(0.85); opacity: 0.65; }
          100% { transform: translate(-18px,  12px) scale(1.25); opacity: 1.0;  }
        }
      `}</style>

      <div style={{
        position: "relative",
        width: "100%",
        height: "200px",
        overflow: "hidden",
        background: "transparent",
        pointerEvents: "none",
      }}>

        {/* Poof smoke — anchored to Psyduck's starting position, stays while duck bolts */}
        {showPoof && (
          <div style={{
            position: "absolute",
            right: "71px",  // right:36px + half of 70px = 71px
            bottom: "43px", // bottom:8px  + half of 70px = 43px
            width: 0,
            height: 0,
            pointerEvents: "none",
            zIndex: 10,
          }}>
            {/* POOF! text pop */}
            <div style={{
              position: "absolute",
              marginLeft: "-22px",
              marginTop: "-8px",
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "11px",
              color: "#facc15",
              whiteSpace: "nowrap",
              textShadow: "0 0 8px rgba(250,204,21,0.9), 1px 1px 0 rgba(0,0,0,0.5)",
              animation: "pdPoofText 380ms ease-out forwards",
              userSelect: "none",
              pointerEvents: "none",
            }}>POOF!</div>
            {/* Stars shooting outward */}
            {POOF_STARS.map((p, i) => (
              <div key={i} style={{
                position: "absolute",
                "--tx": p.tx,
                "--ty": p.ty,
                "--rot": p.rot,
                fontSize: `${p.size}px`,
                lineHeight: "1",
                color: "#facc15",
                textShadow: "0 0 6px rgba(250,204,21,0.8)",
                animation: "pdPoofStar 440ms ease-out forwards",
                animationDelay: `${p.delay}ms`,
                marginLeft: `${-p.size / 2}px`,
                marginTop:  `${-p.size / 2}px`,
                userSelect: "none",
              } as React.CSSProperties}>✦</div>
            ))}
          </div>
        )}

        {/* Outer — drives horizontal position via keyframe animation */}
        <div
          style={{
            position: "absolute",
            right: "36px",
            bottom: "8px",
            animation: outerAnimation,
            pointerEvents: phase === "idle" ? "auto" : "none",
            cursor: phase === "idle" ? "pointer" : "default",
          }}
          onClick={handleClick}
        >
          {/* Confused orbiting stars — visible when idle or stumbling back */}
          {showStars && (
            <div style={{
              position: "absolute",
              top: "15px",
              left: "35px",
              width: 0,
              height: 0,
              pointerEvents: "none",
            }}>
              {(["pdOrbit1", "pdOrbit2", "pdOrbit3"] as const).map((anim, i) => (
                <div key={i} style={{
                  position: "absolute",
                  animation: `${anim} 1.4s linear infinite`,
                  fontSize: "9px",
                  lineHeight: "1",
                  marginLeft: "-4px",
                  marginTop: "-4px",
                  color: "#facc15",
                  userSelect: "none",
                }}>
                  ✦
                </div>
              ))}
            </div>
          )}

          {/* Inner — facing direction, flips instantly on phase change */}
          <div style={{
            display: "inline-block",
            transform: phase === "running" ? "scaleX(1)" : "scaleX(-1)",
          }}>
            {/* Sway — idle head-tap rocking animation */}
            <div style={{
              display: "inline-block",
              transformOrigin: "center bottom",
              animation: phase === "idle" ? "pdHeadTap 0.8s ease-in-out infinite" : "none",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SPRITE}
                alt="Psyduck"
                width={70}
                style={{ imageRendering: "pixelated", display: "block" }}
              />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
