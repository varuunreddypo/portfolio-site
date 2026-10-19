"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Mail, Check } from "lucide-react";

const LINKEDIN_URL  = "https://www.linkedin.com/in/varuun-reddy-pochampally";
const CONTACT_EMAIL = "varuunreddypo@gmail.com";

const ATTACKS = [
  {
    cost: ["psychic", "psychic"],
    name: "Research Surge",
    description: "Uncovers hidden user needs. Turns ambiguity into a product brief.",
    damage: "80",
  },
  {
    cost: ["design", "design", "design"],
    name: "System Design",
    description: "Builds scalable design systems across Healthcare, B2B, EdTech, and beyond.",
    damage: "120",
  },
  {
    cost: ["any"],
    name: "Ship It",
    description: "Moves from wireframe to production. Every time.",
    damage: "50",
  },
];

const ENERGY_COLORS: Record<string, string> = {
  psychic: "#9333ea",
  design:  "#f59e0b",
  any:     "#4b5563",
};

type Company = {
  name: string;
  abbr: string;
  color: string;
  bg: string;
  domain: string;
  logoUrl?: string;
};

const EXPERTISE: { tag: string; tagColor: string; wide?: boolean; companies: Company[] }[] = [
  {
    tag: "HEALTHCARE",
    tagColor: "#38bdf8",
    companies: [
      { name: "Blue Cross Blue Shield", abbr: "BCBS", color: "#005EB8", bg: "#001f4d", domain: "bcbs.com", logoUrl: "/companies/BCBSA Background Removed.png" },
    ],
  },
  {
    tag: "B2B SAAS",
    tagColor: "#a78bfa",
    companies: [
      { name: "Ampcus Inc", abbr: "AMP", color: "#4ade80", bg: "#052010", domain: "ampcus.com", logoUrl: "/companies/ampcus.png" },
    ],
  },
  {
    tag: "EDTECH",
    tagColor: "#fb923c",
    wide: true,
    companies: [
      { name: "Transition Discoveries", abbr: "TD", color: "#34d399", bg: "#042018", domain: "transitiondiscoveries.org", logoUrl: "/companies/Transition Discoveries copy.png" },
      { name: "Indiana University",     abbr: "IU", color: "#f87171", bg: "#2d0a0a", domain: "iu.edu",                    logoUrl: "/companies/Indiana University Background Removed.png" },
    ],
  },
  {
    tag: "EV TECH",
    tagColor: "#4ade80",
    companies: [
      { name: "EV Pitstop", abbr: "EVP", color: "#86efac", bg: "#052810", domain: "evpitstop.com", logoUrl: "/companies/EV Pitstop Background Removed.png" },
    ],
  },
  {
    tag: "UTILITY",
    tagColor: "#67e8f9",
    companies: [
      { name: "DC Water", abbr: "DCW", color: "#67e8f9", bg: "#031820", domain: "dcwater.com", logoUrl: "/companies/dc water.png" },
    ],
  },
  {
    tag: "RETAIL",
    tagColor: "#fbbf24",
    wide: true,
    companies: [
      { name: "RoomBees", abbr: "RB", color: "#fbbf24", bg: "#1a1000", domain: "roombees.com", logoUrl: "/RoomBees Logo.png" },
    ],
  },
];

const CORNERS = [
  "top-3 left-3 border-t border-l",
  "top-3 right-3 border-t border-r",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
];

const PX: React.CSSProperties   = { fontFamily: '"Press Start 2P", monospace' };
const MONO: React.CSSProperties = { fontFamily: '"Space Mono", monospace' };

