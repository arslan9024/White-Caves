import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UnifiedDashboardLayout from '../../components/layout/UnifiedDashboardLayout';
import {
  StatCard,
  StatCardGrid,
  DataCard,
  DataCardGrid,
  DataList,
  DataListItem,
  QuickLinks,
  LeadListItem,
  PropertyListItem,
  PipelineBoard,
  DealProgressBar,
  ActionButton
} from '../../components/common';
import './SalesAgentDashboard.css';

const AGENT_STATS = [
  { icon: '🏢', value: '24', label: 'Active Listings', change: '+5 this month', positive: true },
  { icon: '📅', value: '12', label: 'Viewings This Week', change: '3 today', positive: true },
  { icon: '✅', value: '15', label: 'Deals Closed (YTD)', change: 'AED 125M total', positive: true },
  { icon: '💰', value: 'AED 485K', label: 'Commission Earned', change: '+18% vs last year', positive: true },
];

const QUICK_LINKS = [
  { path: '/secondary-sales-agent/leads', icon: '👥', title: 'My Leads', description: 'Manage buyer leads' },
  { path: '/secondary-sales-agent/listings', icon: '🏢', title: 'My Listings', description: 'View active properties' },
  { path: '/secondary-sales-agent/deals', icon: '🤝', title: 'Active Deals', description: 'Track negotiations' },
  { path: '/secondary-sales-agent/analytics', icon: '📊', title: 'Analytics', description: 'Performance metrics' },
];

const LEADS = [
  { id: 1, name: 'John Smith', requirement: 'Palm Villa', budget: 'AED 40-50M', status: 'Hot', source: 'Website', score: 95 },
  { id: 2, name: 'Emma Wilson', requirement: 'Downtown Penthouse', budget: 'AED 25-35M', status: 'Warm', source: 'Referral', score: 78 },
  { id: 3, name: 'Omar Hassan', requirement: 'Marina 3BR', budget: 'AED 3-5M', status: 'New', source: 'Walk-in', score: 65 },
  { id: 4, name: 'Lisa Chen', requirement: 'Emirates Hills', budget: 'AED 60-80M', status: 'Hot', source: 'Partner', score: 92 },
];

const ACTIVE_DEALS = [
  { id: 1, property: 'Palm Jumeirah Villa', buyer: 'Michael Brown', price: 'AED 45M', stage: 'Negotiating', progress: 60 },
  { id: 2, property: 'Downtown Penthouse', buyer: 'Lisa Chen', price: 'AED 28M', stage: 'Documentation', progress: 75 },
  { id: 3, property: 'Emirates Hills Mansion', buyer: 'Robert Taylor', price: 'AED 65M', stage: 'Due Diligence', progress: 40 },
];

const MY_LISTINGS = [
  { id: 1, title: 'Palm Jumeirah Villa', location: 'Palm Jumeirah', price: 'AED 45M', views: 156, inquiries: 12, daysListed: 18 },
  { id: 2, title: 'Downtown Penthouse', location: 'Downtown Dubai', price: 'AED 28M', views: 89, inquiries: 8, daysListed: 12 },
  { id: 3, title: 'Emirates Hills Villa', location: 'Emirates Hills', price: 'AED 65M', views: 45, inquiries: 4, daysListed: 8 },
];

const PIPELINE_STAGES = [
  { name: 'Lead', count: 12, value: 'AED 180M' },
  { name: 'Qualified', count: 8, value: 'AED 120M' },
  { name: 'Viewing', count: 5, value: 'AED 85M' },
  { name: 'Negotiation', count: 3, value: 'AED 138M' },
  { name: 'Documentation', count: 2, value: 'AED 73M' },
  { name: 'Closing', count: 1, value: 'AED 45M' },
];

