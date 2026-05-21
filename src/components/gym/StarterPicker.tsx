'use client';

import { STARTER_DEFS, type StarterDef } from '@/hooks/useStarter';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Props {
  onPick: (starter: StarterDef) => void;
}

const STARTERS = Object.values(STARTER_DEFS);

export default function StarterPicker({ onPick }: Props) {
  const mobile = useIsMobile(640);

  const spriteSize  = mobile ? 38 : 56;
  const cardPad     = mobile ? '6px 4px' : '12px 8px';
  const cardGap     = mobile ? 6 : 6;
  const cardRadius  = mobile ? 8 : 10;
  const gridGap     = mobile ? 6 : 10;
  const gridMax     = mobile ? 360 : 520;
  const titleSize   = mobile ? 11 : 14;
  const nameSize    = mobile ? 7 : 9;
  const subSize     = mobile ? 9 : 11;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'linear-gradient(160deg,#09091a 0%,#0d1b2a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: mobile ? '70px 10px 16px' : '24px 16px',
      overflow: 'auto',
    }}>
      <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 2 }}>
        New Adventure
      </p>
      <h2 style={{ margin: '0 0 6px', fontFamily: '"Press Start 2P",monospace', fontSize: titleSize, color: '#f1f5f9', textAlign: 'center', lineHeight: 1.8 }}>
        Choose your starter!
      </h2>
      <p style={{ margin: mobile ? '0 0 16px' : '0 0 28px', fontFamily: 'monospace', fontSize: subSize, color: '#475569', textAlign: 'center' }}>
        Your partner for the A11Y Gym challenge.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: gridGap,
        maxWidth: gridMax,
        width: '100%',
      }}>
        {STARTERS.map(s => (
          <button
            key={s.key}
            onClick={() => onPick(s)}
            aria-label={`Choose ${s.name}`}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: cardGap,
              padding: cardPad,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: cardRadius,
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
              width={spriteSize}
              height={spriteSize}
              style={{ imageRendering: 'pixelated', display: 'block' }}
            />
            <span style={{ fontFamily: 'monospace', fontSize: nameSize, color: '#cbd5e1', letterSpacing: 0.5, textAlign: 'center', wordBreak: 'break-word', lineHeight: 1.3 }}>
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