function CompanyLogo({ co, size = 72 }: { co: Company; size?: number }) {
  const [failed, setFailed] = useState(false);
  const src = co.logoUrl ?? `https://logo.clearbit.com/${co.domain}`;

  return (
    <div className="co-logo-wrap" style={{ position: "relative", display: "inline-block" }}>
      <div
        className="co-logo-tile"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {failed ? (
          <span style={{ ...PX, color: co.color, fontSize: "9px", letterSpacing: "0.5px", textAlign: "center" }}>
            {co.abbr}
          </span>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={co.name}
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        )}
      </div>
      {/* Tooltip */}
      <div className="co-tooltip" style={{ fontFamily: '"Space Mono", monospace' }}>
        {co.name}
      </div>
    </div>
  );
}

function EnergyDot({ type }: { type: string }) {
  return (
    <span
      className="inline-flex w-3.5 h-3.5 rounded-full items-center justify-center flex-shrink-0"
      style={{
        background: ENERGY_COLORS[type] ?? "#4b5563",
        boxShadow: `0 0 6px ${(ENERGY_COLORS[type] ?? "#4b5563")}90`,
        fontSize: "6px",
        color: "white",
      }}
    >
      ●
    </span>
  );
}

export default function AboutCard() {
  const [tilt,     setTilt]     = useState({ x: 0, y: 0 });
  const [shine,    setShine]    = useState({ x: 50, y: 50 });
  const [hovered,  setHovered]  = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [cTilt,    setCTilt]    = useState({ x: 0, y: 0 });
  const [cShine,   setCShine]   = useState({ x: 50, y: 50 });
  const [cHovered, setCHovered] = useState(false);
  const companionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    setTilt({ x: (y - 0.5) * -16, y: (x - 0.5) * 16 });
    setShine({ x: x * 100, y: y * 100 });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
    setHovered(false);
  }, []);

  const handleCompanionMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!companionRef.current || isMobile) return;
    const rect = companionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    setCTilt({ x: (y - 0.5) * -16, y: (x - 0.5) * 16 });
    setCShine({ x: x * 100, y: y * 100 });
  }, [isMobile]);

  const handleCompanionMouseLeave = useCallback(() => {
    setCTilt({ x: 0, y: 0 });
    setCShine({ x: 50, y: 50 });
    setCHovered(false);
  }, []);

  const handleContact = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <section
      className="about-section min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(ellipse 90% 70% at 50% 40%, #0c0e1a 0%, #05060d 100%)",
        padding: "100px 24px 60px",
      }}
    >
      <style>{`
        /* ── Side-by-side layout ── */
        .about-stack {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          justify-content: center;
          gap: 24px;
          width: 100%;
          max-width: 860px;
        }
        @media (max-width: 767px) {
          .about-stack {
            flex-direction: column;
            align-items: center;
          }
        }

        /* ── Card + companion sizing ── */
        .about-card-wrap    { width: clamp(288px, 44vw, 400px); flex-shrink: 0; }
        .about-img-area     { height: clamp(180px, 25vw, 240px); }
        .exp-companion-card { width: clamp(288px, 44vw, 400px); flex-shrink: 0; }

        /* ── Font scales ── */
        .ac-name        { font-size: clamp(13px, 4vw,  16px); }
        .ac-sublabel    { font-size: clamp(8px,  2.2vw, 9px); }
        .ac-infinity    { font-size: clamp(20px, 6vw,  26px); }
        .ac-attack-name { font-size: clamp(11px, 3.2vw,13px); }
        .ac-attack-dmg  { font-size: clamp(13px, 4vw,  16px); }
        .ac-desc        { font-size: clamp(9px,  2.5vw,10px); }
        .ac-wk-label    { font-size: clamp(7px,  2vw,   8px); }
        .ac-wk-val      { font-size: clamp(10px, 2.8vw,11px); }
        .ac-meta        { font-size: clamp(7px,  2vw,   8px); }
        .ac-btn         { font-size: clamp(7px,  2vw,   8px); }
        .ac-status      { font-size: clamp(8px,  2.2vw, 9px); }
        .exp-tag        { font-size: clamp(7px,  1.8vw, 8px); }

        /* ── Companion card domain rows ── */
        .exp-domain-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 14px;
        }

        /* ── Button hover ── */
        .ac-link-btn { transition: opacity 120ms ease, transform 100ms ease; }
        .ac-link-btn:hover { opacity: 0.8; transform: translateY(-1px); }

        /* ── Evolution chain ── */
        .evolution-chain {
          width: 100%;
          padding: 14px 16px;
          border-top: 1px solid rgba(255,215,0,0.2);
          border-bottom: 1px solid rgba(255,215,0,0.2);
          background: rgba(255,215,0,0.03);
          box-sizing: border-box;
        }
        .evolution-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: rgba(255,215,0,0.6);
          font-family: "Space Mono", monospace;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .evolution-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: start;
          gap: 4px;
        }
        .evo-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .evo-stage-name {
          min-height: 2.6em;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 10px;
          font-family: "Space Mono", monospace;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.02em;
          font-weight: 600;
          line-height: 1.25;
          word-wrap: break-word;
          hyphens: auto;
          width: 100%;
        }
        .evo-stage-year {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          font-family: "Space Mono", monospace;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        .evo-stage.current .evo-stage-name {
          color: rgba(255,215,0,0.95);
          text-shadow: 0 0 6px rgba(255,215,0,0.35);
        }
        .evo-stage.current .evo-stage-year {
          color: rgba(255,215,0,0.7);
          font-weight: 600;
        }
        .evo-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: rgba(255,215,0,0.4);
          flex-shrink: 0;
          min-height: 2.6em;
        }
        @media (max-width: 480px) {
          .evolution-chain { padding: 12px 14px; }
          .evolution-row   { gap: 2px; }
          .evo-stage-name  { font-size: 8px; min-height: 2.8em; }
          .evo-stage-year  { font-size: 7px; }
          .evo-arrow       { font-size: 8px; min-height: 2.8em; }
        }

        /* ── Logo tile hover + tooltip ── */
        .co-logo-tile {
          transition: transform 180ms ease, box-shadow 180ms ease;
          cursor: default;
        }
        .co-logo-wrap:hover .co-logo-tile {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
        }
        .co-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(8,10,24,0.96);
          border: 1px solid rgba(245,158,11,0.3);
          color: rgba(255,255,255,0.85);
          font-size: 9px;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 150ms ease;
          z-index: 50;
        }
        .co-logo-wrap:hover .co-tooltip { opacity: 1; }

        @media (max-width: 360px) {
          .about-section { padding: 80px 10px 48px !important; }
        }
      `}</style>

      {/* Ambient orb */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: "500px", height: "500px",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      <div className="about-stack">

        {/* ══════════════════════════════════════════
            TOP — Pokemon Card
        ══════════════════════════════════════════ */}
        <motion.div
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformPerspective: 1400 }}
        >
        <div
          ref={cardRef}
          className="about-card-wrap relative z-10"
          style={{ perspective: isMobile ? "none" : "1400px" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => !isMobile && setHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Tilting shell */}
          <div
            style={{
              width: "100%",
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: hovered
                ? "transform 0.08s linear"
                : "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
              transformStyle: "preserve-3d",
              borderRadius: "18px",
              boxShadow: hovered
                ? "0 40px 100px rgba(0,0,0,0.85), 0 0 60px rgba(245,158,11,0.18), 0 0 0 1px rgba(245,158,11,0.3)"
                : "0 24px 60px rgba(0,0,0,0.7), 0 0 30px rgba(245,158,11,0.08), 0 0 0 1px rgba(245,158,11,0.2)",
            }}
          >
            {/* Holographic shimmer */}
            <div
              style={{
                position: "absolute", inset: 0, borderRadius: "18px",
                zIndex: 20, pointerEvents: "none",
                opacity: hovered ? 0.85 : 0.15,
                transition: "opacity 0.4s ease",
                background: `
                  radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.12) 0%, transparent 50%),
                  linear-gradient(
                    ${75 + shine.x * 0.6}deg,
                    rgba(255,0,80,0.1)   0%,
                    rgba(255,120,0,0.1)  14%,
                    rgba(255,220,0,0.1)  28%,
                    rgba(0,255,120,0.1)  42%,
                    rgba(0,160,255,0.1)  56%,
                    rgba(100,0,255,0.1)  70%,
                    rgba(255,0,200,0.1)  84%,
                    rgba(255,0,80,0.1)   100%
                  )
                `,
                mixBlendMode: "screen",
              }}
            />

            {/* Card face */}
            <div
              style={{
                borderRadius: "18px",
                background: "linear-gradient(155deg,#1c1030 0%,#0e0d22 35%,#130c1e 65%,#0a0f1e 100%)",
                border: "2px solid rgba(245,158,11,0.8)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  margin: "8px",
                  borderRadius: "11px",
                  border: "1px solid rgba(245,158,11,0.28)",
                  overflow: "hidden",
                  background: "rgba(0,0,0,0.15)",
                }}
              >
                {/* ── HEADER ── */}
                <div
                  className="flex items-center justify-between px-3.5 py-2.5"
                  style={{
                    background: "linear-gradient(90deg,rgba(245,158,11,0.12) 0%,rgba(245,158,11,0.05) 100%)",
                    borderBottom: "1px solid rgba(245,158,11,0.18)",
                  }}
                >
                  <div>
                    <div className="ac-sublabel mb-1" style={{ ...PX, color: "rgba(245,158,11,0.8)", letterSpacing: "2px" }}>
                      #001/001 · ULTRA RARE
                    </div>
                    <h1 className="ac-name" style={{ ...PX, color: "#fef3c7", letterSpacing: "1px", lineHeight: 1.3 }}>
                      VARUUN REDDY
                    </h1>
                  </div>
                </div>

                {/* ── ILLUSTRATION AREA (no tags) ── */}
                <div
                  className="about-img-area relative mx-3 mt-3 mb-2 rounded-md overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg,#1e1040 0%,#0a1628 55%,#150a2a 100%)",
                    border: "1px solid rgba(245,158,11,0.18)",
                  }}
                >
                  {/* Dot grid */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "radial-gradient(circle,rgba(245,158,11,0.18) 1px,transparent 1px)",
                      backgroundSize: "24px 24px",
                      opacity: 0.4,
                    }}
                  />
                  {/* Radial glow */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(ellipse 60% 55% at 50% 45%,rgba(245,158,11,0.07) 0%,transparent 70%)",
                    }}
                  />
                  {/* Corner brackets */}
                  {CORNERS.map((cls, i) => (
                    <div key={i} className={`absolute w-4 h-4 ${cls}`} style={{ borderColor: "rgba(245,158,11,0.45)" }} />
                  ))}
                  {/* Hero photo */}
                  <div className="absolute inset-0 flex items-end justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/new hero/varuun-designer newBackground Removed.png"
                      alt="Varuun Reddy"
                      style={{
                        height: "100%",
                        width: "auto",
                        objectFit: "contain",
                        objectPosition: "bottom center",
                        display: "block",
                      }}
                    />
                  </div>
                  {/* Type badge */}
                  <div className="absolute bottom-2 right-2.5">
                    <span
                      className="ac-wk-label px-2 py-0.5 rounded-full"
                      style={{
                        ...PX,
                        background: "rgba(8,10,24,0.75)",
                        color: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        letterSpacing: "0.4px",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                    >
                      ⚡ DESIGN TYPE
                    </span>
                  </div>
                </div>

                {/* ── FLAVOR TEXT ── */}
                <div className="px-3.5 pb-2.5">
                  <p className="ac-desc text-center leading-relaxed" style={{ ...MONO, fontStyle: "italic", color: "rgba(245,158,11,0.7)", margin: 0 }}>
                    &ldquo;Trained in UX, data, and product thinking.<br />
                    Evolved to build things that actually work.&rdquo;
                  </p>
                </div>

                {/* DIVIDER */}
                <div className="mx-3" style={{ height: "1px", background: "rgba(245,158,11,0.18)" }} />

                {/* ── ATTACKS ── */}
                <div className="px-3.5 py-2.5 space-y-3">
                  {ATTACKS.map((atk, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2">
                        <span className="ac-attack-name flex-1" style={{ ...MONO, fontWeight: 700, color: "#fef3c7" }}>
                          {atk.name}
                        </span>
                      </div>
                      <p className="ac-desc leading-relaxed pl-6" style={{ ...MONO, fontStyle: "italic", color: "rgba(245,158,11,0.7)", margin: "4px 0 0" }}>
                        {atk.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ── EVOLUTION CHAIN ── */}
                <section className="evolution-chain" aria-label="Career evolution chain">
                  <div className="evolution-label">▸ EVOLUTION CHAIN</div>
                  <div className="evolution-row">
                    <div className="evo-stage past">
                      <div className="evo-stage-name">Graphic Designer</div>
                      <div className="evo-stage-year">2018–19</div>
                    </div>
                    <div className="evo-arrow" aria-hidden="true">▶</div>
                    <div className="evo-stage past">
                      <div className="evo-stage-name">UX Designer</div>
                      <div className="evo-stage-year">2019–22</div>
                    </div>
                    <div className="evo-arrow" aria-hidden="true">▶</div>
                    <div className="evo-stage past">
                      <div className="evo-stage-name">Lead Product Designer</div>
                      <div className="evo-stage-year">2022–24</div>
                    </div>
                    <div className="evo-arrow" aria-hidden="true">▶</div>
                    <div className="evo-stage current" aria-current="true">
                      <div className="evo-stage-name">UX Engineer</div>
                      <div className="evo-stage-year">NOW</div>
                    </div>
                  </div>
                </section>

                {/* DIVIDER */}
                <div className="mx-3" style={{ height: "1px", background: "rgba(245,158,11,0.18)" }} />

                {/* ── FOOTER ── */}
                <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ac-btn ac-link-btn flex items-center gap-1 px-2 py-1 rounded-sm"
                      style={{ ...PX, letterSpacing: "0.4px", border: "1px solid rgba(245,158,11,0.7)", color: "#fbbf24", background: "rgba(245,158,11,0.06)", textDecoration: "none" }}
                    >
                      <ExternalLink size={7} />
                      LINKEDIN
                    </a>
                    <button
                      onClick={handleContact}
                      className="ac-btn ac-link-btn flex items-center gap-1 px-2 py-1 rounded-sm border-0 cursor-pointer"
                      style={{ ...PX, letterSpacing: "0.4px", background: "#f59e0b", color: "#05060d" }}
                    >
                      {copied ? <Check size={7} /> : <Mail size={7} />}
                      {copied ? "COPIED!" : "CONTACT"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        </motion.div>

        {/* ══════════════════════════════════════════
            BOTTOM — Companion career domains card
        ══════════════════════════════════════════ */}
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformPerspective: 1400, alignSelf: "stretch", display: "flex", flexDirection: "column" }}
        >
        <div
          ref={companionRef}
          className="exp-companion-card"
          style={{ perspective: isMobile ? "none" : "1400px", flex: 1 }}
          onMouseMove={handleCompanionMouseMove}
          onMouseEnter={() => !isMobile && setCHovered(true)}
          onMouseLeave={handleCompanionMouseLeave}
        >
          {/* Tilting shell */}
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `rotateX(${cTilt.x}deg) rotateY(${cTilt.y}deg)`,
              transition: cHovered
                ? "transform 0.08s linear"
                : "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
              transformStyle: "preserve-3d",
              borderRadius: "18px",
              boxShadow: cHovered
                ? "0 40px 100px rgba(0,0,0,0.85), 0 0 60px rgba(245,158,11,0.18), 0 0 0 1px rgba(245,158,11,0.3)"
                : "0 24px 60px rgba(0,0,0,0.7), 0 0 30px rgba(245,158,11,0.08), 0 0 0 1px rgba(245,158,11,0.2)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Holographic shimmer */}
            <div
              style={{
                position: "absolute", inset: 0, borderRadius: "18px",
                zIndex: 20, pointerEvents: "none",
                opacity: cHovered ? 0.85 : 0.15,
                transition: "opacity 0.4s ease",
                background: `
                  radial-gradient(circle at ${cShine.x}% ${cShine.y}%, rgba(255,255,255,0.12) 0%, transparent 50%),
                  linear-gradient(
                    ${75 + cShine.x * 0.6}deg,
                    rgba(255,0,80,0.1)   0%,
                    rgba(255,120,0,0.1)  14%,
                    rgba(255,220,0,0.1)  28%,
                    rgba(0,255,120,0.1)  42%,
                    rgba(0,160,255,0.1)  56%,
                    rgba(100,0,255,0.1)  70%,
                    rgba(255,0,200,0.1)  84%,
                    rgba(255,0,80,0.1)   100%
                  )
                `,
                mixBlendMode: "screen",
              }}
            />

            {/* Card face */}
            <div
              style={{
                borderRadius: "18px",
                background: "linear-gradient(155deg,#1c1030 0%,#0e0d22 35%,#130c1e 65%,#0a0f1e 100%)",
                border: "2px solid rgba(245,158,11,0.8)",
                overflow: "visible",
                position: "relative",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
          <div
            style={{
              margin: "8px",
              borderRadius: "11px",
              border: "1px solid rgba(245,158,11,0.28)",
              overflow: "visible",
              background: "rgba(0,0,0,0.15)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Card header */}
            <div
              className="px-3.5 py-2.5"
              style={{
                background: "linear-gradient(90deg,rgba(245,158,11,0.12) 0%,rgba(245,158,11,0.05) 100%)",
                borderBottom: "1px solid rgba(245,158,11,0.18)",
              }}
            >
              <div className="ac-sublabel mb-1" style={{ ...PX, color: "rgba(245,158,11,0.8)", letterSpacing: "2px" }}>
                CAREER STATS
              </div>
              <h2 className="ac-name" style={{ ...PX, color: "#fef3c7", letterSpacing: "1px", lineHeight: 1.3 }}>
                CAREER DOMAINS
              </h2>
            </div>

            {/* Domain rows — flex-grow fills remaining height, space-evenly distributes rows */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
            {EXPERTISE.map((item, i) => (
              <div key={item.tag}>
                {i > 0 && <div style={{ height: "1px", background: "rgba(245,158,11,0.12)", margin: "0 14px" }} />}
                <div className="exp-domain-row">
                  {/* Tag */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: "0 0 auto" }}>
                    <span
                      style={{
                        width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                        background: item.tagColor,
                        boxShadow: `0 0 6px ${item.tagColor}`,
                      }}
                    />
                    <span className="exp-tag" style={{ ...PX, color: item.tagColor, letterSpacing: "1.5px" }}>
                      {item.tag}
                    </span>
                  </div>
                  {/* Logos */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {item.companies.map(co => (
                      <CompanyLogo key={co.name} co={co} size={56} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            </div>

            {/* Footer */}
            <div style={{ height: "1px", background: "rgba(245,158,11,0.18)" }} />
            <div className="px-3.5 py-2">
              <div className="ac-meta" style={{ ...PX, color: "rgba(245,158,11,0.65)", letterSpacing: "0.3px" }}>
                DALLAS, TX · OPEN TO RELOC.
              </div>
            </div>
          </div>
            </div>{/* /card face */}
          </div>{/* /tilting shell */}
        </div>
        </motion.div>

      </div>

    </section>
  );
}
