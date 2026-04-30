"use client";

import { useState, useEffect } from "react";

const SPR = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

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

function MiniCard({ card }: { card: SavedCard }) {
  return (
    <div style={{
      width: "180px", height: "108px", borderRadius: "10px", padding: "12px 14px",
      background: card.cardColor, position: "relative", overflow: "hidden", flexShrink: 0,
    }}>
      {/* Dot grid */}
      <div style={{ position: "absolute", right: 0, top: 0, width: "100px", height: "100px", opacity: 0.12, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.9) 1px,transparent 1px)", backgroundSize: "8px 8px", pointerEvents: "none" }} />
      {/* Shine */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,.14) 0%,transparent 55%)", pointerEvents: "none" }} />

      {/* Sprite */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SPR}${card.pokemonId}.png`} alt={card.pokemonName} width={44} height={44}
        style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", imageRendering: "pixelated", opacity: 0.88, filter: "drop-shadow(1px 1px 3px rgba(0,0,0,.5))" }} />

      <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "5.5px", color: "rgba(255,255,255,.52)", letterSpacing: "1.5px", marginBottom: "2px" }}>TRAINER</div>
      <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "9.5px", color: "rgba(255,255,255,.95)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "8px", maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {card.name}
      </div>

      <div style={{ display: "flex", gap: "14px" }}>
        <div>
          <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "5px", color: "rgba(255,255,255,.45)", letterSpacing: "1px", marginBottom: "1px" }}>STARTER</div>
          <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "7px", color: "rgba(255,255,255,.88)", fontWeight: 700 }}>{(card.pokemonName ?? "—").toUpperCase()}</div>
        </div>
        <div>
          <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "5px", color: "rgba(255,255,255,.45)", letterSpacing: "1px", marginBottom: "1px" }}>NO.</div>
          <div style={{ fontFamily: '"Space Mono",monospace', fontSize: "7px", color: "rgba(255,255,255,.88)", fontWeight: 700 }}>{card.cardNo}</div>
        </div>
      </div>
    </div>
  );
}

export default function VisitorGallery() {
  const [cards, setCards] = useState<SavedCard[]>(SEED_CARDS);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("vr_trainer_cards") ?? "[]");
      // Filter out old-format cards that are missing required fields
      const saved: SavedCard[] = raw.filter(
        (c: unknown) => c && typeof c === "object" && "pokemonName" in (c as object) && "pokemonId" in (c as object)
      );
      if (saved.length) setCards([...SEED_CARDS, ...saved]);
    } catch { /* ignore */ }
  }, []);

  return (
    <section id="visitors" className="py-28 px-6" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-semibold mb-3" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem,2vw,1.5rem)", color: "var(--text-primary)" }}>
            Visitor Gallery
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            {cards.length} trainers have stopped by — yours could be here too.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center" }}>
          {cards.map(card => <MiniCard key={card.id} card={card} />)}
        </div>
      </div>
    </section>
  );
}
