import { describe, it, expect } from 'vitest';
import {
  maskPhoneNumber,
  maskEmail,
  maskEmiratesId,
  maskIban,
  redactPiiFromObject,
} from './piiMasker';

describe('piiMasker Utilities', () => {
  describe('maskPhoneNumber', () => {
    it('masks phone numbers keeping country code and last 4 digits', () => {
      expect(maskPhoneNumber('+971505760056')).toBe('+971 *** 0056');
      expect(maskPhoneNumber('0501234567')).toBe('0501 *** 4567');
      expect(maskPhoneNumber('')).toBe('');
      expect(maskPhoneNumber(null)).toBe('');
    });
  });

  describe('maskEmail', () => {
    it('masks email username and retains domain', () => {
      expect(maskEmail('arslanmalikgoraha@gmail.com')).toBe('a***a@gmail.com');
      expect(maskEmail('client@whitecaves.ae')).toBe('c***t@whitecaves.ae');
      expect(maskEmail('hi@dubai.com')).toBe('h*@dubai.com');
      expect(maskEmail('')).toBe('');
    });
  });

  describe('maskEmiratesId', () => {
    it('masks 15-digit UAE Emirates ID', () => {
      expect(maskEmiratesId('784-1990-1234567-1')).toBe('784-****-******67-1');
      expect(maskEmiratesId('784199012345671')).toBe('784-****-******67-1');
      expect(maskEmiratesId('invalid')).toBe('784-****-*****-*');
    });
  });

  describe('maskIban', () => {
    it('masks UAE IBAN format', () => {
      expect(maskIban('AE070331234567890123456')).toBe('AE07 **** **** **** 3456');
      expect(maskIban('')).toBe('');
    });
  });

  describe('redactPiiFromObject', () => {
    it('redacts sensitive keys recursively while preserving safe keys', () => {
      const payload = {
        userId: 'u-123',
        name: 'Arslan Malik',
        email: 'arslan@whitecaves.ae',
        authToken: 'secret-bearer-token-123',
        details: {
          emiratesId: '784-1990-1234567-1',
          creditCard: '4111-2222-3333-4444',
          city: 'Dubai',
        },
        transactions: [
          { iban: 'AE070331234567890123456', amount: 5000000 },
        ],
      };

      const redacted = redactPiiFromObject(payload) as any;

      expect(redacted.userId).toBe('u-123');
      expect(redacted.name).toBe('Arslan Malik');
      expect(redacted.authToken).toBe('[REDACTED_PII]');
      expect(redacted.details.emiratesId).toBe('[REDACTED_PII]');
      expect(redacted.details.creditCard).toBe('[REDACTED_PII]');
      expect(redacted.details.city).toBe('Dubai');
      expect(redacted.transactions[0].iban).toBe('[REDACTED_PII]');
      expect(redacted.transactions[0].amount).toBe(5000000);
    });
  });
});
