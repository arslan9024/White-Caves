import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RolePageLayout from '../../components/layout/RolePageLayout';
import LoadingSkeleton from '../../components/LoadingSkeleton';
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
import {
  fetchLandlordStats,
  fetchLandlordProperties,
  fetchLandlordMaintenance,
  fetchLandlordFinances,
  setActiveTab
} from '../../store/slices/landlordSlice';
import './LandlordDashboard.css';

export default function LandlordDashboardPage() {
  const dispatch = useDispatch();
  const { stats, properties, maintenance, finances, loading, error, activeTab } = useSelector(state => state.landlord);

  const QUICK_LINKS = [
    { path: '/landlord/rental-management', icon: '🏠', title: 'Rental Management', description: 'Manage all rentals' },
    { path: '/landlord/tenants', icon: '👥', title: 'My Tenants', description: 'View tenant details' },
    { path: '/landlord/finances', icon: '💰', title: 'Finances', description: 'Track income & expenses' },
    { path: '/landlord/maintenance', icon: '🔧', title: 'Maintenance', description: 'Handle repairs' },
  ];

  const UPCOMING_LEASE_EVENTS = [
    { property: 'Downtown Studio', event: 'Lease Renewal', date: 'Jun 15, 2024', daysLeft: 45 },
    { property: 'Marina View 2BR', event: 'Rent Review', date: 'Nov 1, 2024', daysLeft: 180 },
    { property: 'Business Bay Office', event: 'Lease Expiry', date: 'Mar 15, 2025', daysLeft: 320 },
  ];

  // Fetch data from APIs on component mount
  useEffect(() => {
    dispatch(fetchLandlordStats());
    dispatch(fetchLandlordProperties());
    dispatch(fetchLandlordMaintenance());
    dispatch(fetchLandlordFinances());

    // Set up polling interval (refresh every 30 seconds)
    const pollingInterval = setInterval(() => {
      dispatch(fetchLandlordStats());
      dispatch(fetchLandlordContacts());
    }, 30000);

    return () => clearInterval(pollingInterval);
  }, [dispatch]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'properties', label: 'Properties', icon: '🏢', badge: properties.length },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧', badge: maintenance.filter(m => m.status !== 'Resolved').length },
    { id: 'finances', label: 'Finances', icon: '💰' },
  ];

  const transformStatsForDisplay = () => {
    if (!stats) return [];
    return [
      { 
        icon: '🏢', 
        value: stats.totalProperties?.toString() || '0', 
        label: 'Total Properties', 
        change: 'Portfolio: AED 15.2M', 
        positive: true 
      },
      { 
        icon: '🔑', 
        value: stats.occupied?.toString() || '0', 
        label: 'Occupied', 
        change: `${stats.occupied}/${stats.totalProperties} occupied`, 
        positive: true 
      },
      { 
        icon: '📋', 
        value: stats.available?.toString() || '0', 
        label: 'Available', 
        change: 'Ready to rent', 
        positive: false 
      },
      { 
        icon: '💰', 
        value: stats.monthlyIncome || 'N/A', 
        label: 'Monthly Income', 
        change: '+8% vs last month', 
        positive: true 
      },
    ];
  };


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

  if (loading) {
    return (
      <RolePageLayout
        title="Landlord Dashboard"
        subtitle="Manage your rental property portfolio"
        role="landlord"
      >
        <div style={{ padding: '20px' }}>
          <LoadingSkeleton variant="card" count={4} height={120} />
          <div style={{ marginTop: '40px' }}>
            <LoadingSkeleton variant="table" count={1} />
          </div>
        </div>
      </RolePageLayout>
    );
  }

  if (error) {
    return (
      <RolePageLayout
        title="Landlord Dashboard"
        subtitle="Manage your rental property portfolio"
        role="landlord"
      >
        <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px', color: '#DC2626' }}>
          Error: {error}
        </div>
      </RolePageLayout>
    );
  }

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
        {transformStatsForDisplay().map((stat, index) => (
          <StatCard key={index} {...stat} variant="landlord" />
        ))}
      </StatCardGrid>

      <QuickLinks title="Landlord Tools" links={QUICK_LINKS} columns={4} />

      <TabbedPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => dispatch(setActiveTab(tab))}
        storeKey="landlordDashboard"
      />

      {activeTab === 'overview' && (
        <DataCardGrid columns={2}>
          <DataCard title="My Properties" viewAllLink="/landlord/properties">
            <DataList>
              {properties.slice(0, 3).map(property => (
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
              {maintenance.map(request => (
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
                <span className="financial-value">{finances?.totalIncome || 'N/A'}</span>
              </div>
              <div className="financial-item collected">
                <span className="financial-label">Collected</span>
                <span className="financial-value">{finances?.collected || 'N/A'}</span>
              </div>
              <div className="financial-item pending">
                <span className="financial-label">Pending</span>
                <span className="financial-value">{finances?.pending || 'N/A'}</span>
              </div>
              <div className="financial-item expenses">
                <span className="financial-label">Expenses</span>
                <span className="financial-value">{finances?.expenses || 'N/A'}</span>
              </div>
              <div className="financial-item net">
                <span className="financial-label">Net Income</span>
                <span className="financial-value">{finances?.netIncome || 'N/A'}</span>
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
        <DataCard title={`All Properties (${properties.length})`}>
          <DataList>
            {properties.map(property => (
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
          title={`Maintenance Requests (${maintenanceRequests.length})`}
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
            {maintenanceRequests.map(request => (
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
                <span className="value">{finances?.totalIncome || 'N/A'}</span>
              </div>
              <div className="summary-row collected">
                <span>Collected</span>
                <span className="value">{finances?.collected || 'N/A'}</span>
              </div>
              <div className="summary-row pending">
                <span>Pending</span>
                <span className="value">{finances?.pending || 'N/A'}</span>
              </div>
            </div>
          </DataCard>

          <DataCard title="Expenses & Net Income">
            <div className="financial-summary-card">
              <div className="summary-row expenses">
                <span>Total Expenses</span>
                <span className="value">{finances?.expenses || 'N/A'}</span>
              </div>
              <div className="summary-row net">
                <span>Net Income</span>
                <span className="value highlight">{finances?.netIncome || 'N/A'}</span>
              </div>
            </div>
          </DataCard>
        </DataCardGrid>
      )}
    </RolePageLayout>
  );
}
