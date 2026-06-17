'use client';
import { useEffect, useRef } from 'react';
import type { StoneDef } from '@/data/stoneQuestions';

interface Props {
  stone: StoneDef;
  mode: 'quiz' | 'review';
  onCollect: () => void;
  onFail: () => void;
  onClose: () => void;
}

export default function StoneQuizModal({ stone, onCollect, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const timer = setTimeout(() => el.querySelector<HTMLElement>('button')?.focus(), 60);
    const trap = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    el.addEventListener('keydown', trap);
    return () => { clearTimeout(timer); el.removeEventListener('keydown', trap); };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,0.86)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      role="none"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${stone.name} Discovered`}
        style={{
          width: '100%', maxWidth: 420, borderRadius: 14, overflow: 'hidden',
          boxShadow: `0 0 60px ${stone.glowColor}, 0 32px 80px rgba(0,0,0,0.8)`,
          animation: 'stoneModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
          background: '#0f172a',
        }}
      >
        <style>{`@keyframes stoneModalIn{from{transform:scale(0.85) translateY(16px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}`}</style>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1a1230 100%)',
          borderBottom: `2px solid ${stone.color}44`,
          padding: '20px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            flexShrink: 0, width: 56, height: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            filter: `drop-shadow(0 0 10px ${stone.color})`,
          }}>
            <img src={stone.sprite} alt="" draggable={false}
              style={{ width: 44, height: 44, objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }} />
          </div>
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 9, color: stone.color, letterSpacing: 1, marginBottom: 6 }}>
              {stone.name.toUpperCase()}
            </div>
            <div style={{
              display: 'inline-block',
              fontFamily: 'monospace', fontSize: 9, color: stone.color,
              background: `${stone.color}18`, border: `1px solid ${stone.color}44`,
              borderRadius: 4, padding: '2px 8px',
            }}>
              {stone.concept}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>
            {stone.hidden ? '✨' : '💎'}
          </div>
          <div style={{
            fontFamily: '"Press Start 2P",monospace', fontSize: 10,
            color: '#f1f5f9', lineHeight: 2, marginBottom: 10,
          }}>
            You discovered the {stone.name}!
          </div>
          <p style={{
            fontFamily: 'monospace', fontSize: 12, color: '#64748b',
            lineHeight: 1.7, marginBottom: 24,
          }}>
            {stone.hidden
              ? "You found the hidden stone. You're the kind of designer who reads every line."
              : `A rare stone radiating the essence of ${stone.concept}.`}
          </p>
          <button
            onClick={onCollect}
            style={{
              width: '100%', padding: '13px', borderRadius: 8, border: 'none',
              background: stone.color, color: '#0f172a',
              fontFamily: '"Press Start 2P",monospace', fontSize: 9,
              cursor: 'pointer', letterSpacing: 0.5,
            }}
          >
            {stone.hidden ? 'Claim Explorer Bonus ✨' : 'Collect Stone 💎'}
          </button>
        </div>
      </div>
    </div>
  );
}
