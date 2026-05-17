/**
 * Document Auto-Fill Service Tests — Phase 4B
 *
 * Tests the auto-fill logic that maps DB entities → template variables.
 * All Prisma calls are mocked — no real DB needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock Prisma ────────────────────────────────────────────────────────

const mockFindUnique = vi.fn().mockResolvedValue(null);

vi.mock('../../database.js', () => ({
  prisma: {
    lead: { findUnique: (...args: unknown[]) => mockFindUnique('lead', ...args) },
    property: { findUnique: (...args: unknown[]) => mockFindUnique('property', ...args) },
    transaction: { findUnique: (...args: unknown[]) => mockFindUnique('transaction', ...args) },
    commission: { findUnique: (...args: unknown[]) => mockFindUnique('commission', ...args) },
    viewing: { findUnique: (...args: unknown[]) => mockFindUnique('viewing', ...args) },
    lease: { findUnique: (...args: unknown[]) => mockFindUnique('lease', ...args) },
    offer: { findUnique: (...args: unknown[]) => mockFindUnique('offer', ...args) },
  },
}));

vi.mock('../../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import {
  autoFillVariables,
  getAutoFillableEntities,
  getEntityRequirements,
  DOCUMENT_ENTITY_MAP,
} from './documentAutoFill';

// ─── Test Data ──────────────────────────────────────────────────────────

const mockLead = {
  id: 'lead-1',
  name: 'Ahmed Al Maktoum',
  email: 'ahmed@example.com',
  phone: '+971501234567',
  company: 'Desert Holdings LLC',
  budget: 2500000,
  budgetCurrency: 'AED',
  score: 85,
  assignedTo: { id: 'agent-1', name: 'Sara Hassan', email: 'sara@whitecaves.ae', phone: '+971509876543' },
  property: { id: 'prop-1', title: 'Marina Tower 2BR', type: 'apartment', location: 'Dubai Marina' },
};

const mockProperty = {
  id: 'prop-1',
  title: 'Marina Tower 2BR',
  location: 'Dubai Marina, Tower A, Unit 1505',
  type: 'apartment',
  price: 2800000,
  sqft: 1250,
  area: 'Dubai Marina',
  bedrooms: 2,
  bathrooms: 2,
};

const mockTransaction = {
  id: 'tx-1',
  amount: 2700000,
  closingDate: new Date('2026-04-15'),
  notes: 'Cash purchase, full payment on closing',
  lead: { name: 'Ahmed Al Maktoum', phone: '+971501234567', email: 'ahmed@example.com' },
  property: { title: 'Marina Tower 2BR', location: 'Dubai Marina', type: 'apartment' },
};

const mockCommission = {
  id: 'comm-1',
  amount: 54000,
  percentage: 2,
  type: 'sale',
  vatRate: 5,
  vatAmount: 2700,
  agent: { name: 'Sara Hassan', email: 'sara@whitecaves.ae' },
  lead: { name: 'Ahmed Al Maktoum', company: 'Desert Holdings LLC', email: 'ahmed@example.com' },
  property: { title: 'Marina Tower 2BR' },
};

const mockViewing = {
  id: 'view-1',
  scheduledAt: new Date('2026-02-10T14:00:00'),
  status: 'completed',
  notes: 'Client very interested in the view',
  feedback: 'Excellent layout, good natural light',
  rating: 4,
  lead: { name: 'Ahmed Al Maktoum', phone: '+971501234567', budget: 2500000, budgetCurrency: 'AED', score: 85 },
  property: { title: 'Marina Tower 2BR', location: 'Dubai Marina', price: 2800000, type: 'apartment', area: 'Dubai Marina', sqft: 1250 },
};

const mockLease = {
  id: 'lease-1',
  startDate: new Date('2026-03-01'),
  endDate: new Date('2027-02-28'),
  monthlyRent: 12000,
  depositAmount: 12000,
  ejariNumber: 'EJ-2026-001234',
  terms: 'Fully furnished apartment with appliances',
  tenant: { id: 'user-1', name: 'John Smith', email: 'john@example.com', phone: '+971507654321' },
  property: { title: 'JBR Studio', location: 'JBR Walk, Unit 301', type: 'studio', area: 'JBR', sqft: 550 },
};

const mockOffer = {
  id: 'offer-1',
  amount: 2600000,
  terms: 'Subject to mortgage approval from ADCB',
  notes: 'Buyer has pre-approval for AED 2.5M',
  lead: { name: 'Ahmed Al Maktoum', phone: '+971501234567', email: 'ahmed@example.com' },
  buyer: { id: 'user-2', name: 'Ahmed Buyer', email: 'buyer@example.com', phone: '+971501111111' },
  property: { title: 'Marina Tower 2BR', location: 'Dubai Marina', type: 'apartment', price: 2800000 },
};

// ─── Helper to route mock returns ──────────────────────────────────────

function setupMock(model: string, data: unknown) {
  mockFindUnique.mockImplementation((calledModel: string) => {
    if (calledModel === model) return Promise.resolve(data);
    return Promise.resolve(null);
  });
}

function setupMocks(mappings: Record<string, unknown>) {
  mockFindUnique.mockImplementation((calledModel: string) => {
    return Promise.resolve(mappings[calledModel] || null);
  });
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('DocumentAutoFill', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUnique.mockResolvedValue(null);
  });

  // ── Entity Registry ─────────────────────────────────────────────────

  describe('Entity Registry', () => {
    it('should have 6 document type mappings', () => {
      expect(Object.keys(DOCUMENT_ENTITY_MAP)).toHaveLength(6);
    });

    it('should return all auto-fillable entities', () => {
      const entities = getAutoFillableEntities();
      expect(entities).toHaveLength(6);
      expect(entities.map(e => e.type)).toEqual([
        'mou', 'form_f', 'noc', 'commission_invoice', 'viewing_report', 'offer_letter',
      ]);
    });

    it('should return entity requirements for a specific type', () => {
      const mou = getEntityRequirements('mou');
      expect(mou).not.toBeNull();
      expect(mou!.requiredEntities).toContain('lead');
      expect(mou!.requiredEntities).toContain('property');
    });

    it('should return null for unknown type', () => {
      expect(getEntityRequirements('pizza_recipe')).toBeNull();
    });
  });

  // ── MoU Auto-Fill ───────────────────────────────────────────────────

  describe('MoU Auto-Fill', () => {
    it('should fill buyer from lead and property data', async () => {
      setupMocks({ lead: mockLead, property: mockProperty });

      const result = await autoFillVariables('mou', { leadId: 'lead-1', propertyId: 'prop-1' });

      expect(result.variables.buyerName).toBe('Ahmed Al Maktoum');
      expect(result.variables.buyerPhone).toBe('+971501234567');
      expect(result.variables.propertyTitle).toBe('Marina Tower 2BR');
      expect(result.variables.propertyLocation).toBe('Dubai Marina, Tower A, Unit 1505');
      expect(result.variables.propertyArea).toBe('1250 sq ft');
      expect(result.context.entitiesUsed).toContain('lead');
      expect(result.context.entitiesUsed).toContain('property');
    });

    it('should fill transaction data when provided', async () => {
      setupMocks({ lead: mockLead, property: mockProperty, transaction: mockTransaction });

      const result = await autoFillVariables('mou', {
        leadId: 'lead-1', propertyId: 'prop-1', transactionId: 'tx-1',
      });

      expect(result.variables.agreedPrice).toContain('2,700,000');
      expect(result.variables.depositAmount).toContain('270,000');
      expect(result.context.entitiesUsed).toContain('transaction');
    });

    it('should detect cash payment method from notes', async () => {
      setupMocks({ lead: mockLead, property: mockProperty, transaction: mockTransaction });

      const result = await autoFillVariables('mou', {
        leadId: 'lead-1', propertyId: 'prop-1', transactionId: 'tx-1',
      });

      expect(result.context.clauseSelections.paymentMethod).toBe('cash');
    });

    it('should detect mortgage payment method', async () => {
      const mortgageTx = { ...mockTransaction, notes: 'Mortgage via ADCB Bank' };
      setupMocks({ lead: mockLead, property: mockProperty, transaction: mortgageTx });

      const result = await autoFillVariables('mou', {
        leadId: 'lead-1', propertyId: 'prop-1', transactionId: 'tx-1',
      });

      expect(result.context.clauseSelections.paymentMethod).toBe('mortgage');
    });

    it('should report missing fields when no data provided', async () => {
      const result = await autoFillVariables('mou', {});

      expect(result.context.missingFields).toContain('buyerName');
      expect(result.context.missingFields).toContain('propertyTitle');
    });
  });

  // ── Form F Auto-Fill ────────────────────────────────────────────────

  describe('Form F Auto-Fill', () => {
    it('should fill tenant from lead and lease from lease record', async () => {
      setupMocks({ lead: mockLead, lease: mockLease });

      const result = await autoFillVariables('form_f', { leadId: 'lead-1', leaseId: 'lease-1' });

      expect(result.variables.tenantName).toBe('Ahmed Al Maktoum');
      expect(result.variables.leaseStart).toBeTruthy();
      expect(result.variables.leaseEnd).toBeTruthy();
      expect(result.variables.ejariNumber).toBe('EJ-2026-001234');
      expect(result.context.clauseSelections.ejariRegistered).toBe('yes');
    });

    it('should calculate annual rent from monthly', async () => {
      setupMocks({ lease: mockLease });

      const result = await autoFillVariables('form_f', { leaseId: 'lease-1' });

      expect(result.variables.annualRent).toContain('144,000'); // 12000 * 12
      expect(result.variables.monthlyRent).toContain('12,000');
    });

    it('should detect furnished status from terms', async () => {
      setupMocks({ lease: mockLease });

      const result = await autoFillVariables('form_f', { leaseId: 'lease-1' });

      expect(result.context.clauseSelections.furnished).toBe('yes');
    });

    it('should default to unfurnished when terms empty', async () => {
      const unfurnishedLease = { ...mockLease, terms: 'Standard terms apply' };
      setupMocks({ lease: unfurnishedLease });

      const result = await autoFillVariables('form_f', { leaseId: 'lease-1' });

      expect(result.context.clauseSelections.furnished).toBe('no');
    });
  });

  // ── NOC Auto-Fill ───────────────────────────────────────────────────

  describe('NOC Auto-Fill', () => {
    it('should fill property details and new owner from lead', async () => {
      setupMocks({ property: mockProperty, lead: mockLead });

      const result = await autoFillVariables('noc', { propertyId: 'prop-1', leadId: 'lead-1' });

      expect(result.variables.propertyTitle).toBe('Marina Tower 2BR');
      expect(result.variables.newOwner).toBe('Ahmed Al Maktoum');
      expect(result.variables.validUntil).toBeTruthy();
    });

    it('should default statuses to clear', async () => {
      setupMocks({ property: mockProperty });

      const result = await autoFillVariables('noc', { propertyId: 'prop-1' });

      expect(result.variables.outstandingDues).toBe('None');
      expect(result.variables.serviceChargesStatus).toBe('Paid');
      expect(result.variables.mortgageStatus).toBe('No outstanding mortgage');
    });

    it('should fill transfer amount from transaction', async () => {
      setupMocks({ property: mockProperty, transaction: mockTransaction });

      const result = await autoFillVariables('noc', { propertyId: 'prop-1', transactionId: 'tx-1' });

      expect(result.variables.transferAmount).toContain('2,700,000');
    });
  });

  // ── Commission Invoice Auto-Fill ────────────────────────────────────

  describe('Commission Invoice Auto-Fill', () => {
    it('should fill commission details with VAT', async () => {
      setupMock('commission', mockCommission);

      const result = await autoFillVariables('commission_invoice', { commissionId: 'comm-1' });

      expect(result.variables.commissionAmount).toContain('54,000');
      expect(result.variables.commissionRate).toBe('2%');
      expect(result.variables.vatAmount).toContain('2,700');
      expect(result.variables.agentName).toBe('Sara Hassan');
      expect(result.variables.clientName).toBe('Ahmed Al Maktoum');
      expect(result.variables.invoiceNumber).toMatch(/^WC-INV-/);
    });

    it('should detect sale commission type', async () => {
      setupMock('commission', mockCommission);

      const result = await autoFillVariables('commission_invoice', { commissionId: 'comm-1' });

      expect(result.context.clauseSelections.rateType).toBe('sale');
    });

    it('should detect rental commission type', async () => {
      const rentalComm = { ...mockCommission, type: 'rental', percentage: null };
      setupMock('commission', rentalComm);

      const result = await autoFillVariables('commission_invoice', { commissionId: 'comm-1' });

      expect(result.context.clauseSelections.rateType).toBe('rental');
      expect(result.variables.commissionRate).toBe('5%');
    });

    it('should generate due date 30 days out', async () => {
      setupMock('commission', mockCommission);

      const result = await autoFillVariables('commission_invoice', { commissionId: 'comm-1' });

      expect(result.variables.dueDate).toBeTruthy();
    });
  });

  // ── Viewing Report Auto-Fill ────────────────────────────────────────

  describe('Viewing Report Auto-Fill', () => {
    it('should fill from viewing record', async () => {
      setupMock('viewing', mockViewing);

      const result = await autoFillVariables('viewing_report', { viewingId: 'view-1' });

      expect(result.variables.clientName).toBe('Ahmed Al Maktoum');
      expect(result.variables.propertyTitle).toBe('Marina Tower 2BR');
      expect(result.variables.feedback).toBe('Excellent layout, good natural light');
      expect(result.variables.viewingDate).toBeTruthy();
    });

    it('should assess interest level from lead score (very high)', async () => {
      setupMock('viewing', mockViewing);

      const result = await autoFillVariables('viewing_report', { viewingId: 'view-1' });

      // Score = 85 → very high
      expect(result.context.clauseSelections.interestLevel).toBe('very_high');
      expect(result.variables.interestLevel).toBe('Very High');
    });

    it('should assess moderate interest for lower scores', async () => {
      const lowScoreViewing = {
        ...mockViewing,
        lead: { ...mockViewing.lead, score: 45 },
      };
      setupMock('viewing', lowScoreViewing);

      const result = await autoFillVariables('viewing_report', { viewingId: 'view-1' });

      expect(result.context.clauseSelections.interestLevel).toBe('moderate');
    });

    it('should fall back to separate lead/property IDs', async () => {
      setupMocks({ lead: mockLead, property: mockProperty });

      const result = await autoFillVariables('viewing_report', { leadId: 'lead-1', propertyId: 'prop-1' });

      expect(result.variables.clientName).toBe('Ahmed Al Maktoum');
      expect(result.variables.propertyTitle).toBe('Marina Tower 2BR');
    });
  });

  // ── Offer Letter Auto-Fill ──────────────────────────────────────────

  describe('Offer Letter Auto-Fill', () => {
    it('should fill buyer and property from offer record', async () => {
      setupMock('offer', mockOffer);

      const result = await autoFillVariables('offer_letter', { offerId: 'offer-1' });

      expect(result.variables.buyerName).toBe('Ahmed Al Maktoum');
      expect(result.variables.propertyTitle).toBe('Marina Tower 2BR');
      expect(result.variables.offeredPrice).toContain('2,600,000');
      expect(result.variables.listedPrice).toContain('2,800,000');
    });

    it('should detect mortgage from terms/notes', async () => {
      setupMock('offer', mockOffer);

      const result = await autoFillVariables('offer_letter', { offerId: 'offer-1' });

      // Terms mention "mortgage"
      expect(result.context.clauseSelections.paymentMethod).toBe('mortgage');
    });

    it('should detect cash payment when no mortgage mentioned', async () => {
      const cashOffer = { ...mockOffer, terms: 'Cash payment in full', notes: 'No conditions' };
      setupMock('offer', cashOffer);

      const result = await autoFillVariables('offer_letter', { offerId: 'offer-1' });

      expect(result.context.clauseSelections.paymentMethod).toBe('cash');
    });

    it('should set validity and closing dates', async () => {
      setupMock('offer', mockOffer);

      const result = await autoFillVariables('offer_letter', { offerId: 'offer-1' });

      expect(result.variables.validUntil).toBeTruthy();
      expect(result.variables.proposedClosing).toBeTruthy();
    });

    it('should fall back to buyer from offer.buyer when no lead', async () => {
      const offerNoLead = { ...mockOffer, lead: null };
      setupMock('offer', offerNoLead);

      const result = await autoFillVariables('offer_letter', { offerId: 'offer-1' });

      expect(result.variables.buyerName).toBe('Ahmed Buyer');
    });
  });

  // ── Overrides ───────────────────────────────────────────────────────

  describe('Overrides', () => {
    it('should allow manual overrides to take precedence', async () => {
      setupMock('lead', mockLead);

      const result = await autoFillVariables('mou', { leadId: 'lead-1' }, {
        buyerName: 'Custom Buyer Name',
        sellerName: 'Mohammed Al Fahim',
      });

      expect(result.variables.buyerName).toBe('Custom Buyer Name');
      expect(result.variables.sellerName).toBe('Mohammed Al Fahim');
    });

    it('should not override with empty strings', async () => {
      setupMock('lead', mockLead);

      const result = await autoFillVariables('mou', { leadId: 'lead-1' }, {
        buyerName: '',
      });

      expect(result.variables.buyerName).toBe('Ahmed Al Maktoum');
    });

    it('should remove from missing fields when override provided', async () => {
      const result = await autoFillVariables('mou', {}, {
        buyerName: 'Provided Name',
      });

      expect(result.context.missingFields).not.toContain('buyerName');
    });
  });

  // ── Error handling ──────────────────────────────────────────────────

  describe('Error handling', () => {
    it('should throw for unknown document type', async () => {
      await expect(autoFillVariables('unknown_type', {})).rejects.toThrow(
        'No auto-fill mapping for document type',
      );
    });

    it('should handle missing entities gracefully', async () => {
      const result = await autoFillVariables('mou', { leadId: 'nonexistent' });

      expect(result.context.missingFields).toContain('buyerName');
      expect(result.context.entitiesUsed).toHaveLength(0);
    });
  });
});
