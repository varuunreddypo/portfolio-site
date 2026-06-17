'use client';

import { useEffect, useRef, useState } from 'react';
import GymTrainerSprite from './GymTrainerSprite';
import type { Move } from '@/data/gym/moves';
import type { GymPokemon } from '@/data/gym/pokemon';
import type { Biome } from '@/data/gym/map';
import {
  STARTER_MOVES, CONCEPT_ORDER, CONCEPT_META, TYPE_EMOJI, powerToDamage,
  type ConceptId,
} from '@/data/gym/starterMoves';
import type { StarterDef } from '@/hooks/useStarter';

// ── Concept visual themes (keyed on ConceptId) ────────────────────────────────
const THEME: Record<ConceptId, {
  bg: string; hoverBg: string; border: string; borderStyle: string;
  color: string; typeLabel: string; radius: string;
}> = {
  color_contrast: {
    bg: 'linear-gradient(135deg,#0a0020,#1a0060,#0a0030)',
    hoverBg: 'linear-gradient(135deg,#14003a,#220080,#14004a)',
    border: 'rgba(255,255,255,0.75)', borderStyle: 'solid',
    color: '#fff', typeLabel: 'VISUAL', radius: '10px',
  },
  alt_text: {
    bg: 'rgba(5,15,30,0.97)', hoverBg: 'rgba(8,22,44,0.97)',
    border: 'rgba(100,140,200,0.55)', borderStyle: 'dashed',
    color: '#93c5fd', typeLabel: 'CODE', radius: '6px',
  },
  keyboard_nav: {
    bg: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)',
    hoverBg: 'linear-gradient(180deg,#333,#222)',
    border: 'rgba(160,160,160,0.6)', borderStyle: 'solid',
    color: '#e2e8f0', typeLabel: 'INPUT', radius: '8px 8px 14px 14px',
  },
  semantic_html: {
    bg: 'rgba(5,18,10,0.97)', hoverBg: 'rgba(9,26,14,0.97)',
    border: 'rgba(52,211,153,0.5)', borderStyle: 'solid',
    color: '#6ee7b7', typeLabel: 'STRUCTURE', radius: '12px 4px 12px 4px',
  },
};

// ── Biome backgrounds ─────────────────────────────────────────────────────────
const BIOME_BG: Record<string, { sky: string; ground: string }> = {
  grass:  { sky: 'linear-gradient(180deg,#5bb8f5 0%,#90d4f5 42%,#6ecb52 64%,#3a8a20 100%)', ground: '#3c7a1e' },
  forest: { sky: 'linear-gradient(180deg,#1a3020 0%,#2d5030 40%,#1e3a20 70%,#0d2010 100%)', ground: '#152810' },
  water:  { sky: 'linear-gradient(180deg,#4aa8e0 0%,#70c8f0 40%,#2878c0 70%,#1a4880 100%)', ground: '#1a5080' },
  none:   { sky: 'linear-gradient(180deg,#2d3748 0%,#4a5568 55%,#374151 100%)',              ground: '#2d3748' },
};

interface Props {
  pokemon: GymPokemon;
  message: string;
  done: boolean;
  biome: Biome;
  starter: StarterDef;
  onMove: (move: Move) => void;
  onClose: () => void;
}

