import { STORAGE_KEYS } from './storageKeys';

export function startNewAdventure(): void {
  const hadBadge = localStorage.getItem('badge-a11y-earned') === 'true';

  // Wipe all gameplay keys
  STORAGE_KEYS.GAMEPLAY.forEach(key => {
    try { localStorage.removeItem(key); } catch {}
  });

  // Preserve badge state with a previous-run marker
  if (hadBadge) {
    try { localStorage.setItem('badge-a11y-earned', 'true'); } catch {}
    try { localStorage.setItem('badge-a11y-earned-in-previous-run', 'true'); } catch {}
  }

  // Signal PokemonWorld to open directly at starter selection (skip landing intro)
  try { sessionStorage.setItem('vr_new_adventure', '1'); } catch {}
  try { sessionStorage.removeItem('vr_intro_seen'); } catch {}

  // Let any mounted components (useStones, useStarter) know to clear their state
  window.dispatchEvent(new CustomEvent('gym-reset', { detail: { hadBadge } }));
}
