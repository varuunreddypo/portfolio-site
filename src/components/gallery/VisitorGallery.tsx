"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SPR = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

const TYPE_BY_ID: Record<number, string> = {
  1: "grass", 4: "fire", 7: "water", 25: "electric", 37: "fire",
  133: "normal", 152: "grass", 155: "fire", 158: "water",
  252: "grass", 255: "fire", 258: "water", 387: "grass",
  390: "fire", 393: "water", 495: "grass",
};

const TYPE_SCENE: Record<string, { skyA: string; skyB: string; groundA: string; groundB: string; stars: boolean }> = {
  grass:    { skyA: "#3a7bd5", skyB: "#1a4a8a", groundA: "#2d7a3a", groundB: "#1a5a28", stars: false },
  fire:     { skyA: "#c43a00", skyB: "#6a1a00", groundA: "#8a3010", groundB: "#5a1a08", stars: false },
  water:    { skyA: "#1a5aaa", skyB: "#0a2a60", groundA: "#0a4a88", groundB: "#083060", stars: true  },
  electric: { skyA: "#7a7200", skyB: "#3a3600", groundA: "#5a5200", groundB: "#302e00", stars: false },
  normal:   { skyA: "#3a5aaa", skyB: "#1a2a6a", groundA: "#2a5a30", groundB: "#183a20", stars: true  },
  poison:   { skyA: "#5a1a7a", skyB: "#2a0a4a", groundA: "#3a1050", groundB: "#200830", stars: true  },
};

const MINI_STARS = [
  { x: "8%", y: "12%" }, { x: "24%", y: "6%" }, { x: "46%", y: "16%" },
  { x: "64%", y: "8%" }, { x: "82%", y: "13%" },
];

type SavedCard = {
  id: number;
  name: string;
  pokemonId: number;
  pokemonName: string;
  cardColor: string;
  issueDate: string;
  cardNo: number;
};

const SEED_CARDS: SavedCard[] = [
  { id: 1, name: "ASH",    pokemonId: 25,  pokemonName: "Pikachu",    cardColor: "#c09800", issueDate: "04/10/26", cardNo: 1001 },
  { id: 2, name: "MISTY",  pokemonId: 7,   pokemonName: "Squirtle",   cardColor: "#2060a8", issueDate: "04/14/26", cardNo: 1002 },
  { id: 3, name: "BROCK",  pokemonId: 4,   pokemonName: "Charmander", cardColor: "#c84010", issueDate: "04/18/26", cardNo: 1003 },
  { id: 4, name: "DAWN",   pokemonId: 393, pokemonName: "Piplup",     cardColor: "#2848a0", issueDate: "04/20/26", cardNo: 1004 },
  { id: 5, name: "MAY",    pokemonId: 255, pokemonName: "Torchic",    cardColor: "#d06818", issueDate: "04/22/26", cardNo: 1005 },
  { id: 6, name: "SERENA", pokemonId: 495, pokemonName: "Snivy",      cardColor: "#208038", issueDate: "04/24/26", cardNo: 1006 },
  { id: 7, name: "RED",    pokemonId: 1,   pokemonName: "Bulbasaur",  cardColor: "#2e6e2e", issueDate: "04/26/26", cardNo: 1007 },
];

const PAGE_SIZE = 10;

type StarterCount = { name: string; pokemonId: number; count: number };

function computeStats(cards: SavedCard[]) {
  const counts: Record<string, StarterCount> = {};
  cards.forEach(c => {
    if (!counts[c.pokemonName]) counts[c.pokemonName] = { name: c.pokemonName, pokemonId: c.pokemonId, count: 0 };
    counts[c.pokemonName].count++;
  });
  const breakdown = Object.values(counts).sort((a, b) => b.count - a.count);
  return {
    total: cards.length,
    top: breakdown[0] ?? null,
    unique: breakdown.length,
    latestNo: cards[cards.length - 1]?.cardNo ?? 0,
    breakdown,
  };
}

