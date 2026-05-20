'use client';
import type { StoneDef } from '@/data/stoneQuestions';

interface Props {
  stone: StoneDef;
  tileW: number;
  tileH: number;
  onClick: () => void;
}

export default function Stone({ stone, tileW, tileH, onClick }: Props) {
  const size = Math.round(Math.min(tileW, tileH) * 0.58);
  const left = stone.col * tileW + (tileW - size) / 2;
  const top  = stone.row * tileH + (tileH - size) / 2;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${stone.name} — ${stone.concept}. Press Enter to interact.`}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      className="poke-stone"
      style={{
        position: 'absolute',
        left, top,
        width: size,
        height: size,
        zIndex: 5,
        cursor: 'pointer',
      }}
    >
      <img
        src={stone.sprite}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }}
        draggable={false}
      />
      {/* Glow halo */}
      <div className="stone-halo" style={{ background: `radial-gradient(circle, ${stone.glowColor} 0%, transparent 70%)` }} />
      {/* Sparkles */}
      {[0, 1, 2].map(i => (
        <div key={i} className={`stone-sparkle stone-sparkle-${i}`}
          style={{ background: stone.color }} />
      ))}
    </div>
  );
}
