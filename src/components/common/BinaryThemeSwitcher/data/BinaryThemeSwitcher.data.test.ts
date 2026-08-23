import { describe, it, expect } from 'vitest';
import { THEME_OPTIONS } from './BinaryThemeSwitcher.data';

describe('BinaryThemeSwitcher.data', () => {
  it('contains light, dark, and system theme options', () => {
    expect(THEME_OPTIONS).toHaveLength(3);
    const modes = THEME_OPTIONS.map(o => o.mode);
    expect(modes).toContain('light');
    expect(modes).toContain('dark');
    expect(modes).toContain('system');
  });

  it('has valid labels, icons, and accessible aria-labels for all options', () => {
    THEME_OPTIONS.forEach(opt => {
      expect(opt.label).toBeTruthy();
      expect(opt.icon).toBeTruthy();
      expect(opt.ariaLabel).toBeTruthy();
      expect(opt.ariaLabel.toLowerCase()).toContain('switch to');
    });
  });
});
