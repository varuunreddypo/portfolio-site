"use client";

export default function Footer() {
  return (
    <footer
      className="py-10 px-6 border-t"
      style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-pixel text-xs" style={{ color: "var(--accent)" }}>
          VR
        </span>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Designed &amp; built by Varuun Reddy · Dallas, TX
        </p>
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/varuun-reddy-pochampally"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            LinkedIn
          </a>
          <a
            href="mailto:varuunreddypo@gmail.com"
            className="text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
