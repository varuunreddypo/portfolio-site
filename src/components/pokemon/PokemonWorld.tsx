"use client";

import { useState, useEffect, useRef } from "react";

const SPR = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

// Singleton AudioContext — reused across all Pokemon cries to avoid orphaned contexts
let sharedAudioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
    sharedAudioCtx = new AudioContext();
  }
  return sharedAudioCtx;
}

const TC: Record<string, string> = {
  grass: "#3d9a3d", fire: "#d4501a", water: "#2e6db0",
  electric: "#c9a200", normal: "#8a7858", poison: "#8a30a0",
};

type Mon = { id: number; name: string; types: string[]; pal: string[] };

const MONS: Mon[] = [
  // row 1
  { id: 25,  name: "Pikachu",    types: ["electric"],pal: ["#c09800","#e0b800","#a07800","#806000","#504020"] },
  { id: 133, name: "Eevee",      types: ["normal"],  pal: ["#8a7050","#aa9068","#c8aa88","#6a5030","#483018"] },
  { id: 155, name: "Cyndaquil",  types: ["fire"],    pal: ["#c04010","#e06820","#a03008","#803010","#503010"] },
  { id: 152, name: "Chikorita",  types: ["grass"],   pal: ["#309a38","#48b850","#207828","#185820","#38683a"] },
  // row 2
  { id: 255, name: "Torchic",    types: ["fire"],    pal: ["#d06818","#e88830","#b05010","#903810","#602810"] },
  { id: 258, name: "Mudkip",     types: ["water"],   pal: ["#3068c0","#4890e0","#2050a0","#183880","#283058"] },
  { id: 252, name: "Treecko",    types: ["grass"],   pal: ["#287840","#3aaa50","#185828","#104020","#304828"] },
  { id: 390, name: "Chimchar",   types: ["fire"],    pal: ["#c03020","#e04838","#a01808","#801010","#501010"] },
  // row 3
  { id: 4,   name: "Charmander", types: ["fire"],    pal: ["#c84010","#e06020","#a02808","#803010","#602010"] },
  { id: 7,   name: "Squirtle",   types: ["water"],   pal: ["#2060a8","#3480cc","#144080","#2a5888","#283060"] },
  { id: 1,   name: "Bulbasaur",  types: ["grass"],   pal: ["#2e6e2e","#3a8a3a","#1e5e1e","#1e4a1e","#385828"] },
  { id: 158, name: "Totodile",   types: ["water"],   pal: ["#1880a8","#28a0d0","#106080","#1a4060","#183050"] },
  // row 4
  { id: 393, name: "Piplup",     types: ["water"],   pal: ["#2848a0","#3868c0","#183880","#103070","#283060"] },
  { id: 387, name: "Turtwig",    types: ["grass"],   pal: ["#488020","#60a038","#306010","#204808","#385828"] },
  { id: 37,  name: "Vulpix",     types: ["fire"],    pal: ["#c04020","#e06030","#a02810","#802010","#601810"] },
  { id: 495, name: "Snivy",      types: ["grass"],   pal: ["#208038","#30a050","#106028","#084818","#305030"] },
];

const ADJS  = ["GOLD","SILVER","CRYSTAL","RUBY","SAPPHIRE","EMERALD","DIAMOND","PEARL","PLATINUM","SCARLET","VIOLET","AMBER","JADE","COBALT","ONYX"];
const NOUNS = ["TRAINER","EXPLORER","CHAMPION","GUARDIAN","RANGER","MASTER","ADVENTURER","CHALLENGER","WANDERER","ACE"];

type GrassBlade = { left: number; width: number; height: number; delay: number; duration: number; opacity: number };

function makeGrass(): GrassBlade[] {
  return Array.from({ length: 100 }, (_, i) => ({
    left: i, width: 5 + Math.random() * 7, height: 22 + Math.random() * 50,
    delay: Math.random() * 2, duration: 1.3 + Math.random() * 1.5, opacity: 0.45 + Math.random() * 0.55,
  }));
}

const STAR_DATA = Array.from({ length: 180 }, () => ({
  x: Math.random(), y: Math.random() * 0.78,
  r: Math.random() * 1.3 + 0.3, ph: Math.random() * Math.PI * 2, sp: 0.007 + Math.random() * 0.014,
}));

type Phase = "landing" | "explore" | "done" | null;

