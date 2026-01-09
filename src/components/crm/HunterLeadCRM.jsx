import React from 'react';
import { Target, Users, TrendingUp, Zap, Filter, Award } from 'lucide-react';
import './shared/CRMDashboard.css';

const HunterLeadCRM = ({ assistant }) => {
  const stats = [
    { label: 'New Leads Today', value: '47', icon: Target, trend: '+23% vs yesterday' },
    { label: 'Qualified Leads', value: '156', icon: Users, trend: '68% conversion' },
    { label: 'Hot Prospects', value: '32', icon: Zap, trend: '12 ready to close' },
    { label: 'Lead Score Avg', value: '78', icon: TrendingUp, trend: '+8 points' }
  ];

  return (
    <div className="crm-dashboard hunter-lead">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#DC2626'}20` }}>
            <Target size={28} style={{ color: assistant?.color || '#DC2626' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Hunter'}</h1>
            <p>{assistant?.title || 'Lead Qualification & Scoring'}</p>
          </div>
        </div>
      </div>

      <div className="crm-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-trend">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="crm-content-grid">
        <div className="crm-panel">
          <div className="panel-header">
            <h3>Lead Pipeline</h3>
            <Filter size={18} />
          </div>
          <div className="panel-content">
            {[
              { name: 'Ahmed Al Rashid', score: 95, budget: 'AED 5M+', intent: 'High', source: 'Website' },
              { name: 'Sarah Williams', score: 88, budget: 'AED 2-3M', intent: 'High', source: 'Referral' },
              { name: 'Mohammed Khan', score: 82, budget: 'AED 1-2M', intent: 'Medium', source: 'Social' },
              { name: 'Jennifer Lee', score: 75, budget: 'AED 3-5M', intent: 'Medium', source: 'Portal' }
            ].map((lead, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{lead.name}</span>
                  <span className="item-meta">{lead.budget} • {lead.source}</span>
                </div>
                <div className="item-actions">
                  <span className={`score-badge ${lead.score >= 85 ? 'high' : lead.score >= 70 ? 'medium' : 'low'}`}>
                    {lead.score}
                  </span>
                  <span className={`intent-badge ${lead.intent.toLowerCase()}`}>{lead.intent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>Lead Sources Performance</h3>
            <Award size={18} />
          </div>
          <div className="panel-content">
            {[
              { source: 'Website Inquiries', leads: 124, conversion: '32%', quality: 'High' },
              { source: 'Property Portals', leads: 98, conversion: '28%', quality: 'Medium' },
              { source: 'Social Media', leads: 67, conversion: '22%', quality: 'Medium' },
              { source: 'Referrals', leads: 45, conversion: '45%', quality: 'High' },
              { source: 'WhatsApp', leads: 38, conversion: '35%', quality: 'High' }
            ].map((source, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{source.source}</span>
                  <span className="item-meta">{source.leads} leads • {source.conversion} conv.</span>
                </div>
                <span className={`quality-badge ${source.quality.toLowerCase()}`}>{source.quality}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>Lead Distribution by Interest</h3>
          </div>
          <div className="panel-content categories">
            {[
              { name: 'Luxury Villas', count: 45, hot: 12 },
              { name: 'Apartments', count: 78, hot: 18 },
              { name: 'Off-Plan', count: 34, hot: 8 },
              { name: 'Commercial', count: 23, hot: 5 },
              { name: 'Penthouses', count: 18, hot: 6 },
              { name: 'Townhouses', count: 28, hot: 7 }
            ].map((category, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count} leads ({category.hot} hot)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HunterLeadCRM;
