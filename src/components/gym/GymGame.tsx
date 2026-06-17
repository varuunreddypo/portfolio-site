'use client';

import { useReducer, useEffect, useRef, useCallback, useState, type CSSProperties } from 'react';
import { MAP_GRID, MAP_ROWS, MAP_COLS, PLAYER_START, getBiome, isWalkable, isOnWater } from '@/data/gym/map';
import { randomEncounter, type GymPokemon } from '@/data/gym/pokemon';
import { type Move } from '@/data/gym/moves';
import BattleModal from './BattleModal';
import TrainerQuizModal from './TrainerQuizModal';
import GymTrainerSprite from './GymTrainerSprite';
import LockedBadge from './LockedBadge';
import BadgeCelebrationModal from './BadgeCelebrationModal';
import DPad from './DPad';
import CharacterCanvas from './CharacterCanvas';
import { useStarter } from '@/hooks/useStarter';
import { useStones } from '@/hooks/useStones';
import NewAdventureButton from './NewAdventureButton';
import { SoundToggle } from './SoundToggle';
import { playEncounterSound } from '@/utils/playEncounterSound';
import StarterPicker from './StarterPicker';
import type { StarterDef } from '@/hooks/useStarter';
import { STONES, STONE_MAP, type StoneDef } from '@/data/stoneQuestions';
import Stone from './Stone';
import StoneQuizModal from './StoneQuizModal';
import StoneProgress from './StoneProgress';

const TILE = 48;

const ALL_POKEMON = [
  { id: 10,  name: 'Caterpie'   },
  { id: 13,  name: 'Weedle'     },
  { id: 16,  name: 'Pidgey'     },
  { id: 19,  name: 'Rattata'    },
  { id: 43,  name: 'Oddish'     },
  { id: 54,  name: 'Psyduck'    },
  { id: 60,  name: 'Poliwag'    },
  { id: 69,  name: 'Bellsprout' },
  { id: 129, name: 'Magikarp'   },
];

type Dir = 'up' | 'down' | 'left' | 'right';

interface State {
  row: number; col: number; dir: Dir; bumping: boolean;
  encounter: GymPokemon | null; battleDone: boolean; battleMsg: string;
  seen: string[]; hasBadge: boolean; showBadge: boolean;
  trainerRank: string; battleId: number;
  steps: number; announcement: string;
}

type Action =
  | { type: 'MOVE'; dir: Dir; nextRow: number; nextCol: number }
  | { type: 'BUMP'; dir: Dir }
  | { type: 'ENCOUNTER'; pokemon: GymPokemon; starterName: string }
  | { type: 'USE_MOVE'; damage: number; newHp: number; moveName: string; starterName: string }
  | { type: 'BATTLE_WIN'; name: string; newSeen: string[]; newRank: string }
  | { type: 'CLOSE_BATTLE' }
  | { type: 'QUIZ_BADGE' }
  | { type: 'SHOW_BADGE_OFF' }
  | { type: 'LOAD'; seen: string[]; hasBadge: boolean; steps: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'MOVE':
      return { ...state, row: action.nextRow, col: action.nextCol, dir: action.dir, bumping: false, steps: state.steps + 1, announcement: '' };
    case 'BUMP':
      return { ...state, dir: action.dir, bumping: true, announcement: 'Blocked.' };
    case 'ENCOUNTER':
      return { ...state, encounter: action.pokemon, battleDone: false, battleId: state.battleId + 1, battleMsg: `A wild ${action.pokemon.name} appeared! Go, ${action.starterName}!` };
    case 'USE_MOVE': {
      if (!state.encounter) return state;
      const won = action.newHp <= 0;
      return {
        ...state,
        encounter: { ...state.encounter, hp: action.newHp },
        battleMsg: won
          ? `${action.starterName} used ${action.moveName} and won! ${state.encounter.name} fainted!`
          : `${action.starterName} used ${action.moveName}! ${state.encounter.name} has ${action.newHp} HP left.`,
      };
    }
    case 'BATTLE_WIN': {
      const rankChanged = action.newRank !== '' && action.newRank !== state.trainerRank;
      return {
        ...state,
        encounter: state.encounter ? { ...state.encounter, hp: 0 } : null,
        battleDone: true,
        battleMsg: rankChanged
          ? `${action.name} added to Pokédex! 🎮 ${action.newRank} rank unlocked!`
          : `${action.name} added to Pokédex! Seen: ${action.newSeen.length}/9`,
        seen: action.newSeen,
        trainerRank: action.newRank || state.trainerRank,
        announcement: rankChanged
          ? `${action.newRank} rank unlocked!`
          : `${action.name} added to Pokédex. Seen ${action.newSeen.length} of 9.`,
      };
    }
    case 'CLOSE_BATTLE':
      return { ...state, encounter: null, battleDone: false, battleMsg: '' };
    case 'QUIZ_BADGE':
      return {
        ...state,
        hasBadge: true,
        showBadge: !state.hasBadge,
        announcement: !state.hasBadge ? 'A11Y Badge earned!' : '',
      };
    case 'SHOW_BADGE_OFF':
      return { ...state, showBadge: false };
    case 'LOAD':
      return { ...state, seen: action.seen, hasBadge: action.hasBadge, steps: action.steps, trainerRank: rankForCount(action.seen.length) };
    default:
      return state;
  }
}