export default function BattleModal({
  pokemon, message, done, biome, starter, onMove, onClose,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // ── Starter-specific moves ────────────────────────────────────────────────
  const moveSet = STARTER_MOVES[starter.moveKey] ?? STARTER_MOVES.pikachu;

  // Resolved move list — 4 entries in concept order
  const resolvedMoves = CONCEPT_ORDER.map(conceptId => {
    const sm  = moveSet[conceptId];
    const meta = CONCEPT_META[conceptId];
    const typeKey  = sm.animationStyle.split('_')[0];
    const icon     = TYPE_EMOJI[typeKey] ?? '✨';
    const [dMin, dMax] = powerToDamage(sm.power);
    const gameMove: Move = {
      name: sm.name,
      damage: [dMin, dMax],
      description: sm.flavor,
      emoji: icon,
    };
    return { conceptId, sm, meta, icon, gameMove };
  });

  // ── Reduced motion ────────────────────────────────────────────────────────
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Focus trap ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const els = el.querySelectorAll<HTMLElement>('button,[tabindex]:not([tabindex="-1"])');
    const first = els[0]; const last = els[els.length - 1];

    // Delay focus so any Enter/click that opened the modal is fully released first
    const focusTimer = setTimeout(() => first?.focus(), 120);

    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault(); (e.shiftKey ? last : first)?.focus();
      }
    };

    el.addEventListener('keydown', trap);
    return () => {
      clearTimeout(focusTimer);
      el.removeEventListener('keydown', trap);
    };
  }, [onClose]);

  // ── Number key attacks (1–4) ─────────────────────────────────────────────
  useEffect(() => {
    let handler: ((e: KeyboardEvent) => void) | null = null;

    // Delay registration so the Enter/click that opened the modal doesn't immediately fire a move
    const t = setTimeout(() => {
      handler = (e: KeyboardEvent) => {
        const idx = ['1', '2', '3', '4'].indexOf(e.key);
        if (idx === -1) return;
        const entry = resolvedMovesRef.current[idx];
        if (entry) handleMoveClickRef.current(entry.gameMove, entry.sm.name);
      };
      window.addEventListener('keydown', handler);
    }, 150);

    return () => {
      clearTimeout(t);
      if (handler) window.removeEventListener('keydown', handler);
    };
  }, []);

  // ── Typewriter ────────────────────────────────────────────────────────────
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping]       = useState(false);
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeRef.current) clearInterval(typeRef.current);
    if (!message) { setDisplayed(''); return; }
    if (reduced)  { setDisplayed(message); return; }
    setDisplayed(''); setTyping(true);
    let i = 0;
    typeRef.current = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) { clearInterval(typeRef.current!); setTyping(false); }
    }, 45);
    return () => { if (typeRef.current) clearInterval(typeRef.current); };
  }, [message, reduced]);

  const skipType = () => {
    if (!typing) return;
    if (typeRef.current) clearInterval(typeRef.current);
    setDisplayed(message); setTyping(false);
  };

  // ── HP animated bar ───────────────────────────────────────────────────────
  const [hpPct, setHpPct] = useState(() => (pokemon.hp / pokemon.maxHp) * 100);
  const rafRef    = useRef<number | null>(null);
  const targetPct = useRef(hpPct);

  useEffect(() => {
    targetPct.current = (pokemon.hp / pokemon.maxHp) * 100;
    const step = () => setHpPct(prev => {
      const d = targetPct.current - prev;
      if (Math.abs(d) < 0.3) return targetPct.current;
      rafRef.current = requestAnimationFrame(step);
      return prev + d * 0.1;
    });
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [pokemon.hp, pokemon.maxHp]);

  const hpColor = hpPct > 50 ? '#4ade80' : hpPct > 25 ? '#facc15' : hpPct > 10 ? '#f97316' : '#ef4444';
  const hpPulse = hpPct <= 10 && !reduced;

  // ── Damage display ────────────────────────────────────────────────────────
  const prevHpRef  = useRef(pokemon.hp);
  const [dmgVal,   setDmgVal]   = useState(0);
  const [dmgShow,  setDmgShow]  = useState(false);

  useEffect(() => {
    if (pokemon.hp < prevHpRef.current) setDmgVal(prevHpRef.current - pokemon.hp);
    prevHpRef.current = pokemon.hp;
  }, [pokemon.hp]);

  // ── Enemy counterattack state ─────────────────────────────────────────────
  const [starterHp,     setStarterHp]    = useState(starter.maxHp);
  const [starterHpPct,  setStarterHpPct] = useState(100);
  const [enemyPhase,    setEnemyPhase]   = useState<'idle'|'announce'|'hit'>('idle');
  const [enemyMoveName, setEnemyMoveName]= useState('');
  const [starterShake,  setStarterShake] = useState(false);
  const [enemyDmgVal,   setEnemyDmgVal]  = useState(0);
  const [enemyDmgShow,  setEnemyDmgShow] = useState(false);

  // Refs so async timeouts always read current values
  const pokemonHpRef = useRef(pokemon.hp);
  useEffect(() => { pokemonHpRef.current = pokemon.hp; }, [pokemon.hp]);
  const doneRef = useRef(done);
  doneRef.current = done;

  // Starter HP animated bar (mirrors enemy HP bar logic)
  const starterTargetPct = useRef(100);
  const starterRafRef    = useRef<number | null>(null);
  useEffect(() => {
    starterTargetPct.current = (starterHp / starter.maxHp) * 100;
    const step = () => setStarterHpPct(prev => {
      const d = starterTargetPct.current - prev;
      if (Math.abs(d) < 0.3) return starterTargetPct.current;
      starterRafRef.current = requestAnimationFrame(step);
      return prev + d * 0.1;
    });
    if (starterRafRef.current) cancelAnimationFrame(starterRafRef.current);
    starterRafRef.current = requestAnimationFrame(step);
    return () => { if (starterRafRef.current) cancelAnimationFrame(starterRafRef.current); };
  }, [starterHp, starter.maxHp]);
  const starterHpColor = starterHpPct > 50 ? '#4ade80' : starterHpPct > 25 ? '#facc15' : '#ef4444';

  // ── Move animation sequence ───────────────────────────────────────────────
  const [movePhase,    setMovePhase]    = useState<'idle'|'announce'|'hit'>('idle');
  const [activeMove,   setActiveMove]   = useState<string | null>(null);
  const [pokemonShake, setPokemonShake] = useState(false);
  const [modalShake,   setModalShake]   = useState(false);

  const triggerEnemyCounter = () => {
    if (pokemonHpRef.current <= 0 || doneRef.current) return;
    const moves = ['Tackle', 'Scratch', 'Quick Attack', 'Growl', 'Leer'];
    const moveName = moves[Math.floor(Math.random() * moves.length)];
    const damage = 2 + Math.floor(Math.random() * 5);
    setEnemyMoveName(moveName);
    setEnemyPhase('announce');
    setTimeout(() => {
      if (doneRef.current) { setEnemyPhase('idle'); return; }
      setEnemyPhase('hit');
      setEnemyDmgVal(damage);
      if (!reduced) {
        setStarterShake(true); setEnemyDmgShow(true);
        setStarterHp((prev: number) => Math.max(0, prev - damage));
        setTimeout(() => { setStarterShake(false); setEnemyDmgShow(false); setEnemyPhase('idle'); }, 800);
      } else {
        setStarterHp((prev: number) => Math.max(0, prev - damage));
        setEnemyPhase('idle');
      }
    }, reduced ? 0 : 450);
  };

  const handleMoveClick = (gameMove: Move, moveName: string) => {
    if (movePhase !== 'idle' || enemyPhase !== 'idle' || done) return;
    setActiveMove(moveName);
    setMovePhase('announce');
    const delay = reduced ? 0 : 450;
    setTimeout(() => {
      onMove(gameMove);
      setMovePhase('hit');
      if (!reduced) {
        setPokemonShake(true); setModalShake(true); setDmgShow(true);
        setTimeout(() => { setPokemonShake(false); setModalShake(false); }, 280);
        setTimeout(() => {
          setDmgShow(false); setMovePhase('idle');
          setTimeout(() => triggerEnemyCounter(), 100);
        }, 800);
      } else {
        setMovePhase('idle');
        setTimeout(() => triggerEnemyCounter(), 50);
      }
    }, delay);
  };

  // ── Faint animation ───────────────────────────────────────────────────────
  const [faintAnim,    setFaintAnim]    = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const prevDone = useRef(false);

  useEffect(() => {
    if (done && !prevDone.current) {
      if (!reduced) {
        setFaintAnim(true);
        setTimeout(() => setShowContinue(true), 720);
      } else {
        setShowContinue(true);
      }
    }
    prevDone.current = done;
  }, [done, reduced]);

  // ── Send-out animation ────────────────────────────────────────────────────
  const [sendOutDone, setSendOutDone] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setSendOutDone(true), 1650);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Stable refs for keyboard handler ─────────────────────────────────────
  const handleMoveClickRef = useRef(handleMoveClick);
  handleMoveClickRef.current = handleMoveClick;
  const resolvedMovesRef = useRef(resolvedMoves);
  resolvedMovesRef.current = resolvedMoves;

  const bg = BIOME_BG[biome] ?? BIOME_BG.none;
  const starterBackSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${starter.dexId}.png`;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.82)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      role="none"
      onClick={skipType}
    >
      <style>{`
        @keyframes pkBob        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes pkBob2       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes pkShake      { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(7px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes pkFaint      { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(44px);opacity:0} }
        @keyframes mdShake      { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-4px)} 70%{transform:translateX(4px)} }
        @keyframes dmgFloat     { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-36px);opacity:0} }
        @keyframes announceIn   { 0%{transform:scale(1.5);opacity:0} 60%{transform:scale(0.95)} 100%{transform:scale(1);opacity:1} }
        @keyframes hpPulse      { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes twBlink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes trainerThrow { 0%,55%{opacity:1;transform:scaleX(-1)} 85%,100%{opacity:0;transform:scaleX(-1) translateX(-18px)} }
        @keyframes ballArc      { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 72%{transform:translate(78px,-32px) rotate(540deg);opacity:1} 90%{transform:translate(90px,6px) rotate(600deg);opacity:0} 100%{opacity:0} }
        @keyframes starterIn    { 0%{transform:scale(0.15);opacity:0;filter:brightness(6) saturate(0)} 55%{transform:scale(1.18);filter:brightness(2) saturate(1.4);opacity:0.9} 100%{transform:scale(1);opacity:1;filter:brightness(1) saturate(1)} }
        @keyframes rainbowBar  { 0%{background-position:0 50%} 100%{background-position:200% 50%} }
      `}</style>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Battle against ${pokemon.name}`}
        style={{
          width:'100%', maxWidth:580, borderRadius:14, overflow:'hidden',
          boxShadow:'0 32px 96px rgba(0,0,0,0.75)',
          animation: modalShake && !reduced ? 'mdShake 0.22s ease' : 'none',
        }}
      >
        {/* ── Battle stage ── */}
        <div style={{ position:'relative', height:250, background:bg.sky, overflow:'hidden' }}>

          {/* Ground band */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'36%',
            background:bg.ground, borderRadius:'45% 45% 0 0 / 22% 22% 0 0' }} />

          {/* Starter HP nameplate — top-left */}
          <div style={{
            position:'absolute', top:12, left:12,
            background:'linear-gradient(160deg,#f5f3ee,#e8e5dc)',
            border:'2px solid #6b7280', borderRadius:'8px 8px 8px 2px',
            padding:'6px 10px 8px', minWidth:150,
            boxShadow:'3px 3px 0 rgba(0,0,0,0.35)',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
              <span style={{ fontFamily:'"Press Start 2P",monospace', fontSize:8, color:'#1e293b' }}>
                {starter.name.toUpperCase()}
              </span>
              <span style={{ fontFamily:'"Press Start 2P",monospace', fontSize:7, color:'#475569' }}>Lv10</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ fontFamily:'"Press Start 2P",monospace', fontSize:7, color:'#b91c1c', fontWeight:700 }}>HP</span>
              <div style={{ flex:1, height:5, background:'#94a3b8', borderRadius:3, overflow:'hidden', border:'1px solid #64748b' }}>
                <div style={{ width:`${starterHpPct}%`, height:'100%', background:starterHpColor, transition:'width 0.45s ease, background 0.45s' }} />
              </div>
            </div>
            <div aria-live="polite" aria-atomic="true" style={{ fontFamily:'monospace', fontSize:9, color:'#475569', marginTop:3, textAlign:'right' }}>
              {starterHp}/{starter.maxHp} HP
            </div>
          </div>

          {/* Enemy HP nameplate — bottom-right */}
          <div style={{
            position:'absolute', bottom:12, right:12,
            background:'linear-gradient(160deg,#f5f3ee,#e8e5dc)',
            border:'2px solid #6b7280', borderRadius:'8px 8px 2px 8px',
            padding:'6px 10px 8px', minWidth:176,
            boxShadow:'-3px 3px 0 rgba(0,0,0,0.35)',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
              <span style={{ fontFamily:'"Press Start 2P",monospace', fontSize:8, color:'#1e293b' }}>
                {pokemon.name.toUpperCase()}
              </span>
              <span style={{ fontFamily:'"Press Start 2P",monospace', fontSize:7, color:'#475569' }}>Lv5</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ fontFamily:'"Press Start 2P",monospace', fontSize:7, color:'#b91c1c', fontWeight:700 }}>HP</span>
              <div style={{ flex:1, height:5, background:'#94a3b8', borderRadius:3, overflow:'hidden', border:'1px solid #64748b' }}>
                <div style={{
                  width:`${hpPct}%`, height:'100%', background:hpColor,
                  transition:'width 0.45s ease, background 0.45s',
                  animation: hpPulse ? 'hpPulse 0.8s ease-in-out infinite' : 'none',
                }} />
              </div>
            </div>
            <div style={{ fontFamily:'monospace', fontSize:9, color:'#475569', marginTop:3, textAlign:'right' }}>
              {pokemon.hp}/{pokemon.maxHp} HP
            </div>
          </div>

          {/* Enemy Pokémon — drop-shadow computed from actual sprite pixels, no gap possible */}
          <div style={{ position:'absolute', right:'10%', bottom:70 }}>
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              width={96}
              height={96}
              style={{
                imageRendering:'pixelated',
                display:'block',
                filter:'drop-shadow(0 10px 6px rgba(0,0,0,0.42))',
                transformOrigin:'bottom center',
                animation: faintAnim && !reduced
                  ? 'pkFaint 0.65s ease-in forwards'
                  : pokemonShake && !reduced
                    ? 'pkShake 0.28s ease'
                    : !reduced ? 'pkBob 2.1s ease-in-out infinite' : 'none',
              }}
            />
          </div>

          {/* Damage number float */}
          {dmgShow && !reduced && (
            <div style={{
              position:'absolute', right:'14%', top:'16%',
              fontFamily:'"Press Start 2P",monospace', fontSize:15,
              color:'#fbbf24', textShadow:'2px 2px 0 #000',
              pointerEvents:'none',
              animation:'dmgFloat 0.85s ease-out forwards',
            }}>
              -{dmgVal}
            </div>
          )}

          {/* Player platform — send-out animation, then drop-shadow sprite for battle */}
          <div style={{ position:'absolute', left:'8%', bottom:28 }}>
            {!sendOutDone && !reduced && (
              <div style={{ position:'relative', width:90, height:80 }}>
                {/* Trainer throw animation */}
                <div style={{
                  position:'absolute', bottom:0, left:0,
                  animation:'trainerThrow 1.4s ease-in-out forwards',
                  transformOrigin:'center bottom',
                }}>
                  <GymTrainerSprite height={54} />
                </div>
                {/* Pokéball arc */}
                <div style={{
                  position:'absolute', bottom:20, left:30,
                  width:12, height:12, borderRadius:'50%',
                  background:'linear-gradient(180deg,#e60012 50%,#fff 50%)',
                  border:'2px solid #222',
                  animation:'ballArc 0.75s 0.25s ease-in forwards',
                  opacity:0,
                }} />
                {/* Starter materialises */}
                <div style={{
                  position:'absolute', bottom:0, left:4,
                  animation:'starterIn 0.45s 0.95s ease-out both',
                }}>
                  <img src={starterBackSprite} alt={starter.name}
                    width={72} height={72}
                    style={{ imageRendering:'pixelated', display:'block' }} />
                </div>
              </div>
            )}
            {sendOutDone && (
              <img
                src={starterBackSprite}
                alt={starter.name}
                width={72}
                height={72}
                style={{
                  imageRendering:'pixelated',
                  display:'block',
                  filter:'drop-shadow(0 10px 5px rgba(0,0,0,0.4))',
                  transformOrigin:'bottom center',
                  animation: starterShake && !reduced
                    ? 'pkShake 0.28s ease'
                    : !reduced
                      ? 'pkBob2 2.6s 0.6s ease-in-out infinite'
                      : 'none',
                }}
              />
            )}
          </div>

          {/* Enemy damage float near starter */}
          {enemyDmgShow && !reduced && (
            <div style={{
              position:'absolute', left:'10%', bottom:'22%',
              fontFamily:'"Press Start 2P",monospace', fontSize:13,
              color:'#f87171', textShadow:'2px 2px 0 #000',
              pointerEvents:'none',
              animation:'dmgFloat 0.85s ease-out forwards',
            }}>
              -{enemyDmgVal}
            </div>
          )}

          {/* Move announce overlay — player or enemy */}
          {(movePhase === 'announce' || enemyPhase === 'announce') && !reduced && (
            <div style={{
              position:'absolute', inset:0, zIndex:10,
              display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(0,0,0,0.52)',
              animation:'announceIn 0.22s ease forwards',
            }}>
              <span style={{
                fontFamily:'"Press Start 2P",monospace', fontSize:14,
                color:'#fff', textAlign:'center', textTransform:'uppercase',
                textShadow:'0 0 24px rgba(255,255,255,0.85), 3px 3px 0 #000',
                letterSpacing:2, padding:'0 24px',
              }}>
                {movePhase === 'announce' ? `${activeMove}!` : `Wild ${pokemon.name} used ${enemyMoveName}!`}
              </span>
            </div>
          )}
        </div>

        {/* ── Dialog box ── */}
        <div
          style={{ background:'#1e293b', borderTop:'3px solid #334155', cursor:'pointer' }}
          onClick={skipType}
        >
          <div
            aria-live="polite" aria-atomic="true"
            style={{
              padding:'14px 20px', minHeight:58,
              fontFamily:'"Press Start 2P",monospace', fontSize:10,
              color:'#f1f5f9', lineHeight:2, letterSpacing:0.5,
            }}
          >
            {displayed}
            {typing && (
              <span style={{ animation:'twBlink 0.7s step-end infinite' }}> _</span>
            )}
            {!typing && displayed.length > 0 && displayed.length === message.length && (
              <span style={{ float:'right', animation:'twBlink 0.7s step-end infinite' }}>▼</span>
            )}
          </div>
        </div>

        {/* ── Move buttons ── */}
        {!done && (
          <div style={{ background:'#0f172a', padding:'12px 16px', borderTop:'1px solid #1e293b' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {resolvedMoves.map(({ conceptId, sm, icon, gameMove }, moveIdx) => {
                const t        = THEME[conceptId];
                const disabled = movePhase !== 'idle' || enemyPhase !== 'idle';

                return (
                  <button
                    key={conceptId}
                    onClick={() => handleMoveClick(gameMove, sm.name)}
                    onMouseEnter={e => {
                      if (disabled) return;
                      const el = e.currentTarget;
                      el.style.background = t.hoverBg;
                      el.style.transform = 'translateY(-2px)';
                      el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.45)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget;
                      el.style.background = t.bg;
                      el.style.transform = '';
                      el.style.boxShadow = '';
                    }}
                    disabled={disabled}
                    aria-label={sm.name}
                    style={{
                      height: 72,
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      background: t.bg,
                      border: `2px ${t.borderStyle} ${t.border}`,
                      borderRadius: t.radius,
                      color: t.color,
                      fontFamily: 'monospace', fontSize: 11,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      textAlign: 'left', lineHeight: 1.5,
                      position: 'relative', overflow: 'hidden',
                      opacity: disabled ? 0.55 : 1,
                      transition: 'transform 0.14s ease, box-shadow 0.14s ease, opacity 0.18s',
                    }}
                  >
                    {/* Keyboard shortcut badge */}
                    <div style={{
                      position:'absolute', top:8, left:8,
                      fontFamily:'"Press Start 2P",monospace', fontSize:7,
                      color:'rgba(255,255,255,0.45)',
                      background:'rgba(255,255,255,0.07)',
                      border:'1px solid rgba(255,255,255,0.14)',
                      borderRadius:3, padding:'2px 5px',
                      letterSpacing:0.5,
                    }}>
                      {moveIdx + 1}
                    </div>

                    {/* Move name */}
                    <div style={{ fontWeight:700, fontSize:12, paddingLeft:28 }}>
                      {icon} {sm.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Bottom actions ── */}
        <div style={{ background:'#0f172a', padding:'0 16px 14px' }}>
          {done && showContinue && (
            <button
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onClick={onClose}
              style={{
                width:'100%', padding:'12px', marginTop:12,
                background:'rgba(74,222,128,0.14)',
                border:'2px solid rgba(74,222,128,0.5)',
                borderRadius:8, color:'#4ade80',
                fontFamily:'"Press Start 2P",monospace', fontSize:11,
                cursor:'pointer', letterSpacing:1,
              }}
            >
              Continue →
            </button>
          )}
          {!done && (
            <button
              onClick={onClose}
              style={{
                width:'100%', marginTop:10, padding:'8px',
                background:'transparent', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:8, color:'#475569',
                fontFamily:'monospace', fontSize:11, cursor:'pointer',
              }}
            >
              Run away (Esc)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
