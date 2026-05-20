import type { Biome } from './map';

export interface GymPokemon {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  sprite: string;
}

interface PoolEntry { id: number; name: string; hp: number; waterOnly?: boolean }

const POOLS: Record<string, PoolEntry[]> = {
  grass: [
    { id: 19, name: 'Rattata', hp: 30 },
    { id: 16, name: 'Pidgey',  hp: 28 },
    { id: 43, name: 'Oddish',  hp: 32 },
  ],
  forest: [
    { id: 10, name: 'Caterpie',  hp: 26 },
    { id: 13, name: 'Weedle',    hp: 26 },
    { id: 69, name: 'Bellsprout',hp: 30 },
  ],
  water: [
    { id: 129, name: 'Magikarp', hp: 20, waterOnly: true },
    { id:  60, name: 'Poliwag',  hp: 32 },
    { id:  54, name: 'Psyduck',  hp: 34 },
  ],
};

export function randomEncounter(biome: Biome, onWater = false): GymPokemon | null {
  if (biome === 'none') return null;
  if (Math.random() > 0.12) return null;
  const pool = POOLS[biome].filter(e => !e.waterOnly || onWater);
  if (pool.length === 0) return null;
  const entry = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...entry,
    maxHp: entry.hp,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.id}.png`,
  };
}
