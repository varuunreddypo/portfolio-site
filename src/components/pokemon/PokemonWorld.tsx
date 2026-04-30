"use client";

import { useState, useEffect, useRef } from "react";

const SPR = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

const TC: Record<string, string> = {
  grass: "#3d9a3d", fire: "#d4501a", water: "#2e6db0",
  electric: "#c9a200", normal: "#8a7858", poison: "#8a30a0",
};

type Mon = { id: number; name: string; types: string[]; pal: string[] };

const MONS: Mon[] = [
  { id: 1,   name: "Bulbasaur",  types: ["grass","poison"], pal: ["#2e6e2e","#5a2e8a","#4e6e10","#1e4a1e","#483828"] },
  { id: 4,   name: "Charmander", types: ["fire"],           pal: ["#c84010","#e06020","#a02808","#803010","#602010"] },
  { id: 7,   name: "Squirtle",   types: ["water"],          pal: ["#2060a8","#3480cc","#144080","#2a5888","#283060"] },
  { id: 25,  name: "Pikachu",    types: ["electric"],       pal: ["#c09800","#e0b800","#a07800","#806000","#504020"] },
  { id: 133, name: "Eevee",      types: ["normal"],         pal: ["#8a7050","#aa9068","#c8aa88","#6a5030","#483018"] },
  { id: 152, name: "Chikorita",  types: ["grass"],          pal: ["#309a38","#48b850","#207828","#185820","#38683a"] },
  { id: 155, name: "Cyndaquil",  types: ["fire"],           pal: ["#c04010","#e06820","#a03008","#803010","#503010"] },
  { id: 158, name: "Totodile",   types: ["water"],          pal: ["#1880a8","#28a0d0","#106080","#1a4060","#183050"] },
  { id: 252, name: "Treecko",    types: ["grass"],          pal: ["#287840","#3aaa50","#185828","#104020","#304828"] },
  { id: 255, name: "Torchic",    types: ["fire"],           pal: ["#d06818","#e88830","#b05010","#903810","#602810"] },
  { id: 258, name: "Mudkip",     types: ["water"],          pal: ["#3068c0","#4890e0","#2050a0","#183880","#283058"] },
  { id: 387, name: "Turtwig",    types: ["grass"],          pal: ["#488020","#60a038","#306010","#204808","#385828"] },
  { id: 390, name: "Chimchar",   types: ["fire"],           pal: ["#c03020","#e04838","#a01808","#801010","#501010"] },
  { id: 393, name: "Piplup",     types: ["water"],          pal: ["#2848a0","#3868c0","#183880","#103070","#283060"] },
  { id: 495, name: "Snivy",      types: ["grass"],          pal: ["#208038","#30a050","#106028","#084818","#305030"] },
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

type Phase = "landing" | "explore" | "entered" | "done";

function formatDate(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

function rndName() {
  return ADJS[Math.floor(Math.random() * ADJS.length)] + " " + NOUNS[Math.floor(Math.random() * NOUNS.length)];
}

// ─── Trainer Card (reused on both screens) ───────────────────────────────────
function TrainerCard({ chosen, trainerName, cardColor, cardNo, issueDate, size = "md" }: {
  chosen: Mon | null; trainerName: string; cardColor: string;
  cardNo: number; issueDate: string; size?: "md" | "lg";
}) {
  const w = size === "lg" ? 310 : 290;
  const fs = { title: size === "lg" ? "13px" : "12px", name: size === "lg" ? "12px" : "11px", lbl: size === "lg" ? "8px" : "7px" };
  return (
    <div style={{
      width: `${w}px`, borderRadius: "16px", padding: "22px",
      position: "relative", overflow: "hidden",
      background: cardColor, transition: "background .35s",
    }}>
      <div style={{ position: "absolute", right: 0, top: 0, width: "160px", height: "160px", opacity: 0.13, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.9) 1px,transparent 1px)", backgroundSize: "10px 10px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 55%)", pointerEvents: "none" }} />
      <div style={{ fontFamily: '"Space Mono",monospace', fontSize: fs.title, fontWeight: 700, color: "rgba(255,255,255,.95)", marginBottom: "14px" }}>
        Varuun&apos;s Pokè World
      </div>
      {chosen ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${SPR}${chosen.id}.png`} alt={chosen.name} width={70} height={70} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", imageRendering: "pixelated", opacity: 0.92, filter: "drop-shadow(2px 2px 6px rgba(0,0,0,.5))" }} />
      ) : (
        <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Press Start 2P",monospace', fontSize: "14px", color: "rgba(255,255,255,.2)" }}>?</div>
      )}
      <div style={{ fontFamily: '"Space Mono",monospace', fontSize: fs.lbl, color: "rgba(255,255,255,.55)", letterSpacing: "2px", marginBottom: "2px" }}>TRAINER</div>
      <div style={{ fontFamily: '"Space Mono",monospace', fontSize: fs.name, color: "rgba(255,255,255,.95)", fontWeight: 700, letterSpacing: "1px", marginBottom: "10px" }}>
        {trainerName.trim().toUpperCase() || "—"}
      </div>
      <div style={{ display: "flex", gap: "26px" }}>
        <div>
          <div style={{ fontFamily: '"Space Mono",monospace', fontSize: fs.lbl, color: "rgba(255,255,255,.55)", letterSpacing: "2px", marginBottom: "2px" }}>STARTER</div>
          <div style={{ fontFamily: '"Space Mono",monospace', fontSize: fs.name, color: "rgba(255,255,255,.95)", fontWeight: 700 }}>{chosen ? chosen.name.toUpperCase() : "—"}</div>
        </div>
        <div>
          <div style={{ fontFamily: '"Space Mono",monospace', fontSize: fs.lbl, color: "rgba(255,255,255,.55)", letterSpacing: "2px", marginBottom: "2px" }}>ISSUED ON</div>
          <div style={{ fontFamily: '"Space Mono",monospace', fontSize: fs.name, color: "rgba(255,255,255,.95)", fontWeight: 700 }}>{issueDate}</div>
        </div>
      </div>
      <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "7px", color: "rgba(255,255,255,.38)", marginTop: "10px" }}>
        NO. {cardNo}&nbsp;&nbsp;&nbsp;X ——————————
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PokemonWorld() {
  const [phase, setPhase]       = useState<Phase>("landing");
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
  }, []);

  // Stars — only animates during landing
  useEffect(() => {
    if (phase !== "landing") {
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

  // Auto-redirect after "entered" screen
  useEffect(() => {
    if (phase !== "entered") return;
    const t1 = setTimeout(() => setFlash(true), 2600);
    const t2 = setTimeout(() => { setPhase("done"); setFlash(false); }, 2900);
    const t3 = setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  function goTo(next: Phase) {
    setFlash(true);
    setTimeout(() => { setPhase(next); setFlash(false); }, 230);
  }

  const cardColor = chosen ? chosen.pal[activeColIdx] : "#2a2a40";
  const canEnter  = !!chosen && trainerName.trim().length > 0;

  if (phase === "done") return <div style={{ height: 0 }} />;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <style>{`
        @keyframes pfu   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pbspin{ 0%{transform:rotate(0)scale(1)} 25%{transform:rotate(90deg)scale(1.06)} 50%{transform:rotate(180deg)scale(1)} 75%{transform:rotate(270deg)scale(1.06)} 100%{transform:rotate(360deg)scale(1)} }
        @keyframes sw    { 0%,100%{transform:rotate(-7deg)} 50%{transform:rotate(7deg)} }
        @keyframes cardUp{ from{opacity:0;transform:translateY(40px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
        @keyframes dotIn { from{opacity:0} to{opacity:1} }
      `}</style>

      {/* Flash overlay */}
      <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 999, opacity: flash ? 1 : 0, pointerEvents: "none", transition: "opacity .22s" }} />

      {/* ── LANDING ── */}
      {phase === "landing" && (
        <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#09091a", fontFamily: '"Press Start 2P",monospace', zIndex: 100, overflow: "hidden" }}>
          <canvas ref={starsRef} style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />
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
          <button onClick={() => goTo("explore")}
            style={{ animation: "pfu .7s 1.3s ease both", padding: "13px 26px", background: "transparent", border: "3px solid #ffcc00", color: "#ffcc00", fontFamily: '"Press Start 2P",monospace', fontSize: "11px", cursor: "pointer", letterSpacing: "2px", marginTop: "6px", transition: "background .15s,color .15s,transform .1s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ffcc00"; e.currentTarget.style.color = "#09091a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ffcc00"; }}>
            EXPLORE &nbsp;→
          </button>

          <button
            onClick={() => {
              setFlash(true);
              setTimeout(() => {
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
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "80px", background: "#123012", overflow: "hidden" }}>
            {grassBlades.map((b: GrassBlade, i: number) => (
              <div key={i} style={{ position: "absolute", bottom: 0, left: `${b.left}%`, width: `${b.width}px`, height: `${b.height}px`, background: "#1b621b", borderRadius: "40% 40% 0 0", transformOrigin: "bottom center", opacity: b.opacity, animation: `sw ${b.duration}s ${b.delay}s ease-in-out infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── EXPLORE: Starter Select + Visitor Card (split screen) ── */}
      {phase === "explore" && (
        <div style={{ position: "fixed", inset: 0, display: "flex", zIndex: 100 }}>

          {/* LEFT — Pokemon grid */}
          <div style={{ flex: 1, minWidth: 0, background: "#0d1117", overflowY: "auto", padding: "52px 28px 40px 28px", borderRight: "1px solid rgba(255,255,255,.06)" }}>
            <button onClick={() => goTo("landing")} style={{ background: "none", border: "none", fontFamily: '"Space Mono",monospace', fontSize: "11px", color: "#556", cursor: "pointer", letterSpacing: "2px", marginBottom: "22px", display: "block" }}
              onMouseEnter={e => e.currentTarget.style.color = "#aaa"} onMouseLeave={e => e.currentTarget.style.color = "#556"}>
              ← BACK
            </button>
            <h2 style={{ fontFamily: '"Press Start 2P",monospace', color: "#ffcc00", fontSize: "clamp(9px,1.3vw,13px)", marginBottom: "6px", textShadow: "3px 3px 0 #886600" }}>CHOOSE YOUR STARTER!</h2>
            <p style={{ fontFamily: '"Press Start 2P",monospace', color: "#334", fontSize: "6px", letterSpacing: "2px", marginBottom: "22px" }}>pick one to receive your trainer card</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: "10px" }}>
              {MONS.map(p => {
                const isChosen = chosen?.id === p.id;
                const bc = TC[p.types[0]] ?? "#ffcc00";
                return (
                  <div key={p.id} onClick={() => { setChosen(p); setActiveColIdx(0); }}
                    style={{ background: "#161b22", border: isChosen ? `3px solid ${bc}` : "2px solid #22283a", borderRadius: "11px", padding: "14px 6px 10px", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "border-color .18s,transform .14s,box-shadow .18s", position: "relative", userSelect: "none", transform: isChosen ? "translateY(-4px)" : "none", boxShadow: isChosen ? `0 0 18px ${bc}44` : "none" }}>
                    {isChosen && (
                      <div style={{ position: "absolute", top: "7px", right: "7px", width: "18px", height: "18px", borderRadius: "50%", background: "#ffcc00", color: "#111", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✓</div>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${SPR}${p.id}.png`} alt={p.name} width={64} height={64} style={{ imageRendering: "pixelated", filter: "drop-shadow(0 2px 5px rgba(0,0,0,.5))" }} />
                    <div style={{ fontFamily: '"Press Start 2P",monospace', color: "#ccd", fontSize: "5px", marginTop: "8px", textAlign: "center" }}>{p.name.toUpperCase()}</div>
                    <div style={{ display: "flex", gap: "3px", marginTop: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                      {p.types.map(t => <span key={t} style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "4px", padding: "3px 5px", borderRadius: "3px", color: "#fff", background: TC[t] ?? "#555" }}>{t}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Visitor Card */}
          <div style={{ flex: 1, minWidth: 0, background: "#f0ede6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", overflowY: "auto" }}>
            <p style={{ fontFamily: '"Space Mono",monospace', color: "#333", fontSize: "12px", letterSpacing: "4px", marginBottom: "4px" }}>WELCOME, TRAINER.</p>
            <p style={{ fontFamily: '"Space Mono",monospace', color: "#888", fontSize: "9px", letterSpacing: "3px", marginBottom: "20px" }}>I HOPE YOU ENJOY YOUR TIME HERE.</p>

            {/* Name input */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
              <span style={{ fontFamily: '"Space Mono",monospace', color: "#666", fontSize: "10px", letterSpacing: "2px" }}>NAME:</span>
              <input value={trainerName} onChange={e => setTrainerName(e.target.value.slice(0, 18))} placeholder="YOUR NAME"
                style={{ fontFamily: '"Space Mono",monospace', fontSize: "11px", letterSpacing: "2px", padding: "8px 12px", border: "1px solid #ddd", background: "#fff", color: "#333", borderRadius: "6px", width: "155px", outline: "none", textTransform: "uppercase" }} />
              <button onClick={() => setTrainerName(rndName())}
                style={{ background: "#f0ede6", border: "1px solid #ccc", width: "32px", height: "32px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#777", fontSize: "16px" }}>↻</button>
            </div>

            {/* Card preview */}
            <TrainerCard chosen={chosen} trainerName={trainerName} cardColor={cardColor} cardNo={cardNo} issueDate={issueDate} />

            {/* Color palette */}
            <div style={{ display: "flex", gap: "8px", margin: "16px 0 20px" }}>
              {(chosen ? chosen.pal : Array(5).fill("#2a2a40")).map((col, i) => (
                <div key={i} onClick={() => setActiveColIdx(i)}
                  style={{ width: "26px", height: "26px", borderRadius: "50%", cursor: "pointer", background: col, border: activeColIdx === i ? "2px solid #333" : "2px solid transparent", transform: activeColIdx === i ? "scale(1.18)" : "scale(1)", transition: "transform .14s", boxShadow: activeColIdx === i ? "0 0 0 2px #333" : "none", opacity: chosen ? 1 : 0.25 }} />
              ))}
            </div>

            {/* Enter button */}
            <button onClick={() => {
              if (!canEnter || !chosen) return;
              try {
                const existing = JSON.parse(localStorage.getItem("vr_trainer_cards") ?? "[]");
                localStorage.setItem("vr_trainer_cards", JSON.stringify([...existing, {
                  id: Date.now(), name: trainerName.trim().toUpperCase(),
                  pokemonId: chosen.id, pokemonName: chosen.name,
                  cardColor, issueDate, cardNo,
                }]));
              } catch { /* ignore */ }
              goTo("entered");
            }} disabled={!canEnter}
              style={{ fontFamily: '"Space Mono",monospace', fontSize: "12px", letterSpacing: "3px", padding: "13px 32px", background: canEnter ? "#1a1a2e" : "#ddd", border: "none", color: canEnter ? "#fff" : "#aaa", borderRadius: "8px", cursor: canEnter ? "pointer" : "not-allowed", transition: "background .15s" }}
              onMouseEnter={e => { if (canEnter) e.currentTarget.style.background = "#2a2a4e"; }}
              onMouseLeave={e => { if (canEnter) e.currentTarget.style.background = "#1a1a2e"; }}>
              ENTER &nbsp;→
            </button>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: "7px", color: "#aaa", marginTop: "10px", letterSpacing: "1px", textAlign: "center" }}>
              {!chosen ? "← select a starter first" : "your card will appear in the visitor gallery"}
            </p>
          </div>
        </div>
      )}

      {/* ── ENTERED (auto-redirects in ~2.8s) ── */}
      {phase === "entered" && chosen && (
        <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f0ede6", zIndex: 100, padding: "24px" }}>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: "clamp(14px,2vw,20px)", letterSpacing: "5px", color: "#222", marginBottom: "6px", animation: "popIn .5s .1s ease both" }}>
            YOU&apos;RE IN! 🎉
          </p>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: "9px", color: "#999", letterSpacing: "2px", marginBottom: "32px", animation: "pfu .5s .25s ease both" }}>
            YOUR TRAINER CARD HAS BEEN ISSUED.
          </p>

          <div style={{ animation: "cardUp .65s .35s ease both" }}>
            <TrainerCard chosen={chosen} trainerName={trainerName} cardColor={cardColor} cardNo={cardNo} issueDate={issueDate} size="lg" />
          </div>

          {/* Animated dots — redirecting indicator */}
          <div style={{ display: "flex", gap: "8px", marginTop: "28px", animation: "pfu .5s 1s ease both" }}>
            {[0.2, 0.4, 0.6].map((d, i) => (
              <div key={i} style={{
                width: "7px", height: "7px", borderRadius: "50%", background: cardColor,
                animation: `dotIn .6s ${d + 1}s ease both`,
                opacity: 0,
              }} />
            ))}
          </div>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: "8px", color: "#bbb", marginTop: "12px", letterSpacing: "2px", animation: "pfu .5s 1.2s ease both" }}>
            taking you to the portfolio...
          </p>
        </div>
      )}
    </div>
  );
}