export default function SalesAgentDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const user = useSelector(state => state.auth?.user);

  const handleLogout = () => {
    console.log('Logout initiated');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    sessionStorage.setItem('salesAgentDashboardTab', tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="sales-agent-dashboard-content">
            <StatCardGrid columns={4}>
              {AGENT_STATS.map((stat, index) => (
                <StatCard key={index} {...stat} variant="sales-agent" />
              ))}
            </StatCardGrid>

            <QuickLinks title="Agent Tools" links={QUICK_LINKS} columns={4} />

            <DataCard title="Sales Pipeline">
              <PipelineBoard stages={PIPELINE_STAGES} />
            </DataCard>

            <DataCardGrid columns={2}>
              <DataCard title="Top Leads">
                <DataList>
                  {LEADS.filter(l => l.status === 'Hot').slice(0, 3).map(lead => (
                    <LeadListItem
                      key={lead.id}
                      name={lead.name}
                      requirement={lead.requirement}
                      budget={lead.budget}
                      status={lead.status}
                      score={lead.score}
                    />
                  ))}
                </DataList>
              </DataCard>

              <DataCard title="Active Deals">
                <DataList>
                  {ACTIVE_DEALS.map(deal => (
                    <div key={deal.id} className="deal-item">
                      <div className="deal-info">
                        <span className="deal-property">{deal.property}</span>
                        <span className="deal-meta">{deal.buyer} · {deal.price}</span>
                      </div>
                      <DealProgressBar progress={deal.progress} stage={deal.stage} />
                    </div>
                  ))}
                </DataList>
              </DataCard>

              <DataCard title="My Listings" fullWidth>
                <DataList>
                  {MY_LISTINGS.map(listing => (
                    <PropertyListItem
                      key={listing.id}
                      title={listing.title}
                      location={listing.location}
                      price={listing.price}
                      views={listing.views}
                      inquiries={listing.inquiries}
                      daysListed={listing.daysListed}
                    />
                  ))}
                </DataList>
              </DataCard>
            </DataCardGrid>
          </div>
        );

      case 'leads':
        return (
          <DataCard 
            title={`All Leads (${LEADS.length})`}
            headerActions={
              <ActionButton 
                icon="➕" 
                label="Add Lead" 
                variant="secondary"
                size="small"
              />
            }
          >
            <DataList>
              {LEADS.map(lead => (
                <LeadListItem
                  key={lead.id}
                  name={lead.name}
                  requirement={lead.requirement}
                  budget={lead.budget}
                  status={lead.status}
                  score={lead.score}
                  onClick={() => console.log('View lead', lead.id)}
                />
              ))}
            </DataList>
          </DataCard>
        );

      case 'deals':
        return (
          <DataCard title={`Active Deals (${ACTIVE_DEALS.length})`}>
            <DataList>
              {ACTIVE_DEALS.map(deal => (
                <DataListItem
                  key={deal.id}
                  icon="🏠"
                  title={deal.property}
                  subtitle={`Buyer: ${deal.buyer} · Price: ${deal.price}`}
                  status={deal.stage}
                  statusColor={
                    deal.progress >= 70 ? '16, 185, 129' : 
                    deal.progress >= 40 ? '245, 158, 11' : '239, 68, 68'
                  }
                  actions={
                    <>
                      <button className="btn btn-sm btn-secondary">View</button>
                      <button className="btn btn-sm btn-primary">Update</button>
                    </>
                  }
                />
              ))}
            </DataList>
          </DataCard>
        );

      case 'listings':
        return (
          <DataCard title={`My Listings (${MY_LISTINGS.length})`}>
            <DataList>
              {MY_LISTINGS.map(listing => (
                <PropertyListItem
                  key={listing.id}
                  title={listing.title}
                  location={listing.location}
                  price={listing.price}
                  views={listing.views}
                  inquiries={listing.inquiries}
                  daysListed={listing.daysListed}
                />
              ))}
            </DataList>
          </DataCard>
        );

      default:
        return null;
    }
  };

  return (
    <UnifiedDashboardLayout
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      role="secondary-sales-agent"
    >
      {renderTabContent()}
    </UnifiedDashboardLayout>
  );
}
