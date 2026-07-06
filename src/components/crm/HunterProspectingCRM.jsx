import React, { useState } from 'react';
import { 
  Search, Target, Send, Radar, Plus, TrendingUp,
  Users, Mail, Phone, Globe, Calendar, Clock,
  ArrowUp, ArrowDown, Filter, Eye, Zap, Activity
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const PROSPECTS = [
  { id: 1, name: 'Khalid Al Maktoum', source: 'LinkedIn', score: 92, status: 'hot', interest: 'Selling Villa', value: 'AED 8M+', lastActivity: 'Viewed our website', contacted: false },
  { id: 2, name: 'Jennifer Smith', source: 'Property Finder', score: 78, status: 'warm', interest: 'Buying Apartment', value: 'AED 2-3M', lastActivity: 'Inquired on listing', contacted: true },
  { id: 3, name: 'Hassan Trading LLC', source: 'Web Scrape', score: 85, status: 'hot', interest: 'Commercial Space', value: 'AED 5M+', lastActivity: 'Company expanding', contacted: false },
  { id: 4, name: 'Maria Rodriguez', source: 'Referral Data', score: 65, status: 'cold', interest: 'Investment', value: 'AED 10M+', lastActivity: 'Previous client', contacted: true },
  { id: 5, name: 'Chen Wei Holdings', source: 'DLD Records', score: 88, status: 'warm', interest: 'Portfolio', value: 'AED 25M+', lastActivity: 'Recent purchases', contacted: false }
];

const OUTREACH_CAMPAIGNS = [
  { id: 1, name: 'Off-Plan Investors Q1', status: 'active', prospects: 156, contacted: 89, responses: 23, meetings: 8 },
  { id: 2, name: 'Villa Sellers Marina', status: 'active', prospects: 78, contacted: 45, responses: 12, meetings: 4 },
  { id: 3, name: 'Expat Relocation', status: 'paused', prospects: 234, contacted: 180, responses: 45, meetings: 15 },
  { id: 4, name: 'Commercial Tenants', status: 'draft', prospects: 45, contacted: 0, responses: 0, meetings: 0 }
];

const PATTERNS = [
  { id: 1, pattern: 'High-value villa listings in Palm Jumeirah', trend: 'increasing', leads: 12, opportunity: 'Seller outreach' },
  { id: 2, pattern: 'Apartment rentals in JVC trending down', trend: 'decreasing', leads: 8, opportunity: 'Landlord advisory' },
  { id: 3, pattern: 'Off-plan interest in Dubai South', trend: 'increasing', leads: 24, opportunity: 'Investor targeting' },
  { id: 4, pattern: 'Commercial space demand in Business Bay', trend: 'stable', leads: 6, opportunity: 'Tenant matching' }
];

const HunterProspectingCRM = () => {
  const [activeTab, setActiveTab] = useState('prospects');

  const getStatusColor = (status) => {
    switch (status) {
      case 'hot': return '#EF4444';
      case 'warm': return '#F59E0B';
      case 'cold': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="assistant-dashboard hunter">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)' }}>
          <Target size={28} />
        </div>
        <div className="assistant-info">
          <h2>Hunter - Lead Prospecting AI</h2>
          <p>Scrapes and analyzes potential client databases, identifies property buying/selling patterns, and manages automated outreach</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(13, 148, 136, 0.2)', color: '#0D9488' }}>
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">1,247</span>
            <span className="stat-label">Prospects Found</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 89 this week</span>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <Zap size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">67</span>
            <span className="stat-label">Hot Prospects</span>
          </div>
          <span className="stat-change warning">12 uncontacted</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Send size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">314</span>
            <span className="stat-label">Outreach Sent</span>
          </div>
          <span className="stat-change">23% response rate</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Radar size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">4</span>
            <span className="stat-label">Active Patterns</span>
          </div>
          <span className="stat-change positive">2 new</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['prospects', 'campaigns', 'patterns', 'enrichment', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'docs' ? 'Documentation' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'prospects' && (
          <div className="prospects-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search prospects..." />
              </div>
              <div className="filter-group">
                <select>
                  <option value="all">All Sources</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="portal">Property Portals</option>
                  <option value="web">Web Scrape</option>
                  <option value="dld">DLD Records</option>
                </select>
                <button className="add-btn"><Plus size={16} /> Add Prospect</button>
              </div>
            </div>
            <div className="prospects-list">
              {PROSPECTS.map(prospect => (
                <div key={prospect.id} className="prospect-card">
                  <div className="prospect-score" style={{ 
                    background: prospect.score >= 80 ? 'rgba(239, 68, 68, 0.15)' : prospect.score >= 60 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: prospect.score >= 80 ? '#EF4444' : prospect.score >= 60 ? '#F59E0B' : '#3B82F6'
                  }}>
                    {prospect.score}
                  </div>
                  <div className="prospect-content">
                    <div className="prospect-header">
                      <h4>{prospect.name}</h4>
                      <span className="prospect-status" style={{ color: getStatusColor(prospect.status) }}>
                        {prospect.status}
                      </span>
                    </div>
                    <p className="prospect-interest">{prospect.interest} • {prospect.value}</p>
                    <div className="prospect-meta">
                      <span><Globe size={12} /> {prospect.source}</span>
                      <span><Activity size={12} /> {prospect.lastActivity}</span>
                    </div>
                  </div>
                  <div className="prospect-actions">
                    {!prospect.contacted ? (
                      <button className="contact-btn"><Send size={14} /> Reach Out</button>
                    ) : (
                      <span className="contacted-badge">Contacted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="campaigns-view">
            <div className="view-header">
              <h3>Outreach Campaigns</h3>
              <button className="add-btn"><Plus size={16} /> New Campaign</button>
            </div>
            <div className="campaigns-grid">
              {OUTREACH_CAMPAIGNS.map(campaign => (
                <div key={campaign.id} className="campaign-card">
                  <div className="campaign-header">
                    <h4>{campaign.name}</h4>
                    <span className={`campaign-status ${campaign.status}`}>{campaign.status}</span>
                  </div>
                  <div className="campaign-funnel">
                    <div className="funnel-stage">
                      <span className="funnel-value">{campaign.prospects}</span>
                      <span className="funnel-label">Prospects</span>
                    </div>
                    <div className="funnel-arrow">→</div>
                    <div className="funnel-stage">
                      <span className="funnel-value">{campaign.contacted}</span>
                      <span className="funnel-label">Contacted</span>
                    </div>
                    <div className="funnel-arrow">→</div>
                    <div className="funnel-stage">
                      <span className="funnel-value">{campaign.responses}</span>
                      <span className="funnel-label">Responses</span>
                    </div>
                    <div className="funnel-arrow">→</div>
                    <div className="funnel-stage highlight">
                      <span className="funnel-value">{campaign.meetings}</span>
                      <span className="funnel-label">Meetings</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="patterns-view">
            <h3>Market Patterns Detected</h3>
            <div className="patterns-list">
              {PATTERNS.map(pattern => (
                <div key={pattern.id} className="pattern-card">
                  <div className="pattern-icon">
                    <Radar size={24} />
                  </div>
                  <div className="pattern-content">
                    <h4>{pattern.pattern}</h4>
                    <div className="pattern-meta">
                      <span className={`trend ${pattern.trend}`}>
                        {pattern.trend === 'increasing' ? <ArrowUp size={14} /> : pattern.trend === 'decreasing' ? <ArrowDown size={14} /> : '—'}
                        {pattern.trend}
                      </span>
                      <span>{pattern.leads} potential leads</span>
                    </div>
                    <p className="opportunity">Opportunity: {pattern.opportunity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'enrichment' && (
          <div className="enrichment-view">
            <h3>Lead Enrichment</h3>
            <div className="empty-state">
              <Search size={48} />
              <p>Select prospects to enrich with additional data</p>
              <button className="add-btn"><Plus size={16} /> Bulk Enrich</button>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="hunter" 
            assistantName="Hunter" 
            assistantColor="#0D9488" 
          />
        )}
      </div>
    </div>
  );
};

export default HunterProspectingCRM;
