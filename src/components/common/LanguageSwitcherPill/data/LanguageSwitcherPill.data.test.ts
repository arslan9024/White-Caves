import { describe, it, expect } from 'vitest';
import { LANGUAGE_PILL_TEXT } from './LanguageSwitcherPill.data';

describe('LanguageSwitcherPill.data', () => {
  it('exports valid accessibility aria-label text', () => {
    expect(LANGUAGE_PILL_TEXT).toBeDefined();
    expect(LANGUAGE_PILL_TEXT.ariaLabel).toBe('Select Language Mode');
  });
});
