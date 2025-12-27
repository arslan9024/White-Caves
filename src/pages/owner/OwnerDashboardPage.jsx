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

  const topFlowSteps = [
    { id: '1', label: 'Client Signing', color: '#e8e0f0' },
    { id: '2', label: 'Property Valuation', color: '#e8e0f0' },
    { id: '3', label: 'Professional Photography/Virtual Tour', color: '#e8e0f0' },
    { id: '4', label: 'Listing Creation', color: '#e8e0f0' },
    { id: '5', label: 'Multi-Channel Distribution', color: '#e8e0f0' }
  ];

  const distributionChannels = [
    { id: 'E1', label: 'Property Portals', color: '#fff9c4' },
    { id: 'E2', label: 'Social Media', color: '#fff9c4' },
    { id: 'E3', label: 'Email Campaign', color: '#fff9c4' },
    { id: 'E4', label: 'Company Website', color: '#fff9c4' }
  ];

  const bottomFlowSteps = [
    { id: '6', label: 'Lead Management', color: '#e8e0f0' },
    { id: '7', label: 'Viewing Coordination', color: '#e8e0f0' },
    { id: '8', label: 'Offer Management', color: '#e8e0f0' },
    { id: '9', label: 'Negotiation', color: '#e8e0f0' },
    { id: '10', label: 'Transaction Processing', color: '#e8e0f0' },
    { id: '11', label: 'Handover', color: '#e8e0f0' },
    { id: '12', label: 'Post-Sale Follow-up', color: '#e8e0f0' }
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
          
          <div className="flowchart-container">
            <div className="flowchart-top-row">
              {topFlowSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flowchart-node" style={{ backgroundColor: step.color }}>
                    {step.label}
                  </div>
                  {index < topFlowSteps.length - 1 && <div className="flowchart-arrow">→</div>}
                </React.Fragment>
              ))}
            </div>

            <div className="flowchart-middle">
              <div className="flowchart-connector-down"></div>
              <div className="digital-distribution-box">
                <div className="distribution-header">Digital Distribution</div>
                <div className="distribution-items">
                  {distributionChannels.map(channel => (
                    <div key={channel.id} className="distribution-item" style={{ backgroundColor: channel.color }}>
                      {channel.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flowchart-connector-down"></div>
            </div>

            <div className="flowchart-bottom-row">
              {bottomFlowSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flowchart-node" style={{ backgroundColor: step.color }}>
                    {step.label}
                  </div>
                  {index < bottomFlowSteps.length - 1 && <div className="flowchart-arrow">→</div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn secret" onClick={() => navigate('/owner/business-model')}>
              <span className="action-icon">📋</span>
              <span>Business Model</span>
            </button>
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
            <button className="action-btn system-health" onClick={() => navigate('/owner/system-health')}>
              <span className="action-icon">🩺</span>
              <span>System Health</span>
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
