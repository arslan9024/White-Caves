/**
 * dubaiCoordinates — Unit Tests
 * Tests: coordinate lookup, jitter, coverage of all 15 Dubai communities
 */

import { describe, it, expect } from 'vitest';
import {
  DUBAI_CENTER,
  DEFAULT_ZOOM,
  COMMUNITY_COORDS,
  getCommunityCoords,
  jitterCoords,
} from './dubaiCoordinates';

describe('dubaiCoordinates', () => {
  // ── Constants ──────────────────────────────────────────────────

  describe('Constants', () => {
    it('should have DUBAI_CENTER as [lat, lng] in Dubai area', () => {
      expect(DUBAI_CENTER).toHaveLength(2);
      expect(DUBAI_CENTER[0]).toBeGreaterThan(24);
      expect(DUBAI_CENTER[0]).toBeLessThan(26);
      expect(DUBAI_CENTER[1]).toBeGreaterThan(54);
      expect(DUBAI_CENTER[1]).toBeLessThan(56);
    });

    it('should have reasonable DEFAULT_ZOOM', () => {
      expect(DEFAULT_ZOOM).toBeGreaterThanOrEqual(9);
      expect(DEFAULT_ZOOM).toBeLessThanOrEqual(14);
    });
  });

  // ── COMMUNITY_COORDS ──────────────────────────────────────────

  describe('COMMUNITY_COORDS', () => {
    it('should have 15 Dubai communities', () => {
      expect(COMMUNITY_COORDS).toHaveLength(15);
    });

    it('should have proper shape for each community', () => {
      COMMUNITY_COORDS.forEach((c) => {
        expect(c).toHaveProperty('name');
        expect(c).toHaveProperty('lat');
        expect(c).toHaveProperty('lng');
        expect(c).toHaveProperty('radius');
        expect(c).toHaveProperty('description');
        expect(typeof c.name).toBe('string');
        expect(typeof c.lat).toBe('number');
        expect(typeof c.lng).toBe('number');
        expect(c.radius).toBeGreaterThan(0);
        expect(c.description.length).toBeGreaterThan(10);
      });
    });

    it('should have all coordinates within Dubai metro area', () => {
      COMMUNITY_COORDS.forEach((c) => {
        expect(c.lat).toBeGreaterThan(24.9);
        expect(c.lat).toBeLessThan(25.4);
        expect(c.lng).toBeGreaterThan(54.9);
        expect(c.lng).toBeLessThan(55.5);
      });
    });

    it('should include major Dubai communities', () => {
      const names = COMMUNITY_COORDS.map((c) => c.name);
      expect(names).toContain('Palm Jumeirah');
      expect(names).toContain('Downtown Dubai');
      expect(names).toContain('Dubai Marina');
      expect(names).toContain('Business Bay');
      expect(names).toContain('JBR');
      expect(names).toContain('DIFC');
      expect(names).toContain('Emirates Hills');
      expect(names).toContain('Dubai Hills Estate');
      expect(names).toContain('Arabian Ranches');
    });

    it('should have unique names', () => {
      const names = COMMUNITY_COORDS.map((c) => c.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  // ── getCommunityCoords ─────────────────────────────────────────

  describe('getCommunityCoords', () => {
    it('should find community by exact name', () => {
      const result = getCommunityCoords('Palm Jumeirah');
      expect(result).toBeDefined();
      expect(result!.name).toBe('Palm Jumeirah');
    });

    it('should be case-insensitive', () => {
      const result = getCommunityCoords('palm jumeirah');
      expect(result).toBeDefined();
      expect(result!.name).toBe('Palm Jumeirah');
    });

    it('should return undefined for unknown location', () => {
      const result = getCommunityCoords('Nonexistent Location');
      expect(result).toBeUndefined();
    });

    it('should find all 15 communities', () => {
      COMMUNITY_COORDS.forEach((c) => {
        const result = getCommunityCoords(c.name);
        expect(result).toBeDefined();
        expect(result!.lat).toBe(c.lat);
        expect(result!.lng).toBe(c.lng);
      });
    });
  });

  // ── jitterCoords ───────────────────────────────────────────────

  describe('jitterCoords', () => {
    it('should return [lat, lng] tuple', () => {
      const result = jitterCoords(25.2, 55.3, 0);
      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('number');
      expect(typeof result[1]).toBe('number');
    });

    it('should produce slightly different coords from input', () => {
      // Index 0 has angle 0 so lng won't change; use index 1 for full offset
      const [jLat, jLng] = jitterCoords(25.2, 55.3, 1);
      // At least one coordinate should differ
      const latChanged = jLat !== 25.2;
      const lngChanged = jLng !== 55.3;
      expect(latChanged || lngChanged).toBe(true);
    });

    it('should keep jittered coords near the original', () => {
      for (let i = 0; i < 20; i++) {
        const [jLat, jLng] = jitterCoords(25.2, 55.3, i);
        expect(Math.abs(jLat - 25.2)).toBeLessThan(0.01); // ~1km
        expect(Math.abs(jLng - 55.3)).toBeLessThan(0.01);
      }
    });

    it('should produce different positions for different indices', () => {
      const pos0 = jitterCoords(25.2, 55.3, 0);
      const pos1 = jitterCoords(25.2, 55.3, 1);
      const pos2 = jitterCoords(25.2, 55.3, 2);
      expect(pos0).not.toEqual(pos1);
      expect(pos1).not.toEqual(pos2);
      expect(pos0).not.toEqual(pos2);
    });
  });
});
