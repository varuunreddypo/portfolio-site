"use client";

import { useEffect, useRef, useState } from "react";

const PURPLE = "#34d399";
const PURPLE_DIM = "rgba(52,211,153,0.15)";
const PURPLE_GLOW = "rgba(52,211,153,0.06)";

const B = "/work/transition%20discoveries";
const img = (f: string) => `${B}/${f.replace(/ /g, "%20")}`;

const NAV_SECTIONS = [
  { id: "overview",       label: "Overview" },
  { id: "problem",        label: "Problem" },
  { id: "approach",       label: "Approach" },
  { id: "research",       label: "Research" },
  { id: "decisions",      label: "Key Decisions" },
  { id: "implementation", label: "Implementation" },
  { id: "learnings",      label: "Learnings" },
];

const STATS = [
  { value: 25, suffix: "%", label: "Accessibility Improvement" },
  { value: 53, suffix: "%", label: "User Satisfaction Boost" },
  { value: 30, suffix: "+", label: "Actionable Design Solutions" },
  { value: 25, suffix: "+", label: "Hi-Fi Prototypes Delivered" },
];

const PHASES = [
  { label: "Preliminary", duration: "4 weeks", items: ["Literature review", "Competitive analysis"] },
  { label: "Generative",  duration: "2 weeks", items: ["Survey", "Focus Group", "Expert Interviews"] },
  { label: "Evaluation",  duration: "2 weeks", items: ["Cognitive", "Heuristic", "Thematic"] },
  { label: "Strategy",    duration: "2 weeks", items: ["Archetypes", "Pain points", "Ideation"] },
  { label: "Build",       duration: "6 weeks", items: ["Low fidelity", "Hi-fidelity", "Final Design"] },
];

const HEURISTICS = [
  {
    number: "01",
    title: "Unstandardized button design",
    heuristic: "Match between system and real world · Consistency and Standards",
    severity: "4 — Usability Catastrophe",
    solution: "Elements that follow industry standards users can understand without explicit prompts.",
    src: img("heuristics 1.jpeg"),
  },
  {
    number: "02",
    title: "Inconsistent layout and information display",
    heuristic: "Consistency and Standards",
    severity: "4 — Usability Catastrophe",
    solution: "Redesign layout using industry standards with uniform, properly aligned graphical elements.",
    src: img("heurisctics 2.jpeg"),
  },
  {
    number: "03",
    title: "Duplicate search functionality",
    heuristic: "Aesthetic and Minimalist Design",
    severity: "3 — Major Usability Issue",
    solution: "Remove the redundant search input. Simplify to a single minimal design.",
    src: img("heuristics 3.jpeg"),
  },
  {
    number: "04",
    title: "Task / video completion error",
    heuristic: "Help and Documentation",
    severity: "3 — Major Usability Issue",
    solution: "Refine the algorithm to distinguish skipped vs. completed views for accurate tracking.",
    src: img("heuristics 4.jpeg"),
  },
];

const PINPOINTS = [
  {
    number: "01",
    title: "Simplifying the Homepage",
    problem: "The homepage had a cluttered layout and overlapping visual elements — straining for users with varied disabilities and reducing conversion rates.",
    solution: "Simplified the page to surface only essential information, added a clear CTA, integrated an AI chatbot, and restructured community messaging to communicate value faster.",
    before: img("Exisiting Transition Discoveries before .png"),
    after: img("Home Screen - Final after 1 .png"),
    highlights: [
      "CTA button added to streamline the decision-making process",
      "AI chatbot integrated for on-site assistance",
      "Community impact reframed as 'why choose us' at top",
      "Event images surfaced to foster community building",
    ],
  },
  {
    number: "02",
    title: "Redesigning the Discovery Board",
    problem: "The discovery board's complex, inconsistent layout complicated navigation for youth with disabilities. No motivational or engaging elements existed to sustain interaction.",
    solution: "Improved visual hierarchy, restructured information by function, and added Goals, Badges, and a Forum for motivation and peer collaboration.",
    before: img("EXISTING Discovery Board 2.png"),
    after: img("Discovery Board Final 2.jpg"),
    highlights: [
      "Badges, coins, and accessory store promoted to top",
      "Added 'today's goal' feature for daily motivation",
      "Modules reformatted as cards with progress bars",
      "Revamped journal and job summaries with illustrations",
    ],
  },
  {
    number: "03",
    title: "Introducing AI-Driven Learning Tools",
    problem: "Clients needed AI-driven motivational features and tools to foster collaboration among peers and mentors — none of which existed.",
    solution: "Transformed the existing companion into an AI chatbot, added a floating notes board for in-module capture, and built a mentor-facilitated collaborative forum.",
    before: img("ai chatbot 1.jpeg"),
    after: img("ai chat bot 2.jpeg"),
    hideLabels: true,
    highlights: [
      "Teaching-oriented AI chatbot: summaries, definitions, quizzes",
      "Floating note board for quick in-module capture",
      "Collaborative forum for peer and mentor discussions",
      "Workflows accelerated 1.5×, satisfaction up 53%",
    ],
  },
];

