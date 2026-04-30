"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Visitors", href: "#visitors" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(13, 13, 13, 0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="VR" style={{ height: "48px", width: "auto", display: "block" }} />
        </a>

        {/* Links */}
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", letterSpacing: "1px", color: "var(--text-secondary)", transition: "color .2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                {link.label.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>

        {/* CV Download */}
        <a
          href="/Varuun_Reddy_Resume.pdf"
          download
          style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "8px", letterSpacing: "1px", padding: "10px 16px", borderRadius: "2px", border: "1px solid var(--border-accent)", color: "var(--accent)", background: "transparent", textDecoration: "none", transition: "background .2s" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          RESUME ↓
        </a>
      </nav>
    </header>
  );
}
