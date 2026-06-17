'use client';

import { useEffect, useRef, useState } from 'react';
import GymTrainerSprite from './GymTrainerSprite';

const BATTLES = [
  {
    opponent: 'Pikachu',
    opponentEmoji: '⚡',
    prompt: "Varuun sent out Pikachu! Choose your move:",
    moves: ['Tackle', 'Earthquake', 'Flamethrower', 'Bubble'],
    correct: 1,
    winText: "Super effective! Earthquake KOs Pikachu!",
    loseText: "It's not very effective... Pikachu fights back!",
  },
  {
    opponent: 'Charizard',
    opponentEmoji: '🔥',
    prompt: "Varuun sent out Charizard! Choose your move:",
    moves: ['Ember', 'Growl', 'Surf', 'Mega Punch'],
    correct: 2,
    winText: "Super effective! Surf drenches Charizard!",
    loseText: "Charizard shrugs it off and uses Flamethrower!",
  },
  {
    opponent: 'Gyarados',
    opponentEmoji: '🌊',
    prompt: "Varuun sent out Gyarados! Choose your move:",
    moves: ['Hyper Beam', 'Thunderbolt', 'Blizzard', 'Tackle'],
    correct: 1,
    winText: "Super effective! Thunderbolt takes down Gyarados!",
    loseText: "Gyarados dodges and uses Hydro Pump!",
  },
  {
    opponent: 'Gengar',
    opponentEmoji: '👻',
    prompt: "Varuun sent out Gengar! Choose your move:",
    moves: ['Lick', 'Tackle', 'Psybeam', 'Shadow Ball'],
    correct: 2,
    winText: "Super effective! Psybeam sends Gengar fleeing!",
    loseText: "Gengar vanishes into the shadows... and strikes!",
  },
];

type Phase = 'intro' | 'battle' | 'pass' | 'fail';

interface Props {
  alreadyBadged: boolean;
  onPass: () => void;
  onClose: () => void;
}

export default function TrainerQuizModal({ alreadyBadged, onPass, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [battle] = useState(() => BATTLES[Math.floor(Math.random() * BATTLES.length)]);
  const [resultText, setResultText] = useState('');

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const els = el.querySelectorAll<HTMLElement>('button');
    els[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const first = els[0]; const last = els[els.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault(); (e.shiftKey ? last : first)?.focus();
      }
    };
    el.addEventListener('keydown', trap);
    return () => el.removeEventListener('keydown', trap);
  }, [phase, onClose]);

  const handleMove = (idx: number) => {
    const won = idx === battle.correct;
    setResultText(won ? battle.winText : battle.loseText);
    setPhase(won ? 'pass' : 'fail');
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      role="none"
    >
      <style>{`
        @keyframes battleSlideUp { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes battlePop     { 0%{transform:scale(0.88);opacity:0} 70%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
        @keyframes battleShake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
      `}</style>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Gym Leader Battle"
        style={{
          width: '100%', maxWidth: 520, borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 32px 96px rgba(0,0,0,0.8)',
          animation: 'battleSlideUp 0.25s ease both',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#1a1230 0%,#0f1728 100%)',
          padding: '18px 20px 16px',
          display: 'flex', alignItems: 'center', gap: 16,
          borderBottom: '2px solid rgba(245,196,0,0.25)',
        }}>
          <div style={{ flexShrink: 0 }}>
            <GymTrainerSprite height={72} />
          </div>
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 9, color: '#f5c400', letterSpacing: 1, marginBottom: 6 }}>
              GYM LEADER VARUUN
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0', lineHeight: 1.6 }}>
              {phase === 'intro'  && (alreadyBadged ? 'You already have my badge. Battle again?' : "I've been waiting for a challenger!")}
              {phase === 'battle' && `Go! ${battle.opponent}! ${battle.opponentEmoji}`}
              {phase === 'pass'   && '🏆 You won the battle!'}
              {phase === 'fail'   && 'You lost this round...'}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ background: '#0f172a', padding: '16px 20px 20px' }}>

          {/* INTRO */}
          {phase === 'intro' && (
            <div style={{ animation: 'battlePop 0.25s ease both' }}>
              <p style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 9, color: '#f1f5f9', lineHeight: 2.2, marginBottom: 20 }}>
                Defeat me in battle to earn the Gym Badge!
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setPhase('battle')}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                    background: '#f5c400', color: '#0f172a',
                    fontFamily: '"Press Start 2P",monospace', fontSize: 9,
                    cursor: 'pointer', letterSpacing: 0.5,
                  }}
                >
                  I accept! ⚔️
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: '12px 18px', borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent', color: '#64748b',
                    fontFamily: 'monospace', fontSize: 12, cursor: 'pointer',
                  }}
                >
                  Not now
                </button>
              </div>
            </div>
          )}

          {/* BATTLE — pick a move */}
          {phase === 'battle' && (
            <div style={{ animation: 'battleSlideUp 0.2s ease both' }}>
              <p style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 8, color: '#f1f5f9', lineHeight: 2.4, marginBottom: 18 }}>
                {battle.prompt}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {battle.moves.map((move, i) => (
                  <button
                    key={i}
                    onClick={() => handleMove(i)}
                    style={{
                      padding: '13px 10px', borderRadius: 8, textAlign: 'left',
                      border: '2px solid rgba(255,255,255,0.14)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#e2e8f0', fontFamily: '"Press Start 2P",monospace', fontSize: 7,
                      cursor: 'pointer', lineHeight: 2,
                      transition: 'border-color 0.14s, background 0.14s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5c400'; e.currentTarget.style.background = 'rgba(245,196,0,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  >
                    {move}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASS — won */}
          {phase === 'pass' && (
            <div style={{ textAlign: 'center', animation: 'battlePop 0.3s ease both' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 10, color: '#f5c400', marginBottom: 10, letterSpacing: 1 }}>
                VICTORY!
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
                {resultText}
              </p>
              <button
                onClick={onPass}
                style={{
                  width: '100%', padding: '13px', borderRadius: 8, border: 'none',
                  background: '#f5c400', color: '#0f172a',
                  fontFamily: '"Press Start 2P",monospace', fontSize: 10,
                  cursor: 'pointer', letterSpacing: 0.5,
                }}
              >
                {alreadyBadged ? 'Nice! ✓' : 'Claim Badge 🏆'}
              </button>
            </div>
          )}

          {/* FAIL — lost */}
          {phase === 'fail' && (
            <div style={{ textAlign: 'center', animation: 'battleShake 0.3s ease both' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>💔</div>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 10, color: '#f1f5f9', marginBottom: 8 }}>
                DEFEATED!
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
                {resultText}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setPhase('battle')}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                    background: '#f5c400', color: '#0f172a',
                    fontFamily: '"Press Start 2P",monospace', fontSize: 9,
                    cursor: 'pointer', letterSpacing: 0.5,
                  }}
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: '12px 18px', borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent', color: '#64748b',
                    fontFamily: 'monospace', fontSize: 12, cursor: 'pointer',
                  }}
                >
                  Run!
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
