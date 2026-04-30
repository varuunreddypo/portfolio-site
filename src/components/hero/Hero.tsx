"use client";

import { useEffect, useRef, useState } from "react";

const DOMAINS = [
  { label: "HEALTHCARE", color: "#e05a5a", bg: "#2a1010" },
  { label: "B2B SAAS",   color: "#5a8ae0", bg: "#0f1a2e" },
  { label: "EDTECH",     color: "#e0a85a", bg: "#2a1e08" },
  { label: "EV TECH",    color: "#5ae07a", bg: "#0a2010" },
  { label: "PROPTECH",   color: "#a05ae0", bg: "#1a0a2e" },
];

const STATS = [
  { name: "RESEARCH",    val: 88, color: "#f472b6" },
  { name: "VISUAL",      val: 94, color: "#a78bfa" },
  { name: "INTERACTION", val: 86, color: "#38bdf8" },
  { name: "SYSTEMS",     val: 82, color: "#34d399" },
  { name: "SHIPPING",    val: 91, color: "#fb923c" },
];

const MOVES = [
  { name: "FIGMA",         type: "DESIGN",   color: "#a78bfa" },
  { name: "USER RESEARCH", type: "PSYCHIC",  color: "#f472b6" },
  { name: "PROTOTYPING",   type: "STEEL",    color: "#94a3b8" },
  { name: "WCAG / A11Y",   type: "FAIRY",    color: "#fb7185" },
];

const STAR_DATA = Array.from({ length: 120 }, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() * 1.2 + 0.2,
  ph: Math.random() * Math.PI * 2,
  sp: 0.006 + Math.random() * 0.01,
}));

const CONTACT_EMAIL = "varuunreddypo@gmail.com";

