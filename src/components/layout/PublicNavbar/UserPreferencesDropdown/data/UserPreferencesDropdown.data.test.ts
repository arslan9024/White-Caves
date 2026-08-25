import { describe, it, expect } from 'vitest';
import { PREFERENCE_LABELS, THEME_ITEMS } from './UserPreferencesDropdown.data';

describe('UserPreferencesDropdown.data', () => {
  it('exports preference labels and theme items', () => {
    expect(PREFERENCE_LABELS.themeTitle).toBe('Theme Mode');
    expect(PREFERENCE_LABELS.languageTitle).toBe('Language');
    expect(PREFERENCE_LABELS.currencyTitle).toBe('Currency');
    expect(THEME_ITEMS.length).toBe(3);
  });
});
