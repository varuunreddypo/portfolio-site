"use client";

import { useEffect, useRef, useState } from "react";

const BLUE = "#60a5fa";
const BLUE_DIM = "rgba(96,165,250,0.15)";
const BLUE_GLOW = "rgba(96,165,250,0.06)";

const B = "/work/DC%20Water";
const img = (f: string) => `${B}/${f.replace(/ /g, "%20")}`;

const CAROUSEL_IMAGES = [
  "/Ampcus%20Carousal/Assign%20Equipment.png",
  "/Ampcus%20Carousal/Draft.png",
  "/Ampcus%20Carousal/MacBook%20Pro%2014_%20-%2082.png",
  "/Ampcus%20Carousal/Pre-Pay%20With%20Sewer.png",
  "/Ampcus%20Carousal/Step1.png",
  "/Ampcus%20Carousal/Transfer%20Permit.png",
];

const NAV_SECTIONS = [
  { id: "overview",   label: "Overview" },
  { id: "problem",    label: "Problem" },
  { id: "role",       label: "My Role" },
  { id: "prototype",  label: "Prototype" },
  { id: "flows",      label: "User Flows" },
  { id: "screens",    label: "Screens" },
  { id: "impact",     label: "Impact" },
];

const STATS = [
  { value: 78, suffix: "",  label: "SUS Score (up from 56)" },
  { value: 70, suffix: "%", label: "Task Completion Boost" },
  { value: 25, suffix: "%", label: "Faster Incident Response" },
  { value: 20, suffix: "%", label: "Reduced Payment Time" },
];

const TEAM = [
  { label: "ROLE",     value: "Lead Product Designer" },
  { label: "TIMELINE", value: "10 Months (May '23 – Feb '24)" },
  { label: "TYPE",     value: "B2B SaaS · Operations & Permitting" },
  { label: "TEAM",     value: "1 Designer · 2 POs · 2 BAs · 6 Devs" },
];

const PAIN_POINTS = [
  {
    icon: "🧩",
    title: "Permit creation was slow and error-prone",
    body: "Operational users navigated long, fragmented forms with unclear system feedback — increasing cognitive load, causing validation errors, and slowing time-sensitive permit submissions.",
  },
  {
    icon: "💳",
    title: "Payment steps were fragmented and confusing",
    body: "Payment was a disjointed step outside the core workflow. Users were unsure when payments were required, whether submissions succeeded, and how to recover from failures.",
  },
  {
    icon: "⚠️",
    title: "Users lacked confidence during critical submissions",
    body: "Unclear system states pushed operational teams toward manual and offline workarounds — increasing effort, slowing workflows, and introducing human error on critical submissions.",
  },
];

const ROLE_CARDS = [
  {
    num: "01",
    title: "Backflow Prevention Module",
    body: "Designed complex form workflows with clear validation states, inline error feedback, and progressive disclosure to reduce cognitive load.",
  },
  {
    num: "02",
    title: "Fire Hydrant Module",
    body: "Led end-to-end design of the permit creation and management system — from ideation through final handoff to development.",
  },
  {
    num: "03",
    title: "Payment Integration",
    body: "Redesigned payment as an integrated workflow step — not a separate detour — with explicit success/failure states and recovery paths.",
  },
  {
    num: "04",
    title: "A/B Testing & Analytics",
    body: "Implemented A/B testing that reduced bounce rate by 15%, and deployed heatmap analysis driving a 43% improvement in UX scores.",
  },
];

const ADMIN_SCREENS = [
  { src: img("admin screen.png"),         caption: "Dashboard" },
  { src: img("Transfer Permit (1).png"),  caption: "Transfer Permit" },
  { src: img("Assign Equipment (1).png"), caption: "Assign Equipment" },
];

const USER_SCREENS = [
  { src: img("user screen.png"),          caption: "Fire Hydrant Services" },
  { src: img("user permit ceration.png"), caption: "Fire Hydrant Request Permit" },
  { src: img("review_screen.png"),        caption: "Review Details" },
];

