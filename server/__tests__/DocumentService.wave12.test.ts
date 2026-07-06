import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    contract: { findUnique: vi.fn() },
    user: { findUnique: vi.fn() },
    commission: { findMany: vi.fn() },
    lead: { findMany: vi.fn() },
    property: { findMany: vi.fn() },
  },
}));

vi.mock('../database.js', () => ({
  prisma: mockPrisma,
}));

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { documentService } from '../services/DocumentService.js';

describe('DocumentService Wave 12', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates leads excel export buffer', async () => {
    mockPrisma.lead.findMany.mockResolvedValue([
      {
        id: 'lead-1',
        name: 'Lead One',
        email: 'lead@whitecaves.ae',
        phone: '+971500000000',
        status: 'new',
        source: 'website',
        budget: 1200000,
        score: 82,
        createdAt: new Date('2026-05-01T00:00:00.000Z'),
      },
    ]);

    const file = await documentService.generateLeadsExcel();

    expect(file.mimeType).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(file.filename).toContain('leads-report-');
    expect(file.buffer.length).toBeGreaterThan(0);
  });

  it('generates contract pdf export buffer', async () => {
    mockPrisma.contract.findUnique.mockResolvedValue({
      id: 'contract-1',
      contractNumber: 'WC-C-0001',
      title: 'Sample Contract',
      type: 'sale',
      status: 'active',
      value: 1000000,
      currency: 'AED',
      startDate: new Date('2026-05-01T00:00:00.000Z'),
      endDate: new Date('2027-05-01T00:00:00.000Z'),
      createdAt: new Date('2026-05-01T00:00:00.000Z'),
    });

    const file = await documentService.generateContractPdf('contract-1');

    expect(file.mimeType).toBe('application/pdf');
    expect(file.filename).toContain('contract-WC-C-0001.pdf');
    expect(file.buffer.length).toBeGreaterThan(0);
  });
});
