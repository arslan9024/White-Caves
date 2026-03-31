import React, { useState, Suspense, lazy } from 'react';
import {
  Megaphone,
  TrendingUp,
  BarChart3,
  Instagram,
  Home,
  Share2,
  Zap
} from 'lucide-react';
import { useMarketingData } from './hooks/useMarketingData';
import SuspenseLoader from '../../common/SuspenseLoader';
import './OliviaMarketingCRM.css';

// Lazy-loaded tabs
const AutomationTab = lazy(() => import('./tabs/AutomationTab'));
const InsightsTab = lazy(() => import('./tabs/InsightsTab'));
const CampaignsTab = lazy(() => import('./tabs/CampaignsTab'));
const SocialTab = lazy(() => import('./tabs/SocialTab'));
const ListingsTab = lazy(() => import('./tabs/ListingsTab'));
const PublishTab = lazy(() => import('./tabs/PublishTab'));
const FeaturesTab = lazy(() => import('./tabs/FeaturesTab'));

export default function OliviaMarketingCRM() {
  const [activeTab, setActiveTab] = useState('automation');
  const state = useMarketingData();

  const { oliviaActive, setOliviaActive, campaignStats, socialMetrics, listingStats } = state;

  return (
    <div className="olivia-crm-container">
      <div className="olivia-header">
        <div className="olivia-title">
          <div className="olivia-avatar">
            <Megaphone size={24} />
          </div>
          <div className="olivia-details">
            <h2>Olivia - Marketing Manager</h2>
            <span className={`olivia-status ${oliviaActive ? 'active' : 'inactive'}`}>
              {oliviaActive ? 'AI Active' : 'AI Paused'}
            </span>
          </div>
        </div>
        <div className="olivia-actions">
          <button
            className={`olivia-toggle ${oliviaActive ? 'active' : ''}`}
            onClick={() => setOliviaActive(!oliviaActive)}
          >
            {oliviaActive ? 'Pause Olivia' : 'Activate Olivia'}
          </button>
        </div>
      </div>

      <div className="olivia-stats">
        <div className="stat-card">
          <BarChart3 size={20} />
          <div className="stat-info">
            <span className="stat-value">{campaignStats.active}</span>
            <span className="stat-label">Active Campaigns</span>
          </div>
        </div>
        <div className="stat-card">
          <Instagram size={20} />
          <div className="stat-info">
            <span className="stat-value">{(socialMetrics.totalFollowers / 1000).toFixed(0)}K</span>
            <span className="stat-label">Social Followers</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={20} />
          <div className="stat-info">
            <span className="stat-value">{socialMetrics.avgEngagement}%</span>
            <span className="stat-label">Avg Engagement</span>
          </div>
        </div>
        <div className="stat-card">
          <Home size={20} />
          <div className="stat-info">
            <span className="stat-value">{listingStats.totalViews.toLocaleString()}</span>
            <span className="stat-label">Property Views</span>
          </div>
        </div>
      </div>

      <div className="olivia-tabs">
        <button
          className={`olivia-tab ${activeTab === 'automation' ? 'active' : ''}`}
          onClick={() => setActiveTab('automation')}
        >
          <Zap size={16} />
          Automation
        </button>
        <button
          className={`olivia-tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <TrendingUp size={16} />
          Insights
        </button>
        <button
          className={`olivia-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          <BarChart3 size={16} />
          Campaigns
        </button>
        <button
          className={`olivia-tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          <Instagram size={16} />
          Social
        </button>
        <button
          className={`olivia-tab ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          <Home size={16} />
          Listings
        </button>
        <button
          className={`olivia-tab ${activeTab === 'publish' ? 'active' : ''}`}
          onClick={() => setActiveTab('publish')}
        >
          <Share2 size={16} />
          Publish
        </button>
        <button
          className={`olivia-tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          <Zap size={16} />
          Features
        </button>
      </div>

      <div className="olivia-content">
        <Suspense fallback={<SuspenseLoader />}>
          {activeTab === 'automation' && <AutomationTab state={state} />}
          {activeTab === 'insights' && <InsightsTab state={state} />}
          {activeTab === 'campaigns' && <CampaignsTab state={state} />}
          {activeTab === 'social' && <SocialTab state={state} />}
          {activeTab === 'listings' && <ListingsTab state={state} />}
          {activeTab === 'publish' && <PublishTab state={state} />}
          {activeTab === 'features' && <FeaturesTab />}
        </Suspense>
      </div>
    </div>
  );
}
