import { describe, it, expect } from 'vitest';
import {
  PropertySchema,
  PropertyFilterSchema,
  WhatsAppMessageSchema,
  WhatsAppContactSchema,
  VatInvoiceSchema,
  PostDatedChequeSchema,
} from './index';

describe('Zod Validation Schemas', () => {
  describe('PropertySchema', () => {
    it('validates a valid luxury property object', () => {
      const validProp = {
        id: 'prop-001',
        title: 'Luxury Villa in Palm Jumeirah',
        community: 'Palm Jumeirah',
        developer: 'Nakheel',
        propertyType: 'Villa',
        priceAED: 18500000,
        beds: 5,
        baths: 6,
        sqft: 7500,
        status: 'Available',
        reraPermitNumber: 'TRAK-2026-9024',
      };

      const result = PropertySchema.safeParse(validProp);
      expect(result.success).toBe(true);
    });

    it('rejects an invalid property with negative price', () => {
      const invalidProp = {
        id: 'prop-002',
        title: 'Penthouse Marina',
        community: 'Dubai Marina',
        developer: 'Emaar',
        propertyType: 'Penthouse',
        priceAED: -500,
        beds: 3,
        baths: 3,
        sqft: 2500,
        status: 'Available',
        reraPermitNumber: 'TRAK-2026-1122',
      };

      const result = PropertySchema.safeParse(invalidProp);
      expect(result.success).toBe(false);
    });
  });

  describe('WhatsAppMessageSchema', () => {
    it('validates a Nina AI assistant message', () => {
      const validMsg = {
        id: 'msg-001',
        sender: 'nina',
        senderName: 'Nina AI (Executive)',
        text: 'Good morning Arslan, 4 high-yield leads were pre-screened.',
        timestamp: new Date().toISOString(),
        status: 'delivered',
        intent: 'EXECUTIVE_BRIEFING',
        leadScore: 95,
      };

      const result = WhatsAppMessageSchema.safeParse(validMsg);
      expect(result.success).toBe(true);
    });
  });

  describe('VatInvoiceSchema', () => {
    it('validates a UAE FTA 5% compliant VAT invoice', () => {
      const validInvoice = {
        invoiceNumber: 'INV-2026-0091',
        trn: '100987654321012',
        clientName: 'Al-Mansoor Investments LLC',
        propertyTitle: 'Downtown Tower Suite',
        issueDate: '2026-08-16',
        netAmountAED: 1000000,
        vatRatePct: 5,
        vatAmountAED: 50000,
        grossAmountAED: 1050000,
        paymentStatus: 'PAID',
      };

      const result = VatInvoiceSchema.safeParse(validInvoice);
      expect(result.success).toBe(true);
    });

    it('rejects invalid TRN format', () => {
      const badInvoice = {
        invoiceNumber: 'INV-2026-0091',
        trn: '99999', // Invalid
        clientName: 'Al-Mansoor Investments LLC',
        propertyTitle: 'Downtown Tower Suite',
        issueDate: '2026-08-16',
        netAmountAED: 1000000,
        vatRatePct: 5,
        vatAmountAED: 50000,
        grossAmountAED: 1050000,
        paymentStatus: 'PAID',
      };

      const result = VatInvoiceSchema.safeParse(badInvoice);
      expect(result.success).toBe(false);
    });
  });
});
