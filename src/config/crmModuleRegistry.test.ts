import { describe, expect, it } from 'vitest';
import {
  CRM_MODULE_REGISTRY,
  getCRMModule,
  resolveCRMModules,
  SUPERUSER_CRM_MODULE_ORDER,
  CRM_HUB_MODULE_ORDER,
  MODERN_DASHBOARD_ASSISTANT_ORDER,
} from './crmModuleRegistry.js';

describe('crmModuleRegistry', () => {
  it('exports populated CRM_MODULE_REGISTRY', () => {
    expect(Object.keys(CRM_MODULE_REGISTRY).length).toBeGreaterThan(50);
    expect(CRM_MODULE_REGISTRY.overview).toBeDefined();
    expect(CRM_MODULE_REGISTRY.overview.zone).toBe('executive');
    expect(CRM_MODULE_REGISTRY.henry).toBeDefined();
    expect(CRM_MODULE_REGISTRY.apex).toBeDefined();
  });

  it('exports module order arrays', () => {
    expect(SUPERUSER_CRM_MODULE_ORDER.length).toBeGreaterThan(0);
    expect(CRM_HUB_MODULE_ORDER.length).toBeGreaterThan(0);
    expect(MODERN_DASHBOARD_ASSISTANT_ORDER.length).toBeGreaterThan(0);
  });

  it('resolves modules via getCRMModule correctly', () => {
    expect(getCRMModule('overview')?.id).toBe('overview');
    expect(getCRMModule('cassie')?.id).toBe('leads');
    expect(getCRMModule('journey-tenancy')?.id).toBe('journeys');
    expect(getCRMModule('nadia-broadcast')?.id).toBe('nadia');
    expect(getCRMModule(null)).toBeNull();
    expect(getCRMModule('nonexistent-id-xyz')).toBeNull();
  });

  it('resolves arrays of module IDs via resolveCRMModules', () => {
    const resolved = resolveCRMModules(['overview', 'nonexistent', 'henry']);
    expect(resolved.map(m => m.id)).toEqual(['overview', 'henry']);
  });
});
