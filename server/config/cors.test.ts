import { describe, expect, it } from 'vitest';
import { buildAllowedCorsOrigins, isCorsOriginAllowed } from './cors.js';

describe('cors config helpers', () => {
  it('adds common localhost origins outside production', () => {
    expect(buildAllowedCorsOrigins(['http://localhost:5000'], 'development')).toEqual(
      expect.arrayContaining([
        'http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
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

  it('allows localhost origins on dynamic ports outside production', () => {
    expect(
      isCorsOriginAllowed(
        'http://127.0.0.1:4173',
        ['https://white-caves.com'],
        'https://whitecaves.com',
        'development'
      )
    ).toBe(true);
  });

  it('allows the Vercel production alias and named tunnel origins statically', () => {
    expect(isCorsOriginAllowed('https://white-caves.vercel.app', [], null, 'production')).toBe(
      true
    );
    expect(isCorsOriginAllowed('https://api.whitecaves.com', [], null, 'production')).toBe(true);
  });

  it('allows Cloudflare quick tunnel origins over https', () => {
    expect(
      isCorsOriginAllowed('https://brave-fox-random.trycloudflare.com', [], null, 'production')
    ).toBe(true);
    expect(
      isCorsOriginAllowed('http://brave-fox-random.trycloudflare.com', [], null, 'production')
    ).toBe(false);
  });

  it('allows only this project account Vercel preview deployments', () => {
    expect(
      isCorsOriginAllowed(
        'https://white-caves-git-main-arslan-maliks-projects.vercel.app',
        [],
        null,
        'production'
      )
    ).toBe(true);
    expect(isCorsOriginAllowed('https://evil.vercel.app', [], null, 'production')).toBe(false);
    expect(
      isCorsOriginAllowed(
        'https://evil-arslan-maliks-projects.vercel.app.evil.com',
        [],
        null,
        'production'
      )
    ).toBe(false);
  });
});
