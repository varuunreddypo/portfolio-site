'use client';
import { useEffect, useRef } from 'react';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function NewAdventureModal({ onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const hadBadge = typeof window !== 'undefined' && localStorage.getItem('badge-a11y-earned') === 'true';

  // Focus first button on mount; Escape cancels
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Tab') {
        const els = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLButtonElement[];
        const idx = els.indexOf(document.activeElement as HTMLButtonElement);
        if (e.shiftKey && idx === 0) { e.preventDefault(); els[els.length - 1].focus(); }
        else if (!e.shiftKey && idx === els.length - 1) { e.preventDefault(); els[0].focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="na-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(8,12,28,0.88)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'naOverlay 0.18s ease-out',
      }}
      onClick={onCancel}
    >
      <style>{`
        @keyframes naOverlay { from { opacity:0 } to { opacity:1 } }
        @keyframes naModal   { from { opacity:0; transform:scale(0.93) } to { opacity:1; transform:scale(1) } }
        @media (prefers-reduced-motion: reduce) {
          .na-modal-inner, .na-overlay { animation: none !important; }
        }
      `}</style>

      <div
        className="na-modal-inner"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg,#14203a 0%,#0f1828 100%)',
          border: '2px solid rgba(255,215,0,0.35)',
          borderRadius: 14,
          padding: '28px 32px 24px',
          maxWidth: 420, width: '100%',
          boxShadow: '0 28px 80px rgba(0,0,0,0.7)',
          animation: 'naModal 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <h2
          id="na-title"
          style={{ margin: '0 0 14px', fontFamily: '"Press Start 2P",monospace', fontSize: 13, color: 'rgba(255,215,0,0.92)', lineHeight: 1.5 }}
        >
          Start a new adventure?
        </h2>

        <p style={{ margin: '0 0 10px', fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
          This will wipe your Pokédex, stones, trainer rank, and chosen starter.
        </p>

        {hadBadge && (
          <p style={{ margin: '0 0 10px', fontFamily: 'monospace', fontSize: 11, color: 'rgba(100,200,255,0.9)', lineHeight: 1.6, fontStyle: 'italic' }}>
            ✨ Your A11Y Badge will be kept as a souvenir from this adventure.
          </p>
        )}

        <p style={{ margin: '0 0 22px', fontFamily: 'monospace', fontSize: 10, color: 'rgba(239,68,68,0.7)' }}>
          This cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            ref={cancelRef}
            onClick={onCancel}
            style={{
              padding: '9px 18px', borderRadius: 7,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'monospace', fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              padding: '9px 18px', borderRadius: 7,
              background: 'rgba(255,215,0,0.92)',
              border: '1px solid rgba(255,215,0,1)',
              color: '#0f1828',
              fontFamily: '"Press Start 2P",monospace', fontSize: 9,
              fontWeight: 700, cursor: 'pointer',
              transition: 'transform 0.12s ease, background 0.12s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = '')}
          >
            Yes, start fresh
          </button>
        </div>
      </div>
    </div>
  );
}
