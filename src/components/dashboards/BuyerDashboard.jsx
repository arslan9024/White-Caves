import React, { useState } from 'react';
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
    { id: 1, title: 'Palm Jumeirah Villa', price: 'AED 45M', beds: 6, baths: 7, sqft: '12,000', status: 'Available' },
    { id: 2, title: 'Downtown Penthouse', price: 'AED 28M', beds: 4, baths: 5, sqft: '6,500', status: 'Available' },
    { id: 3, title: 'Marina Apartment', price: 'AED 3.5M', beds: 2, baths: 2, sqft: '1,800', status: 'Price Dropped' },
  ];

  const upcomingViewings = [
    { property: 'Palm Jumeirah Villa', agent: 'Ahmed Hassan', date: 'Tomorrow', time: '10:00 AM' },
    { property: 'Emirates Hills Estate', agent: 'Sara Ahmed', date: 'Mar 5', time: '2:00 PM' },
  ];

  const priceAlerts = [
    { property: 'Dubai Marina 2BR', criteria: 'Under AED 2M', matches: 3 },
    { property: 'Downtown 3BR', criteria: 'Under AED 4M', matches: 1 },
  ];

  return (
    <div className="role-dashboard buyer-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Buyer Dashboard</h1>
          <p>Welcome back, {user?.name || 'Buyer'}! Find your dream property.</p>
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
        <button className={`tab ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>Price Alerts</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card">
              <h3>Saved Properties</h3>
              <div className="saved-properties-list">
                {savedProperties.map(property => (
                  <div key={property.id} className="saved-property-item">
                    <div className="property-thumb">🏠</div>
                    <div className="property-info">
                      <span className="property-title">{property.title}</span>
                      <span className="property-details">{property.beds} beds · {property.baths} baths · {property.sqft} sqft</span>
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
              <h3>Price Alerts</h3>
              <div className="alerts-list">
                {priceAlerts.map((alert, index) => (
                  <div key={index} className="alert-item">
                    <div className="alert-info">
                      <span className="alert-property">{alert.property}</span>
                      <span className="alert-criteria">{alert.criteria}</span>
                    </div>
                    <span className="alert-matches">{alert.matches} matches</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">Manage Alerts →</button>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="dashboard-card">
            <h3>My Saved Properties</h3>
            <p className="placeholder-text">View and manage your saved property wishlist.</p>
          </div>
        )}

        {activeTab === 'viewings' && (
          <div className="dashboard-card">
            <h3>Viewing Schedule</h3>
            <p className="placeholder-text">Manage your property viewing appointments.</p>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="dashboard-card">
            <h3>Price Alerts</h3>
            <p className="placeholder-text">Set up alerts for properties matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
