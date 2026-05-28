"use client";

import { useHeroMode } from "@/hooks/useHeroMode";

const ICON = 22;
const PAD  = 3;

export function InteriorRoleToggle() {
  const { mode, toggleMode } = useHeroMode();
  const isOn = mode === "pokeworld";
  const textColor = isOn ? "rgba(255,255,255,0.8)" : "rgba(10,24,48,0.7)";

  const Toggle = (
    <span
      role="switch"
      aria-checked={isOn}
      onClick={toggleMode}
      title={isOn ? "Switch to Designer Mode" : "Switch to Pokéworld Mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        width: ICON * 2 + PAD * 3,
        height: ICON + PAD * 2,
        borderRadius: (ICON + PAD * 2) / 2,
        background: isOn ? "rgba(12,8,36,0.88)" : "rgba(210,238,255,0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: `1px solid ${isOn ? "rgba(251,191,36,0.4)" : "rgba(26,40,80,0.22)"}`,
        boxShadow: isOn ? "0 0 10px rgba(251,191,36,0.16)" : "0 1px 6px rgba(0,0,0,0.12)",
        cursor: "pointer",
        overflow: "hidden",
        flexShrink: 0,
        verticalAlign: "middle",
        top: "-0.08em",
        marginLeft: "0.14em",
        marginRight: "0.18em",
        transition: "background 500ms ease, border-color 400ms ease",
      }}
    >
      {/* Sun slot */}
      <span style={{
        position: "absolute", left: PAD, top: PAD,
        width: ICON, height: ICON,
        opacity: isOn ? 0 : 1,
        transition: "opacity 400ms ease",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero vectors/sun.svg" alt="" width={ICON} height={ICON}
          style={{ display: "block", imageRendering: "pixelated", width: "100%", height: "100%" }} />
      </span>

      {/* Moon slot */}
      <span style={{
        position: "absolute", left: ICON + PAD * 2, top: PAD,
        width: ICON, height: ICON,
        opacity: isOn ? 1 : 0,
        transition: "opacity 400ms ease",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero vectors/moon.svg" alt="" width={ICON} height={ICON}
          style={{ display: "block", imageRendering: "pixelated", width: "100%", height: "100%" }} />
      </span>

    </span>
  );

  return (
    <span
      className="interior-role-toggle"
      style={{ color: textColor, transition: "color 400ms ease" }}
    >
      PR{Toggle}DUCT DESIGNER
    </span>
  );
}
