import { describe, it, expect } from 'vitest';
import {
  LEAD_STATUS,
  LEAD_STATUS_CONFIG,
  LEAD_PRIORITY,
  LEAD_PRIORITY_CONFIG,
  LEAD_SOURCE,
  LEAD_SOURCE_CONFIG,
  PROPERTY_STATUS,
  PROPERTY_STATUS_CONFIG,
  CONTRACT_STATUS,
  CONTRACT_STATUS_CONFIG,
  EJARI_STATUS,
  EJARI_STATUS_CONFIG,
  USER_STATUS,
  USER_STATUS_CONFIG,
  UAE_PASS_STATUS,
  UAE_PASS_STATUS_CONFIG,
  UAE_PASS_ROLE,
  UAE_PASS_ROLE_CONFIG,
  SYSTEM_STATUS,
  SYSTEM_STATUS_CONFIG,
  INTEGRATION_STATUS,
  INTEGRATION_STATUS_CONFIG,
  getStatusConfig,
} from './statusConfig';

// ═══════════════════════════════════════════════════════════════════════
describe('statusConfig', () => {
  // ── Status enums ──────────────────────────────────────────────────
  describe('status enums', () => {
    it('LEAD_STATUS has 7 values', () => {
      expect(Object.keys(LEAD_STATUS)).toHaveLength(7);
      expect(LEAD_STATUS.NEW).toBe('new');
      expect(LEAD_STATUS.WON).toBe('won');
      expect(LEAD_STATUS.LOST).toBe('lost');
    });

    it('LEAD_PRIORITY has 3 values', () => {
      expect(Object.keys(LEAD_PRIORITY)).toHaveLength(3);
      expect(LEAD_PRIORITY.HIGH).toBe('high');
      expect(LEAD_PRIORITY.MEDIUM).toBe('medium');
      expect(LEAD_PRIORITY.LOW).toBe('low');
    });

    it('LEAD_SOURCE has 6 values', () => {
      expect(Object.keys(LEAD_SOURCE)).toHaveLength(6);
    });

    it('PROPERTY_STATUS has 7 values', () => {
      expect(Object.keys(PROPERTY_STATUS)).toHaveLength(7);
      expect(PROPERTY_STATUS.AVAILABLE).toBe('available');
      expect(PROPERTY_STATUS.SOLD).toBe('sold');
      expect(PROPERTY_STATUS.RENTED).toBe('rented');
    });

    it('CONTRACT_STATUS has 5 values', () => {
      expect(Object.keys(CONTRACT_STATUS)).toHaveLength(5);
    });

    it('EJARI_STATUS has 2 values', () => {
      expect(Object.keys(EJARI_STATUS)).toHaveLength(2);
    });

    it('USER_STATUS has 3 values', () => {
      expect(Object.keys(USER_STATUS)).toHaveLength(3);
    });

    it('UAE_PASS_STATUS has 3 values', () => {
      expect(Object.keys(UAE_PASS_STATUS)).toHaveLength(3);
    });

    it('UAE_PASS_ROLE has 5 values', () => {
      expect(Object.keys(UAE_PASS_ROLE)).toHaveLength(5);
    });

    it('SYSTEM_STATUS has 3 values', () => {
      expect(Object.keys(SYSTEM_STATUS)).toHaveLength(3);
    });

    it('INTEGRATION_STATUS has 3 values', () => {
      expect(Object.keys(INTEGRATION_STATUS)).toHaveLength(3);
    });
  });

  // ── Config maps ───────────────────────────────────────────────────
  describe('config maps', () => {
    const configPairs = [
      { status: LEAD_STATUS, config: LEAD_STATUS_CONFIG, name: 'LEAD_STATUS' },
      { status: LEAD_PRIORITY, config: LEAD_PRIORITY_CONFIG, name: 'LEAD_PRIORITY' },
      { status: PROPERTY_STATUS, config: PROPERTY_STATUS_CONFIG, name: 'PROPERTY_STATUS' },
      { status: CONTRACT_STATUS, config: CONTRACT_STATUS_CONFIG, name: 'CONTRACT_STATUS' },
      { status: EJARI_STATUS, config: EJARI_STATUS_CONFIG, name: 'EJARI_STATUS' },
      { status: USER_STATUS, config: USER_STATUS_CONFIG, name: 'USER_STATUS' },
      { status: UAE_PASS_STATUS, config: UAE_PASS_STATUS_CONFIG, name: 'UAE_PASS_STATUS' },
      { status: SYSTEM_STATUS, config: SYSTEM_STATUS_CONFIG, name: 'SYSTEM_STATUS' },
      { status: INTEGRATION_STATUS, config: INTEGRATION_STATUS_CONFIG, name: 'INTEGRATION_STATUS' },
    ] as const;

    it.each(configPairs)(
      '$name config has entry for every status value',
      ({ status, config }) => {
        for (const value of Object.values(status)) {
          expect(config[value as string]).toBeDefined();
        }
      },
    );

    it.each(configPairs)(
      '$name config entries have label, color, and badgeVariant',
      ({ config }) => {
        for (const entry of Object.values(config)) {
          expect(typeof entry.label).toBe('string');
          expect(typeof entry.color).toBe('string');
          expect(typeof entry.badgeVariant).toBe('string');
        }
      },
    );

    it('LEAD_SOURCE_CONFIG entries have label and icon', () => {
      for (const value of Object.values(LEAD_SOURCE)) {
        const entry = LEAD_SOURCE_CONFIG[value];
        expect(entry).toBeDefined();
        expect(typeof entry.label).toBe('string');
        expect(typeof entry.icon).toBe('string');
      }
    });

    it('UAE_PASS_ROLE_CONFIG entries have label and color', () => {
      for (const value of Object.values(UAE_PASS_ROLE)) {
        const entry = UAE_PASS_ROLE_CONFIG[value];
        expect(entry).toBeDefined();
        expect(typeof entry.label).toBe('string');
        expect(typeof entry.color).toBe('string');
      }
    });
  });

  // ── getStatusConfig ───────────────────────────────────────────────
  describe('getStatusConfig', () => {
    it('returns config for known status', () => {
      const config = getStatusConfig(LEAD_STATUS_CONFIG, 'new');
      expect(config.label).toBe('New');
      expect(config.color).toBeTruthy();
      expect(config.badgeVariant).toBeTruthy();
    });

    it('returns fallback for unknown status', () => {
      const config = getStatusConfig(LEAD_STATUS_CONFIG, 'xyz_unknown');
      expect(config.label).toBe('xyz_unknown');
      expect(config.color).toBe('#6B7280');
      expect(config.badgeVariant).toBe('secondary');
    });

    it('returns custom fallback when provided', () => {
      const custom = { label: 'Custom', color: '#000', badgeVariant: 'info' as const };
      const config = getStatusConfig({}, 'missing', custom);
      expect(config).toEqual(custom);
    });

    it('works with all status config maps', () => {
      expect(getStatusConfig(PROPERTY_STATUS_CONFIG, 'available').label).toBe('Available');
      expect(getStatusConfig(CONTRACT_STATUS_CONFIG, 'active').label).toBe('Active');
      expect(getStatusConfig(SYSTEM_STATUS_CONFIG, 'healthy').label).toBe('Healthy');
    });
  });
});