const IMPL_STEPS = [
  {
    number: "01",
    title: "Revamped the Website",
    body: "Applied all concepts in low-fidelity first to validate ideas and gather client feedback. Clients loved the redesign but were particular about staying true to their recently launched brand identity. The final delivery was a decluttered, organized homepage that matched their visual language.",
    images: [img("implementation black.jpeg"), img("implemention client liked.jpeg"), img("implementation final.jpeg")],
    captions: ["Low-fidelity concept", "Client-aligned iteration", "Final delivery"],
  },
  {
    number: "02",
    title: "Streamlined Onboarding",
    body: "The onboarding process was restructured into three distinct parts with a two-column layout to minimize scrolling. A progress bar was added for status awareness, and supporting text clarified the purpose of each data input field.",
    images: [img("streamlined onboarding .jpeg"), img("streamlined onboarding 2.jpeg")],
    captions: ["Initial onboarding concept", "Final onboarding flow"],
  },
  {
    number: "03",
    title: "Introduced AI Chatbot",
    body: "Transformed the client's existing companion element into an AI-powered conversational guide. Early user feedback flagged small text causing cognitive strain — container and font sizes were scaled up significantly in the final iteration.",
    images: [img("take notes.gif"), img("companion.gif")],
    captions: ["Floating notes board", "Companion in action"],
  },
];

