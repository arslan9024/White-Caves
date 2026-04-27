import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// ── Mock Dependencies ──────────────────────────────────────────────────

vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() }),
}));

// Mock useDebouncedValue to return value immediately
vi.mock('../../../../hooks/useDebouncedValue', () => ({
  useDebouncedValue: (value: any) => value,
}));

// ── Mock Redux ─────────────────────────────────────────────────────────

const mockDispatch = vi.fn().mockReturnValue(Promise.resolve());
const mockLeadsState: any[] = [
  { id: 'lead001', name: 'Acme Corporation', type: 'commercial', size: 'large', status: 'qualified', budget: 150000, value: 150000, stage: 'proposal', owner: 'Clara', email: 'contact@acme.com', phone: '+971-50-1234567', lastContact: '2024-01-05', notes: 'Enterprise deal', score: 75, probability: 75, deals: 3, tasks: 2, nextAction: 'Follow up', source: 'referral', tags: ['enterprise'] },
  { id: 'lead002', name: 'TechStart Inc', type: 'tech', size: 'small', status: 'contacted', budget: 50000, value: 50000, stage: 'discovery', owner: 'Sophia', email: 'info@techstart.com', phone: '+971-55-9876543', lastContact: '2024-01-06', notes: 'Startup interest', score: 45, probability: 45, deals: 1, tasks: 1, nextAction: 'Demo', source: 'website', tags: ['startup'] },
  { id: 'lead003', name: 'Global Industries Ltd', type: 'industrial', size: 'large', status: 'qualified', budget: 300000, value: 300000, stage: 'negotiation', owner: 'Clara', email: 'buy@global.com', phone: '+971-52-5555555', lastContact: '2024-01-04', notes: 'Multi-unit client', score: 85, probability: 85, deals: 5, tasks: 3, nextAction: 'Contract', source: 'direct', tags: ['multi-unit'] },
  { id: 'lead004', name: 'Sunshine Residences', type: 'residential', size: 'medium', status: 'interested', budget: 30000, value: 30000, stage: 'initial_contact', owner: 'Daisy', email: 'hello@sunshine.ae', phone: '+971-56-1111111', lastContact: '2024-01-07', notes: 'New inquiry', score: 30, probability: 30, deals: 0, tasks: 1, nextAction: 'Call', source: 'portal', tags: [] },
  { id: 'lead005', name: 'Premium Partners', type: 'commercial', size: 'large', status: 'qualified', budget: 200000, value: 200000, stage: 'contract_review', owner: 'Clara', email: 'deals@premium.com', phone: '+971-52-9999999', lastContact: '2024-01-03', notes: 'Reviewing contract', score: 92, probability: 92, deals: 2, tasks: 4, nextAction: 'Sign', source: 'referral', tags: ['vip'] },
];

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => {
    // Call the selector with a mock root state
    return selector({
      crmData: {
        leads: {
          items: mockLeadsState,
          loading: false,
          error: null,
        },
      },
    });
  },
}));

vi.mock('../../../../store/crmDataSlice', () => ({
  fetchLeadsFromAPI: vi.fn((args: any) => ({ type: 'crmData/fetchLeads', payload: args })),
  createLeadAPI: vi.fn((args: any) => ({ type: 'crmData/createLead', payload: args })),
  updateLeadAPI: vi.fn((args: any) => ({ type: 'crmData/updateLead', payload: args })),
  deleteLeadAPI: vi.fn((args: any) => ({ type: 'crmData/deleteLead', payload: args })),
  selectAllLeads: (state: any) => state.crmData?.leads?.items || [],
  selectLeadsLoading: (state: any) => state.crmData?.leads?.loading || false,
  selectLeadsError: (state: any) => state.crmData?.leads?.error || null,
}));

vi.mock('../../../../store/store', () => ({
  // AppDispatch type doesn't need runtime value
}));

import { useLeadsData } from './useLeadsData';

describe('useLeadsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('returns leads mapped from Redux state', () => {
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.leads.length).toBe(5);
      expect(result.current.leads[0].name).toBe('Acme Corporation');
    });

    it('dispatches fetchLeadsFromAPI on mount', () => {
      renderHook(() => useLeadsData());
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'crmData/fetchLeads' }),
      );
    });

    it('exposes loading state from Redux', () => {
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.loading).toBe(false);
    });

    it('exposes error state from Redux', () => {
      const { result } = renderHook(() => useLeadsData());
      expect(result.current.error).toBe(null);
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
    it('dispatches createLeadAPI when adding a lead', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.addLead({ name: 'New Corp', value: 75000, status: 'new', stage: 'initial_contact', email: 'new@corp.com' });
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'crmData/createLead' }),
      );
    });

    it('addLead returns optimistic placeholder', () => {
      const { result } = renderHook(() => useLeadsData());
      let newLead: any;
      act(() => {
        newLead = result.current.addLead({ name: 'New Corp', value: 75000, status: 'new', stage: 'initial_contact' });
      });
      expect(newLead.name).toBe('New Corp');
      expect(newLead.probability).toBe(25); // default
      expect(newLead.deals).toBe(0);
    });

    it('dispatches updateLeadAPI when updating a lead', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.updateLead('lead001', { value: 999999, status: 'closed_won' });
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'crmData/updateLead' }),
      );
    });

    it('dispatches deleteLeadAPI when deleting a lead', () => {
      const { result } = renderHook(() => useLeadsData());
      act(() => {
        result.current.deleteLead('lead003');
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'crmData/deleteLead' }),
      );
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
  });

  describe('refresh', () => {
    it('exposes a refresh function that dispatches fetchLeadsFromAPI', () => {
      const { result } = renderHook(() => useLeadsData());
      mockDispatch.mockClear();
      act(() => {
        result.current.refresh();
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'crmData/fetchLeads' }),
      );
    });
  });
});
