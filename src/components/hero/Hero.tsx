"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const DOMAINS = [
  { label: "HEALTHCARE", color: "#e05a5a", bg: "#2a1010" },
  { label: "B2B SAAS",   color: "#5a8ae0", bg: "#0f1a2e" },
  { label: "EDTECH",     color: "#e0a85a", bg: "#2a1e08" },
  { label: "EV TECH",    color: "#5ae07a", bg: "#0a2010" },
  { label: "UTILITY",    color: "#a05ae0", bg: "#1a0a2e" },
  { label: "RETAIL",     color: "#2dd4bf", bg: "#051a1a" },
];

const STATS = [
  { name: "RESEARCH",    val: 88, color: "#f472b6" },
  { name: "CRAFT",       val: 94, color: "#a78bfa" },
  { name: "INTERACTION", val: 86, color: "#38bdf8" },
  { name: "LOGIC",       val: 82, color: "#34d399" },
  { name: "DELIVERY",    val: 91, color: "#fb923c" },
];

const MOVES = [
  { name: "FIGMA",         type: "DESIGN",   color: "#a78bfa" },
  { name: "USER RESEARCH", type: "PSYCHIC",  color: "#f472b6" },
  { name: "PROTOTYPING",   type: "ELECTRIC", color: "#f4d03f" },
  { name: "WCAG / A11Y",   type: "FIGHTING", color: "#e8613c" },
];

const ROLES = ["PRODUCT DESIGNER", "UX ENGINEER", "DESIGN SYSTEMS LEAD", "INTERACTION DESIGNER"];

const STAR_DATA = Array.from({ length: 120 }, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() * 1.2 + 0.2,
  ph: Math.random() * Math.PI * 2,
  sp: 0.006 + Math.random() * 0.01,
}));

const CONTACT_EMAIL = "varuunreddypo@gmail.com";
const LINE1 = "Trained in UX, data, and product thinking.";
const LINE2 = "Evolved to build things that actually work.";

