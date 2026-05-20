'use client';
import { useEffect, useRef, useState } from 'react';
import type { StoneDef } from '@/data/stoneQuestions';

type Phase = 'question' | 'feedback' | 'result';

interface Props {
  stone: StoneDef;
  mode: 'quiz' | 'review';
  onCollect: () => void;
  onFail: () => void;
  onClose: () => void;
}

export default function StoneQuizModal({ stone, mode, onCollect, onFail, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('question');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = stone.questions[qIndex];
  const isCorrect = selected === q?.correctIndex;

  // Focus trap
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const getEls = () => el.querySelectorAll<HTMLElement>('button,[tabindex]:not([tabindex="-1"])');
    const timer = setTimeout(() => getEls()[0]?.focus(), 60);
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const els = getEls();
      const first = els[0]; const last = els[els.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault(); (e.shiftKey ? last : first)?.focus();
      }
    };
    el.addEventListener('keydown', trap);
    return () => { clearTimeout(timer); el.removeEventListener('keydown', trap); };
  }, [phase, qIndex, onClose]);

  const handleSelect = (idx: number) => {
    if (selected !== null || mode === 'review') return;
    setSelected(idx);
    if (idx === q.correctIndex) setScore(s => s + 1);
    setPhase('feedback');
  };

  const handleNext = () => {
    if (qIndex < stone.questions.length - 1) {
      setQIndex(i => i + 1);
      setSelected(null);
      setPhase('question');
    } else {
      if (mode === 'review') { onClose(); return; }
      setPhase('result');
    }
  };

  const BTN_BASE: React.CSSProperties = {
    padding: '10px 12px', borderRadius: 8, fontFamily: 'monospace',
    fontSize: 11, cursor: 'pointer', textAlign: 'left',
    lineHeight: 1.5, transition: 'border-color 0.15s, background 0.15s',
    boxSizing: 'border-box',
  };

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
        aria-label={`${stone.name} Quiz`}
        style={{
          width: '100%', maxWidth: 520, borderRadius: 14, overflow: 'hidden',
          boxShadow: `0 0 60px ${stone.glowColor}, 0 32px 80px rgba(0,0,0,0.8)`,
          animation: 'stoneModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        <style>{`@keyframes stoneModalIn{from{transform:scale(0.85) translateY(16px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}`}</style>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1a1230 100%)',
          borderBottom: `2px solid ${stone.color}44`,
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {/* Crystal icon */}
          <div style={{
            flexShrink: 0, width: 52, height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            filter: `drop-shadow(0 0 8px ${stone.color})`,
          }}>
            <img src={stone.sprite} alt="" draggable={false} style={{ width: 40, height: 40, objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }} />
          </div>
          <div>
            <div style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 9, color: stone.color, letterSpacing: 1, marginBottom: 5 }}>
              {stone.name.toUpperCase()} DISCOVERED!
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>
              {mode === 'review' ? `Reviewing: ${stone.concept}` : `Answer to absorb its power · ${qIndex + 1}/${stone.questions.length}`}
            </div>
            <div style={{
              display: 'inline-block', marginTop: 5,
              fontFamily: 'monospace', fontSize: 9, color: stone.color,
              background: `${stone.color}18`, border: `1px solid ${stone.color}44`,
              borderRadius: 4, padding: '2px 8px',
            }}>
              Teaches: {stone.concept}
            </div>
          </div>
        </div>

        {/* Progress dots */}
        {phase !== 'result' && (
          <div style={{ background: '#0f172a', padding: '8px 20px 0', display: 'flex', gap: 8 }}>
            {stone.questions.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 5, borderRadius: 3,
                background: i < qIndex ? stone.color : i === qIndex ? `${stone.color}88` : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ background: '#0f172a', padding: '16px 20px 20px' }}>

          {/* QUESTION phase */}
          {phase === 'question' && (
            <>
              <p style={{
                fontFamily: '"Press Start 2P",monospace', fontSize: 8,
                color: '#f1f5f9', lineHeight: 2.2, marginBottom: 16, minHeight: 56,
              }}>
                {q.prompt}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {q.options.map((opt, i) => {
                  const isRight = i === q.correctIndex;
                  const inReview = mode === 'review';
                  return (
                    <button
                      key={i}
                      onClick={() => inReview ? undefined : handleSelect(i)}
                      style={{
                        ...BTN_BASE,
                        border: inReview && isRight
                          ? `2px solid ${stone.color}`
                          : '2px solid rgba(255,255,255,0.12)',
                        background: inReview && isRight ? `${stone.color}22` : 'rgba(255,255,255,0.04)',
                        color: inReview && isRight ? stone.color : '#e2e8f0',
                        cursor: inReview ? 'default' : 'pointer',
                      }}
                      onMouseEnter={e => {
                        if (inReview) return;
                        e.currentTarget.style.borderColor = stone.color;
                        e.currentTarget.style.background = `${stone.color}14`;
                      }}
                      onMouseLeave={e => {
                        if (inReview) return;
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      }}
                    >
                      <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 7, color: stone.color, marginRight: 7 }}>
                        {['A','B','C','D'][i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {/* Review: show explanation immediately */}
              {mode === 'review' && (
                <>
                  <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'monospace', fontSize: 10, color: '#94a3b8', lineHeight: 1.6,
                  }}>
                    📚 {q.explanation}
                  </div>
                  <button onClick={handleNext} style={{
                    marginTop: 12, width: '100%', padding: '11px', borderRadius: 8, border: 'none',
                    background: stone.color, color: '#0f172a',
                    fontFamily: '"Press Start 2P",monospace', fontSize: 9,
                    cursor: 'pointer', letterSpacing: 0.5,
                  }}>
                    {qIndex < stone.questions.length - 1 ? 'Next →' : 'Done ✓'}
                  </button>
                </>
              )}
            </>
          )}

          {/* FEEDBACK phase (quiz mode only) */}
          {phase === 'feedback' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {q.options.map((opt, i) => {
                  const isSel = i === selected;
                  const isRight = i === q.correctIndex;
                  return (
                    <div key={i} style={{
                      ...BTN_BASE,
                      border: `2px solid ${isRight ? '#22c55e' : isSel ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
                      background: isRight ? 'rgba(34,197,94,0.15)' : isSel ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                      color: isRight ? '#4ade80' : isSel ? '#fca5a5' : '#475569',
                      cursor: 'default',
                    }}>
                      <span style={{ fontFamily: '"Press Start 2P",monospace', fontSize: 7, marginRight: 7, color: isRight ? '#4ade80' : isSel ? '#fca5a5' : '#334155' }}>
                        {['A','B','C','D'][i]}
                      </span>
                      {opt}
                    </div>
                  );
                })}
              </div>
              <div aria-live="polite" style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'monospace', fontSize: 10, color: '#94a3b8', lineHeight: 1.6,
              }}>
                {isCorrect ? '✓ Correct! ' : '✗ Not quite. '} 📚 {q.explanation}
              </div>
              <button onClick={handleNext} style={{
                width: '100%', padding: '11px', borderRadius: 8, border: 'none',
                background: stone.color, color: '#0f172a',
                fontFamily: '"Press Start 2P",monospace', fontSize: 9,
                cursor: 'pointer', letterSpacing: 0.5,
              }}>
                {qIndex < stone.questions.length - 1 ? 'Next Question →' : 'See Results →'}
              </button>
            </>
          )}

          {/* RESULT phase */}
          {phase === 'result' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>
                {score === stone.questions.length ? '💎' : '📖'}
              </div>
              <div style={{
                fontFamily: '"Press Start 2P",monospace', fontSize: 11,
                color: score === stone.questions.length ? stone.color : '#f1f5f9',
                marginBottom: 8,
              }}>
                {score}/{stone.questions.length} CORRECT
              </div>
              <p style={{
                fontFamily: 'monospace', fontSize: 12, color: '#94a3b8',
                lineHeight: 1.7, marginBottom: 20,
              }}>
                {score === stone.questions.length
                  ? `You absorbed the ${stone.name}!${stone.hidden ? " You found my hidden stone. You're the kind of designer who reads every line." : ''}`
                  : `You need ${stone.questions.length}/${stone.questions.length} to absorb this stone. Review the explanations and try again!`}
              </p>
              {score === stone.questions.length ? (
                <button onClick={onCollect} style={{
                  width: '100%', padding: '13px', borderRadius: 8, border: 'none',
                  background: stone.color, color: '#0f172a',
                  fontFamily: '"Press Start 2P",monospace', fontSize: 9,
                  cursor: 'pointer', letterSpacing: 0.5,
                }}>
                  {stone.hidden ? 'Claim Explorer Bonus ✨' : 'Absorb Stone 💎'}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={onFail} style={{
                    flex: 1, padding: '12px', borderRadius: 8,
                    background: `${stone.color}22`, color: stone.color,
                    fontFamily: '"Press Start 2P",monospace', fontSize: 9,
                    cursor: 'pointer',
                    border: `1px solid ${stone.color}44`,
                  }}>
                    Try Again
                  </button>
                  <button onClick={onClose} style={{
                    padding: '12px 18px', borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent', color: '#64748b',
                    fontFamily: 'monospace', fontSize: 12, cursor: 'pointer',
                  }}>
                    Leave
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
