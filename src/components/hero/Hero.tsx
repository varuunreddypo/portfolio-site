"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Mail, Check } from "lucide-react";
import { useHeroMode } from "@/hooks/useHeroMode";
import { PortraitBadge } from "./PortraitBadge";

const CONTACT_EMAIL = "varuunreddypo@gmail.com";

const HERO_CONTENT = {
  designer: {
    headline: "Designing systems for healthcare, B2B SaaS, and beyond.",
    tagline: "7 years. 5 industries. One obsession — making complex things feel simple.",
  },
  pokeworld: {
    headline: "Every product is a Pokédex.",
    tagline: "My job is to help users level up — one interaction at a time.",
  },
} as const;

const SKILLS = [
  "Healthcare UX", "Federal Programs", "PropTech", "Housing Tech",
  "GovTech", "Utility SaaS", "Civic Design", "Inclusive Design",
  "Non-profit", "B2B SaaS", "Consumer Apps", "Care Coordination",
];

// ── Toggle pill sized for the column heading ──
const COL_ICON = 40;
const COL_PAD  = 5;
const COL_PILL_W = COL_ICON * 2 + COL_PAD * 3;
const COL_PILL_H = COL_ICON + COL_PAD * 2;

function ColInlineToggle({ isOn, onClick }: { isOn: boolean; onClick: () => void }) {
  return (
    <span
      role="switch"
      aria-checked={isOn}
      onClick={onClick}
      title={isOn ? "Switch to Designer Mode" : "Switch to Pokéworld Mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        width: COL_PILL_W,
        height: COL_PILL_H,
        borderRadius: COL_PILL_H / 2,
        background: isOn ? "rgba(12,8,36,0.85)" : "rgba(210,238,255,0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1.5px solid ${isOn ? "rgba(251,191,36,0.45)" : "rgba(26,40,80,0.25)"}`,
        boxShadow: isOn ? "0 0 14px rgba(251,191,36,0.18)" : "0 2px 10px rgba(0,0,0,0.14)",
        cursor: "pointer",
        overflow: "hidden",
        flexShrink: 0,
        verticalAlign: "middle",
        top: "-0.06em",
        margin: "0 0.05em",
        transition: "background 500ms ease, border-color 400ms ease, box-shadow 400ms ease",
      }}
    >
      <span style={{ position: "absolute", left: COL_PAD, top: COL_PAD, width: COL_ICON, height: COL_ICON, opacity: isOn ? 0 : 1, transition: "opacity 400ms ease" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero vectors/sun.svg" alt="" width={COL_ICON} height={COL_ICON}
          style={{ display: "block", imageRendering: "pixelated", width: "100%", height: "100%" }} />
      </span>
      <span style={{ position: "absolute", left: COL_ICON + COL_PAD * 2, top: COL_PAD, width: COL_ICON, height: COL_ICON, opacity: isOn ? 1 : 0, transition: "opacity 400ms ease" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero vectors/moon.svg" alt="" width={COL_ICON} height={COL_ICON}
          style={{ display: "block", imageRendering: "pixelated", width: "100%", height: "100%" }} />
      </span>
    </span>
  );
}

// ── Scattered star positions — all below navbar (~12% min), clear of badge ──
const STAR_POSITIONS: { src: string; w: number; style: React.CSSProperties; delay: string; dur: string }[] = [
  // Above-badge zone — left side, safely below navbar
  { src: "orange star.svg",  w: 10, style: { top: "12%", left: "10%"  }, delay: "0.2s", dur: "2.1s" },
  { src: "yellow star.svg",  w: 18, style: { top: "16%", left: "20%"  }, delay: "1.1s", dur: "2.6s" },
  { src: "purple star.svg",  w: 14, style: { top: "13%", left: "32%"  }, delay: "0.6s", dur: "1.8s" },
  // Top band — right side, below navbar
  { src: "yellow star.svg",  w: 22, style: { top: "12%", left: "3%"   }, delay: "0s",   dur: "2.4s" },
  { src: "orange star.svg",  w: 10, style: { top: "13%", left: "48%"  }, delay: "0.5s", dur: "1.9s" },
  { src: "purple star.svg",  w: 18, style: { top: "12%", left: "62%"  }, delay: "1.2s", dur: "2.8s" },
  { src: "yellow star.svg",  w: 20, style: { top: "14%", left: "78%"  }, delay: "0.3s", dur: "2.1s" },
  { src: "purple star.svg",  w: 14, style: { top: "12%", right: "4%"  }, delay: "2.0s", dur: "2.2s" },
  // Upper-mid — right side of badge zone
  { src: "orange star.svg",  w: 10, style: { top: "26%", left: "44%"  }, delay: "0.7s", dur: "3.0s" },
  { src: "yellow star.svg",  w: 20, style: { top: "24%", left: "66%"  }, delay: "1.3s", dur: "2.6s" },
  { src: "purple star.svg",  w: 16, style: { top: "22%", right: "6%"  }, delay: "1.5s", dur: "2.7s" },
  // Mid band
  { src: "yellow star.svg",  w: 18, style: { top: "36%", right: "4%"  }, delay: "0.8s", dur: "2.3s" },
  { src: "purple star.svg",  w: 16, style: { top: "44%", left: "58%"  }, delay: "0.4s", dur: "2.0s" },
  { src: "yellow star.svg",  w: 20, style: { top: "40%", right: "12%" }, delay: "1.7s", dur: "2.4s" },
];

// ── Designer background ──
function DesignerBg() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#e8f4fb" }} />
      {/* GPU-promoted layer for all blur blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", transform: "translateZ(0)" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-10%", width: "60%", height: "70%", background: "radial-gradient(ellipse at center, rgba(99,179,237,0.38) 0%, transparent 70%)", filter: "blur(52px)" }} />
        <div style={{ position: "absolute", top: "-10%", right: "-8%", width: "50%", height: "60%", background: "radial-gradient(ellipse at center, rgba(251,191,36,0.22) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "20%", left: "28%", width: "55%", height: "55%", background: "radial-gradient(ellipse at center, rgba(249,168,212,0.18) 0%, transparent 65%)", filter: "blur(64px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "48%", height: "55%", background: "radial-gradient(ellipse at center, rgba(110,231,183,0.22) 0%, transparent 65%)", filter: "blur(52px)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(10,24,48,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.5 }} />
    </>
  );
}

// ── Pokéworld background ──
function PokeworldBg() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#060d1e" }} />
      {/* GPU-promoted layer for all blur blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", transform: "translateZ(0)" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-10%", width: "60%", height: "70%", background: "radial-gradient(ellipse at center, rgba(60,100,220,0.36) 0%, transparent 70%)", filter: "blur(52px)" }} />
        <div style={{ position: "absolute", top: "-10%", right: "-8%", width: "50%", height: "60%", background: "radial-gradient(ellipse at center, rgba(140,60,240,0.26) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "20%", left: "28%", width: "55%", height: "55%", background: "radial-gradient(ellipse at center, rgba(200,50,150,0.18) 0%, transparent 65%)", filter: "blur(64px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "48%", height: "55%", background: "radial-gradient(ellipse at center, rgba(30,180,150,0.18) 0%, transparent 65%)", filter: "blur(52px)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.55 }} />
    </>
  );
}

export default function Hero() {
  const { mode, toggleMode } = useHeroMode();
  const isPoke = mode === "pokeworld";
  const content = HERO_CONTENT[mode];
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const textColor  = isPoke ? "#f0f0ff"               : "#0a1830";
  const mutedColor = isPoke ? "rgba(210,210,255,0.7)"  : "rgba(10,24,48,0.6)";
  const ctaPrimBg  = isPoke ? "#fbbf24"                : "#0a1830";
  const ctaPrimFg  = isPoke ? "#07041a"                : "#ffffff";
  const ctaOutBdr  = isPoke ? "rgba(255,255,255,0.5)"  : "rgba(10,24,48,0.45)";
  const ctaOutFg   = isPoke ? "#fbbf24"                : textColor;
  const ctaOutBg   = isPoke ? "rgba(251,191,36,0.06)"  : "rgba(10,24,48,0.04)";
  const marqueeBg  = isPoke ? "#060115"                : "#0a1830";
  const marqueeFg  = isPoke ? "#fbbf24"                : "rgba(255,255,255,0.85)";

  const marqueeItems = [...SKILLS, ...SKILLS];

  return (
    <section id="about" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes textFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        /* ── Day element animations ── */
        @keyframes sunBob {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-14px) scale(1.03); }
        }
        @keyframes cloudDriftL {
          0%,100% { transform: translateX(0); }
          50%      { transform: translateX(-40px); }
        }
        @keyframes cloudDriftR {
          0%,100% { transform: translateX(0); }
          50%      { transform: translateX(30px); }
        }
        @keyframes cloudBob {
          0%,100% { transform: translateY(0) translateX(0); }
          50%      { transform: translateY(-16px) translateX(-12px); }
        }

        /* ── Night element animations ── */
        @keyframes moonGlow {
          0%,100% { opacity: 0.82; }
          50%      { opacity: 1; }
        }
        @keyframes moonBob {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes darkCloudDrift {
          0%,100% { transform: translateX(0); }
          50%      { transform: translateX(-35px); }
        }
        @keyframes starTwinkle1 {
          0%,100% { opacity:1; transform:scale(1); }
          45%      { opacity:.1; transform:scale(.7); }
          70%      { opacity:.55; transform:scale(.88); }
        }
        @keyframes starTwinkle2 {
          0%,100% { opacity:.85; }
          50%      { opacity:.08; }
        }
        @keyframes starPulse {
          0%,100% { transform:scale(1); opacity:.9; }
          50%      { transform:scale(1.3); opacity:.4; }
        }

        .hero-main-row {
          width:100%; max-width:1060px; margin:0 auto;
          display:flex; flex-direction:row;
          align-items:center; gap:64px;
          flex-wrap:wrap; justify-content:center;
        }
        @media (max-width:720px) {
          .hero-main-row { gap:32px; flex-direction:column; }
        }
        .hero-big-title {
          font-family: var(--font-montserrat);
          font-weight: 900;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 1.0;
          letter-spacing: -0.02em;
          margin: 0 0 24px;
        }
        .hero-headline {
          font-family: var(--font-outfit);
          font-weight: 700;
          font-size: clamp(15px, 1.6vw, 19px);
          line-height: 1.45;
          margin: 0 0 10px;
          max-width: 480px;
          animation: textFadeIn 400ms ease-out backwards;
        }
        .hero-tagline {
          font-family: var(--font-outfit);
          font-weight: 400;
          font-size: clamp(13px, 1.3vw, 15px);
          line-height: 1.7;
          margin: 0 0 28px;
          max-width: 460px;
          animation: textFadeIn 400ms ease-out 80ms backwards;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 18px;
          border-radius: 2px;
          font-family: "Press Start 2P", monospace;
          font-size: 12px;
          letter-spacing: 0.4px;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
          transition: opacity 120ms ease, transform 100ms ease, background 700ms ease, color 700ms ease, border-color 700ms ease;
        }
        .hero-cta:hover  { opacity: 0.8; transform: translateY(-1px); }
        .hero-cta:active { transform: translateY(0); }
        @media (max-width:720px) {
          .hero-big-title { font-size: clamp(38px, 10vw, 56px); }
          .hero-headline  { font-size: 14px; }
          .hero-tagline   { font-size: 13px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-headline, .hero-tagline { animation: none; }
        }
      `}</style>

      {/* ── Gradient backgrounds (crossfade) ── */}
      <div style={{ position:"absolute", inset:0, opacity: isPoke ? 0 : 1, transition:"opacity 700ms ease" }}>
        <DesignerBg />
      </div>
      <div style={{ position:"absolute", inset:0, opacity: isPoke ? 1 : 0, transition:"opacity 700ms ease" }}>
        <PokeworldBg />
      </div>

      {/* ── Designer mode SVG elements ── */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity: isPoke ? 0 : 1, transition:"opacity 700ms ease", zIndex:3 }}>
        {/* Small cloud — upper left */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero vectors/small cloud.svg"
          alt=""
          style={{
            position:"absolute", top:"12%", left:"-1%",
            width:"clamp(160px,16vw,250px)", height:"auto",
            imageRendering:"pixelated",
            animation:"cloudBob 9s ease-in-out infinite",
          }}
        />
        {/* Group 2 cloud — upper right */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero vectors/Group 2.svg"
          alt=""
          style={{
            position:"absolute", top:"10%", right:"-2%",
            width:"clamp(200px,22vw,340px)", height:"auto",
            imageRendering:"pixelated",
            animation:"cloudDriftR 38s ease-in-out 4s infinite",
          }}
        />
        {/* White clouds — bottom terrain, left side */}
        <div style={{ position:"absolute", bottom:0, left:"-5%", width:"90%", transform:"translateY(-6%)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero vectors/white clouds.svg" alt=""
            style={{ display:"block", width:"100%", height:"auto", imageRendering:"pixelated", animation:"cloudDriftL 60s ease-in-out infinite" }} />
        </div>
        {/* White clouds — bottom terrain, right side */}
        <div style={{ position:"absolute", bottom:0, right:"-5%", width:"90%", transform:"translateY(-6%)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero vectors/white clouds.svg" alt=""
            style={{ display:"block", width:"100%", height:"auto", imageRendering:"pixelated", animation:"cloudDriftR 60s ease-in-out 2s infinite" }} />
        </div>
      </div>

      {/* ── Pokéworld mode SVG elements ── */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity: isPoke ? 1 : 0, transition:"opacity 700ms ease", zIndex:3 }}>
        {/* Moon — upper right */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero vectors/moon.svg"
          alt=""
          style={{
            position:"absolute", top:"12%", right:"5%",
            width:"clamp(70px,9vw,120px)", height:"auto",
            imageRendering:"pixelated",
            animation:"moonGlow 3.5s ease-in-out infinite, moonBob 8s ease-in-out infinite",
          }}
        />
        {/* Dark clouds — bottom terrain, left side */}
        <div style={{ position:"absolute", bottom:0, left:"-5%", width:"90%", transform:"translateY(-6%)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero vectors/dark clouds.svg" alt=""
            style={{ display:"block", width:"100%", height:"auto", imageRendering:"pixelated", animation:"darkCloudDrift 60s ease-in-out infinite" }} />
        </div>
        {/* Dark clouds — bottom terrain, right side */}
        <div style={{ position:"absolute", bottom:0, right:"-5%", width:"90%", transform:"translateY(-6%)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero vectors/dark clouds.svg" alt=""
            style={{ display:"block", width:"100%", height:"auto", imageRendering:"pixelated", animation:"cloudDriftR 60s ease-in-out 2s infinite" }} />
        </div>
        {/* Stars beside badge — left of portrait */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero vectors/yellow star.svg" alt="" style={{ position:"absolute", top:"34%", left:"4%", width:28, height:"auto", imageRendering:"pixelated", animation:"starTwinkle1 2.4s ease-in-out 0.3s infinite" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero vectors/purple star.svg" alt="" style={{ position:"absolute", top:"50%", left:"2%", width:16, height:"auto", imageRendering:"pixelated", animation:"starTwinkle2 1.9s ease-in-out 1.1s infinite" }} />

        {/* Stars scattered */}
        {STAR_POSITIONS.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={`/hero vectors/${s.src}`}
            alt=""
            style={{
              position:"absolute",
              ...s.style,
              width: s.w,
              height:"auto",
              imageRendering:"pixelated",
              animation:`starTwinkle${(i % 2) + 1} ${s.dur} ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <main style={{ position:"relative", zIndex:10, flex:1, display:"flex", alignItems:"center", padding:"88px 32px 48px" }}>
        <div className="hero-main-row">

          {/* Portrait badge */}
          <div style={{ flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transform:"translateY(-12%)" }}>
            <PortraitBadge
              imageSrc="/new hero/varuun-designer newBackground Removed.png"
              imageAlt="Varuun Reddy, Product Designer"
              overlayImageSrc="/new hero/varuun-trainer Background Removed.png"
              overlayImageAlt="Varuun as Pokémon Trainer"
              showOverlay={isPoke}
              size="clamp(240px, 28vw, 380px)"
              ringTextColor={isPoke ? "rgba(251,191,36,0.9)" : "rgba(10,24,48,0.55)"}
              bgColor={isPoke ? "#0a0320" : "#c8dff0"}
            />
          </div>

          {/* Text column */}
          <div style={{ flex:1, minWidth:270, maxWidth:540, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start" }}>

            {/* Big heading with embedded toggle */}
            <h1
              className="hero-big-title"
              style={{ color: textColor, transition:"color 700ms ease" }}
            >
              PR<ColInlineToggle isOn={isPoke} onClick={toggleMode} />DUCT
              <br />
              DESIGNER
            </h1>

            {/* Subheading */}
            <p
              key={`h-${mode}`}
              className="hero-headline"
              style={{ color: textColor, transition:"color 700ms ease", animationPlayState: mounted ? "running" : "paused" }}
            >
              {content.headline}
            </p>

            {/* Tagline */}
            <p
              key={`t-${mode}`}
              className="hero-tagline"
              style={{ color: mutedColor, transition:"color 700ms ease", animationPlayState: mounted ? "running" : "paused" }}
            >
              {content.tagline}
            </p>

            {/* CTAs */}
            <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <a
                href="https://www.linkedin.com/in/varuun-reddy-pochampally"
                target="_blank" rel="noopener noreferrer"
                className="hero-cta"
                style={{ border:`1.5px solid ${ctaOutBdr}`, color: ctaOutFg, background: ctaOutBg }}
              >
                <ExternalLink size={16} strokeWidth={2} />
                LINKEDIN
              </a>
              <button
                onClick={() => { navigator.clipboard.writeText(CONTACT_EMAIL).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000); }); }}
                className="hero-cta"
                style={{ background: ctaPrimBg, color: ctaPrimFg, border:"none" }}
              >
                {copied ? <Check size={16} strokeWidth={2} /> : <Mail size={16} strokeWidth={2} />}
                {copied ? "COPIED!" : "CONTACT"}
              </button>
            </div>

            {/* Company logos */}
            <style>{`
              .hero-logo-btn { background:none; border:none; padding:0; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; flex-shrink:0; overflow:hidden; transition:transform 220ms cubic-bezier(0.34,1.56,0.64,1); }
              .hero-logo-btn:nth-child(odd):hover  { transform:rotate(-8deg) scale(1.1); }
              .hero-logo-btn:nth-child(even):hover { transform:rotate(8deg)  scale(1.1); }
            `}</style>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:20, flexWrap:"wrap" }}>
              {[
                { src:"/companies/blue-cross-blue-shield-association-circle.png", alt:"BCBSA",    scale:1.72, projectId:2 },
                { src:"/companies/RoomBees-circle.png",                           alt:"RoomBees", scale:1,    projectId:1 },
                { src:"/companies/dcwater-circle.png",                            alt:"DC Water", scale:1,    projectId:4 },
              ].map(({ src, alt, scale, projectId }) => (
                <button
                  key={alt}
                  className="hero-logo-btn"
                  aria-label={`Scroll to ${alt} project`}
                  onClick={() => {
                    const el = document.getElementById(`project-${projectId}`);
                    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} style={{ width:"100%", height:"100%", objectFit:"contain", transform:`scale(${scale})`, pointerEvents:"none" }} />
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* ── Skills marquee ── */}
      <div style={{
        position:"relative", zIndex:20, overflow:"hidden", flexShrink:0,
        background: marqueeBg, padding:"14px 0",
        transition:"background 700ms ease",
        borderTop: isPoke ? "1px solid rgba(251,191,36,0.15)" : "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ display:"flex", width:"max-content", animation:"marqueeScroll 28s linear infinite" }}>
          {marqueeItems.map((skill, i) => (
            <span key={i} style={{
              display:"inline-flex", alignItems:"center",
              fontFamily:'"Press Start 2P", monospace', fontSize:"8px",
              color: marqueeFg, whiteSpace:"nowrap",
              transition:"color 700ms ease", letterSpacing:"0.05em",
            }}>
              <span style={{ lineHeight:1 }}>{skill}</span>
              <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" aria-hidden="true"
                style={{ margin:"0 28px", opacity:0.6, flexShrink:0 }}>
                <path d="M6 0l1.34 4.66L12 6l-4.66 1.34L6 12l-1.34-4.66L0 6l4.66-1.34z" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
