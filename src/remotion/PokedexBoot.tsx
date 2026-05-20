import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const GOLD = '#ffcc00';
const BG = '#09091a';
const PIXEL = 'var(--font-pixel), "Press Start 2P", monospace';
const MONO = 'var(--font-space-mono), "Space Mono", monospace';

const STATS = [
  { name: 'RESEARCH',    val: 88, color: '#f472b6' },
  { name: 'CRAFT',       val: 94, color: '#a78bfa' },
  { name: 'INTERACTION', val: 86, color: '#38bdf8' },
  { name: 'LOGIC',       val: 82, color: '#34d399' },
  { name: 'DELIVERY',    val: 91, color: '#fb923c' },
];

const DOMAINS = [
  { label: 'HEALTHCARE', color: '#e05a5a', bg: '#2a1010' },
  { label: 'B2B SAAS',   color: '#5a8ae0', bg: '#0f1a2e' },
  { label: 'EDTECH',     color: '#e0a85a', bg: '#2a1e08' },
  { label: 'EV TECH',    color: '#5ae07a', bg: '#0a2010' },
  { label: 'UTILITY',    color: '#a05ae0', bg: '#1a0a2e' },
  { label: 'RETAIL',     color: '#f472b6', bg: '#2a0a1a' },
];

const MOVES = [
  { name: 'FIGMA',         type: 'DESIGN',  color: '#a78bfa' },
  { name: 'USER RESEARCH', type: 'PSYCHIC', color: '#f472b6' },
  { name: 'PROTOTYPING',   type: 'STEEL',   color: '#94a3b8' },
  { name: 'WCAG / A11Y',   type: 'FAIRY',   color: '#fb7185' },
];

// Corner bracket for the photo frame
function Corner({ v, h }: { v: 'top' | 'bottom'; h: 'left' | 'right' }) {
  return (
    <div style={{
      position: 'absolute',
      ...(v === 'top' ? { top: -1 } : { bottom: -1 }),
      ...(h === 'left' ? { left: -1 } : { right: -1 }),
      width: 13, height: 13,
      borderTop:    v === 'top'    ? `3px solid ${GOLD}` : 'none',
      borderBottom: v === 'bottom' ? `3px solid ${GOLD}` : 'none',
      borderLeft:   h === 'left'   ? `3px solid ${GOLD}` : 'none',
      borderRight:  h === 'right'  ? `3px solid ${GOLD}` : 'none',
    }} />
  );
}