function PokeballSVG({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 50 A45 45 0 0 1 95 50 Z" fill="#E63946" />
      <path d="M5 50 A45 45 0 0 0 95 50 Z" fill="#F4F4F4" />
      <rect x="5" y="46" width="90" height="8" fill="#1A1A1A" />
      <circle cx="50" cy="50" r="14" fill="#1A1A1A" />
      <circle cx="50" cy="50" r="9" fill="#F4F4F4" />
      <circle cx="46" cy="46" r="3" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}

export default function Hero() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [mounted, setMounted]           = useState(false);
  const [copied, setCopied]             = useState(false);
  const [statCounts, setStatCounts]     = useState(STATS.map(() => 0));
  const [line1, setLine1]               = useState("");
  const [line2, setLine2]               = useState("");
  const [twPhase, setTwPhase]           = useState<"l1" | "l2" | "done">("l1");
  const [roleIdx, setRoleIdx]           = useState(0);
  const [roleText, setRoleText]         = useState("");
  const [isDeleting, setIsDeleting]     = useState(false);

  // ── Intro animation ──────────────────────────────────────────────────────
  const introRanRef = useRef(false);
  const [borderGlow, setBorderGlow] = useState(false);

  const ballControls       = useAnimation();
  const flashControls      = useAnimation();
  const caughtTextControls = useAnimation();

  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number | null>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const pikachuRef  = useRef<HTMLImageElement>(null);

  // ── Mount ────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    setStatsVisible(false);
    setStatCounts(STATS.map(() => 0));
    setLine1(""); setLine2(""); setTwPhase("l1");
  }, []);

  // ── Intro sequence (once per session) ────────────────────────────────────
  useEffect(() => {
    if (introRanRef.current) return;
    introRanRef.current = true;

    if (sessionStorage.getItem("intro-played")) return;
    sessionStorage.setItem("intro-played", "1");

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let cancelled = false;

    (async () => {
      // Wait one frame so the card has painted and getBoundingClientRect is accurate
      await new Promise(r => requestAnimationFrame(r));
      if (cancelled) return;

      const wRect = wrapperRef.current?.getBoundingClientRect();
      const pRect = pikachuRef.current?.getBoundingClientRect();

      // Offset from the wrapper's centre to the Pikachu GIF's centre
      const landX = (wRect && pRect)
        ? (pRect.left + pRect.width  / 2) - (wRect.left + wRect.width  / 2)
        : 0;
      const landY = (wRect && pRect)
        ? (pRect.top  + pRect.height / 2) - (wRect.top  + wRect.height / 2)
        : 0;

      // Phase 1 — ball falls from above the Pikachu
      ballControls.set({ x: landX, y: -600, rotate: -360, scaleX: 1, scaleY: 1, opacity: 1 });
      await ballControls.start({
        y: landY, rotate: 0,
        transition: { duration: 0.5, ease: [0.0, 0.0, 0.8, 1.0] },
      });
      if (cancelled) return;

      // Phase 2 — squash on landing, pop up, settle
      await ballControls.start({
        y:      [landY,      landY,      landY - 50, landY],
        scaleX: [1,          1.28,       0.9,        1],
        scaleY: [1,          0.74,       1.15,       1],
        transition: { duration: 0.32, ease: "easeOut", times: [0, 0.2, 0.6, 1] },
      });
      if (cancelled) return;

      // Phase 3 — struggle shakes
      await ballControls.start({
        x:      [landX, landX - 20, landX + 17, landX - 13, landX + 9, landX - 5, landX + 2, landX],
        rotate: [0,     -20,        17,         -13,        9,         -5,        2,         0],
        transition: { duration: 0.48, ease: "linear" },
      });
      if (cancelled) return;

      // Phase 4 — caught text rises above the ball
      caughtTextControls.set({ x: landX, y: landY - 68, opacity: 0 });
      await caughtTextControls.start({
        opacity: 1,
        y: landY - 80,
        transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] },
      });
      if (cancelled) return;

      // Brief pause so the player can read it
      await new Promise(r => setTimeout(r, 550));
      if (cancelled) return;

      // Phase 5 — burst: ball expands, flash fires, text fades with ball
      await Promise.all([
        ballControls.start({
          scale:   [1, 1.4, 3.5],
          opacity: [1, 1,   0  ],
          transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
        }),
        flashControls.start({
          opacity: [0, 1, 0],
          transition: { duration: 0.35, ease: "linear" },
        }),
        caughtTextControls.start({
          opacity: [1, 0],
          transition: { duration: 0.2, ease: "linear" },
        }),
      ]);
      if (cancelled) return;

      setBorderGlow(true);
      setTimeout(() => setBorderGlow(false), 550);
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Stat count-up ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!statsVisible) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    STATS.forEach((s, i) => {
      timers.push(setTimeout(() => {
        const steps = 40; const intervalMs = 1200 / steps; let step = 0;
        const iv = setInterval(() => {
          step++;
          const val = step >= steps ? s.val : Math.round((s.val / steps) * step);
          setStatCounts(prev => { const n = [...prev]; n[i] = val; return n; });
          if (step >= steps) clearInterval(iv);
        }, intervalMs);
      }, i * 80));
    });
    return () => timers.forEach(clearTimeout);
  }, [statsVisible]);

  // ── Bio typewriter ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    let iv1: ReturnType<typeof setInterval>;
    let iv2: ReturnType<typeof setInterval>;
    const t0 = setTimeout(() => {
      let i = 0;
      iv1 = setInterval(() => {
        i++; setLine1(LINE1.slice(0, i));
        if (i >= LINE1.length) {
          clearInterval(iv1); setTwPhase("l2");
          setTimeout(() => {
            let j = 0;
            iv2 = setInterval(() => {
              j++; setLine2(LINE2.slice(0, j));
              if (j >= LINE2.length) { clearInterval(iv2); setTwPhase("done"); }
            }, 38);
          }, 350);
        }
      }, 38);
    }, 1400);
    return () => { clearTimeout(t0); clearInterval(iv1); clearInterval(iv2); };
  }, [mounted]);

  // ── Role cycling typewriter ──────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const currentWord = ROLES[roleIdx];
    if (!isDeleting && roleText === currentWord) {
      const t = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(t);
    } else if (isDeleting && roleText === "") {
      setIsDeleting(false);
      setRoleIdx(prev => (prev + 1) % ROLES.length);
    } else {
      const t = setTimeout(() => {
        setRoleText(prev => isDeleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1));
      }, isDeleting ? 40 : 70);
      return () => clearTimeout(t);
    }
  }, [mounted, roleText, isDeleting, roleIdx]);

  // ── Stats intersection trigger ───────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.25 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  // ── Stars canvas ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    let alive = true;
    function tick(t: number) {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      STAR_DATA.forEach(s => {
        const a = 0.12 + 0.28 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
        ctx.beginPath(); ctx.arc(s.x * canvas!.width, s.y * canvas!.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
      } else {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      }
    }, { threshold: 0 });
    obs.observe(canvas);
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; ro.disconnect(); obs.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── Mouse glow ───────────────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--glow-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--glow-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    el.addEventListener("mousemove", handleMove, { passive: true });
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section id="about" ref={sectionRef}
      style={{
        background: "#09091a", minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "80px 24px 24px", boxSizing: "border-box",
        position: "relative", overflow: "hidden",
      }}>
      <style>{`
        @keyframes heroSlideDown { from{opacity:0;transform:translateY(-24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroSlideLeft { from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:translateX(0)} }
        @keyframes heroFadeUp    { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes badgePop      { 0%{opacity:0;transform:scale(0.75)} 65%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
        @keyframes blinkCursor   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes dotPulse      { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.35);opacity:0.65} }
        @keyframes statusPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.5)} 50%{box-shadow:0 0 0 4px rgba(74,222,128,0)} }
        @keyframes ledPulse      { 0%,100%{box-shadow:0 0 0 0 rgba(90,224,122,.6)} 50%{box-shadow:0 0 0 5px rgba(90,224,122,0)} }
        @keyframes pokeFloat     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes scanlineScroll{ 0%{background-position:0 0} 100%{background-position:0 8px} }
        @keyframes borderGlowPulse {
          0%   { box-shadow: 0 0 60px rgba(255,204,0,.06), inset 0 0 40px rgba(0,0,0,.3); }
          35%  { box-shadow: 0 0 0 2px rgba(255,204,0,.85), 0 0 80px rgba(255,204,0,.45), inset 0 0 40px rgba(0,0,0,.3); }
          100% { box-shadow: 0 0 60px rgba(255,204,0,.06), inset 0 0 40px rgba(0,0,0,.3); }
        }

        .hero-cta { position:relative; overflow:hidden; backface-visibility:hidden; }
        .hero-cta::after {
          content:''; position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.22) 50%,transparent 60%);
          transform:translateX(-100%); transition:transform 0s;
        }
        .hero-cta:hover::after { transform:translateX(150%); transition:transform 0.45s cubic-bezier(0.4,0,0.2,1); }
        .hero-cta:focus-visible { outline: 2px solid #ffcc00; outline-offset: 3px; border-radius: 3px; }

        .hero-glow {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background:radial-gradient(700px circle at var(--glow-x,50%) var(--glow-y,50%), rgba(255,204,0,0.045) 0%, transparent 60%);
        }

        .panel-border-glow {
          animation: borderGlowPulse 0.55s cubic-bezier(0.0,0.0,0.2,1) forwards;
        }
      `}</style>

      {/* ── Background layers ── */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
      <div className="hero-glow" />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)",
        animation: "scanlineScroll 0.35s linear infinite" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,204,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,204,0,.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px" }} />

      {/* ── Content wrapper: shared coordinate system for ball, flash, and caught text ── */}
      <div ref={wrapperRef} style={{ width: "100%", position: "relative", zIndex: 2 }}>

        {/* Flash — absolute, fills wrapper */}
        <motion.div
          animate={flashControls}
          initial={{ opacity: 0 }}
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 75%)",
          }}
        />

        {/* Pokéball — anchored at wrapper centre, x/y offset to Pikachu */}
        <motion.div
          animate={ballControls}
          initial={{ opacity: 0 }}
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: "96px", height: "96px",
            marginTop: "-48px", marginLeft: "-48px",
            pointerEvents: "none", zIndex: 60,
          }}
        >
          <PokeballSVG size={96} />
        </motion.div>

        {/* Caught text — appears above ball after struggle */}
        <motion.div
          animate={caughtTextControls}
          initial={{ opacity: 0 }}
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: "220px",
            marginLeft: "-110px",
            marginTop: "-14px",
            textAlign: "center",
            pointerEvents: "none", zIndex: 65,
          }}
        >
          <span style={{
            fontFamily: '"Press Start 2P",monospace',
            fontSize: "10px",
            color: "#ffcc00",
            letterSpacing: "3px",
            textShadow: "0 0 12px rgba(255,204,0,0.9), 0 0 28px rgba(255,204,0,0.5)",
            whiteSpace: "nowrap",
          }}>
            ★ CAUGHT ★
          </span>
        </motion.div>

        {/* Card — always visible */}
        <div style={{ width: "100%" }}>
        <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto", position: "relative" }}>

          {/* ── Header bar ── */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px",
            animationName: mounted ? "heroSlideDown" : "none",
            animationDuration: ".55s", animationTimingFunction: "cubic-bezier(0.0,0.0,0.2,1)",
            animationFillMode: "both", opacity: mounted ? undefined : 0, willChange: "transform, opacity",
          }}>
            <div style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#e05a5a", boxShadow: "0 0 8px #e05a5a88" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#e0a85a" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#5ae07a", animation: "ledPulse 2.5s ease-in-out infinite" }} />
            <div style={{ flex: 1, height: "1px", background: "rgba(255,204,0,.12)" }} />
            <span className="hero-dex-title" style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "11px", color: "#ffcc00", letterSpacing: "3px", opacity: 0.75 }}>
              POKÉDEX — DESIGNER EDITION
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,204,0,.12)" }} />
          </div>

          {/* ── Main panel ── */}
          <div
            className={`hero-panel-grid hero-panel${borderGlow ? " panel-border-glow" : ""}`}
            style={{
              display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "16px",
              background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,204,0,.2)",
              borderRadius: "8px", padding: "28px", position: "relative",
              boxShadow: "0 0 60px rgba(255,204,0,.06), inset 0 0 40px rgba(0,0,0,.3)",
            }}>
            {/* Corner screws */}
            {([{top:"8px",left:"8px"},{top:"8px",right:"8px"},{bottom:"8px",left:"8px"},{bottom:"8px",right:"8px"}] as React.CSSProperties[]).map((pos, i) => (
              <div key={i} style={{ position: "absolute", ...pos, width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,204,0,.1)", border: "1px solid rgba(255,204,0,.22)" }} />
            ))}

            {/* ── LEFT ── */}
            <div style={{
              display: "flex", flexDirection: "column", gap: "6px",
              animationName: mounted ? "heroSlideLeft" : "none",
              animationDuration: ".7s", animationDelay: ".1s",
              animationTimingFunction: "cubic-bezier(0.0,0.0,0.2,1)",
              animationFillMode: "forwards", opacity: 0, willChange: "transform, opacity",
            }}>
              {/* Character photo */}
              <div className="hero-photo-frame" style={{ position: "relative", flex: 1, minHeight: "300px", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(255,204,0,.25)", background: "linear-gradient(160deg,#0d1117 0%,#1a1a2e 60%,#0d0d1a 100%)" }}>
                {([["top","left"],["top","right"],["bottom","left"],["bottom","right"]] as [string,string][]).map(([v,h],i) => (
                  <div key={i} style={{ position: "absolute", [v]: "-1px", [h]: "-1px", width: "14px", height: "14px", zIndex: 3,
                    borderTop: v==="top" ? "2px solid #ffcc00" : "none", borderBottom: v==="bottom" ? "2px solid #ffcc00" : "none",
                    borderLeft: h==="left" ? "2px solid #ffcc00" : "none", borderRight: h==="right" ? "2px solid #ffcc00" : "none" }} />
                ))}
                <div style={{ position: "absolute", width: "160px", height: "160px", top: "5%", right: "5%", background: "radial-gradient(circle,rgba(100,80,220,.2) 0%,transparent 70%)", filter: "blur(30px)", zIndex: 0 }} />
                <div style={{ position: "absolute", width: "120px", height: "120px", bottom: "15%", left: "5%", background: "radial-gradient(circle,rgba(255,204,0,.1) 0%,transparent 70%)", filter: "blur(25px)", zIndex: 0 }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero-photo.png" alt="Varuun Reddy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", zIndex: 1 }} />
                <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
                  background: "radial-gradient(ellipse at center, transparent 50%, rgba(8,12,28,0.3) 85%, rgba(8,12,28,0.55) 100%), linear-gradient(to bottom, rgba(9,9,26,0.0) 0%, rgba(9,9,26,0.25) 100%)" }} />
              </div>

              {/* Trainer ID card */}
              <div style={{ border: "1px solid rgba(255,204,0,.1)", borderRadius: "4px", overflow: "hidden", background: "rgba(0,0,0,.15)" }}>
                <div style={{ padding: "8px 12px", background: "rgba(255,204,0,.05)", borderBottom: "1px solid rgba(255,204,0,.08)", fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "rgba(255,204,0,.35)", letterSpacing: "2px" }}>
                  TRAINER ID — #2026
                </div>
                {[
                  { label: "LOCATION",   val: "DALLAS, TX",   sub: "OPEN TO RELOC.", isStatus: false },
                  { label: "EXPERIENCE", val: "7 YEARS",       sub: null,             isStatus: false },
                  { label: "STATUS",     val: "OPEN TO WORK", sub: null,             isStatus: true  },
                ].map(({ label, val, sub, isStatus }, i, arr) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 12px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,204,0,.06)" : "none" }}>
                    <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(255,204,0,.45)", letterSpacing: "1px" }}>{label}</span>
                    {isStatus ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", flexShrink: 0, animation: "statusPulse 2s ease-in-out infinite" }} />
                        <span style={{ fontFamily: '"Space Mono",monospace', fontSize: "13px", color: "#4ade80", fontWeight: 700, letterSpacing: "0.5px" }}>{val}</span>
                      </span>
                    ) : (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "13px", color: "rgba(255,255,255,.75)", fontWeight: 700, letterSpacing: "0.5px" }}>{val}</div>
                        {sub && <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "11px", color: "rgba(255,255,255,.35)", marginTop: "1px" }}>{sub}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Name + cycling role */}
              <div style={{
                animationName: mounted ? "heroFadeUp" : "none",
                animationDuration: ".7s", animationDelay: ".2s",
                animationTimingFunction: "cubic-bezier(0.0,0.0,0.2,1)",
                animationFillMode: "forwards", opacity: 0, willChange: "transform, opacity",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                  <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "11px", color: "rgba(255,204,0,.5)", letterSpacing: "3px" }}>NO.001</span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,204,0,.15)" }} />
                </div>
                <h1 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(18px,2.6vw,28px)", color: "#fff", letterSpacing: "2px", lineHeight: 1.1, margin: 0, textShadow: "0 0 30px rgba(255,204,0,.2)" }}>
                  VARUUN REDDY
                </h1>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: "14px", color: "#ffcc00", letterSpacing: "4px", marginTop: "4px", opacity: 0.85, minHeight: "20px" }}>
                  {roleText}
                  <span style={{ display: "inline-block", width: "2px", height: "13px", background: "#ffcc00", marginLeft: "3px", verticalAlign: "middle", animation: "blinkCursor .7s step-end infinite" }} />
                </p>
              </div>

              {/* Expertise badges */}
              <div style={{
                animationName: mounted ? "heroFadeUp" : "none",
                animationDuration: ".7s", animationDelay: ".3s",
                animationTimingFunction: "cubic-bezier(0.0,0.0,0.2,1)",
                animationFillMode: "forwards", opacity: 0, willChange: "transform, opacity",
              }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(255,255,255,.3)", letterSpacing: "3px", marginBottom: "6px" }}>EXPERTISE</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {DOMAINS.map((d, i) => (
                    <span key={d.label}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.06)"; el.style.boxShadow = `0 0 12px ${d.color}55`; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1)"; el.style.boxShadow = "none"; }}
                      style={{
                        fontFamily: '"Press Start 2P",monospace', fontSize: "8px", padding: "5px 12px",
                        borderRadius: "3px", color: d.color, background: d.bg, border: `1px solid ${d.color}44`,
                        letterSpacing: "1px", display: "inline-block", cursor: "default",
                        minWidth: "88px", textAlign: "center",
                        animationName: mounted ? "badgePop" : "none",
                        animationDuration: ".45s", animationDelay: `${0.35 + i * 0.06}s`,
                        animationTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
                        animationFillMode: "forwards", opacity: 0,
                        transition: "transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 150ms ease",
                      }}>
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stat bars */}
              <div style={{
                animationName: mounted ? "heroFadeUp" : "none",
                animationDuration: ".7s", animationDelay: ".4s",
                animationTimingFunction: "cubic-bezier(0.0,0.0,0.2,1)",
                animationFillMode: "forwards", opacity: 0, willChange: "transform, opacity",
                borderTop: "1px solid rgba(255,204,0,.08)", borderBottom: "1px solid rgba(255,204,0,.08)",
                padding: "12px 0",
              }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(255,255,255,.3)", letterSpacing: "3px", marginBottom: "6px" }}>BASE STATS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {STATS.map((s, i) => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,.45)", letterSpacing: "1px", width: "100px", flexShrink: 0 }}>{s.name}</span>
                      <div style={{ flex: 1, position: "relative" }}>
                        <div style={{ height: "6px", background: "rgba(255,255,255,.06)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: "100%",
                            background: `linear-gradient(90deg,${s.color}88,${s.color})`,
                            boxShadow: `0 0 8px ${s.color}66`,
                            transform: statsVisible ? `scaleX(${s.val / 100})` : "scaleX(0)",
                            transformOrigin: "left center",
                            transition: `transform 1.2s cubic-bezier(0.0,0.0,0.2,1) ${i * 0.08}s`,
                            willChange: "transform",
                          }} />
                        </div>
                        <div style={{ position: "absolute", right: 0, top: "-2px", width: "1px", height: "10px", background: "rgba(255,255,255,.18)" }} />
                      </div>
                      <span style={{ fontFamily: '"Space Mono",monospace', fontSize: "11px", color: s.color, fontWeight: 700, width: "30px", textAlign: "right" }}>
                        {mounted ? statCounts[i] : 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Move set */}
              <div style={{
                animationName: mounted ? "heroFadeUp" : "none",
                animationDuration: ".7s", animationDelay: ".5s",
                animationTimingFunction: "cubic-bezier(0.0,0.0,0.2,1)",
                animationFillMode: "forwards", opacity: 0, willChange: "transform, opacity",
              }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(255,255,255,.3)", letterSpacing: "3px", marginBottom: "6px" }}>MOVE SET</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {MOVES.map((m, i) => (
                    <div key={m.name}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.borderColor = `${m.color}77`; el.style.boxShadow = `0 4px 14px ${m.color}22`; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.borderColor = `${m.color}33`; el.style.boxShadow = "none"; }}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px",
                        background: "rgba(255,255,255,.03)", border: `1px solid ${m.color}33`, borderRadius: "3px",
                        cursor: "pointer",
                        transition: "transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 150ms ease",
                      }}>
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%", background: m.color, flexShrink: 0,
                        boxShadow: `0 0 6px ${m.color}`,
                        animation: `dotPulse 2.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.3}s infinite`,
                      }} />
                      <div>
                        <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,.85)", letterSpacing: "0.5px" }}>{m.name}</div>
                        <span style={{
                          display: "inline-block", marginTop: "8px",
                          fontFamily: '"Press Start 2P",monospace', fontSize: "5px", letterSpacing: "0.5px",
                          padding: "2px 6px", borderRadius: "2px",
                          background: `${m.color}1a`, border: `1px solid ${m.color}44`, color: m.color,
                        }}>{m.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio — typewriter */}
              <div style={{
                animationName: mounted ? "heroFadeUp" : "none",
                animationDuration: ".7s", animationDelay: ".6s",
                animationTimingFunction: "cubic-bezier(0.0,0.0,0.2,1)",
                animationFillMode: "forwards", opacity: 0, willChange: "transform, opacity",
                borderLeft: "2px solid rgba(255,204,0,.5)", paddingLeft: "14px",
                display: "flex", flexDirection: "column", gap: "8px",
              }}>
                {/* Hidden ref target keeps the Pokéball animation landing position */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={pikachuRef} src="https://play.pokemonshowdown.com/sprites/ani/pikachu.gif" alt="" aria-hidden="true" style={{ display: "none" }} />
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: "13px", color: "rgba(255,255,255,.5)", letterSpacing: "0.5px" }}>
                  {mounted ? line1 : LINE1}
                  {twPhase === "l1" && <span style={{ display: "inline-block", width: "2px", height: "12px", background: "rgba(255,255,255,.5)", marginLeft: "2px", verticalAlign: "middle", animation: "blinkCursor .7s step-end infinite" }} />}
                </span>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: "13px", color: "rgba(255,255,255,.5)", letterSpacing: "0.5px" }}>
                  {mounted ? line2 : LINE2}
                  {twPhase === "l2" && <span style={{ display: "inline-block", width: "2px", height: "12px", background: "rgba(255,255,255,.5)", marginLeft: "2px", verticalAlign: "middle", animation: "blinkCursor .7s step-end infinite" }} />}
                </span>
              </div>

              {/* CTAs — LinkedIn + Contact, centred */}
              <div style={{
                animationName: mounted ? "heroFadeUp" : "none",
                animationDuration: ".7s", animationDelay: ".7s",
                animationTimingFunction: "cubic-bezier(0.0,0.0,0.2,1)",
                animationFillMode: "forwards", opacity: 0, willChange: "transform, opacity",
                marginTop: "20px", position: "relative",
              }}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                  <a href="https://www.linkedin.com/in/varuun-reddy-pochampally" target="_blank" rel="noopener noreferrer" className="hero-cta"
                    style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", padding: "10px 18px", background: "transparent", color: "#ffcc00", border: "1px solid rgba(255,204,0,.35)", borderRadius: "3px", textDecoration: "none", letterSpacing: "1.5px", display: "inline-flex", alignItems: "center", gap: "10px", transition: "border-color 150ms cubic-bezier(0.4,0,0.2,1), background 150ms cubic-bezier(0.4,0,0.2,1), transform 150ms cubic-bezier(0.34,1.56,0.64,1)" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,204,0,.8)"; el.style.background = "rgba(255,204,0,.06)"; el.style.transform = "scale(1.04) translateY(-1px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,204,0,.35)"; el.style.background = "transparent"; el.style.transform = "scale(1) translateY(0)"; }}
                    onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)"; }}
                    onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04) translateY(-1px)"; }}>
                    LINKEDIN
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                  <button className="hero-cta"
                    onClick={() => { navigator.clipboard.writeText(CONTACT_EMAIL).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000); }); }}
                    style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", padding: "10px 18px", background: copied ? "rgba(255,204,0,.08)" : "transparent", color: "#ffcc00", border: `1px solid ${copied ? "rgba(255,204,0,.8)" : "rgba(255,204,0,.35)"}`, borderRadius: "3px", letterSpacing: "1.5px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", transition: "border-color 150ms cubic-bezier(0.4,0,0.2,1), background 150ms cubic-bezier(0.4,0,0.2,1), transform 150ms cubic-bezier(0.34,1.56,0.64,1)" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (!copied) { el.style.borderColor = "rgba(255,204,0,.8)"; el.style.background = "rgba(255,204,0,.06)"; } el.style.transform = "scale(1.04) translateY(-1px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; if (!copied) { el.style.borderColor = "rgba(255,204,0,.35)"; el.style.background = "transparent"; } el.style.transform = "scale(1) translateY(0)"; }}
                    onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)"; }}
                    onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04) translateY(-1px)"; }}>
                    {copied ? "COPIED!" : "CONTACT"}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      {copied ? <polyline points="20 6 9 17 4 12"/> : <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></>}
                    </svg>
                  </button>
                </div>
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: "100%", height: "18px", overflow: "hidden" }}>
                  <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "12px", color: "#ffcc00", letterSpacing: "1px", opacity: copied ? 0.7 : 0, transform: copied ? "translateY(0)" : "translateY(8px)", transition: "opacity 250ms cubic-bezier(0.0,0.0,0.2,1), transform 250ms cubic-bezier(0.0,0.0,0.2,1)" }}>
                    ↳ {CONTACT_EMAIL}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
