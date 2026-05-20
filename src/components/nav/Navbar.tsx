"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Visitors", href: "/#visitors" },
  { label: "Playground", href: "/gym" },
];

const NAV_H = 80;

function scrollToHash(hash: string) {
  const el = document.getElementById(hash);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_H;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle hash on initial load (e.g. navigating from /work/bcbsa to /#work)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    // Wait for layout to settle before scrolling
    const t = setTimeout(() => scrollToHash(hash), 120);
    return () => clearTimeout(t);
  }, []);

  const bg = scrolled ? "rgba(10,10,10,0.96)" : "transparent";
  const blur = scrolled ? "blur(16px)" : "none";

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
        style={{
          background: bg,
          backdropFilter: blur,
          WebkitBackdropFilter: blur,
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          transition:
            "background 300ms cubic-bezier(0.4,0,0.2,1), border-color 300ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="VR"
              style={{ height: "48px", width: "auto", display: "block", filter: "brightness(0.6)" }}
            />
          </motion.a>

          {/* Desktop Links */}
          <ul
            className="desktop-nav-links flex items-center gap-8"
            style={{ listStyle: "none", margin: 0, padding: 0 }}
          >
            {navLinks.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + i * 0.06,
                  duration: 0.4,
                  ease: [0, 0, 0.2, 1],
                }}
              >
                <a
                  href={link.href}
                  className="nav-link"
                  style={{
                    fontFamily: '"Press Start 2P",monospace',
                    fontSize: "8px",
                    letterSpacing: "1px",
                    color: "var(--text-secondary)",
                    transition: "color 150ms cubic-bezier(0.0,0.0,0.2,1)",
                    textDecoration: "none",
                  }}
                  onClick={(e) => {
                    if (link.href.startsWith("/#")) {
                      e.preventDefault();
                      const hash = link.href.slice(2);
                      if (window.location.pathname === "/") {
                        scrollToHash(hash);
                      } else {
                        window.location.href = link.href;
                      }
                    }
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-secondary)")
                  }
                >
                  {link.label.toUpperCase()}
                </a>
              </motion.li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <motion.a
            href="/Varuun_Reddy_Resume.pdf"
            download
            className="desktop-nav-cta"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.4, ease: [0, 0, 0.2, 1] }}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: '"Press Start 2P",monospace',
              fontSize: "8px",
              letterSpacing: "1px",
              padding: "10px 16px",
              borderRadius: "2px",
              border: "1px solid var(--border-accent)",
              color: "var(--accent)",
              background: "transparent",
              textDecoration: "none",
              display: "inline-block",
              willChange: "transform",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            RESUME ↓
          </motion.a>

        </nav>
      </motion.header>

    </>
  );
}
