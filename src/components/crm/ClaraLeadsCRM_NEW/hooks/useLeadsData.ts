import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLogger } from '../../../../utils/logger';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import {
  fetchLeadsFromAPI,
  createLeadAPI,
  updateLeadAPI,
  deleteLeadAPI,
  selectAllLeads,
  selectLeadsLoading,
  selectLeadsError,
} from '../../../../store/crmDataSlice';
import type { AppDispatch } from '../../../../store/store';

const log = createLogger('LeadsData');

export interface Lead {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  value: number;
  stage: string;
  owner: string;
  email: string;
  phone: string;
  lastContact: Date | string;
  notes: string;
  probability: number;
  deals: number;
  tasks: number;
  nextAction: string;
  // Backend fields
  source?: string;
  budget?: number;
  score?: number;
  tags?: string[];
  assignedToId?: string;
  assignedTo?: { id: string; name: string; email: string };
  createdAt?: string;
  updatedAt?: string;
}

// NOTE: Initial leads removed — data now fetched from API via Redux

export function useLeadsData() {
  const dispatch = useDispatch<AppDispatch>();

  // ── Redux State ──────────────────────────────────────────────────────
  const reduxLeads = useSelector(selectAllLeads);
  const loading = useSelector(selectLeadsLoading);
  const error = useSelector(selectLeadsError);

  // Map Redux CRMItem[] to Lead[] for backward compatibility with tabs
  const leads = useMemo<Lead[]>(() =>
    reduxLeads.map((item) => ({
      id: String(item.id),
      name: (item.name as string) || '',
      type: (item.type as string) || 'direct',
      size: (item.size as string) || 'medium',
      status: (item.status as string) || 'new',
      value: (item.budget as number) || (item.value as number) || 0,
      stage: (item.stage as string) || 'initial_contact',
      owner: (item.assignedTo as { name: string })?.name || (item.owner as string) || 'Unassigned',
      email: (item.email as string) || '',
      phone: (item.phone as string) || '',
      lastContact: item.lastContact ? new Date(item.lastContact as string) : new Date(),
      notes: (item.notes as string) || '',
      probability: (item.score as number) || (item.probability as number) || 0,
      deals: (item.deals as number) || 0,
      tasks: (item.tasks as number) || 0,
      nextAction: (item.nextAction as string) || '',
      source: (item.source as string) || 'direct',
      budget: (item.budget as number) || 0,
      score: (item.score as number) || 0,
      tags: (item.tags as string[]) || [],
      assignedToId: item.assignedToId as string | undefined,
      assignedTo: item.assignedTo as { id: string; name: string; email: string } | undefined,
      createdAt: item.createdAt as string | undefined,
      updatedAt: item.updatedAt as string | undefined,
    })),
    [reduxLeads],
  );

  // ── Filters ──────────────────────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('lastContact');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  // ── Fetch from API on mount ──────────────────────────────────────────
  useEffect(() => {
    log.info('Fetching leads from API');
    dispatch(fetchLeadsFromAPI({}));
  }, [dispatch]);

  // ── CRUD Actions (dispatch to API thunks) ────────────────────────────

  const addLead = useCallback((leadData: Partial<Lead>) => {
    log.info('Creating lead via API', { name: leadData.name });
    dispatch(createLeadAPI({
      name: leadData.name || '',
      email: leadData.email,
      phone: leadData.phone,
      status: leadData.status || 'new',
      source: leadData.source || leadData.type || 'direct',
      budget: leadData.value || leadData.budget,
      notes: leadData.notes,
      stage: leadData.stage,
    }));
    // Return a placeholder for immediate UI feedback
    return {
      id: `pending_${Date.now()}`,
      ...leadData,
      lastContact: new Date(),
      deals: 0,
      tasks: 0,
      probability: 25,
    } as Lead;
  }, [dispatch]);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    log.info('Updating lead via API', { id });
    dispatch(updateLeadAPI({ id, ...updates }));
  }, [dispatch]);

  const deleteLead = useCallback((id: string) => {
    log.info('Deleting lead via API', { id });
    dispatch(deleteLeadAPI(id));
  }, [dispatch]);

  // Debounce the search query to avoid excessive filtering on every keystroke
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  // Filtered and sorted leads
  const filteredLeads = useMemo(() => {
    let result = leads;

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(lead => lead.status === filterStatus);
    }

    // Apply stage filter
    if (filterStage !== 'all') {
      result = result.filter(lead => lead.stage === filterStage);
    }

    // Apply search (debounced)
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(lead =>
        (lead.name?.toLowerCase() || '').includes(query) ||
        (lead.email?.toLowerCase() || '').includes(query) ||
        (lead.phone || '').includes(query) ||
        (lead.notes?.toLowerCase() || '').includes(query)
      );
    }

    // Apply sort — always copy to avoid mutating the source array
    return [...result].sort((a, b) => {
      let aVal = a[sortBy as keyof Lead];
      let bVal = b[sortBy as keyof Lead];

      if (sortBy === 'lastContact' || sortBy === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [leads, filterStatus, filterStage, debouncedSearch, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => ({
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    totalValue: leads.reduce((sum, l) => sum + l.value, 0),
    avgProbability: leads.length > 0
      ? Math.round(leads.reduce((sum, l) => sum + l.probability, 0) / leads.length)
      : 0,
    stageCounts: {
      initial_contact: leads.filter(l => l.stage === 'initial_contact').length,
      discovery: leads.filter(l => l.stage === 'discovery').length,
      proposal: leads.filter(l => l.stage === 'proposal').length,
      negotiation: leads.filter(l => l.stage === 'negotiation').length,
      contract_review: leads.filter(l => l.stage === 'contract_review').length,
      closed_won: leads.filter(l => l.stage === 'closed_won').length,
      closed_lost: leads.filter(l => l.stage === 'closed_lost').length
    }
  }), [leads]);

  return {
    // Data
    leads,
    filteredLeads,
    stats,
    loading,
    error,
    // Filters
    filterStatus,
    setFilterStatus,
    filterStage,
    setFilterStage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    // Actions (now dispatch to API)
    addLead,
    updateLead,
    deleteLead,
    // Refresh from API
    refresh: () => dispatch(fetchLeadsFromAPI({})),
  };
}
