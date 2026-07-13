import { describe, it, expect } from 'vitest';
import { VATService, VATTransactionType } from './vatService.js';

describe('VATService', () => {
  it('should calculate 5% VAT for residential sales commission', () => {
    const result = VATService.calculateVAT(VATTransactionType.RESIDENTIAL_SALES_COMMISSION, 1000);
    expect(result.vatRate).toBe(5);
    expect(result.vatAmount).toBe(50);
    expect(result.totalAmount).toBe(1050);
    expect(result.isTaxable).toBe(true);
  });

  it('should calculate 0% VAT for long-term residential rent', () => {
    const result = VATService.calculateVAT(VATTransactionType.LONG_TERM_RESIDENTIAL_RENT_COMMISSION, 2000);
    expect(result.vatRate).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.totalAmount).toBe(2000);
    expect(result.isTaxable).toBe(false);
  });

  it('should calculate 0% VAT for DLD transfer fees (zero-rated)', () => {
    const result = VATService.calculateVAT(VATTransactionType.DLD_TRANSFER_FEE, 1000);
    expect(result.vatRate).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.totalAmount).toBe(1000);
    expect(result.isTaxable).toBe(true); // zero-rated is still taxable, just at 0%
  });

  describe('getTransactionType helper', () => {
    it('maps sales correctly', () => {
      expect(VATService.getTransactionType('sale')).toBe(VATTransactionType.RESIDENTIAL_SALES_COMMISSION);
    });

    it('maps long-term rentals correctly', () => {
      expect(VATService.getTransactionType('rental', true)).toBe(VATTransactionType.LONG_TERM_RESIDENTIAL_RENT_COMMISSION);
    });

    it('maps short-term rentals correctly', () => {
      expect(VATService.getTransactionType('rental', false)).toBe(VATTransactionType.SHORT_TERM_RENT_COMMISSION);
    });

    it('defaults unknown to residential sales commission', () => {
      expect(VATService.getTransactionType('unknown')).toBe(VATTransactionType.RESIDENTIAL_SALES_COMMISSION);
    });
  });
});
