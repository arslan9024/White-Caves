import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Megaphone, TrendingUp, Eye, Share2, Heart, MessageCircle,
  ArrowUp, ArrowDown, Search, Plus, Calendar, BarChart3,
  Instagram, Facebook, Youtube, Mail, Target, Users, Globe,
  RefreshCw, Settings, Clock, CheckCircle, AlertCircle, XCircle,
  Database, Zap, Activity, Play, Pause, Link2, Building2,
  Star, Home, Trophy, Sparkles
} from 'lucide-react';
import { PlatformPublisherForm, AssistantDocsTab } from './shared';
import { 
  selectInventoryStats,
  selectAllProperties
} from '../../store/slices/inventorySlice';
import {
  selectOliviaAutomation,
  updateOliviaSyncSchedule,
  toggleOliviaMonitoring,
  updateOliviaPropertySync,
  updateOliviaMarketResearch,
  addOliviaActivity
} from '../../store/slices/aiAssistantDashboardSlice';
import {
  setFeaturedProperties,
  selectFeaturedProperties,
  selectSelectionCriteria,
  selectLastUpdated,
  scoreProperty,
  selectTopProperties
} from '../../store/slices/featuredSlice';
import './AssistantDashboard.css';
import './OliviaMarketingCRM.css';

const CAMPAIGNS = [
  { id: 1, name: 'Summer Property Showcase', platform: 'facebook', status: 'active', budget: 25000, spent: 18500, reach: 125000, leads: 48, cpl: 385 },
  { id: 2, name: 'Luxury Villas Launch', platform: 'instagram', status: 'active', budget: 15000, spent: 12000, reach: 89000, leads: 32, cpl: 375 },
  { id: 3, name: 'DAMAC Hills 2 Promo', platform: 'google', status: 'paused', budget: 20000, spent: 8000, reach: 45000, leads: 18, cpl: 444 },
  { id: 4, name: 'Email Newsletter Q1', platform: 'email', status: 'completed', budget: 5000, spent: 5000, reach: 25000, leads: 85, cpl: 59 }
];

const SOCIAL_STATS = [
  { platform: 'Instagram', followers: 45200, growth: 12.5, engagement: 4.8, posts: 156 },
  { platform: 'Facebook', followers: 32100, growth: 8.2, engagement: 2.1, posts: 89 },
  { platform: 'LinkedIn', followers: 12400, growth: 15.3, engagement: 3.2, posts: 45 },
  { platform: 'YouTube', followers: 8900, growth: 22.1, engagement: 5.5, posts: 28 }
];

const LISTINGS = [
  { id: 1, property: 'Villa 348 - DAMAC Hills 2', views: 2450, inquiries: 28, quality: 92, available: 12 },
  { id: 2, property: 'Penthouse 2501 - Downtown', views: 1890, inquiries: 15, quality: 88, available: 3 },
  { id: 3, property: 'Apartment 1205 - Marina', views: 1560, inquiries: 22, quality: 85, available: 0 },
  { id: 4, property: 'Townhouse - DAMAC Lagoons', views: 1420, inquiries: 18, quality: 90, available: 8 },
  { id: 5, property: 'Villa 125 - Emirates Hills', views: 980, inquiries: 12, quality: 95, available: 1 }
];

const MARKET_INSIGHTS = {
  priceIndex: 152.3,
  priceChange: 2.4,
  avgRentalYield: 6.8,
  supplyDemandRatio: 0.78,
  hotspots: [
    { area: 'Dubai Hills Estate', priceChange: 8.5, avgPrice: 2850000, demand: 'high' },
    { area: 'DAMAC Hills 2', priceChange: 12.3, avgPrice: 1450000, demand: 'very high' },
    { area: 'Palm Jumeirah', priceChange: 5.2, avgPrice: 8500000, demand: 'stable' },
    { area: 'Downtown Dubai', priceChange: 3.8, avgPrice: 3200000, demand: 'high' },
    { area: 'JVC', priceChange: 15.1, avgPrice: 850000, demand: 'very high' }
  ],
  trends: [
    { month: 'Aug', sales: 2450, rentals: 3200, priceIndex: 148 },
    { month: 'Sep', sales: 2680, rentals: 3350, priceIndex: 149 },
    { month: 'Oct', sales: 2890, rentals: 3100, priceIndex: 150 },
    { month: 'Nov', sales: 3100, rentals: 2950, priceIndex: 151 },
    { month: 'Dec', sales: 3250, rentals: 3400, priceIndex: 152 },
    { month: 'Jan', sales: 3420, rentals: 3580, priceIndex: 152.3 }
  ]
};

