'use client';

import { STARTER_DEFS, type StarterDef } from '@/hooks/useStarter';

interface Props {
  onPick: (starter: StarterDef) => void;
}

const STARTERS = Object.values(STARTER_DEFS);

export default function StarterPicker({ onPick }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'linear-gradient(160deg,#09091a 0%,#0d1b2a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
      overflow: 'auto',
    }}>
      <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 2 }}>
        New Adventure
      </p>
      <h2 style={{ margin: '0 0 6px', fontFamily: '"Press Start 2P",monospace', fontSize: 14, color: '#f1f5f9', textAlign: 'center', lineHeight: 1.8 }}>
        Choose your starter!
      </h2>
      <p style={{ margin: '0 0 28px', fontFamily: 'monospace', fontSize: 11, color: '#475569', textAlign: 'center' }}>
        Your partner for the A11Y Gym challenge.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
        maxWidth: 520,
        width: '100%',
      }}>
        {STARTERS.map(s => (
          <button
            key={s.key}
            onClick={() => onPick(s)}
            aria-label={`Choose ${s.name}`}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s, transform 0.12s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,215,0,0.07)';
              e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
              e.currentTarget.style.transform = '';
            }}
          >
            <img
              src={s.sprite}
              alt={s.name}
              width={56}
              height={56}
              style={{ imageRendering: 'pixelated', display: 'block' }}
            />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#cbd5e1', letterSpacing: 0.5 }}>
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
