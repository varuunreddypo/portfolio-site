"use client";

import Link from "next/link";

type ImageSlot = {
  label: string;
  src?: string;
};

type Column = {
  flex?: number;
  slots: ImageSlot[];
};

type Project = {
  id: number;
  title: string;
  description: string;
  color: string;
  columns: Column[];
  caseStudyHref?: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Care Coordination Portal — Blue Cross Blue Shield",
    description:
      "Led the enhancement and modernization of the Care Coordination Portal, a report-driven platform used across Federal Employee Program plans. Drove stakeholder-aligned redesign efforts that raised user satisfaction by 39%, accelerated design-to-development handoffs by 40%, and supported the phased migration to CareCoordination360.",
    color: "#38bdf8",
    caseStudyHref: "/work/bcbsa",
    columns: [
      { flex: 0.7, slots: [{ label: "BCBSA Poster", src: "/work/bcbsa/BCBSA.jpeg" }] },
      { flex: 1,   slots: [{ label: "Report View", src: "/work/bcbsa/report.jpeg" }, { label: "Portal View", src: "/work/bcbsa/portal.jpeg" }] },
    ],
  },
  {
    id: 2,
    title: "RoomBees — Roommate & Housing Discovery",
    description:
      "As Head of Design, built the full product from concept to launch — logo, design system, onboarding, search, and listing workflows. Supported 250+ active users across web and mobile, improving onboarding completion rates through iterative, research-driven UX decisions.",
    color: "#ffd700",
    caseStudyHref: "/work/roombees",
    columns: [
      { flex: 1, slots: [{ label: "RoomBees", src: "/work/RoomBees/roombees.png" }] },
    ],
  },
  {
    id: 3,
    title: "Transition Discoveries — Inclusive Redesign",
    description:
      "Directed the end-to-end redesign of a website with a focus on inclusive design and AI-driven conversational interfaces. Improved accessibility scores by 25%, translated 50+ research insights into 30+ actionable design solutions, and delivered 25+ high-fidelity prototypes through iterative usability testing.",
    color: "#a78bfa",
    columns: [
      { slots: [{ label: "Homepage" }, { label: "Chat UI" }] },
      { slots: [{ label: "Full Page" }] },
      { slots: [{ label: "Accessibility" }, { label: "Journey Map" }] },
    ],
  },
  {
    id: 4,
    title: "DC Water SaaS Platform — Ampcus Inc",
    description:
      "Led the UX/UI redesign of a SaaS water utility platform. Implemented A/B testing that reduced bounce rate by 15%, overhauled the Fire Hydrant permit workflow to cut incident response times by 25%, and deployed heatmap analysis to drive a 43% improvement in user experience.",
    color: "#00ff88",
    columns: [
      { slots: [{ label: "Dashboard" }, { label: "Notifications" }] },
      { slots: [{ label: "Fire Hydrant Module" }] },
      { slots: [{ label: "Permit Flow" }, { label: "Analytics" }] },
    ],
  },
  {
    id: 5,
    title: "Canvas UX & Mainstay — Indiana University",
    description:
      "Designed and optimized weekly newsletters for 4,500+ students and revitalized the Canvas website UX, increasing engagement by 25% and reducing bounce rate by 19%. Integrated AI-driven conversational experiences using Mainstay, improving academic support chatbot efficiency by 20%.",
    color: "#fb923c",
    columns: [
      { slots: [{ label: "Canvas Home" }, { label: "Newsletter" }] },
      { slots: [{ label: "Chatbot UI" }] },
      { slots: [{ label: "Student Portal" }, { label: "Analytics" }] },
    ],
  },
  {
    id: 6,
    title: "EV Pitstop — Reached Technologies",
    description:
      "Conducted in-depth research on the Indian EV market and drove the end-to-end design process for EV Pitstop — an app for EV owners finding charging infrastructure. Applied iterative design thinking across sketches, wireframes, and prototypes, achieving a 97% task completion rate and a 50% reduction in support tickets.",
    color: "#34d399",
    columns: [
      { slots: [{ label: "Home Screen" }] },
      { slots: [{ label: "Map View" }, { label: "Station Detail" }, { label: "Booking" }] },
      { slots: [{ label: "Profile" }, { label: "Charging Flow" }] },
    ],
  },
];

function ImageCollage({ columns, color }: { columns: Column[]; color: string }) {
  return (
    <div className="flex gap-3 w-full" style={{ height: "420px" }}>
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-3" style={{ flex: col.flex ?? 1, minWidth: 0 }}>
          {col.slots.map((slot, si) => (
            <div
              key={si}
              className="rounded-sm overflow-hidden flex-1 flex items-center justify-center relative"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                minHeight: 0,
              }}
            >
              {slot.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slot.src}
                  alt={slot.label}
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
                  <span
                    className="relative text-xs font-medium tracking-wide"
                    style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-body)" }}
                  >
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

function ProjectEntry({ project }: { project: Project }) {
  return (
    <div className="w-full">
      <ImageCollage columns={project.columns} color={project.color} />
      <div className="mt-7 max-w-3xl">
        <div className="flex items-center gap-3 mb-3">
          <h3
            className="font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {project.title}
          </h3>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
            <path d="M2 12L12 2M12 2H6M12 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="leading-relaxed" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.75", marginBottom: project.caseStudyHref ? "20px" : "0" }}>
          {project.description}
        </p>
        {project.caseStudyHref && (
          <Link href={project.caseStudyHref}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: '"Press Start 2P",monospace', fontSize: "8px", color: "var(--accent)", textDecoration: "none", letterSpacing: "1px", padding: "10px 18px", border: "1px solid rgba(0,255,136,0.3)", borderRadius: "2px", transition: "background .15s, border-color .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,255,136,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,136,0.6)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,136,0.3)"; }}
          >
            VIEW CASE STUDY →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function WorkSection() {
  return (
    <section id="work" className="py-28 px-6" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2
            className="font-semibold mb-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 2vw, 1.5rem)", color: "var(--text-primary)" }}
          >
            Work Showcase
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            My craft, condensed into the products I am proud of!
          </p>
        </div>
        <div className="flex flex-col" style={{ gap: "7rem" }}>
          {projects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
