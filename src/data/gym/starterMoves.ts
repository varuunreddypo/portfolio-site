export const A11Y_CONCEPTS = {
  COLOR_CONTRAST: {
    id: 'color_contrast',
    label: 'Color Contrast',
    education: 'Color contrast ensures text and UI elements are readable. WCAG requires 4.5:1 for normal text, 3:1 for large text.',
  },
  ALT_TEXT: {
    id: 'alt_text',
    label: 'Alt Text',
    education: 'Alt text describes images for screen readers. Every meaningful image needs a clear, concise description.',
  },
  KEYBOARD_NAV: {
    id: 'keyboard_nav',
    label: 'Keyboard Navigation',
    education: 'Keyboard navigation lets users without a mouse traverse a page using Tab, Enter, and arrow keys. Critical for motor and visual accessibility.',
  },
  SEMANTIC_HTML: {
    id: 'semantic_html',
    label: 'Semantic HTML',
    education: 'Semantic HTML uses meaningful tags (header, nav, main, article) so screen readers and search engines understand structure.',
  },
} as const;

export type ConceptId = 'color_contrast' | 'alt_text' | 'keyboard_nav' | 'semantic_html';

export interface StarterMove {
  name: string;
  flavor: string;
  power: number;
  hitCount?: number;
  animationStyle: string;
  particleColor: string;
  sound: string;
}

export type StarterMoveSet = Record<ConceptId, StarterMove>;

