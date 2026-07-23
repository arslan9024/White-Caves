import React, { useState } from 'react';
import type { CRMModuleProps } from './types';
import './MarketAnalyticsModule.css';

/**
 * Market Analytics & Reporting Module
 * Comprehensive market insights, KPIs, and agent performance tracking
 * 
 * Features:
 * - Market dashboard with KPIs
 * - Sales/rental trends
 * - Agent performance analytics
 * - Geographic heat maps
 * - Customizable reports
 */

interface MarketKpi {
  title: string;
  value: string;
  delta: string;
  deltaTone: 'success' | 'warning';
}

interface PropertyTypeRow {
  type: string;
  salesCount: number;
  totalValue: string;
  marketShare: string;
}

interface AgentPerformanceRow {
  agentName: string;
  totalDeals: number;
  avgDealSize: string;
  commissionYtd: string;
  closeRate: string;
  avgDaysToClose: string;
  highlight?: boolean;
}

interface RentalYieldRow {
  location: string;
  avgMonthlyRent: string;
  avgPropertyPrice: string;
  annualYield: string;
}

interface MarketAnalyticsModuleData {
  error?: string;
  kpis?: MarketKpi[];
  propertyTypeRows?: PropertyTypeRow[];
  agentRows?: AgentPerformanceRow[];
  rentalYieldRows?: RentalYieldRow[];
}

type DateRange = 'week' | 'month' | 'quarter' | 'year';

