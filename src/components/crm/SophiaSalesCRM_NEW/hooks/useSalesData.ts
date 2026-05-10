import { useState, useCallback, useMemo } from 'react';
import { PIPELINE_STAGES, DEALS, AGENTS, Deal, Agent } from '../data/sales';
import { SOPHIA_SALES_FEATURES } from '../data/features';

export const useSalesData = () => {
  const [activeTab, setActiveTab] = useState<string>('pipeline');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>(DEALS);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAgent, setFilterAgent] = useState<string>('all');

  const handleSelectStage = useCallback((stageId: string) => {
    setSelectedStage(stageId);
  }, []);

  const getDealsByStage = useCallback((stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  }, [deals]);

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

  const filteredDeals = useMemo(() => deals.filter(deal => {
    const matchesSearch = deal.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAgent = filterAgent === 'all' || deal.agent === filterAgent;
    return matchesSearch && matchesAgent;
  }), [deals, searchQuery, filterAgent]);

  return {
    activeTab,
    setActiveTab,
    selectedStage,
    handleSelectStage,
    deals,
    agents,
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
    features: SOPHIA_SALES_FEATURES
  };
};
