/**
 * LeadsService — Unit Tests
 * Validates production service behavior with mocked Prisma adapter.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lead: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

vi.mock('../database', () => ({
  prisma: mockPrisma,
}));

import { LeadsService } from './LeadsService.js';
import leadsServiceDefault from './LeadsService.js';

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LeadsService();
  });

  it('default export is a singleton instance', () => {
    expect(leadsServiceDefault).toBeInstanceOf(LeadsService);
  });

  describe('getAllLeads', () => {
    it('queries with filters and returns leads', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([{ id: 'l1', name: 'John' }]);
      const result = await service.getAllLeads({ status: 'new', source: 'website' });

      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'new', source: 'website' },
        }),
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('getLeadById', () => {
    it('returns lead details when found', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: '507f1f77bcf86cd799439011', name: 'Lead A' });
      const result = await service.getLeadById('507f1f77bcf86cd799439011');
      expect(result?.name).toBe('Lead A');
    });
  });

  describe('createLead', () => {
    it('creates sanitized lead payload', async () => {
      mockPrisma.lead.create.mockResolvedValueOnce({ id: 'l2', name: 'John' });
      const result = await service.createLead({
        name: ' John ',
        email: 'John@Example.com ',
        notes: '<script>alert(1)</script>',
      });

      expect(mockPrisma.lead.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'John',
            email: 'john@example.com',
            source: 'direct',
            status: 'new',
          }),
        }),
      );
      expect(result?.id).toBe('l2');
    });

    it('throws when lead name is missing', async () => {
      await expect(service.createLead({ name: '   ' })).rejects.toThrow('Lead name is required');
    });
  });

  describe('updateLead', () => {
    it('returns null when lead not found', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce(null);
      const result = await service.updateLead('missing', { status: 'qualified' });
      expect(result).toBeNull();
    });

    it('updates lead when found', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: 'l1' });
      mockPrisma.lead.update.mockResolvedValueOnce({ id: 'l1', status: 'qualified' });

      const result = await service.updateLead('l1', { status: 'qualified' });
      expect(mockPrisma.lead.update).toHaveBeenCalled();
      expect(result?.status).toBe('qualified');
    });
  });

  describe('deleteLead', () => {
    it('returns false when lead does not exist', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce(null);
      const result = await service.deleteLead('missing');
      expect(result).toBe(false);
    });

    it('deletes lead and returns true', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: 'l1' });
      mockPrisma.lead.delete.mockResolvedValueOnce({ id: 'l1' });
      const result = await service.deleteLead('l1');
      expect(mockPrisma.lead.delete).toHaveBeenCalledWith({ where: { id: 'l1' } });
      expect(result).toBe(true);
    });
  });

  describe('convertLeadToClient', () => {
    it('updates lead status to won', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({ id: 'l1' });
      mockPrisma.lead.update.mockResolvedValueOnce({ id: 'l1', status: 'won' });

      const result = await service.convertLeadToClient('l1');
      expect(mockPrisma.lead.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'l1' },
          data: { status: 'won' },
        }),
      );
      expect(result?.status).toBe('won');
    });
  });

  describe('getLeadStatistics', () => {
    it('returns total and grouped stats', async () => {
      mockPrisma.lead.count.mockResolvedValueOnce(4);
      mockPrisma.lead.groupBy
        .mockResolvedValueOnce([
          { status: 'new', _count: { _all: 3 } },
          { status: 'won', _count: { _all: 1 } },
        ])
        .mockResolvedValueOnce([
          { source: 'website', _count: { _all: 2 } },
          { source: 'direct', _count: { _all: 2 } },
        ]);

      const result = await service.getLeadStatistics();
      expect(result.total).toBe(4);
      expect(result.byStatus.new).toBe(3);
      expect(result.bySource.website).toBe(2);
    });
  });
});
