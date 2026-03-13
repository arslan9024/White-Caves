import React, { useState } from 'react';
import './TabStyles.css';

const AnalyticsTab = ({ data, loading }) => {
  const [timeRange, setTimeRange] = useState('month');

  const metrics = [
    { label: 'Conversion Rate', value: '4.8%', change: '+0.5%', trend: 'up' },
    { label: 'Average Deal Size', value: 'AED 2.1M', change: '+12%', trend: 'up' },
    { label: 'Lead Response Time', value: '15 min', change: '-5 min', trend: 'up' },
    { label: 'Customer Satisfaction', value: '4.7/5', change: '+0.2', trend: 'up' },
  ];

  const revenueByEmirate = [
    { emirate: 'Dubai', revenue: 18500000, percentage: 72 },
    { emirate: 'Abu Dhabi', revenue: 4200000, percentage: 16 },
    { emirate: 'Sharjah', revenue: 1800000, percentage: 7 },
    { emirate: 'Ajman', revenue: 800000, percentage: 3 },
    { emirate: 'RAK', revenue: 500000, percentage: 2 },
  ];

  const propertyPerformance = [
    { type: 'Apartments', views: 12500, inquiries: 890, deals: 45 },
    { type: 'Villas', views: 8200, inquiries: 620, deals: 28 },
    { type: 'Townhouses', views: 4500, inquiries: 320, deals: 18 },
    { type: 'Commercial', views: 2800, inquiries: 180, deals: 8 },
    { type: 'Land', views: 1200, inquiries: 85, deals: 4 },
  ];

  const topAgents = [
    { name: 'Ahmed Ali', deals: 12, revenue: 3200000 },
    { name: 'Sara Khan', deals: 22, revenue: 1800000 },
    { name: 'Mohammed Hassan', deals: 8, revenue: 2100000 },
    { name: 'Fatima Ahmed', deals: 28, revenue: 1500000 },
  ];

  return (
    <div className="analytics-tab">
      <div className="tab-header">
        <h3>Business Analytics</h3>
        <div className="time-range-selector">
          {['week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              <span className={`metric-change ${metric.trend}`}>
                {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
              </span>
            </div>
            <div className="metric-value">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="analytics-row">
        <div className="analytics-card">
          <h4>Revenue by Emirate</h4>
          <div className="emirate-chart">
            {revenueByEmirate.map((item, index) => (
              <div key={index} className="emirate-bar-container">
                <div className="emirate-info">
                  <span className="emirate-name">{item.emirate}</span>
                  <span className="emirate-value">AED {(item.revenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="emirate-bar-bg">
                  <div 
                    className="emirate-bar" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="emirate-percent">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h4>Top Performing Agents</h4>
          <div className="top-agents-list">
            {topAgents.map((agent, index) => (
              <div key={index} className="agent-row">
                <div className="agent-rank">#{index + 1}</div>
                <div className="agent-info">
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-deals">{agent.deals} deals</span>
                </div>
                <div className="agent-revenue">AED {(agent.revenue / 1000000).toFixed(1)}M</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-card full-width">
        <h4>Property Type Performance</h4>
        <div className="performance-table">
          <table>
            <thead>
              <tr>
                <th>Property Type</th>
                <th>Views</th>
                <th>Inquiries</th>
                <th>Deals Closed</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {propertyPerformance.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.type}</strong></td>
                  <td>{item.views.toLocaleString()}</td>
                  <td>{item.inquiries}</td>
                  <td>{item.deals}</td>
                  <td>
                    <div className="conversion-cell">
                      <div className="conversion-bar" style={{ width: `${(item.deals / item.inquiries) * 100 * 10}%` }} />
                      <span>{((item.deals / item.inquiries) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analytics-row">
        <div className="analytics-card">
          <h4>Lead Sources</h4>
          <div className="lead-sources">
            {[
              { source: 'WhatsApp', leads: 45, color: '#25D366' },
              { source: 'Website', leads: 32, color: '#3B82F6' },
              { source: 'Chatbot', leads: 28, color: '#8B5CF6' },
              { source: 'Referral', leads: 18, color: '#F59E0B' },
              { source: 'Social Media', leads: 12, color: '#EC4899' },
            ].map((item, index) => (
              <div key={index} className="source-item">
                <div className="source-dot" style={{ backgroundColor: item.color }} />
                <span className="source-name">{item.source}</span>
                <span className="source-leads">{item.leads} leads</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h4>Monthly Trend</h4>
          <div className="trend-chart">
            {[65, 78, 72, 85, 82, 95, 88, 102, 98, 115, 108, 125].map((value, i) => (
              <div key={i} className="trend-bar-container">
                <div 
                  className="trend-bar" 
                  style={{ height: `${(value / 130) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="trend-labels">
            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
