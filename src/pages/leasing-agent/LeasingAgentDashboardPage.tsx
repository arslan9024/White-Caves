import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import '../RolePages.css';
import './LeasingAgentDashboard.css';

interface LeasingAgentDashboardPageProps {}

interface Lead {
  id: number;
  name: string;
  requirement: string;
  budget: string;
  status: string;
  lastContact: string;
  score: number;
}

interface Viewing {
  property: string;
  client: string;
  time: string;
  landlord: string;
  status: string;
}

interface Listing {
  id: number;
  title: string;
  location: string;
  price: string;
  views: number;
  inquiries: number;
  daysListed: number;
}

const LeasingAgentDashboardPage: FC<LeasingAgentDashboardPageProps> = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const user = useSelector((state: any) => state.auth?.user);

  const LEADS: Lead[] = [
    { id: 1, name: 'Ahmed Al-Rashid', requirement: '2BR Marina', budget: 'AED 80-100K/yr', status: 'Hot', lastContact: 'Today', score: 92 },
    { id: 2, name: 'Sarah Johnson', requirement: 'Studio Downtown', budget: 'AED 50-70K/yr', status: 'Warm', lastContact: 'Yesterday', score: 75 },
    { id: 3, name: 'Mohammed Khan', requirement: '3BR JBR', budget: 'AED 150-180K/yr', status: 'New', lastContact: '2 days ago', score: 60 },
  ];

  const UPCOMING_VIEWINGS: Viewing[] = [
    { property: 'Marina View 2BR', client: 'Ahmed Al-Rashid', time: '2:00 PM', landlord: 'Emirates Properties', status: 'Confirmed' },
    { property: 'Downtown Studio', client: 'Sarah Johnson', time: '4:30 PM', landlord: 'Dubai Holdings', status: 'Pending' },
  ];

  const MY_LISTINGS: Listing[] = [
    { id: 1, title: 'Marina View 2BR', location: 'Dubai Marina', price: 'AED 95K/yr', views: 45, inquiries: 8, daysListed: 12 },
    { id: 2, title: 'Downtown Studio', location: 'Downtown Dubai', price: 'AED 65K/yr', views: 32, inquiries: 5, daysListed: 8 },
  ];

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
    sessionStorage.setItem('leasingAgentDashboardTab', tabId);
  };

  return (
    <div className="leasing-agent-dashboard no-sidebar">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Leasing Agent Dashboard</h1>
          <p>Manage leads, viewings, and rental listings</p>
        </div>

        <div className="tabs-navigation">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => handleTabChange('leads')}
          >
            Leads
          </button>
          <button
            className={`tab-btn ${activeTab === 'viewings' ? 'active' : ''}`}
            onClick={() => handleTabChange('viewings')}
          >
            Viewings
          </button>
          <button
            className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => handleTabChange('listings')}
          >
            Listings
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Active Listings</h3>
                <p className="stat-value">18</p>
              </div>
              <div className="stat-card">
                <h3>Today's Viewings</h3>
                <p className="stat-value">4</p>
              </div>
              <div className="stat-card">
                <h3>Hot Leads</h3>
                <p className="stat-value">8</p>
              </div>
              <div className="stat-card">
                <h3>This Month</h3>
                <p className="stat-value">12</p>
              </div>
            </div>

            <div className="overview-section">
              <div className="section-half">
                <h3>Top Leads</h3>
                <div className="leads-list">
                  {LEADS.slice(0, 3).map(lead => (
                    <div key={lead.id} className="lead-item">
                      <h4>{lead.name}</h4>
                      <p>{lead.requirement} • {lead.budget}</p>
                      <span className="status">{lead.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-half">
                <h3>Today's Viewings</h3>
                <div className="viewings-list">
                  {UPCOMING_VIEWINGS.map((viewing, index) => (
                    <div key={index} className="viewing-item">
                      <h4>{viewing.property}</h4>
                      <p>{viewing.client} at {viewing.time}</p>
                      <span className="status">{viewing.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="dashboard-content">
            <h3>Manage Leads</h3>
            <div className="leads-table">
              {LEADS.map(lead => (
                <div key={lead.id} className="table-row">
                  <span>{lead.name}</span>
                  <span>{lead.requirement}</span>
                  <span>{lead.budget}</span>
                  <span>{lead.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'viewings' && (
          <div className="dashboard-content">
            <h3>Scheduled Viewings</h3>
            <div className="viewings-table">
              {UPCOMING_VIEWINGS.map((viewing, index) => (
                <div key={index} className="table-row">
                  <span>{viewing.property}</span>
                  <span>{viewing.client}</span>
                  <span>{viewing.time}</span>
                  <span>{viewing.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="dashboard-content">
            <h3>My Listings</h3>
            <div className="listings-grid">
              {MY_LISTINGS.map(listing => (
                <div key={listing.id} className="listing-card">
                  <h4>{listing.title}</h4>
                  <p>{listing.location}</p>
                  <p>{listing.price}</p>
                  <div className="listing-stats">
                    <span>{listing.views} views</span>
                    <span>{listing.inquiries} inquiries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeasingAgentDashboardPage;
