'use client';

import { useEffect, useRef, useMemo } from 'react';

const CONFETTI_COLORS = ['#f5c400', '#4ade80', '#60a5fa', '#f87171', '#c084fc', '#fb923c', '#34d399', '#fbbf24'];

interface Props {
  onClose: () => void;
}

export default function BadgeCelebrationModal({ onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>('button,a,[tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    };
    el.addEventListener('keydown', trap);
    return () => el.removeEventListener('keydown', trap);
  }, [onClose]);

  const confetti = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left: `${(i / 40) * 100 + (Math.sin(i * 1.7) * 5)}%`,
      delay: `${(i * 0.04) % 1.2}s`,
      duration: `${1.6 + (i % 7) * 0.18}s`,
      size: `${6 + (i % 5) * 2}px`,
      height: `${8 + (i % 4) * 3}px`,
      skew: `${(i % 3) - 1}`,
    })),
  []);

  const tweetText = encodeURIComponent(
    "I just earned the A11Y Inclusivity Badge on Varuun Reddy's design portfolio! 🏆 #a11y #accessibility #WCAG"
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <div
      className="badge-celebration-overlay"
      role="none"
      onClick={onClose}
    >
      <div
        role="status"
        aria-live="assertive"
        style={{ position: 'absolute', left: -9999, top: 0, width: 1, height: 1, overflow: 'hidden' }}
      >
        A11Y Inclusivity Badge earned!
      </div>

      {confetti.map(c => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: c.left,
            width: c.size,
            height: c.height,
            background: c.color,
            animationDelay: c.delay,
            animationDuration: c.duration,
            transform: `skewX(${c.skew}deg)`,
          }}
        />
      ))}

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="A11Y Badge Earned!"
        className="badge-celebration-panel"
        onClick={e => e.stopPropagation()}
      >
        <div className="badge-aura" aria-hidden="true" />

        <div className="badge-reveal-wrap">
          <img
            src="/A11y Badge Background Removed.png"
            alt="A11Y Inclusivity Badge"
            className="badge-celebrate-img"
          />
        </div>

        <div style={{
          fontFamily: '"Press Start 2P",monospace',
          fontSize: 12,
          color: '#f5c400',
          marginBottom: 10,
          letterSpacing: 1,
          lineHeight: 1.6,
        }}>
          A11Y BADGE EARNED!
        </div>

        <p style={{
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#94a3b8',
          lineHeight: 1.7,
          margin: '0 0 24px',
        }}>
          You've proven your accessibility knowledge.<br />
          The Inclusivity Badge is now yours!
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '13px', borderRadius: 8, border: 'none',
              background: '#f5c400', color: '#0f172a',
              fontFamily: '"Press Start 2P",monospace', fontSize: 9,
              cursor: 'pointer', letterSpacing: 0.5,
            }}
          >
            Continue ✓
          </button>
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '13px 18px', borderRadius: 8,
              border: '1px solid rgba(29,161,242,0.45)',
              background: 'rgba(29,161,242,0.08)', color: '#60a5fa',
              fontFamily: 'monospace', fontSize: 12,
              textDecoration: 'none',
              display: 'flex', alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            Share 𝕏
          </a>
        </div>
      </div>
    </div>
  );
}
