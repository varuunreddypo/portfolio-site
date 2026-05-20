"use client";

import { useState, useEffect, useRef } from "react";

const SPRITE = "https://play.pokemonshowdown.com/sprites/ani/bellsprout.gif";
type Phase = "idle" | "rising" | "visible" | "falling";

export default function BellsproutBush() {
  const [phase, setPhase] = useState<Phase>("idle");
  const riseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (riseTimer.current) clearTimeout(riseTimer.current);
    setPhase("rising");
    riseTimer.current = setTimeout(() => setPhase("visible"), 400);
  };

  const handleLeave = () => {
    if (riseTimer.current) clearTimeout(riseTimer.current);
    setPhase("falling");
    riseTimer.current = setTimeout(() => setPhase("idle"), 400);
  };

  useEffect(() => () => {
    if (riseTimer.current) clearTimeout(riseTimer.current);
  }, []);

  const hiding = phase === "idle" || phase === "falling";

  return (
    <>
      <style>{`
        @keyframes bsBushSway {
          0%, 100% { transform: translateX(-50%) rotate(-2deg); }
          50%       { transform: translateX(-50%) rotate(2deg); }
        }
      `}</style>

      <div style={{
        position: "relative",
        width: "100%",
        height: "320px",
        overflow: "hidden",
        background: "transparent",
        pointerEvents: "none",
      }}>

        {/* ── Bellsprout (behind bush) ── */}
        <div style={{
          position: "absolute",
          bottom: "60px",
          left: "50%",
          transform: hiding ? "translateX(-50%) translateY(260px)" : "translateX(-50%) translateY(0px)",
          zIndex: 2,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "transform 400ms ease-in-out",
        }}>
          {/* Tooltip */}
          <div style={{
            marginBottom: "8px",
            background: "#0a0a1a",
            border: "2px solid #00ff88",
            borderRadius: "20px",
            padding: "6px 14px",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "8px",
            color: "#00ff88",
            whiteSpace: "nowrap",
            boxShadow: "0 0 14px rgba(0,255,136,0.35)",
            transform: phase === "visible" ? "scale(1)" : "scale(0)",
            transition: phase === "visible"
              ? "transform 300ms cubic-bezier(0.34,1.56,0.64,1) 180ms"
              : "transform 100ms ease-in",
            transformOrigin: "center bottom",
          }}>
            Bellsprout!
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SPRITE} alt="Bellsprout" width={80} style={{ imageRendering: "pixelated", display: "block" }} />
        </div>

        {/* ── Bush image (in front of Bellsprout) ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bush.png"
          alt="bush"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: "130px",
            transform: "translateX(-50%)",
            transformOrigin: "center bottom",
            animation: phase === "idle" ? "bsBushSway 3.4s ease-in-out infinite" : "none",
            cursor: "pointer",
            zIndex: 3,
            pointerEvents: "all",
            userSelect: "none",
            draggable: false,
          } as React.CSSProperties}
        />
      </div>
    </>
  );
}