function formatDate(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

function rndName() {
  return ADJS[Math.floor(Math.random() * ADJS.length)] + " " + NOUNS[Math.floor(Math.random() * NOUNS.length)];
}

// ─── Starter card type effects ───────────────────────────────────────────────

function PwElectricFx() {
  return (
    <>
      {/* ambient sky-flash across whole card */}
      <div style={{ position:"absolute", inset:0, borderRadius:"11px",
        background:"radial-gradient(ellipse at 45% 15%, rgba(255,252,160,0.80) 0%, rgba(255,230,60,0.28) 48%, transparent 72%)",
        animation:"pwElecFlash 3.0s ease-in-out infinite", pointerEvents:"none" }} />
      {/* edge corona */}
      <div style={{ position:"absolute", inset:0, borderRadius:"11px",
        animation:"pwElecEdge 3.0s ease-in-out infinite", pointerEvents:"none" }} />

      {/* ── main bolt: jagged stroked path with two forks ── */}
      <svg viewBox="0 0 52 210" style={{
        position:"absolute", left:"14%", top:"0%", width:"52px", height:"210px",
        filter:"drop-shadow(0 0 3px #fff) drop-shadow(0 0 10px #ffe030) drop-shadow(0 0 24px #ffaa00)",
        animation:"pwBolt1 3.0s 0s linear infinite", pointerEvents:"none",
      }}>
        {/* glow halo */}
        <path d="M 34,0 L 29,17 L 38,26 L 24,44 L 32,53 L 20,70 L 28,79 L 15,98 L 23,107 L 10,128 L 19,137 L 6,160 L 13,168 L 2,205"
          stroke="rgba(255,218,40,0.42)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* bright core */}
        <path d="M 34,0 L 29,17 L 38,26 L 24,44 L 32,53 L 20,70 L 28,79 L 15,98 L 23,107 L 10,128 L 19,137 L 6,160 L 13,168 L 2,205"
          stroke="rgba(255,255,230,0.95)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* fork A — branches right off mid-trunk */}
        <path d="M 20,70 L 32,86 L 26,99 L 36,112 L 31,124"
          stroke="rgba(255,228,60,0.55)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 20,70 L 32,86 L 26,99 L 36,112 L 31,124"
          stroke="rgba(255,255,220,0.75)" strokeWidth="1.0" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* fork B — short stub left off lower trunk */}
        <path d="M 15,98 L 5,112 L 10,124 L 4,134"
          stroke="rgba(255,228,60,0.45)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 15,98 L 5,112 L 10,124 L 4,134"
          stroke="rgba(255,255,220,0.60)" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* ── secondary bolt: thinner, right side, slightly delayed ── */}
      <svg viewBox="0 0 34 148" style={{
        position:"absolute", left:"58%", top:"6%", width:"34px", height:"148px",
        filter:"drop-shadow(0 0 2px #fff) drop-shadow(0 0 7px #ffe030) drop-shadow(0 0 16px #ffaa00)",
        animation:"pwBolt2 3.0s 0.05s linear infinite", pointerEvents:"none",
      }}>
        <path d="M 22,0 L 17,14 L 25,21 L 15,34 L 21,42 L 12,57 L 18,64 L 8,80 L 14,87 L 5,106 L 11,112 L 2,142"
          stroke="rgba(255,218,40,0.38)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 22,0 L 17,14 L 25,21 L 15,34 L 21,42 L 12,57 L 18,64 L 8,80 L 14,87 L 5,106 L 11,112 L 2,142"
          stroke="rgba(255,255,225,0.88)" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* small fork */}
        <path d="M 12,57 L 22,70 L 17,82 L 24,90"
          stroke="rgba(255,228,60,0.48)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 12,57 L 22,70 L 17,82 L 24,90"
          stroke="rgba(255,255,220,0.58)" strokeWidth="0.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* spark dots at fork tips */}
      {([
        { x:"30%", y:"37%", del:"0.06s", dur:"0.65s", ex:"13px"  },
        { x:"28%", y:"55%", del:"0.04s", dur:"0.75s", ex:"-10px" },
        { x:"26%", y:"72%", del:"0.08s", dur:"0.58s", ex:"8px"   },
        { x:"65%", y:"46%", del:"0.07s", dur:"0.68s", ex:"-12px" },
        { x:"62%", y:"62%", del:"0.05s", dur:"0.72s", ex:"10px"  },
      ]).map((s, i) => (
        <div key={i} style={{ position:"absolute", left:s.x, top:s.y,
          width:"3px", height:"3px", borderRadius:"50%", background:"white",
          filter:"drop-shadow(0 0 3px #ffe030)",
          ["--ex" as string]:s.ex,
          animation:`pwSpark ${s.dur} ${s.del} ease-out infinite`, pointerEvents:"none",
        } as React.CSSProperties} />
      ))}
    </>
  );
}

// ── Fire: Meteor Shower ───────────────────────────────────────────────────────
const METEOR_DATA = [
  { left:"91%", del:"0ms",   dur:"1.05s", w:3, h:58 },
  { left:"76%", del:"150ms", dur:"1.15s", w:2, h:50 },
  { left:"99%", del:"300ms", dur:"0.92s", w:4, h:66 },
  { left:"67%", del:"450ms", dur:"1.08s", w:3, h:54 },
  { left:"84%", del:"600ms", dur:"1.00s", w:2, h:46 },
];

function PwFireFx() {
  return (
    <>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "11px",
        background: "radial-gradient(ellipse at 88% 8%, rgba(255,120,0,0.22) 0%, rgba(210,40,0,0.09) 52%, transparent 72%)",
        animation: "pwMeteorGlow 1.6s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      {METEOR_DATA.map((m, i) => (
        <div key={i} style={{
          position: "absolute",
          left: m.left,
          top: "2%",
          animation: `pwMeteorFly ${m.dur} ${m.del} ease-in infinite`,
          pointerEvents: "none",
        }}>
          <div style={{
            width: `${m.w}px`,
            height: `${m.h}px`,
            background: "linear-gradient(to bottom, transparent 0%, rgba(255,50,0,0.15) 18%, rgba(255,100,0,0.55) 44%, rgba(255,180,0,0.90) 70%, rgba(255,235,100,1) 86%, rgba(255,255,220,0.90) 100%)",
            borderRadius: `${Math.ceil(m.w / 2)}px`,
            filter: "blur(0.4px) drop-shadow(0 0 5px rgba(255,200,50,0.85)) drop-shadow(0 0 12px rgba(255,100,0,0.50))",
            transform: "rotate(45deg)",
          }} />
        </div>
      ))}
    </>
  );
}

function PwWaterFx() {
  const drops = [
    { l:"6%",  del:"0s",    dur:"0.78s", h:9  },
    { l:"14%", del:"0.42s", dur:"0.64s", h:11 },
    { l:"21%", del:"0.15s", dur:"0.88s", h:8  },
    { l:"29%", del:"0.70s", dur:"0.72s", h:12 },
    { l:"36%", del:"0.28s", dur:"0.82s", h:9  },
    { l:"44%", del:"0.55s", dur:"0.68s", h:10 },
    { l:"51%", del:"0.08s", dur:"0.76s", h:8  },
    { l:"59%", del:"0.85s", dur:"0.60s", h:11 },
    { l:"66%", del:"0.35s", dur:"0.84s", h:9  },
    { l:"73%", del:"0.62s", dur:"0.70s", h:12 },
    { l:"80%", del:"0.18s", dur:"0.80s", h:8  },
    { l:"88%", del:"0.48s", dur:"0.66s", h:10 },
    { l:"94%", del:"0.90s", dur:"0.74s", h:9  },
    { l:"10%", del:"0.95s", dur:"0.86s", h:10 },
    { l:"25%", del:"0.50s", dur:"0.62s", h:8  },
    { l:"47%", del:"0.22s", dur:"0.90s", h:11 },
    { l:"70%", del:"0.75s", dur:"0.68s", h:9  },
    { l:"84%", del:"0.38s", dur:"0.78s", h:10 },
  ];
  return (
    <>
      {/* Stormy sky tint */}
      <div style={{ position:"absolute", inset:0, borderRadius:"11px",
        background:"linear-gradient(180deg, rgba(10,30,80,0.72) 0%, rgba(20,60,150,0.48) 55%, rgba(30,80,170,0.28) 100%)",
        animation:"pwWaterFlash 2.2s ease-in-out infinite", pointerEvents:"none" }} />
      {/* Border rain-blue glow */}
      <div style={{ position:"absolute", inset:0, borderRadius:"11px",
        animation:"pwWaterEdge 2.2s ease-in-out infinite", pointerEvents:"none" }} />
      {/* Rain streaks */}
      {drops.map((d, i) => (
        <div key={i} style={{
          position: "absolute",
          left: d.l,
          top: 0,
          width: "1.5px",
          height: `${d.h}px`,
          background: "linear-gradient(180deg, rgba(160,220,255,0.72) 0%, rgba(100,180,255,0.28) 100%)",
          borderRadius: "1px",
          animation: `pwRainDrop ${d.dur} ${d.del} linear infinite`,
          pointerEvents: "none",
        }} />
      ))}
    </>
  );
}

