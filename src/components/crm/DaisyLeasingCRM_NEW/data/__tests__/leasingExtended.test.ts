import { describe, it, expect } from 'vitest';
import { PDC_CHEQUES, RENEWAL_RECORDS } from '../leasingExtended';

describe('leasingExtended data module', () => {
  it('exports PDC_CHEQUES as an array', () => {
    expect(Array.isArray(PDC_CHEQUES)).toBe(true);
    expect(PDC_CHEQUES.length).toBeGreaterThan(0);
  });

  it('PDC_CHEQUES entries have required fields', () => {
    const cheque = PDC_CHEQUES[0];
    expect(cheque).toHaveProperty('id');
    expect(cheque).toHaveProperty('status');
    expect(cheque).toHaveProperty('chequeNumber');
  });

  it('exports RENEWAL_RECORDS as an array', () => {
    expect(Array.isArray(RENEWAL_RECORDS)).toBe(true);
  });
});
