"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CharizardEgg from "@/components/easter-eggs/CharizardEgg";
import BellsproutBush from "@/components/easter-eggs/BellsproutBush";
import GengarCave from "@/components/easter-eggs/GengarCave";
import PsyduckEgg from "@/components/easter-eggs/PsyduckEgg";

type ImageSlot = { label: string; src?: string };
type Column    = { flex?: number; slots: ImageSlot[] };
type Project   = {
  id: number; title: string; description: string; color: string;
  columns: Column[]; caseStudyHref?: string; locked?: boolean;
  figmaHref?: string; liveHref?: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "RoomBees — Roommate & Housing Discovery",
    description:
      "As Head of Design, built the full product from concept to launch — logo, design system, onboarding, search, and listing workflows. Supported 250+ active users across web and mobile, improving onboarding completion rates through iterative, research-driven UX decisions.",
    color: "#ffd700",
    caseStudyHref: "/work/roombees",
    liveHref: "https://www.roombees.com/",
    locked: true,
    columns: [{ flex: 1, slots: [{ label: "RoomBees", src: "/work/RoomBees/roombees.png" }] }],
  },
  {
    id: 2,
    title: "Care Coordination Portal — Blue Cross Blue Shield",
    description:
      "Led the enhancement and modernization of the Care Coordination Portal, a report-driven platform used across Federal Employee Program plans. Drove stakeholder-aligned redesign efforts that raised user satisfaction by 39%, accelerated design-to-development handoffs by 40%, and supported the phased migration to CareCoordination360.",
    color: "#38bdf8",
    caseStudyHref: "/work/bcbsa",
    locked: true,
    columns: [
      { flex: 0.7, slots: [{ label: "BCBSA Poster", src: "/work/BCBSA/BCBSA.jpeg" }] },
      { flex: 1,   slots: [{ label: "Report View", src: "/work/BCBSA/report.jpeg" }, { label: "Portal View", src: "/work/BCBSA/portal.jpeg" }] },
    ],
  },
  {
    id: 3,
    title: "Transition Discoveries — Inclusive Redesign",
    description:
      "Directed the end-to-end redesign of a website with a focus on inclusive design and AI-driven conversational interfaces. Improved accessibility scores by 25%, translated 50+ research insights into 30+ actionable design solutions, and delivered 25+ high-fidelity prototypes through iterative usability testing.",
    color: "#34d399",
    caseStudyHref: "/work/transition-discoveries",
    liveHref: "https://transitiondiscoveries.org/",
    columns: [{ flex: 1, slots: [{ label: "Transition Discoveries", src: "/work/transition%20discoveries/transition%20hero%20collage.png" }] }],
  },
  {
    id: 4,
    title: "DC Water SaaS Platform — Ampcus Inc",
    description:
      "Led the UX/UI redesign of a SaaS water utility platform. Implemented A/B testing that reduced bounce rate by 15%, overhauled the Fire Hydrant permit workflow to cut incident response times by 25%, and deployed heatmap analysis to drive a 43% improvement in user experience.",
    color: "#00ff88",
    caseStudyHref: "/work/acquaa",
    columns: [{ flex: 1, slots: [{ label: "Ampcus", src: "/work/DC Water/ampcus hero.png" }] }],
  },
  {
    id: 5,
    title: "Indy Parks — Design Project",
    description:
      "Transformed the Indy Parks platform into a more inclusive and intuitive experience by simplifying complex user journeys and prioritizing accessibility, making it easier for the community to explore and connect with local spaces.",
    color: "#fb923c",
    figmaHref: "https://www.figma.com/proto/dQ63NWOVTFNgQi0qMrCGHj/Indy-Parks?page-id=0%3A1&type=design&node-id=5-46&viewport=613%2C397%2C0.42&t=kqOCm6ZYDWnuaIlI-1&scaling=contain&mode=design",
    liveHref: "https://parks.indy.gov/",
    columns: [{ flex: 1, slots: [{ label: "Indy Parks", src: "/work/Indy Parks/Indy Parks.png" }] }],
  },
];

// ── Animation variants ────────────────────────────────────────────────────────
const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];