export default function MarketAnalyticsModule({ role, user, data }: CRMModuleProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState<DateRange>('month');

  const moduleData = (data ?? {}) as MarketAnalyticsModuleData;
  const roleLabel = typeof role === 'string' && role.length > 0 ? role : 'viewer';
  const userName =
    user && typeof user === 'object' && 'name' in user && typeof user.name === 'string'
      ? user.name
      : 'CRM User';
  const kpis = moduleData.kpis ?? [
    {
      title: 'Total Sales (Month)',
      value: '45 deals',
      delta: '↑ 12% from last month',
      deltaTone: 'success',
    },
    {
      title: 'Total Sales Value',
      value: 'AED 450M',
      delta: '↑ 8% from last month',
      deltaTone: 'success',
    },
    {
      title: 'Rental Transactions',
      value: '32 deals',
      delta: '→ 0% from last month',
      deltaTone: 'warning',
    },
    {
      title: 'Average Price/sqft',
      value: 'AED 1,450',
      delta: '↑ 2% from last month',
      deltaTone: 'success',
    },
  ];

  const propertyTypeRows = moduleData.propertyTypeRows ?? [
    { type: 'Apartments', salesCount: 28, totalValue: 'AED 280M', marketShare: '62%' },
    { type: 'Villas', salesCount: 12, totalValue: 'AED 150M', marketShare: '33%' },
    { type: 'Commercial', salesCount: 5, totalValue: 'AED 20M', marketShare: '5%' },
  ];

  const agentRows = moduleData.agentRows ?? [
    {
      agentName: 'Ahmed Al-Mansouri',
      totalDeals: 15,
      avgDealSize: 'AED 12.5M',
      commissionYtd: 'AED 375K',
      closeRate: '85%',
      avgDaysToClose: '18 days',
      highlight: true,
    },
    {
      agentName: 'Fatima Al-Naqbi',
      totalDeals: 12,
      avgDealSize: 'AED 10.2M',
      commissionYtd: 'AED 306K',
      closeRate: '78%',
      avgDaysToClose: '22 days',
    },
    {
      agentName: 'Mohammed Al-Ketbi',
      totalDeals: 10,
      avgDealSize: 'AED 9.8M',
      commissionYtd: 'AED 294K',
      closeRate: '72%',
      avgDaysToClose: '25 days',
    },
    {
      agentName: 'Zainab Al-Moradi',
      totalDeals: 8,
      avgDealSize: 'AED 8.5M',
      commissionYtd: 'AED 255K',
      closeRate: '68%',
      avgDaysToClose: '28 days',
    },
  ];

  const rentalYieldRows = moduleData.rentalYieldRows ?? [
    {
      location: 'Marina',
      avgMonthlyRent: 'AED 5,500',
      avgPropertyPrice: 'AED 1.5M',
      annualYield: '4.4%',
    },
    {
      location: 'Downtown',
      avgMonthlyRent: 'AED 6,200',
      avgPropertyPrice: 'AED 1.8M',
      annualYield: '4.1%',
    },
    {
      location: 'JBR',
      avgMonthlyRent: 'AED 4,800',
      avgPropertyPrice: 'AED 1.2M',
      annualYield: '4.8%',
    },
  ];

  const renderDashboard = () => (
    <div className="module-dashboard">
      {kpis.length === 0 ? (
        <div role="status" aria-live="polite" className="market-analytics__empty-kpi">
          No KPI data available for the selected period.
        </div>
      ) : null}
      <div className="kpi-grid">
        {kpis.map(kpi => (
          <div className="kpi-card" key={kpi.title}>
            <h4>{kpi.title}</h4>
            <p className="market-analytics__kpi-value">{kpi.value}</p>
            <span className={`market-analytics__kpi-delta market-analytics__kpi-delta--${kpi.deltaTone}`}>
              {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      <div className="market-analytics__section-spacer-lg">
        <h3>Sales by Property Type</h3>
        <div className="chart-placeholder">
          <table>
            <thead>
              <tr>
                <th>Property Type</th>
                <th>Sales Count</th>
                <th>Total Value</th>
                <th>Market Share</th>
              </tr>
            </thead>
            <tbody>
              {propertyTypeRows.map(row => (
                <tr key={row.type}>
                  <td>{row.type}</td>
                  <td>{row.salesCount}</td>
                  <td>{row.totalValue}</td>
                  <td>{row.marketShare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAgentPerformance = () => (
    <div className="module-section">
      <h3>Agent Performance Ranking</h3>
      <table className="performance-table">
        <thead>
          <tr>
            <th>Agent Name</th>
            <th>Total Deals</th>
            <th>Avg Deal Size</th>
            <th>Commission YTD</th>
            <th>Close Rate</th>
            <th>Avg Days-to-Close</th>
          </tr>
        </thead>
        <tbody>
          {agentRows.map(agent => (
            <tr
              key={agent.agentName}
              className={agent.highlight ? 'market-analytics__agent-row--highlight' : undefined}
            >
              <td>{agent.highlight ? <strong>{agent.agentName}</strong> : agent.agentName}</td>
              <td>{agent.totalDeals}</td>
              <td>{agent.avgDealSize}</td>
              <td>{agent.commissionYtd}</td>
              <td>{agent.closeRate}</td>
              <td>{agent.avgDaysToClose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMarketTrends = () => (
    <div className="module-section">
      <h3>Market Trends & Forecasts</h3>
      <div className="market-analytics__section-spacer-md">
        <h4>Dubai Real Estate Market Overview</h4>
        <ul className="market-analytics__overview-list">
          <li><strong>Current Market Status:</strong> Stable with moderate growth</li>
          <li><strong>Rental Yield (Average):</strong> 4-5% per annum</li>
          <li><strong>Price Growth (YoY):</strong> +2.8%</li>
          <li><strong>Most Active Areas:</strong> Marina, Downtown, JBR</li>
          <li><strong>6-Month Forecast:</strong> Slight appreciation expected (+1-2%)</li>
          <li><strong>Key Regulations:</strong> RERA compliance mandatory, DLD taxes apply</li>
        </ul>
      </div>

      <div className="market-analytics__section-spacer-md">
        <h4>Rental Yields by Location</h4>
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Avg Monthly Rent</th>
              <th>Avg Property Price</th>
              <th>Annual Yield (%)</th>
            </tr>
          </thead>
          <tbody>
            {rentalYieldRows.map(row => (
              <tr key={row.location}>
                <td>{row.location}</td>
                <td>{row.avgMonthlyRent}</td>
                <td>{row.avgPropertyPrice}</td>
                <td>{row.annualYield}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const periodButtons: DateRange[] = ['week', 'month', 'quarter', 'year'];

  return (
    <div className="dubai-crm-module market-analytics-module" data-date-range={dateRange}>
      <div className="module-header">
        <h1>Market Analytics & Reporting</h1>
        <p>Real estate market insights, agent performance tracking, and trend analysis</p>
        <p className="market-analytics__viewer-context">
          Viewing as <strong>{roleLabel}</strong> • {userName}
        </p>
      </div>

      {moduleData.error ? (
        <div role="alert" className="market-analytics__error-banner">
          {moduleData.error}
        </div>
      ) : null}

      <div className="market-analytics__date-range" aria-label="Date range selector">
        {periodButtons.map(period => (
          <button
            key={period}
            type="button"
            className="tab"
            onClick={() => setDateRange(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      <div className="module-tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Market Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          Agent Performance
        </button>
        <button
          className={`tab ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Trends & Forecasts
        </button>
      </div>

      <div className="module-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'agents' && renderAgentPerformance()}
        {activeTab === 'trends' && renderMarketTrends()}
      </div>
    </div>
  );
}
