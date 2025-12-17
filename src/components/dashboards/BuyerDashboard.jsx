import React, { useState } from 'react';
import MortgageCalculator from '../MortgageCalculator';
import './RoleDashboards.css';

export default function BuyerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Saved Properties', value: '12', icon: '❤️', change: 'In your wishlist' },
    { label: 'Scheduled Viewings', value: '3', icon: '📅', change: 'This week' },
    { label: 'Properties Viewed', value: '18', icon: '👁️', change: 'Last 30 days' },
    { label: 'Price Alerts', value: '5', icon: '🔔', change: 'Active alerts' },
  ];

  const savedProperties = [
    { id: 1, title: 'Palm Jumeirah Villa', price: 'AED 45M', beds: 6, baths: 7, sqft: '12,000', status: 'Available', type: 'Villa' },
    { id: 2, title: 'Downtown Penthouse', price: 'AED 28M', beds: 4, baths: 5, sqft: '6,500', status: 'Available', type: 'Penthouse' },
    { id: 3, title: 'Marina Apartment', price: 'AED 3.5M', beds: 2, baths: 2, sqft: '1,800', status: 'Price Dropped', type: 'Apartment' },
    { id: 4, title: 'Emirates Hills Villa', price: 'AED 65M', beds: 7, baths: 9, sqft: '15,000', status: 'New Listing', type: 'Villa' },
  ];

  const upcomingViewings = [
    { property: 'Palm Jumeirah Villa', agent: 'Ahmed Hassan', date: 'Tomorrow', time: '10:00 AM', address: 'Frond L, Palm Jumeirah' },
    { property: 'Emirates Hills Estate', agent: 'Sara Ahmed', date: 'Mar 5', time: '2:00 PM', address: 'Sector E, Emirates Hills' },
    { property: 'Downtown Apartment', agent: 'Mohammed Ali', date: 'Mar 6', time: '4:00 PM', address: 'Boulevard Point, Downtown' },
  ];

  const priceAlerts = [
    { area: 'Dubai Marina 2BR', criteria: 'Under AED 2M', matches: 3 },
    { area: 'Downtown 3BR', criteria: 'Under AED 4M', matches: 1 },
    { area: 'Palm Jumeirah Villa', criteria: 'Under AED 30M', matches: 2 },
  ];

  const buyingGuide = [
    { step: 1, title: 'Get Pre-Approved', description: 'Secure mortgage pre-approval to know your budget', status: 'completed' },
    { step: 2, title: 'Find Properties', description: 'Search and save properties that match your criteria', status: 'in-progress' },
    { step: 3, title: 'Schedule Viewings', description: 'View properties with your agent', status: 'pending' },
    { step: 4, title: 'Make an Offer', description: 'Submit your offer through your agent', status: 'pending' },
    { step: 5, title: 'Documentation', description: 'Complete Form B and arrange payment', status: 'pending' },
    { step: 6, title: 'Transfer', description: 'Complete property transfer at DLD', status: 'pending' },
  ];

  const marketInfo = [
    { title: 'Transfer Fee', value: '4%', description: 'Of property value (2% each party)' },
    { title: 'Agent Commission', value: '2%', description: 'Plus 5% VAT' },
    { title: 'Mortgage LTV', value: '75-80%', description: 'For expats on ready properties' },
    { title: 'DEWA Deposit', value: 'AED 2K-4K', description: 'Refundable utility deposit' },
  ];

  return (
    <div className="role-dashboard buyer-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Buyer Dashboard</h1>
          <p>Welcome back, {user?.name || 'Buyer'}! Find your dream property in Dubai.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">Search Properties</button>
          <button className="btn btn-secondary">+ New Alert</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved Properties</button>
        <button className={`tab ${activeTab === 'viewings' ? 'active' : ''}`} onClick={() => setActiveTab('viewings')}>Viewings</button>
        <button className={`tab ${activeTab === 'mortgage' ? 'active' : ''}`} onClick={() => setActiveTab('mortgage')}>Mortgage Calculator</button>
        <button className={`tab ${activeTab === 'guide' ? 'active' : ''}`} onClick={() => setActiveTab('guide')}>Buying Guide</button>
        <button className={`tab ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>Price Alerts</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card">
              <h3>Saved Properties</h3>
              <div className="saved-properties-list">
                {savedProperties.slice(0, 3).map(property => (
                  <div key={property.id} className="saved-property-item">
                    <div className="property-thumb">🏠</div>
                    <div className="property-info">
                      <span className="property-title">{property.title}</span>
                      <span className="property-details">{property.type} · {property.beds} beds · {property.sqft} sqft</span>
                    </div>
                    <div className="property-meta">
                      <span className="property-price">{property.price}</span>
                      <span className={`property-status ${property.status.toLowerCase().replace(' ', '-')}`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Saved →</button>
            </div>

            <div className="dashboard-card">
              <h3>Upcoming Viewings</h3>
              <div className="viewings-list">
                {upcomingViewings.map((viewing, index) => (
                  <div key={index} className="viewing-item">
                    <div className="viewing-info">
                      <span className="viewing-property">{viewing.property}</span>
                      <span className="viewing-agent">with {viewing.agent}</span>
                      <span className="viewing-address">{viewing.address}</span>
                    </div>
                    <div className="viewing-time">
                      <span className="viewing-date">{viewing.date}</span>
                      <span>{viewing.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">Schedule More →</button>
            </div>

            <div className="dashboard-card">
              <h3>Buying Costs Overview</h3>
              <div className="costs-grid">
                {marketInfo.map((info, index) => (
                  <div key={index} className="cost-item">
                    <span className="cost-title">{info.title}</span>
                    <span className="cost-value">{info.value}</span>
                    <span className="cost-desc">{info.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Your Buying Journey</h3>
              <div className="journey-steps">
                {buyingGuide.slice(0, 4).map((step) => (
                  <div key={step.step} className={`journey-step ${step.status}`}>
                    <span className="step-number">{step.step}</span>
                    <div className="step-info">
                      <span className="step-title">{step.title}</span>
                      <span className="step-status">{step.status === 'completed' ? '✅ Completed' : step.status === 'in-progress' ? '🔄 In Progress' : '⏳ Pending'}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View Full Guide →</button>
            </div>

            <div className="dashboard-card">
              <h3>Price Alerts</h3>
              <div className="alerts-list">
                {priceAlerts.map((alert, index) => (
                  <div key={index} className="alert-item">
                    <div className="alert-info">
                      <span className="alert-property">{alert.area}</span>
                      <span className="alert-criteria">{alert.criteria}</span>
                    </div>
                    <span className="alert-matches">{alert.matches} matches</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">Manage Alerts →</button>
            </div>

            <div className="dashboard-card">
              <h3>Quick Mortgage Estimate</h3>
              <div className="quick-mortgage">
                <p>Calculate your monthly payments and see how much you can afford.</p>
                <div className="mortgage-preview">
                  <div className="mortgage-stat">
                    <span className="stat-label">Typical Rate</span>
                    <span className="stat-value">4.5% - 5.5%</span>
                  </div>
                  <div className="mortgage-stat">
                    <span className="stat-label">Max LTV (Expat)</span>
                    <span className="stat-value">75-80%</span>
                  </div>
                  <div className="mortgage-stat">
                    <span className="stat-label">Max Term</span>
                    <span className="stat-value">25 Years</span>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveTab('mortgage')}>
                  Open Calculator
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="dashboard-card full-width">
            <h3>My Saved Properties</h3>
            <div className="saved-grid">
              {savedProperties.map(property => (
                <div key={property.id} className="saved-card">
                  <div className="saved-card-image">🏠</div>
                  <div className="saved-card-content">
                    <h4>{property.title}</h4>
                    <p className="property-specs">{property.type} · {property.beds} Beds · {property.baths} Baths · {property.sqft} sqft</p>
                    <p className="property-price">{property.price}</p>
                    <span className={`property-status ${property.status.toLowerCase().replace(' ', '-')}`}>{property.status}</span>
                    <div className="saved-card-actions">
                      <button className="btn btn-primary">Schedule Viewing</button>
                      <button className="btn btn-secondary">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'viewings' && (
          <div className="dashboard-card">
            <h3>Viewing Schedule</h3>
            <div className="viewings-full-list">
              {upcomingViewings.map((viewing, index) => (
                <div key={index} className="viewing-full-item">
                  <div className="viewing-info">
                    <span className="viewing-property">{viewing.property}</span>
                    <span className="viewing-agent">Agent: {viewing.agent}</span>
                    <span className="viewing-address">{viewing.address}</span>
                  </div>
                  <div className="viewing-datetime">
                    <span className="viewing-date">{viewing.date}</span>
                    <span className="viewing-time">{viewing.time}</span>
                  </div>
                  <div className="viewing-actions">
                    <button className="btn btn-sm">Reschedule</button>
                    <button className="btn btn-sm btn-secondary">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mortgage' && (
          <div className="dashboard-card full-width mortgage-section">
            <h3>Mortgage Calculator</h3>
            <p className="section-description">Plan your property investment with our comprehensive mortgage calculator.</p>
            <MortgageCalculator />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="dashboard-card full-width">
            <h3>Complete Buying Guide</h3>
            <div className="buying-guide">
              {buyingGuide.map((step) => (
                <div key={step.step} className={`guide-step ${step.status}`}>
                  <div className="guide-step-header">
                    <span className="step-circle">{step.step}</span>
                    <div className="step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                    <span className={`step-badge ${step.status}`}>
                      {step.status === 'completed' ? '✅ Done' : step.status === 'in-progress' ? '🔄 Current' : '⏳ Upcoming'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="guide-info-cards">
              <div className="info-card">
                <h4>📋 Required Documents</h4>
                <ul>
                  <li>Valid Emirates ID or Passport</li>
                  <li>Proof of income (salary certificate)</li>
                  <li>Bank statements (6 months)</li>
                  <li>Mortgage pre-approval letter</li>
                </ul>
              </div>
              <div className="info-card">
                <h4>💰 Payment Structure</h4>
                <ul>
                  <li>10% deposit on signing MOU</li>
                  <li>4% DLD transfer fee</li>
                  <li>2% agency commission + VAT</li>
                  <li>AED 4,000 trustee fee</li>
                </ul>
              </div>
              <div className="info-card">
                <h4>⏱️ Timeline</h4>
                <ul>
                  <li>Property search: 2-4 weeks</li>
                  <li>Mortgage approval: 1-2 weeks</li>
                  <li>Documentation: 1-2 weeks</li>
                  <li>Transfer: 1 day at DLD</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="dashboard-card">
            <h3>Price Alerts</h3>
            <p className="section-description">Get notified when properties matching your criteria are listed or prices drop.</p>
            <div className="alerts-full-list">
              {priceAlerts.map((alert, index) => (
                <div key={index} className="alert-full-item">
                  <div className="alert-info">
                    <span className="alert-area">{alert.area}</span>
                    <span className="alert-criteria">{alert.criteria}</span>
                  </div>
                  <span className="alert-matches">{alert.matches} matching properties</span>
                  <div className="alert-actions">
                    <button className="btn btn-sm btn-primary">View Matches</button>
                    <button className="btn btn-sm">Edit</button>
                    <button className="btn btn-sm btn-secondary">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary">+ Create New Alert</button>
          </div>
        )}
      </div>
    </div>
  );
}
