import { describe, expect, it } from 'vitest';
import { buildAllowedCorsOrigins, isCorsOriginAllowed } from './cors';

describe('cors config helpers', () => {
  it('adds common localhost origins outside production', () => {
    expect(buildAllowedCorsOrigins(['http://localhost:5000'], 'development')).toEqual(
      expect.arrayContaining([
        'http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5173',
      ])
    );
  });

  it('keeps production origins strict', () => {
    expect(buildAllowedCorsOrigins(['https://white-caves.com'], 'production')).toEqual([
      'https://white-caves.com',
    ]);
  });

  it('allows configured origins', () => {
    expect(isCorsOriginAllowed('https://white-caves.com', ['https://white-caves.com'], null)).toBe(
      true
    );
  });

  it('allows requests coming from the same host even when env config is stale', () => {
    expect(
      isCorsOriginAllowed(
        'https://whitecaves.com',
        ['https://white-caves.com'],
        'https://whitecaves.com'
      )
    ).toBe(true);
  });

  it('rejects unrelated third-party origins', () => {
    expect(
      isCorsOriginAllowed(
        'https://evil.example',
        ['https://white-caves.com'],
        'https://whitecaves.com'
      )
    ).toBe(false);
  });
});
