"use client";

import { useState, useEffect, useRef } from "react";

const SPRITE      = "https://play.pokemonshowdown.com/sprites/ani/gengar.gif";
const GENGAR_SIZE = 120;

type Phase = "idle" | "emerging" | "hiding";

function getStyle(phase: Phase): { scaleVal: number; opacity: number; filter: string } {
  switch (phase) {
    case "idle":
    case "hiding":
      return {
        scaleVal: 0.30,
        opacity:  0.82,
        filter:   "brightness(0.06) drop-shadow(0 0 7px rgba(175,90,255,0.95)) drop-shadow(0 0 16px rgba(130,45,230,0.75))",
      };
    case "emerging":
      return {
        scaleVal: 1.0,
        opacity:  1,
        filter:   "brightness(1)",
      };
  }
}

function getTransition(phase: Phase): string {
  switch (phase) {
    case "emerging": return "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 550ms ease-out, filter 550ms ease-out";
    case "hiding":   return "transform 500ms ease-in, opacity 400ms ease-in, filter 400ms ease-in";
    default:         return "none";
  }
}

export default function GengarCave() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  const handleEnter = () => {
    clear();
    setPhase("emerging");
  };

  const handleLeave = () => {
    clear();
    setPhase("hiding");
    after(() => setPhase("idle"), 500);
  };

  useEffect(() => () => clear(), []);

  const isResting = phase === "idle" || phase === "hiding";
  const { scaleVal, opacity, filter } = getStyle(phase);

  return (
    <>
      <style>{`
        @keyframes ggEyeGlow {
          0%, 100% { filter: brightness(0.05) drop-shadow(0 0 5px rgba(175,90,255,0.80)) drop-shadow(0 0 12px rgba(130,45,230,0.60)); }
          50%       { filter: brightness(0.08) drop-shadow(0 0 11px rgba(175,90,255,1))   drop-shadow(0 0 24px rgba(130,45,230,0.90)); }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "320px",
          overflow: "hidden",
          background: "transparent",
          pointerEvents: "auto",
          cursor: "default",
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {/* Gengar — scales forward from cave depth
            In idle/hiding: ggEyeGlow animation drives filter (overrides inline filter)
                            so the purple glow pulses and looks like glowing eyes at
                            whatever scale Gengar is currently at.
            In all other phases: inline filter + transition takes over. */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: `calc(50% - ${GENGAR_SIZE / 2}px)`,
            width: `${GENGAR_SIZE}px`,
            transformOrigin: "center bottom",
            transform: `scale(${scaleVal})`,
            opacity,
            filter:    isResting ? undefined : filter,
            animation: isResting ? "ggEyeGlow 2s ease-in-out infinite" : "none",
            transition: getTransition(phase),
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SPRITE}
            alt="Gengar"
            width={GENGAR_SIZE}
            style={{ imageRendering: "pixelated", display: "block" }}
          />
        </div>

        {/* Name — pops in after Gengar finishes emerging, scale-bounces like Bellsprout tooltip */}
        <div style={{
          position: "absolute",
          bottom: `${60 + GENGAR_SIZE + 10}px`,
          left: "50%",
          transform: phase === "emerging"
            ? "translateX(-50%) scale(1)"
            : "translateX(-50%) scale(0)",
          transition: phase === "emerging"
            ? "transform 280ms cubic-bezier(0.34,1.56,0.64,1) 640ms"
            : "transform 120ms ease-in",
          transformOrigin: "center bottom",
          background: "#0a0a1a",
          border: "2px solid rgba(175,90,255,0.85)",
          borderRadius: "20px",
          padding: "6px 14px",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "8px",
          color: "#bf7fff",
          letterSpacing: "1px",
          whiteSpace: "nowrap",
          boxShadow: "0 0 14px rgba(160,80,255,0.45)",
          pointerEvents: "none",
          zIndex: 3,
        }}>
          Gengar!
        </div>
      </div>
    </>
  );
}
