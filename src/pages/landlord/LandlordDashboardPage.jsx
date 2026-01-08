import React, { useState } from 'react';
import RolePageLayout from '../../components/layout/RolePageLayout';
import {
  StatCard,
  StatCardGrid,
  TabbedPanel,
  DataCard,
  DataCardGrid,
  DataList,
  DataListItem,
  QuickLinks,
  ActionButton
} from '../../components/common';
import './LandlordDashboard.css';

const LANDLORD_STATS = [
  { icon: '🏢', value: '6', label: 'Total Properties', change: 'Portfolio: AED 15.2M', positive: true },
  { icon: '🔑', value: '5', label: 'Occupied', change: '83% occupancy', positive: true },
  { icon: '📋', value: '1', label: 'Available', change: 'Ready to rent', positive: false },
  { icon: '💰', value: 'AED 125K', label: 'Monthly Income', change: '+8% vs last month', positive: true },
];

const QUICK_LINKS = [
  { path: '/landlord/rental-management', icon: '🏠', title: 'Rental Management', description: 'Manage all rentals' },
  { path: '/landlord/tenants', icon: '👥', title: 'My Tenants', description: 'View tenant details' },
  { path: '/landlord/finances', icon: '💰', title: 'Finances', description: 'Track income & expenses' },
  { path: '/landlord/maintenance', icon: '🔧', title: 'Maintenance', description: 'Handle repairs' },
];

const PROPERTIES = [
  { id: 1, name: 'Marina View 2BR', location: 'Dubai Marina', status: 'Occupied', rent: 'AED 95,000/yr', tenant: 'Ahmed Al-Rashid', leaseEnd: 'Dec 2024', paymentStatus: 'Paid' },
  { id: 2, name: 'Downtown Studio', location: 'Downtown Dubai', status: 'Occupied', rent: 'AED 65,000/yr', tenant: 'Sarah Johnson', leaseEnd: 'Jun 2024', paymentStatus: 'Due Soon' },
  { id: 3, name: 'JBR 3BR Apartment', location: 'JBR', status: 'Available', rent: 'AED 180,000/yr', tenant: '-', leaseEnd: '-', paymentStatus: '-' },
  { id: 4, name: 'Business Bay Office', location: 'Business Bay', status: 'Occupied', rent: 'AED 250,000/yr', tenant: 'Tech Solutions LLC', leaseEnd: 'Mar 2025', paymentStatus: 'Paid' },
];

const MAINTENANCE_REQUESTS = [
  { id: 1, property: 'Marina View 2BR', issue: 'AC maintenance required', priority: 'Medium', date: 'Today', status: 'Pending' },
  { id: 2, property: 'Downtown Studio', issue: 'Water heater replacement', priority: 'High', date: 'Yesterday', status: 'In Progress' },
  { id: 3, property: 'Business Bay Office', issue: 'Parking access card issue', priority: 'Low', date: '3 days ago', status: 'Resolved' },
];

const FINANCIAL_SUMMARY = {
  totalIncome: 'AED 590,000',
  collected: 'AED 495,000',
  pending: 'AED 95,000',
  expenses: 'AED 45,000',
  netIncome: 'AED 450,000',
};

const UPCOMING_LEASE_EVENTS = [
  { property: 'Downtown Studio', event: 'Lease Renewal', date: 'Jun 15, 2024', daysLeft: 45 },
  { property: 'Marina View 2BR', event: 'Rent Review', date: 'Nov 1, 2024', daysLeft: 180 },
  { property: 'Business Bay Office', event: 'Lease Expiry', date: 'Mar 15, 2025', daysLeft: 320 },
];

