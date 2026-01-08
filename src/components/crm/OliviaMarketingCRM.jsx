import React, { useState } from 'react';
import { 
  Megaphone, TrendingUp, Eye, Share2, Heart, MessageCircle,
  ArrowUp, ArrowDown, Search, Plus, Calendar, BarChart3,
  Instagram, Facebook, Youtube, Mail, Target, Users
} from 'lucide-react';
import './AssistantDashboard.css';

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
  { id: 1, property: 'Villa 348 - DAMAC Hills 2', views: 2450, inquiries: 28, quality: 92 },
  { id: 2, property: 'Penthouse 2501 - Downtown', views: 1890, inquiries: 15, quality: 88 },
  { id: 3, property: 'Apartment 1205 - Marina', views: 1560, inquiries: 22, quality: 85 }
];

const OliviaMarketingCRM = () => {
  const [activeTab, setActiveTab] = useState('campaigns');

  return (
    <div className="assistant-dashboard olivia">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' }}>
          <Megaphone size={28} />
        </div>
        <div className="assistant-info">
          <h2>Olivia - Marketing Manager</h2>
          <p>Manages marketing campaigns, social media, property listing optimization, and lead generation</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
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
            <Eye size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">284K</span>
            <span className="stat-label">Total Reach</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 18%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 315</span>
            <span className="stat-label">Avg. CPL</span>
          </div>
          <span className="stat-change positive"><ArrowDown size={14} /> 12%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Heart size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">4.2%</span>
            <span className="stat-label">Engagement</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 0.5%</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['campaigns', 'social', 'listings', 'analytics'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
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
                  <h4>{listing.property}</h4>
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

        {activeTab === 'analytics' && (
          <div className="analytics-view">
            <h3>Marketing Analytics</h3>
            <div className="analytics-summary">
              <p>Detailed analytics and reporting dashboard coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OliviaMarketingCRM;
