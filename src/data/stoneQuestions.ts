export type StoneId = 'water_stone' | 'leaf_stone' | 'thunder_stone' | 'sun_stone' | 'shiny_stone';

export interface StoneQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StoneDef {
  id: StoneId;
  name: string;
  concept: string;
  color: string;
  glowColor: string;
  sprite: string;
  row: number;
  col: number;
  hidden?: boolean;
  questions: [StoneQuestion, StoneQuestion];
}

export const STONES: StoneDef[] = [
  {
    id: 'water_stone', name: 'Water Stone', concept: 'Alt Text',
    color: '#5DADE2', glowColor: 'rgba(93,173,226,0.55)',
    sprite: '/stones/water.png',
    row: 15, col: 11,
    questions: [
      {
        prompt: "What's the main purpose of alt text on images?",
        options: ["To improve SEO rankings","To describe images for screen readers and when images fail to load","To add captions visible to all users","To replace image filenames"],
        correctIndex: 1,
        explanation: "Alt text describes images for screen reader users and serves as a fallback when images don't load. Without it, users with vision impairments lose all context."
      },
      {
        prompt: "Should purely decorative images have alt text?",
        options: ["Yes, describe them in detail","Yes, but keep it short","No, use alt='' so screen readers skip them","Always omit the alt attribute entirely"],
        correctIndex: 2,
        explanation: "Decorative images use empty alt (alt='') so screen readers skip them. Omitting alt entirely makes screen readers announce the filename — always worse."
      }
    ]
  },
  {
    id: 'leaf_stone', name: 'Leaf Stone', concept: 'Semantic HTML',
    color: '#52BE80', glowColor: 'rgba(82,190,128,0.55)',
    sprite: '/stones/leaf stone.png',
    row: 11, col: 7,
    questions: [
      {
        prompt: "Which is more accessible: <div onClick> or <button onClick>?",
        options: ["<div> — more flexible","<button> — keyboard-accessible by default","They're identical","Both should be avoided"],
        correctIndex: 1,
        explanation: "Buttons are keyboard-focusable and announce correctly to screen readers. Divs require manual ARIA roles, tabindex, and key handlers — easy to forget, easy to break."
      },
      {
        prompt: "Why does using <main>, <nav>, and <article> matter?",
        options: ["Makes HTML files smaller","Screen readers and search engines understand page structure","Required by browsers to render","Changes how CSS is applied"],
        correctIndex: 1,
        explanation: "Semantic elements give screen readers landmarks to navigate by. A user can jump directly to <main> or <nav> without tabbing through every link."
      }
    ]
  },
  {
    id: 'thunder_stone', name: 'Thunder Stone', concept: 'Keyboard Navigation',
    color: '#F4D03F', glowColor: 'rgba(244,208,63,0.55)',
    sprite: '/stones/thunder stone.png',
    row: 4, col: 14,
    questions: [
      {
        prompt: "What must every interactive element support at minimum?",
        options: ["Mouse hover","Tab focus + Enter or Space to activate","Right-click context menu","Long-press"],
        correctIndex: 1,
        explanation: "Every interactive element must be reachable via Tab and activatable via Enter or Space. If a user can't get to it without a mouse, it's inaccessible."
      },
      {
        prompt: "What does a 'focus trap' do, and when is it correct?",
        options: ["Keeps focus inside a modal — good for modals, bad everywhere else","Locks the user on one element permanently","It's always bad","Only affects mouse users"],
        correctIndex: 0,
        explanation: "Focus traps keep keyboard focus inside open dialogs so users don't accidentally tab behind the modal. Use them for modals only — never globally."
      }
    ]
  },
  {
    id: 'sun_stone', name: 'Sun Stone', concept: 'Color Contrast',
    color: '#F39C12', glowColor: 'rgba(243,156,18,0.55)',
    sprite: '/stones/FireStone.png',
    row: 17, col: 29,
    questions: [
      {
        prompt: "What's the WCAG AA minimum contrast ratio for normal-sized text?",
        options: ["2:1","3:1","4.5:1","7:1"],
        correctIndex: 2,
        explanation: "WCAG AA requires 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt bold). AAA requires 7:1 for normal and 4.5:1 for large."
      },
      {
        prompt: "Why does contrast matter beyond users who are blind?",
        options: ["It only matters for blind users","Low vision, color blindness, bright sunlight, and aging eyes all benefit","It's only aesthetic","Only matters on mobile"],
        correctIndex: 1,
        explanation: "Contrast benefits everyone at some point: aging eyes, color blindness (8% of men), low-vision users, bright outdoor screens, late-night reading. It's universal design."
      }
    ]
  },
  {
    id: 'shiny_stone', name: 'Shiny Stone', concept: "Explorer's Bonus",
    color: '#C8A8F8', glowColor: 'rgba(200,168,248,0.7)',
    sprite: '/stones/shiney stone.png',
    row: 5, col: 2,
    hidden: true,
    questions: [
      {
        prompt: "What does 'progressive enhancement' mean in web design?",
        options: ["Build fancy features first, strip down for older browsers","Build a solid base that works everywhere, layer enhancements on top","Use latest CSS and ignore IE","Load images progressively as you scroll"],
        correctIndex: 1,
        explanation: "Progressive enhancement starts with content and basic functionality for everyone, then layers advanced features for capable browsers — the opposite of graceful degradation."
      },
      {
        prompt: "Which aria-live value announces updates without interrupting current speech?",
        options: ['aria-live="assertive"','aria-live="polite"','aria-hidden="false"','role="alert"'],
        correctIndex: 1,
        explanation: 'aria-live="polite" queues announcements until the user finishes interacting. Use "assertive" only for urgent, time-sensitive info like errors.'
      }
    ]
  },
];

export const STONE_MAP = new Map<string, StoneDef>(
  STONES.map(s => [`${s.row},${s.col}`, s])
);
