"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="py-10 px-6 border-t"
      style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <motion.a
          href="/#about"
          aria-label="Back to top"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0, 0, 0.2, 1] }}
          style={{ display: "inline-block" }}
        >
          <Image src="/logo.png" alt="VR Logo" width={36} height={36} style={{ height: "36px", width: "auto", opacity: 0.75 }} />
        </motion.a>
        <motion.p
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0, 0, 0.2, 1] }}
        >
          Designed &amp; built by Varuun Reddy
        </motion.p>
        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0, 0, 0.2, 1] }}
        >
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
        </motion.div>
      </div>
    </motion.footer>
  );
}
