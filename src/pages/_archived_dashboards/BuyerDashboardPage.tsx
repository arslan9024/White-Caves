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
import './BuyerDashboard.css';

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

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  status: string;
  views: number;
}

interface Viewing {
  id: number;
  property: string;
  date: string;
  agent: string;
  status: string;
}

interface PriceAlert {
  id: number;
  property: string;
  oldPrice: string;
  newPrice: string;
  change: string;
  date: string;
}

interface BuyerUser {
  id?: string;
  email?: string;
}

const BUYER_STATS: StatType[] = [
  { icon: '🏠', value: '24', label: 'Saved Properties', change: '+3 this week', positive: true },
  { icon: '📅', value: '5', label: 'Upcoming Viewings', change: '2 confirmed', positive: true },
  { icon: '🔔', value: '12', label: 'Price Alerts', change: '3 price drops', positive: true },
  { icon: '📊', value: '8', label: 'Property Comparisons', change: 'Updated today', positive: true },
];

const QUICK_LINKS: QuickLink[] = [
  { path: '/buyer/mortgage-calculator', icon: '🧮', title: 'Mortgage Calculator', description: 'Calculate your monthly payments' },
  { path: '/buyer/dld-fees', icon: '🏛️', title: 'DLD Fee Calculator', description: 'Estimate registration fees' },
  { path: '/buyer/title-deed-registration', icon: '📜', title: 'Title Deed', description: 'Track registration status' },
  { path: '/properties', icon: '🔍', title: 'Search Properties', description: 'Find your dream home' },
];

const SAVED_PROPERTIES: Property[] = [
  { id: 1, title: 'Palm Jumeirah Villa', location: 'Palm Jumeirah', price: 'AED 15.5M', status: 'Available', views: 45 },
  { id: 2, title: 'Downtown Penthouse', location: 'Downtown Dubai', price: 'AED 8.2M', status: 'New', views: 32 },
  { id: 3, title: 'Marina Apartment', location: 'Dubai Marina', price: 'AED 3.8M', status: 'Price Drop', views: 28 },
  { id: 4, title: 'Emirates Hills Villa', location: 'Emirates Hills', price: 'AED 45M', status: 'Hot Deal', views: 67 },
];

const UPCOMING_VIEWINGS: Viewing[] = [
  { id: 1, property: 'Palm Jumeirah Villa', date: 'Tomorrow, 2:00 PM', agent: 'Sarah Ahmed', status: 'Confirmed' },
  { id: 2, property: 'Downtown Penthouse', date: 'Fri, Mar 8, 10:00 AM', agent: 'Ahmed Khan', status: 'Pending' },
  { id: 3, property: 'Marina Apartment', date: 'Sat, Mar 9, 4:30 PM', agent: 'Maria Santos', status: 'Confirmed' },
];

const PRICE_ALERTS: PriceAlert[] = [
  { id: 1, property: 'JBR Beach Residence', oldPrice: 'AED 4.2M', newPrice: 'AED 3.9M', change: '-7.1%', date: 'Today' },
  { id: 2, property: 'Business Bay Tower', oldPrice: 'AED 2.8M', newPrice: 'AED 2.5M', change: '-10.7%', date: 'Yesterday' },
  { id: 3, property: 'City Walk Apartment', oldPrice: 'AED 5.5M', newPrice: 'AED 5.2M', change: '-5.5%', date: '2 days ago' },
];

