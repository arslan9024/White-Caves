import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../RolePages.css';
import './BuyerDashboard.css';

export default function BuyerDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Saved Properties', value: '12', icon: '❤️', change: '+3', positive: true },
    { label: 'Scheduled Viewings', value: '3', icon: '📅', change: '2 upcoming', positive: true },
    { label: 'Price Alerts', value: '5', icon: '🔔', change: '1 triggered', positive: false },
    { label: 'Properties Viewed', value: '28', icon: '👁️', change: '+8 this week', positive: true },
  ];

  const savedProperties = [
    { id: 1, title: 'Palm Jumeirah Villa', price: 'AED 45,000,000', beds: 6, baths: 7, area: '12,500 sqft', type: 'Villa', status: 'Available', image: '🏝️' },
    { id: 2, title: 'Downtown Penthouse', price: 'AED 28,000,000', beds: 4, baths: 5, area: '6,800 sqft', type: 'Penthouse', status: 'Price Drop', image: '🏙️' },
    { id: 3, title: 'Marina Apartment', price: 'AED 3,500,000', beds: 2, baths: 3, area: '1,850 sqft', type: 'Apartment', status: 'New', image: '🌊' },
    { id: 4, title: 'Business Bay Studio', price: 'AED 1,200,000', beds: 0, baths: 1, area: '650 sqft', type: 'Studio', status: 'Hot Deal', image: '🏢' },
  ];

  const upcomingViewings = [
    { property: 'Palm Jumeirah Villa', date: 'Tomorrow', time: '10:00 AM', agent: 'Ahmed Hassan', status: 'Confirmed' },
    { property: 'Downtown Penthouse', date: 'Mar 5', time: '2:00 PM', agent: 'Sara Ahmed', status: 'Pending' },
    { property: 'Marina Apartment', date: 'Mar 8', time: '11:00 AM', agent: 'Mohammed Ali', status: 'Confirmed' },
  ];

  const priceAlerts = [
    { property: 'JBR Beach Residence', originalPrice: 'AED 4.2M', newPrice: 'AED 3.8M', change: '-9.5%', date: 'Today' },
    { property: 'Creek Harbour Tower', originalPrice: 'AED 2.1M', newPrice: 'AED 1.95M', change: '-7.1%', date: '2 days ago' },
  ];

  const recentlyViewed = [
    { id: 1, title: 'Emirates Hills Mansion', price: 'AED 85M', beds: 8, type: 'Mansion' },
    { id: 2, title: 'DIFC Office Tower', price: 'AED 15M', beds: '-', type: 'Commercial' },
    { id: 3, title: 'Jumeirah Golf Estates', price: 'AED 22M', beds: 5, type: 'Villa' },
  ];

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <div className="header-content">
            <h1>Welcome back, Buyer</h1>
            <p>Find your dream property in Dubai's most prestigious locations</p>
          </div>
          <div className="header-actions">
            <Link to="/properties" className="btn btn-primary">
              <span>🔍</span> Browse Properties
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card enhanced">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">{stat.icon}</span>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                <span className={`stat-change ${stat.positive ? 'positive' : 'neutral'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-links">
          <h3>Buyer Tools</h3>
          <div className="links-grid">
            <Link to="/buyer/mortgage-calculator" className="quick-link-card">
              <span className="link-icon">🧮</span>
              <span className="link-title">Mortgage Calculator</span>
              <span className="link-desc">Calculate monthly payments & affordability</span>
            </Link>
            <Link to="/buyer/dld-fees" className="quick-link-card">
              <span className="link-icon">🏛️</span>
              <span className="link-title">DLD Fee Calculator</span>
              <span className="link-desc">Property transfer costs & fees breakdown</span>
            </Link>
            <Link to="/buyer/title-deed-registration" className="quick-link-card">
              <span className="link-icon">📜</span>
              <span className="link-title">Title Deed Registration</span>
              <span className="link-desc">Step-by-step registration process</span>
            </Link>
            <Link to="/properties?type=offplan" className="quick-link-card">
              <span className="link-icon">🏗️</span>
              <span className="link-title">Off-Plan Projects</span>
              <span className="link-desc">New developments & payment plans</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Properties
          </button>
          <button 
            className={`tab-btn ${activeTab === 'viewings' ? 'active' : ''}`}
            onClick={() => setActiveTab('viewings')}
          >
            Viewings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            Price Alerts
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Saved Properties</h3>
                <Link to="/buyer/saved-properties" className="view-all">View All →</Link>
              </div>
              <div className="property-list">
                {savedProperties.slice(0, 3).map(property => (
                  <div key={property.id} className="property-item">
                    <div className="property-image">{property.image}</div>
                    <div className="property-info">
                      <span className="property-title">{property.title}</span>
                      <span className="property-specs">{property.beds} beds · {property.baths} baths · {property.area}</span>
                    </div>
                    <div className="property-meta">
                      <span className="property-price">{property.price}</span>
                      <span className={`property-status ${property.status.toLowerCase().replace(' ', '-')}`}>{property.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Upcoming Viewings</h3>
                <Link to="/buyer/viewings" className="view-all">View Calendar →</Link>
              </div>
              <div className="items-list">
                {upcomingViewings.map((viewing, index) => (
                  <div key={index} className="viewing-item">
                    <div className="viewing-date">
                      <span className="date-day">{viewing.date}</span>
                      <span className="date-time">{viewing.time}</span>
                    </div>
                    <div className="viewing-info">
                      <span className="viewing-property">{viewing.property}</span>
                      <span className="viewing-agent">with {viewing.agent}</span>
                    </div>
                    <span className={`viewing-status ${viewing.status.toLowerCase()}`}>{viewing.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Price Alerts</h3>
                <Link to="/buyer/alerts" className="view-all">Manage Alerts →</Link>
              </div>
              <div className="alerts-list">
                {priceAlerts.map((alert, index) => (
                  <div key={index} className="alert-item">
                    <div className="alert-info">
                      <span className="alert-property">{alert.property}</span>
                      <span className="alert-prices">
                        <span className="original-price">{alert.originalPrice}</span>
                        <span className="arrow">→</span>
                        <span className="new-price">{alert.newPrice}</span>
                      </span>
                    </div>
                    <div className="alert-meta">
                      <span className="price-change negative">{alert.change}</span>
                      <span className="alert-date">{alert.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recently Viewed</h3>
                <Link to="/buyer/history" className="view-all">View History →</Link>
              </div>
              <div className="items-list">
                {recentlyViewed.map(property => (
                  <div key={property.id} className="list-item compact">
                    <div className="item-info">
                      <span className="item-title">{property.title}</span>
                      <span className="item-subtitle">{property.type} · {property.beds !== '-' ? `${property.beds} beds` : 'Office'}</span>
                    </div>
                    <span className="item-price">{property.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="saved-properties-grid">
            {savedProperties.map(property => (
              <div key={property.id} className="saved-property-card">
                <div className="saved-property-image">{property.image}</div>
                <div className="saved-property-content">
                  <div className="saved-property-header">
                    <h4>{property.title}</h4>
                    <span className={`status-badge ${property.status.toLowerCase().replace(' ', '-')}`}>{property.status}</span>
                  </div>
                  <p className="saved-property-price">{property.price}</p>
                  <div className="saved-property-specs">
                    <span>🛏️ {property.beds} beds</span>
                    <span>🚿 {property.baths} baths</span>
                    <span>📐 {property.area}</span>
                  </div>
                  <div className="saved-property-actions">
                    <button className="btn btn-sm btn-primary">Schedule Viewing</button>
                    <button className="btn btn-sm btn-secondary">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'viewings' && (
          <div className="viewings-section">
            <div className="viewings-calendar-placeholder">
              <h3>Viewing Schedule</h3>
              <p>Your upcoming property viewings</p>
              <div className="viewings-list-full">
                {upcomingViewings.map((viewing, index) => (
                  <div key={index} className="viewing-card">
                    <div className="viewing-card-date">
                      <span className="date-label">{viewing.date}</span>
                      <span className="time-label">{viewing.time}</span>
                    </div>
                    <div className="viewing-card-details">
                      <h4>{viewing.property}</h4>
                      <p>Agent: {viewing.agent}</p>
                    </div>
                    <div className="viewing-card-actions">
                      <span className={`status-badge ${viewing.status.toLowerCase()}`}>{viewing.status}</span>
                      <button className="btn btn-sm btn-secondary">Reschedule</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-section">
            <div className="alerts-header">
              <h3>Your Price Alerts</h3>
              <button className="btn btn-primary btn-sm">+ Add New Alert</button>
            </div>
            <div className="alerts-grid">
              {priceAlerts.map((alert, index) => (
                <div key={index} className="alert-card">
                  <div className="alert-card-header">
                    <h4>{alert.property}</h4>
                    <span className="alert-badge">{alert.date}</span>
                  </div>
                  <div className="alert-price-comparison">
                    <div className="price-box original">
                      <span className="price-label">Original</span>
                      <span className="price-value">{alert.originalPrice}</span>
                    </div>
                    <div className="price-arrow">→</div>
                    <div className="price-box current">
                      <span className="price-label">Current</span>
                      <span className="price-value">{alert.newPrice}</span>
                    </div>
                  </div>
                  <div className="alert-card-footer">
                    <span className="price-change-badge negative">{alert.change} Price Drop</span>
                    <button className="btn btn-sm btn-primary">View Property</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
