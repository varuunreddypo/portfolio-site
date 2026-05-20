// Source of truth for every localStorage key the app uses.
// When adding a new key anywhere, register it here first.

export const STORAGE_KEYS = {
  // Wiped when the user starts a new adventure
  GAMEPLAY: [
    'gym-seen',
    'gym-badges',
    'gym-steps',
    'collected-stones',
    'selected-starter',
    'vr_trainer_cards',
  ],

  // Survive a reset — badges earned and user preferences
  PERSISTENT: [
    'badge-a11y-earned',
    'badge-a11y-earned-in-previous-run',
    'sound-muted',
  ],
} as const;
