import { useState, useCallback, useMemo } from 'react';

const LEADS_STORAGE_KEY = 'clara_leads_data';

// Initial leads data
const INITIAL_LEADS = [
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
  const [leads, setLeads] = useState(() => {
    try {
      const stored = localStorage.getItem(LEADS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastContact');
  const [sortOrder, setSortOrder] = useState('desc');

  // Persist leads to localStorage
  const persistLeads = useCallback((newLeads) => {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(newLeads));
    } catch (err) {
      console.error('Failed to persist leads:', err);
    }
  }, []);

  // Add new lead
  const addLead = useCallback((leadData) => {
    const newLead = {
      id: `lead${Date.now()}`,
      ...leadData,
      lastContact: new Date(),
      deals: 0,
      tasks: 0,
      probability: 25
    };
    const updated = [...leads, newLead];
    setLeads(updated);
    persistLeads(updated);
    return newLead;
  }, [leads, persistLeads]);

  // Update existing lead
  const updateLead = useCallback((id, updates) => {
    const updated = leads.map(lead =>
      lead.id === id ? { ...lead, ...updates } : lead
    );
    setLeads(updated);
    persistLeads(updated);
  }, [leads, persistLeads]);

  // Delete lead
  const deleteLead = useCallback((id) => {
    const updated = leads.filter(lead => lead.id !== id);
    setLeads(updated);
    persistLeads(updated);
  }, [leads, persistLeads]);

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

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead =>
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.notes.toLowerCase().includes(query)
      );
    }

    // Apply sort
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

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

    return result;
  }, [leads, filterStatus, filterStage, searchQuery, sortBy, sortOrder]);

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
