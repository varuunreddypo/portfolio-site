"use client";

import { useEffect, useRef, useState } from "react";
import PasswordGate from "@/components/ui/PasswordGate";

const GOLD = "#ffd700";
const GOLD_DIM = "rgba(255,215,0,0.15)";
const GOLD_GLOW = "rgba(255,215,0,0.08)";

const STATS = [
  { value: 250, suffix: "+", label: "Active Users" },
  { value: 19, suffix: " mo", label: "Timeline" },
  { value: 3, suffix: "", label: "Platforms" },
  { value: 60, suffix: "%", label: "Drop-off Fixed" },
];

const TEAM = [
  { role: "Chief Designer", name: "Varuun Reddy", highlight: true },
  { role: "Business Analyst", name: "1 Member", highlight: false },
  { role: "Team Lead", name: "1 Member", highlight: false },
  { role: "Developers", name: "8 Engineers", highlight: false },
];

const RESEARCH_INSIGHTS = [
  {
    emoji: "🔐",
    heading: "Trust was the biggest barrier",
    body: "Users couldn't tell if a listing or person was legitimate. Social media posts offered no verification, no reviews, and no structured info — just a photo and a phone number. This led directly to our verification badges, review system, and structured lifestyle profiles.",
  },
  {
    emoji: "😵",
    heading: "Mismatched expectations caused the most regret",
    body: "Users had moved in only to discover major lifestyle conflicts — sleep schedules, cleanliness, guest policies. They wanted to surface differences before committing. This drove our compatibility-focused profiles where habits are specified upfront.",
  },
  {
    emoji: "🔍",
    heading: "The search process was fragmented and exhausting",
    body: "Users bounced between Craigslist, Facebook groups, forums, and word of mouth — managing multiple conversations with no way to compare options. This validated a single platform consolidating room search, roommate search, and communication.",
  },
  {
    emoji: "🚛",
    heading: "Post-move-in friction was an untapped opportunity",
    body: "Even after finding the right roommate, shared expenses became a source of tension. Splitting rent and utilities was managed through Venmo and spreadsheets — messy and uncomfortable. This insight led to Divydo, our built-in expense-splitting feature.",
  },
];

const FEATURES = [
  {
    number: "01",
    name: "HiveNest",
    problem: "Solving the fragmentation problem",
    body: "Our research showed users were frustrated by listings that described entire apartments but gave no clarity on individual rooms. HiveNest breaks properties down room by room — each with its own price, size, and availability. This makes it easier for someone to join an existing household without needing to coordinate externally, and it reduces confusion for both landlords and tenants.",
    color: "#ffd700",
    img: "/work/RoomBees/feature1.jpeg",
  },
  {
    number: "02",
    name: "Roommate Search",
    problem: "Solving the trust and mismatch problem",
    body: "Users told us they wanted to know who they'd be living with before committing. Roommate Search lets users browse detailed profiles that surface preferences, lifestyles, and intent. The goal is to reduce mismatches early by making expectations clear before anyone signs a lease.",
    color: "#38bdf8",
    img: "/work/RoomBees/feature2.jpeg",
  },
  {
    number: "03",
    name: "Room Search",
    problem: "Solving the scattered listings problem",
    body: "Users were tired of piecing together housing options from five different platforms. Room Search consolidates available rooms and shared housing into one structured, easy-to-compare experience with clear details on pricing, availability, and house type.",
    color: "#34d399",
    img: "/work/RoomBees/feature3.jpeg",
  },
  {
    number: "04",
    name: "Divydo",
    problem: "Solving post-move-in friction",
    body: "Research participants told us that even good roommate relationships get strained by money. Divydo helps roommates manage shared expenses — splitting amounts, tracking who owes what, sending reminders, and marking payments as settled — so finances don't become a source of conflict.",
    color: "#a78bfa",
    img: "/work/RoomBees/feature4.jpeg",
  },
];


const LEARNINGS = [
  {
    number: "01",
    heading: "Shipping changes everything",
    body: "Designing for real users tightened the feedback loop dramatically. Issues that never surfaced in testing became obvious within days of going live.",
  },
  {
    number: "02",
    heading: "Language is design",
    body: "Three words in a pop-up title caused a 60% drop-off. Microcopy deserves the same rigor as layout — every word is a design decision.",
  },
  {
    number: "03",
    heading: "Timing beats completeness",
    body: "Asking the right question at the wrong moment is almost as bad as asking the wrong question. The signup redesign proved that context determines willingness.",
  },
  {
    number: "04",
    heading: "Consistency is a systems problem",
    body: "Maintaining a design system across three platforms with 8 developers was unglamorous but high-impact work. The library was what kept us sane.",
  },
];

