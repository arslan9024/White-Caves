import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoleNavigation from '../../components/RoleNavigation';
import '../RolePages.css';

export default function BuyerDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Saved Properties', value: '12', icon: '❤️' },
    { label: 'Scheduled Viewings', value: '3', icon: '📅' },
    { label: 'Price Alerts', value: '5', icon: '🔔' },
    { label: 'Properties Viewed', value: '28', icon: '👁️' },
  ];

  const savedProperties = [
    { id: 1, title: 'Palm Jumeirah Villa', price: 'AED 45M', beds: 6, type: 'Villa', status: 'Available' },
    { id: 2, title: 'Downtown Penthouse', price: 'AED 28M', beds: 4, type: 'Penthouse', status: 'Price Drop' },
    { id: 3, title: 'Marina Apartment', price: 'AED 3.5M', beds: 2, type: 'Apartment', status: 'New' },
  ];

  const upcomingViewings = [
    { property: 'Palm Jumeirah Villa', date: 'Tomorrow', time: '10:00 AM', agent: 'Ahmed Hassan' },
    { property: 'Downtown Penthouse', date: 'Mar 5', time: '2:00 PM', agent: 'Sara Ahmed' },
  ];

  return (
    <div className="role-page">
      <RoleNavigation role="buyer" />
      
      <div className="role-page-content">
        <div className="page-header">
          <h1>Buyer Dashboard</h1>
          <p>Find your dream property in Dubai</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
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
              <span className="link-desc">Calculate monthly payments</span>
            </Link>
            <Link to="/buyer/dld-fees" className="quick-link-card">
              <span className="link-icon">🏛️</span>
              <span className="link-title">DLD Fee Calculator</span>
              <span className="link-desc">Property transfer costs</span>
            </Link>
            <Link to="/buyer/title-deed-registration" className="quick-link-card">
              <span className="link-icon">📜</span>
              <span className="link-title">Title Deed Registration</span>
              <span className="link-desc">Registration process guide</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Saved Properties</h3>
            <div className="items-list">
              {savedProperties.map(property => (
                <div key={property.id} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{property.title}</span>
                    <span className="item-subtitle">{property.type} · {property.beds} beds</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-price">{property.price}</span>
                    <span className={`item-status ${property.status.toLowerCase().replace(' ', '-')}`}>{property.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/buyer/saved-properties" className="btn btn-link">View All →</Link>
          </div>

          <div className="dashboard-card">
            <h3>Upcoming Viewings</h3>
            <div className="items-list">
              {upcomingViewings.map((viewing, index) => (
                <div key={index} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{viewing.property}</span>
                    <span className="item-subtitle">Agent: {viewing.agent}</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-date">{viewing.date}</span>
                    <span className="item-time">{viewing.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/buyer/viewings" className="btn btn-link">View Calendar →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
