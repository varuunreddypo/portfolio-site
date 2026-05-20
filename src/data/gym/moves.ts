export interface Move {
  name: string;
  damage: [number, number];
  description: string;
  emoji: string;
}

export const MOVES: Move[] = [
  {
    name: 'Color Contrast Strike',
    damage: [18, 26],
    description: 'Blinds the foe with a perfectly accessible 4.5:1 ratio.',
    emoji: '🎨',
  },
  {
    name: 'Alt Text Beam',
    damage: [14, 22],
    description: 'A precise description that renders the opponent speechless.',
    emoji: '🖼️',
  },
  {
    name: 'Keyboard Nav Slam',
    damage: [20, 30],
    description: 'Tab-order perfection hits with devastating focus.',
    emoji: '⌨️',
  },
  {
    name: 'Semantic HTML Wave',
    damage: [16, 24],
    description: 'Proper heading hierarchy washes over all barriers.',
    emoji: '🌊',
  },
];