function MiniCard({ card }: { card: SavedCard }) {
  const type = TYPE_BY_ID[card.pokemonId] ?? "normal";
  const scene = TYPE_SCENE[type] ?? TYPE_SCENE.normal;

  return (
    <div style={{
      width: "100%", borderRadius: "5px",
      border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #0a0a0a",
      overflow: "hidden", position: "relative",
    }}>
      {/* Inner highlight stripe */}
      <div style={{ position: "absolute", inset: 0, border: "3px solid rgba(255,255,255,0.15)", borderRadius: "3px", zIndex: 10, pointerEvents: "none" }} />

      {/* Sky + ground */}
      <div style={{
        background: `linear-gradient(180deg, ${scene.skyA} 0%, ${scene.skyB} 62%, ${scene.groundA} 62%, ${scene.groundB} 100%)`,
        padding: "10px 12px 0",
        position: "relative",
        height: "96px",
      }}>
        {/* Stars */}
        {scene.stars && MINI_STARS.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: "2px", height: "2px", background: "rgba(255,255,255,0.7)", borderRadius: "50%", pointerEvents: "none" }} />
        ))}

        {/* Cloud shimmer */}
        <div style={{ position: "absolute", top: "24%", left: 0, right: 0, height: "16px", background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 40%,rgba(255,255,255,0.08) 60%,transparent 100%)", pointerEvents: "none" }} />

        {/* Sprite anchored to ground line */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${SPR}${card.pokemonId}.png`} alt={card.pokemonName} width={72} height={72}
          style={{ position: "absolute", right: "-2px", bottom: "0px", imageRendering: "pixelated", opacity: 0.95, filter: "drop-shadow(1px 0 0 rgba(0,0,0,0.5)) drop-shadow(-1px 2px 3px rgba(0,0,0,0.4))" }} />

        {/* Text */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "5px", color: "rgba(255,255,255,0.88)", lineHeight: 1.9, marginBottom: "6px", textShadow: "1px 1px 0 rgba(0,0,0,0.5)" }}>
            VARUUN&apos;S<br />POKè WORLD
          </div>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "4px", color: "rgba(255,255,255,0.45)", marginBottom: "3px" }}>TRAINER</div>
          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "#fff", textShadow: "1px 1px 0 rgba(0,0,0,0.6)", maxWidth: "95px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {card.name}
          </div>
        </div>
      </div>

      {/* Bottom dark strip */}
      <div style={{ background: "#1a1a1a", padding: "7px 12px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "14px" }}>
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "4px", color: "rgba(255,255,255,0.35)", marginBottom: "3px" }}>STARTER</div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "5px", color: "#ffcc00" }}>{(card.pokemonName ?? "—").toUpperCase()}</div>
          </div>
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "4px", color: "rgba(255,255,255,0.35)", marginBottom: "3px" }}>NO.</div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "5px", color: "#ffcc00" }}>{card.cardNo}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VisitorGallery() {
  const [cards, setCards] = useState<SavedCard[]>(SEED_CARDS);
  const [statsOpen, setStatsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Fetch from database, fall back to localStorage if unavailable
    fetch("/api/cards")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((rows: { id: number; name: string; pokemon_id: number; pokemon_name: string; card_color: string; issue_date: string; card_no: number }[]) => {
        if (!Array.isArray(rows) || rows.length === 0) return;
        const dbCards: SavedCard[] = rows.map(r => ({
          id: r.id,
          name: r.name,
          pokemonId: r.pokemon_id,
          pokemonName: r.pokemon_name,
          cardColor: r.card_color,
          issueDate: r.issue_date,
          cardNo: r.card_no,
        }));
        setCards([...SEED_CARDS, ...dbCards]);
      })
      .catch(() => {
        // Fall back to localStorage
        try {
          const raw = JSON.parse(localStorage.getItem("vr_trainer_cards") ?? "[]");
          const saved: SavedCard[] = raw.filter(
            (c: unknown) => c && typeof c === "object" && "pokemonName" in (c as object) && "pokemonId" in (c as object)
          );
          if (saved.length) setCards([...SEED_CARDS, ...saved]);
        } catch { /* ignore */ }
      });
  }, []);

  const stats = computeStats(cards);
  const visibleCards = expanded ? cards : cards.slice(0, PAGE_SIZE);
  const remaining = cards.length - PAGE_SIZE;

  return (
    <section id="visitors" className="py-16 px-6" style={{ background: "var(--bg-secondary)" }}>
      <style>{`
        @keyframes vgFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .vg-card-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
      `}</style>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
        >
          <h2 className="font-semibold mb-3" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: "clamp(0.82rem, 1.55vw, 1.1rem)", color: "var(--text-primary)", lineHeight: 1.6 }}>
            Visitor Gallery
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.65rem", fontFamily: '"Press Start 2P", monospace', lineHeight: 2 }}>
            <span style={{ color: "var(--accent)" }}>{stats.total} trainers</span> have stopped by — yours could be here too.
          </p>
        </motion.div>

        {/* ── Stats Dropdown ── */}
        <div style={{ marginBottom: "32px" }}>
          <button
            onClick={() => setStatsOpen(v => !v)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "12px 18px", background: "rgba(0,255,136,0.04)",
              border: "1px solid rgba(0,255,136,0.25)", borderRadius: "6px",
              color: "var(--accent)", fontFamily: '"Press Start 2P",monospace',
              fontSize: "7px", letterSpacing: "2px", cursor: "pointer",
              transition: "border-color .2s, background .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.6)"; e.currentTarget.style.background = "rgba(0,255,136,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.25)"; e.currentTarget.style.background = "rgba(0,255,136,0.04)"; }}
          >
            <span>TRAINER STATS</span>
            <span style={{ display: "inline-block", fontSize: "16px", lineHeight: "1", transition: "transform .3s", transform: statsOpen ? "translateY(0px) rotate(180deg)" : "translateY(-2px)", transformOrigin: "center center" }}>▾</span>
          </button>

          <div style={{ overflow: "hidden", maxHeight: statsOpen ? "700px" : "0", transition: "max-height .45s cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* 4 metric cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "10px" }}>
                {([
                  { label: "TOTAL TRAINERS",   value: String(stats.total),                       sub: "all time",           icon: null },
                  { label: "TOP STARTER",       value: stats.top?.name.toUpperCase() ?? "—",     sub: `${stats.top?.count ?? 0} trainers picked`, icon: stats.top?.pokemonId ?? null },
                  { label: "LATEST CARD NO.",   value: `#${stats.latestNo}`,                      sub: "most recent visitor", icon: null },
                  { label: "UNIQUE STARTERS",   value: String(stats.unique),                      sub: "pokémon chosen",     icon: null },
                ] as { label: string; value: string; sub: string; icon: number | null }[]).map(({ label, value, sub, icon }) => (
                  <div key={label} style={{ padding: "20px", background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px" }}>
                    <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "12px" }}>{label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      {icon && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`${SPR}${icon}.png`} alt="" width={30} height={30} style={{ imageRendering: "pixelated", opacity: 0.8 }} />
                      )}
                      <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "clamp(11px,1.8vw,16px)", color: "var(--text-primary)", lineHeight: 1.2 }}>{value}</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Starter breakdown bar chart */}
              <div style={{ padding: "20px", background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px" }}>
                <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "16px" }}>STARTER BREAKDOWN</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {stats.breakdown.map((s, i) => {
                    const pct = stats.top ? (s.count / stats.top.count) * 100 : 0;
                    return (
                      <div key={s.name} style={{ display: "grid", gridTemplateColumns: "26px 1fr auto", alignItems: "center", gap: "10px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${SPR}${s.pokemonId}.png`} alt={s.name} width={24} height={24} style={{ imageRendering: "pixelated", opacity: 0.75 }} />
                        <div>
                          <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "6px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>{s.name.toUpperCase()}</div>
                          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "2px", height: "5px", overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: statsOpen ? `${pct}%` : "0%",
                              borderRadius: "2px",
                              background: i === 0 ? "var(--accent)" : "rgba(255,255,255,0.22)",
                              transition: `width .7s ${i * 0.06}s ease`,
                            }} />
                          </div>
                        </div>
                        <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: "7px", color: "rgba(255,255,255,0.4)", minWidth: "16px", textAlign: "right" }}>{s.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Card grid ── */}
        <div className="vg-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "14px" }}>
          {visibleCards.map((card, i) => (
            <div key={card.id} style={{ animation: `vgFadeUp .4s ${Math.min(i, PAGE_SIZE - 1) * 0.04}s ease both` }}>
              <MiniCard card={card} />
            </div>
          ))}
        </div>

        {/* ── Show more / count ── */}
        {cards.length > PAGE_SIZE && (
          <div style={{ textAlign: "center", marginTop: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setExpanded(v => !v)}
              style={{
                fontFamily: '"Press Start 2P",monospace', fontSize: "7px", letterSpacing: "1.5px",
                padding: "12px 24px", background: "transparent", color: "var(--accent)",
                border: "1px solid rgba(0,255,136,0.3)", borderRadius: "2px",
                cursor: "pointer", transition: "background .15s, border-color .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.06)"; e.currentTarget.style.borderColor = "rgba(0,255,136,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"; }}
            >
              {expanded
                ? "SHOW LESS ↑"
                : `SHOW ${remaining} MORE TRAINER${remaining !== 1 ? "S" : ""} ↓`}
            </button>
            <div style={{ fontFamily: "var(--font-display,sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "1px" }}>
              Showing {visibleCards.length} of {cards.length}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