const MONITORED_SITES_DEFAULT = [
  { name: 'Bayut', status: 'healthy', lastCheck: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), dataPoints: 1250 },
  { name: 'Property Finder', status: 'healthy', lastCheck: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), dataPoints: 980 },
  { name: 'Dubizzle', status: 'degraded', lastCheck: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), dataPoints: 650 }
];

const SAMPLE_PROPERTIES = [
  { id: 'P001', name: 'Luxury Villa - DAMAC Hills 2', type: 'Villa', bedrooms: 5, price: 4500000, inquiries: 45, views: 2340, qualityScore: 95, isNew: true, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300' },
  { id: 'P002', name: 'Modern Townhouse - DAMAC Lagoons', type: 'Townhouse', bedrooms: 4, price: 2800000, inquiries: 38, views: 1890, qualityScore: 88, isNew: true, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300' },
  { id: 'P003', name: 'Penthouse - Downtown Dubai', type: 'Penthouse', bedrooms: 3, price: 8500000, inquiries: 22, views: 3450, qualityScore: 98, isNew: false, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300' },
  { id: 'P004', name: 'Studio Apartment - JVC', type: 'Apartment', bedrooms: 0, price: 650000, inquiries: 67, views: 4200, qualityScore: 72, isNew: true, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300' },
  { id: 'P005', name: 'Family Villa - Emirates Hills', type: 'Villa', bedrooms: 6, price: 15000000, inquiries: 12, views: 890, qualityScore: 99, isNew: false, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300' },
  { id: 'P006', name: '2BR Apartment - Dubai Marina', type: 'Apartment', bedrooms: 2, price: 1800000, inquiries: 55, views: 3100, qualityScore: 85, isNew: true, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300' },
  { id: 'P007', name: 'Duplex - Business Bay', type: 'Duplex', bedrooms: 4, price: 3200000, inquiries: 28, views: 1560, qualityScore: 82, isNew: false, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=300' },
  { id: 'P008', name: 'Beachfront Villa - Palm Jumeirah', type: 'Villa', bedrooms: 5, price: 22000000, inquiries: 8, views: 650, qualityScore: 100, isNew: false, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300' },
  { id: 'P009', name: '1BR Apartment - DAMAC Hills 2', type: 'Apartment', bedrooms: 1, price: 780000, inquiries: 72, views: 5200, qualityScore: 78, isNew: true, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300' },
  { id: 'P010', name: 'Golf View Villa - Jumeirah Golf', type: 'Villa', bedrooms: 4, price: 6800000, inquiries: 18, views: 1120, qualityScore: 92, isNew: false, image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=300' },
  { id: 'P011', name: '3BR Townhouse - Arabian Ranches', type: 'Townhouse', bedrooms: 3, price: 2100000, inquiries: 42, views: 2800, qualityScore: 86, isNew: true, image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=300' },
  { id: 'P012', name: 'Luxury Penthouse - DIFC', type: 'Penthouse', bedrooms: 4, price: 12500000, inquiries: 15, views: 980, qualityScore: 97, isNew: false, image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=300' }
];

const OliviaMarketingCRM = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('automation');
  const [isSelectingFeatured, setIsSelectingFeatured] = useState(false);
  const inventoryStats = useSelector(selectInventoryStats);
  const oliviaAutomation = useSelector(selectOliviaAutomation);
  const featuredProperties = useSelector(selectFeaturedProperties);
  const selectionCriteria = useSelector(selectSelectionCriteria);
  const featuredLastUpdated = useSelector(selectLastUpdated);
  
  const scoredProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.map(p => ({
      ...p,
      score: scoreProperty(p, selectionCriteria)
    })).sort((a, b) => b.score - a.score);
  }, [selectionCriteria]);
  
  const handleRunDailySelection = useCallback(() => {
    setIsSelectingFeatured(true);
    setTimeout(() => {
      const top10 = scoredProperties.slice(0, 10);
      dispatch(setFeaturedProperties(top10));
      dispatch(addOliviaActivity({
        action: 'Featured Properties Selection',
        status: 'success',
        details: `Selected top 10 properties using scoring algorithm. Pushed to HomePage.`
      }));
      setIsSelectingFeatured(false);
    }, 1500);
  }, [dispatch, scoredProperties]);
  
  const syncSchedule = oliviaAutomation.syncSchedule || '3days';
  const activeMonitoring = oliviaAutomation.activeMonitoring !== false;
  const maryConnected = oliviaAutomation.coordination?.maryConnected !== false;
  const inventoryAccess = oliviaAutomation.coordination?.inventoryAccess !== false;
  const lastPropertySync = oliviaAutomation.lastPropertySync || new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const lastMarketResearch = oliviaAutomation.lastMarketResearch || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const activityLog = oliviaAutomation.activityLog?.length > 0 ? oliviaAutomation.activityLog : [
    { id: 1, action: 'Property Sync', status: 'success', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), details: 'Synced 9,378 properties with homepage' },
    { id: 2, action: 'Market Research', status: 'success', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), details: 'Collected data from 3 portals' },
    { id: 3, action: 'Inventory Check', status: 'success', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), details: 'Connected to Mary\'s inventory' },
    { id: 4, action: 'Sold Out Update', status: 'success', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), details: '12 properties marked as sold out' }
  ];

  const monitoredSites = oliviaAutomation.monitoredSites?.length > 0 
    ? oliviaAutomation.monitoredSites.map(s => ({
        ...s,
        lastCheck: s.lastCheck || new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        dataPoints: s.dataPoints || 1000
      }))
    : MONITORED_SITES_DEFAULT;

  const handleManualSync = useCallback(() => {
    dispatch(updateOliviaPropertySync());
    dispatch(addOliviaActivity({
      action: 'Manual Property Sync',
      status: 'success',
      details: `Synced ${inventoryStats?.totalProperties || 9378} properties with homepage`
    }));
  }, [dispatch, inventoryStats]);

  const handleMarketResearch = useCallback(() => {
    dispatch(updateOliviaMarketResearch());
    dispatch(addOliviaActivity({
      action: 'Manual Market Research',
      status: 'success',
      details: 'Initiated data collection from monitored portals'
    }));
  }, [dispatch]);

  const handleToggleMonitoring = useCallback(() => {
    dispatch(toggleOliviaMonitoring());
  }, [dispatch]);

  const handleScheduleChange = useCallback((freq) => {
    dispatch(updateOliviaSyncSchedule(freq));
  }, [dispatch]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'healthy':
        return <CheckCircle size={14} className="status-icon success" />;
      case 'degraded':
        return <AlertCircle size={14} className="status-icon warning" />;
      case 'failed':
      case 'offline':
        return <XCircle size={14} className="status-icon error" />;
      default:
        return <Clock size={14} className="status-icon" />;
    }
  };

  return (
    <div className="assistant-dashboard olivia">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' }}>
          <Megaphone size={28} />
        </div>
        <div className="assistant-info">
          <h2>Olivia - Marketing Manager</h2>
          <p>Automated property sync, market intelligence, and campaign management</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          {activeMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(79, 172, 254, 0.2)', color: '#4FACFE' }}>
            <Target size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">183</span>
            <span className="stat-label">Leads Generated</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 24%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <Database size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{inventoryStats?.totalProperties?.toLocaleString() || '9,378'}</span>
            <span className="stat-label">Synced Properties</span>
          </div>
          <span className="stat-change positive"><Link2 size={14} /> Mary</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{MARKET_INSIGHTS.priceIndex}</span>
            <span className="stat-label">Price Index</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> {MARKET_INSIGHTS.priceChange}%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Activity size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">3/3</span>
            <span className="stat-label">Sites Monitored</span>
          </div>
          <span className="stat-change positive"><CheckCircle size={14} /> Healthy</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['automation', 'featured', 'insights', 'campaigns', 'social', 'listings', 'publish', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'automation' && <Zap size={14} />}
            {tab === 'featured' && <Star size={14} />}
            {tab === 'insights' && <BarChart3 size={14} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'automation' && (
          <div className="automation-view">
            <div className="automation-grid">
              <div className="automation-panel coordination-panel">
                <div className="panel-header">
                  <h3><Database size={18} /> Mary Coordination</h3>
                  <span className={`connection-status ${maryConnected ? 'connected' : 'disconnected'}`}>
                    {maryConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="panel-content">
                  <div className="coordination-stats">
                    <div className="coord-stat">
                      <Building2 size={16} />
                      <span className="label">Total Properties</span>
                      <span className="value">{inventoryStats?.totalProperties?.toLocaleString() || '9,378'}</span>
                    </div>
                    <div className="coord-stat">
                      <CheckCircle size={16} />
                      <span className="label">Available Units</span>
                      <span className="value">{inventoryStats?.availableUnits?.toLocaleString() || '4,521'}</span>
                    </div>
                    <div className="coord-stat">
                      <XCircle size={16} />
                      <span className="label">Sold Out</span>
                      <span className="value">{inventoryStats?.soldOut?.toLocaleString() || '847'}</span>
                    </div>
                  </div>
                  <div className="sync-info">
                    <span className="sync-label">Last Sync:</span>
                    <span className="sync-time">{formatTimeAgo(lastPropertySync)}</span>
                  </div>
                  <button className="action-btn primary" onClick={handleManualSync}>
                    <RefreshCw size={14} /> Sync Now
                  </button>
                </div>
              </div>

              <div className="automation-panel schedule-panel">
                <div className="panel-header">
                  <h3><Clock size={18} /> Schedule Management</h3>
                  <button 
                    className={`toggle-btn ${activeMonitoring ? 'active' : ''}`}
                    onClick={handleToggleMonitoring}
                  >
                    {activeMonitoring ? <Pause size={14} /> : <Play size={14} />}
                    {activeMonitoring ? 'Pause' : 'Start'}
                  </button>
                </div>
                <div className="panel-content">
                  <div className="schedule-options">
                    <label className="schedule-label">Sync Frequency</label>
                    <div className="schedule-buttons">
                      {['daily', '3days', '5days', 'weekly'].map(freq => (
                        <button
                          key={freq}
                          className={`freq-btn ${syncSchedule === freq ? 'active' : ''}`}
                          onClick={() => handleScheduleChange(freq)}
                        >
                          {freq === 'daily' ? 'Daily' : freq === '3days' ? '3 Days' : freq === '5days' ? '5 Days' : 'Weekly'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="next-sync">
                    <span className="label">Next Scheduled Sync:</span>
                    <span className="time">In {syncSchedule === 'daily' ? '18h' : syncSchedule === '3days' ? '52h' : '5d'}</span>
                  </div>
                </div>
              </div>

              <div className="automation-panel monitoring-panel">
                <div className="panel-header">
                  <h3><Globe size={18} /> Website Monitoring</h3>
                  <button className="action-btn secondary" onClick={handleMarketResearch}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
                <div className="panel-content">
                  <div className="monitored-sites">
                    {monitoredSites.map(site => (
                      <div key={site.name} className="site-row">
                        <div className="site-info">
                          {getStatusIcon(site.status)}
                          <span className="site-name">{site.name}</span>
                        </div>
                        <div className="site-stats">
                          <span className="data-points">{(site.dataPoints || 0).toLocaleString()} pts</span>
                          <span className="last-check">{formatTimeAgo(site.lastCheck)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="automation-panel activity-panel">
                <div className="panel-header">
                  <h3><Activity size={18} /> Activity Log</h3>
                </div>
                <div className="panel-content">
                  <div className="activity-list">
                    {activityLog.slice(0, 5).map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-header">
                          {getStatusIcon(activity.status)}
                          <span className="activity-action">{activity.action}</span>
                          <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                        <p className="activity-details">{activity.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'featured' && (
          <div className="featured-view">
            <div className="featured-header">
              <div className="header-info">
                <h3><Star size={20} /> Featured Properties Manager</h3>
                <p>Select top 10 properties using Olivia's scoring algorithm to display on the HomePage</p>
              </div>
              <div className="header-actions">
                <button 
                  className={`action-btn primary ${isSelectingFeatured ? 'loading' : ''}`}
                  onClick={handleRunDailySelection}
                  disabled={isSelectingFeatured}
                >
                  {isSelectingFeatured ? (
                    <><RefreshCw size={14} className="spinning" /> Selecting...</>
                  ) : (
                    <><Sparkles size={14} /> Run Daily Selection</>
                  )}
                </button>
              </div>
            </div>

            <div className="scoring-formula">
              <div className="formula-header">
                <Trophy size={18} />
                <span>Scoring Algorithm</span>
              </div>
              <div className="formula-content">
                <code>Score = (Inquiries × {selectionCriteria.inquiryWeight}) + (Views × {selectionCriteria.viewWeight}) + (Quality × {selectionCriteria.qualityWeight}) + (New Listing × {selectionCriteria.newListingBonus})</code>
              </div>
              {featuredLastUpdated && (
                <div className="last-selection">
                  <Clock size={14} /> Last selection: {formatTimeAgo(featuredLastUpdated)}
                </div>
              )}
            </div>

            <div className="featured-status">
              <div className="status-card">
                <Home size={20} />
                <div className="status-info">
                  <span className="status-value">{featuredProperties.length}</span>
                  <span className="status-label">Featured on HomePage</span>
                </div>
              </div>
              <div className="status-card">
                <Database size={20} />
                <div className="status-info">
                  <span className="status-value">{SAMPLE_PROPERTIES.length}</span>
                  <span className="status-label">Properties in Pool</span>
                </div>
              </div>
              <div className="status-card">
                <Link2 size={20} />
                <div className="status-info">
                  <span className="status-value">Mary</span>
                  <span className="status-label">Inventory Source</span>
                </div>
              </div>
            </div>

            <div className="scored-properties">
              <h4>Property Rankings (By Score)</h4>
              <div className="properties-table">
                <div className="table-header">
                  <span className="col-rank">Rank</span>
                  <span className="col-property">Property</span>
                  <span className="col-stats">Inquiries</span>
                  <span className="col-stats">Views</span>
                  <span className="col-stats">Quality</span>
                  <span className="col-new">New</span>
                  <span className="col-score">Score</span>
                  <span className="col-status">Status</span>
                </div>
                <div className="table-body">
                  {scoredProperties.map((property, index) => {
                    const isFeatured = featuredProperties.some(fp => fp.id === property.id);
                    const isTop10 = index < 10;
                    return (
                      <div key={property.id} className={`table-row ${isTop10 ? 'top10' : ''} ${isFeatured ? 'featured' : ''}`}>
                        <span className="col-rank">
                          {index < 3 ? (
                            <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                          ) : (
                            <span className="rank-number">{index + 1}</span>
                          )}
                        </span>
                        <span className="col-property">
                          <img src={property.image} alt={property.name} className="property-thumb" />
                          <div className="property-details">
                            <span className="property-name">{property.name}</span>
                            <span className="property-meta">{property.type} • {property.bedrooms} BR • AED {(property.price / 1000000).toFixed(1)}M</span>
                          </div>
                        </span>
                        <span className="col-stats">{property.inquiries}</span>
                        <span className="col-stats">{property.views.toLocaleString()}</span>
                        <span className="col-stats">{property.qualityScore}</span>
                        <span className="col-new">
                          {property.isNew ? <CheckCircle size={14} className="new-check" /> : '-'}
                        </span>
                        <span className="col-score">
                          <span className="score-badge">{property.score.toFixed(1)}</span>
                        </span>
                        <span className="col-status">
                          {isFeatured ? (
                            <span className="status-badge featured"><Star size={12} /> Featured</span>
                          ) : isTop10 ? (
                            <span className="status-badge eligible">Eligible</span>
                          ) : (
                            <span className="status-badge">-</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-view">
            <div className="insights-header">
              <h3>Dubai Market Intelligence</h3>
              <span className="last-updated">Last updated: {formatTimeAgo(lastMarketResearch)}</span>
            </div>
            
            <div className="insights-summary">
              <div className="insight-card">
                <div className="insight-value">{MARKET_INSIGHTS.priceIndex}</div>
                <div className="insight-label">Price Index</div>
                <div className="insight-change positive">+{MARKET_INSIGHTS.priceChange}%</div>
              </div>
              <div className="insight-card">
                <div className="insight-value">{MARKET_INSIGHTS.avgRentalYield}%</div>
                <div className="insight-label">Avg Rental Yield</div>
                <div className="insight-change positive">Above Regional Avg</div>
              </div>
              <div className="insight-card">
                <div className="insight-value">{MARKET_INSIGHTS.supplyDemandRatio}</div>
                <div className="insight-label">Supply/Demand</div>
                <div className="insight-change">Seller's Market</div>
              </div>
            </div>

            <div className="hotspots-section">
              <h4>Emerging Hotspots</h4>
              <div className="hotspots-grid">
                {MARKET_INSIGHTS.hotspots.map(hotspot => (
                  <div key={hotspot.area} className="hotspot-card">
                    <div className="hotspot-header">
                      <span className="hotspot-area">{hotspot.area}</span>
                      <span className={`demand-badge ${hotspot.demand.replace(' ', '-')}`}>{hotspot.demand}</span>
                    </div>
                    <div className="hotspot-stats">
                      <div className="hotspot-stat">
                        <span className="label">Avg Price</span>
                        <span className="value">AED {(hotspot.avgPrice / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="hotspot-stat">
                        <span className="label">Price Change</span>
                        <span className="value positive">+{hotspot.priceChange}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="trends-section">
              <h4>6-Month Trends</h4>
              <div className="trends-chart">
                {MARKET_INSIGHTS.trends.map((trend, index) => (
                  <div key={trend.month} className="trend-bar">
                    <div className="bar-container">
                      <div 
                        className="bar sales" 
                        style={{ height: `${(trend.sales / 3500) * 100}%` }}
                        title={`Sales: ${trend.sales}`}
                      />
                      <div 
                        className="bar rentals" 
                        style={{ height: `${(trend.rentals / 3700) * 100}%` }}
                        title={`Rentals: ${trend.rentals}`}
                      />
                    </div>
                    <span className="month-label">{trend.month}</span>
                  </div>
                ))}
              </div>
              <div className="legend">
                <span className="legend-item sales">Sales</span>
                <span className="legend-item rentals">Rentals</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="campaigns-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search campaigns..." />
              </div>
              <button className="add-btn"><Plus size={16} /> New Campaign</button>
            </div>
            <div className="campaigns-table">
              <div className="table-header">
                <span>Campaign</span>
                <span>Platform</span>
                <span>Budget</span>
                <span>Reach</span>
                <span>Leads</span>
                <span>CPL</span>
                <span>Status</span>
              </div>
              {CAMPAIGNS.map(campaign => (
                <div key={campaign.id} className="table-row">
                  <span className="campaign-name">{campaign.name}</span>
                  <span className={`platform-badge ${campaign.platform}`}>{campaign.platform}</span>
                  <span>AED {campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()}</span>
                  <span>{(campaign.reach / 1000).toFixed(0)}K</span>
                  <span>{campaign.leads}</span>
                  <span>AED {campaign.cpl}</span>
                  <span className={`status-badge ${campaign.status}`}>{campaign.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="social-view">
            <h3>Social Media Performance</h3>
            <div className="social-cards">
              {SOCIAL_STATS.map(platform => (
                <div key={platform.platform} className="social-card">
                  <div className="social-header">
                    <h4>{platform.platform}</h4>
                    <span className="growth positive">+{platform.growth}%</span>
                  </div>
                  <div className="social-stats">
                    <div className="social-stat">
                      <Users size={14} />
                      <span>{platform.followers.toLocaleString()}</span>
                      <span className="label">Followers</span>
                    </div>
                    <div className="social-stat">
                      <Heart size={14} />
                      <span>{platform.engagement}%</span>
                      <span className="label">Engagement</span>
                    </div>
                    <div className="social-stat">
                      <Share2 size={14} />
                      <span>{platform.posts}</span>
                      <span className="label">Posts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="listings-view">
            <h3>Listing Performance</h3>
            <div className="listing-cards">
              {LISTINGS.map(listing => (
                <div key={listing.id} className="listing-card">
                  <div className="listing-header">
                    <h4>{listing.property}</h4>
                    {listing.available === 0 ? (
                      <span className="sold-out-badge">Sold Out</span>
                    ) : (
                      <span className="available-badge">{listing.available} Available</span>
                    )}
                  </div>
                  <div className="listing-stats">
                    <span><Eye size={14} /> {listing.views.toLocaleString()} views</span>
                    <span><MessageCircle size={14} /> {listing.inquiries} inquiries</span>
                    <span><Target size={14} /> {listing.quality}% quality</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="publish-view">
            <PlatformPublisherForm 
              onPublish={(data, platforms) => {
                console.log('Publishing to:', platforms, data);
                dispatch(addOliviaActivity({
                  action: 'Property Published',
                  status: 'success',
                  details: `Published to ${platforms.join(', ')}`
                }));
              }}
              onSaveDraft={() => console.log('Saved as draft')}
            />
          </div>
        )}

        {activeTab === 'docs' && <AssistantDocsTab assistantId="olivia" />}
      </div>
    </div>
  );
};

export default OliviaMarketingCRM;