export const PokedexBoot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cursorOn = Math.floor(frame / 12) % 2 === 0;
  const scanlineOffset = (frame * 1.5) % 8;

  // ── Phase 1: Boot screen (frames 0–68) ───────────────────────────────────────
  const bootFade   = interpolate(frame, [0, 8],   [0, 1], { extrapolateRight: 'clamp' });
  const line1Op    = interpolate(frame, [8, 20],  [0, 1], { extrapolateRight: 'clamp' });
  const line2Op    = interpolate(frame, [22, 34], [0, 1], { extrapolateRight: 'clamp' });
  const progressPct = interpolate(frame, [24, 56], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const line3Op    = interpolate(frame, [48, 58], [0, 1], { extrapolateRight: 'clamp' });
  const bootOutOp  = interpolate(frame, [60, 72], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Phase 2: Main panel (frames 65+) ─────────────────────────────────────────
  const panelSpring = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 14, stiffness: 80 } });
  const panelY  = interpolate(panelSpring, [0, 1], [28, 0]);
  const panelOp = interpolate(panelSpring, [0, 1], [0, 1]);

  const headerOp = interpolate(frame, [70, 84], [0, 1], { extrapolateRight: 'clamp' });

  const leftSpring = spring({ frame: Math.max(0, frame - 74), fps, config: { damping: 16, stiffness: 90 } });
  const leftX  = interpolate(leftSpring, [0, 1], [-36, 0]);
  const leftOp = interpolate(leftSpring, [0, 1], [0, 1]);

  const rowOp = (start: number) => interpolate(frame, [start, start + 10], [0, 1], { extrapolateRight: 'clamp' });

  const nameOp = interpolate(frame, [108, 122], [0, 1], { extrapolateRight: 'clamp' });
  const nameY  = interpolate(frame, [108, 122], [10, 0], { extrapolateRight: 'clamp' });

  const statsLabelOp = interpolate(frame, [132, 142], [0, 1], { extrapolateRight: 'clamp' });
  const statVal = (i: number) => {
    const s = 142 + i * 13;
    return Math.round(interpolate(frame, [s, s + 25], [0, STATS[i].val], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  };
  const statOp = (i: number) => interpolate(frame, [140 + i * 8, 150 + i * 8], [0, 1], { extrapolateRight: 'clamp' });

  const expLabelOp = interpolate(frame, [212, 222], [0, 1], { extrapolateRight: 'clamp' });
  const badgeSc = (i: number) => spring({ frame: Math.max(0, frame - (222 + i * 8)), fps, config: { damping: 9, stiffness: 230 } });

  const moveLabelOp = interpolate(frame, [278, 288], [0, 1], { extrapolateRight: 'clamp' });
  const moveOp = (i: number) => interpolate(frame, [288 + i * 10, 298 + i * 10], [0, 1], { extrapolateRight: 'clamp' });

  const showBoot  = frame < 72;
  const showPanel = frame >= 63;

  return (
    <AbsoluteFill style={{ background: BG, overflow: 'hidden', fontFamily: PIXEL }}>

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20,
        backgroundImage: 'repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(255,255,255,0.013) 3px,rgba(255,255,255,0.013) 4px)',
        backgroundPosition: `0 ${scanlineOffset}px`,
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,204,0,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,204,0,.02) 1px,transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* ── BOOT SCREEN ─────────────────────────────────────────────────────── */}
      {showBoot && (
        <AbsoluteFill style={{
          opacity: bootOutOp,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 22, zIndex: 10,
        }}>
          {/* Dots */}
          <div style={{ opacity: bootFade, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#e05a5a', boxShadow: '0 0 10px #e05a5a99' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e0a85a' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#5ae07a' }} />
          </div>

          <div style={{ opacity: line1Op, fontSize: 14, color: GOLD, letterSpacing: '3px', textShadow: `0 0 20px ${GOLD}66` }}>
            POKÉDEX SYS v4.01
          </div>

          <div style={{ opacity: line2Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: '2px' }}>
              LOADING DESIGNER PROFILE...
            </div>
            {/* Progress bar */}
            <div style={{ width: 260, height: 7, background: 'rgba(255,255,255,.07)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${progressPct}%`,
                background: `linear-gradient(90deg,${GOLD}77,${GOLD})`,
                boxShadow: `0 0 10px ${GOLD}55`,
              }} />
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: `${GOLD}99` }}>
              {Math.round(progressPct)}%
            </div>
          </div>

          <div style={{ opacity: line3Op, fontSize: 9, color: '#5ae07a', letterSpacing: '2px' }}>
            READY.{cursorOn ? '_' : ' '}
          </div>
        </AbsoluteFill>
      )}

      {/* ── MAIN PANEL ──────────────────────────────────────────────────────── */}
      {showPanel && (
        <AbsoluteFill style={{
          padding: '18px 22px',
          display: 'flex', flexDirection: 'column',
          opacity: panelOp,
          transform: `translateY(${panelY}px)`,
          zIndex: 5,
        }}>

          {/* Header bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, opacity: headerOp }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e05a5a', boxShadow: '0 0 6px #e05a5a88' }} />
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e0a85a' }} />
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#5ae07a' }} />
            <div style={{ flex: 1, height: 2, background: 'rgba(255,204,0,.15)', borderRadius: 1 }} />
            <span style={{ fontSize: 7, color: GOLD, letterSpacing: '3px', opacity: 0.7 }}>POKÉDEX — DESIGNER EDITION</span>
            <div style={{ flex: 1, height: 2, background: 'rgba(255,204,0,.15)', borderRadius: 1 }} />
          </div>

          {/* Two-column panel */}
          <div style={{
            flex: 1,
            display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20,
            background: 'rgba(255,255,255,.02)',
            border: '1px solid rgba(255,204,0,.15)',
            borderRadius: 4, padding: '20px 24px',
            boxShadow: '0 0 60px rgba(255,204,0,.04)',
          }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, transform: `translateX(${leftX}px)`, opacity: leftOp }}>

              {/* Photo frame */}
              <div style={{
                width: '100%', height: 188, borderRadius: 4,
                border: '2px solid rgba(255,204,0,.2)',
                background: 'linear-gradient(160deg,#0d1117 0%,#1a1a2e 60%,#0d0d1a 100%)',
                position: 'relative', overflow: 'hidden',
              }}>
                <Corner v="top"    h="left"  />
                <Corner v="top"    h="right" />
                <Corner v="bottom" h="left"  />
                <Corner v="bottom" h="right" />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 65% 25%,rgba(100,80,220,.18) 0%,transparent 60%)' }} />
                {/* Hero photo — available in Next.js public dir */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-photo.png"
                  alt="Varuun Reddy"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>

              {/* Info rows */}
              {[
                { label: 'LOCATION',   val: 'DALLAS, TX',    op: rowOp(88)  },
                { label: 'EXPERIENCE', val: '7 YEARS',        op: rowOp(96)  },
                { label: 'STATUS',     val: 'OPEN TO WORK',   op: rowOp(104) },
              ].map(({ label, val, op }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '5px 9px',
                  background: 'rgba(255,255,255,.03)',
                  border: '1px solid rgba(255,204,0,.08)', borderRadius: 3,
                  opacity: op,
                }}>
                  <span style={{ fontSize: 6, color: `${GOLD}77`, letterSpacing: 1 }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,.8)', fontWeight: 700 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

              {/* Name */}
              <div style={{ opacity: nameOp, transform: `translateY(${nameY}px)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <span style={{ fontSize: 8, color: `${GOLD}77`, letterSpacing: 2 }}>NO.001</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,204,0,.15)' }} />
                </div>
                <h1 style={{ fontFamily: PIXEL, fontSize: 19, color: '#fff', letterSpacing: 2, lineHeight: 1.4, margin: 0, textShadow: `0 0 28px rgba(255,204,0,.18)` }}>
                  VARUUN REDDY
                </h1>
                <p style={{ fontFamily: MONO, fontSize: 12, color: GOLD, letterSpacing: 4, marginTop: 5, opacity: 0.85, margin: '5px 0 0' }}>
                  PRODUCT DESIGNER
                  {frame > 122 && cursorOn && (
                    <span style={{ display: 'inline-block', width: 2, height: 11, background: GOLD, marginLeft: 4, verticalAlign: 'middle' }} />
                  )}
                </p>
              </div>

              {/* Stats */}
              <div>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,.3)', letterSpacing: 3, marginBottom: 9, opacity: statsLabelOp }}>BASE STATS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {STATS.map((s, i) => {
                    const v = statVal(i);
                    return (
                      <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 9, opacity: statOp(i) }}>
                        <span style={{ fontSize: 6, color: 'rgba(255,255,255,.4)', width: 80, flexShrink: 0 }}>{s.name}</span>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            width: `${v}%`,
                            background: `linear-gradient(90deg,${s.color}77,${s.color})`,
                            boxShadow: `0 0 7px ${s.color}55`,
                          }} />
                        </div>
                        <span style={{ fontFamily: MONO, fontSize: 11, color: s.color, fontWeight: 700, width: 24, textAlign: 'right' }}>{v}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expertise badges */}
              <div>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,.3)', letterSpacing: 3, marginBottom: 8, opacity: expLabelOp }}>EXPERTISE</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {DOMAINS.map((d, i) => (
                    <span key={d.label} style={{
                      fontSize: 7, padding: '5px 9px', borderRadius: 3,
                      color: d.color, background: d.bg,
                      border: `1px solid ${d.color}44`, letterSpacing: 1,
                      display: 'inline-block',
                      transform: `scale(${badgeSc(i)})`,
                      transformOrigin: 'center',
                    }}>
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Move set */}
              <div>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,.3)', letterSpacing: 3, marginBottom: 8, opacity: moveLabelOp }}>MOVE SET</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                  {MOVES.map((m, i) => (
                    <div key={m.name} style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,.03)',
                      border: `1px solid ${m.color}33`, borderRadius: 3,
                      opacity: moveOp(i),
                    }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, flexShrink: 0, boxShadow: `0 0 5px ${m.color}` }} />
                      <div>
                        <div style={{ fontSize: 6, color: 'rgba(255,255,255,.8)', letterSpacing: '0.5px' }}>{m.name}</div>
                        <div style={{ fontSize: 5, color: m.color, marginTop: 3, opacity: 0.7 }}>{m.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