function PwGrassFx() {
  return (
    <>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"48px",
        background:"linear-gradient(0deg, rgba(52,211,153,0.25) 0%, transparent 100%)", pointerEvents:"none" }} />
      {([
        { x:"8%",  del:"0s",    dur:"1.3s", tx:"6px",   col:"#34d399" },
        { x:"24%", del:"0.30s", dur:"1.6s", tx:"-10px", col:"#6ee7b7" },
        { x:"43%", del:"0.10s", dur:"1.2s", tx:"8px",   col:"#34d399" },
        { x:"62%", del:"0.45s", dur:"1.5s", tx:"-6px",  col:"#86efac" },
        { x:"80%", del:"0.20s", dur:"1.1s", tx:"10px",  col:"#34d399" },
      ]).map((lf, i) => (
        <div key={i} style={{ position:"absolute", left:lf.x, bottom:"6px",
          width:"12px", height:"18px", background:lf.col,
          borderRadius:"0 70% 0 70%",
          filter:`drop-shadow(0 0 5px ${lf.col})`,
          ["--tx" as string]: lf.tx,
          animation:`pwLeaf ${lf.dur} ${lf.del} ease-out infinite`, pointerEvents:"none",
        } as React.CSSProperties} />
      ))}
    </>
  );
}

function PwNormalFx() {
  const C = ["#fda4af","#c4b5fd","#93c5fd","#fde68a","#bbf7d0","#f9a8d4"];
  return (
    <>
      <div style={{ position:"absolute", inset:0, borderRadius:"11px",
        background:"linear-gradient(135deg,rgba(253,164,175,0.1),rgba(196,181,253,0.13),rgba(147,197,253,0.1),rgba(187,247,208,0.1))",
        backgroundSize:"400% 400%", animation:"pwPastelShift 3s ease infinite", pointerEvents:"none" }} />
      {([
        { x:"14%", y:"16%", del:"0s",    dur:"1.4s" },
        { x:"36%", y:"60%", del:"0.35s", dur:"1.2s" },
        { x:"54%", y:"20%", del:"0.15s", dur:"1.6s" },
        { x:"72%", y:"66%", del:"0.50s", dur:"1.1s" },
        { x:"86%", y:"36%", del:"0.25s", dur:"1.3s" },
        { x:"24%", y:"76%", del:"0.60s", dur:"1.5s" },
      ]).map((s, i) => (
        <div key={i} style={{ position:"absolute", left:s.x, top:s.y,
          width:"13px", height:"13px", background:C[i%C.length],
          clipPath:"polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
          filter:`drop-shadow(0 0 6px ${C[i%C.length]})`,
          animation:`pwSparkle ${s.dur} ${s.del} ease-in-out infinite`, pointerEvents:"none" }} />
      ))}
    </>
  );
}

