import { useState, useCallback, useMemo } from 'react';
import { CAMPAIGNS, SOCIAL_STATS, LISTINGS, MARKET_INSIGHTS, MONITORED_SITES } from '../data/marketing';

export const useMarketingData = () => {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [socialStats] = useState(SOCIAL_STATS);
  const [listings, setListings] = useState(LISTINGS);
  const [monitoredSites, setMonitoredSites] = useState(MONITORED_SITES);
  const [marketInsights] = useState(MARKET_INSIGHTS);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterCampaignStatus, setFilterCampaignStatus] = useState('all');
  
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [oliviaActive, setOliviaActive] = useState(true);

  // Filter campaigns
  const filteredCampaigns = useCallback(() => {
    return campaigns.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterCampaignStatus === 'all' || c.status === filterCampaignStatus;
      const matchesPlatform = filterPlatform === 'all' || c.platform === filterPlatform;
      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [campaigns, searchQuery, filterCampaignStatus, filterPlatform]);

  // Calculate campaign stats
  const campaignStats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === 'active').length;
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
    return { total, active, totalBudget, totalSpent, totalLeads };
  }, [campaigns]);

  // Calculate social stats
  const socialMetrics = useMemo(() => {
    return {
      totalFollowers: socialStats.reduce((sum, s) => sum + s.followers, 0),
      avgEngagement: (socialStats.reduce((sum, s) => sum + s.engagement, 0) / socialStats.length).toFixed(1),
      totalPosts: socialStats.reduce((sum, s) => sum + s.posts, 0)
    };
  }, [socialStats]);

  // Calculate listing stats
  const listingStats = useMemo(() => {
    return {
      totalViews: listings.reduce((sum, l) => sum + l.views, 0),
      totalInquiries: listings.reduce((sum, l) => sum + l.inquiries, 0),
      avgQuality: (listings.reduce((sum, l) => sum + l.quality, 0) / listings.length).toFixed(0),
      availableListings: listings.filter(l => l.available > 0).length
    };
  }, [listings]);

  // Status badge helpers
  const getCampaignStatusBadge = (status) => {
    switch (status) {
      case 'active': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      case 'paused': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      case 'completed': return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
    }
  };

  const getSiteStatusColor = (status) => {
    return status === 'healthy' ? '#10b981' : status === 'degraded' ? '#f59e0b' : '#ef4444';
  };

  // CRUD operations
  const addCampaign = useCallback((newCampaign) => {
    const campaign = {
      id: campaigns.length + 1,
      ...newCampaign
    };
    setCampaigns([...campaigns, campaign]);
    return campaign;
  }, [campaigns]);

  const updateCampaign = useCallback((id, updates) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, ...updates } : c));
  }, [campaigns]);

  const deleteCampaign = useCallback((id) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  }, [campaigns]);

  const updateListing = useCallback((id, updates) => {
    setListings(listings.map(l => l.id === id ? { ...l, ...updates } : l));
  }, [listings]);

  return {
    // Data
    campaigns,
    socialStats,
    listings,
    monitoredSites,
    marketInsights,
    
    // Filtered data
    filteredCampaigns: filteredCampaigns(),
    
    // Stats
    campaignStats,
    socialMetrics,
    listingStats,
    
    // Search & Filter states
    searchQuery,
    setSearchQuery,
    filterPlatform,
    setFilterPlatform,
    filterCampaignStatus,
    setFilterCampaignStatus,
    
    // Selection states
    selectedCampaign,
    setSelectedCampaign,
    
    // Olivia activation state
    oliviaActive,
    setOliviaActive,
    
    // Helper functions
    getCampaignStatusBadge,
    getSiteStatusColor,
    
    // CRUD operations
    addCampaign,
    updateCampaign,
    deleteCampaign,
    updateListing
  };
};
