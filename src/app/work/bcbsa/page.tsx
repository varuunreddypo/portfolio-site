"use client";

import { useEffect, useRef, useState } from "react";
import PasswordGate from "@/components/ui/PasswordGate";

const BLUE = "#38bdf8";
const BLUE_DIM = "rgba(56,189,248,0.15)";
const BLUE_GLOW = "rgba(56,189,248,0.06)";

const STATS = [
  { value: 39, suffix: "%", label: "User Satisfaction" },
  { value: 40, suffix: "%", label: "Faster Handoffs" },
  { value: 25, suffix: "%", label: "Faster Queries" },
  { value: 6,  suffix: "",  label: "Migration Phases" },
];

const TEAM = [
  { role: "UX Engineer", name: "Varuun Reddy", highlight: true },
  { role: "Data Engineering", name: "Team", highlight: false },
  { role: "Business Analysts", name: "Team", highlight: false },
  { role: "QA & UAT", name: "Teams", highlight: false },
];

const PILLARS = [
  {
    number: "01",
    name: "Member Medical Profile (MMP)",
    body: "The center of gravity. Care managers searched by Member ID, Contract ID, SSN, or CSA/CSF to access a comprehensive profile: demographics, eligibility, active alerts, referrals, and program enrollments — all stacked vertically with a dense left-nav pane. The data was valuable. The presentation was a wall. When a nurse is mid-call needing a referral status, comprehensive and usable aren't the same thing.",
    color: BLUE,
    img: "/work/BCBSA/pillar%201.jpeg",
  },
  {
    number: "02",
    name: "Care Coordination Directory",
    body: "A lookup directory, not a workflow. When users needed to find the right contact at a specific plan — who owns which program, which vendor handles what — they came here. Structurally simpler than the other two pillars, but critical for coordinating across organizations.",
    color: "#a78bfa",
    img: null,
  },
  {
    number: "03",
    name: "Plan Rosters & Reports (PRR)",
    body: "The operational backbone — and the biggest UX challenge. This is where population-level decisions began: scanning referral rosters, reviewing program enrollments, spotting alert patterns, tracking wellness engagement. Four core sections (Program Referrals, Programs, Alerts, Wellness), each with deep drill-down paths and complex multi-dimensional filtering. Classic Cognos thinking: report first, decision later.",
    color: "#34d399",
    imgs: ["/work/BCBSA/pillar%203.1.png", "/work/BCBSA/pillar%203.2.png"],
  },
];

const FINDINGS = [
  {
    emoji: "🗂️",
    heading: "The information hierarchy problem",
    body: "Six sections competed for attention with zero visual priority on the member profile: personal info, eligibility, alerts, referrals, programs, and the left nav. A care manager opening this page to check an active alert had to wade through demographics tables first. The system never said, 'This is what you probably came here for.' It laid everything flat and left the cognitive work to the user — hundreds of times a day.",
  },
  {
    emoji: "📋",
    heading: "The workarounds were the real UX",
    body: "Cheat sheets taped to monitors. Data exported to Excel just to be readable. Memorized navigation paths that bypassed confusing menus. These weren't quirks — they were signals that the interface had failed to communicate its own structure. Users had built their own information hierarchy on top of a system that didn't have one.",
  },
  {
    emoji: "🐘",
    heading: "The system was carrying dead weight",
    body: "CCP held records from expired plans, data for deceased members, and years of inactive user records. All of it bloated query times and slowed every report. A care manager pulling a referral roster wasn't just waiting on the network — she was waiting on the system to sift through data nobody would ever need again.",
  },
];

const DECISIONS = [
  {
    number: "02",
    title: "Cleaning the Data",
    color: "#a78bfa",
    body: "Part of why CC360 is faster isn't just better technology — it's a smarter data strategy. We migrated only active user data from 2021 onward. Records from expired plans were dropped. Data for deceased members was removed. This dramatically reduced query volume, enabling 25% faster response times for every interaction. This was a design decision as much as a technical one: determining what users actually needed versus what the old system had been hoarding for years.",
  },
  {
    number: "03",
    title: "Reorganizing Around Tasks, Not Data Structures",
    color: "#34d399",
    body: "The old CCP was organized around what the system contained — referral reports, program reports, alert reports — a reflection of the database, not of how people worked. CC360 was reorganized around what users were trying to do: find a member, review their care status, act on a referral, scan a population, understand plan-level trends. Getting there required mapping every workflow across all three pillars to the user intentions behind them.",
  },
  {
    number: "04",
    title: "Making PRR Work for Humans",
    color: "#ffd700",
    body: "PRR was the biggest challenge. The complexity was real and necessary — care managers genuinely need that depth. The goal wasn't to strip it away, but to reduce the friction of getting there. Smarter defaults. Clearer filter labels. A more intuitive drill-down progression. Making the path from 'I need to check referral volumes this quarter' to actually seeing that data feel like three steps instead of ten.",
  },
];