const BuyerDashboardPage: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const user = useSelector((state: any) => state.auth?.user) as BuyerUser | undefined;

  const handleLogout = (): void => {
    console.log('Logout initiated');
  };

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
    sessionStorage.setItem('buyerDashboardTab', tabId);
  };

  const renderTabContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="buyer-dashboard-content">
            <StatCardGrid columns={4}>
              {BUYER_STATS.map((stat, index) => (
                <StatCard key={index} {...stat} variant="buyer" />
              ))}
            </StatCardGrid>

            <QuickLinks title="Quick Tools" links={QUICK_LINKS} columns={4} />

            <DataCardGrid columns={2}>
              <DataCard title="Saved Properties" viewAllLink="/buyer/saved-properties">
                <DataList>
                  {SAVED_PROPERTIES.slice(0, 3).map(property => (
                    <DataListItem
                      key={property.id}
                      title={property.title}
                      subtitle={property.location}
                      meta={`AED ${property.price.toLocaleString()}`}
                      status={property.status}
                      badge={property.views}
                      badgeColor="primary"
                    />
                  ))}
                </DataList>
              </DataCard>

              <DataCard title="Upcoming Viewings" viewAllLink="/buyer/viewings">
                <DataList>
                  {UPCOMING_VIEWINGS.map(viewing => (
                    <DataListItem
                      key={viewing.id}
                      icon="📅"
                      title={viewing.property}
                      subtitle={`${viewing.date} · Agent: ${viewing.agent}`}
                      status={viewing.status}
                      statusColor={viewing.status === 'Confirmed' ? '16, 185, 129' : '245, 158, 11'}
                    />
                  ))}
                </DataList>
              </DataCard>

              <DataCard title="Recent Price Drops" viewAllLink="/buyer/price-alerts" fullWidth>
                <DataList>
                  {PRICE_ALERTS.map(alert => (
                    <DataListItem
                      key={alert.id}
                      icon="📉"
                      title={alert.property}
                      subtitle={`${alert.oldPrice} → ${alert.newPrice}`}
                      meta={alert.date}
                      badge={alert.change}
                      badgeColor="16, 185, 129"
                    />
                  ))}
                </DataList>
              </DataCard>
            </DataCardGrid>
          </div>
        );

      case 'saved':
        return (
          <DataCard title={`Saved Properties (${SAVED_PROPERTIES.length})`}>
            <DataList>
              {SAVED_PROPERTIES.map(property => (
                <DataListItem
                  key={property.id}
                  title={property.title}
                  subtitle={property.location}
                  meta={`AED ${property.price.toLocaleString()}`}
                  status={property.status}
                  badge={property.views}
                  badgeColor="primary"
                />
              ))}
            </DataList>
          </DataCard>
        );

      case 'viewings':
        return (
          <DataCard 
            title={`Upcoming Viewings (${UPCOMING_VIEWINGS.length})`}
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
              {UPCOMING_VIEWINGS.map(viewing => (
                <DataListItem
                  key={viewing.id}
                  icon="🏠"
                  title={viewing.property}
                  subtitle={`${viewing.date} · Agent: ${viewing.agent}`}
                  status={viewing.status}
                  statusColor={viewing.status === 'Confirmed' ? '16, 185, 129' : '245, 158, 11'}
                  actions={
                    <>
                      <button className="btn btn-sm btn-secondary">Reschedule</button>
                      <button className="btn btn-sm btn-primary">Details</button>
                    </>
                  }
                />
              ))}
            </DataList>
          </DataCard>
        );

      case 'alerts':
        return (
          <DataCard 
            title={`Price Alerts (${PRICE_ALERTS.length})`}
            headerActions={
              <ActionButton 
                icon="➕" 
                label="Add Alert" 
                variant="secondary"
                size="small"
              />
            }
          >
            <DataList>
              {PRICE_ALERTS.map(alert => (
                <DataListItem
                  key={alert.id}
                  icon="📉"
                  title={alert.property}
                  subtitle={`Price dropped from ${alert.oldPrice} to ${alert.newPrice}`}
                  meta={alert.date}
                  badge={alert.change}
                  badgeColor="16, 185, 129"
                  actions={
                    <button className="btn btn-sm btn-primary">View Property</button>
                  }
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
      role="buyer"
    >
      {renderTabContent()}
    </UnifiedDashboardLayout>
  );
}

export default BuyerDashboardPage;