export default function LandlordDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'properties', label: 'Properties', icon: '🏢', badge: PROPERTIES.length },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧', badge: MAINTENANCE_REQUESTS.filter(m => m.status !== 'Resolved').length },
    { id: 'finances', label: 'Finances', icon: '💰' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '239, 68, 68';
      case 'medium': return '245, 158, 11';
      case 'low': return '16, 185, 129';
      default: return '107, 114, 128';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return '16, 185, 129';
      case 'Due Soon': return '245, 158, 11';
      case 'Overdue': return '239, 68, 68';
      default: return '107, 114, 128';
    }
  };

  return (
    <RolePageLayout
      title="Landlord Dashboard"
      subtitle="Manage your rental property portfolio"
      role="landlord"
      actions={
        <ActionButton 
          icon="➕" 
          label="Add Property" 
          to="/landlord/add-property" 
          variant="primary"
        />
      }
    >
      <StatCardGrid columns={4}>
        {LANDLORD_STATS.map((stat, index) => (
          <StatCard key={index} {...stat} variant="landlord" />
        ))}
      </StatCardGrid>

      <QuickLinks title="Landlord Tools" links={QUICK_LINKS} columns={4} />

      <TabbedPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        storeKey="landlordDashboard"
      />

      {activeTab === 'overview' && (
        <DataCardGrid columns={2}>
          <DataCard title="My Properties" viewAllLink="/landlord/properties">
            <DataList>
              {PROPERTIES.slice(0, 3).map(property => (
                <DataListItem
                  key={property.id}
                  icon="🏢"
                  title={property.name}
                  subtitle={`${property.location} · ${property.rent}`}
                  status={property.status}
                  statusColor={property.status === 'Occupied' ? '16, 185, 129' : '59, 130, 246'}
                  meta={property.tenant !== '-' ? property.tenant : 'No tenant'}
                />
              ))}
            </DataList>
          </DataCard>

          <DataCard title="Maintenance Requests" viewAllLink="/landlord/maintenance">
            <DataList>
              {MAINTENANCE_REQUESTS.map(request => (
                <DataListItem
                  key={request.id}
                  icon="🔧"
                  title={request.issue}
                  subtitle={`${request.property} · ${request.date}`}
                  status={request.priority}
                  statusColor={getPriorityColor(request.priority)}
                />
              ))}
            </DataList>
          </DataCard>

          <DataCard title="Financial Summary" fullWidth>
            <div className="financial-grid">
              <div className="financial-item">
                <span className="financial-label">Total Income</span>
                <span className="financial-value">{FINANCIAL_SUMMARY.totalIncome}</span>
              </div>
              <div className="financial-item collected">
                <span className="financial-label">Collected</span>
                <span className="financial-value">{FINANCIAL_SUMMARY.collected}</span>
              </div>
              <div className="financial-item pending">
                <span className="financial-label">Pending</span>
                <span className="financial-value">{FINANCIAL_SUMMARY.pending}</span>
              </div>
              <div className="financial-item expenses">
                <span className="financial-label">Expenses</span>
                <span className="financial-value">{FINANCIAL_SUMMARY.expenses}</span>
              </div>
              <div className="financial-item net">
                <span className="financial-label">Net Income</span>
                <span className="financial-value">{FINANCIAL_SUMMARY.netIncome}</span>
              </div>
            </div>
          </DataCard>

          <DataCard title="Upcoming Lease Events" viewAllLink="/landlord/leases" fullWidth>
            <DataList>
              {UPCOMING_LEASE_EVENTS.map((event, index) => (
                <DataListItem
                  key={index}
                  icon="📅"
                  title={event.property}
                  subtitle={`${event.event} on ${event.date}`}
                  badge={`${event.daysLeft} days`}
                  badgeColor={event.daysLeft <= 60 ? '239, 68, 68' : event.daysLeft <= 180 ? '245, 158, 11' : '16, 185, 129'}
                />
              ))}
            </DataList>
          </DataCard>
        </DataCardGrid>
      )}

      {activeTab === 'properties' && (
        <DataCard title={`All Properties (${PROPERTIES.length})`}>
          <DataList>
            {PROPERTIES.map(property => (
              <DataListItem
                key={property.id}
                icon="🏢"
                title={property.name}
                subtitle={`${property.location} · Tenant: ${property.tenant}`}
                meta={property.rent}
                status={property.paymentStatus !== '-' ? property.paymentStatus : null}
                statusColor={getPaymentStatusColor(property.paymentStatus)}
                actions={
                  <>
                    <button className="btn btn-sm btn-secondary">View</button>
                    <button className="btn btn-sm btn-primary">Manage</button>
                  </>
                }
              />
            ))}
          </DataList>
        </DataCard>
      )}

      {activeTab === 'maintenance' && (
        <DataCard 
          title={`Maintenance Requests (${MAINTENANCE_REQUESTS.length})`}
          headerActions={
            <ActionButton 
              icon="➕" 
              label="New Request" 
              variant="secondary"
              size="small"
            />
          }
        >
          <DataList>
            {MAINTENANCE_REQUESTS.map(request => (
              <DataListItem
                key={request.id}
                icon="🔧"
                title={request.issue}
                subtitle={`${request.property} · Reported: ${request.date}`}
                status={request.status}
                statusColor={request.status === 'Resolved' ? '16, 185, 129' : request.status === 'In Progress' ? '245, 158, 11' : '239, 68, 68'}
                actions={
                  <button className="btn btn-sm btn-primary">
                    {request.status === 'Resolved' ? 'View' : 'Update'}
                  </button>
                }
              />
            ))}
          </DataList>
        </DataCard>
      )}

      {activeTab === 'finances' && (
        <DataCardGrid columns={2}>
          <DataCard title="Income Overview">
            <div className="financial-summary-card">
              <div className="summary-row">
                <span>Total Annual Income</span>
                <span className="value">{FINANCIAL_SUMMARY.totalIncome}</span>
              </div>
              <div className="summary-row collected">
                <span>Collected</span>
                <span className="value">{FINANCIAL_SUMMARY.collected}</span>
              </div>
              <div className="summary-row pending">
                <span>Pending</span>
                <span className="value">{FINANCIAL_SUMMARY.pending}</span>
              </div>
            </div>
          </DataCard>

          <DataCard title="Expenses & Net Income">
            <div className="financial-summary-card">
              <div className="summary-row expenses">
                <span>Total Expenses</span>
                <span className="value">{FINANCIAL_SUMMARY.expenses}</span>
              </div>
              <div className="summary-row net">
                <span>Net Income</span>
                <span className="value highlight">{FINANCIAL_SUMMARY.netIncome}</span>
              </div>
            </div>
          </DataCard>
        </DataCardGrid>
      )}
    </RolePageLayout>
  );
}
