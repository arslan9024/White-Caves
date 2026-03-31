import { useState, useCallback, useMemo, useEffect } from 'react';
import { createLogger } from '../../../../utils/logger';
import { safeStorage } from '../../../../utils/safeStorage';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';

const log = createLogger('LeadsData');

const LEADS_STORAGE_KEY = 'clara_leads_data';

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
  lastContact: Date;
  notes: string;
  probability: number;
  deals: number;
  tasks: number;
  nextAction: string;
}

// Initial leads data
const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead001',
    name: 'Acme Corporation',
    type: 'commercial',
    size: 'enterprise',
    status: 'qualified',
    value: 150000,
    stage: 'proposal',
    owner: 'Clara AI',
    email: 'contact@acme.com',
    phone: '+1-555-0100',
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: 'Interested in premium services',
    probability: 75,
    deals: 3,
    tasks: 5,
    nextAction: 'Send proposal follow-up'
  },
  {
    id: 'lead002',
    name: 'TechStart Inc',
    type: 'startup',
    size: 'small',
    status: 'interested',
    value: 50000,
    stage: 'discovery',
    owner: 'Clara AI',
    email: 'info@techstart.io',
    phone: '+1-555-0101',
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    notes: 'Early-stage, high growth potential',
    probability: 45,
    deals: 1,
    tasks: 3,
    nextAction: 'Schedule discovery call'
  },
  {
    id: 'lead003',
    name: 'Global Industries Ltd',
    type: 'enterprise',
    size: 'enterprise',
    status: 'qualified',
    value: 300000,
    stage: 'negotiation',
    owner: 'Clara AI',
    email: 'sales@globalind.com',
    phone: '+1-555-0102',
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Multi-department rollout planned',
    probability: 85,
    deals: 5,
    tasks: 8,
    nextAction: 'Attend executive meeting'
  },
  {
    id: 'lead004',
    name: 'LocalBiz Services',
    type: 'sme',
    size: 'medium',
    status: 'contacted',
    value: 30000,
    stage: 'initial_contact',
    owner: 'Clara AI',
    email: 'hello@localbiz.com',
    phone: '+1-555-0103',
    lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    notes: 'Referred by existing customer',
    probability: 30,
    deals: 0,
    tasks: 2,
    nextAction: 'Send intro materials'
  },
  {
    id: 'lead005',
    name: 'Premium Partners',
    type: 'commercial',
    size: 'large',
    status: 'qualified',
    value: 200000,
    stage: 'contract_review',
    owner: 'Clara AI',
    email: 'procurement@premium.co',
    phone: '+1-555-0104',
    lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    notes: 'Final approval pending',
    probability: 92,
    deals: 4,
    tasks: 6,
    nextAction: 'Customer success onboarding setup'
  }
];

export function useLeadsData() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const stored = safeStorage.getJSON<Lead[]>(LEADS_STORAGE_KEY);
    return stored ?? INITIAL_LEADS;
  });

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('lastContact');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  // Debounced auto-persistence — avoids blocking the main thread on rapid mutations
  const debouncedLeads = useDebouncedValue(leads, 500);

  useEffect(() => {
    try {
      safeStorage.setJSON(LEADS_STORAGE_KEY, debouncedLeads);
    } catch (err) {
      log.error('Failed to persist leads:', err);
    }
  }, [debouncedLeads]);

  // Add new lead
  const addLead = useCallback((leadData: Partial<Lead>) => {
    const newLead = {
      id: `lead${Date.now()}`,
      ...leadData,
      lastContact: new Date(),
      deals: 0,
      tasks: 0,
      probability: 25
    } as Lead;
    setLeads(prev => [...prev, newLead]);
    return newLead;
  }, []);

  // Update existing lead
  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead =>
      lead.id === id ? { ...lead, ...updates } : lead
    ));
  }, []);

  // Delete lead
  const deleteLead = useCallback((id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  }, []);

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
    // Actions
    addLead,
    updateLead,
    deleteLead
  };
}
