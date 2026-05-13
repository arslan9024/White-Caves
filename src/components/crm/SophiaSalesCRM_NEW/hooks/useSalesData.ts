import { useState, useCallback, useMemo, useEffect } from 'react';
import { PIPELINE_STAGES, Deal, Agent } from '../data/sales';
import { SOPHIA_SALES_FEATURES } from '../data/features';
import { authFetch } from '../../../../utils/authFetch';

// ─── API response shapes ────────────────────────────────────────────────────

interface LeadApiItem {
  id: string;
  name: string;
  budget?: number | null;
  status?: string | null;
  property?: { title?: string | null } | null;
  assignedTo?: { id: string; name: string } | null;
  updatedAt?: string | null;
}

interface UserApiItem {
  id: string;
  name: string;
  role?: string | null;
}

// Map Lead status → pipeline stage id
function statusToStage(status: string | null | undefined): string {
  switch (status) {
    case 'new':
    case 'cold':
      return 'new';
    case 'contacted':
    case 'warm':
      return 'qualified';
    case 'qualified':
      return 'viewing';
    case 'hot':
      return 'negotiation';
    case 'won':
      return 'closing';
    default:
      return 'new';
  }
}

// Probability % by stage
const STAGE_PROBABILITY: Record<string, number> = {
  new: 10,
  qualified: 35,
  viewing: 55,
  negotiation: 75,
  documentation: 90,
  closing: 97,
};

function mapLeadToDeal(lead: LeadApiItem, index: number): Deal {
  const stage = statusToStage(lead.status);
  const updatedMs = lead.updatedAt ? new Date(lead.updatedAt).getTime() : Date.now();
  const daysInStage = Math.max(0, Math.floor((Date.now() - updatedMs) / 86_400_000));
  return {
    id: index + 1,
    property: String(lead.property?.title ?? 'Dubai Property'),
    client: String(lead.name ?? 'Unknown Client'),
    value: Number(lead.budget ?? 0),
    stage,
    probability: STAGE_PROBABILITY[stage] ?? 10, // eslint-disable-line security/detect-object-injection
    agent: String(lead.assignedTo?.name ?? 'Unassigned'),
    daysInStage,
  };
}

function mapUserToAgent(user: UserApiItem, index: number): Agent {
  return {
    id: index + 1,
    name: String(user.name ?? ''),
    deals: 0,
    value: 'AED 0',
    conversion: 0,
    avatar: '👤',
  };
}

export const useSalesData = () => {
  const [activeTab, setActiveTab] = useState<string>('pipeline');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // true = loading on mount
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAgent, setFilterAgent] = useState<string>('all');

  // ─── Fetch live data ─────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const leadsPromise = authFetch('/api/leads?pageSize=50')
      .then((r: Response) => r.json() as Promise<{ data?: LeadApiItem[] }>)
      .catch(() => ({ data: [] as LeadApiItem[] }));

    const agentsPromise = authFetch('/api/users?role=AGENT&pageSize=20')
      .then((r: Response) => r.json() as Promise<{ data?: UserApiItem[] }>)
      .catch(() => ({ data: [] as UserApiItem[] }));

    Promise.all([leadsPromise, agentsPromise]).then(([leadsRes, agentsRes]) => {
      if (cancelled) return;
      const rawLeads: LeadApiItem[] = Array.isArray(leadsRes.data) ? leadsRes.data : [];
      const rawAgents: UserApiItem[] = Array.isArray(agentsRes.data) ? agentsRes.data : [];
      setDeals(rawLeads.map(mapLeadToDeal));
      setAgents(rawAgents.map(mapUserToAgent));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectStage = useCallback((stageId: string) => {
    setSelectedStage(stageId);
  }, []);

  const getDealsByStage = useCallback(
    (stageId: string) => {
      return deals.filter(deal => deal.stage === stageId);
    },
    [deals]
  );

  const getTotalPipelineValue = useCallback((): number => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  }, [deals]);

  const getAverageWinRate = useCallback((): string => {
    const winRates = agents.map(a => a.conversion);
    if (winRates.length === 0) return '0.0';
    return (winRates.reduce((a, b) => a + b, 0) / winRates.length).toFixed(1);
  }, [agents]);

  const getTotalDeals = useCallback((): number => {
    return deals.length;
  }, [deals]);

  const filteredDeals = useMemo(
    () =>
      deals.filter(deal => {
        const matchesSearch =
          deal.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAgent = filterAgent === 'all' || deal.agent === filterAgent;
        return matchesSearch && matchesAgent;
      }),
    [deals, searchQuery, filterAgent]
  );

  return {
    activeTab,
    setActiveTab,
    selectedStage,
    handleSelectStage,
    deals,
    agents,
    loading,
    searchQuery,
    setSearchQuery,
    filterAgent,
    setFilterAgent,
    getDealsByStage,
    getTotalPipelineValue,
    getAverageWinRate,
    getTotalDeals,
    filteredDeals,
    pipelineStages: PIPELINE_STAGES,
    features: SOPHIA_SALES_FEATURES,
  };
};
