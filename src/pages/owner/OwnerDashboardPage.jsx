import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RoleNavigation from '../../components/RoleNavigation';
import './OwnerDashboardPage.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

export default function OwnerDashboardPage() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [stats, setStats] = useState({
    totalProperties: 156,
    activeListings: 89,
    totalAgents: 52,
    monthlyRevenue: 2450000,
    pendingDeals: 23,
    closedDeals: 178,
    newLeads: 45,
    conversionRate: 34.2
  });

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  const businessSteps = [
    { id: 'A', label: 'Client Signing', icon: '✍️', color: '#e74c3c' },
    { id: 'B', label: 'Property Valuation', icon: '📊', color: '#e67e22' },
    { id: 'C', label: 'Photography & Virtual Tour', icon: '📸', color: '#f39c12' },
    { id: 'D', label: 'Listing Creation', icon: '📝', color: '#27ae60' },
    { id: 'E', label: 'Multi-Channel Distribution', icon: '🌐', color: '#3498db' },
    { id: 'F', label: 'Lead Management', icon: '📋', color: '#9b59b6' },
    { id: 'G', label: 'Viewing Coordination', icon: '🏠', color: '#1abc9c' },
    { id: 'H', label: 'Offer Management', icon: '💼', color: '#e74c3c' },
    { id: 'I', label: 'Negotiation', icon: '🤝', color: '#e67e22' },
    { id: 'J', label: 'Transaction Processing', icon: '💳', color: '#27ae60' },
    { id: 'K', label: 'Handover', icon: '🔑', color: '#3498db' },
    { id: 'L', label: 'Post-Sale Follow-up', icon: '⭐', color: '#9b59b6' }
  ];

  const distributionChannels = [
    { id: 'E1', label: 'Property Portals', icon: '🏢', count: 12 },
    { id: 'E2', label: 'Social Media', icon: '📱', count: 5 },
    { id: 'E3', label: 'Email Campaign', icon: '📧', count: 8500 },
    { id: 'E4', label: 'Company Website', icon: '🌐', count: 1 }
  ];

  return (
    <div className="owner-dashboard">
      <RoleNavigation 
        role="owner" 
        userName={user?.displayName || user?.email}
      />
      
      <div className="owner-dashboard-content">
        <div className="owner-header">
          <div className="owner-welcome">
            <h1>Welcome, Owner</h1>
            <p className="owner-subtitle">White Caves Real Estate LLC - Executive Dashboard</p>
          </div>
          <div className="owner-badge">
            <span className="badge-icon">👑</span>
            <span className="badge-text">Company Owner</span>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Monthly Revenue</h3>
              <p className="stat-value">AED {stats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-info">
              <h3>Total Properties</h3>
              <p className="stat-value">{stats.totalProperties}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>Active Listings</h3>
              <p className="stat-value">{stats.activeListings}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Agents</h3>
              <p className="stat-value">{stats.totalAgents}</p>
            </div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card small">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>Pending Deals</h3>
              <p className="stat-value">{stats.pendingDeals}</p>
            </div>
          </div>
          <div className="stat-card small">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Closed Deals</h3>
              <p className="stat-value">{stats.closedDeals}</p>
            </div>
          </div>
          <div className="stat-card small">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>New Leads</h3>
              <p className="stat-value">{stats.newLeads}</p>
            </div>
          </div>
          <div className="stat-card small">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Conversion Rate</h3>
              <p className="stat-value">{stats.conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="business-model-section">
          <h2>Business Model Flow</h2>
          <p className="section-subtitle">White Caves Real Estate Business Process</p>
          
          <div className="business-flow">
            <div className="flow-container">
              {businessSteps.map((step, index) => (
                <div key={step.id} className="flow-step">
                  <div 
                    className="step-node" 
                    style={{ backgroundColor: step.color }}
                  >
                    <span className="step-icon">{step.icon}</span>
                    <span className="step-id">{step.id}</span>
                  </div>
                  <div className="step-label">{step.label}</div>
                  {index < businessSteps.length - 1 && (
                    <div className="flow-arrow">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="distribution-section">
            <h3>Digital Distribution Channels</h3>
            <div className="distribution-grid">
              {distributionChannels.map(channel => (
                <div key={channel.id} className="distribution-card">
                  <span className="channel-icon">{channel.icon}</span>
                  <h4>{channel.label}</h4>
                  <p className="channel-id">{channel.id}</p>
                </div>
              ))}
            </div>
            <div className="distribution-flow">
              <div className="distribution-source">
                <span>Multi-Channel Distribution</span>
                <span className="source-id">E</span>
              </div>
              <div className="distribution-arrows">
                <div className="arrow-branch"></div>
              </div>
              <div className="distribution-targets">
                {distributionChannels.map(channel => (
                  <div key={channel.id} className="target-badge">
                    {channel.icon} {channel.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/owner/agents')}>
              <span className="action-icon">👥</span>
              <span>Manage Agents</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/owner/properties')}>
              <span className="action-icon">🏠</span>
              <span>All Properties</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/owner/reports')}>
              <span className="action-icon">📊</span>
              <span>Reports</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/owner/settings')}>
              <span className="action-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </div>

        <div className="company-info">
          <h2>Company Information</h2>
          <div className="info-cards">
            <div className="info-card">
              <h3>White Caves Real Estate LLC</h3>
              <p><strong>Address:</strong> Office D-72, El-Shaye-4, Port Saeed, Dubai</p>
              <p><strong>Phone:</strong> +971 4 335 0592</p>
              <p><strong>Mobile:</strong> +971 56 361 6136</p>
            </div>
            <div className="info-card license">
              <h3>License Information</h3>
              <p><strong>RERA Registered:</strong> Yes</p>
              <p><strong>DLD Licensed:</strong> Active</p>
              <p><strong>Established:</strong> 2009</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
