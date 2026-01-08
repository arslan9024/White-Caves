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
  PropertyListItem,
  ActionButton
} from '../../components/common';
import './SellerDashboard.css';

const SELLER_STATS = [
  { icon: '🏠', value: '3', label: 'Active Listings', change: '+1 this month', positive: true },
  { icon: '👁️', value: '1,245', label: 'Total Views', change: '+15% vs last week', positive: true },
  { icon: '💬', value: '34', label: 'Inquiries', change: '8 new', positive: true },
  { icon: '📅', value: '12', label: 'Viewings Completed', change: '3 this week', positive: true },
];

const QUICK_LINKS = [
  { path: '/seller/pricing-tools', icon: '💰', title: 'Pricing Tools', description: 'Get market valuation' },
  { path: '/seller/listings', icon: '🏠', title: 'My Listings', description: 'Manage your properties' },
  { path: '/seller/documents', icon: '📋', title: 'Documents', description: 'Sale agreements & contracts' },
  { path: '/seller/analytics', icon: '📊', title: 'Analytics', description: 'View performance stats' },
];

const MY_LISTINGS = [
  { id: 1, title: 'Marina View Apartment', location: 'Dubai Marina', price: 'AED 2.8M', views: 456, inquiries: 12, status: 'Active', daysListed: 15 },
  { id: 2, title: 'JBR Penthouse', location: 'JBR', price: 'AED 12.5M', views: 289, inquiries: 8, status: 'Active', daysListed: 8 },
  { id: 3, title: 'Business Bay Office', location: 'Business Bay', price: 'AED 4.2M', views: 147, inquiries: 4, status: 'Under Offer', daysListed: 22 },
];

const RECENT_INQUIRIES = [
  { id: 1, buyer: 'Mohammed Al-Rashid', property: 'Marina View Apartment', message: 'Interested in scheduling a viewing...', date: 'Today', qualified: true },
  { id: 2, buyer: 'Sarah Johnson', property: 'JBR Penthouse', message: 'Can you provide more details about...', date: 'Yesterday', qualified: true },
  { id: 3, buyer: 'Ahmed Hassan', property: 'Business Bay Office', message: 'What is the service charge for...', date: '2 days ago', qualified: false },
  { id: 4, buyer: 'Emily Chen', property: 'Marina View Apartment', message: 'Is the price negotiable?', date: '3 days ago', qualified: true },
];

const MARKET_INSIGHTS = [
  { area: 'Dubai Marina', avgPrice: 'AED 1,850/sqft', trend: '+3.2%', demand: 'High' },
  { area: 'JBR', avgPrice: 'AED 2,100/sqft', trend: '+5.1%', demand: 'Very High' },
  { area: 'Business Bay', avgPrice: 'AED 1,650/sqft', trend: '+1.8%', demand: 'Medium' },
];

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'listings', label: 'My Listings', icon: '🏠', badge: MY_LISTINGS.length },
    { id: 'inquiries', label: 'Inquiries', icon: '💬', badge: RECENT_INQUIRIES.length },
    { id: 'market', label: 'Market Insights', icon: '📈' },
  ];

  return (
    <RolePageLayout
      title="Seller Dashboard"
      subtitle="Track your property listings and buyer inquiries"
      role="seller"
      actions={
        <ActionButton 
          icon="➕" 
          label="Add New Listing" 
          to="/seller/add-listing" 
          variant="primary"
        />
      }
    >
      <StatCardGrid columns={4}>
        {SELLER_STATS.map((stat, index) => (
          <StatCard key={index} {...stat} variant="seller" />
        ))}
      </StatCardGrid>

      <QuickLinks title="Seller Tools" links={QUICK_LINKS} columns={4} />

      <TabbedPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        storeKey="sellerDashboard"
      />

      {activeTab === 'overview' && (
        <DataCardGrid columns={2}>
          <DataCard title="My Listings" viewAllLink="/seller/listings">
            <DataList>
              {MY_LISTINGS.map(listing => (
                <PropertyListItem
                  key={listing.id}
                  title={listing.title}
                  location={listing.location}
                  price={listing.price}
                  status={listing.status}
                  views={listing.views}
                  inquiries={listing.inquiries}
                  daysListed={listing.daysListed}
                />
              ))}
            </DataList>
          </DataCard>

          <DataCard title="Recent Inquiries" viewAllLink="/seller/inquiries">
            <DataList>
              {RECENT_INQUIRIES.slice(0, 3).map(inquiry => (
                <DataListItem
                  key={inquiry.id}
                  avatarText={inquiry.buyer.charAt(0)}
                  title={inquiry.buyer}
                  subtitle={`${inquiry.property} - "${inquiry.message.substring(0, 30)}..."`}
                  meta={inquiry.date}
                  status={inquiry.qualified ? 'Qualified' : 'Unqualified'}
                  statusColor={inquiry.qualified ? '16, 185, 129' : '107, 114, 128'}
                />
              ))}
            </DataList>
          </DataCard>

          <DataCard title="Market Insights" viewAllLink="/seller/market" fullWidth>
            <div className="market-grid">
              {MARKET_INSIGHTS.map((insight, index) => (
                <div key={index} className="market-item">
                  <span className="market-area">{insight.area}</span>
                  <span className="market-price">{insight.avgPrice}</span>
                  <span className={`market-trend ${insight.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                    {insight.trend}
                  </span>
                  <span className={`market-demand demand-${insight.demand.toLowerCase().replace(' ', '-')}`}>
                    {insight.demand}
                  </span>
                </div>
              ))}
            </div>
          </DataCard>
        </DataCardGrid>
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
                status={listing.status}
                views={listing.views}
                inquiries={listing.inquiries}
                daysListed={listing.daysListed}
              />
            ))}
          </DataList>
        </DataCard>
      )}

      {activeTab === 'inquiries' && (
        <DataCard title={`All Inquiries (${RECENT_INQUIRIES.length})`}>
          <DataList>
            {RECENT_INQUIRIES.map(inquiry => (
              <DataListItem
                key={inquiry.id}
                avatarText={inquiry.buyer.charAt(0)}
                title={inquiry.buyer}
                subtitle={`${inquiry.property} - "${inquiry.message}"`}
                meta={inquiry.date}
                status={inquiry.qualified ? 'Qualified' : 'Unqualified'}
                statusColor={inquiry.qualified ? '16, 185, 129' : '107, 114, 128'}
                actions={
                  <>
                    <button className="btn btn-sm btn-secondary">View</button>
                    <button className="btn btn-sm btn-primary">Respond</button>
                  </>
                }
              />
            ))}
          </DataList>
        </DataCard>
      )}

      {activeTab === 'market' && (
        <DataCard title="Market Analysis">
          <div className="market-table">
            <div className="market-header">
              <span>Area</span>
              <span>Avg. Price</span>
              <span>Trend</span>
              <span>Demand</span>
            </div>
            {MARKET_INSIGHTS.map((insight, index) => (
              <div key={index} className="market-row">
                <span className="market-area">{insight.area}</span>
                <span className="market-price">{insight.avgPrice}</span>
                <span className={`market-trend ${insight.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  {insight.trend}
                </span>
                <span className={`market-demand demand-${insight.demand.toLowerCase().replace(' ', '-')}`}>
                  {insight.demand}
                </span>
              </div>
            ))}
          </div>
        </DataCard>
      )}
    </RolePageLayout>
  );
}
