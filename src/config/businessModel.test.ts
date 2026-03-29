import { describe, it, expect } from 'vitest';
import {
  BUSINESS_MODEL_CONFIG,
  getAssistantConfig,
  getRevenueStream,
  isOwnerOnlyFeature,
  type BusinessAssistantId,
} from './businessModel';

// ═══════════════════════════════════════════════════════════════════════
describe('config/businessModel', () => {
  // ── BUSINESS_MODEL_CONFIG structure ───────────────────────────────
  describe('BUSINESS_MODEL_CONFIG', () => {
    it('has top-level sections', () => {
      expect(BUSINESS_MODEL_CONFIG).toHaveProperty('company');
      expect(BUSINESS_MODEL_CONFIG).toHaveProperty('aiAssistantEcosystem');
      expect(BUSINESS_MODEL_CONFIG).toHaveProperty('featureMapping');
      expect(BUSINESS_MODEL_CONFIG).toHaveProperty('revenueStreams');
      expect(BUSINESS_MODEL_CONFIG).toHaveProperty('operationalMetrics');
      expect(BUSINESS_MODEL_CONFIG).toHaveProperty('accessControl');
    });

    it('company is White Caves Real Estate LLC', () => {
      expect(BUSINESS_MODEL_CONFIG.company.name).toBe('White Caves Real Estate LLC');
    });

    it('company HQ is in Dubai, UAE', () => {
      expect(BUSINESS_MODEL_CONFIG.company.headquarters.city).toBe('Dubai');
      expect(BUSINESS_MODEL_CONFIG.company.headquarters.country).toBe('UAE');
    });

    it('has 5 AI assistants', () => {
      expect(
        Object.keys(BUSINESS_MODEL_CONFIG.aiAssistantEcosystem.assistants).length,
      ).toBe(5);
    });

    it('has 4 feature mappings', () => {
      expect(Object.keys(BUSINESS_MODEL_CONFIG.featureMapping)).toHaveLength(4);
    });

    it('has at least 3 revenue streams', () => {
      expect(BUSINESS_MODEL_CONFIG.revenueStreams.length).toBeGreaterThanOrEqual(3);
    });

    it('access control has 3 tiers', () => {
      expect(BUSINESS_MODEL_CONFIG.accessControl.ownerExclusive.length).toBeGreaterThan(0);
      expect(BUSINESS_MODEL_CONFIG.accessControl.managerAccess.length).toBeGreaterThan(0);
      expect(BUSINESS_MODEL_CONFIG.accessControl.agentAccess.length).toBeGreaterThan(0);
    });

    it('conversion funnel values decrease monotonically', () => {
      const f = BUSINESS_MODEL_CONFIG.operationalMetrics.customerAcquisition.conversionFunnel;
      expect(f.inquiry).toBeGreaterThan(f.qualified);
      expect(f.qualified).toBeGreaterThan(f.viewing);
      expect(f.viewing).toBeGreaterThan(f.negotiation);
      expect(f.negotiation).toBeGreaterThan(f.closed);
    });
  });

  // ── getAssistantConfig ────────────────────────────────────────────
  describe('getAssistantConfig', () => {
    it.each(['nadia', 'mary', 'clara', 'nina', 'nancy'] as BusinessAssistantId[])(
      'returns config for "%s"',
      (id) => {
        const config = getAssistantConfig(id);
        expect(config).not.toBeNull();
        expect(config!.name).toBeTruthy();
        expect(config!.role).toBeTruthy();
        expect(config!.primaryFunction).toBeTruthy();
        expect(config!.kpis.length).toBeGreaterThan(0);
        expect(config!.integrations.length).toBeGreaterThan(0);
      },
    );

    it('returns null for unknown assistant', () => {
      expect(getAssistantConfig('unknown' as BusinessAssistantId)).toBeNull();
    });
  });

  // ── getRevenueStream ──────────────────────────────────────────────
  describe('getRevenueStream', () => {
    it('returns revenue stream by ID', () => {
      const stream = getRevenueStream('property_sales');
      expect(stream).not.toBeNull();
      expect(stream!.name).toContain('Sales');
      expect(stream!.aiSupport.length).toBeGreaterThan(0);
    });

    it('returns null for unknown ID', () => {
      expect(getRevenueStream('nonexistent')).toBeNull();
    });

    it.each(['property_sales', 'leasing', 'property_management', 'consulting'])(
      'finds revenue stream "%s"',
      (id) => {
        expect(getRevenueStream(id)).not.toBeNull();
      },
    );
  });

  // ── isOwnerOnlyFeature ────────────────────────────────────────────
  describe('isOwnerOnlyFeature', () => {
    it('returns true for owner-exclusive features', () => {
      expect(isOwnerOnlyFeature('AI Assistant Hub')).toBe(true);
      expect(isOwnerOnlyFeature('Financial Reports')).toBe(true);
      expect(isOwnerOnlyFeature('System Settings')).toBe(true);
    });

    it('returns false for non-exclusive features', () => {
      expect(isOwnerOnlyFeature('Property Catalog')).toBe(false);
      expect(isOwnerOnlyFeature('Random Feature')).toBe(false);
    });
  });
});