const LEARNINGS = [
  {
    number: "01",
    heading: "Respect the system you're replacing",
    body: "CCP had real problems. But it had been holding together care coordination for a national program for over a decade. People built their daily routines around it. The risk with any modernization is chasing a cleaner interface and accidentally destroying the workflows that matter.",
  },
  {
    number: "02",
    heading: "Workarounds are design feedback",
    body: "Cheat sheets, Excel exports, memorized paths — every workaround is a user telling you exactly where the system failed them. Reading those signals carefully is more valuable than any survey.",
  },
  {
    number: "03",
    heading: "Architecture is a UX concern",
    body: "The stakeholder workshops worked because we stopped treating data architecture as someone else's problem. Any redesign that ignores the system underneath will fail. Design and engineering have to make decisions together from the start.",
  },
  {
    number: "04",
    heading: "Restraint is a design decision",
    body: "Sometimes the most impactful design decision is not reinventing something. Knowing when to preserve muscle memory instead of optimizing it away — especially in healthcare — is its own kind of craft.",
  },
];

const NAV_SECTIONS = [
  { id: "overview",    label: "Overview" },
  { id: "problem",     label: "Problem" },
  { id: "constraints", label: "Constraints" },
  { id: "system",      label: "The System" },
  { id: "findings",    label: "What I Found" },
  { id: "approach",    label: "Approach" },
  { id: "decisions",   label: "Key Decisions" },
  { id: "learnings",   label: "Key Learnings" },
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

function BCBSAContent() {
  const [activeSection, setActiveSection] = useState("overview");
  const isScrolling = useRef(false);

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
        .fade-up { animation: fadeUp .7s ease both; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BLUE_DIM}`, padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/#work" style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, textDecoration: "none", letterSpacing: "1px", display: "inline-grid", gridAutoFlow: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "block", lineHeight: "1", fontSize: "14px", transform: "translateY(-4px)" }}>←</span>
          <span style={{ display: "block", lineHeight: "1" }}>BACK</span>
        </a>
        <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: `rgba(56,189,248,0.4)`, letterSpacing: "3px" }}>BCBSA — CASE STUDY</span>
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
      <section style={{ paddingTop: "140px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px", position: "relative", overflow: "hidden", borderBottom: `1px solid ${BLUE_DIM}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${BLUE_GLOW} 1px,transparent 1px),linear-gradient(90deg,${BLUE_GLOW} 1px,transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: `radial-gradient(ellipse,rgba(56,189,248,0.07) 0%,transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", color: `rgba(56,189,248,0.5)`, letterSpacing: "4px", marginBottom: "20px", animation: "fadeUp .6s .1s ease both", opacity: 0, animationFillMode: "forwards" }}>
            CASE STUDY — NDA PROJECT
          </div>
          <h1 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(16px,3vw,36px)", color: "#fff", letterSpacing: "2px", lineHeight: 1.5, margin: "0 0 16px", textShadow: `0 0 40px rgba(56,189,248,0.2)`, animation: "fadeUp .7s .2s ease both", opacity: 0, animationFillMode: "forwards" }}>
            CARE COORDINATION<br />PORTAL → CC360
          </h1>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(14px,1.8vw,20px)", color: "rgba(255,255,255,0.55)", maxWidth: "640px", lineHeight: 1.7, marginBottom: "48px", animation: "fadeUp .7s .3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            Improving performance, sustainability & user efficiency in a mission-critical healthcare platform.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", animation: "fadeUp .7s .4s ease both", opacity: 0, animationFillMode: "forwards" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ flex: "1 1 160px", padding: "24px 28px", background: "rgba(56,189,248,0.04)", border: `1px solid ${BLUE_DIM}`, borderRadius: "2px" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(20px,3vw,32px)", color: BLUE, marginBottom: "8px" }}>
                  <StatCounter value={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hero Image ── */}
      <div style={{ padding: "48px 24px 64px", borderBottom: `1px solid ${BLUE_DIM}` }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", borderRadius: "6px", overflow: "hidden", border: `1px solid ${BLUE_DIM}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/work/BCBSA/hero.jpeg" alt="BCBSA Hero" style={{ width: "100%", display: "block" }} />
        </div>
      </div>

      {/* ── Project Meta ── */}
      <section style={{ padding: "72px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
          {[
            { label: "Role", value: "UX Engineer" },
            { label: "Timeline", value: "Jan 2024 – Jan 2025" },
            { label: "Project Type", value: "Report-driven Platform" },
            { label: "Client", value: "Blue Cross Blue Shield" },
          ].map((item) => (
            <div key={item.label} style={{ padding: "32px 28px", background: "#0f0f0f" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: `rgba(56,189,248,0.5)`, letterSpacing: "2px", marginBottom: "12px" }}>{item.label.toUpperCase()}</div>
              <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "#f0f0f0", fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1000px", margin: "32px auto 0", display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {TEAM.map((t) => (
            <div key={t.role} style={{ padding: "10px 16px", borderRadius: "3px", border: `1px solid ${t.highlight ? BLUE : "rgba(255,255,255,0.1)"}`, background: t.highlight ? "rgba(56,189,248,0.06)" : "transparent", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: t.highlight ? BLUE : "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>{t.role.toUpperCase()}</span>
              <span style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: t.highlight ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: 600 }}>{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Overview ── */}
      <section id="overview" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)`, background: "#0d0d0d" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "28px" }}>OVERVIEW</div>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: "1.9", marginBottom: "20px", maxWidth: "760px" }}>
            The Care Coordination Portal is a mission-critical enterprise system used across the Federal Employee Program by case managers, disease managers, analysts, and plan administrators. It's not one screen — it's a multi-tab, role-based platform where population-level decisions start and individual patient care gets coordinated.
          </p>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: "1.9", marginBottom: "28px", maxWidth: "760px" }}>
            It had been running for over a decade, and it was buckling under its own weight. I was brought on to help redesign the experience as part of <strong style={{ color: BLUE }}>CC360</strong> — a six-phase ground-up redevelopment rethinking workflows across all three pillars while making sure nothing that mattered got lost in translation.
          </p>
          <div style={{ padding: "20px 24px", background: `rgba(56,189,248,0.05)`, border: `1px solid ${BLUE_DIM}`, borderRadius: "4px", marginBottom: "36px", maxWidth: "760px" }}>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", margin: 0, fontStyle: "italic" }}>
              Note: Final designs are under NDA. This case study covers research methodology, design thinking, and outcome metrics without exposing proprietary UI.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/work/BCBSA/overview.jpeg" alt="Overview" style={{ maxWidth: "760px", width: "100%", borderRadius: "6px", border: `1px solid ${BLUE_DIM}`, display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section id="problem" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "32px" }}>THE PROBLEM</div>

          <blockquote style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(16px,2.2vw,22px)", color: "rgba(255,255,255,0.8)", lineHeight: "1.75", borderLeft: `4px solid ${BLUE}`, paddingLeft: "28px", margin: "0 0 48px", fontStyle: "italic" }}>
            "My first week, I got an email with four user guide documents attached. They totaled 26 MB. When you need 26 MB of documentation to explain how to use a tool, the tool has a problem."
          </blockquote>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/work/BCBSA/file%20transfer.gif" alt="File transfer animation" style={{ width: "420px", borderRadius: "8px", marginBottom: "40px", display: "block", margin: "0 auto 40px" }} />

          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: "1.9", maxWidth: "740px", marginBottom: "40px" }}>
            But here's the thing: CCP wasn't broken. It was working. Thousands of plan staff across the BCBS system depended on it every day. Nurses used it mid-call to pull up alert histories. Analysts scanned populations for trends. Plan administrators tracked referral volumes. If CCP went down, real patient care was delayed.
          </p>

          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: "1.9", maxWidth: "740px", marginBottom: "48px" }}>
            The problem was that CCP had been working for too many years without evolving. Built on Cognos, accessed through FEPDirect, it had accumulated layer after layer of complexity. Performance had slowed. Navigation had ballooned. Cognitive load had become so heavy that users developed entire workaround systems just to get through their day.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px" }}>
            {[
              { icon: "🗃️", title: "Information was hard to find", body: "Users spent too much time navigating instead of acting." },
              { icon: "🧠", title: "Cognitive load was too high", body: "The system asked users to think too much to accomplish basic tasks." },
              { icon: "🔄", title: "Workflows felt fragmented", body: "Related tasks were split across multiple disconnected sections." },
            ].map((item, i) => (
              <div key={i} style={{ padding: "24px 28px", background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "24px", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "#f0f0f0", fontWeight: 700, marginBottom: "8px" }}>{item.title}</div>
                  <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7", margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Constraints & Goal ── */}
      <section id="constraints" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)`, background: "#0d0d0d" }}>
        <div className="cs-grid-2col" style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* Constraints */}
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "28px" }}>CONSTRAINTS</div>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.85", marginBottom: "24px" }}>
              CCP supported multiple high-stakes workflows that could not be disrupted or degraded during the transition:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "Member-level clinical lookups",
                "Care coordination and referral tracking",
                "Plan-level and program-level reporting",
                "Administrative and compliance reporting",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 18px", background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: BLUE, flexShrink: 0, marginTop: "5px" }} />
                  <span style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.6" }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.85", marginTop: "20px" }}>
              Users frequently moved across tabs and sections to complete a single task. Performance bottlenecks — often tied to ETL schedules and data dependencies — made even routine actions feel slow and mentally taxing.
            </p>
          </div>

          {/* Goal */}
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "28px" }}>GOAL</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "⚡", label: "Improve speed and clarity" },
                { icon: "🧠", label: "Reduce cognitive load" },
                { icon: "🔒", label: "Preserve trusted workflows" },
                { icon: "🚀", label: "Enable a smoother, future-proof platform" },
              ].map((g, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px 24px", background: "rgba(56,189,248,0.04)", border: `1px solid ${BLUE_DIM}`, borderRadius: "4px" }}>
                  <span style={{ fontSize: "22px", flexShrink: 0 }}>{g.icon}</span>
                  <span style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Understanding the System ── */}
      <section id="system" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)`, background: "#0d0d0d" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "20px" }}>UNDERSTANDING THE SYSTEM</div>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.45)", maxWidth: "640px", lineHeight: "1.8", marginBottom: "48px" }}>
            Before I could redesign anything, I had to understand the full scope of what CCP actually was. Three interconnected pillars, each serving different users in fundamentally different ways.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {PILLARS.map((p, i) => {
              const isEven = i % 2 === 0;
              const pillar = p as typeof p & { img?: string | null; imgs?: string[] };
              return (
                <div key={p.number} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: isEven ? "#111" : "#0f0f0f" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0" }}>
                    <div style={{ padding: "40px 32px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "22px", color: p.color, opacity: 0.15, marginBottom: "12px" }}>{p.number}</div>
                      <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: p.color, letterSpacing: "1px", lineHeight: "2" }}>{p.name.toUpperCase()}</div>
                    </div>
                    <div style={{ padding: "40px 40px", display: "flex", alignItems: "center" }}>
                      <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.9", margin: 0 }}>{p.body}</p>
                    </div>
                  </div>
                  {/* Pillar 1 image */}
                  {pillar.img && (
                    <div style={{ padding: "0 32px 32px" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pillar.img} alt={p.name} style={{ width: "100%", borderRadius: "6px", border: `1px solid ${p.color}22`, display: "block" }} />
                    </div>
                  )}
                  {/* Pillar 3 images */}
                  {pillar.imgs && (
                    <div style={{ padding: "0 32px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {pillar.imgs.map((src, si) => (
                        <div key={si} style={{ borderRadius: "6px", border: `1px solid ${p.color}22`, overflow: "hidden", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`${p.name} ${si + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── What I Found ── */}
      <section id="findings" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "20px" }}>WHAT I FOUND</div>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.45)", maxWidth: "640px", lineHeight: "1.8", marginBottom: "48px" }}>
            Through stakeholder interviews, workflow analysis, and hands-on use of the legacy system, three critical problems emerged — all rooted in the same underlying failure.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "16px" }}>
            {FINDINGS.map((f, i) => (
              <div key={i} style={{ padding: "28px 32px", background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "28px", flexShrink: 0, lineHeight: 1 }}>{f.emoji}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "#f0f0f0", fontWeight: 700, marginBottom: "10px", lineHeight: "1.4" }}>{f.heading}</div>
                  <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", margin: 0 }}>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approach ── */}
      <section id="approach" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)`, background: "#0d0d0d" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "20px" }}>HOW I APPROACHED IT</div>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.45)", maxWidth: "640px", lineHeight: "1.8", marginBottom: "48px" }}>
            Six phases. No big bang. Each phase built on the last.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
            {[
              { label: "Listening First", icon: "👂", body: "Before touching a wireframe, I ran usability tests and interviews with care managers, disease managers, nurses, triage coordinators, and analysts across multiple Blue plans. I didn't just ask what frustrated them — I watched them work. I paid attention to where they hesitated, sighed, and had built muscle memory to navigate past something confusing." },
              { label: "Stakeholder Workshops", icon: "🤝", body: "I facilitated collaborative workshops with product managers and engineers to build a shared understanding of CC360's requirements. CCP connects to the FEPDW data warehouse, SFTP servers on Blues Net, and automated data processes. Any redesign that ignored the architecture underneath would fail. These workshops cut design iteration cycles by ~30% by making decisions together from the start." },
            ].map((item, i) => (
              <div key={i} style={{ padding: "28px 32px", background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "22px" }}>{item.icon}</span>
                  <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: BLUE, letterSpacing: "1px" }}>{item.label.toUpperCase()}</div>
                </div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: "1.85", margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* Six phases timeline */}
          <div style={{ padding: "32px", background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: BLUE, letterSpacing: "2px", marginBottom: "24px", opacity: 0.7 }}>THE SIX-PHASE MIGRATION</div>
            <div style={{ display: "flex", gap: "0" }}>
              {["MMP Pillar", "Directory", "PRR Core", "PRR Reports", "Data Migration", "UAT & Launch"].map((phase, i) => (
                <div key={i} style={{ flex: 1, position: "relative" }}>
                  <div style={{ height: "3px", background: `linear-gradient(90deg, ${BLUE}, rgba(56,189,248,0.3))`, marginBottom: "12px" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: BLUE, position: "absolute", top: "-2.5px", left: 0 }} />
                  <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "5.5px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.5px", lineHeight: "1.8" }}>
                    PHASE {i + 1}<br />
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>{phase.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Design Decisions ── */}
      <section id="decisions" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "20px" }}>KEY DESIGN DECISIONS</div>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.45)", maxWidth: "640px", lineHeight: "1.8", marginBottom: "0" }}>
            I can't show the final designs — the project is under NDA — but I can walk through the thinking behind each decision.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0", marginTop: "40px" }}>

            {/* Decision 01 */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="cs-grid-main" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "0" }}>
                <div style={{ padding: "44px 40px", background: "#0a0a0a", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "32px", color: BLUE, opacity: 0.1, marginBottom: "12px" }}>01</div>
                  <h3 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", color: "#fff", margin: "0 0 10px", letterSpacing: "1px", lineHeight: 1.8 }}>FIXING THE INFORMATION HIERARCHY</h3>
                  <div style={{ height: "2px", width: "32px", background: BLUE, opacity: 0.5 }} />
                </div>
                <div style={{ padding: "44px 40px", background: "#0a0a0a", display: "flex", alignItems: "center" }}>
                  <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.9", margin: 0 }}>
                    The most important design problem. Every piece of information in the old system competed equally for attention. In CC360, we made deliberate choices about what rises to the top — layering actionable data over supporting context, and restructuring navigation around how users actually think about their tasks.
                  </p>
                </div>
              </div>
              {/* MMP / PRR breakdown + image */}
              <div style={{ padding: "0 40px 40px", background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px", paddingTop: "28px" }}>
                  <div style={{ padding: "20px 24px", background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: BLUE, letterSpacing: "2px", marginBottom: "12px", opacity: 0.7 }}>MEMBER PROFILE (MMP)</div>
                    <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: "1.85", margin: 0 }}>Active alerts and referral statuses rose to the top. Eligibility details, program history, and demographics stayed accessible but stopped competing for the same visual real estate. A care manager could immediately see what needed attention.</p>
                  </div>
                  <div style={{ padding: "20px 24px", background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: BLUE, letterSpacing: "2px", marginBottom: "12px", opacity: 0.7 }}>PLAN ROSTERS & REPORTS (PRR)</div>
                    <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: "1.85", margin: 0 }}>Navigation restructured around how users think about tasks — not the database structure. Fewer steps, smarter defaults, clearer paths from "I need to check something" to actually seeing that data.</p>
                  </div>
                </div>
                <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${BLUE_DIM}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/work/BCBSA/before-after.png" alt="Before and After comparison" style={{ width: "100%", display: "block" }} />
                </div>
              </div>
            </div>

            {/* Decisions 02–04 */}
            {DECISIONS.map((d, i) => (
              <div key={d.number} className="cs-grid-main" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ padding: "44px 40px", background: i % 2 === 0 ? "#0d0d0d" : "#0a0a0a", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "32px", color: d.color, opacity: 0.1, marginBottom: "12px" }}>{d.number}</div>
                  <h3 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", color: "#fff", margin: "0 0 10px", letterSpacing: "1px", lineHeight: 1.8 }}>{d.title.toUpperCase()}</h3>
                  <div style={{ height: "2px", width: "32px", background: d.color, opacity: 0.5 }} />
                </div>
                <div style={{ padding: "44px 40px", background: i % 2 === 0 ? "#0d0d0d" : "#0a0a0a", display: "flex", alignItems: "center" }}>
                  <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.9", margin: 0 }}>{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)`, background: "#0d0d0d" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "40px" }}>RESULTS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "2px" }}>
            {[
              { stat: "39%", label: "Increase in user satisfaction scores across surveyed plan staff" },
              { stat: "40%", label: "Faster design-to-development handoffs through aligned stakeholder workshops" },
              { stat: "25%", label: "Faster query response times from smarter data migration and architecture" },
              { stat: "~30%", label: "Reduction in design iteration cycles by co-designing with engineering" },
            ].map((r, i) => (
              <div key={i} style={{ padding: "32px 28px", background: "#111", border: `1px solid ${BLUE_DIM}` }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(22px,3vw,30px)", color: BLUE, marginBottom: "12px" }}>{r.stat}</div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.75", margin: 0 }}>{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Learnings ── */}
      <section id="learnings" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: BLUE, letterSpacing: "3px", marginBottom: "20px" }}>KEY LEARNINGS</div>

          <blockquote style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(15px,1.8vw,20px)", color: "rgba(255,255,255,0.75)", lineHeight: "1.75", borderLeft: `4px solid ${BLUE}`, paddingLeft: "28px", margin: "0 0 48px", fontStyle: "italic" }}>
            "The hardest part of this project wasn't designing the new system. It was respecting the old one."
          </blockquote>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginBottom: "48px" }}>
            {LEARNINGS.map((l) => (
              <div key={l.number} style={{ padding: "28px 24px", background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", position: "relative" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "22px", color: BLUE, opacity: 0.1, position: "absolute", top: "16px", right: "20px" }}>{l.number}</div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "#f0f0f0", fontWeight: 700, marginBottom: "12px", lineHeight: "1.4" }}>{l.heading}</div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", margin: 0 }}>{l.body}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "28px 32px", background: "rgba(56,189,248,0.04)", border: `1px solid ${BLUE_DIM}`, borderRadius: "4px" }}>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: "1.85", margin: 0, fontStyle: "italic" }}>
              In healthcare UX, the cost of confusing someone isn't a bad NPS score. It's a delayed referral, a missed alert, a care manager who couldn't find what they needed mid-call. That context changes what design decisions mean — and what they're worth getting right.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: `rgba(56,189,248,0.4)`, letterSpacing: "3px", marginBottom: "20px" }}>NDA PROJECT</div>
          <h2 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(12px,1.8vw,18px)", color: "#fff", marginBottom: "24px", lineHeight: "1.6" }}>DESIGNING FOR PEOPLE WHO CAN'T AFFORD DOWNTIME</h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "36px", maxWidth: "500px", margin: "0 auto 36px", lineHeight: "1.8" }}>
            Final designs are protected under NDA. Reach out directly to discuss the project in more detail.
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

export default function BCBSACase() {
  return (
    <PasswordGate password="SmilePlease!" accentColor="#38bdf8">
      <BCBSAContent />
    </PasswordGate>
  );
}
