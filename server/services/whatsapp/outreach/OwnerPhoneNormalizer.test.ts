import { describe, it, expect } from 'vitest';
import { normalizeOwnerPhone, candidateDigits } from './OwnerPhoneNormalizer';

describe('OwnerPhoneNormalizer', () => {
  it('normalizes local UAE mobile 050 123 4567 to 971501234567', () => {
    const res = normalizeOwnerPhone('050 123 4567');
    expect(res.ok).toBe(true);
    expect(res.digits).toBe('971501234567');
    expect(res.country).toBe('AE');
  });

  it('normalizes international UAE format +971-50-576-0056', () => {
    const res = normalizeOwnerPhone('+971-50-576-0056');
    expect(res.ok).toBe(true);
    expect(res.digits).toBe('971505760056');
  });

  it('rejects numbers marked with DO_NOT_CONTACT notes', () => {
    const res = normalizeOwnerPhone('0501234567 - No WhatsApp');
    expect(res.ok).toBe(false);
    expect(res.error).toBe('Marked as DO_NOT_CONTACT');
  });

  it('rejects UAE landline numbers', () => {
    const res = normalizeOwnerPhone('04 123 4567');
    expect(res.ok).toBe(false);
    expect(res.error).toContain('landline');
  });
});

