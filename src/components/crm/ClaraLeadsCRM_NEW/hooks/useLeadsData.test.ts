import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock dependencies
vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() }),
}));

const mockSetJSON = vi.fn();
const mockGetJSON = vi.fn().mockReturnValue(null);
vi.mock('../../../../utils/safeStorage', () => ({
  safeStorage: {
    getJSON: (...args: any[]) => mockGetJSON(...args),
    setJSON: (...args: any[]) => mockSetJSON(...args),
  },
}));

// Mock useDebouncedValue to return value immediately
vi.mock('../../../../hooks/useDebouncedValue', () => ({
  useDebouncedValue: (value: any) => value,
}));

import { useLeadsData } from './useLeadsData';

describe('useLeadsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetJSON.mockReturnValue(null);
  });

  describe('initialization', () => {
    it('initializes with default INITIAL_LEADS when storage is empty', () => {
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.leads.length).toBe(5);
      expect(result.current.leads[0].name).toBe('Acme Corporation');
    });

    it('initializes from localStorage when stored data exists', () => {
      mockGetJSON.mockReturnValue([
        { id: 'stored1', name: 'Stored Lead', value: 100, probability: 50, status: 'qualified', stage: 'proposal' },
      ]);
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.leads.length).toBe(1);
      expect(result.current.leads[0].name).toBe('Stored Lead');
    });

    it('persists leads to storage on change', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.addLead({ name: 'New Lead', value: 1000, status: 'new', stage: 'discovery' });
      });
      // With debounce mocked to pass-through, setJSON is called
      expect(mockSetJSON).toHaveBeenCalledWith('clara_leads_data', expect.any(Array));
    });
  });

  describe('filters', () => {
    it('defaults to "all" for status and stage filters', () => {
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.filterStatus).toBe('all');
      expect(result.current.filterStage).toBe('all');
    });

    it('filters leads by status', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.setFilterStatus('qualified');
      });
      // Initial data has 3 qualified leads: Acme, Global Industries, Premium Partners
      expect(result.current.filteredLeads.every(l => l.status === 'qualified')).toBe(true);
      expect(result.current.filteredLeads.length).toBe(3);
    });

    it('filters leads by stage', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.setFilterStage('proposal');
      });
      expect(result.current.filteredLeads.every(l => l.stage === 'proposal')).toBe(true);
      expect(result.current.filteredLeads.length).toBe(1);
    });

    it('combines status and stage filters', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.setFilterStatus('qualified');
        result.current.setFilterStage('negotiation');
      });
      expect(result.current.filteredLeads.length).toBe(1);
      expect(result.current.filteredLeads[0].name).toBe('Global Industries Ltd');
    });

    it('filters by search query', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.setSearchQuery('techstart');
      });
      expect(result.current.filteredLeads.length).toBe(1);
      expect(result.current.filteredLeads[0].name).toBe('TechStart Inc');
    });

    it('searches by email', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.setSearchQuery('contact@acme');
      });
      expect(result.current.filteredLeads.length).toBe(1);
      expect(result.current.filteredLeads[0].id).toBe('lead001');
    });

    it('returns all leads when search is empty', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.setSearchQuery('');
      });
      expect(result.current.filteredLeads.length).toBe(5);
    });
  });

  describe('sorting', () => {
    it('defaults to sort by lastContact desc', () => {
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.sortBy).toBe('lastContact');
      expect(result.current.sortOrder).toBe('desc');
    });

    it('sorts by value ascending', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.setSortBy('value');
        result.current.setSortOrder('asc');
      });
      const values = result.current.filteredLeads.map(l => l.value);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
      }
    });

    it('sorts by value descending', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.setSortBy('value');
        result.current.setSortOrder('desc');
      });
      const values = result.current.filteredLeads.map(l => l.value);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeLessThanOrEqual(values[i - 1]);
      }
    });

    it('sorts by name ascending', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.setSortBy('name');
        result.current.setSortOrder('asc');
      });
      const names = result.current.filteredLeads.map(l => l.name);
      for (let i = 1; i < names.length; i++) {
        expect(names[i] >= names[i - 1]).toBe(true);
      }
    });
  });

  describe('CRUD operations', () => {
    it('adds a new lead', () => {
      const { result } = renderHook(() => useLeadsData());
      let newLead: any;
      act(() => {
        newLead = result.current.addLead({ name: 'New Corp', value: 75000, status: 'new', stage: 'initial_contact', email: 'new@corp.com' });
      });
      expect(result.current.leads.length).toBe(6);
      expect(newLead.name).toBe('New Corp');
      expect(newLead.probability).toBe(25); // default
      expect(newLead.deals).toBe(0); // default
    });

    it('updates an existing lead', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.updateLead('lead001', { value: 999999, status: 'closed_won' });
      });
      const updated = result.current.leads.find(l => l.id === 'lead001')!;
      expect(updated.value).toBe(999999);
      expect(updated.status).toBe('closed_won');
      expect(updated.name).toBe('Acme Corporation'); // unchanged
    });

    it('deletes a lead', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.deleteLead('lead003');
      });
      expect(result.current.leads.length).toBe(4);
      expect(result.current.leads.find(l => l.id === 'lead003')).toBeUndefined();
    });
  });

  describe('statistics', () => {
    it('computes totalLeads', () => {
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.stats.totalLeads).toBe(5);
    });

    it('computes qualifiedLeads', () => {
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.stats.qualifiedLeads).toBe(3);
    });

    it('computes totalValue', () => {
      const { result } = renderHook(() => useLeadsData());
      // 150000 + 50000 + 300000 + 30000 + 200000 = 730000
      expect(result.current.stats.totalValue).toBe(730000);
    });

    it('computes avgProbability', () => {
      const { result } = renderHook(() => useLeadsData());
      // (75 + 45 + 85 + 30 + 92) / 5 = 65.4 → rounded = 65
      expect(result.current.stats.avgProbability).toBe(65);
    });

    it('computes stage counts', () => {
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.stats.stageCounts.proposal).toBe(1);
      expect(result.current.stats.stageCounts.discovery).toBe(1);
      expect(result.current.stats.stageCounts.negotiation).toBe(1);
      expect(result.current.stats.stageCounts.initial_contact).toBe(1);
      expect(result.current.stats.stageCounts.contract_review).toBe(1);
    });

    it('updates stats after adding a lead', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.addLead({ name: 'Extra', value: 10000, status: 'qualified', stage: 'discovery' });
      });
      expect(result.current.stats.totalLeads).toBe(6);
      expect(result.current.stats.qualifiedLeads).toBe(4);
    });
  });
});
