import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UnifiedDashboardLayout from '../../components/layout/UnifiedDashboardLayout';
import { DataCard, DataCardGrid, DataList, DataListItem, ActionButton } from '../../components/common';
import '../RolePages.css';

// Type definitions
interface Stat {
  label: string;
  value: string;
  icon: string;
}

interface TenantUser {
  id?: string;
  email?: string;
}

const STATS: Stat[] = [
  { label: 'Active Lease', value: '1', icon: '📋' },
  { label: 'Days Remaining', value: '245', icon: '📅' },
  { label: 'Next Payment', value: 'Jan 1', icon: '💰' },
  { label: 'Maintenance Requests', value: '0', icon: '🔧' }
];

const TenantDashboardPage: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const user = useSelector((state: any) => state.auth?.user) as TenantUser | undefined;

  const handleLogout = (): void => {
    console.log('Logout initiated');
  };

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
  };

  const renderTabContent = (): React.ReactNode => {
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

export default TenantDashboardPage;
