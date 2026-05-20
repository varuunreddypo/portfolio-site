"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ── assets ──────────────────────────────────────────────────────────────────
const SPRITE   = "https://play.pokemonshowdown.com/sprites/ani/charizard.gif";
const POKEBALL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

// ── constants ────────────────────────────────────────────────────────────────
const CHAR_W      = 130;
const CHAR_H      = 130;
const BALL_SIZE   = 28;
const SPEED       = 0.9;   // px per RAF frame
const CHAR_BOTTOM = 28;   // px from container bottom (8 base + 20 up)

// ── types ────────────────────────────────────────────────────────────────────
type Phase = "idle" | "throw1" | "shake" | "throw2" | "glow" | "caught";

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ── component ────────────────────────────────────────────────────────────────
export default function CharizardEgg() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted,       setMounted]       = useState(false);
  const [hovered,       setHovered]       = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const [phase,    setPhase]    = useState<Phase>("idle");
  const [charX,    setCharX]    = useState(0);
  const [dir,      setDir]      = useState(1);   // 1 = right, -1 = left
  const [ball,      setBall]     = useState({ x: 0, y: 0, rot: 0, show: false });
  const [shardPos,  setShardPos] = useState<{ x: number; y: number } | null>(null);
  const [caughtPos,   setCaughtPos]   = useState<{ x: number; top: number } | null>(null);
  const [ballResting, setBallResting] = useState<number | null>(null);

  const phaseRef   = useRef<Phase>("idle");
  const charXRef   = useRef(0);
  const dirRef     = useRef(1);
  const attemptRef = useRef(0);
  const maxXRef    = useRef(0);
  const walkRaf    = useRef<number | null>(null);
  const throwRaf   = useRef<number | null>(null);

  // ── client mount (needed for portal) ─────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── measure container width via ResizeObserver ────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setContainerWidth(w);
      maxXRef.current = Math.max(0, w - CHAR_W);
      if (charXRef.current > maxXRef.current) {
        charXRef.current = maxXRef.current;
        setCharX(maxXRef.current);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── visibility: show only while container is on screen ───────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── walking RAF loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || containerWidth === 0) return;
    let alive = true;

    function walk() {
      if (!alive) return;
      if (phaseRef.current === "idle") {
        let nx = charXRef.current + dirRef.current * SPEED;
        let nd = dirRef.current;
        const maxX = maxXRef.current;
        if (nx >= maxX) { nx = maxX; nd = -1; }
        if (nx <= 0)    { nx = 0;    nd =  1; }
        charXRef.current = nx;
        dirRef.current   = nd;
        setCharX(nx);
        setDir(nd);
      }
      walkRaf.current = requestAnimationFrame(walk);
    }
    walkRaf.current = requestAnimationFrame(walk);
    return () => {
      alive = false;
      if (walkRaf.current) cancelAnimationFrame(walkRaf.current);
    };
  }, [visible, containerWidth]);

  // ── click → throw ─────────────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (phaseRef.current !== "idle") return;

    const isSecond = attemptRef.current === 1;
    const newPhase: Phase = isSecond ? "throw2" : "throw1";
    phaseRef.current = newPhase;
    setPhase(newPhase);

    // Convert Charizard's container-relative position to viewport coords
    const rect   = containerRef.current?.getBoundingClientRect();
    const startX = window.innerWidth - 72;
    const startY = window.innerHeight * 0.22;
    const endX   = rect ? rect.left + charXRef.current + CHAR_W / 2 - BALL_SIZE / 2 : startX;
    const endY   = rect ? rect.bottom - CHAR_BOTTOM - CHAR_H / 2 - BALL_SIZE / 2    : startY;
    const startTime = performance.now();
    const duration  = 750;

    setBall({ x: startX, y: startY, rot: 0, show: true });
    if (throwRaf.current) cancelAnimationFrame(throwRaf.current);

    function animateBall(now: number) {
      const t    = Math.min((now - startTime) / duration, 1);
      const ease = easeInOut(t);
      const x    = startX + (endX - startX) * ease;
      const arc  = 170 * Math.sin(Math.PI * t);
      const y    = startY + (endY - startY) * ease - arc;
      const rot  = t * 720;
      setBall({ x, y, rot, show: true });

      if (t < 1) {
        throwRaf.current = requestAnimationFrame(animateBall);
        return;
      }

      setBall(b => ({ ...b, show: false }));

      if (!isSecond) {
        // ── first throw: shards + shake, then escape ──────────────────────
        setShardPos({ x: endX, y: endY });
        phaseRef.current = "shake";
        setPhase("shake");
        setTimeout(() => setShardPos(null), 700);
        setTimeout(() => {
          phaseRef.current = "idle";
          setPhase("idle");
          attemptRef.current = 1;
        }, 2100);
      } else {
        // ── second throw: glow → caught ───────────────────────────────────
        phaseRef.current = "glow";
        setPhase("glow");
        setTimeout(() => {
          phaseRef.current = "caught";
          setPhase("caught");
          setBallResting(charXRef.current + CHAR_W / 2 - BALL_SIZE / 2);
          const cRect = containerRef.current?.getBoundingClientRect();
          if (cRect) {
            setCaughtPos({
              x: cRect.left + window.scrollX + charXRef.current + CHAR_W / 2,
              // anchor just above the resting ball: container bottom → up by ball bottom gap + ball height + tooltip gap
              top: cRect.bottom + window.scrollY - CHAR_BOTTOM - BALL_SIZE - 38,
            });
          }
          // no reset — Charizard stays caught
        }, 1600);
      }
    }
    throwRaf.current = requestAnimationFrame(animateBall);
  }, []);

  return (
    <>
      <style>{`
        @keyframes czShake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-10px); }
          35%     { transform: translateX(10px); }
          55%     { transform: translateX(-7px); }
          75%     { transform: translateX(7px); }
          90%     { transform: translateX(-3px); }
        }
        @keyframes czGlow {
          0%   { filter: brightness(1); }
          20%  { filter: brightness(6) saturate(0.1) drop-shadow(0 0 14px #ff4400); }
          50%  { filter: brightness(3) drop-shadow(0 0 28px #ffcc00); }
          80%  { filter: brightness(5) saturate(0) drop-shadow(0 0 10px #fff); }
          100% { filter: brightness(0); }
        }
        @keyframes czShard1 { 0%{transform:translate(0,0) rotate(0);opacity:1}  100%{transform:translate(-32px,-46px) rotate(140deg);opacity:0} }
        @keyframes czShard2 { 0%{transform:translate(0,0) rotate(0);opacity:1}  100%{transform:translate(30px,-42px)  rotate(-120deg);opacity:0} }
        @keyframes czShard3 { 0%{transform:translate(0,0) rotate(0);opacity:1}  100%{transform:translate(4px,52px)    rotate(200deg);opacity:0} }
        @keyframes czHoverIn {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes czTooltip {
          0%   { opacity:0; transform:translateX(-50%) translateY(14px); }
          12%  { opacity:1; transform:translateX(-50%) translateY(0); }
          78%  { opacity:1; transform:translateX(-50%) translateY(0); }
          100% { opacity:0; transform:translateX(-50%) translateY(-10px); }
        }
      `}</style>

      {/* ── Charizard — relative container, fills parent div ── */}
      <div
        ref={containerRef}
        style={{ position: "relative", width: "100%", height: "100%", overflow: "visible", background: "transparent" }}
      >
        {ballResting !== null && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={POKEBALL}
            alt="Pokéball"
            width={BALL_SIZE}
            height={BALL_SIZE}
            style={{
              position: "absolute",
              left: ballResting,
              bottom: CHAR_BOTTOM,
              imageRendering: "pixelated",
              pointerEvents: "none",
            }}
          />
        )}
        {hovered && phase === "idle" && (
          <div style={{
            position: "absolute",
            left: charX + CHAR_W / 2,
            bottom: CHAR_BOTTOM + CHAR_H - 20,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            animation: "czHoverIn 0.18s ease forwards",
            background: "rgba(10,10,26,0.82)",
            border: "1px solid rgba(255,204,0,0.25)",
            padding: "4px 9px",
            borderRadius: "3px",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "6px",
            color: "rgba(255,204,0,0.65)",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}>
            Catch me!
          </div>
        )}
        {phase !== "caught" && containerWidth > 0 && (
          <div
            style={{
              position: "absolute",
              left: charX,
              bottom: CHAR_BOTTOM,
              width: CHAR_W,
              height: CHAR_H,
              // sprite faces left by default; flip when moving right so it faces its direction
              transform: `scaleX(${-dir})`,
              transformOrigin: "center bottom",
              pointerEvents: phase === "idle" ? "all" : "none",
              cursor: phase === "idle" ? "pointer" : "default",
            }}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* inner wrapper carries shake so the direction scaleX is undisturbed */}
            <div style={{
              width: "100%",
              height: "100%",
              animation: phase === "shake" ? "czShake 0.22s ease-in-out 6 both"
                       : phase === "glow"  ? "czGlow 1.6s ease forwards"
                       : "none",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SPRITE}
                alt="Charizard"
                width={CHAR_W}
                height={CHAR_H}
                style={{ imageRendering: "pixelated", display: "block" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Ball + shards: viewport-fixed portal (escapes ancestor transforms) ── */}
      {mounted && createPortal(
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100 }}>
          {ball.show && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={POKEBALL}
              alt=""
              width={BALL_SIZE}
              height={BALL_SIZE}
              style={{
                position: "fixed",
                left: ball.x,
                top: ball.y,
                transform: `rotate(${ball.rot}deg)`,
                imageRendering: "pixelated",
                pointerEvents: "none",
              }}
            />
          )}
          {shardPos && [1, 2, 3].map(i => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={POKEBALL}
              alt=""
              width={12}
              height={12}
              style={{
                position: "fixed",
                left: shardPos.x + BALL_SIZE / 2 - 6,
                top:  shardPos.y + BALL_SIZE / 2 - 6,
                imageRendering: "pixelated",
                pointerEvents: "none",
                animation: `czShard${i} 0.65s ease-out forwards`,
              }}
            />
          ))}
        </div>,
        document.body
      )}

      {/* ── Tooltip: page-absolute portal so it scrolls with the content ── */}
      {mounted && phase === "caught" && caughtPos && createPortal(
        <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, overflow: "visible", pointerEvents: "none", zIndex: 100 }}>
          <div style={{
            position: "absolute",
            left: caughtPos.x,
            top: caughtPos.top,
            transform: "translateX(-50%)",
            animation: "czTooltip 3.3s ease forwards",
            background: "#0a0a1a",
            border: "2px solid #ffcc00",
            padding: "8px 14px",
            borderRadius: "4px",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "7px",
            color: "#ffcc00",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 0 18px rgba(255,204,0,0.35)",
          }}>
            Gotcha! Charizard was caught!
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