const fadeUpVariants = {
  hidden:  { opacity: 0, y: 40, scale: 0.976 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.65, ease: EASE_OUT } },
};

const headingContainerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.1 } },
};

const headingItemVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.5, ease: EASE_OUT } },
};

// ── Image Collage ─────────────────────────────────────────────────────────────
function ImageCollage({ columns, color }: { columns: Column[]; color: string }) {
  return (
    <div
      className="flex gap-3 w-full work-collage"
      style={{ height: "420px", borderRadius: "4px", overflow: "hidden" }}
    >
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-3" style={{ flex: col.flex ?? 1, minWidth: 0 }}>
          {col.slots.map((slot, si) => (
            <div
              key={si}
              className="rounded-sm overflow-hidden flex-1 flex items-center justify-center relative"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", minHeight: 0 }}
            >
              {slot.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slot.src}
                  alt={slot.label}
                  loading="lazy"
                  decoding="async"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(${color}06 1px, transparent 1px), linear-gradient(90deg, ${color}06 1px, transparent 1px)`,
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <span className="relative text-xs font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-body)" }}>
                    {slot.label}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Project Entry ─────────────────────────────────────────────────────────────
function ProjectEntry({ project }: { project: Project }) {
  return (
    <div className="w-full">
      <ImageCollage columns={project.columns} color={project.color} />

      <div className="mt-7 max-w-3xl work-project-meta">
        <div className="flex items-center gap-3 mb-3">
          <h3
            className="font-semibold"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.5vw, 1.2rem)", color: "var(--text-primary)", letterSpacing: "-0.01em" }}
          >
            {project.title}
          </h3>
          {project.liveHref && (
            <motion.a
              href={project.liveHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.25, y: -1, color: "#ffffff" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              style={{ color: "var(--accent)", flexShrink: 0, display: "flex", touchAction: "manipulation" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H6M12 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          )}
        </div>

        <p
          className="leading-relaxed"
          style={{
            color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.75",
            marginBottom: (project.caseStudyHref || project.figmaHref) ? "20px" : "0",
          }}
        >
          {project.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          {project.caseStudyHref && (
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              style={{ touchAction: "manipulation" }}
            >
              <Link
                href={project.caseStudyHref}
                style={{
                  display: "inline-grid", gridAutoFlow: "column", alignItems: "center", gap: "8px",
                  fontFamily: '"Press Start 2P",monospace', fontSize: "8px", lineHeight: "1",
                  color: "var(--accent)", textDecoration: "none", letterSpacing: "1px",
                  padding: "10px 18px", border: "1px solid rgba(0,255,136,0.3)", borderRadius: "2px",
                  transition: "background 150ms cubic-bezier(0.0,0.0,0.2,1), border-color 150ms cubic-bezier(0.0,0.0,0.2,1)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(0,255,136,0.06)";
                  el.style.borderColor = "rgba(0,255,136,0.6)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                  el.style.borderColor = "rgba(0,255,136,0.3)";
                }}
              >
                {project.locked && (
                  <svg width="10" height="10" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", opacity: 0.75, transform: "translateY(-1px)" }}>
                    <rect x="1" y="5" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
                <span style={{ display: "block", lineHeight: "1", whiteSpace: "nowrap" }}>VIEW CASE STUDY</span>
                <span style={{ display: "block", lineHeight: "1", fontSize: "14px", transform: "translateY(-4px)" }}>→</span>
              </Link>
            </motion.div>
          )}

          {project.figmaHref && (
            <motion.a
              href={project.figmaHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              style={{
                display: "inline-grid", gridAutoFlow: "column", alignItems: "center", gap: "8px",
                fontFamily: '"Press Start 2P",monospace', fontSize: "8px", lineHeight: "1",
                color: "#fb923c", textDecoration: "none", letterSpacing: "1px", touchAction: "manipulation",
                padding: "10px 18px", border: "1px solid rgba(251,146,60,0.3)", borderRadius: "2px",
                transition: "background 150ms cubic-bezier(0.0,0.0,0.2,1), border-color 150ms cubic-bezier(0.0,0.0,0.2,1)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(251,146,60,0.06)";
                el.style.borderColor = "rgba(251,146,60,0.6)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.borderColor = "rgba(251,146,60,0.3)";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", transform: "translateY(-1px)" }}>
                <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="currentColor" opacity="0.9"/>
                <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" fill="currentColor" opacity="0.6"/>
                <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" fill="currentColor" opacity="0.9"/>
                <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="currentColor" opacity="0.7"/>
                <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="currentColor" opacity="0.8"/>
              </svg>
              <span style={{ display: "block", lineHeight: "1", whiteSpace: "nowrap" }}>PRESENTATION LINK</span>
              <span style={{ display: "block", lineHeight: "1", fontSize: "14px", transform: "translateY(-4px)" }}>→</span>
            </motion.a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────
export default function WorkSection() {
  return (
    <section id="work" className="pb-28 px-6" style={{ background: "var(--bg-primary)", paddingTop: "5rem" }}>
      <style>{`
        @media (max-width: 640px) {
          #work { padding-top: 2.5rem !important; padding-bottom: 3rem !important; padding-left: 16px !important; padding-right: 16px !important; }
          .work-heading { margin-bottom: 2rem !important; }
          .work-projects { gap: 3rem !important; }
          .work-collage { height: 200px !important; }
          .work-easter-egg { display: none !important; }
          .work-project-meta { margin-top: 1rem !important; }
        }
      `}</style>
      <div className="max-w-5xl mx-auto">

        {/* Section heading — stagger children */}
        <motion.div
          className="text-center mb-20 work-heading"
          variants={headingContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2
            variants={headingItemVariants}
            className="font-semibold mb-3"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "clamp(0.82rem, 1.55vw, 1.1rem)",
              color: "var(--text-primary)",
              lineHeight: 1.6,
            }}
          >
            Work Showcase
          </motion.h2>
          <motion.p
            variants={headingItemVariants}
            style={{ color: "var(--text-secondary)", fontSize: "0.65rem", fontFamily: '"Press Start 2P", monospace', lineHeight: 2 }}
          >
            My craft, condensed into the products I am proud of!
          </motion.p>
        </motion.div>

        <div className="flex flex-col work-projects" style={{ gap: "7rem" }}>
          {projects.map((project, i) => (
            <Fragment key={project.id}>
              {i === 0 ? (
                <motion.div
                  id={`project-${project.id}`}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  style={{ position: "relative" }}
                >
                  <ProjectEntry project={project} />
                  <div className="work-easter-egg" style={{ position: "absolute", bottom: "-7rem", right: 0, width: "420px", height: "180px", overflow: "hidden", zIndex: 4 }}>
                    <CharizardEgg />
                  </div>
                </motion.div>
              ) : i === 1 ? (
                <motion.div
                  id={`project-${project.id}`}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  style={{ position: "relative" }}
                >
                  <ProjectEntry project={project} />
                  <div className="work-easter-egg" style={{ position: "absolute", bottom: "-7rem", left: "calc(-24px - max(0px, (100vw - 1072px) / 2))", width: "180px", zIndex: 4 }}>
                    <BellsproutBush />
                  </div>
                </motion.div>
              ) : i === 2 ? (
                <motion.div
                  id={`project-${project.id}`}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  style={{ position: "relative" }}
                >
                  <ProjectEntry project={project} />
                  <div className="work-easter-egg" style={{ position: "absolute", bottom: "-7rem", right: "calc(-24px - max(0px, (100vw - 1072px) / 2))", width: "320px", zIndex: 4 }}>
                    <GengarCave />
                  </div>
                </motion.div>
              ) : i === 4 ? (
                <motion.div
                  id={`project-${project.id}`}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  style={{ position: "relative" }}
                >
                  <ProjectEntry project={project} />
                  <div className="work-easter-egg" style={{ position: "absolute", bottom: "-7rem", right: "calc(-24px - max(0px, (100vw - 1072px) / 2))", width: "200px", zIndex: 4 }}>
                    <PsyduckEgg />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  id={`project-${project.id}`}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  <ProjectEntry project={project} />
                </motion.div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
