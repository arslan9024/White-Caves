import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UnifiedDashboardLayout from '../../components/layout/UnifiedDashboardLayout';
import { DataCard, DataCardGrid, DataList, DataListItem, ActionButton } from '../../components/common';
import '../RolePages.css';

const STATS = [
  { label: 'Active Lease', value: '1', icon: '📋' },
  { label: 'Days Remaining', value: '245', icon: '📅' },
  { label: 'Next Payment', value: 'Jan 1', icon: '💰' },
  { label: 'Maintenance Requests', value: '0', icon: '🔧' }
];

export default function TenantDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const user = useSelector(state => state.auth?.user);

  const handleLogout = () => {
    console.log('Logout initiated');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
      default:
        return (
          <div className="tenant-dashboard-content">
            <div className="stats-grid">
              {STATS.map((stat, index) => (
                <div key={index} className="stat-card">
                  <span className="stat-icon">{stat.icon}</span>
                  <div className="stat-info">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <DataCardGrid columns={2}>
              <DataCard title="Current Rental">
                <div className="rental-info">
                  <p className="rental-address">No active rental found</p>
                  <p className="rental-detail">Browse available properties to find your next home</p>
                  <Link to="/" className="btn btn-primary">Browse Properties</Link>
                </div>
              </DataCard>

              <DataCard title="Payment History">
                <div className="empty-state">
                  <span className="empty-icon">💳</span>
                  <p>No payment history yet</p>
                </div>
              </DataCard>

              <DataCard title="Maintenance Requests">
                <div className="empty-state">
                  <span className="empty-icon">🔧</span>
                  <p>No maintenance requests</p>
                  <button className="btn btn-secondary">Submit Request</button>
                </div>
              </DataCard>

              <DataCard title="Documents">
                <div className="empty-state">
                  <span className="empty-icon">📄</span>
                  <p>No documents available</p>
                </div>
              </DataCard>
            </DataCardGrid>
          </div>
        );
    }
  };

  return (
    <UnifiedDashboardLayout
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      role="tenant"
    >
      {renderTabContent()}
    </UnifiedDashboardLayout>
  );
}