function StarterCard({ p, isChosen, bc, onClick }: { p: Mon; isChosen: boolean; bc: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const type = p.types[0];
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="pw-starter-card"
      style={{ background:"#161b22", border: isChosen ? `3px solid ${bc}` : "2px solid #22283a",
        borderRadius:"11px", padding:"14px 6px 10px", display:"flex", flexDirection:"column",
        alignItems:"center", cursor:"pointer", position:"relative", userSelect:"none",
        overflow:"hidden", transition:"border-color .18s,transform .14s,box-shadow .18s",
        transform: isChosen ? "translateY(-4px)" : "none",
        boxShadow: isChosen ? `0 0 18px ${bc}44` : "none" }}>
      {isChosen && (
        <div style={{ position:"absolute", top:"7px", right:"7px", width:"18px", height:"18px", borderRadius:"50%", background:"#ffcc00", color:"#111", fontSize:"9px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, zIndex:2 }}>✓</div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SPR}${p.id}.png`} alt={p.name} width={96} height={96}
        className="pw-starter-sprite"
        style={{ imageRendering:"pixelated", filter:"drop-shadow(0 2px 5px rgba(0,0,0,.5))", position:"relative", zIndex:1 }} />
      <div className="pw-starter-name" style={{ fontFamily:'"Press Start 2P",monospace', color:"#ccd", fontSize:"8px", marginTop:"10px", textAlign:"center", position:"relative", zIndex:1 }}>{p.name.toUpperCase()}</div>
      <div style={{ display:"flex", gap:"4px", marginTop:"8px", flexWrap:"wrap", justifyContent:"center", position:"relative", zIndex:1 }}>
        {p.types.map(t => <span key={t} style={{ fontFamily:'"Press Start 2P",monospace', fontSize:"6px", padding:"4px 7px", borderRadius:"3px", color:"#fff", background:TC[t] ?? "#555" }}>{t}</span>)}
      </div>
      {/* type effect overlay */}
      <div style={{ position:"absolute", inset:0, borderRadius:"11px", overflow:"hidden",
        opacity: hovered ? 1 : 0,
        transition: hovered ? "opacity 200ms ease" : "opacity 300ms ease",
        pointerEvents:"none", zIndex:0 }}>
        {type === "electric" && <PwElectricFx />}
        {type === "fire"     && <PwFireFx />}
        {type === "water"    && <PwWaterFx />}
        {type === "grass"    && <PwGrassFx />}
        {type === "normal"   && <PwNormalFx />}
      </div>
    </div>
  );
}

// ─── Trainer Card (reused on both screens) ───────────────────────────────────
const TYPE_SCENE: Record<string, { skyA: string; skyB: string; groundA: string; groundB: string; stars: boolean }> = {
  grass:    { skyA: "#3a7bd5", skyB: "#1a4a8a", groundA: "#2d7a3a", groundB: "#1a5a28", stars: false },
  fire:     { skyA: "#c43a00", skyB: "#6a1a00", groundA: "#8a3010", groundB: "#5a1a08", stars: false },
  water:    { skyA: "#1a5aaa", skyB: "#0a2a60", groundA: "#0a4a88", groundB: "#083060", stars: true  },
  electric: { skyA: "#7a7200", skyB: "#3a3600", groundA: "#5a5200", groundB: "#302e00", stars: false },
  normal:   { skyA: "#3a5aaa", skyB: "#1a2a6a", groundA: "#2a5a30", groundB: "#183a20", stars: true  },
  poison:   { skyA: "#5a1a7a", skyB: "#2a0a4a", groundA: "#3a1050", groundB: "#200830", stars: true  },
};

const STAR_POSITIONS = [
  {x:"6%",y:"10%"},{x:"16%",y:"5%"},{x:"28%",y:"15%"},{x:"38%",y:"7%"},
  {x:"50%",y:"13%"},{x:"60%",y:"4%"},{x:"72%",y:"11%"},{x:"84%",y:"6%"},{x:"90%",y:"18%"},
];

function TrainerCard({ chosen, trainerName, cardColor, cardNo, issueDate, size = "md" }: {
  chosen: Mon | null; trainerName: string; cardColor: string;
  cardNo: number; issueDate: string; size?: "md" | "lg";
}) {
  const w = size === "lg" ? 310 : 290;
  const fs = { title: size === "lg" ? "7px" : "6px", name: size === "lg" ? "9px" : "8px", lbl: size === "lg" ? "6px" : "5px" };
  const type = chosen?.types[0] ?? "normal";
  const scene = TYPE_SCENE[type] ?? TYPE_SCENE.normal;

  return (
    /* Outer frame — chunky Pokémon-game border */
    <div style={{
      width: `${w}px`,
      borderRadius: "6px",
      border: "3px solid #1a1a1a",
      boxShadow: "5px 5px 0 #0a0a0a",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* 4px inner highlight stripe */}
      <div style={{ position: "absolute", inset: 0, border: "4px solid rgba(255,255,255,0.18)", borderRadius: "4px", zIndex: 10, pointerEvents: "none" }} />

      {/* Sky layer */}
      <div style={{
        background: `linear-gradient(180deg, ${scene.skyA} 0%, ${scene.skyB} 65%, ${scene.groundA} 65%, ${scene.groundB} 100%)`,
        transition: "background 0.35s",
        padding: "16px 16px 0",
        position: "relative",
        minHeight: size === "lg" ? "172px" : "158px",
      }}>

        {/* Pixel stars (type-conditional) */}
        {scene.stars && STAR_POSITIONS.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: "2px", height: "2px", background: "rgba(255,255,255,0.75)", borderRadius: "50%", pointerEvents: "none" }} />
        ))}

        {/* Cloud-like highlight across sky */}
        <div style={{ position: "absolute", top: "22%", left: 0, right: 0, height: "28px", background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.11) 50%, rgba(255,255,255,0.07) 70%, transparent 100%)", pointerEvents: "none" }} />

        {/* Pokémon sprite — anchored to bottom of sky */}
        {chosen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${SPR}${chosen.id}.png`} alt={chosen.name} width={size === "lg" ? 130 : 120} height={size === "lg" ? 130 : 120}
            style={{ position: "absolute", right: "-4px", bottom: "0px", imageRendering: "pixelated", opacity: 0.95, filter: "drop-shadow(2px 0 0 rgba(0,0,0,0.5)) drop-shadow(-1px 2px 4px rgba(0,0,0,0.4))" }} />
        ) : (
          <div style={{ position: "absolute", right: "18px", bottom: "14px", width: "52px", height: "52px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Press Start 2P",monospace', fontSize: "12px", color: "rgba(255,255,255,.2)" }}>?</div>
        )}

        {/* Card text content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: fs.title, color: "rgba(255,255,255,0.92)", lineHeight: 2.0, marginBottom: "12px", textShadow: "1px 1px 0 rgba(0,0,0,0.5)" }}>
            VARUUN&apos;S<br />POKè WORLD
          </div>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: fs.lbl, color: "rgba(255,255,255,0.5)", marginBottom: "3px" }}>TRAINER</div>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: fs.name, color: "#fff", marginBottom: "12px", textShadow: "1px 1px 0 rgba(0,0,0,0.6)" }}>
            {trainerName.trim().toUpperCase() || "—"}
          </div>
        </div>
      </div>

      {/* Bottom info strip — dark panel */}
      <div style={{ background: "#1a1a1a", padding: "10px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "5px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>STARTER</div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "#ffcc00" }}>{chosen ? chosen.name.toUpperCase() : "—"}</div>
          </div>
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "5px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>ISSUED</div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "#ffcc00" }}>{issueDate}</div>
          </div>
        </div>
        <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "5px", color: "rgba(255,255,255,0.2)", textAlign: "right" }}>
          NO.{cardNo}
        </div>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PokemonWorld() {
  const [phase, setPhase]       = useState<Phase>(null);
  const [flash, setFlash]       = useState(false);
  const [chosen, setChosen]     = useState<Mon | null>(null);
  const [trainerName, setTrainerName] = useState("");
  const [activeColIdx, setActiveColIdx] = useState(0);
  const [cardNo, setCardNo]       = useState(1000);
  const [issueDate, setIssueDate] = useState("—");
  const [grassBlades, setGrassBlades] = useState<GrassBlade[]>([]);

  const starsRef    = useRef<HTMLCanvasElement>(null);
  const starsRafRef = useRef<number | null>(null);

  // Client-only initialization — avoids hydration mismatch from Math.random() / Date
  useEffect(() => {
    setGrassBlades(makeGrass());
    setCardNo(1000 + Math.floor(Math.random() * 9000));
    setIssueDate(formatDate(new Date()));
    setTrainerName(rndName());

    // "Start New Adventure" from the gym — jump straight to starter selection
    const newAdventure = sessionStorage.getItem("vr_new_adventure") === "1";
    if (newAdventure) {
      sessionStorage.removeItem("vr_new_adventure");
      setPhase("explore");
      return;
    }

    // Skip intro if user already saw it this session, or arrived via a hash link (e.g. /#work)
    const alreadySeen = sessionStorage.getItem("vr_intro_seen") === "1";
    const hasHash = window.location.hash && window.location.hash !== "#";
    if (alreadySeen || hasHash) {
      setPhase("done");
      if (hasHash) {
        setTimeout(() => {
          const el = document.getElementById(window.location.hash.slice(1));
          el?.scrollIntoView({ behavior: "smooth" });
        }, 80);
      }
    } else {
      setPhase("landing");
    }
  }, []);

  // Stars — only animates during landing
  useEffect(() => {
    if (phase !== "landing" || phase === null) {
      if (starsRafRef.current) cancelAnimationFrame(starsRafRef.current);
      return;
    }
    const canvas = starsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    let alive = true;
    function tick(t: number) {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      STAR_DATA.forEach(s => {
        const a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
        ctx.beginPath(); ctx.arc(s.x * canvas!.width, s.y * canvas!.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
      });
      starsRafRef.current = requestAnimationFrame(tick);
    }
    starsRafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; window.removeEventListener("resize", resize); if (starsRafRef.current) cancelAnimationFrame(starsRafRef.current); };
  }, [phase]);


  function goTo(next: Phase) {
    setFlash(true);
    setTimeout(() => { setPhase(next); setFlash(false); }, 230);
  }

  const cardColor = chosen ? chosen.pal[activeColIdx] : "#2a2a40";
  const canEnter  = !!chosen && trainerName.trim().length > 0;

  if (phase === null || phase === "done") return <div style={{ height: 0 }} />;

  return (
    <div style={{ position: "relative", width: "100%", height: 0 }}>
      <style>{`
        @keyframes pfu          { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pbspin       { 0%{transform:rotate(0)scale(1)} 25%{transform:rotate(90deg)scale(1.06)} 50%{transform:rotate(180deg)scale(1)} 75%{transform:rotate(270deg)scale(1.06)} 100%{transform:rotate(360deg)scale(1)} }
        @keyframes sw           { 0%,100%{transform:rotate(-7deg)} 50%{transform:rotate(7deg)} }
        @keyframes cardUp       { from{opacity:0;transform:translateY(40px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn        { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
        @keyframes dotIn        { from{opacity:0} to{opacity:1} }
        @keyframes pikRun       { from{transform:translateX(-120px)} to{transform:translateX(calc(100vw + 120px))} }
        @keyframes monFly       { 0%,100%{transform:translate(0,0)} 30%{transform:translate(14px,-18px)} 70%{transform:translate(-8px,-11px)} }
        @keyframes moonGlow       { 0%,100%{box-shadow:0 0 0 10px rgba(255,235,100,.05),0 0 0 22px rgba(255,235,100,.025),0 0 38px rgba(255,235,100,.22),0 0 80px rgba(255,235,100,.08)} 50%{box-shadow:0 0 0 14px rgba(255,235,100,.07),0 0 0 30px rgba(255,235,100,.035),0 0 55px rgba(255,235,100,.30),0 0 110px rgba(255,235,100,.12)} }
        @keyframes blinkStart     { 0%,49%,100%{opacity:1} 50%,98%{opacity:0} }
        @keyframes mistDrift      { 0%,100%{opacity:.5;transform:translateX(0)} 50%{opacity:.7;transform:translateX(7px)} }
        @keyframes landIn         { from{opacity:0} to{opacity:1} }
        @keyframes jumpluffFloat  { 0%,100%{transform:translateY(0) translateX(0)} 35%{transform:translateY(-13px) translateX(5px)} 70%{transform:translateY(-6px) translateX(-4px)} }
        .pw-start:hover span      { animation:none !important; opacity:1 !important; }
        @media (max-width: 768px) {
          .pw-oak-tree-wrap { left: -14% !important; }
          .pw-start { padding: 10px 18px !important; font-size: 9px !important; }
        }
      `}</style>

      {/* Flash overlay */}
      <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 999, opacity: flash ? 1 : 0, pointerEvents: "none", transition: "opacity .22s" }} />

      {/* ── LANDING ── */}
      {phase === "landing" && (
        <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#09091a", fontFamily: '"Press Start 2P",monospace', zIndex: 100, overflow: "hidden", animation: "landIn 0.45s ease both" }}>
          <canvas ref={starsRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }} />

          {/* ── Moon ── */}
          <div style={{
            position: "absolute", top: "5%", right: "23%",
            width: "68px", height: "68px", borderRadius: "50%",
            background: "radial-gradient(circle at 38% 35%, #fffbdc 0%, #f0d840 55%, #c8a020 100%)",
            animation: "landIn 0.5s 0.1s ease both, moonGlow 5.5s 0.6s ease-in-out infinite",
            zIndex: 2, pointerEvents: "none",
          }} />

          {/* ── Distant tree / hill silhouette ── */}
          <svg style={{ position: "absolute", bottom: "78px", left: 0, width: "100%", height: "90px", zIndex: 1, pointerEvents: "none", animation: "landIn 0.5s 0.1s ease both" }}
            viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,90 L0,64 Q90,34 180,58 Q270,80 360,44 Q450,8 540,36 Q630,62 720,30 Q810,2 900,30 Q990,58 1080,36 Q1170,14 1260,42 Q1350,70 1440,50 L1440,90 Z" fill="#081208" />
            <polygon points="354,44 363,18 372,44"  fill="#081208" />
            <polygon points="536,36 547,8  558,36"  fill="#081208" />
            <polygon points="896,30 908,4  920,30"  fill="#081208" />
            <polygon points="1254,42 1264,16 1274,42" fill="#081208" />
          </svg>

          {/* ── Horizon glow ── */}
          <div style={{ position: "absolute", bottom: "80px", left: 0, right: 0, height: "38px",
            background: "linear-gradient(to top, rgba(18,56,18,0.45) 0%, transparent 100%)",
            animation: "landIn 0.5s 0.1s ease both",
            zIndex: 1, pointerEvents: "none" }} />

          {/* ── Ground mist ── */}
          <div style={{ position: "absolute", bottom: "74px", left: 0, right: 0, height: "28px",
            background: "linear-gradient(to top, rgba(120,220,120,0.06) 0%, transparent 100%)",
            filter: "blur(5px)",
            animation: "landIn 0.5s 0.1s ease both, mistDrift 9s 0.6s ease-in-out infinite",
            zIndex: 4, pointerEvents: "none" }} />

          {/* ── Jumpluff floating (upper-left) ── */}
          <div style={{ position: "absolute", top: "18%", left: "9%", zIndex: 3, pointerEvents: "none",
            opacity: 0, animationName: "pfu", animationDuration: ".6s", animationDelay: "2.0s",
            animationTimingFunction: "ease", animationFillMode: "both" }}>
            <div style={{ animation: "jumpluffFloat 4.2s ease-in-out infinite" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://play.pokemonshowdown.com/sprites/ani/jumpluff.gif" alt="Jumpluff" width={72}
                style={{ imageRendering: "pixelated", display: "block",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }} />
            </div>
          </div>

          {/* ── Center content (above all sprites) ── */}
          <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ color: "#ffcc00", fontSize: "8px", letterSpacing: "7px", marginBottom: "18px", animation: "pfu .7s .2s ease both" }}>WELCOME TO</p>
            <h1 style={{ color: "#fff", fontSize: "clamp(18px,3.2vw,40px)", textAlign: "center", lineHeight: 1.6, textShadow: "4px 4px 0 #aa1100,7px 7px 0 #660000", animation: "pfu .7s .5s ease both", margin: 0 }}>
              VARUUN&apos;S<br />
              <span style={{ color: "#ffcc00", textShadow: "4px 4px 0 #997700,7px 7px 0 #554400" }}>POKè WORLD</span>
            </h1>
            <p style={{ color: "#555", fontSize: "7px", letterSpacing: "3px", marginTop: "14px", animation: "pfu .7s .8s ease both" }}>✦ &nbsp; PORTFOLIO EDITION &nbsp; ✦</p>
            <div style={{ margin: "26px auto", animation: "pfu .7s 1s ease both" }}>
              <div style={{ width: "68px", height: "68px", borderRadius: "50%", border: "4px solid #1a1a1a", position: "relative", overflow: "hidden", animation: "pbspin 5s linear infinite" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "#cc2200" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "#eee" }} />
                <div style={{ position: "absolute", top: "calc(50% - 3px)", left: 0, right: 0, height: "6px", background: "#1a1a1a", zIndex: 2 }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", border: "4px solid #1a1a1a", zIndex: 3 }} />
              </div>
            </div>
            <button onClick={() => goTo("explore")} className="pw-start"
              style={{ animation: "pfu .7s 1.3s ease both", padding: "13px 30px", background: "transparent", border: "3px solid #ffcc00", color: "#ffcc00", fontFamily: '"Press Start 2P",monospace', fontSize: "11px", cursor: "pointer", letterSpacing: "2px", marginTop: "6px", transition: "background .15s,color .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ffcc00"; e.currentTarget.style.color = "#09091a"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ffcc00"; }}>
              <span style={{ animation: "blinkStart 1.1s step-end infinite", display: "inline-block" }}>▶ PRESS START</span>
            </button>
            <button
              onClick={() => {
                setFlash(true);
                setTimeout(() => {
                  sessionStorage.setItem("vr_intro_seen", "1");
                  setPhase("done");
                  setFlash(false);
                  setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 80);
                }, 230);
              }}
              style={{ animation: "pfu .7s 1.6s ease both", background: "none", border: "none", color: "#666", fontFamily: '"Press Start 2P",monospace', fontSize: "11px", letterSpacing: "2px", cursor: "pointer", marginTop: "14px", transition: "color .15s", width: "206px", textAlign: "center" }}
              onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
              onMouseLeave={e => e.currentTarget.style.color = "#666"}
            >
              skip
            </button>
          </div>

          {/* ── Oak Tree + Chimchar (lower-left, synced with grass) ── */}
          <div className="pw-oak-tree-wrap" style={{ position: "absolute", bottom: "80px", left: "3%", zIndex: 4, pointerEvents: "none",
            animation: "landIn 0.5s 0.1s ease both" }}>
            <div style={{ position: "relative", width: "196px", height: "224px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/oak_tree.png" alt="" width={128} height={224}
                style={{ position: "absolute", left: 0, bottom: 0, imageRendering: "pixelated", display: "block" }} />
              {/* Chimchar stands at the trunk base — trunk center is ~x64 in the 128px image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://play.pokemonshowdown.com/sprites/ani/chimchar.gif" alt="Chimchar" width={62}
                style={{ position: "absolute", left: "72px", bottom: 0, imageRendering: "pixelated", display: "block",
                  filter: "drop-shadow(0 0 10px rgba(255,90,0,0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }} />
            </div>
          </div>

          {/* ── Running Pikachu (above grass, in front of trees) ── */}
          <div style={{ position:"absolute", bottom:"80px", left:0, pointerEvents:"none", animation:"pikRun 9s linear 1.5s infinite both", zIndex:5 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://media.tenor.com/SH31iAEWLT8AAAAj/pikachu-running.gif" alt="" width={72} height={72}
              style={{ imageRendering:"pixelated", display:"block" }} />
          </div>

          {/* ── Pidgeotto (upper-right) ── */}
          <div style={{ position:"absolute", top:"14%", right:"9%", pointerEvents:"none", zIndex:2, opacity:0, animationName:"pfu", animationDuration:".7s", animationDelay:"2.1s", animationTimingFunction:"ease", animationFillMode:"both" }}>
            <div style={{ animation:"monFly 3.5s 2.8s ease-in-out infinite" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://play.pokemonshowdown.com/sprites/ani/pidgeotto.gif" alt="Pidgeotto" width={100}
                style={{ imageRendering:"pixelated", display:"block" }} />
            </div>
          </div>

          {/* ── Grass bar (z:3) ── */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"80px", background:"#123012", overflow:"hidden", pointerEvents:"none", zIndex:3, animation:"landIn 0.5s 0.1s ease both" }}>
            {grassBlades.map((b: GrassBlade, i: number) => (
              <div key={i} style={{ position:"absolute", bottom:0, left:`${b.left}%`, width:`${b.width}px`, height:`${b.height}px`, background:"#1b621b", borderRadius:"40% 40% 0 0", transformOrigin:"bottom center", opacity:b.opacity, animation:`sw ${b.duration}s ${b.delay}s ease-in-out infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── EXPLORE: Starter Select + Visitor Card (split screen) ── */}
      {phase === "explore" && (
        <div className="pw-explore-layout" style={{ position: "fixed", inset: 0, display: "flex", zIndex: 100 }}>

          {/* LEFT — Pokemon grid */}
          <div className="pw-explore-left" style={{ flex: 1, minWidth: 0, background: "#0d1117", overflowY: "auto", padding: "24px 28px 40px 28px", borderRight: "1px solid rgba(255,255,255,.06)" }}>
            <button onClick={() => goTo("landing")} style={{ background: "none", border: "none", fontFamily: '"Space Mono",monospace', fontSize: "11px", color: "#556", cursor: "pointer", letterSpacing: "2px", marginBottom: "14px", display: "block" }}
              onMouseEnter={e => e.currentTarget.style.color = "#aaa"} onMouseLeave={e => e.currentTarget.style.color = "#556"}>
              ← BACK
            </button>
            <h2 style={{ fontFamily: '"Press Start 2P",monospace', color: "#ffcc00", fontSize: "clamp(9px,1.3vw,13px)", marginBottom: "6px", textShadow: "3px 3px 0 #886600" }}>CHOOSE YOUR STARTER!</h2>
            <p style={{ fontFamily: '"Press Start 2P",monospace', color: "#334", fontSize: "6px", letterSpacing: "2px", marginBottom: "16px" }}>pick one to receive your trainer card</p>

            <style>{`
              @media (max-width: 768px) {
                .pw-explore-layout {
                  flex-direction: column !important;
                  overflow-y: auto;
                }
                .pw-explore-left {
                  flex: none !important;
                  width: 100%;
                  border-right: none !important;
                  border-bottom: 1px solid rgba(255,255,255,.06);
                  padding: 16px 16px 24px !important;
                }
                .pw-explore-right {
                  flex: none !important;
                  width: 100%;
                }
                .pw-starter-grid {
                  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)) !important;
                  gap: 8px !important;
                }
                .pw-starter-card {
                  padding: 8px 4px 8px !important;
                  border-radius: 8px !important;
                }
                .pw-starter-sprite {
                  width: 56px !important;
                  height: 56px !important;
                }
                .pw-starter-name {
                  font-size: 6px !important;
                  margin-top: 6px !important;
                }
              }
              @keyframes pwElecFlash {
                0%,1.5%  { opacity:0; }
                2%       { opacity:0.88; }
                3%       { opacity:0.22; }
                3.5%     { opacity:0.80; }
                5.5%,62% { opacity:0; }
                62.5%    { opacity:0.72; }
                64%      { opacity:0.16; }
                64.5%    { opacity:0.65; }
                66%,100% { opacity:0; }
              }
              @keyframes pwBolt1 {
                0%,1.5%  { opacity:0; }
                2%       { opacity:1; }
                3%       { opacity:0.18; }
                3.5%     { opacity:1; }
                5%,62%   { opacity:0; }
                62.5%    { opacity:1; }
                64%      { opacity:0.12; }
                64.5%    { opacity:0.85; }
                66%,100% { opacity:0; }
              }
              @keyframes pwBolt2 {
                0%,2%    { opacity:0; }
                2.5%     { opacity:0.80; }
                3.5%     { opacity:0.10; }
                4%       { opacity:0.70; }
                5.5%,63% { opacity:0; }
                63.5%    { opacity:0.72; }
                65%      { opacity:0.08; }
                65.5%    { opacity:0.60; }
                67%,100% { opacity:0; }
              }
              @keyframes pwElecEdge {
                0%,1.5%  { box-shadow: inset 0 0 0px rgba(255,220,0,0),    0 0 0px  rgba(255,220,0,0); }
                2.5%     { box-shadow: inset 0 0 32px rgba(255,220,0,0.80), 0 0 30px rgba(255,220,0,0.65); }
                3.5%     { box-shadow: inset 0 0 10px rgba(255,220,0,0.20), 0 0 8px  rgba(255,220,0,0.15); }
                4%       { box-shadow: inset 0 0 26px rgba(255,220,0,0.70), 0 0 24px rgba(255,220,0,0.55); }
                6%,62%   { box-shadow: inset 0 0 0px rgba(255,220,0,0),    0 0 0px  rgba(255,220,0,0); }
                63.5%    { box-shadow: inset 0 0 26px rgba(255,220,0,0.70), 0 0 24px rgba(255,220,0,0.55); }
                65%      { box-shadow: inset 0 0 8px  rgba(255,220,0,0.15), 0 0 6px  rgba(255,220,0,0.10); }
                65.5%    { box-shadow: inset 0 0 20px rgba(255,220,0,0.60), 0 0 18px rgba(255,220,0,0.45); }
                67%,100% { box-shadow: inset 0 0 0px rgba(255,220,0,0),    0 0 0px  rgba(255,220,0,0); }
              }
              @keyframes pwSpark {
                0%   { transform:translate(0,0) scale(1.2); opacity:1; }
                100% { transform:translate(var(--ex,6px),-22px) scale(0); opacity:0; }
              }
              @keyframes pwMeteorFly {
                0%   { transform: translate(0px, -50px); opacity: 0; }
                10%  { opacity: 1; }
                84%  { opacity: 0.88; }
                100% { transform: translate(-195px, 195px); opacity: 0; }
              }
              @keyframes pwMeteorGlow {
                0%, 100% { opacity: 0.20; }
                50%      { opacity: 0.48; }
              }
              @keyframes pwWaterFlash {
                0%,100% { opacity:0.28; }
                36%,60% { opacity:0.88; }
              }
              @keyframes pwWaterEdge {
                0%,100% { box-shadow: inset 0 0 10px rgba(30,140,255,0.10), 0 0 8px rgba(0,110,255,0.08); }
                36%,60% { box-shadow: inset 0 0 28px rgba(30,140,255,0.58), 0 0 22px rgba(0,110,255,0.48); }
              }
              @keyframes pwRainDrop {
                0%   { transform: translateY(-14px); opacity:0; }
                8%   { opacity:1; }
                92%  { opacity:0.75; }
                100% { transform: translateY(230px); opacity:0; }
              }
              @keyframes pwLeaf {
                0%   { transform:translateY(0)     translateX(0)            rotate(45deg)  scale(1);   opacity:1; }
                60%  { opacity:0.85; }
                100% { transform:translateY(-95px) translateX(var(--tx,6px)) rotate(300deg) scale(0.35); opacity:0; }
              }
              @keyframes pwSparkle {
                0%   { transform:scale(0)   rotate(0deg);   opacity:0; }
                30%  { transform:scale(1.5) rotate(72deg);  opacity:1; }
                70%  { transform:scale(1)   rotate(144deg); opacity:0.7; }
                100% { transform:scale(0)   rotate(216deg); opacity:0; }
              }
              @keyframes pwPastelShift {
                0%   { background-position:0%   50%; }
                50%  { background-position:100% 50%; }
                100% { background-position:0%   50%; }
              }
            `}</style>
            <div className="pw-starter-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "10px" }}>
              {MONS.map(p => (
                <StarterCard
                  key={p.id}
                  p={p}
                  isChosen={chosen?.id === p.id}
                  bc={TC[p.types[0]] ?? "#ffcc00"}
                  onClick={() => {
                    setChosen(p); setActiveColIdx(0);
                    try {
                      const ctx = getAudioCtx();
                      // Resume if the browser auto-suspended the context
                      const play = () => {
                        fetch(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${p.id}.ogg`)
                          .then(r => r.arrayBuffer())
                          .then(buf => ctx.decodeAudioData(buf))
                          .then(decoded => {
                            const src  = ctx.createBufferSource();
                            src.buffer = decoded;
                            const gain = ctx.createGain();
                            const dur  = decoded.duration;
                            gain.gain.setValueAtTime(0, ctx.currentTime);
                            gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.07);
                            gain.gain.setValueAtTime(0.8, ctx.currentTime + Math.max(dur - 0.18, 0.1));
                            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
                            src.connect(gain);
                            gain.connect(ctx.destination);
                            src.start();
                          }).catch(() => {});
                      };
                      if (ctx.state === "suspended") {
                        ctx.resume().then(play).catch(() => {});
                      } else {
                        play();
                      }
                    } catch { /* ignore */ }
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — Visitor Card */}
          <div className="pw-explore-right" style={{ flex: 1, minWidth: 0, background: "#e8f0e8", backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)", backgroundSize: "18px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", overflowY: "auto" }}>

            {/* Pokémon-style dialog box */}
            <div style={{ background: "#fff", border: "3px solid #1a1a1a", borderRadius: "6px", padding: "18px 20px 22px", maxWidth: "300px", width: "100%", marginBottom: "26px", boxShadow: "5px 5px 0 #1a1a1a", position: "relative" }}>
              <p style={{ fontFamily: '"Press Start 2P",monospace', color: "#1a1a1a", fontSize: "8px", lineHeight: 2.1, margin: "0 0 10px" }}>
                WELCOME,<br />TRAINER!
              </p>
              <p style={{ fontFamily: '"Press Start 2P",monospace', color: "#666", fontSize: "7px", lineHeight: 2.1, margin: 0 }}>
                WHAT IS YOUR<br />TRAINER NAME?
              </p>
              {/* Dialog arrow indicator */}
              <div style={{ position: "absolute", bottom: "10px", right: "14px", fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "#1a1a1a", animation: "blinkStart 1.1s step-end infinite" }}>▼</div>
            </div>

            {/* Name input — game-style field */}
            <div style={{ background: "#fff", border: "3px solid #1a1a1a", borderRadius: "6px", padding: "14px 16px", maxWidth: "300px", width: "100%", marginBottom: "22px", boxShadow: "5px 5px 0 #1a1a1a", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "#888", whiteSpace: "nowrap", flexShrink: 0 }}>NAME</span>
              <div style={{ flex: 1, borderBottom: "2px solid #1a1a1a", minWidth: 0 }}>
                <input
                  value={trainerName}
                  onChange={e => setTrainerName(e.target.value.slice(0, 18))}
                  placeholder="YOUR NAME"
                  style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", letterSpacing: "1px", border: "none", background: "transparent", color: "#1a1a1a", width: "100%", outline: "none", textTransform: "uppercase", paddingBottom: "4px" }}
                />
              </div>
              <button
                onClick={() => setTrainerName(rndName())}
                title="Random name"
                style={{ background: "none", border: "2px solid #ccc", borderRadius: "4px", width: "28px", height: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "13px", flexShrink: 0, transition: "border-color 0.12s, color 0.12s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.color = "#1a1a1a"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.color = "#aaa"; }}
              >↻</button>
            </div>

            {/* Card preview */}
            <TrainerCard chosen={chosen} trainerName={trainerName} cardColor={cardColor} cardNo={cardNo} issueDate={issueDate} />

            {/* Enter button */}
            <button onClick={() => {
              if (!canEnter || !chosen) return;
              const cardData = {
                id: Date.now(), name: trainerName.trim().toUpperCase(),
                pokemonId: chosen.id, pokemonName: chosen.name,
                cardColor, issueDate, cardNo,
              };
              try {
                const existing = JSON.parse(localStorage.getItem("vr_trainer_cards") ?? "[]");
                localStorage.setItem("vr_trainer_cards", JSON.stringify([...existing, cardData]));
                localStorage.setItem("selected-starter", chosen.name.toLowerCase());
              } catch { /* ignore */ }
              // Save to database (fire-and-forget)
              fetch("/api/cards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: cardData.name,
                  pokemon_id: cardData.pokemonId,
                  pokemon_name: cardData.pokemonName,
                  card_color: cardData.cardColor,
                  issue_date: cardData.issueDate,
                  card_no: cardData.cardNo,
                }),
              }).then(() => {
                window.dispatchEvent(new CustomEvent("trainer-card-saved"));
              }).catch(() => {/* ignore if DB unavailable */});
              sessionStorage.setItem("vr_intro_seen", "1");
              goTo("done");
              setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 400);
            }} disabled={!canEnter}
              style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", letterSpacing: "2px", padding: "13px 30px", marginTop: "24px", background: canEnter ? "#1a1a2e" : "#ccc", border: canEnter ? "3px solid #0a0a1a" : "3px solid #aaa", color: canEnter ? "#ffcc00" : "#888", borderRadius: "4px", cursor: canEnter ? "pointer" : "not-allowed", boxShadow: canEnter ? "4px 4px 0 #0a0a1a" : "4px 4px 0 #aaa", transition: "transform 0.1s, box-shadow 0.1s" }}
              onMouseEnter={e => { if (canEnter) { e.currentTarget.style.transform = "translate(1px,1px)"; e.currentTarget.style.boxShadow = "3px 3px 0 #0a0a1a"; } }}
              onMouseLeave={e => { if (canEnter) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0 #0a0a1a"; } }}>
              ENTER ▶
            </button>
            <p style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "#6a8a6a", marginTop: "12px", letterSpacing: "1px", textAlign: "center", lineHeight: 2 }}>
              {!chosen ? "← SELECT A STARTER" : "CARD SAVED TO GALLERY"}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
