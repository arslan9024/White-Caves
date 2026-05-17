import { describe, it, expect } from 'vitest';
import {
  getInternalModuleArchitecture,
  INTERNAL_MODULE_ARCHITECTURE,
} from './internalModuleArchitecture';

describe('internalModuleArchitecture', () => {
  it('contains linda and henry architecture definitions', () => {
    expect(INTERNAL_MODULE_ARCHITECTURE.linda.moduleId).toBe('linda-whatsapp-core');
    expect(INTERNAL_MODULE_ARCHITECTURE.henry.moduleId).toBe('henry-records-core');
  });

  it('returns architecture by assistant id', () => {
    const linda = getInternalModuleArchitecture('linda');
    const henry = getInternalModuleArchitecture('henry');

    expect(linda?.assistantId).toBe('linda');
    expect(henry?.assistantId).toBe('henry');
  });

  it('returns null for unknown assistant id', () => {
    expect(getInternalModuleArchitecture('mira')).toBeNull();
  });
});