function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1400;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          setDisplay(Math.floor(progress * value));
          if (progress < 1) requestAnimationFrame(step);
          else setDisplay(value);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const NAV_SECTIONS = [
  { id: "overview",  label: "Overview" },
  { id: "goal",      label: "Team Goal" },
  { id: "research",  label: "Research" },
  { id: "solution",  label: "Problem & Solution" },
  { id: "userflow",  label: "User Flow" },
  { id: "iterations",label: "Iterations" },
  { id: "business",  label: "Business Strategy" },
  { id: "learnings", label: "Key Learnings" },
];

const CAROUSEL_IMAGES = [
  "/RoomBees%20Carousal/Frame%201000005620.png",
  "/RoomBees%20Carousal/Frame%201000005621.png",
  "/RoomBees%20Carousal/Frame%201000005622.png",
  "/RoomBees%20Carousal/Frame%201000005623.png",
  "/RoomBees%20Carousal/Frame%201000005624.png",
  "/RoomBees%20Carousal/Frame%201000005625.png",
  "/RoomBees%20Carousal/Frame%201000005626.png",
];

const FLOW_TABS = [
  { id: "onboarding", label: "ONBOARDING", src: "/work/RoomBees/flow-onborading.png", desc: "Start → Splash → Onboarding → Auth → Location → Main Screen" },
  { id: "home",       label: "HOME",       src: "/work/RoomBees/flow-home.png",       desc: "Home → Roommates (Swipe / Match) & Rooms (Browse / Connect)" },
  { id: "features",  label: "HIVENEST + DIVVYDO", src: "/work/RoomBees/flow-features.png", desc: "HiveNest property discovery & Divvydo expense splitting flows" },
];

