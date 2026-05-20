'use client';
import type { StoneDef } from '@/data/stoneQuestions';

interface Props {
  stones: StoneDef[];
  collected: string[];
  onReview: (stone: StoneDef) => void;
}


export default function StoneProgress({ stones, collected, onReview }: Props) {
  const mainStones = stones.filter(s => !s.hidden);
  const shinyStone = stones.find(s => s.hidden);
  const collectedMain = collected.filter(id => mainStones.some(s => s.id === id)).length;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 10,
      padding: '10px 14px',
      flexShrink: 0,
    }}>
      <p style={{
        margin: '0 0 8px',
        fontFamily: 'monospace', fontSize: 10,
        color: '#475569', textTransform: 'uppercase', letterSpacing: 1,
      }}>
        Evolution Stones {collectedMain > 0 && `· ${collectedMain}/4`}
      </p>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {mainStones.map(stone => {
          const isCollected = collected.includes(stone.id);
          return (
            <button
              key={stone.id}
              onClick={() => isCollected && onReview(stone)}
              title={isCollected ? `${stone.name} — ${stone.concept}. Click to review.` : `${stone.name} — Find it on the map!`}
              aria-label={isCollected ? `Review ${stone.name}: ${stone.concept}` : `${stone.name} not yet found`}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', padding: 0,
                cursor: isCollected ? 'pointer' : 'default',
                filter: isCollected
                  ? `drop-shadow(0 0 4px ${stone.color})`
                  : 'grayscale(1) brightness(0.4)',
                transition: 'filter 0.3s',
                borderRadius: 4,
              }}
              onMouseEnter={e => {
                if (!isCollected) return;
                e.currentTarget.style.filter = `drop-shadow(0 0 8px ${stone.color}) brightness(1.15)`;
              }}
              onMouseLeave={e => {
                if (!isCollected) return;
                e.currentTarget.style.filter = `drop-shadow(0 0 4px ${stone.color})`;
              }}
            >
              <img src={stone.sprite} alt="" draggable={false} style={{ width: 24, height: 24, objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }} />
            </button>
          );
        })}

        {/* Shiny stone slot — only visible once discovered */}
        {shinyStone && collected.includes(shinyStone.id) && (
          <button
            onClick={() => onReview(shinyStone)}
            title="Shiny Stone — Explorer's Bonus. Click to review."
            aria-label="Review Shiny Stone: Explorer's Bonus"
            style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              filter: `drop-shadow(0 0 6px ${shinyStone.color})`,
              borderRadius: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = `drop-shadow(0 0 12px ${shinyStone.color}) brightness(1.2)`; }}
            onMouseLeave={e => { e.currentTarget.style.filter = `drop-shadow(0 0 6px ${shinyStone.color})`; }}
          >
            <img src={shinyStone.sprite} alt="" draggable={false} style={{ width: 24, height: 24, objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }} />
          </button>
        )}
      </div>

      <p style={{
        margin: '8px 0 0',
        fontFamily: 'monospace', fontSize: 9,
        color: collectedMain === 4 ? '#4ade80' : '#334155',
        lineHeight: 1.5,
      }}>
        {collectedMain === 4
          ? '✓ All stones collected!'
          : collectedMain === 0
            ? 'Find them on the map'
            : `${4 - collectedMain} stone${4 - collectedMain > 1 ? 's' : ''} remaining`}
      </p>
    </div>
  );
}
