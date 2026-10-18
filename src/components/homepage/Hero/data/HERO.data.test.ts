import { describe, expect, it } from 'vitest';
import { HERO_COPY, HERO_DEVELOPERS, HERO_MARKET_AREAS, HERO_STATS } from './HERO.data';

describe('hero data', () => {
  it('provides equivalent English and Arabic copy keys', () => {
    expect(Object.keys(HERO_COPY.ar).sort()).toEqual(Object.keys(HERO_COPY.en).sort());
    expect(Object.values(HERO_COPY.en).every(value => value.length > 0)).toBe(true);
    expect(Object.values(HERO_COPY.ar).every(value => value.length > 0)).toBe(true);
  });

  it('keeps every stat and market area label in both locale dictionaries', () => {
    const copyKeys = new Set(Object.keys(HERO_COPY.en));
    const requiredKeys = [
      ...HERO_STATS.flatMap(({ label, sublabel }) => [label, sublabel]),
      ...HERO_MARKET_AREAS.map(({ label }) => label),
    ];

    expect(requiredKeys.every(key => copyKeys.has(key))).toBe(true);
    expect(new Set(HERO_DEVELOPERS).size).toBe(HERO_DEVELOPERS.length);
  });
});