const LEARNINGS = [
  {
    title: "Designing for operational risk",
    body: "Enterprise workflows with real-world consequences — late payments, missed permits, response delays — demanded meticulous attention to system feedback and error prevention at every step.",
  },
  {
    title: "Balancing stakeholder alignment",
    body: "Working with 2 product owners and 2 business analysts meant every decision was cross-functional. Design rationale had to be expressed in business terms, not just UX principles.",
  },
  {
    title: "Validating with metrics",
    body: "A/B testing, heatmap analysis, and SUS scoring provided concrete evidence — moving conversations from opinion to data and accelerating stakeholder buy-in.",
  },
  {
    title: "Scalable patterns across modules",
    body: "UX patterns from the Fire Hydrant permit module were successfully reused across dashboards and notification systems — validating a component-first design approach.",
  },
];

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 40;
        const increment = value / steps;
        let current = 0;
        const interval = setInterval(() => {
          current += increment;
          if (current >= value) { setCount(value); clearInterval(interval); }
          else setCount(Math.floor(current));
        }, 1200 / steps);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="cs-stat" style={{ flex: "1 1 160px", padding: "24px 28px", background: BLUE_GLOW, border: `1px solid ${BLUE_DIM}`, borderRadius: "2px" }}>
      <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(20px,3vw,32px)", color: BLUE, marginBottom: "8px" }}>
        {count}{suffix}
      </div>
      <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(10px,1.8vw,12px)", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

