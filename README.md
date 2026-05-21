# Varuun Reddy — Product Design Portfolio

A Pokémon-themed interactive portfolio built with Next.js. Features an animated Pokédex hero, a walkable gym game, case study pages, and hidden easter eggs throughout.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Animation | Framer Motion 12 |
| Video | Remotion 4 |
| Styling | Tailwind CSS 4 (utility classes + inline styles) |
| Language | TypeScript 5 |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run remotion` | Open Remotion Studio for the Pokédex boot animation |
| `npm run render` | Render the boot animation to `out/pokedex-boot.mp4` |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Home page
│   ├── layout.tsx                      # Root layout (fonts, metadata)
│   ├── gym/page.tsx                    # /gym — interactive gym game
│   └── work/
│       ├── acquaa/page.tsx             # Case study: Acquaa
│       ├── bcbsa/page.tsx              # Case study: BCBSA
│       ├── roombees/page.tsx           # Case study: Roombees
│       └── transition-discoveries/    # Case study: Transition Discoveries
│
├── components/
│   ├── hero/Hero.tsx                   # Pokédex-style about/hero section
│   ├── nav/Navbar.tsx                  # Top navigation
│   ├── work/WorkSection.tsx            # Case study grid on home
│   ├── gallery/VisitorGallery.tsx      # Visitor sign-in gallery
│   ├── logos/LogoTicker.tsx            # Scrolling logo ticker
│   ├── pokemon/PokemonWorld.tsx        # Animated Pokémon world scene
│   ├── gym/                            # All gym game components
│   │   ├── GymGame.tsx                 # Main game controller
│   │   ├── CharacterCanvas.tsx         # Player sprite / movement
│   │   ├── StarterPicker.tsx           # Starter Pokémon selection
│   │   ├── BattleModal.tsx             # Battle sequence
│   │   ├── StoneQuizModal.tsx          # Knowledge stone quizzes
│   │   ├── TrainerQuizModal.tsx        # Trainer challenge quizzes
│   │   └── ...                         # Supporting gym components
│   ├── easter-eggs/                    # Hidden interactive easter eggs
│   │   ├── BellsproutBush.tsx
│   │   ├── CharizardEgg.tsx
│   │   ├── GengarCave.tsx
│   │   └── PsyduckEgg.tsx
│   ├── remotion/PokedexPlayer.tsx      # Remotion video player component
│   └── ui/
│       ├── Footer.tsx
│       ├── PageTransition.tsx
│       └── PasswordGate.tsx            # Optional password protection
│
└── remotion/
    ├── PokedexBoot.tsx                 # Boot animation composition
    └── Root.tsx                        # Remotion root
```

---

## Key Sections

### Hero / About (`/`)
Pokédex-style card with a Pokéball catch animation on first visit, cycling role typewriter, base stat bars, move set, domain expertise badges, and trainer ID card. Fully responsive — on mobile the name and role overlay the profile photo.

### Work (`/work/*`)
Individual case study pages for Acquaa, BCBSA, Roombees, and Transition Discoveries.

### Gym (`/gym`)
A top-down RPG game where visitors walk their character around a gym floor, battle trainers, answer design-knowledge quizzes, and collect badges. Includes starter Pokémon selection, D-pad controls, sound toggle, and badge celebration modals.

### Visitor Gallery
A sign-in wall where visitors can leave their name and it persists in the gallery.

### Easter Eggs
Hidden Pokémon interactions scattered across the site (Bellsprout bush, Gengar cave, Charizard, Psyduck).

---

## Fonts

- **Press Start 2P** — pixel/game UI labels
- **Space Mono** — values and body text

Loaded via `next/font/google` in `layout.tsx`.

---

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` triggers an automatic deploy.

```bash
npm run build   # verify build passes locally before pushing
```
