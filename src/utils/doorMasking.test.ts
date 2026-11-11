/**
 * doorMasking.test.ts
 * Vitest suite for AEG-017 Unit Door Masking Utility
 */

import { describe, it, expect } from 'vitest';
import { maskUnitDoor } from './doorMasking';

describe('AEG-017 Unit Door Masking Security Control', () => {
  it('masks standalone apartment and unit numbers for public views', () => {
    expect(maskUnitDoor('Unit 402')).toBe('Unit 4**');
    expect(maskUnitDoor('Apt 1204')).toBe('Apt 12**');
    expect(maskUnitDoor('Suite 1801-A')).toBe('Suite 180***');
  });

  it('masks villas and townhouses preserving prefix but hiding exact address', () => {
    expect(maskUnitDoor('Villa 42')).toBe('Villa 4*');
    expect(maskUnitDoor('Villa B-12')).toBe('Villa B-**');
    expect(maskUnitDoor('Townhouse 104')).toBe('Townhouse 1**');
    expect(maskUnitDoor('Plot 8892')).toBe('Plot 88**');
  });

  it('handles fallback standalone numeric or alphanumeric IDs', () => {
    expect(maskUnitDoor('402')).toBe('4**');
    expect(maskUnitDoor('1204B')).toBe('12***');
    expect(maskUnitDoor('')).toBe('Unit Private');
    expect(maskUnitDoor(null)).toBe('Unit Private');
  });

  it('reveals exact unit numbers when BOTH NDA and Passport verification are validated', () => {
    const verifiedOptions = { isNdaSigned: true, isPassportVerified: true };
    expect(maskUnitDoor('Unit 402', verifiedOptions)).toBe('Unit 402');
    expect(maskUnitDoor('Villa B-12', verifiedOptions)).toBe('Villa B-12');
  });

  it('remains masked if only one of NDA or Passport verification is met', () => {
    expect(maskUnitDoor('Unit 402', { isNdaSigned: true, isPassportVerified: false })).toBe('Unit 4**');
    expect(maskUnitDoor('Unit 402', { isNdaSigned: false, isPassportVerified: true })).toBe('Unit 4**');
  });
});
