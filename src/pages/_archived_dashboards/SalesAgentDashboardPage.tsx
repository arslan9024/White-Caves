import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import '../RolePages.css';
import './SalesAgentDashboard.css';

interface SalesAgentDashboardPageProps {}

interface Lead {
  id: number;
  name: string;
  requirement: string;
  budget: string;
  status: string;
  source: string;
  score: number;
}

interface Deal {
  id: number;
  property: string;
  buyer: string;
  price: string;
  stage: string;
  progress: number;
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

const SalesAgentDashboardPage: FC<SalesAgentDashboardPageProps> = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const user = useSelector((state: any) => state.auth?.user);

  const LEADS: Lead[] = [
    { id: 1, name: 'John Smith', requirement: 'Palm Villa', budget: 'AED 40-50M', status: 'Hot', source: 'Website', score: 95 },
    { id: 2, name: 'Emma Wilson', requirement: 'Downtown Penthouse', budget: 'AED 25-35M', status: 'Warm', source: 'Referral', score: 78 },
    { id: 3, name: 'Omar Hassan', requirement: 'Marina 3BR', budget: 'AED 3-5M', status: 'New', source: 'Walk-in', score: 65 },
  ];

  const ACTIVE_DEALS: Deal[] = [
    { id: 1, property: 'Palm Jumeirah Villa', buyer: 'Michael Brown', price: 'AED 45M', stage: 'Negotiating', progress: 60 },
    { id: 2, property: 'Downtown Penthouse', buyer: 'Lisa Chen', price: 'AED 28M', stage: 'Documentation', progress: 75 },
  ];

  const MY_LISTINGS: Listing[] = [
    { id: 1, title: 'Palm Jumeirah Villa', location: 'Palm Jumeirah', price: 'AED 45M', views: 156, inquiries: 12, daysListed: 18 },
    { id: 2, title: 'Downtown Penthouse', location: 'Downtown Dubai', price: 'AED 28M', views: 89, inquiries: 8, daysListed: 12 },
  ];

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
    sessionStorage.setItem('salesAgentDashboardTab', tabId);
  };

  return (
    <div className="sales-agent-dashboard no-sidebar">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Sales Agent Dashboard</h1>
          <p>Manage leads, deals, and property listings</p>
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
            className={`tab-btn ${activeTab === 'deals' ? 'active' : ''}`}
            onClick={() => handleTabChange('deals')}
          >
            Active Deals
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
                <p className="stat-value">24</p>
              </div>
              <div className="stat-card">
                <h3>This Week Viewings</h3>
                <p className="stat-value">12</p>
              </div>
              <div className="stat-card">
                <h3>Deals Closed (YTD)</h3>
                <p className="stat-value">15</p>
              </div>
              <div className="stat-card">
                <h3>Commission</h3>
                <p className="stat-value">AED 485K</p>
              </div>
            </div>

            <div className="overview-section">
              <div className="section-half">
                <h3>Top Leads</h3>
                <div className="leads-list">
                  {LEADS.filter(l => l.status === 'Hot').slice(0, 3).map(lead => (
                    <div key={lead.id} className="lead-item">
                      <h4>{lead.name}</h4>
                      <p>{lead.requirement} • {lead.budget}</p>
                      <span className="score">Score: {lead.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-half">
                <h3>Active Deals</h3>
                <div className="deals-list">
                  {ACTIVE_DEALS.map(deal => (
                    <div key={deal.id} className="deal-item">
                      <h4>{deal.property}</h4>
                      <p>{deal.buyer} • {deal.price}</p>
                      <span className="stage">{deal.stage}</span>
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

        {activeTab === 'deals' && (
          <div className="dashboard-content">
            <h3>Track Deals</h3>
            <div className="deals-table">
              {ACTIVE_DEALS.map(deal => (
                <div key={deal.id} className="table-row">
                  <span>{deal.property}</span>
                  <span>{deal.buyer}</span>
                  <span>{deal.price}</span>
                  <span>{deal.stage}</span>
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
                  <p className="price">{listing.price}</p>
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

export default SalesAgentDashboardPage;
