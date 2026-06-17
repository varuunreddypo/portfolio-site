'use client';

import { useEffect, useRef, useState } from 'react';
import GymTrainerSprite from './GymTrainerSprite';

const QUESTIONS = [
  {
    q: 'What is the minimum color contrast ratio for normal text to meet WCAG AA?',
    options: ['2:1', '3:1', '4.5:1', '7:1'],
    correct: 2,
    explanation: 'WCAG AA requires 4.5:1 for normal text (under 18pt). Large text (18pt+ or 14pt bold) only needs 3:1.',
  },
  {
    q: 'Which HTML element is the correct semantic choice for a site\'s main navigation?',
    options: ['<div class="nav">', '<nav>', '<menu>', '<section>'],
    correct: 1,
    explanation: '<nav> is the semantic landmark for navigation. Screen readers expose it as a region users can jump to directly.',
  },
  {
    q: 'Which keyboard key moves focus to the next interactive element on a page?',
    options: ['Enter', 'Space', 'Tab', 'Arrow Down'],
    correct: 2,
    explanation: 'Tab navigates forward through focusable elements. Shift+Tab moves backward.',
  },
  {
    q: 'A purely decorative image should have its alt attribute set to:',
    options: ['"decorative"', '"image"', '"" (empty string)', 'Omit the attribute'],
    correct: 2,
    explanation: 'alt="" tells screen readers to skip the image. Omitting alt causes screen readers to announce the file name.',
  },
];

type Phase = 'intro' | 'question' | 'feedback' | 'pass' | 'fail';

interface Props {
  alreadyBadged: boolean;
  onPass: () => void;
  onClose: () => void;
}

export default function TrainerQuizModal({ alreadyBadged, onPass, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [selected, setSelected] = useState<number | null>(null);
  const [q] = useState(() => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);

  const isCorrect = selected === q.correct;

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const els = el.querySelectorAll<HTMLElement>('button,[tabindex]:not([tabindex="-1"])');
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

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setPhase('feedback');
  };

  const handleContinue = () => {
    setPhase(isCorrect ? 'pass' : 'fail');
  };

  const handleRetry = () => {
    setSelected(null);
    setPhase('question');
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
        @keyframes quizSlideUp { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes quizPop     { 0%{transform:scale(0.88);opacity:0} 70%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
        @keyframes qShake      { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
      `}</style>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="WCAG Knowledge Quiz"
        style={{
          width: '100%', maxWidth: 540, borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 32px 96px rgba(0,0,0,0.8)',
          animation: 'quizSlideUp 0.25s ease both',
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
              {phase === 'intro'    && (alreadyBadged ? "You've already earned the A11Y Badge — let's see if you still have it!" : 'Answer 1 question correctly to earn the WCAG Gym Badge!')}
              {phase === 'question' && 'Answer correctly to earn the badge!'}
              {phase === 'feedback' && (isCorrect ? '✓ Correct!' : '✗ Not quite.')}
              {phase === 'pass'     && '🏆 Badge earned!'}
              {phase === 'fail'     && 'So close — try again!'}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ background: '#0f172a', padding: '16px 20px 20px' }}>

          {/* INTRO */}
          {phase === 'intro' && (
            <div style={{ animation: 'quizPop 0.25s ease both' }}>
              <p style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 9, color: '#f1f5f9', lineHeight: 2.2, marginBottom: 20 }}>
                I am the guardian of web accessibility. Answer one question correctly — and the badge is yours.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setPhase('question')}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                    background: '#f5c400', color: '#0f172a',
                    fontFamily: '"Press Start 2P",monospace', fontSize: 9,
                    cursor: 'pointer', letterSpacing: 0.5,
                  }}
                >
                  Let&apos;s go! →
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

          {/* QUESTION */}
          {phase === 'question' && (
            <div style={{ animation: 'quizSlideUp 0.2s ease both' }}>
              <p style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 8, color: '#f1f5f9', lineHeight: 2.2, marginBottom: 18, minHeight: 64 }}>
                {q.q}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    style={{
                      padding: '12px 10px', borderRadius: 8, textAlign: 'left',
                      border: '2px solid rgba(255,255,255,0.14)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#e2e8f0', fontFamily: 'monospace', fontSize: 11,
                      cursor: 'pointer', lineHeight: 1.5,
                      transition: 'border-color 0.14s, background 0.14s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5c400'; e.currentTarget.style.background = 'rgba(245,196,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  >
                    <span style={{ display: 'inline-block', marginRight: 8, fontFamily: '"Press Start 2P",monospace', fontSize: 7, color: '#f5c400' }}>
                      {['A','B','C','D'][i]}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FEEDBACK */}
          {phase === 'feedback' && (
            <div style={{ animation: isCorrect ? 'quizPop 0.2s ease both' : 'qShake 0.3s ease both' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {q.options.map((opt, i) => {
                  const isSel = i === selected;
                  const isRight = i === q.correct;
                  return (
                    <div key={i} style={{
                      padding: '12px 10px', borderRadius: 8,
                      border: `2px solid ${isRight ? '#22c55e' : isSel ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                      background: isRight ? 'rgba(34,197,94,0.18)' : isSel ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.04)',
                      color: isRight ? '#4ade80' : isSel ? '#fca5a5' : '#64748b',
                      fontFamily: 'monospace', fontSize: 11, lineHeight: 1.5,
                    }}>
                      <span style={{ display: 'inline-block', marginRight: 8, fontFamily: '"Press Start 2P",monospace', fontSize: 7, color: isRight ? '#4ade80' : isSel ? '#fca5a5' : '#475569' }}>
                        {['A','B','C','D'][i]}
                      </span>
                      {opt}
                    </div>
                  );
                })}
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 14,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'monospace', fontSize: 10, color: '#94a3b8', lineHeight: 1.6,
              }}>
                📚 {q.explanation}
              </div>
              <button
                onClick={handleContinue}
                style={{
                  width: '100%', padding: '12px', borderRadius: 8, border: 'none',
                  background: '#f5c400', color: '#0f172a',
                  fontFamily: '"Press Start 2P",monospace', fontSize: 9,
                  cursor: 'pointer', letterSpacing: 0.5,
                }}
              >
                {isCorrect ? 'Claim Badge 🏆' : 'See Result →'}
              </button>
            </div>
          )}

          {/* PASS */}
          {phase === 'pass' && (
            <div style={{ textAlign: 'center', animation: 'quizPop 0.3s ease both' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 11, color: '#f5c400', marginBottom: 8, letterSpacing: 1 }}>
                CORRECT!
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
                {alreadyBadged
                  ? 'Still sharp! Your accessibility knowledge holds up.'
                  : "You've mastered the fundamentals of WCAG accessibility. The badge is yours!"}
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

          {/* FAIL */}
          {phase === 'fail' && (
            <div style={{ textAlign: 'center', animation: 'quizSlideUp 0.2s ease both' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📖</div>
              <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 10, color: '#f1f5f9', marginBottom: 8 }}>
                NOT QUITE
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
                Answer correctly to earn the badge. Review the explanation above and give it another shot!
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleRetry}
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
                  Leave
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
