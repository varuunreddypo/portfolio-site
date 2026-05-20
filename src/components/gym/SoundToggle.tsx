'use client';
import { useState, useEffect } from 'react';

export function SoundToggle({ compact = false }: { compact?: boolean }) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(localStorage.getItem('sound-muted') === 'true');
  }, []);

  function toggleMute() {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem('sound-muted', String(next));
  }

  return (
    <button
      onClick={toggleMute}
      aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
      aria-pressed={isMuted}
      style={{
        width: compact ? 28 : '100%',
        height: compact ? 28 : undefined,
        padding: compact ? 0 : '8px 6px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: compact ? 6 : 7,
        color: isMuted ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.55)',
        fontFamily: 'monospace', fontSize: 9,
        cursor: 'pointer', letterSpacing: '0.02em',
        flexShrink: 0,
        transition: 'color 0.15s, background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'rgba(255,215,0,0.95)';
        e.currentTarget.style.background = 'rgba(255,215,0,0.05)';
        e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = isMuted ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.55)';
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
      }}
    >
      {isMuted ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
      {!compact && (isMuted ? 'Sound off' : 'Sound on')}
    </button>
  );
}
