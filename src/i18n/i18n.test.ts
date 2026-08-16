import { describe, it, expect, beforeEach } from 'vitest';
import { setLanguage, getCurrentLanguage, translate } from './index.js';

describe('i18n & RTL Module — Wave 45 (W45-001, W45-002, W45-003)', () => {
  beforeEach(() => {
    setLanguage('en');
  });

  it('defaults to English language', () => {
    expect(getCurrentLanguage()).toBe('en');
    expect(translate('common.welcome')).toBe('Welcome to White Caves Real Estate');
  });

  it('switches to Arabic and returns translated string', () => {
    const config = setLanguage('ar');
    expect(config.currentLanguage).toBe('ar');
    expect(config.isRtl).toBe(true);
    expect(translate('common.welcome')).toBe('مرحباً بكم في وايت كيفز لإدارة العقارات');
  });

  it('returns fallback keyPath if translation key missing', () => {
    expect(translate('non.existent.key')).toBe('non.existent.key');
  });
});