export default function Hero() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Stat bar animation on scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Stars background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    let alive = true;
    function tick(t: number) {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      STAR_DATA.forEach(s => {
        const a = 0.12 + 0.28 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
        ctx.beginPath();
        ctx.arc(s.x * canvas!.width, s.y * canvas!.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; ro.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ background: "#09091a", padding: "80px 24px", position: "relative", overflow: "hidden" }}
    >
      <style>{`
        @keyframes statFill { from { width: 0 } to { width: var(--val) } }
        @keyframes blinkCursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes heroFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* Stars canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />

      {/* Subtle scanline */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "rgba(255,204,0,.03)", animation: "scanline 6s linear infinite" }} />
      </div>

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,204,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,204,0,.025) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* ── Pokédex header bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", animation: "heroFadeUp .6s ease both" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#e05a5a", boxShadow: "0 0 8px #e05a5a88" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#e0a85a" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#5ae07a" }} />
          <div style={{ flex: 1, height: "2px", background: "rgba(255,204,0,.15)", borderRadius: "1px" }} />
          <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", color: "#ffcc00", letterSpacing: "4px", opacity: 0.7 }}>POKÉDEX — DESIGNER EDITION</span>
          <div style={{ flex: 1, height: "2px", background: "rgba(255,204,0,.15)", borderRadius: "1px" }} />
        </div>

        {/* ── Main panel ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "40px",
          background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,204,0,.15)",
          borderRadius: "4px", padding: "40px",
          boxShadow: "0 0 60px rgba(255,204,0,.04), inset 0 0 40px rgba(0,0,0,.3)",
        }}>

          {/* ── LEFT — Sprite / Photo ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "heroFadeUp .7s .1s ease both", opacity: 0, animationFillMode: "forwards" }}>
            {/* Photo box */}
            <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "4px", overflow: "hidden", border: "2px solid rgba(255,204,0,.2)", background: "linear-gradient(160deg,#0d1117 0%,#1a1a2e 60%,#0d0d1a 100%)" }}>
              {/* Corner accents */}
              {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i) => (
                <div key={i} style={{ position: "absolute", [v]: "-1px", [h]: "-1px", width: "16px", height: "16px", borderTop: v==="top" ? "3px solid #ffcc00" : "none", borderBottom: v==="bottom" ? "3px solid #ffcc00" : "none", borderLeft: h==="left" ? "3px solid #ffcc00" : "none", borderRight: h==="right" ? "3px solid #ffcc00" : "none" }} />
              ))}
              {/* Ambient glow blobs */}
              <div style={{ position: "absolute", width: "160px", height: "160px", top: "5%", right: "5%", background: "radial-gradient(circle,rgba(100,80,220,.2) 0%,transparent 70%)", filter: "blur(30px)" }} />
              <div style={{ position: "absolute", width: "120px", height: "120px", bottom: "15%", left: "5%", background: "radial-gradient(circle,rgba(255,204,0,.1) 0%,transparent 70%)", filter: "blur(25px)" }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-photo.png"
                alt="Varuun Reddy"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              />
            </div>

            {/* Trainer info chips */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                ["LOCATION", "DALLAS, TX"],
                ["EXPERIENCE", "7 YEARS"],
                ["STATUS", "OPEN TO WORK"],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,204,0,.08)", borderRadius: "3px" }}>
                  <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,204,0,.5)", letterSpacing: "1px" }}>{label}</span>
                  <span style={{ fontFamily: '"Space Mono",monospace', fontSize: "12px", color: "rgba(255,255,255,.75)", fontWeight: 700, letterSpacing: "1px" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Info ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Name + number */}
            <div style={{ animation: "heroFadeUp .7s .2s ease both", opacity: 0, animationFillMode: "forwards" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "11px", color: "rgba(255,204,0,.5)", letterSpacing: "3px" }}>NO.001</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,204,0,.15)" }} />
              </div>
              <h1 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(18px,2.6vw,28px)", color: "#fff", letterSpacing: "2px", lineHeight: 1.5, margin: 0, textShadow: "0 0 30px rgba(255,204,0,.2)" }}>
                VARUUN REDDY
              </h1>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: "15px", color: "#ffcc00", letterSpacing: "4px", marginTop: "6px", opacity: 0.8 }}>
                PRODUCT DESIGNER
                <span style={{ display: "inline-block", width: "2px", height: "14px", background: "#ffcc00", marginLeft: "4px", verticalAlign: "middle", animation: "blinkCursor 1.1s step-end infinite" }} />
              </p>
            </div>

            {/* Domain types */}
            <div style={{ animation: "heroFadeUp .7s .3s ease both", opacity: 0, animationFillMode: "forwards" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(255,255,255,.3)", letterSpacing: "3px", marginBottom: "10px" }}>EXPERTISE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {DOMAINS.map(d => (
                  <span key={d.label} style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", padding: "6px 12px", borderRadius: "3px", color: d.color, background: d.bg, border: `1px solid ${d.color}44`, letterSpacing: "1px" }}>
                    {d.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Stat bars */}
            <div style={{ animation: "heroFadeUp .7s .4s ease both", opacity: 0, animationFillMode: "forwards" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(255,255,255,.3)", letterSpacing: "3px", marginBottom: "12px" }}>BASE STATS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {STATS.map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,.45)", letterSpacing: "1px", width: "100px", flexShrink: 0 }}>{s.name}</span>
                    <div style={{ flex: 1, height: "7px", background: "rgba(255,255,255,.06)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: "3px",
                        background: `linear-gradient(90deg,${s.color}88,${s.color})`,
                        boxShadow: `0 0 8px ${s.color}66`,
                        width: statsVisible ? `${s.val}%` : "0%",
                        transition: `width 1.2s cubic-bezier(.22,1,.36,1) ${STATS.indexOf(s) * 0.1}s`,
                      }} />
                    </div>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: "12px", color: s.color, fontWeight: 700, width: "34px", textAlign: "right" }}>{mounted && statsVisible ? s.val : 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Moves */}
            <div style={{ animation: "heroFadeUp .7s .5s ease both", opacity: 0, animationFillMode: "forwards" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(255,255,255,.3)", letterSpacing: "3px", marginBottom: "12px" }}>MOVE SET</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {MOVES.map(m => (
                  <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(255,255,255,.03)", border: `1px solid ${m.color}33`, borderRadius: "3px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: m.color, flexShrink: 0, boxShadow: `0 0 6px ${m.color}` }} />
                    <div>
                      <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,.8)", letterSpacing: "0.5px" }}>{m.name}</div>
                      <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: m.color, marginTop: "4px", opacity: 0.7 }}>{m.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div style={{ animation: "heroFadeUp .7s .6s ease both", opacity: 0, animationFillMode: "forwards" }}>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: "13px", color: "rgba(255,255,255,.5)", lineHeight: "1.9", letterSpacing: "0.5px", borderLeft: "2px solid rgba(255,204,0,.3)", paddingLeft: "14px", margin: 0 }}>
                Backed by complex products shipped at scale across healthcare, B2B SaaS, EdTech, EV & PropTech. UX decisions with real human and operational consequences.
              </p>
            </div>

            {/* CTAs */}
            <div style={{ animation: "heroFadeUp .7s .7s ease both", opacity: 0, animationFillMode: "forwards" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a href="/Varuun_Reddy_Resume.pdf" download
                  style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", padding: "13px 22px", background: "#ffcc00", color: "#09091a", borderRadius: "3px", textDecoration: "none", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px", transition: "opacity .15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.85"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                >
                  ⬇ RESUME
                </a>
                <a href="https://www.linkedin.com/in/varuun-reddy-pochampally" target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", padding: "13px 22px", background: "transparent", color: "#ffcc00", border: "2px solid rgba(255,204,0,.4)", borderRadius: "3px", textDecoration: "none", letterSpacing: "1px", transition: "border-color .15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#ffcc00"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,204,0,.4)"}
                >
                  LINKEDIN
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 3000);
                    });
                  }}
                  style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", padding: "13px 22px", background: copied ? "rgba(255,204,0,.12)" : "transparent", color: "#ffcc00", border: `2px solid ${copied ? "#ffcc00" : "rgba(255,204,0,.4)"}`, borderRadius: "3px", letterSpacing: "1px", cursor: "pointer", transition: "border-color .15s,background .15s" }}
                  onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLElement).style.borderColor = "#ffcc00"; }}
                  onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,204,0,.4)"; }}
                >
                  {copied ? "✓ COPIED!" : "✉ CONTACT"}
                </button>
              </div>
              {/* Email display after copy */}
              <div style={{ marginTop: "10px", height: "18px", overflow: "hidden" }}>
                <div style={{
                  fontFamily: '"Space Mono",monospace', fontSize: "12px", color: "#ffcc00",
                  letterSpacing: "1px", opacity: copied ? 0.7 : 0,
                  transform: copied ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity .25s, transform .25s",
                }}>
                  ↳ {CONTACT_EMAIL}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "24px", animation: "heroFadeUp .6s .8s ease both", opacity: 0, animationFillMode: "forwards" }}>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,204,0,.08)" }} />
          <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(255,204,0,.3)", letterSpacing: "3px" }}>
            ▼ &nbsp; SCROLL TO VIEW WORK &nbsp; ▼
          </span>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,204,0,.08)" }} />
        </div>

      </div>
    </section>
  );
}
