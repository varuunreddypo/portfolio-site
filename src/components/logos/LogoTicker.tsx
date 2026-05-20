"use client";

// Logos duplicated so the strip is exactly 2× wide — animating to -50% gives a seamless loop.
const LOGOS = [
  { src: "/companies/Transition Discoveries.png", alt: "Transition Discoveries" },
  { src: "/companies/BCBSA.png",                  alt: "Blue Cross Blue Shield", height: 58 },
  { src: "/companies/reached.png",                alt: "Reached",           height: 54 },
  { src: "/companies/IU.png",                     alt: "Indiana University", height: 54 },
  { src: "/companies/DC Water.png",               alt: "DC Water"                },
  { src: "/companies/ampcus.png",                 alt: "Ampcus"                  },
  { src: "/companies/Indy Parks.png",             alt: "Indy Parks", invert: true },
];

export default function LogoTicker() {
  return (
    <div style={{ background: "var(--bg-primary)", padding: "28px 0 0" }}>
      <style>{`
        @keyframes ltScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .lt-track {
          display: flex;
          width: max-content;
          animation: ltScroll 30s linear infinite;
        }
        .lt-track:hover { animation-play-state: paused; }
      `}</style>

      {/* Padded + clipped strip — matches page max-width so logos stay within content bounds */}
      <div style={{ maxWidth: "1072px", margin: "0 auto", padding: "0 24px", overflow: "hidden", position: "relative" }}>

        {/* Left + right edge fade */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to right, var(--bg-primary) 0%, transparent 12%, transparent 88%, var(--bg-primary) 100%)",
        }} />

      <div className="lt-track">
        {[...LOGOS, ...LOGOS].map((logo, i) => (
          <div
            key={i}
            style={{ flexShrink: 0, padding: "0 36px", display: "flex", alignItems: "center" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              style={{
                height: `${logo.height ?? 40}px`,
                width: "auto",
                maxWidth: "160px",
                filter: `grayscale(1) brightness(0.6)${logo.invert ? " invert(1)" : ""}`,
                opacity: 0.75,
                transition: "filter 0.3s, opacity 0.3s",
                display: "block",
                userSelect: "none",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLImageElement).style.filter  = logo.invert ? "grayscale(0) brightness(1) invert(1)" : "grayscale(0) brightness(1)";
                (e.currentTarget as HTMLImageElement).style.opacity = "1";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLImageElement).style.filter  = `grayscale(1) brightness(0.6)${logo.invert ? " invert(1)" : ""}`;
                (e.currentTarget as HTMLImageElement).style.opacity = "0.75";
              }}
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
