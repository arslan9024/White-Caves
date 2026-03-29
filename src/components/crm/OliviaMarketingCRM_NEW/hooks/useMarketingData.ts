import { useState, useCallback, useMemo } from 'react';
import { CAMPAIGNS, SOCIAL_STATS, LISTINGS, MARKET_INSIGHTS, MONITORED_SITES, Campaign, SocialStat, Listing, MonitoredSite } from '../data/marketing';

export const useMarketingData = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [socialStats] = useState<SocialStat[]>(SOCIAL_STATS);
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [monitoredSites, setMonitoredSites] = useState<MonitoredSite[]>(MONITORED_SITES);
  const [marketInsights] = useState(MARKET_INSIGHTS);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterCampaignStatus, setFilterCampaignStatus] = useState<string>('all');
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [oliviaActive, setOliviaActive] = useState<boolean>(true);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
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
    const count = socialStats.length;
    return {
      totalFollowers: socialStats.reduce((sum, s) => sum + s.followers, 0),
      avgEngagement: count > 0
        ? (socialStats.reduce((sum, s) => sum + s.engagement, 0) / count).toFixed(1)
        : '0.0',
      totalPosts: socialStats.reduce((sum, s) => sum + s.posts, 0)
    };
  }, [socialStats]);

  // Calculate listing stats
  const listingStats = useMemo(() => {
    const count = listings.length;
    return {
      totalViews: listings.reduce((sum, l) => sum + l.views, 0),
      totalInquiries: listings.reduce((sum, l) => sum + l.inquiries, 0),
      avgQuality: count > 0
        ? (listings.reduce((sum, l) => sum + l.quality, 0) / count).toFixed(0)
        : '0',
      availableListings: listings.filter(l => l.available > 0).length
    };
  }, [listings]);

  // Status badge helpers
  const getCampaignStatusBadge = (status: string): { bg: string; color: string } => {
    switch (status) {
      case 'active': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      case 'paused': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      case 'completed': return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
    }
  };

  const getSiteStatusColor = (status: string): string => {
    return status === 'healthy' ? '#10b981' : status === 'degraded' ? '#f59e0b' : '#ef4444';
  };

  // CRUD operations (using functional setState to prevent stale closures)
  const addCampaign = useCallback((newCampaign: Partial<Campaign>) => {
    const newId = Date.now();
    const campaign = {
      id: newId,
      ...newCampaign
    } as Campaign;
    setCampaigns(prev => [...prev, campaign]);
    return campaign;
  }, []);

  const updateCampaign = useCallback((id: number, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCampaign = useCallback((id: number) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateListing = useCallback((id: number, updates: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  return {
    // Data
    campaigns,
    socialStats,
    listings,
    monitoredSites,
    marketInsights,
    
    // Filtered data
    filteredCampaigns,
    
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