export default function AcquaaPage() {
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
    const obs = new IntersectionObserver(
      (entries) => {
        if (isScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-5% 0px -70% 0px" }
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  function scrollTo(id: string) {
    setActiveSection(id);
    isScrolling.current = true;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isScrolling.current = false; }, 900);
  }

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroReveal { from{opacity:0;transform:translateY(24px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @media (max-width: 640px) {
          .cs-side-nav { display: none !important; }
          .cs-nav-title { display: none !important; }
          .cs-hero { padding-top: 90px !important; padding-bottom: 36px !important; padding-left: 16px !important; padding-right: 16px !important; }
          .cs-stats-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 2px !important; }
          .cs-stat { padding: 12px 14px !important; flex: unset !important; }
          .cs-meta-section { padding: 28px 16px !important; }
          .cs-meta-grid { grid-template-columns: 1fr 1fr !important; }
          .cs-meta-cell { padding: 14px 12px !important; }
          .cs-grid-main { grid-template-columns: 1fr !important; gap: 28px !important; }
          .cs-feature-grid { grid-template-columns: 1fr !important; }
          .cs-feature-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BLUE_DIM}`, padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/#work" style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, textDecoration: "none", letterSpacing: "1px", display: "inline-grid", gridAutoFlow: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "block", lineHeight: "1", fontSize: "14px", transform: "translateY(-4px)" }}>←</span>
          <span style={{ display: "block", lineHeight: "1" }}>BACK</span>
        </a>
        <span className="cs-nav-title" style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(96,165,250,0.4)", letterSpacing: "3px" }}>ACQUAA — CASE STUDY</span>
        <div style={{ width: "80px" }} />
      </nav>

      {/* ── Side Nav ── */}
      <nav className="cs-side-nav" style={{ position: "fixed", left: "28px", top: "50%", transform: "translateY(-50%)", zIndex: 40, display: "flex", flexDirection: "column", gap: "6px" }}>
        {NAV_SECTIONS.map(({ id, label }) => {
          const active = activeSection === id;
          return (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: "3px 0", textAlign: "left" }}>
              <span style={{ width: active ? "20px" : "8px", height: "2px", background: active ? BLUE : "rgba(255,255,255,0.2)", borderRadius: "2px", transition: "all .25s", flexShrink: 0 }} />
              <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: active ? BLUE : "rgba(255,255,255,0.25)", letterSpacing: "0.5px", transition: "color .25s", whiteSpace: "nowrap" }}>
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Hero ── */}
      <section className="cs-hero" style={{ paddingTop: "140px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px", position: "relative", overflow: "hidden", borderBottom: `1px solid ${BLUE_DIM}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${BLUE_GLOW} 1px,transparent 1px),linear-gradient(90deg,${BLUE_GLOW} 1px,transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse,rgba(96,165,250,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: BLUE_GLOW, border: `1px solid ${BLUE_DIM}`, borderRadius: "2px", marginBottom: "24px", animation: "fadeUp .6s .1s ease both" }}>
            <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: BLUE, letterSpacing: "1px" }}>AMPCUS INC · B2B SAAS · UTILITY</span>
          </div>
          <h1 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(14px,2.5vw,30px)", color: "#fff", letterSpacing: "2px", lineHeight: 1.6, margin: "0 0 16px", textShadow: "0 0 40px rgba(96,165,250,0.2)", animation: "fadeUp .7s .2s ease both" }}>
            ACQUAA<br />
            <span style={{ color: BLUE }}>DC WATER</span>
          </h1>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(14px,1.8vw,20px)", color: "rgba(255,255,255,0.55)", maxWidth: "640px", lineHeight: 1.7, marginBottom: "12px", animation: "fadeUp .7s .3s ease both" }}>
            Streamlining operations & real-time insights for a water utility company — redesigning enterprise permit workflows, payments, and operational dashboards.
          </p>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", fontStyle: "italic", color: BLUE, opacity: 0.85, maxWidth: "640px", lineHeight: 1.7, marginBottom: "48px", animation: "fadeUp .7s .35s ease both" }}>
            &ldquo;This project demonstrates my ability to design and validate complex enterprise workflows involving payments, accessibility, and operational risk.&rdquo;
          </p>
          <div className="cs-stats-row" style={{ display: "flex", flexWrap: "wrap", gap: "2px", animation: "fadeUp .7s .4s ease both" }}>
            {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── Hero Image ── */}
      <div style={{ padding: "48px 24px 64px", borderBottom: `1px solid ${BLUE_DIM}` }}>
        <div
          style={{ maxWidth: "960px", margin: "0 auto", borderRadius: "6px", overflow: "hidden", animation: "heroReveal 1s .2s cubic-bezier(0.22,1,0.36,1) both", position: "relative", cursor: "pointer" }}
          onClick={() => { setCarouselIdx(0); setCarouselOpen(true); }}
          onMouseEnter={e => (e.currentTarget.querySelector('img') as HTMLElement).style.filter = 'brightness(0.75)'}
          onMouseLeave={e => (e.currentTarget.querySelector('img') as HTMLElement).style.filter = ''}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("aquaahero.png")} alt="Acquaa Hero — click to view screen designs" style={{ width: "100%", display: "block", transition: "filter 0.2s" }} />
          {/* Always-visible badge */}
          <div style={{
            position: "absolute", bottom: 14, right: 14,
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 12px",
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
            border: `1px solid ${BLUE_DIM}`,
            borderRadius: "4px",
            pointerEvents: "none",
          }}>
            <span style={{ fontSize: 12 }}>🖼️</span>
            <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: BLUE, letterSpacing: "1px" }}>
              VIEW {CAROUSEL_IMAGES.length} SCREENS
            </span>
          </div>
        </div>
        <p style={{ maxWidth: "960px", margin: "10px auto 0", fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
          Click image to browse screen designs
        </p>
      </div>

      {/* ── Carousel modal ── */}
      {carouselOpen && (
        <div
          role="dialog" aria-modal="true" aria-label="Screen designs carousel"
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          onClick={() => setCarouselOpen(false)}
        >
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "rgba(96,165,250,0.6)", letterSpacing: "2px" }}>
            {carouselIdx + 1} / {CAROUSEL_IMAGES.length}
          </div>
          <button onClick={() => setCarouselOpen(false)} aria-label="Close carousel" style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "24px", cursor: "pointer", lineHeight: 1 }}>×</button>
          <button onClick={e => { e.stopPropagation(); prevSlide(); }} aria-label="Previous screen" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: 44, height: 44, color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <div onClick={e => e.stopPropagation()} style={{ maxHeight: "85vh", maxWidth: "90vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={carouselIdx} src={CAROUSEL_IMAGES[carouselIdx]} alt={`Screen design ${carouselIdx + 1}`} style={{ maxHeight: "85vh", maxWidth: "90vw", objectFit: "contain", borderRadius: "8px", display: "block" }} />
          </div>
          <button onClick={e => { e.stopPropagation(); nextSlide(); }} aria-label="Next screen" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: 44, height: 44, color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
            {CAROUSEL_IMAGES.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setCarouselIdx(i); }} aria-label={`Go to screen ${i + 1}`} style={{ width: i === carouselIdx ? 20 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === carouselIdx ? BLUE : "rgba(255,255,255,0.25)", transition: "width 0.2s, background 0.2s", padding: 0 }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Project Meta ── */}
      <section className="cs-meta-section" style={{ padding: "72px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div className="cs-meta-grid" style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
          {TEAM.map(({ label, value }) => (
            <div key={label} className="cs-meta-cell" style={{ padding: "32px 28px", background: "#0f0f0f" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(6px,1.2vw,7px)", color: "rgba(96,165,250,0.5)", letterSpacing: "2px", marginBottom: "12px" }}>{label}</div>
              <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(11px,2vw,15px)", color: "#f0f0f0", fontWeight: 600, wordBreak: "break-word" }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Overview ── */}
      <section id="overview" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "24px" }}>01 — OVERVIEW</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "24px", lineHeight: 1.3 }}>
            My Journey at Ampcus
          </h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: "700px", marginBottom: "24px" }}>
            Joining the Acquaa team at Ampcus in May 2023, I shaped the user experience for a SaaS platform built for DC Water — a large municipal water utility. Working alongside 2 product owners, 2 business analysts, and 6 developers, my role spanned both backflow prevention and fire hydrant management modules.
          </p>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: "700px" }}>
            Acquaa introduces specialized modules for <span style={{ color: BLUE, fontWeight: 600 }}>backflow prevention</span>, <span style={{ color: BLUE, fontWeight: 600 }}>fire hydrant management</span>, and <span style={{ color: BLUE, fontWeight: 600 }}>FOG modules</span>. Through meticulous planning and collaboration, the platform optimizes water infrastructure management, improves operational efficiency, and delivers real-time insights tailored to DC Water&apos;s requirements.
          </p>
        </div>
      </section>

      {/* ── Problem ── */}
      <section id="problem" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "24px" }}>02 — PROBLEM</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "40px", lineHeight: 1.3 }}>
            What friction were operational users facing?
          </h2>

          <div style={{ padding: "32px", background: BLUE_GLOW, border: `1px solid ${BLUE_DIM}`, borderRadius: "8px", display: "flex", alignItems: "center", gap: "24px", marginBottom: "16px" }}>
            <div style={{ fontSize: "48px", flexShrink: 0 }}>🏗️</div>
            <div>
              <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                DC Water operational teams
              </div>
              <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                User research and behavioral data revealed <span style={{ color: BLUE }}>major friction in core workflows</span> — resulting in task abandonment, delayed incident response, and increased support overhead.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
            {PAIN_POINTS.map((p) => (
              <div key={p.title} style={{ padding: "28px", background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ fontSize: "32px", flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>{p.title}</div>
                  <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: 0 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "32px", background: "var(--bg-card)", border: `1px solid ${BLUE_DIM}`, borderRadius: "8px" }}>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1rem,1.6vw,1.15rem)", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, fontWeight: 600, margin: 0 }}>
              &ldquo;How might we redesign permit and payment workflows so that operational teams can complete critical tasks with confidence, speed, and zero ambiguity?&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── My Role ── */}
      <section id="role" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "24px" }}>03 — MY ROLE</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.3 }}>
            What did I do in this project?
          </h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: "700px", marginBottom: "40px" }}>
            My involvement spanned substantial contribution to the <span style={{ color: BLUE }}>backflow prevention module</span> and comprehensive leadership in the <span style={{ color: BLUE }}>fire hydrant module</span> — owning the full design process from wireframes to high-fidelity, across both admin and user-facing experiences.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px" }}>
            {ROLE_CARDS.map(({ num, title, body }) => (
              <div key={num} style={{ padding: "28px", background: "var(--bg-card)", border: `1px solid ${BLUE_DIM}`, borderRadius: "4px" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, marginBottom: "14px" }}>{num}</div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>{title}</div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Prototype ── */}
      <section id="prototype" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "24px" }}>04 — PROTOTYPE</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.3 }}>
            Glimpse of the Prototype
          </h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "640px", marginBottom: "36px" }}>
            A walkthrough of the Fire Hydrant Permit creation workflow — demonstrating the redesigned step-by-step form, inline validation, and integrated payment flow.
          </p>
          <div style={{ borderRadius: "8px", overflow: "hidden", border: `1px solid ${BLUE_DIM}`, background: "#0f0f0f" }}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={img("glimse.mp4")} controls style={{ width: "100%", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── User Flows ── */}
      <section id="flows" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "24px" }}>05 — USER FLOWS</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "48px", lineHeight: 1.3 }}>
            Mapping the operational journey
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {[
              { label: "User Flow", src: img("user flow.png"), caption: "End-to-end user flow for the Fire Hydrant Permit module" },
              { label: "Flow Level Chart", src: img("flow level chat.png"), caption: "Flow level chart showing admin and user decision paths" },
            ].map(({ label, src, caption }) => (
              <div key={label}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(96,165,250,0.5)", letterSpacing: "2px", marginBottom: "16px" }}>{label.toUpperCase()}</div>
                <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${BLUE_DIM}`, background: "#0f0f0f" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={label} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                </div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "10px", textAlign: "center" }}>{caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Screens ── */}
      <section id="screens" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "24px" }}>06 — SCREENS</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "48px", lineHeight: 1.3 }}>
            A look at the final designs
          </h2>

          {/* Admin: dashboard full-width, then 2-col row */}
          <div style={{ marginBottom: "56px" }}>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,0.25)", letterSpacing: "3px", marginBottom: "20px" }}>ADMIN SCREENS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${BLUE_DIM}`, background: "#0f0f0f" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ADMIN_SCREENS[0].src} alt={ADMIN_SCREENS[0].caption} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                </div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "8px", textAlign: "center" }}>{ADMIN_SCREENS[0].caption}</div>
              </div>
              <div className="cs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {ADMIN_SCREENS.slice(1).map(({ src, caption }) => (
                  <div key={caption}>
                    <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${BLUE_DIM}`, background: "#0f0f0f" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={caption} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                    </div>
                    <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "8px", textAlign: "center" }}>{caption}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User: 2-col row, then review full-width */}
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,0.25)", letterSpacing: "3px", marginBottom: "20px" }}>USER SCREENS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="cs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {USER_SCREENS.slice(0, 2).map(({ src, caption }) => (
                  <div key={caption}>
                    <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${BLUE_DIM}`, background: "#0f0f0f" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={caption} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                    </div>
                    <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "8px", textAlign: "center" }}>{caption}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${BLUE_DIM}`, background: "#0f0f0f" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={USER_SCREENS[2].src} alt={USER_SCREENS[2].caption} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                </div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "8px", textAlign: "center" }}>{USER_SCREENS[2].caption}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact ── */}
      <section id="impact" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "24px" }}>07 — IMPACT</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.3 }}>
            Measurable improvements delivered
          </h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "640px", marginBottom: "40px" }}>
            The redesigned workflows produced concrete improvements across core operational metrics.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", marginBottom: "48px" }}>
            {STATS.map((s) => <StatCounter key={`impact-${s.label}`} {...s} />)}
          </div>
          <div style={{ padding: "32px", background: "var(--bg-card)", border: `1px solid ${BLUE_DIM}`, borderRadius: "8px" }}>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.85, margin: 0 }}>
              The redesign modernized a critical enterprise system, improved operational efficiency, and enabled faster, more reliable permit handling for municipal teams. The work also established <span style={{ color: BLUE }}>scalable UX patterns</span> reused across dashboards and notification systems.
            </p>
          </div>
        </div>
      </section>

      {/* ── Learnings ── */}
      <section style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "24px" }}>08 — LEARNINGS</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "48px", lineHeight: 1.3 }}>
            How has this experience contributed to my growth?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>
            {LEARNINGS.map((l, i) => (
              <div key={l.title} style={{ padding: "28px", background: "var(--bg-card)", border: `1px solid ${BLUE_DIM}`, borderRadius: "4px" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, marginBottom: "14px" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>{l.title}</div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Photos ── */}
      <section style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "24px" }}>09 — THE TEAM</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "40px", lineHeight: 1.3 }}>
            The people behind the work
          </h2>
          <div className="cs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { src: img("me and team 1.png"), caption: "Team collaboration session" },
              { src: img("me and team2.png"),  caption: "Working with the Acquaa team" },
            ].map(({ src, caption }) => (
              <div key={caption}>
                <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${BLUE_DIM}`, background: "#0f0f0f" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={caption} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                </div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "8px", textAlign: "center" }}>{caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(12px,1.8vw,18px)", color: "#fff", marginBottom: "24px", lineHeight: 1.7 }}>DESIGNING FOR OPERATIONAL EXCELLENCE</h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "36px", lineHeight: 1.8 }}>
            Acquaa is a live platform serving DC Water&apos;s operational teams across the Washington, D.C. metro area.
          </p>
          <a href="/#work"
            style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", padding: "14px 24px", background: "transparent", color: BLUE, border: `1px solid ${BLUE_DIM}`, borderRadius: "2px", textDecoration: "none", letterSpacing: "1px", display: "inline-grid", gridAutoFlow: "column", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "block", lineHeight: "1", fontSize: "14px", transform: "translateY(-4px)" }}>←</span>
            <span style={{ display: "block", lineHeight: "1" }}>BACK TO PORTFOLIO</span>
          </a>
        </div>
      </section>
    </div>
  );
}
