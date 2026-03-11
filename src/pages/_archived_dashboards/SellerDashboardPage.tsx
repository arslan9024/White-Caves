import React, { FC, useState } from 'react';
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
  PropertyCard,
  ActionButton
} from '../../components/common';
import './SellerDashboard.css';

// Type definitions
interface StatType {
  icon: string;
  value: string;
  label: string;
  change: string;
  positive: boolean;
}

interface QuickLink {
  path: string;
  icon: string;
  title: string;
  description: string;
}

interface PropertyListing {
  id: number;
  title: string;
  location: string;
  price: string;
  views: number;
  inquiries: number;
  status: string;
  daysListed: number;
}

interface Inquiry {
  id: number;
  buyer: string;
  property: string;
  message: string;
  date: string;
  qualified: boolean;
}

interface MarketInsight {
  area: string;
  avgPrice: string;
  trend: string;
  demand: string;
}

interface SellerUser {
  id?: string;
  email?: string;
}

const SELLER_STATS: StatType[] = [
  { icon: '🏠', value: '3', label: 'Active Listings', change: '+1 this month', positive: true },
  { icon: '👁️', value: '1,245', label: 'Total Views', change: '+15% vs last week', positive: true },
  { icon: '💬', value: '34', label: 'Inquiries', change: '8 new', positive: true },
  { icon: '📅', value: '12', label: 'Viewings Completed', change: '3 this week', positive: true },
];

const QUICK_LINKS: QuickLink[] = [
  { path: '/seller/pricing-tools', icon: '💰', title: 'Pricing Tools', description: 'Get market valuation' },
  { path: '/seller/listings', icon: '🏠', title: 'My Listings', description: 'Manage your properties' },
  { path: '/seller/documents', icon: '📋', title: 'Documents', description: 'Sale agreements & contracts' },
  { path: '/seller/analytics', icon: '📊', title: 'Analytics', description: 'View performance stats' },
];

const MY_LISTINGS: PropertyListing[] = [
  { id: 1, title: 'Marina View Apartment', location: 'Dubai Marina', price: 'AED 2.8M', views: 456, inquiries: 12, status: 'Active', daysListed: 15 },
  { id: 2, title: 'JBR Penthouse', location: 'JBR', price: 'AED 12.5M', views: 289, inquiries: 8, status: 'Active', daysListed: 8 },
  { id: 3, title: 'Business Bay Office', location: 'Business Bay', price: 'AED 4.2M', views: 147, inquiries: 4, status: 'Under Offer', daysListed: 22 },
];

const RECENT_INQUIRIES: Inquiry[] = [
  { id: 1, buyer: 'Mohammed Al-Rashid', property: 'Marina View Apartment', message: 'Interested in scheduling a viewing...', date: 'Today', qualified: true },
  { id: 2, buyer: 'Sarah Johnson', property: 'JBR Penthouse', message: 'Can you provide more details about...', date: 'Yesterday', qualified: true },
  { id: 3, buyer: 'Ahmed Hassan', property: 'Business Bay Office', message: 'What is the service charge for...', date: '2 days ago', qualified: false },
  { id: 4, buyer: 'Emily Chen', property: 'Marina View Apartment', message: 'Is the price negotiable?', date: '3 days ago', qualified: true },
];

const MARKET_INSIGHTS: MarketInsight[] = [
  { area: 'Dubai Marina', avgPrice: 'AED 1,850/sqft', trend: '+3.2%', demand: 'High' },
  { area: 'JBR', avgPrice: 'AED 2,100/sqft', trend: '+5.1%', demand: 'Very High' },
  { area: 'Business Bay', avgPrice: 'AED 1,650/sqft', trend: '+1.8%', demand: 'Medium' },
];

const SellerDashboardPage: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const user = useSelector((state: any) => state.auth?.user) as SellerUser | undefined;

  const handleLogout = (): void => {
    console.log('Logout initiated');
  };

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
    sessionStorage.setItem('sellerDashboardTab', tabId);
  };

  const renderTabContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="seller-dashboard-content">
            <StatCardGrid columns={4}>
              {SELLER_STATS.map((stat, index) => (
                <StatCard key={index} {...stat} variant="seller" />
              ))}
            </StatCardGrid>

            <QuickLinks title="Seller Tools" links={QUICK_LINKS} columns={4} />

            <DataCardGrid columns={2}>
              <DataCard title="My Listings" viewAllLink="/seller/listings">
                <DataList>
                  {MY_LISTINGS.map(listing => (
                    <DataListItem
                      key={listing.id}
                      title={listing.title}
                      subtitle={listing.location}
                      meta={listing.price}
                      status={listing.status}
                      badge={`${listing.views} views`}
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
          </div>
        );

      case 'listings':
        return (
          <DataCard title={`My Listings (${MY_LISTINGS.length})`}>
            <DataList>
              {MY_LISTINGS.map(listing => (
                <DataListItem
                  key={listing.id}
                  title={listing.title}
                  subtitle={listing.location}
                  meta={listing.price}
                  status={listing.status}
                  badge={`${listing.views} views`}
                />
              ))}
            </DataList>
          </DataCard>
        );

      case 'inquiries':
        return (
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
        );

      case 'market':
        return (
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
      role="seller"
    >
      {renderTabContent()}
    </UnifiedDashboardLayout>
  );
}

export default SellerDashboardPage;
