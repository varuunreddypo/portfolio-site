"use client";

import { HeroMode } from "@/hooks/useHeroMode";

interface Props {
  mode: HeroMode;
  toggleMode: () => void;
  hasSeenToggle: boolean;
}

export function HeroToggle({ mode, toggleMode, hasSeenToggle }: Props) {
  const isOpen = mode === "pokeworld";

  return (
    <>
      <style>{`
        .hero-toggle {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 999px;
          padding: 6px 14px 6px 6px;
          cursor: pointer;
          font-family: "Press Start 2P", monospace;
          font-size: 8px;
          letter-spacing: 0.1em;
          color: rgba(20,30,60,0.75);
          transition: background 200ms ease-out, border-color 200ms ease-out, transform 100ms ease-out;
        }
        .hero-toggle:hover {
          background: rgba(0,0,0,0.05);
          border-color: rgba(0,0,0,0.25);
        }
        .hero-toggle:active { transform: scale(0.97); }
        .hero-toggle:focus-visible {
          outline: 2px solid rgba(255,215,0,0.8);
          outline-offset: 3px;
        }
        .hero-toggle.is-pokeworld {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.9);
        }
        .hero-toggle.is-pokeworld:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,215,0,0.55);
        }

        /* Pokéball SVG */
        .htoggle-pokeball {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          transition: transform 400ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .hero-toggle.is-pokeworld .htoggle-pokeball {
          transform: rotate(-8deg);
        }
        .htoggle-top {
          transform-origin: 24px 24px;
          transition: transform 400ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .hero-toggle.is-pokeworld .htoggle-top {
          transform: rotate(-45deg) translateY(-6px);
        }
        .htoggle-beam {
          opacity: 0;
          transform-origin: 24px 24px;
          transition: opacity 300ms ease-out 200ms;
        }
        .hero-toggle.is-pokeworld .htoggle-beam {
          opacity: 1;
        }

        /* First-visit pulse */
        @keyframes togglePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(224,58,58,0.6); }
          50%       { box-shadow: 0 0 0 10px rgba(224,58,58,0); }
        }
        .hero-toggle.is-pulsing {
          animation: togglePulse 1.6s ease-out 1s 3;
        }

        @media (prefers-reduced-motion: reduce) {
          .htoggle-pokeball,
          .htoggle-top,
          .htoggle-beam,
          .hero-toggle.is-pulsing {
            animation: none !important;
            transition: opacity 200ms ease-out !important;
          }
        }
      `}</style>

      <button
        className={`hero-toggle${isOpen ? " is-pokeworld" : ""}${!hasSeenToggle ? " is-pulsing" : ""}`}
        onClick={toggleMode}
        aria-label={isOpen ? "Switch to Designer Mode" : "Switch to Pokéworld Mode"}
        aria-pressed={isOpen}
      >
        <svg className="htoggle-pokeball" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <g className="htoggle-top">
            <path d="M 4 24 A 20 20 0 0 1 44 24 L 28 24 A 4 4 0 0 0 20 24 Z" fill="#E03A3A" />
            <path d="M 4 24 A 20 20 0 0 1 44 24 L 28 24 A 4 4 0 0 0 20 24 Z" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
          </g>
          <g>
            <path d="M 4 24 A 20 20 0 0 0 44 24 L 28 24 A 4 4 0 0 1 20 24 Z" fill="#F5F5F5" />
            <path d="M 4 24 A 20 20 0 0 0 44 24 L 28 24 A 4 4 0 0 1 20 24 Z" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
          </g>
          <circle cx="24" cy="24" r="4" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="2" fill="#1a1a1a" />
          <g className="htoggle-beam">
            <path d="M 24 24 L 18 8 L 30 8 Z" fill="rgba(255,230,100,0.5)" />
          </g>
        </svg>
        <span style={{ fontWeight: 600, letterSpacing: "0.12em" }}>
          {isOpen ? "POKéWORLD" : "DESIGNER"}
        </span>
      </button>
    </>
  );
}
