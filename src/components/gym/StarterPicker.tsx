'use client';

import { STARTER_DEFS, type StarterDef } from '@/hooks/useStarter';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Props {
  onPick: (starter: StarterDef) => void;
}

const STARTERS = Object.values(STARTER_DEFS);

export default function StarterPicker({ onPick }: Props) {
  const mobile = useIsMobile(640);
  const tiny = useIsMobile(380);

  const cols           = mobile ? 2 : 4;
  const spriteSize     = tiny ? 56 : mobile ? 68 : 56;
  const titleSize      = tiny ? 9 : mobile ? 12 : 14;
  const subSize        = tiny ? 8 : mobile ? 10 : 11;
  const nameSize       = tiny ? 7 : mobile ? 8 : 9;
  const cardPadding    = mobile ? '14px 8px 12px' : '12px 8px';
  const cardGap        = mobile ? 8 : 6;
  const gridGap        = mobile ? 10 : 10;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'linear-gradient(160deg,#09091a 0%,#0d1b2a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      justifyContent: mobile ? 'flex-start' : 'center',
      padding: mobile ? '24px 14px 28px' : '24px 16px',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <p style={{
        margin: '0 0 6px',
        fontFamily: 'monospace',
        fontSize: mobile ? 9 : 10,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}>
        New Adventure
      </p>

      <h2 style={{
        margin: '0 0 8px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: titleSize,
        color: '#f1f5f9',
        textAlign: 'center',
        lineHeight: 1.8,
      }}>
        Choose your starter!
      </h2>

      <p style={{
        margin: mobile ? '0 0 20px' : '0 0 28px',
        fontFamily: 'monospace',
        fontSize: subSize,
        color: '#475569',
        textAlign: 'center',
        maxWidth: 280,
        lineHeight: 1.6,
      }}>
        Your partner for the A11Y Gym challenge.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: gridGap,
        width: '100%',
        maxWidth: mobile ? 420 : 520,
      }}>
        {STARTERS.map(s => (
          <button
            key={s.key}
            onClick={() => onPick(s)}
            aria-label={`Choose ${s.name}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: cardGap,
              padding: cardPadding,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s, transform 0.12s',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,215,0,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,215,0,0.45)';
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
            <span style={{
              fontFamily: 'monospace',
              fontSize: nameSize,
              color: '#cbd5e1',
              letterSpacing: 0.4,
              textAlign: 'center',
              wordBreak: 'break-word',
              lineHeight: 1.4,
            }}>
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
