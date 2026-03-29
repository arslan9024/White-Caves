import React, { useState } from 'react';
import type { CRMModuleProps } from './types';

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

export default function MarketAnalyticsModule({ role, user, data }: CRMModuleProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('month');

  const renderDashboard = () => (
    <div className="module-dashboard">
      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Sales (Month)</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
            45 deals
          </p>
          <span style={{ color: '#22c55e', fontSize: '12px' }}>↑ 12% from last month</span>
        </div>
        <div className="kpi-card">
          <h4>Total Sales Value</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
            AED 450M
          </p>
          <span style={{ color: '#22c55e', fontSize: '12px' }}>↑ 8% from last month</span>
        </div>
        <div className="kpi-card">
          <h4>Rental Transactions</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
            32 deals
          </p>
          <span style={{ color: '#f59e0b', fontSize: '12px' }}>→ 0% from last month</span>
        </div>
        <div className="kpi-card">
          <h4>Average Price/sqft</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
            AED 1,450
          </p>
          <span style={{ color: '#22c55e', fontSize: '12px' }}>↑ 2% from last month</span>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
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
              <tr>
                <td>Apartments</td>
                <td>28</td>
                <td>AED 280M</td>
                <td>62%</td>
              </tr>
              <tr>
                <td>Villas</td>
                <td>12</td>
                <td>AED 150M</td>
                <td>33%</td>
              </tr>
              <tr>
                <td>Commercial</td>
                <td>5</td>
                <td>AED 20M</td>
                <td>5%</td>
              </tr>
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
          <tr style={{ backgroundColor: '#e6f2ff' }}>
            <td><strong>Ahmed Al-Mansouri</strong></td>
            <td>15</td>
            <td>AED 12.5M</td>
            <td>AED 375K</td>
            <td>85%</td>
            <td>18 days</td>
          </tr>
          <tr>
            <td>Fatima Al-Naqbi</td>
            <td>12</td>
            <td>AED 10.2M</td>
            <td>AED 306K</td>
            <td>78%</td>
            <td>22 days</td>
          </tr>
          <tr>
            <td>Mohammed Al-Ketbi</td>
            <td>10</td>
            <td>AED 9.8M</td>
            <td>AED 294K</td>
            <td>72%</td>
            <td>25 days</td>
          </tr>
          <tr>
            <td>Zainab Al-Moradi</td>
            <td>8</td>
            <td>AED 8.5M</td>
            <td>AED 255K</td>
            <td>68%</td>
            <td>28 days</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderMarketTrends = () => (
    <div className="module-section">
      <h3>Market Trends & Forecasts</h3>
      <div style={{ marginTop: '20px' }}>
        <h4>Dubai Real Estate Market Overview</h4>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Current Market Status:</strong> Stable with moderate growth</li>
          <li><strong>Rental Yield (Average):</strong> 4-5% per annum</li>
          <li><strong>Price Growth (YoY):</strong> +2.8%</li>
          <li><strong>Most Active Areas:</strong> Marina, Downtown, JBR</li>
          <li><strong>6-Month Forecast:</strong> Slight appreciation expected (+1-2%)</li>
          <li><strong>Key Regulations:</strong> RERA compliance mandatory, DLD taxes apply</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
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
            <tr>
              <td>Marina</td>
              <td>AED 5,500</td>
              <td>AED 1.5M</td>
              <td>4.4%</td>
            </tr>
            <tr>
              <td>Downtown</td>
              <td>AED 6,200</td>
              <td>AED 1.8M</td>
              <td>4.1%</td>
            </tr>
            <tr>
              <td>JBR</td>
              <td>AED 4,800</td>
              <td>AED 1.2M</td>
              <td>4.8%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="dubai-crm-module market-analytics-module">
      <div className="module-header">
        <h1>Market Analytics & Reporting</h1>
        <p>Real estate market insights, agent performance tracking, and trend analysis</p>
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