function RoomBeesContent() {
  const [activeFlow, setActiveFlow] = useState("onboarding");
  const [activeSection, setActiveSection] = useState("overview");
  const isScrolling = useRef(false);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);

  const prevSlide = () => setCarouselIdx(i => (i - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  const nextSlide = () => setCarouselIdx(i => (i + 1) % CAROUSEL_IMAGES.length);

  useEffect(() => {
    if (!carouselOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCarouselOpen(false);
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [carouselOpen]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting && !isScrolling.current) setActiveSection(id); },
        { rootMargin: "-5% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    isScrolling.current = true;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isScrolling.current = false; }, 900);
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f0f0f0" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .fade-up { animation: fadeUp .7s ease both; }
        @media (max-width: 640px) {
          .cs-side-nav { display: none !important; }
          .cs-nav-title { display: none !important; }
          .cs-hero { padding-top: 90px !important; padding-bottom: 36px !important; padding-left: 16px !important; padding-right: 16px !important; }
          .cs-stats-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 2px !important; }
          .cs-stat { padding: 12px 14px !important; flex: unset !important; }
          .cs-meta-section { padding: 28px 16px !important; }
          .cs-meta-grid { grid-template-columns: 1fr 1fr !important; }
          .cs-meta-cell { padding: 14px 12px !important; }
          .cs-team-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .cs-grid-main { grid-template-columns: 1fr !important; gap: 28px !important; }
          .cs-feature-grid { grid-template-columns: 1fr !important; }
          .cs-feature-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,215,0,0.1)", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/#work" style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, textDecoration: "none", letterSpacing: "1px", display: "inline-grid", gridAutoFlow: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "block", lineHeight: "1", fontSize: "14px", transform: "translateY(-4px)" }}>←</span>
          <span style={{ display: "block", lineHeight: "1" }}>BACK</span>
        </a>
        <span className="cs-nav-title" style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,215,0,0.4)", letterSpacing: "3px" }}>ROOMBEES — CASE STUDY</span>
        <a href="https://www.roombees.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: GOLD, textDecoration: "none", letterSpacing: "1px", padding: "8px 14px", border: `1px solid ${GOLD_DIM}`, borderRadius: "2px" }}>LIVE SITE ↗</a>
      </nav>

      {/* ── Hero ── */}
      <section className="cs-hero" style={{ paddingTop: "140px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px", position: "relative", overflow: "hidden", borderBottom: `1px solid ${GOLD_DIM}` }}>
        {/* Background grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GOLD_GLOW} 1px,transparent 1px),linear-gradient(90deg,${GOLD_GLOW} 1px,transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        {/* Glow blob */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: `radial-gradient(ellipse,rgba(255,215,0,0.06) 0%,transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", color: "rgba(255,215,0,0.5)", letterSpacing: "4px", marginBottom: "20px", animation: "fadeUp .6s .1s ease both", opacity: 0, animationFillMode: "forwards" }}>
            CASE STUDY — LIVE PRODUCT
          </div>
          <h1 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(20px,3.5vw,42px)", color: "#fff", letterSpacing: "2px", lineHeight: 1.4, margin: "0 0 20px", textShadow: `0 0 40px rgba(255,215,0,0.2)`, animation: "fadeUp .7s .2s ease both", opacity: 0, animationFillMode: "forwards" }}>
            ROOMBEES
          </h1>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(16px,2vw,22px)", color: "rgba(255,255,255,0.6)", maxWidth: "600px", lineHeight: 1.7, marginBottom: "48px", animation: "fadeUp .7s .3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            Find the Right Room. Match with the Right People.
          </p>

          {/* Stat row */}
          <div className="cs-stats-row" style={{ display: "flex", flexWrap: "wrap", gap: "2px", animation: "fadeUp .7s .4s ease both", opacity: 0, animationFillMode: "forwards" }}>
            {STATS.map((s, i) => (
              <div key={i} className="cs-stat" style={{ flex: "1 1 160px", padding: "24px 28px", background: "rgba(255,215,0,0.04)", border: `1px solid ${GOLD_DIM}`, borderRadius: "2px" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(20px,3vw,32px)", color: GOLD, marginBottom: "8px" }}>
                  <StatCounter value={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Side Nav ── */}
      <nav className="cs-side-nav" style={{ position: "fixed", left: "28px", top: "50%", transform: "translateY(-50%)", zIndex: 40, display: "flex", flexDirection: "column", gap: "6px" }}>
        {NAV_SECTIONS.map(({ id, label }) => {
          const active = activeSection === id;
          return (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: "3px 0", textAlign: "left" }}>
              <span style={{ width: active ? "20px" : "8px", height: "2px", background: active ? GOLD : "rgba(255,255,255,0.2)", borderRadius: "2px", transition: "all .25s", flexShrink: 0 }} />
              <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: active ? GOLD : "rgba(255,255,255,0.25)", letterSpacing: "0.5px", transition: "color .25s", whiteSpace: "nowrap" }}>
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Hero Image ── */}
      <div style={{ padding: "48px 24px 64px", borderBottom: `1px solid ${GOLD_DIM}` }}>
        <div
          style={{ maxWidth: "1000px", margin: "0 auto", borderRadius: "6px", overflow: "hidden", border: `1px solid ${GOLD_DIM}`, position: "relative", cursor: "pointer" }}
          onClick={() => { setCarouselIdx(0); setCarouselOpen(true); }}
          onMouseEnter={e => (e.currentTarget.querySelector('img') as HTMLElement).style.filter = 'brightness(0.75)'}
          onMouseLeave={e => (e.currentTarget.querySelector('img') as HTMLElement).style.filter = ''}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/work/RoomBees/hero.jpeg" alt="RoomBees product — click to view screen designs" style={{ width: "100%", display: "block", transition: "filter 0.2s" }} />
          {/* Always-visible badge */}
          <div style={{
            position: "absolute", bottom: 14, right: 14,
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 12px",
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
            border: `1px solid ${GOLD_DIM}`,
            borderRadius: "4px",
            pointerEvents: "none",
          }}>
            <span style={{ fontSize: 12 }}>🖼️</span>
            <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: GOLD, letterSpacing: "1px" }}>
              VIEW {CAROUSEL_IMAGES.length} SCREENS
            </span>
          </div>
        </div>
        <p style={{ maxWidth: "1000px", margin: "10px auto 0", fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
          Click image to browse screen designs
        </p>
      </div>

      {/* ── Carousel modal ── */}
      {carouselOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screen designs carousel"
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setCarouselOpen(false)}
        >
          {/* Counter */}
          <div style={{
            position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)",
            fontFamily: '"Press Start 2P",monospace', fontSize: "8px",
            color: "rgba(255,215,0,0.6)", letterSpacing: "2px",
          }}>
            {carouselIdx + 1} / {CAROUSEL_IMAGES.length}
          </div>

          {/* Close */}
          <button
            onClick={() => setCarouselOpen(false)}
            aria-label="Close carousel"
            style={{
              position: "absolute", top: 16, right: 20,
              background: "none", border: "none", color: "rgba(255,255,255,0.5)",
              fontSize: "24px", cursor: "pointer", lineHeight: 1,
            }}
          >×</button>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prevSlide(); }}
            aria-label="Previous screen"
            style={{
              position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%", width: 44, height: 44, color: "#fff",
              fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >‹</button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxHeight: "85vh", maxWidth: "90vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={carouselIdx}
              src={CAROUSEL_IMAGES[carouselIdx]}
              alt={`Screen design ${carouselIdx + 1}`}
              style={{ maxHeight: "85vh", maxWidth: "90vw", objectFit: "contain", borderRadius: "8px", display: "block" }}
            />
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); nextSlide(); }}
            aria-label="Next screen"
            style={{
              position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%", width: 44, height: 44, color: "#fff",
              fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >›</button>

          {/* Dot indicators */}
          <div style={{
            position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 8,
          }}>
            {CAROUSEL_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setCarouselIdx(i); }}
                aria-label={`Go to screen ${i + 1}`}
                style={{
                  width: i === carouselIdx ? 20 : 8, height: 8,
                  borderRadius: 4, border: "none", cursor: "pointer",
                  background: i === carouselIdx ? GOLD : "rgba(255,255,255,0.25)",
                  transition: "width 0.2s, background 0.2s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}


      {/* ── Project Meta ── */}
      <section id="meta" className="cs-meta-section" style={{ padding: "72px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div className="cs-meta-grid" style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
          {[
            { label: "Role", value: "Chief Designer" },
            { label: "Timeline", value: "19 Months (Jun '24 – Dec '25)" },
            { label: "Platforms", value: "Web · Android · iOS" },
            { label: "Team Size", value: "11 Members" },
          ].map((item) => (
            <div key={item.label} className="cs-meta-cell" style={{ padding: "32px 28px", background: "#0f0f0f" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,215,0,0.5)", letterSpacing: "2px", marginBottom: "12px" }}>{item.label.toUpperCase()}</div>
              <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "#f0f0f0", fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Team breakdown */}
        <div className="cs-team-row" style={{ maxWidth: "1000px", margin: "32px auto 0", display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {TEAM.map((t) => (
            <div key={t.role} style={{ padding: "10px 16px", borderRadius: "3px", border: `1px solid ${t.highlight ? GOLD : "rgba(255,255,255,0.1)"}`, background: t.highlight ? "rgba(255,215,0,0.06)" : "transparent", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: t.highlight ? GOLD : "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>{t.role.toUpperCase()}</span>
              <span style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: t.highlight ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: 600 }}>{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Overview ── */}
      <section id="overview" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)`, background: "#0d0d0d" }}>
        <div className="cs-grid-main" style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "64px", alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, letterSpacing: "3px", marginBottom: "20px" }}>OVERVIEW</div>
            <div style={{ height: "2px", width: "40px", background: GOLD, marginBottom: "20px", opacity: 0.4 }} />
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", lineHeight: "2.2" }}>
              ROOMBEES STARTED AS AN<br/>HCI MASTER'S PROJECT.
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: "1.9", marginBottom: "24px" }}>
              RoomBees started as an HCI master's program project, but it didn't stay academic for long. A classroom problem about shared living evolved into a startup tackling real housing and roommate-discovery challenges.
            </p>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: "1.9", marginBottom: "24px" }}>
              I joined as Chief Designer and have led design across web, iOS, and Android for 19 months — building and maintaining a component library in Figma, mapping user flows in FigJam, and working alongside a team of 8 developers, a business analyst, and a team lead.
            </p>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: "1.9" }}>
              The product is now live, used by <strong style={{ color: GOLD }}>250+ active users</strong>, and continues to grow as we refine the platform through continuous user research and real-world feedback.
            </p>
          </div>
        </div>
      </section>

      {/* ── Team Goal ── */}
      <section id="goal" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, letterSpacing: "3px", marginBottom: "32px" }}>TEAM GOAL</div>
          <blockquote style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(18px,2.5vw,26px)", color: "rgba(255,255,255,0.85)", lineHeight: "1.7", borderLeft: `4px solid ${GOLD}`, paddingLeft: "28px", margin: 0, fontStyle: "italic" }}>
            "Design a solution that reduced the stress, uncertainty, and friction people face when navigating shared housing — prioritizing compatibility, trust, and clarity from the very first interaction to life after move-in."
          </blockquote>
        </div>
      </section>

      {/* ── Research & Analysis ── */}
      <section id="research" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)`, background: "#0d0d0d" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ marginBottom: "0" }}>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, letterSpacing: "3px", marginBottom: "20px" }}>RESEARCH & ANALYSIS</div>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.45)", maxWidth: "600px", lineHeight: "1.8" }}>
              Surveys, interviews, and informal usability testing with students and young professionals revealed that the hardest part of the roommate experience wasn't living together — it was everything before: the discovery, the decision-making, and the leap of faith.
            </p>
          </div>

          <div className="cs-feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(440px,1fr))", gap: "16px", marginTop: "40px" }}>
            {RESEARCH_INSIGHTS.map((insight, i) => (
              <div key={i} style={{ padding: "28px 32px", background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "28px", flexShrink: 0, lineHeight: 1 }}>{insight.emoji}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "#f0f0f0", fontWeight: 700, marginBottom: "10px", lineHeight: "1.4" }}>{insight.heading}</div>
                  <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", margin: 0 }}>{insight.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem & Solution ── */}
      <section id="solution" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, letterSpacing: "3px", marginBottom: "12px" }}>PROBLEM & SOLUTION</div>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.45)", maxWidth: "680px", lineHeight: "1.8", marginBottom: "48px" }}>
            People searching for roommates and shared housing rely on fragmented tools — lacking trust signals, compatibility insights, and structured communication — making the process time-consuming, stressful, and risky.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            {FEATURES.map((f, i) => {
              const imgLeft = i % 2 === 0;
              return (
                <div key={f.number} className="cs-feature-row cs-grid-main" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "0", borderTop: `1px solid rgba(255,255,255,0.06)` }}>
                  {/* Phone image */}
                  <div style={{ order: imgLeft ? 0 : 1, background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", borderRight: imgLeft ? `1px solid rgba(255,255,255,0.06)` : "none", borderLeft: imgLeft ? "none" : `1px solid rgba(255,255,255,0.06)` }}>
                    <div style={{ position: "relative", maxWidth: "200px", width: "100%" }}>
                      {/* Glow behind phone */}
                      <div style={{ position: "absolute", inset: "-20px", background: `radial-gradient(ellipse,${f.color}18 0%,transparent 70%)`, filter: "blur(20px)", pointerEvents: "none" }} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.img} alt={f.name} style={{ width: "100%", borderRadius: "20px", boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)`, position: "relative" }} />
                    </div>
                  </div>
                  {/* Text */}
                  <div style={{ order: imgLeft ? 1 : 0, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", color: f.color, opacity: 0.35 }}>{f.number}</span>
                      <div style={{ height: "1px", flex: 1, background: `${f.color}22` }} />
                    </div>
                    <h3 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "13px", color: "#fff", margin: "0 0 12px", letterSpacing: "1px", lineHeight: 1.6 }}>{f.name}</h3>
                    <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "11px", color: f.color, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "18px", opacity: 0.75 }}>{f.problem}</div>
                    <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: "1.85", margin: 0 }}>{f.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── User Flow ── */}
      <section id="userflow" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)`, background: "#0d0d0d" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, letterSpacing: "3px", marginBottom: "12px" }}>USER FLOW</div>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: "1.9", maxWidth: "700px", marginBottom: "40px" }}>
            I mapped the full user journey in FigJam to identify the most efficient paths through the app — from signup to posting a listing, discovering roommates, and managing shared living. This flow served as the source of truth for the development team and helped us identify where users were most likely to drop off or get confused, directly informing our iteration priorities.
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
            {FLOW_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveFlow(tab.id)}
                style={{
                  fontFamily: '"Press Start 2P",monospace', fontSize: "7px", padding: "12px 18px",
                  background: activeFlow === tab.id ? GOLD : "#111",
                  color: activeFlow === tab.id ? "#0a0a0a" : "rgba(255,255,255,0.4)",
                  borderTop: `1px solid ${activeFlow === tab.id ? GOLD : "rgba(255,255,255,0.08)"}`,
                  borderLeft: `1px solid ${activeFlow === tab.id ? GOLD : "rgba(255,255,255,0.08)"}`,
                  borderRight: `1px solid ${activeFlow === tab.id ? GOLD : "rgba(255,255,255,0.08)"}`,
                  borderBottom: "none", cursor: "pointer", letterSpacing: "1px",
                  transition: "all .15s",
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Diagram panel */}
          {FLOW_TABS.map(tab => tab.id === activeFlow && (
            <div key={tab.id} style={{ border: `1px solid ${GOLD_DIM}`, borderRadius: "0 4px 4px 4px", overflow: "hidden", background: "#0a0a0a" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tab.src} alt={tab.label} style={{ width: "100%", display: "block" }} />
              <div style={{ padding: "14px 20px", borderTop: `1px solid ${GOLD_DIM}`, display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: GOLD, flexShrink: 0, display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{tab.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Iterations ── */}
      <section id="iterations" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, letterSpacing: "3px", marginBottom: "8px" }}>ITERATIONS</div>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "56px" }}>Iterating on the Live Product</p>

          {/* ── REWORK 1 ── */}
          <div style={{ marginBottom: "80px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, opacity: 0.4 }}>REWORK 01</span>
              <h3 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "10px", color: "#fff", margin: 0, letterSpacing: "1px" }}>The Bank Details Pop-up</h3>
            </div>

            {/* Problem */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "#f87171", letterSpacing: "2px", marginBottom: "14px" }}>THE PROBLEM</div>
              <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: "1.85", maxWidth: "700px", margin: 0 }}>
                In usability testing, <strong style={{ color: "#fff" }}>12 out of 20 users</strong>{" "}dropped off immediately after tapping &quot;Place&quot; to post a property. The pop-up title &quot;Bank Details Not Found&quot; read as an error, and neither CTA made it clear they could continue without adding bank details.
              </p>
            </div>

            {/* Before / After */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              <div style={{ background: "#0f0f0f", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", background: "rgba(248,113,113,0.08)", borderBottom: "1px solid rgba(248,113,113,0.15)" }}>
                  <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "#f87171", letterSpacing: "2px" }}>BEFORE</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/work/RoomBees/Before.png" alt="Before rework" style={{ width: "100%", height: "400px", objectFit: "contain", background: "#0f0f0f", display: "block" }} />
              </div>
              <div style={{ background: "#0f0f0f", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", background: "rgba(52,211,153,0.08)", borderBottom: "1px solid rgba(52,211,153,0.15)" }}>
                  <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "#34d399", letterSpacing: "2px" }}>AFTER</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/work/RoomBees/After.png" alt="After rework" style={{ width: "100%", height: "400px", objectFit: "contain", background: "#0f0f0f", display: "block" }} />
              </div>
            </div>

            {/* Fix */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "#34d399", letterSpacing: "2px", marginBottom: "14px" }}>THE FIX</div>
              <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: "1.85", maxWidth: "700px", margin: 0 }}>
                The solution was entirely in language and framing — three small changes with big impact. Reframing the title from an error state to an optional prompt, and making the skip action obvious, eliminated the friction entirely.
              </p>
            </div>

            {/* GIFs + quotes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/work/RoomBees/Drop%20It%20John%20Candy%20GIF%20(before).gif" alt="Before" style={{ width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" }} />
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontStyle: "italic", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", margin: 0, textAlign: "center" }}>
                  &quot;Usability testing identified a 60% drop-off rate at this step.&quot;
                </p>
              </div>
              <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/work/RoomBees/Baby%20Success%20GIF%20(after).gif" alt="After" style={{ width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" }} />
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontStyle: "italic", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", margin: 0, textAlign: "center" }}>
                  &quot;After this change, we observed a significant improvement in completion rate.&quot;
                </p>
              </div>
            </div>

            {/* Stat callout */}
            <div style={{ marginTop: "24px", padding: "20px 28px", background: "rgba(255,215,0,0.04)", border: `1px solid ${GOLD_DIM}`, borderRadius: "4px", display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "24px", color: GOLD }}>60%</span>
              <span style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>drop-off rate eliminated — friction point no longer appears in user feedback or testing sessions</span>
            </div>
          </div>

          {/* ── REWORK 2 ── */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "80px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, opacity: 0.4 }}>REWORK 02</span>
              <h3 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "10px", color: "#fff", margin: 0, letterSpacing: "1px" }}>Reducing Signup Friction</h3>
            </div>

            {/* Problem */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "#f87171", letterSpacing: "2px", marginBottom: "14px" }}>THE PROBLEM</div>
              <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: "1.85", maxWidth: "700px", margin: 0 }}>
                The original signup flow required users to complete <strong style={{ color: "#fff" }}>three dense screens</strong>{" "}before creating an account — personal details, photos, bios, university, lifestyle habits, personality traits, career info, and roommate preferences. All before they had a chance to explore the app.
              </p>
            </div>

            {/* Two pain points */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
              {[
                { emoji: "⁉️", heading: "Users had no motivation to invest that much effort upfront", body: "They hadn't yet experienced the value of the platform." },
                { emoji: "⁉️", heading: "Much of this information wasn't necessary for account creation", body: "It was only relevant when a user decided to post themselves as a roommate — a separate action with a very different level of intent." },
              ].map((pt, i) => (
                <div key={i} style={{ padding: "20px 24px", background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", display: "flex", gap: "14px" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{pt.emoji}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "#f0f0f0", fontWeight: 700, marginBottom: "6px", lineHeight: "1.4" }}>{pt.heading}</div>
                    <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7", margin: 0 }}>{pt.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Confused GIF + result text */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "28px", alignItems: "center", marginBottom: "32px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/work/RoomBees/Confused%20Robert%20Downey%20Jr%20GIF%20(1).gif" alt="Confused" style={{ width: "180px", borderRadius: "8px", display: "block" }} />
              <div style={{ padding: "24px 28px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "4px" }}>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "16px", color: "#f87171", fontWeight: 700, marginBottom: "8px" }}>The result was predictable.</p>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: "1.8", margin: 0 }}>Users were dropping off mid-signup, abandoning the process before ever seeing what Roombees had to offer.</p>
              </div>
            </div>

            {/* Before / After side by side */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              <div style={{ background: "#0f0f0f", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", background: "rgba(248,113,113,0.08)", borderBottom: "1px solid rgba(248,113,113,0.15)" }}>
                  <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "#f87171", letterSpacing: "2px" }}>BEFORE — 3 DENSE SCREENS</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/work/RoomBees/rework2.jpeg" alt="Original signup flow" style={{ width: "100%", height: "400px", objectFit: "contain", background: "#0f0f0f", display: "block" }} />
              </div>
              <div style={{ background: "#0f0f0f", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", background: "rgba(52,211,153,0.08)", borderBottom: "1px solid rgba(52,211,153,0.15)" }}>
                  <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "#34d399", letterSpacing: "2px" }}>AFTER — SINGLE SCREEN</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/work/RoomBees/after%20rework2.jpeg" alt="New signup flow" style={{ width: "100%", height: "400px", objectFit: "contain", background: "#0f0f0f", display: "block" }} />
              </div>
            </div>

            {/* The Fix */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "20px", alignItems: "center", marginBottom: "28px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/work/RoomBees/one%20second%20no%20GIF%20by%20Julieee%20Logan%20(1).gif" alt="One second" style={{ width: "120px", borderRadius: "8px", display: "block", flexShrink: 0 }} />
              <div style={{ padding: "18px 22px", background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "4px" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "#34d399", letterSpacing: "2px", marginBottom: "10px" }}>THE FIX — REDESIGN</div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.8", margin: 0 }}>
                  Stripped signup to a single screen — photos, name, date of birth, gender, nationality, and target location. One screen, one tap, they&apos;re in.
                </p>
              </div>
            </div>

            {/* Roommate listing flow video */}
            <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden", marginBottom: "28px" }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: GOLD, letterSpacing: "2px", opacity: 0.7 }}>ROOMMATE LISTING FLOW</span>
              </div>
              <video controls playsInline style={{ width: "100%", display: "block", maxHeight: "520px", background: "#000" }}>
                <source src="/work/RoomBees/Roommate%20listing%20Flow.mov" type="video/quicktime" />
                <source src="/work/RoomBees/Roommate%20listing%20Flow.mov" type="video/mp4" />
              </video>
              <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>All deeper profile info was relocated to the roommate listing flow — a dedicated 3-step process users go through only when they choose to post themselves.</p>
              </div>
            </div>

            {/* Output */}
            <div style={{ padding: "24px 28px", background: "rgba(255,215,0,0.04)", border: `1px solid ${GOLD_DIM}`, borderRadius: "4px" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: GOLD, letterSpacing: "2px", marginBottom: "12px", opacity: 0.7 }}>OUTPUT</div>
              <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.85", margin: 0 }}>
                By reducing signup to a single screen and deferring detailed information to the moment it&apos;s actually needed, the redesign lowered the barrier to entry without sacrificing the richness of user profiles. Users still provide all the same information — they just do it at the right time, in the right context, with the right motivation.
              </p>
              <blockquote style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: GOLD, fontStyle: "italic", margin: "20px 0 0", borderLeft: `2px solid ${GOLD_DIM}`, paddingLeft: "16px", opacity: 0.8 }}>
                &quot;I could actually see someone&apos;s lifestyle and habits before reaching out. I matched with my current roommate in three days.&quot;
                <span style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.3)", fontStyle: "normal", marginTop: "6px" }}>— Student, Indiana University Indianapolis</span>
              </blockquote>
            </div>
          </div>

        </div>
      </section>

      {/* ── Business Strategy ── */}
      <section id="business" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)`, background: "#0d0d0d" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, letterSpacing: "3px", marginBottom: "16px" }}>BUSINESS STRATEGY</div>
          <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.7)", marginBottom: "36px", fontWeight: 600 }}>A Growth-First Strategy</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
            {[
              { label: "Phase 1", title: "User Acquisition", body: "Focus on free experience quality — reducing signup friction, improving listing quality, and building trust through verification and reviews. Track engagement metrics, signup completion, and return visits." },
              { label: "Phase 2", title: "Monetization", body: "Roombees Gold (premium visibility), featured listings for landlords, partnerships with moving services, furniture rental, and student housing organizations — revenue streams that enhance rather than gate core functionality." },
            ].map((phase) => (
              <div key={phase.label} style={{ padding: "28px", background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: GOLD, opacity: 0.5, letterSpacing: "2px", marginBottom: "10px" }}>{phase.label.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "#f0f0f0", fontWeight: 700, marginBottom: "12px" }}>{phase.title}</div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", margin: 0 }}>{phase.body}</p>
              </div>
            ))}
          </div>

          <blockquote style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: "1.85", borderLeft: `3px solid ${GOLD_DIM}`, paddingLeft: "20px", margin: 0, fontStyle: "italic" }}>
            Build something people rely on first, then find sustainable ways to fund it.
          </blockquote>
        </div>
      </section>

      {/* ── Key Learnings ── */}
      <section id="learnings" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: GOLD, letterSpacing: "3px", marginBottom: "20px" }}>KEY LEARNINGS</div>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "640px", lineHeight: "1.8", marginBottom: "40px" }}>
            Nineteen months of shipping, testing, and iterating on a live product — here&apos;s what stayed with me.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
            {LEARNINGS.map((l) => (
              <div key={l.number} style={{ padding: "28px 24px", background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", position: "relative" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "22px", color: GOLD, opacity: 0.12, position: "absolute", top: "16px", right: "20px" }}>{l.number}</div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "#f0f0f0", fontWeight: 700, marginBottom: "12px", lineHeight: "1.4" }}>{l.heading}</div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", margin: 0 }}>{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(255,215,0,0.4)", letterSpacing: "3px", marginBottom: "20px" }}>LIVE PRODUCT</div>
          <h2 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(14px,2vw,20px)", color: "#fff", marginBottom: "24px", lineHeight: "1.6" }}>SEE IT IN ACTION</h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.45)", marginBottom: "36px", maxWidth: "500px", margin: "0 auto 36px", lineHeight: "1.8" }}>
            RoomBees is live and growing. 250+ users have already found rooms and matched with roommates.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://www.roombees.com" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", padding: "14px 24px", background: GOLD, color: "#0a0a0a", borderRadius: "2px", textDecoration: "none", letterSpacing: "1px" }}>
              VISIT ROOMBEES ↗
            </a>
            <a href="/#work"
              style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", padding: "14px 24px", background: "transparent", color: GOLD, border: `1px solid ${GOLD_DIM}`, borderRadius: "2px", textDecoration: "none", letterSpacing: "1px", display: "inline-grid", gridAutoFlow: "column", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "block", lineHeight: "1", fontSize: "14px", transform: "translateY(-4px)" }}>←</span>
              <span style={{ display: "block", lineHeight: "1" }}>BACK TO PORTFOLIO</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function RoomBeesCase() {
  return (
    <PasswordGate password="SmilePlease!" accentColor="#ffd700">
      <RoomBeesContent />
    </PasswordGate>
  );
}
