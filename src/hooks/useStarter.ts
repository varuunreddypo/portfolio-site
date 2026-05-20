'use client';

import { useState, useEffect } from 'react';

const SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export interface StarterDef {
  key: string;
  name: string;
  dexId: number;
  maxHp: number;
  sprite: string;
  moveKey: string; // which STARTER_MOVES entry to use
}

export const STARTER_DEFS: Record<string, StarterDef> = {
  pikachu:    { key: 'pikachu',    name: 'Pikachu',    dexId: 25,  maxHp: 35, sprite: `${SPRITE}/25.png`,  moveKey: 'pikachu'    },
  eevee:      { key: 'eevee',      name: 'Eevee',      dexId: 133, maxHp: 55, sprite: `${SPRITE}/133.png`, moveKey: 'eevee'      },
  charmander: { key: 'charmander', name: 'Charmander', dexId: 4,   maxHp: 39, sprite: `${SPRITE}/4.png`,   moveKey: 'charmander' },
  bulbasaur:  { key: 'bulbasaur',  name: 'Bulbasaur',  dexId: 1,   maxHp: 45, sprite: `${SPRITE}/1.png`,   moveKey: 'bulbasaur'  },
  squirtle:   { key: 'squirtle',   name: 'Squirtle',   dexId: 7,   maxHp: 44, sprite: `${SPRITE}/7.png`,   moveKey: 'squirtle'   },
  cyndaquil:  { key: 'cyndaquil',  name: 'Cyndaquil',  dexId: 155, maxHp: 39, sprite: `${SPRITE}/155.png`, moveKey: 'charmander' },
  chikorita:  { key: 'chikorita',  name: 'Chikorita',  dexId: 152, maxHp: 45, sprite: `${SPRITE}/152.png`, moveKey: 'bulbasaur'  },
  torchic:    { key: 'torchic',    name: 'Torchic',    dexId: 255, maxHp: 45, sprite: `${SPRITE}/255.png`, moveKey: 'charmander' },
  mudkip:     { key: 'mudkip',     name: 'Mudkip',     dexId: 258, maxHp: 50, sprite: `${SPRITE}/258.png`, moveKey: 'squirtle'   },
  treecko:    { key: 'treecko',    name: 'Treecko',    dexId: 252, maxHp: 40, sprite: `${SPRITE}/252.png`, moveKey: 'bulbasaur'  },
  chimchar:   { key: 'chimchar',   name: 'Chimchar',   dexId: 390, maxHp: 44, sprite: `${SPRITE}/390.png`, moveKey: 'charmander' },
  totodile:   { key: 'totodile',   name: 'Totodile',   dexId: 158, maxHp: 50, sprite: `${SPRITE}/158.png`, moveKey: 'squirtle'   },
  piplup:     { key: 'piplup',     name: 'Piplup',     dexId: 393, maxHp: 53, sprite: `${SPRITE}/393.png`, moveKey: 'squirtle'   },
  turtwig:    { key: 'turtwig',    name: 'Turtwig',    dexId: 387, maxHp: 55, sprite: `${SPRITE}/387.png`, moveKey: 'bulbasaur'  },
  vulpix:     { key: 'vulpix',     name: 'Vulpix',     dexId: 37,  maxHp: 38, sprite: `${SPRITE}/37.png`,  moveKey: 'charmander' },
  snivy:      { key: 'snivy',      name: 'Snivy',      dexId: 495, maxHp: 45, sprite: `${SPRITE}/495.png`, moveKey: 'bulbasaur'  },
};

const DEFAULT = STARTER_DEFS.pikachu;

function resolveFromStorage(): StarterDef {
  try {
    // Primary key written by PokemonWorld on starter selection
    const direct = localStorage.getItem('selected-starter');
    if (direct && STARTER_DEFS[direct]) return STARTER_DEFS[direct];

    // Fallback: last trainer card
    const cards = JSON.parse(localStorage.getItem('vr_trainer_cards') ?? '[]');
    const last = cards[cards.length - 1];
    const name = (last?.pokemonName as string | undefined)?.toLowerCase();
    if (name && STARTER_DEFS[name]) return STARTER_DEFS[name];
  } catch {}
  return DEFAULT;
}

export function useStarter(): StarterDef {
  const [starter, setStarter] = useState<StarterDef>(DEFAULT);

  useEffect(() => {
    setStarter(resolveFromStorage());

    const handleReset = () => setStarter(DEFAULT);
    window.addEventListener('gym-reset', handleReset);
    return () => window.removeEventListener('gym-reset', handleReset);
  }, []);

  return starter;
}