const LEARNINGS = [
  {
    title: "Finding common ground with clients",
    body: "Every design decision was backed by research and aligned to client goals. When opinions diverged, research served as the neutral arbitrator that kept the team and client aligned.",
  },
  {
    title: "The value of biweekly meetings",
    body: "Regular check-ins surfaced blockers early and kept feedback loops tight throughout the year-long engagement — no surprises at final delivery.",
  },
  {
    title: "Effective cross-functional communication",
    body: "Working with a team of four taught me to communicate design intent clearly across different working styles, especially when discussing feasibility of proposed solutions.",
  },
  {
    title: "Upholding the brand identity",
    body: "Unless tasked with a rebrand, established brand elements must be respected. The client's recent brand launch was non-negotiable — and that constraint ultimately made the design stronger.",
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
    <div ref={ref} style={{ flex: "1 1 160px", padding: "24px 28px", background: `${PURPLE_GLOW}`, border: `1px solid ${PURPLE_DIM}`, borderRadius: "2px" }}>
      <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(20px,3vw,32px)", color: PURPLE, marginBottom: "8px" }}>
        {count}{suffix}
      </div>
      <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

export default function TransitionDiscoveriesPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const isScrolling = useRef(false);

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
        .fade-up { animation: fadeUp .7s ease both; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${PURPLE_DIM}`, padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/#work" style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, textDecoration: "none", letterSpacing: "1px", display: "inline-grid", gridAutoFlow: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "block", lineHeight: "1", fontSize: "14px", transform: "translateY(-4px)" }}>←</span>
          <span style={{ display: "block", lineHeight: "1" }}>BACK</span>
        </a>
        <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(52,211,153,0.4)", letterSpacing: "3px" }}>TRANSITION DISCOVERIES — CASE STUDY</span>
        <a href="https://www.transitiondiscoveries.org" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: PURPLE, textDecoration: "none", letterSpacing: "1px", padding: "8px 14px", border: `1px solid ${PURPLE_DIM}`, borderRadius: "2px" }}>
          LIVE SITE ↗
        </a>
      </nav>

      {/* ── Side Nav ── */}
      <nav className="cs-side-nav" style={{ position: "fixed", left: "28px", top: "50%", transform: "translateY(-50%)", zIndex: 40, display: "flex", flexDirection: "column", gap: "6px" }}>
        {NAV_SECTIONS.map(({ id, label }) => {
          const active = activeSection === id;
          return (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: "3px 0", textAlign: "left" }}>
              <span style={{ width: active ? "20px" : "8px", height: "2px", background: active ? PURPLE : "rgba(255,255,255,0.2)", borderRadius: "2px", transition: "all .25s", flexShrink: 0 }} />
              <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: active ? PURPLE : "rgba(255,255,255,0.25)", letterSpacing: "0.5px", transition: "color .25s", whiteSpace: "nowrap" }}>
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: "140px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px", position: "relative", overflow: "hidden", borderBottom: `1px solid ${PURPLE_DIM}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${PURPLE_GLOW} 1px,transparent 1px),linear-gradient(90deg,${PURPLE_GLOW} 1px,transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse,rgba(52,211,153,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: PURPLE_GLOW, border: `1px solid ${PURPLE_DIM}`, borderRadius: "2px", marginBottom: "24px", animation: "fadeUp .6s .1s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: PURPLE, letterSpacing: "1px" }}>🏆 IU CAPSTONE 2024 — BEST PROJECT IN SHOW</span>
          </div>
          <h1 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(14px,2.5vw,30px)", color: "#fff", letterSpacing: "2px", lineHeight: 1.6, margin: "0 0 16px", textShadow: "0 0 40px rgba(52,211,153,0.2)", animation: "fadeUp .7s .2s ease both", opacity: 0, animationFillMode: "forwards" }}>
            TRANSITION<br />
            <span style={{ color: PURPLE }}>DISCOVERIES</span>
          </h1>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(14px,1.8vw,20px)", color: "rgba(255,255,255,0.55)", maxWidth: "640px", lineHeight: 1.7, marginBottom: "48px", animation: "fadeUp .7s .3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            Inclusive redesign for youth with disabilities — exploring strategies to boost website usability during the transition from high school to further education and employment.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", animation: "fadeUp .7s .4s ease both", opacity: 0, animationFillMode: "forwards" }}>
            {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── Hero Image ── */}
      <div style={{ padding: "48px 24px 64px", borderBottom: `1px solid ${PURPLE_DIM}` }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", borderRadius: "6px", overflow: "hidden", animation: "heroReveal 1s .2s cubic-bezier(0.22,1,0.36,1) both" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("heroframe.png")} alt="Transition Discoveries Hero" style={{ width: "100%", display: "block" }} />
        </div>
      </div>

      {/* ── Project Meta ── */}
      <section style={{ padding: "72px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
          {[
            { label: "ROLE", value: "UX Researcher · UX Designer · UI Designer" },
            { label: "TIMELINE", value: "1 Year" },
            { label: "TEAM", value: "4 Product Designers" },
            { label: "TYPE", value: "EdTech / Nonprofit" },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: "32px 28px", background: "#0f0f0f" }}>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: `rgba(52,211,153,0.5)`, letterSpacing: "2px", marginBottom: "12px" }}>{label}</div>
              <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "#f0f0f0", fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Overview ── */}
      <section id="overview" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, letterSpacing: "3px", marginBottom: "24px" }}>01 — OVERVIEW</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "24px", lineHeight: 1.3 }}>
            What is Transition Discoveries?
          </h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: "700px", marginBottom: "24px" }}>
            Transition Discoveries is a nonprofit focused on aiding youth with disabilities — aged 13 to 20 — in transitioning from high school to higher education and employment. The platform aims to provide clear, navigable, and engaging content tailored to the unique needs of each user, so that youth feel supported and confident in their progression.
          </p>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: "700px" }}>
            Our team of four product designers was brought in through Indiana University&apos;s Capstone program to conduct end-to-end research and redesign — from generative research through high-fidelity delivery. The project earned the <span style={{ color: PURPLE, fontWeight: 600 }}>Best Project in Show</span> award at the IU Capstone 2024 showcase.
          </p>
        </div>
      </section>

      {/* ── Problem ── */}
      <section id="problem" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, letterSpacing: "3px", marginBottom: "24px" }}>02 — PROBLEM</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "40px", lineHeight: 1.3 }}>
            What obstacles was Transition Discoveries facing?
          </h2>
          {/* Full-width top card */}
          <div style={{ padding: "32px", background: PURPLE_GLOW, border: `1px solid ${PURPLE_DIM}`, borderRadius: "8px", display: "flex", alignItems: "center", gap: "24px", marginBottom: "16px" }}>
            <div style={{ fontSize: "48px", flexShrink: 0 }}>👥</div>
            <div>
              <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                Youth with disabilities <span style={{ color: PURPLE }}>(13 – 20 years old)</span>
              </div>
              <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                who are transitioning from high school to higher education or work — a highly varied and underserved audience.
              </p>
            </div>
          </div>

          {/* Two half cards */}
          <div className="cs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
            {[
              { icon: "🖥️", body: "Enhance the website to offer clear, navigable, and engaging content that works for users with varied disabilities." },
              { icon: "🤝", body: "Address the unique needs of each user so they feel supported and confident in their educational and career progression." },
            ].map(({ icon, body }) => (
              <div key={icon} style={{ padding: "28px", background: "var(--bg-card)", border: `1px solid ${PURPLE_DIM}`, borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ fontSize: "36px", flexShrink: 0 }}>{icon}</div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>

          {/* HMW quote block */}
          <div style={{ padding: "32px", background: "var(--bg-card)", border: `1px solid ${PURPLE_DIM}`, borderRadius: "8px" }}>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1rem,1.6vw,1.15rem)", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, fontWeight: 600, margin: 0 }}>
              "How might we ensure that the platform becomes a catalyst for a confident and supported transition experience for youth with disabilities?"
            </p>
          </div>
        </div>
      </section>

      {/* ── Approach ── */}
      <section id="approach" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, letterSpacing: "3px", marginBottom: "24px" }}>03 — APPROACH</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.3 }}>
            How did we transform user needs into an effective solution?
          </h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "640px", marginBottom: "56px" }}>
            A multi-phase research-to-design pipeline spanning 16 weeks — from literature review through final high-fidelity delivery.
          </p>
          <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "8px" }}>
            {PHASES.map((phase, i) => (
              <div key={phase.label} style={{ flex: "1 1 0", minWidth: "140px", padding: "24px 16px", background: "var(--bg-card)", border: `1px solid ${i === 4 ? PURPLE_DIM : "rgba(255,255,255,0.06)"}`, borderRadius: "4px", position: "relative" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, marginBottom: "6px" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "rgba(255,255,255,0.6)", letterSpacing: "1px", marginBottom: "4px" }}>{phase.label.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "14px" }}>{phase.duration}</div>
                {phase.items.map(item => (
                  <div key={item} style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "5px", paddingLeft: "10px", borderLeft: `2px solid ${PURPLE_DIM}` }}>{item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research ── */}
      <section id="research" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, letterSpacing: "3px", marginBottom: "24px" }}>04 — RESEARCH</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "48px", lineHeight: 1.3 }}>
            Tracing the route to the solution
          </h2>

          {/* Heuristic Evaluation */}
          <div style={{ marginBottom: "72px" }}>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,0.25)", letterSpacing: "3px", marginBottom: "6px" }}>EVALUATIVE RESEARCH</div>
            <h3 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Heuristic Evaluation</h3>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "40px", maxWidth: "600px" }}>
              Identified key usability issues and improvements aligned with Nielsen&apos;s 10 usability heuristics.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
              {HEURISTICS.map((h) => (
                <div key={h.number}>
                  {/* Header row */}
                  <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "0", marginBottom: "24px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: PURPLE_GLOW, border: `1px solid ${PURPLE_DIM}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "9px", color: PURPLE }}>{h.number}</span>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{h.title}</span>
                        <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "#f97316", padding: "4px 8px", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "2px", whiteSpace: "nowrap" }}>SEVERITY {h.severity}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>
                        Heuristic broken: {h.heuristic}
                      </div>
                      <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
                        <span style={{ color: PURPLE }}>↳ </span>{h.solution}
                      </p>
                    </div>
                  </div>
                  {/* Image directly below */}
                  <div style={{ borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "#0f0f0f" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.src} alt={h.title} style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Think Aloud */}
          <div style={{ padding: "40px", background: "var(--bg-card)", border: `1px solid ${PURPLE_DIM}`, borderRadius: "4px" }}>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,0.25)", letterSpacing: "3px", marginBottom: "6px" }}>EVALUATIVE RESEARCH</div>
            <h3 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Think Aloud Sessions</h3>
            <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "36px", maxWidth: "600px" }}>
              Measuring effectiveness and efficiency metrics to evaluate the performance of the website.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "32px" }}>
              {[
                { stat: "6", label: "Participants", body: "Young participants with disabilities performed a cognitive walkthrough of the platform." },
                { stat: "5", label: "Tasks", body: "Each participant completed 5 tasks and responded to structured follow-up questions." },
                { stat: "2", label: "Usability Metrics", body: "Data converted into quantitative effectiveness and efficiency metrics." },
              ].map(({ stat, label, body }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(24px,3vw,36px)", color: PURPLE, marginBottom: "10px" }}>{stat}</div>
                  <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{label}</div>
                  <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.65, margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Decisions ── */}
      <section id="decisions" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, letterSpacing: "3px", marginBottom: "24px" }}>05 — KEY DECISIONS</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.3 }}>
            Tackling the challenges through design
          </h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "640px", marginBottom: "64px" }}>
            Three core pinpoints identified through research, each addressed with a targeted design solution.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
            {PINPOINTS.map((p) => (
              <div key={p.number}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                  <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "10px", color: PURPLE }}>{p.number}</span>
                  <h3 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1rem,1.5vw,1.2rem)", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{p.title}</h3>
                </div>
                <div className="cs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>
                  <div style={{ padding: "24px", background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,80,80,0.7)", letterSpacing: "2px", marginBottom: "12px" }}>PINPOINT</div>
                    <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>{p.problem}</p>
                  </div>
                  <div style={{ padding: "24px", background: PURPLE_GLOW, border: `1px solid ${PURPLE_DIM}`, borderRadius: "4px" }}>
                    <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: PURPLE, letterSpacing: "2px", marginBottom: "12px" }}>SOLUTION</div>
                    <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: "0 0 16px" }}>{p.solution}</p>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {p.highlights.map((h) => (
                        <li key={h} style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "12px", color: PURPLE, lineHeight: 1.65, marginBottom: "5px", paddingLeft: "14px", position: "relative" }}>
                          <span style={{ position: "absolute", left: 0 }}>→</span>{h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="cs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[{ label: "BEFORE", src: p.before }, { label: "AFTER", src: p.after }].map(({ label, src }) => (
                    <div key={label}>
                      {!p.hideLabels && (
                        <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: label === "AFTER" ? PURPLE : "rgba(255,255,255,0.25)", letterSpacing: "2px", marginBottom: "10px" }}>{label}</div>
                      )}
                      <div style={{ borderRadius: "4px", overflow: "hidden", border: `1px solid ${label === "AFTER" ? PURPLE_DIM : "rgba(255,255,255,0.06)"}`, background: "#0f0f0f" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`${label} - ${p.title}`} style={{ width: "100%", height: "auto", display: "block" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Implementation ── */}
      <section id="implementation" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, letterSpacing: "3px", marginBottom: "24px" }}>06 — IMPLEMENTATION</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.3 }}>
            How we iterated and delivered
          </h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "640px", marginBottom: "64px" }}>
            A glimpse of how concepts were validated with client feedback and shipped as final designs.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "72px" }}>
            {IMPL_STEPS.map((step) => (
              <div key={step.number}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                  <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "10px", color: PURPLE }}>{step.number}</span>
                  <h3 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{step.title}</h3>
                </div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: "680px", marginBottom: "28px" }}>{step.body}</p>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${step.images.length},1fr)`, gap: "14px" }}>
                  {step.images.map((src, i) => (
                    <div key={i}>
                      <div style={{ borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#0f0f0f" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={step.captions[i]} style={{ width: "100%", height: "auto", display: "block" }} />
                      </div>
                      <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "8px", textAlign: "center" }}>{step.captions[i]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learnings ── */}
      <section id="learnings" style={{ padding: "80px 24px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, letterSpacing: "3px", marginBottom: "24px" }}>07 — LEARNINGS</div>
          <h2 style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "48px", lineHeight: 1.3 }}>
            How has this experience contributed to my growth?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>
            {LEARNINGS.map((l, i) => (
              <div key={l.title} style={{ padding: "28px", background: "var(--bg-card)", border: `1px solid ${PURPLE_DIM}`, borderRadius: "4px" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: PURPLE, marginBottom: "14px" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>{l.title}</div>
                <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(12px,1.8vw,18px)", color: "#fff", marginBottom: "24px", lineHeight: 1.7 }}>DESIGNING FOR THOSE WHO DESERVE BETTER ACCESS</h2>
          <p style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "36px", lineHeight: 1.8 }}>
            This project is live and serving youth with disabilities across the United States.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://www.transitiondiscoveries.org" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", padding: "14px 24px", background: PURPLE, color: "#0a0a0a", borderRadius: "2px", textDecoration: "none", letterSpacing: "1px" }}>
              VISIT LIVE SITE ↗
            </a>
            <a href="/#work"
              style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", padding: "14px 24px", background: "transparent", color: PURPLE, border: `1px solid ${PURPLE_DIM}`, borderRadius: "2px", textDecoration: "none", letterSpacing: "1px", display: "inline-grid", gridAutoFlow: "column", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "block", lineHeight: "1", fontSize: "14px", transform: "translateY(-4px)" }}>←</span>
              <span style={{ display: "block", lineHeight: "1" }}>BACK TO PORTFOLIO</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
