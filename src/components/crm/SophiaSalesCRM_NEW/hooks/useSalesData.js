import { useState, useCallback } from 'react';
import { PIPELINE_STAGES, DEALS, AGENTS } from '../data/sales';
import { SOPHIA_SALES_FEATURES } from '../data/features';

export const useSalesData = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedStage, setSelectedStage] = useState(null);
  const [deals, setDeals] = useState(DEALS);
  const [agents, setAgents] = useState(AGENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAgent, setFilterAgent] = useState('all');

  const handleSelectStage = useCallback((stageId) => {
    setSelectedStage(stageId);
  }, []);

  const getDealsByStage = useCallback((stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  }, [deals]);

  const getTotalPipelineValue = useCallback(() => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  }, [deals]);

  const getAverageWinRate = useCallback(() => {
    const winRates = agents.map(a => a.conversion);
    return (winRates.reduce((a, b) => a + b, 0) / winRates.length).toFixed(1);
  }, [agents]);

  const getTotalDeals = useCallback(() => {
    return deals.length;
  }, [deals]);

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAgent = filterAgent === 'all' || deal.agent === filterAgent;
    return matchesSearch && matchesAgent;
  });

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
