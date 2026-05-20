'use client';

type Dir = 'up' | 'down' | 'left' | 'right';

interface Props {
  onMove: (dir: Dir) => void;
  disabled?: boolean;
  size?: number;
}

const ARROW_PATH: Record<Dir, string> = {
  up:    'M12 19V5M5 12l7-7 7 7',
  down:  'M12 5v14M5 12l7 7 7-7',
  left:  'M19 12H5M12 5l-7 7 7 7',
  right: 'M5 12h14M12 5l7 7-7 7',
};

function Key({ dir, onPress, disabled, size = 36 }: { dir: Dir; onPress: () => void; disabled?: boolean; size?: number }) {
  const act = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!disabled) onPress();
  };

  return (
    <button
      aria-label={`Move ${dir}`}
      onMouseDown={act}
      onTouchStart={act}
      onMouseDownCapture={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 0 #000, inset 0 1px 0 rgba(255,255,255,0.08)';
      }}
      onMouseUp={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 3px 0 #000, inset 0 1px 0 rgba(255,255,255,0.10)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.background = '#111';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 3px 0 #000, inset 0 1px 0 rgba(255,255,255,0.10)';
      }}
      onMouseEnter={e => {
        if (!disabled) (e.currentTarget as HTMLElement).style.background = '#1e1e1e';
      }}
      style={{
        width: size, height: size,
        minWidth: size, minHeight: size,
        background: '#111',
        border: '1px solid #333',
        borderRadius: 8,
        boxShadow: '0 3px 0 #000, inset 0 1px 0 rgba(255,255,255,0.10)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, touchAction: 'manipulation', userSelect: 'none',
        opacity: disabled ? 0.35 : 1,
        transition: 'opacity 150ms',
      }}
    >
      <svg width={Math.round(size * 0.44)} height={Math.round(size * 0.44)} viewBox="0 0 24 24" fill="none"
        stroke={disabled ? '#444' : '#fff'}
        strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
        <path d={ARROW_PATH[dir]} />
      </svg>
    </button>
  );
}

export default function DPad({ onMove, disabled, size = 36 }: Props) {
  return (
    <div aria-label="D-pad controls" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Key dir="up" onPress={() => onMove('up')} disabled={disabled} size={size} />
      <div style={{ display: 'flex', gap: 3 }}>
        <Key dir="left"  onPress={() => onMove('left')}  disabled={disabled} size={size} />
        <Key dir="down"  onPress={() => onMove('down')}  disabled={disabled} size={size} />
        <Key dir="right" onPress={() => onMove('right')} disabled={disabled} size={size} />
      </div>
    </div>
  );
}
