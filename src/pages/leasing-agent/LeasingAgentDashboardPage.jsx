import React, { useState } from 'react';
import RolePageLayout, { ActionButton } from '../../components/layout/RolePageLayout';
import {
  StatCard,
  StatCardGrid,
  TabbedPanel,
  DataCard,
  DataCardGrid,
  DataList,
  DataListItem,
  QuickLinks,
  LeadListItem,
  PropertyListItem
} from '../../components/common';
import './LeasingAgentDashboard.css';

const AGENT_STATS = [
  { icon: '🏠', value: '18', label: 'Active Listings', change: '+3 this week', positive: true },
  { icon: '📅', value: '4', label: 'Viewings Today', change: '2 confirmed', positive: true },
  { icon: '✅', value: '8', label: 'Leases This Month', change: '+25% vs last month', positive: true },
  { icon: '💰', value: 'AED 32K', label: 'Commission Earned', change: 'YTD: AED 285K', positive: true },
];

const QUICK_LINKS = [
  { path: '/leasing-agent/leads', icon: '👥', title: 'My Leads', description: 'Manage tenant leads' },
  { path: '/leasing-agent/listings', icon: '🏠', title: 'My Listings', description: 'View active properties' },
  { path: '/leasing-agent/viewings', icon: '📅', title: 'Viewings', description: 'Schedule & manage' },
  { path: '/leasing-agent/contracts', icon: '📋', title: 'Contracts', description: 'Tenancy agreements' },
];

const LEADS = [
  { id: 1, name: 'Ahmed Al-Rashid', requirement: '2BR Marina', budget: 'AED 80-100K/yr', status: 'Hot', lastContact: 'Today', score: 92 },
  { id: 2, name: 'Sarah Johnson', requirement: 'Studio Downtown', budget: 'AED 50-70K/yr', status: 'Warm', lastContact: 'Yesterday', score: 75 },
  { id: 3, name: 'Mohammed Khan', requirement: '3BR JBR', budget: 'AED 150-180K/yr', status: 'New', lastContact: '2 days ago', score: 60 },
  { id: 4, name: 'Emily Chen', requirement: '1BR Business Bay', budget: 'AED 60-75K/yr', status: 'Warm', lastContact: '3 days ago', score: 70 },
];

const UPCOMING_VIEWINGS = [
  { property: 'Marina View 2BR', client: 'Ahmed Al-Rashid', time: '2:00 PM', landlord: 'Emirates Properties', status: 'Confirmed' },
  { property: 'Downtown Studio', client: 'Sarah Johnson', time: '4:30 PM', landlord: 'Dubai Holdings', status: 'Pending' },
  { property: 'JBR 3BR Apartment', client: 'Mohammed Khan', time: '6:00 PM', landlord: 'White Caves', status: 'Confirmed' },
];

const MY_LISTINGS = [
  { id: 1, title: 'Marina View 2BR', location: 'Dubai Marina', price: 'AED 95K/yr', views: 45, inquiries: 8, daysListed: 12 },
  { id: 2, title: 'Downtown Studio', location: 'Downtown Dubai', price: 'AED 65K/yr', views: 32, inquiries: 5, daysListed: 8 },
  { id: 3, title: 'JBR 3BR Apt', location: 'JBR', price: 'AED 180K/yr', views: 28, inquiries: 3, daysListed: 5 },
];

const RECENT_CONTRACTS = [
  { tenant: 'James Wilson', property: 'Marina 1BR', rent: 'AED 75K/yr', signedDate: 'Mar 1, 2024', status: 'Active' },
  { tenant: 'Fatima Ali', property: 'Business Bay 2BR', rent: 'AED 110K/yr', signedDate: 'Feb 25, 2024', status: 'Active' },
];

export default function LeasingAgentDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'leads', label: 'Leads', icon: '👥', badge: LEADS.length },
    { id: 'listings', label: 'Listings', icon: '🏠', badge: MY_LISTINGS.length },
    { id: 'viewings', label: 'Viewings', icon: '📅', badge: UPCOMING_VIEWINGS.length },
  ];

  return (
    <RolePageLayout
      title="Leasing Agent Dashboard"
      subtitle="Manage your rental listings and tenant leads"
      role="leasing-agent"
      actions={
        <ActionButton 
          icon="➕" 
          label="Add Listing" 
          to="/leasing-agent/add-listing" 
          variant="primary"
        />
      }
    >
      <StatCardGrid columns={4}>
        {AGENT_STATS.map((stat, index) => (
          <StatCard key={index} {...stat} variant="leasing-agent" />
        ))}
      </StatCardGrid>

      <QuickLinks title="Agent Tools" links={QUICK_LINKS} columns={4} />

      <TabbedPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        storeKey="leasingAgentDashboard"
      />

      {activeTab === 'overview' && (
        <DataCardGrid columns={2}>
          <DataCard title="Top Leads" viewAllLink="/leasing-agent/leads">
            <DataList>
              {LEADS.slice(0, 3).map(lead => (
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

          <DataCard title="Today's Viewings" viewAllLink="/leasing-agent/viewings">
            <DataList>
              {UPCOMING_VIEWINGS.map((viewing, index) => (
                <DataListItem
                  key={index}
                  icon="📅"
                  title={viewing.property}
                  subtitle={`${viewing.client} · ${viewing.time}`}
                  status={viewing.status}
                  statusColor={viewing.status === 'Confirmed' ? '16, 185, 129' : '245, 158, 11'}
                />
              ))}
            </DataList>
          </DataCard>

          <DataCard title="My Listings" viewAllLink="/leasing-agent/listings">
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

          <DataCard title="Recent Contracts" viewAllLink="/leasing-agent/contracts">
            <DataList>
              {RECENT_CONTRACTS.map((contract, index) => (
                <DataListItem
                  key={index}
                  icon="📋"
                  title={contract.property}
                  subtitle={`Tenant: ${contract.tenant} · ${contract.rent}`}
                  meta={contract.signedDate}
                  status={contract.status}
                  statusColor="16, 185, 129"
                />
              ))}
            </DataList>
          </DataCard>
        </DataCardGrid>
      )}

      {activeTab === 'leads' && (
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
      )}

      {activeTab === 'listings' && (
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
      )}

      {activeTab === 'viewings' && (
        <DataCard 
          title={`Scheduled Viewings (${UPCOMING_VIEWINGS.length})`}
          headerActions={
            <ActionButton 
              icon="➕" 
              label="Schedule Viewing" 
              variant="secondary"
              size="small"
            />
          }
        >
          <DataList>
            {UPCOMING_VIEWINGS.map((viewing, index) => (
              <DataListItem
                key={index}
                icon="📅"
                title={viewing.property}
                subtitle={`Client: ${viewing.client} · Landlord: ${viewing.landlord}`}
                meta={viewing.time}
                status={viewing.status}
                statusColor={viewing.status === 'Confirmed' ? '16, 185, 129' : '245, 158, 11'}
                actions={
                  <>
                    <button className="btn btn-sm btn-secondary">Reschedule</button>
                    <button className="btn btn-sm btn-primary">Start</button>
                  </>
                }
              />
            ))}
          </DataList>
        </DataCard>
      )}
    </RolePageLayout>
  );
}
