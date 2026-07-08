// ─────────────────────────────────────────────────────────────
// SPACING — 4px base unit scale
// ─────────────────────────────────────────────────────────────

export const spacing = {
  // Base unit is 4px
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};

// PRESET COMBINATIONS
export const spacingPresets = {
  // Card/container padding
  containerSmall: spacing[3], // 12px
  containerDefault: spacing[4], // 16px
  containerLarge: spacing[6], // 24px

  // Gap between items
  gapSmall: spacing[2], // 8px
  gapDefault: spacing[3], // 12px
  gapLarge: spacing[4], // 16px

  // Component internal spacing
  buttonPadding: `${spacing[2]} ${spacing[4]}`, // 8px 16px
  inputPadding: `${spacing[2]} ${spacing[3]}`, // 8px 12px
};