const INIT: State = {
  row: PLAYER_START.row, col: PLAYER_START.col, dir: 'down', bumping: false,
  encounter: null, battleDone: false, battleMsg: '',
  seen: [], hasBadge: false, showBadge: false, trainerRank: '', battleId: 0, steps: 0, announcement: '',
};

function rankForCount(count: number): string {
  if (count >= 9) return 'Ace Trainer';
  if (count >= 6) return 'Trainer';
  if (count >= 3) return 'Rookie';
  return '';
}

const DIR_DELTA: Record<Dir, [number, number]> = {
  up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1],
};

function persist(seen: string[], hasBadge: boolean, steps: number) {
  try {
    localStorage.setItem('gym-seen', JSON.stringify(seen));
    localStorage.setItem('gym-badges', hasBadge ? '1' : '0');
    localStorage.setItem('gym-steps', String(steps));
  } catch {}
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
      <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0', fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function GymGame() {
  const starter = useStarter();
  const [showStarterPick, setShowStarterPick] = useState(false);

  useEffect(() => {
    const needsPick =
      sessionStorage.getItem('vr_new_adventure') === '1' ||
      !localStorage.getItem('selected-starter');
    if (needsPick) setShowStarterPick(true);
  }, []);

  function handleStarterPick(s: StarterDef) {
    localStorage.setItem('selected-starter', s.key);
    sessionStorage.removeItem('vr_new_adventure');
    setShowStarterPick(false);
  }

  const [state, dispatch] = useReducer(reducer, INIT);
  const [isMoving, setIsMoving] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [debugGrid, setDebugGrid] = useState(false);
  const [tileW, setTileW] = useState(TILE);
  const [tileH, setTileH] = useState(TILE);
  const inBattle = useRef(false);
  const demoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const mapImgRef = useRef<HTMLImageElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const starterRef = useRef(starter);
  starterRef.current = starter;

  const [showQuiz, setShowQuiz] = useState(false);
  const showQuizRef = useRef(false);
  showQuizRef.current = showQuiz;

  const handleCloseRef = useRef<() => void>(() => {});

  // Stone system
  const { collected, collectStone, mainCollectedCount, totalMain } = useStones();
  const collectedRef = useRef(collected);
  collectedRef.current = collected;
  const stoneCooldowns = useRef<Record<string, number>>({});
  const [activeStone, setActiveStone] = useState<StoneDef | null>(null);
  const [reviewStone, setReviewStone] = useState<StoneDef | null>(null);
  const activeStoneRef = useRef<StoneDef | null>(null);
  activeStoneRef.current = activeStone;

  // Badge unlock via stone collection
  useEffect(() => {
    const handler = () => dispatch({ type: 'QUIZ_BADGE' });
    window.addEventListener('badge-unlocked', handler);
    return () => window.removeEventListener('badge-unlocked', handler);
  }, []);

  // Track rendered image size (not natural size) so tile positions always match display
  useEffect(() => {
    const img = mapImgRef.current;
    if (!img) return;
    const update = () => {
      if (img.offsetWidth > 0) {
        setTileW(img.offsetWidth / MAP_COLS);
        setTileH(img.offsetHeight / MAP_ROWS);
      }
    };
    const obs = new ResizeObserver(update);
    obs.observe(img);
    update();
    return () => obs.disconnect();
  }, []);

  const handleImgLoad = useCallback(() => {
    const img = mapImgRef.current;
    if (!img) return;
    setTileW(img.offsetWidth / MAP_COLS);
    setTileH(img.offsetHeight / MAP_ROWS);
  }, []);

  useEffect(() => {
    try {
      const seen = JSON.parse(localStorage.getItem('gym-seen') || '[]');
      const hasBadge = localStorage.getItem('gym-badges') === '1';
      const steps = parseInt(localStorage.getItem('gym-steps') || '0', 10);
      dispatch({ type: 'LOAD', seen, hasBadge, steps });
    } catch {}
  }, []);

  // Skip persisting on first render (INIT values) so we don't overwrite existing save before LOAD fires
  const persistReady = useRef(false);
  useEffect(() => {
    if (!persistReady.current) { persistReady.current = true; return; }
    persist(state.seen, state.hasBadge, state.steps);
  }, [state.seen, state.hasBadge, state.steps]);

  useEffect(() => {
    if (state.steps === 0) return;
    setIsMoving(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIsMoving(false), 250);
  }, [state.steps]);

  const movePlayer = useCallback((dir: Dir) => {
    if (inBattle.current) return;
    if (activeStoneRef.current) return;
    const [dr, dc] = DIR_DELTA[dir];
    const nextRow = state.row + dr;
    const nextCol = state.col + dc;
    // Stone collision — handled before map walkability
    const bumpedStone = STONE_MAP.get(`${nextRow},${nextCol}`);
    if (bumpedStone && !collectedRef.current.includes(bumpedStone.id)) {
      const cooldownExpires = stoneCooldowns.current[bumpedStone.id] ?? 0;
      dispatch({ type: 'BUMP', dir });
      if (Date.now() >= cooldownExpires && !activeStoneRef.current) setActiveStone(bumpedStone);
      return;
    }
    if (!isWalkable(nextRow, nextCol)) { dispatch({ type: 'BUMP', dir }); return; }
    dispatch({ type: 'MOVE', dir, nextRow, nextCol });
  }, [state.row, state.col]);

  useEffect(() => {
    if (inBattle.current) return;
    const t = setTimeout(() => {
      const s = stateRef.current;
      const biome = getBiome(s.row, s.col);
      const pokemon = randomEncounter(biome, isOnWater(s.row, s.col));
      if (pokemon) { inBattle.current = true; playEncounterSound(); dispatch({ type: 'ENCOUNTER', pokemon, starterName: starterRef.current.name }); }
    }, 220);
    return () => clearTimeout(t);
  }, [state.row, state.col]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showHelp) { setShowHelp(false); return; }
      if (e.key === 'Escape' && stateRef.current.encounter) { handleCloseRef.current(); return; }
      if (e.key === 'Enter' && stateRef.current.encounter && !stateRef.current.battleDone) { setShowBattleModal(true); return; }
      const map: Record<string, Dir> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); movePlayer(dir); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [movePlayer, showHelp]);

  const handleMove = useCallback((move: Move) => {
    const s = stateRef.current;
    if (!s.encounter || s.battleDone) return;
    const damage = move.damage[0] + Math.floor(Math.random() * (move.damage[1] - move.damage[0] + 1));
    const newHp = Math.max(0, s.encounter.hp - damage);
    dispatch({ type: 'USE_MOVE', damage, newHp, moveName: move.name, starterName: starterRef.current.name });
    if (newHp <= 0) {
      setTimeout(() => {
        const cur = stateRef.current;
        if (!cur.encounter) return;
        const name = cur.encounter.name;
        const newSeen = cur.seen.includes(name) ? cur.seen : [...cur.seen, name];
        const newRank = rankForCount(newSeen.length);
        dispatch({ type: 'BATTLE_WIN', name, newSeen, newRank });
      }, 600);
    }
  }, []);

  // Adjacency detection — open quiz when player steps next to trainer NPC
  const TRAINER_TILES = [[2, 11], [2, 12]] as const;
  useEffect(() => {
    if (inBattle.current || showQuizRef.current) return;
    const { row, col } = stateRef.current;
    const adjacent = TRAINER_TILES.some(([tr, tc]) =>
      (Math.abs(row - tr) + Math.abs(col - tc)) === 1
    );
    if (adjacent) setShowQuiz(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.row, state.col]);

  const handleClose = useCallback(() => {
    inBattle.current = false;
    setShowBattleModal(false);
    dispatch({ type: 'CLOSE_BATTLE' });
    gameRef.current?.focus();
  }, []);
  handleCloseRef.current = handleClose;

  const runDemo = useCallback(() => {
    if (demoActive) return;
    setDemoActive(true);
    const steps: Dir[] = ['down','down','left','left','down','down','right','right','up','up','up','right','right','up','left','left','down'];
    let i = 0;
    const next = () => {
      if (i >= steps.length) { setDemoActive(false); return; }
      if (!inBattle.current) movePlayer(steps[i++]); else i++;
      demoRef.current = setTimeout(next, 520);
    };
    demoRef.current = setTimeout(next, 300);
  }, [demoActive, movePlayer]);

  useEffect(() => () => {
    if (demoRef.current) clearTimeout(demoRef.current);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const biome = getBiome(state.row, state.col);
  const biomeLabel: Record<string, string> = { grass: 'Grass', forest: 'Forest', water: 'Water', none: 'Path' };
  const charSize = tileW > 0 ? Math.round(tileW * 1.05) : 50;

  const PANEL: CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 10,
    padding: '12px 14px',
  };

  const GOLD_BORDER: CSSProperties = {
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: 8,
    background: 'rgba(255,215,0,0.02)',
  };

  if (showStarterPick) {
    return <StarterPicker onPick={handleStarterPick} />;
  }

  return (
    <>
      <div role="status" aria-live="polite" style={{ position: 'absolute', left: -9999, top: 0, width: 1, height: 1, overflow: 'hidden' }}>
        {state.announcement}
      </div>

      {/* Main grid: sidebar | map+controls */}
      <div className="gym-main-grid" style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '264px 1fr',
        gap: '0 20px',
        padding: '16px 20px',
        boxSizing: 'border-box',
        minHeight: 0,
        overflow: 'hidden',
      }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, overflow: 'hidden' }}>

          {/* Title */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
              <h1 style={{ margin: 0, fontFamily: 'monospace', fontSize: 16, color: '#f1f5f9', letterSpacing: 2, fontWeight: 800, flex: 1 }}>
                Varuun's Gym
              </h1>
              <SoundToggle compact />
            </div>
            <p style={{ margin: 0, color: '#475569', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.5 }}>
              Defeat Pokémon · Earn the Inclusivity Badge
            </p>
          </div>

          {/* Gym trainer + locked badge */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14 }}>
            <GymTrainerSprite height={140} />
            <LockedBadge earned={state.hasBadge} collectedCount={mainCollectedCount} totalCount={totalMain} />
          </div>

          {/* Stone progress */}
          <StoneProgress
            stones={STONES}
            collected={collected}
            onReview={stone => setReviewStone(stone)}
          />

          {/* Stats grid */}
          <div style={{ ...PANEL, flexShrink: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
            <StatCell label="Zone"    value={biomeLabel[biome]} />
            <StatCell label="Steps"   value={String(state.steps)} />
            <div style={{ gridColumn: '1 / -1', height: 1, background: 'rgba(255,255,255,0.07)', margin: '2px 0' }} />
            <StatCell label="Pokédex" value={`${state.seen.length} / 9`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>Rank</span>
              <span style={{
                fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                color: state.trainerRank === 'Ace Trainer' ? '#a78bfa'
                     : state.trainerRank === 'Trainer' ? '#60a5fa'
                     : state.trainerRank === 'Rookie' ? '#f59e0b'
                     : '#475569',
              }}>
                {state.trainerRank ? `🎮 ${state.trainerRank}` : 'Novice'}
              </span>
            </div>
          </div>

          {/* Debug + Demo in one row */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setDebugGrid(v => !v)}
              style={{
                flex: 1, padding: '7px 8px', fontFamily: 'monospace', fontSize: 10,
                background: debugGrid ? 'rgba(255,60,60,0.18)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${debugGrid ? 'rgba(255,60,60,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 7, color: debugGrid ? '#fca5a5' : '#64748b', cursor: 'pointer',
              }}
            >
              {debugGrid ? '🔴 Access Points' : '🔲 Access Points'}
            </button>
            <button
              onClick={runDemo}
              disabled={demoActive}
              style={{
                flex: 1, padding: '7px 8px', fontFamily: 'monospace', fontSize: 10,
                background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.38)',
                borderRadius: 7, color: '#d8b4fe', cursor: demoActive ? 'not-allowed' : 'pointer',
                opacity: demoActive ? 0.5 : 1,
              }}
            >
              {demoActive ? '▶ Running…' : '▶ Demo'}
            </button>
          </div>

          {/* Pokédex 3×3 grid */}
          <div style={{ ...PANEL, flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: '0 0 8px', fontFamily: 'monospace', fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, flexShrink: 0 }}>
              Pokédex {state.seen.length > 0 && `· ${state.seen.length}/9`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {ALL_POKEMON.map(pkmn => {
                const discovered = state.seen.includes(pkmn.name);
                const backSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.id}.png`;
                return (
                  <div
                    key={pkmn.id}
                    title={discovered ? pkmn.name : '???'}
                    style={{
                      background: discovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px ${discovered ? 'solid' : 'dashed'} ${discovered ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 6,
                      padding: '4px 4px 3px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <img
                      src={backSprite}
                      alt={discovered ? pkmn.name : '???'}
                      draggable={false}
                      style={{
                        width: 40, height: 40,
                        imageRendering: 'pixelated',
                        display: 'block',
                        filter: discovered ? 'none' : 'brightness(0) saturate(0) opacity(0.18)',
                      }}
                    />
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: 8,
                      color: discovered ? '#cbd5e1' : '#1e293b',
                      textAlign: 'center',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      width: '100%',
                    }}>
                      {discovered ? pkmn.name : '???'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How to Play + Start New Adventure — side by side */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setShowHelp(true)}
              style={{
                flex: 1, padding: '8px 6px',
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.28)',
                borderRadius: 7, color: '#7dd3fc',
                fontFamily: 'monospace', fontSize: 9,
                cursor: 'pointer',
              }}
            >
              ? How to Play
            </button>
            <div style={{ flex: 1 }}>
              <NewAdventureButton />
            </div>
          </div>
        </div>

        {/* ── MAP + CONTROLS ── */}
        <div className="gym-map-col" style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0, overflow: 'hidden' }}>

          {/* Map */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <div
              ref={gameRef}
              role="application"
              aria-label="Pokémon Gym map. Use arrow keys to move."
              tabIndex={0}
              style={{
                position: 'relative',
                display: 'inline-block',
                borderRadius: 6,
                overflow: 'hidden',
                outline: 'none',
                boxShadow: '0 16px 64px rgba(0,0,0,0.7), 0 0 0 2px rgba(255,255,255,0.08)',
                lineHeight: 0,
              }}
            >
              <img
                ref={mapImgRef}
                src="/Varuun Pokemon Gym.png"
                alt="Pokémon Gym map"
                onLoad={handleImgLoad}
                style={{ display: 'block', maxWidth: '100%', imageRendering: 'pixelated' }}
                draggable={false}
              />

              {Array.from({ length: MAP_ROWS * MAP_COLS }).map((_, i) => {
                const col = i % MAP_COLS;
                const row = Math.floor(i / MAP_COLS);
                const tile = MAP_GRID[row][col];
                const walkable = isWalkable(row, col);
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: col * tileW, top: row * tileH,
                      width: tileW, height: tileH,
                      background: debugGrid
                        ? tile === 'W' ? 'rgba(30,100,255,0.35)' : walkable ? 'rgba(0,220,80,0.35)' : 'rgba(255,30,30,0.35)'
                        : 'transparent',
                      border: debugGrid ? '1px solid rgba(255,255,255,0.2)' : 'none',
                      boxSizing: 'border-box',
                      display: debugGrid ? 'flex' : 'none',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace',
                      pointerEvents: 'none',
                    }}
                  >
                    {debugGrid && `${row},${col}`}
                  </div>
                );
              })}

              {/* Trainer NPC — spans tiles 2,11 and 2,12 */}
              {tileW > 0 && (
                <>
                  <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'visible' }}>
                    <defs>
                      <filter id="trainerOutline" x="-30%" y="-30%" width="160%" height="160%">
                        <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="2.5" />
                        <feFlood floodColor="#ef4444" result="red" />
                        <feComposite in="red" in2="dilated" operator="in" result="solidOutline" />
                        <feGaussianBlur in="solidOutline" stdDeviation="3" result="glow" />
                        <feMerge>
                          <feMergeNode in="glow" />
                          <feMergeNode in="solidOutline" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                  </svg>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Gym Leader Varuun — click to take the WCAG quiz"
                    onClick={() => setShowQuiz(true)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowQuiz(true); }}
                    style={{
                      position: 'absolute',
                      left: 11 * tileW,
                      top: 1 * tileH,
                      width: 2 * tileW,
                      height: 2 * tileH,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      zIndex: 6,
                      cursor: 'pointer',
                      filter: 'url(#trainerOutline)',
                    }}
                  >
                    <GymTrainerSprite height={Math.round(tileH * 1.9)} />
                  </div>
                </>
              )}

              {/* Poke Stones */}
              {tileW > 0 && STONES.map(stone =>
                collected.includes(stone.id) ? null : (
                  <Stone
                    key={stone.id}
                    stone={stone}
                    tileW={tileW}
                    tileH={tileH}
                    onClick={() => {
                      const cooldownExpires = stoneCooldowns.current[stone.id] ?? 0;
                      if (Date.now() >= cooldownExpires && !activeStoneRef.current) setActiveStone(stone);
                    }}
                  />
                )
              )}

              {/* SVG filter — dilates alpha channel to trace sprite outline */}
              <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'visible' }}>
                <defs>
                  <filter id="avatarOutline" x="-30%" y="-30%" width="160%" height="160%">
                    <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="2.5" />
                    <feFlood floodColor="#f5c400" result="yellow" />
                    <feComposite in="yellow" in2="dilated" operator="in" result="solidOutline" />
                    <feGaussianBlur in="solidOutline" stdDeviation="3" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="solidOutline" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>

              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: tileW, height: tileH,
                  transform: `translate(${state.col * tileW}px, ${state.row * tileH}px)`,
                  transition: state.bumping ? 'none' : 'transform 0.18s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10,
                  filter: 'url(#avatarOutline)',
                  animation: state.bumping ? 'gymBump 0.15s ease' : 'none',
                }}
              >
                <CharacterCanvas dir={state.dir} step={state.steps} isMoving={isMoving} size={charSize} />
              </div>
            </div>
          </div>

          {/* Controls panel */}
          <div style={{
            flexShrink: 0,
            minHeight: 150,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid rgba(255,215,0,0.3)',
            background: 'linear-gradient(180deg,#1a2035 0%,#111827 100%)',
          }}>

            {/* Row 1 — DPad + Status/Encounter + Actions */}
            <div style={{
              flex: 1,
              display: 'flex', alignItems: 'stretch', gap: 28,
              padding: '12px 20px 12px 20px',
              paddingRight: 60,
              minHeight: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 198 }}>
                <DPad onMove={movePlayer} disabled={!!state.encounter} size={50} />
              </div>

              {/* Vertical divider */}
              <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

              {state.encounter ? (
                <>
                  <img
                    src={state.encounter.sprite}
                    alt={state.encounter.name}
                    style={{ width: 112, height: 112, imageRendering: 'pixelated', flexShrink: 0, alignSelf: 'center' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ margin: '0 0 3px', fontFamily: 'monospace', fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: 1 }}>Encounter</p>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                      Wild {state.encounter.name}!
                    </p>
                    <p style={{ margin: '2px 0 0', fontFamily: 'monospace', fontSize: 10, color: '#64748b' }}>
                      HP {state.encounter.hp} / {state.encounter.maxHp}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignSelf: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <button
                        onClick={() => setShowBattleModal(true)}
                        style={{
                          padding: '8px 20px',
                          background: 'linear-gradient(180deg,#f59e0b,#d97706)',
                          borderRadius: 6, fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                          color: '#fff', boxShadow: '0 2px 0 #92400e', cursor: 'pointer', border: 'none',
                        }}
                      >
                        Battle!
                      </button>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#334155', letterSpacing: 0.5 }}>
                        or press <kbd style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, padding: '1px 4px' }}>Enter</kbd>
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <button
                        onClick={handleClose}
                        style={{
                          padding: '8px 20px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 6, fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                          color: '#94a3b8', boxShadow: '0 2px 0 rgba(0,0,0,0.3)', cursor: 'pointer',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        Escape
                      </button>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#334155', letterSpacing: 0.5 }}>
                        or press <kbd style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, padding: '1px 4px' }}>ESC</kbd>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 4 }}>
                  <p style={{ margin: '0 0 3px', fontFamily: 'monospace', fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: 1 }}>Status</p>
                  <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 10, color: '#475569', lineHeight: 1.7 }}>
                    Walk on <span style={{ color: '#86efac' }}>grass</span>,{' '}
                    <span style={{ color: '#6ee7b7' }}>forest</span>, or{' '}
                    <span style={{ color: '#7dd3fc' }}>water</span> to encounter Pokémon.
                  </p>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>

      {/* How to Play modal */}
      {showHelp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="How to Play"
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{
              background: 'linear-gradient(160deg,#1a1a2e 0%,#16213e 100%)',
              border: '1px solid rgba(255,215,0,0.28)',
              borderRadius: 16, padding: '24px 28px',
              maxWidth: 380, width: '100%',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 14px', fontFamily: 'monospace', fontSize: 15, color: '#f1f5f9' }}>
              🏟️ How to Play
            </h2>
            <ul style={{ margin: 0, paddingLeft: 16, fontFamily: 'monospace', fontSize: 11, color: '#94a3b8', lineHeight: 2 }}>
              <li>Use <strong style={{ color: '#f1f5f9' }}>Arrow Keys</strong> or the <strong style={{ color: '#f1f5f9' }}>D-Pad</strong> to navigate the map</li>
              <li>Walk on <strong style={{ color: '#86efac' }}>grass</strong>, <strong style={{ color: '#6ee7b7' }}>forest</strong>, or <strong style={{ color: '#7dd3fc' }}>water</strong> to find Pokémon</li>
              <li>Press <strong style={{ color: '#f1f5f9' }}>Enter</strong> to battle · <strong style={{ color: '#f1f5f9' }}>ESC</strong> to flee</li>
              <li>Use <strong style={{ color: '#f1f5f9' }}>1–4 keys</strong> or click to choose an attack</li>
              <li>Wild Pokémon <strong style={{ color: '#fca5a5' }}>attack back</strong> — win by draining their HP</li>
              <li>Defeat <strong style={{ color: '#f59e0b' }}>3</strong> → <strong style={{ color: '#f59e0b' }}>Rookie</strong> · <strong style={{ color: '#60a5fa' }}>6</strong> → <strong style={{ color: '#60a5fa' }}>Trainer</strong> · <strong style={{ color: '#a78bfa' }}>9</strong> → <strong style={{ color: '#a78bfa' }}>Ace Trainer</strong></li>
              <li>Bump into <strong style={{ color: '#c4b5fd' }}>Evolution Stones</strong> to answer WCAG quizzes</li>
              <li>Collect all <strong style={{ color: '#f1f5f9' }}>4 stones</strong> → earn the <strong style={{ color: '#fbbf24' }}>A11Y Badge</strong></li>
              <li>Find the hidden <strong style={{ color: '#e9d5ff' }}>✨ Shiny Stone</strong> for a bonus challenge</li>
            </ul>
            <p style={{ margin: '10px 0 16px', fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>
              Progress auto-saved in your browser.
            </p>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                width: '100%', padding: '10px',
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: 8, color: 'rgba(255,215,0,0.85)',
                fontFamily: 'monospace', fontSize: 12, cursor: 'pointer',
              }}
            >
              Got it ✓
            </button>
          </div>
        </div>
      )}

      {/* Battle modal */}
      {state.encounter && showBattleModal && (
        <BattleModal
          key={state.battleId}
          pokemon={state.encounter}
          starter={starter}
          message={state.battleMsg}
          done={state.battleDone}
          biome={biome}
          onMove={handleMove}
          onClose={handleClose}
        />
      )}

      {/* Trainer quiz modal */}
      {showQuiz && (
        <TrainerQuizModal
          alreadyBadged={state.hasBadge}
          onPass={() => {
            dispatch({ type: 'QUIZ_BADGE' });
            if (state.hasBadge) setTimeout(() => dispatch({ type: 'SHOW_BADGE_OFF' }), 4000);
            setShowQuiz(false);
          }}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Badge celebration modal */}
      {state.showBadge && (
        <BadgeCelebrationModal
          onClose={() => dispatch({ type: 'SHOW_BADGE_OFF' })}
        />
      )}

      {/* Stone quiz modal */}
      {activeStone && !collected.includes(activeStone.id) && (
        <StoneQuizModal
          stone={activeStone}
          mode="quiz"
          onCollect={() => {
            collectStone(activeStone.id);
            setActiveStone(null);
          }}
          onFail={() => {
            stoneCooldowns.current[activeStone.id] = Date.now() + 10_000;
            setActiveStone(null);
          }}
          onClose={() => setActiveStone(null)}
        />
      )}
      {/* Stone review modal (sidebar click) */}
      {reviewStone && (
        <StoneQuizModal
          stone={reviewStone}
          mode="review"
          onCollect={() => setReviewStone(null)}
          onFail={() => setReviewStone(null)}
          onClose={() => setReviewStone(null)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .gym-main-grid { grid-template-columns: 1fr !important; overflow-y: auto !important; }
          .gym-map-col { display: none !important; }
        }
        @keyframes gymBump {
          0%   { transform: translate(${state.col * tileW}px, ${state.row * tileH}px); }
          40%  { transform: translate(${(state.col + (state.dir === 'right' ? 0.12 : state.dir === 'left' ? -0.12 : 0)) * tileW}px, ${(state.row + (state.dir === 'down' ? 0.12 : state.dir === 'up' ? -0.12 : 0)) * tileH}px); }
          100% { transform: translate(${state.col * tileW}px, ${state.row * tileH}px); }
        }
      `}</style>
    </>
  );
}
