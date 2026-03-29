/**
 * Leads Service — Tests
 * Tests LeadsService class methods, interfaces, and return contracts.
 * Service currently returns stub data — tests validate method signatures and shapes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock database (prisma) before importing service
vi.mock('../database', () => ({
  prisma: {},
}));

import { LeadsService } from './LeadsService';
import leadsServiceDefault from './LeadsService';

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(() => {
    service = new LeadsService();
  });

  // ─── Instantiation ────────────────────────────────────────────────
  describe('instantiation', () => {
    it('creates a new instance', () => {
      const svc = new LeadsService();
      expect(svc).toBeInstanceOf(LeadsService);
    });

    it('default export is a singleton instance', () => {
      expect(leadsServiceDefault).toBeInstanceOf(LeadsService);
    });

    it('all 7 methods are available', () => {
      expect(typeof service.getAllLeads).toBe('function');
      expect(typeof service.getLeadById).toBe('function');
      expect(typeof service.createLead).toBe('function');
      expect(typeof service.updateLead).toBe('function');
      expect(typeof service.deleteLead).toBe('function');
      expect(typeof service.convertLeadToClient).toBe('function');
      expect(typeof service.getLeadStatistics).toBe('function');
    });
  });

  // ─── getAllLeads ──────────────────────────────────────────────────
  describe('getAllLeads', () => {
    it('returns an array', async () => {
      const result = await service.getAllLeads();
      expect(Array.isArray(result)).toBe(true);
    });

    it('accepts optional filters', async () => {
      const result = await service.getAllLeads({ status: 'active' });
      expect(Array.isArray(result)).toBe(true);
    });

    it('accepts source filter', async () => {
      const result = await service.getAllLeads({ source: 'website' });
      expect(Array.isArray(result)).toBe(true);
    });

    it('accepts combined filters', async () => {
      const result = await service.getAllLeads({ status: 'active', source: 'referral' });
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty array for no matches (stub)', async () => {
      const result = await service.getAllLeads();
      expect(result).toEqual([]);
    });
  });

  // ─── getLeadById ─────────────────────────────────────────────────
  describe('getLeadById', () => {
    it('accepts an id parameter', async () => {
      const result = await service.getLeadById('507f1f77bcf86cd799439011');
      // Stub returns null
      expect(result).toBeNull();
    });

    it('returns null for non-existent lead (stub)', async () => {
      const result = await service.getLeadById('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  // ─── createLead ───────────────────────────────────────────────────
  describe('createLead', () => {
    it('accepts lead data object', async () => {
      const result = await service.createLead({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+971501234567',
        source: 'website',
      });
      // Stub returns null
      expect(result).toBeNull();
    });

    it('works with minimal required data', async () => {
      const result = await service.createLead({ name: 'Test Lead' });
      expect(result).toBeNull();
    });

    it('accepts all optional fields', async () => {
      const result = await service.createLead({
        name: 'Full Lead',
        email: 'lead@test.com',
        phone: '+971501111111',
        source: 'referral',
        status: 'new',
        propertyId: '507f1f77bcf86cd799439011',
        notes: 'Interested in Dubai Marina apartments',
      });
      expect(result).toBeNull();
    });
  });

  // ─── updateLead ───────────────────────────────────────────────────
  describe('updateLead', () => {
    it('accepts id and update data', async () => {
      const result = await service.updateLead('507f1f77bcf86cd799439011', {
        name: 'Updated Name',
      });
      expect(result).toBeNull();
    });

    it('accepts partial updates', async () => {
      const result = await service.updateLead('id123', { status: 'contacted' });
      expect(result).toBeNull();
    });

    it('accepts assignedToId in updates', async () => {
      const result = await service.updateLead('id123', {
        assignedToId: '507f1f77bcf86cd799439011',
      });
      expect(result).toBeNull();
    });
  });

  // ─── deleteLead ───────────────────────────────────────────────────
  describe('deleteLead', () => {
    it('accepts an id and returns boolean', async () => {
      const result = await service.deleteLead('507f1f77bcf86cd799439011');
      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });
  });

  // ─── convertLeadToClient ─────────────────────────────────────────
  describe('convertLeadToClient', () => {
    it('accepts a lead id', async () => {
      const result = await service.convertLeadToClient('507f1f77bcf86cd799439011');
      // Stub returns null
      expect(result).toBeNull();
    });
  });

  // ─── getLeadStatistics ───────────────────────────────────────────
  describe('getLeadStatistics', () => {
    it('returns statistics object', async () => {
      const result = await service.getLeadStatistics();
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('byStatus');
      expect(result).toHaveProperty('bySource');
    });

    it('total is a number', async () => {
      const { total } = await service.getLeadStatistics();
      expect(typeof total).toBe('number');
    });

    it('byStatus is an object', async () => {
      const { byStatus } = await service.getLeadStatistics();
      expect(typeof byStatus).toBe('object');
    });

    it('bySource is an object', async () => {
      const { bySource } = await service.getLeadStatistics();
      expect(typeof bySource).toBe('object');
    });
  });
});
