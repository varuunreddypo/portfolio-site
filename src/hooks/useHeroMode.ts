"use client";

import { useEffect, useState } from "react";

export type HeroMode = "designer" | "pokeworld";

const HERO_MODE_EVENT = "hero-mode-change";

export function useHeroMode() {
  const [mode, setMode] = useState<HeroMode>("designer");
  const [hasSeenToggle, setHasSeenToggle] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("hero-mode") as HeroMode | null;
    if (stored === "designer" || stored === "pokeworld") setMode(stored);
    setHasSeenToggle(localStorage.getItem("hero-toggle-seen") === "true");

    const handleChange = (e: Event) => setMode((e as CustomEvent<HeroMode>).detail);
    window.addEventListener(HERO_MODE_EVENT, handleChange);
    return () => window.removeEventListener(HERO_MODE_EVENT, handleChange);
  }, []);

  function toggleMode() {
    const next: HeroMode = mode === "designer" ? "pokeworld" : "designer";
    setMode(next);
    localStorage.setItem("hero-mode", next);
    window.dispatchEvent(new CustomEvent<HeroMode>(HERO_MODE_EVENT, { detail: next }));
    if (!hasSeenToggle) {
      localStorage.setItem("hero-toggle-seen", "true");
      setHasSeenToggle(true);
    }
  }

  return { mode, toggleMode, hasSeenToggle };
}
