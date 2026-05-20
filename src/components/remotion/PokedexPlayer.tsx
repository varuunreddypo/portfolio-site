"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Player } from "@remotion/player";
import { PokedexBoot } from "@/remotion/PokedexBoot";

const FRAMES  = 360;
const FPS     = 30;
const COMP_W  = 960;
const COMP_H  = 560;

function calcDims() {
  const maxW = Math.min(window.innerWidth  - 48, COMP_W);
  const maxH = window.innerHeight - 120; // room for header + hint
  const byW  = { w: maxW, h: Math.round(maxW * COMP_H / COMP_W) };
  if (byW.h <= maxH) return byW;
  return { w: Math.round(maxH * COMP_W / COMP_H), h: maxH };
}

export default function PokedexPlayer() {
  const [open, setOpen] = useState(false);
  const [dims, setDims] = useState({ w: COMP_W, h: COMP_H });

  const close = useCallback(() => setOpen(false), []);

  // Recompute player pixel size whenever the modal opens or window resizes
  useEffect(() => {
    if (!open) return;
    const update = () => setDims(calcDims());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Freeze body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="hero-cta"
        style={{
          fontFamily: '"Press Start 2P",monospace',
          fontSize: "9px",
          padding: "13px 22px",
          background: "transparent",
          color: "#ffcc00",
          border: "2px solid rgba(255,204,0,.4)",
          borderRadius: "3px",
          letterSpacing: "1px",
          cursor: "pointer",
          transition: "border-color .15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ffcc00")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,204,0,.4)")}
      >
        ▶ WATCH REEL
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(9,9,26,0.94)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            zIndex: 9000,
            padding: "24px",
          }}
        >
          {/* Header */}
          <div style={{
            width: dims.w,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{
              fontFamily: '"Press Start 2P",monospace',
              fontSize: "8px",
              color: "#ffcc00",
              letterSpacing: "3px",
              opacity: 0.75,
            }}>
              POKÉDEX — INTRO REEL
            </span>
            <button
              onClick={close}
              style={{
                fontFamily: '"Press Start 2P",monospace',
                fontSize: "8px",
                color: "rgba(255,255,255,.4)",
                background: "none",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: "3px",
                cursor: "pointer",
                padding: "5px 10px",
                letterSpacing: "1px",
                transition: "color .15s, border-color .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,.4)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
              }}
            >
              ✕ CLOSE
            </button>
          </div>

          {/* Player — explicit px dimensions so Remotion renders correctly */}
          <div style={{
            width: dims.w,
            height: dims.h,
            border: "1px solid rgba(255,204,0,.2)",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 0 80px rgba(255,204,0,.06)",
            flexShrink: 0,
          }}>
            <Player
              component={PokedexBoot}
              durationInFrames={FRAMES}
              fps={FPS}
              compositionWidth={COMP_W}
              compositionHeight={COMP_H}
              controls
              autoPlay
              loop
              style={{ width: dims.w, height: dims.h }}
            />
          </div>

          {/* Hint */}
          <div style={{
            fontFamily: '"Space Mono",monospace',
            fontSize: "9px",
            color: "rgba(255,255,255,.2)",
            letterSpacing: "1px",
          }}>
            ESC or click outside to close
          </div>
        </div>
      )}
    </>
  );
}