export const STARTER_MOVES: Record<string, StarterMoveSet> = {
  pikachu: {
    color_contrast: {
      name: 'Voltage Flash',
      flavor: 'A high-contrast electric strike. Alternating black and yellow flashes blind the opponent.',
      power: 60,
      animationStyle: 'electric_flash',
      particleColor: '#F4D03F',
      sound: 'electric_zap',
    },
    alt_text: {
      name: 'Static Signal',
      flavor: 'Descriptive electrical pulses that explain the target. Effective against silent foes.',
      power: 55,
      animationStyle: 'electric_beam',
      particleColor: '#F4D03F',
      sound: 'electric_buzz',
    },
    keyboard_nav: {
      name: 'Quick Attack',
      flavor: 'Lightning-fast multi-hit strikes, like rapid keyboard navigation.',
      power: 45,
      hitCount: 3,
      animationStyle: 'electric_dash',
      particleColor: '#F4D03F',
      sound: 'electric_quick',
    },
    semantic_html: {
      name: 'Thunder Structure',
      flavor: 'Hierarchical lightning forms a clear, ordered attack pattern.',
      power: 65,
      animationStyle: 'electric_cascade',
      particleColor: '#F4D03F',
      sound: 'electric_thunder',
    },
  },
  bulbasaur: {
    color_contrast: {
      name: 'Vine Pattern',
      flavor: 'Alternating dark and light leaves create rhythmic visual contrast.',
      power: 60,
      animationStyle: 'grass_pattern',
      particleColor: '#78C850',
      sound: 'grass_whip',
    },
    alt_text: {
      name: 'Pollen Beam',
      flavor: 'A descriptive pollen cloud that speaks the environment in vivid detail.',
      power: 55,
      animationStyle: 'grass_beam',
      particleColor: '#78C850',
      sound: 'grass_pollen',
    },
    keyboard_nav: {
      name: 'Razor Leaf',
      flavor: 'Rapid-fire leaf strikes, each one a precise navigation step.',
      power: 45,
      hitCount: 3,
      animationStyle: 'grass_dash',
      particleColor: '#78C850',
      sound: 'grass_leaf',
    },
    semantic_html: {
      name: 'Seed Foundation',
      flavor: 'Structured growth from seed to canopy. Order from chaos.',
      power: 65,
      animationStyle: 'grass_cascade',
      particleColor: '#78C850',
      sound: 'grass_grow',
    },
  },
  charmander: {
    color_contrast: {
      name: 'Ember Glow',
      flavor: 'Hot orange against cool ash creates a high-contrast burst.',
      power: 60,
      animationStyle: 'fire_flash',
      particleColor: '#F08030',
      sound: 'fire_ignite',
    },
    alt_text: {
      name: 'Smoke Signal',
      flavor: 'Patterned smoke that describes what it touches in vivid form.',
      power: 55,
      animationStyle: 'fire_beam',
      particleColor: '#F08030',
      sound: 'fire_smoke',
    },
    keyboard_nav: {
      name: 'Flame Sprint',
      flavor: 'Rapid fire bursts, each one a confident step forward.',
      power: 45,
      hitCount: 3,
      animationStyle: 'fire_dash',
      particleColor: '#F08030',
      sound: 'fire_quick',
    },
    semantic_html: {
      name: 'Forge Structure',
      flavor: 'Organized inferno forms clear architectural shapes.',
      power: 65,
      animationStyle: 'fire_cascade',
      particleColor: '#F08030',
      sound: 'fire_forge',
    },
  },
  squirtle: {
    color_contrast: {
      name: 'Prism Bubble',
      flavor: 'Iridescent bubbles split light into high-contrast bands.',
      power: 60,
      animationStyle: 'water_flash',
      particleColor: '#6890F0',
      sound: 'water_bubble',
    },
    alt_text: {
      name: 'Ripple Echo',
      flavor: 'Sonar-like ripples that describe the target through reflection.',
      power: 55,
      animationStyle: 'water_beam',
      particleColor: '#6890F0',
      sound: 'water_ripple',
    },
    keyboard_nav: {
      name: 'Aqua Tab',
      flavor: 'Quick water-jet strikes, each one a navigation step.',
      power: 45,
      hitCount: 3,
      animationStyle: 'water_dash',
      particleColor: '#6890F0',
      sound: 'water_quick',
    },
    semantic_html: {
      name: 'Tidal Hierarchy',
      flavor: 'Structured wave layers form clear, ordered attack.',
      power: 65,
      animationStyle: 'water_cascade',
      particleColor: '#6890F0',
      sound: 'water_tide',
    },
  },
  eevee: {
    color_contrast: {
      name: 'Adaptive Strike',
      flavor: 'Shifts colors mid-attack for maximum visual contrast.',
      power: 60,
      animationStyle: 'normal_flash',
      particleColor: '#E8C078',
      sound: 'normal_pulse',
    },
    alt_text: {
      name: 'Empath Read',
      flavor: "Reads and narrates the opponent's traits in detail.",
      power: 55,
      animationStyle: 'normal_beam',
      particleColor: '#E8C078',
      sound: 'normal_echo',
    },
    keyboard_nav: {
      name: 'Quick Foot',
      flavor: 'Rapid agile strikes, each one a confident step.',
      power: 45,
      hitCount: 3,
      animationStyle: 'normal_dash',
      particleColor: '#E8C078',
      sound: 'normal_quick',
    },
    semantic_html: {
      name: 'Pure Form',
      flavor: 'A clean, structured attack with no extra flourish.',
      power: 65,
      animationStyle: 'normal_cascade',
      particleColor: '#E8C078',
      sound: 'normal_pure',
    },
  },
};

export const CONCEPT_ORDER: ConceptId[] = [
  'color_contrast',
  'alt_text',
  'keyboard_nav',
  'semantic_html',
];

export const CONCEPT_META: Record<ConceptId, { label: string; education: string }> = {
  color_contrast: {
    label: 'Color Contrast',
    education: A11Y_CONCEPTS.COLOR_CONTRAST.education,
  },
  alt_text: {
    label: 'Alt Text',
    education: A11Y_CONCEPTS.ALT_TEXT.education,
  },
  keyboard_nav: {
    label: 'Keyboard Navigation',
    education: A11Y_CONCEPTS.KEYBOARD_NAV.education,
  },
  semantic_html: {
    label: 'Semantic HTML',
    education: A11Y_CONCEPTS.SEMANTIC_HTML.education,
  },
};

// TYPE_EMOJI derives from animationStyle prefix (electric_, grass_, fire_, water_, normal_)
export const TYPE_EMOJI: Record<string, string> = {
  electric: '⚡',
  grass:    '🌿',
  fire:     '🔥',
  water:    '💧',
  normal:   '⭐',
};

// Convert display power to a game damage range [min, max]
export function powerToDamage(power: number): [number, number] {
  return [Math.round(power * 0.30), Math.round(power * 0.45)];
}
