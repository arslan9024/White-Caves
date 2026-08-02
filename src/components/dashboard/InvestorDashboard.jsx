import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import {
  TrendingUp, DollarSign, Target, PieChart as PieIcon, Calendar,
  AlertCircle, Download, Plus, Globe, Activity
} from 'lucide-react';
import './InvestorDashboard.css';

/**
 * Investor Dashboard - For Maven (UHNWI Investor)
 * 
 * Key Responsibilities:
 * - Investment portfolio management
 * - ROI and performance tracking
 * - Asset allocation visualization
 * - Risk analysis and diversification
 * - Financial forecasting
 * - Investment opportunity analysis
 */

export default function InvestorDashboard({ user }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAsset, setSelectedAsset] = useState('all');
  const [sortBy, setSortBy] = useState('value');

  // Mock data
  const investorMetrics = {
    totalInvested: 'AED 45,800,000',
    portfolioValue: 'AED 52,340,000',
    totalGain: 'AED 6,540,000',
    gainPercentage: '+14.3%',
    yearlyROI: '18.2%',
    diversificationScore: '8.5/10',
    riskLevel: 'Moderate'
  };

  const portfolioAssets = [
    {
      id: 1,
      name: 'Real Estate Portfolio',
      type: 'property',
      invested: 'AED 25,000,000',
      currentValue: 'AED 28,500,000',
      gain: 'AED 3,500,000',
      gainPercent: 14,
      allocation: 54.4,
      roi: 14,
      units: 12,
      image: '🏢'
    },
    {
      id: 2,
      name: 'Equities & Stocks',
      type: 'stock',
      invested: 'AED 12,000,000',
      currentValue: 'AED 15,200,000',
      gain: 'AED 3,200,000',
      gainPercent: 26.7,
      allocation: 29.0,
      roi: 26.7,
      shares: 450,
      image: '📈'
    },
    {
      id: 3,
      name: 'Fixed Income Securities',
      type: 'bonds',
      invested: 'AED 6,500,000',
      currentValue: 'AED 7,100,000',
      gain: 'AED 600,000',
      gainPercent: 9.2,
      allocation: 13.6,
      roi: 9.2,
      amount: 'AED 7.1M',
      image: '📊'
    },
    {
      id: 4,
      name: 'Private Equity',
      type: 'equity',
      invested: 'AED 2,300,000',
      currentValue: 'AED 1,540,000',
      gain: '-AED 760,000',
      gainPercent: -33,
      allocation: 2.9,
      roi: -33,
      shares: 5,
      image: '💼'
    }
  ];

  const performanceHistory = [
    { month: 'Jan', value: 47200000, invested: 45800000, gain: 1400000 },
    { month: 'Feb', value: 48900000, invested: 45800000, gain: 3100000 },
    { month: 'Mar', value: 50100000, invested: 45800000, gain: 4300000 },
    { month: 'Apr', value: 49500000, invested: 45800000, gain: 3700000 },
    { month: 'May', value: 51200000, invested: 45800000, gain: 5400000 },
    { month: 'Jun', value: 52340000, invested: 45800000, gain: 6540000 }
  ];

  const assetAllocation = portfolioAssets.map(asset => ({
    name: asset.name,
    value: parseFloat(asset.allocation),
    color: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'][portfolioAssets.indexOf(asset)]
  }));

  const investments = [
    {
      id: 1,
      property: 'Damac Hills 2 Portfolio',
      location: 'Dubai Hills Estate',
      type: 'Residential',
      purchaseDate: '2020-06-15',
      purchasePrice: 'AED 12,500,000',
      currentValue: 'AED 14,200,000',
      monthlyIncome: 'AED 145,000',
      roi: '13.6%',
      status: 'performing'
    },
    {
      id: 2,
      property: 'Downtown Dubai Commercial',
      location: 'Downtown Dubai',
      type: 'Commercial',
      purchaseDate: '2019-03-20',
      purchasePrice: 'AED 8,300,000',
      currentValue: 'AED 9,800,000',
      monthlyIncome: 'AED 78,000',
      roi: '18.1%',
      status: 'performing'
    },
    {
      id: 3,
      property: 'Emirates Hills Villa',
      location: 'Emirates Hills',
      type: 'Luxury Residential',
      purchaseDate: '2021-09-10',
      purchasePrice: 'AED 4,200,000',
      currentValue: 'AED 5,500,000',
      monthlyIncome: 'AED 25,000',
      roi: '30.9%',
      status: 'excellent'
    },
    {
      id: 4,
      property: 'JBR Mixed-Use Development',
      location: 'JBR',
      type: 'Mixed-Use',
      purchaseDate: '2022-02-28',
      purchasePrice: 'AED 2,800,000',
      currentValue: 'AED 2,450,000',
      monthlyIncome: 'AED 12,000',
      roi: '-12.5%',
      status: 'underperforming'
    }
  ];

  const monthlyIncomeBreakdown = [
    { source: 'Real Estate', amount: 145000, percentage: 65 },
    { source: 'Dividend Income', amount: 55000, percentage: 25 },
    { source: 'Interest Income', amount: 25000, percentage: 10 }
  ];

  const riskProfile = [
    { category: 'Portfolio Beta', value: 0.85 },
    { category: 'Volatility', value: '12.3%' },
    { category: 'Sharpe Ratio', value: 1.85 },
    { category: 'Max Drawdown', value: '8.5%' }
  ];

  const opportunities = [
    {
      id: 1,
      name: 'Palm Jumeirah Luxury Villa',
      location: 'Palm Jumeirah',
      price: 'AED 18,500,000',
      expectedROI: '16-20%',
      riskLevel: 'Low-Moderate',
      timeline: '2-3 years',
      interest: 'Interested'
    },
    {
      id: 2,
      name: 'Business Bay Office Complex',
      location: 'Business Bay',
      price: 'AED 25,000,000',
      expectedROI: '12-15%',
      riskLevel: 'Low',
      timeline: '3-5 years',
      interest: 'Considering'
    },
    {
      id: 3,
      name: 'Off-Plan Luxury Apartments',
      location: 'Downtown Dubai',
      price: 'AED 8,750,000',
      expectedROI: '18-22%',
      riskLevel: 'Moderate',
      timeline: '1-2 years',
      interest: 'New'
    }
  ];

  const getGainColor = (gain) => {
    if (typeof gain === 'string') {
      return gain.includes('-') ? '#ef4444' : '#10b981';
    }
    return gain >= 0 ? '#10b981' : '#ef4444';
  };

  const getStatusColor = (status) => {
    const colors = {
      performing: '#10b981',
      excellent: '#059669',
      underperforming: '#ef4444',
      neutral: '#f59e0b'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="investor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Investment Portfolio Dashboard</h1>
          <p>UHNWI Investor - Maven | Portfolio Value: {investorMetrics.portfolioValue}</p>
        </div>
        <div className="header-actions">
          <button className="btn-action btn-primary">
            <Plus size={18} /> New Investment
          </button>
          <button className="btn-action btn-secondary">
            <Download size={18} /> Reports
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="kpi-section">
        <div className="kpi-card invested">
          <div className="kpi-label">💰 Total Invested</div>
          <div className="kpi-value">{investorMetrics.totalInvested}</div>
          <div className="kpi-sublabel">Initial capital</div>
        </div>
        <div className="kpi-card portfolio">
          <div className="kpi-label">📊 Portfolio Value</div>
          <div className="kpi-value">{investorMetrics.portfolioValue}</div>
          <div className="kpi-sublabel">Current market value</div>
        </div>
        <div className="kpi-card gain">
          <div className="kpi-label">📈 Total Gain</div>
          <div className="kpi-value">{investorMetrics.totalGain}</div>
          <div className="kpi-sublabel">{investorMetrics.gainPercentage}</div>
        </div>
        <div className="kpi-card roi">
          <div className="kpi-label">🎯 Yearly ROI</div>
          <div className="kpi-value">{investorMetrics.yearlyROI}</div>
          <div className="kpi-sublabel">Annual return</div>
        </div>
        <div className="kpi-card diversification">
          <div className="kpi-label">🎲 Diversification</div>
          <div className="kpi-value">{investorMetrics.diversificationScore}</div>
          <div className="kpi-sublabel">Well balanced</div>
        </div>
        <div className="kpi-card risk">
          <div className="kpi-label">⚠️ Risk Level</div>
          <div className="kpi-value">{investorMetrics.riskLevel}</div>
          <div className="kpi-sublabel">Optimal exposure</div>
        </div>
      </section>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {['overview', 'assets', 'investments', 'opportunities', 'analysis'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content overview-tab">
          <div className="grid-2col">
            {/* Performance Chart */}
            <div className="card">
              <h3>Portfolio Performance (6 Months)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `AED ${(value / 1000000).toFixed(1)}M`} />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Portfolio Value" />
                  <Area type="monotone" dataKey="invested" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Asset Allocation */}
            <div className="card">
              <h3>Asset Allocation</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Income */}
          <div className="card">
            <h3>Monthly Income Breakdown</h3>
            <div className="income-grid">
              {monthlyIncomeBreakdown.map((item, idx) => (
                <div key={idx} className="income-item">
                  <span className="source">{item.source}</span>
                  <span className="amount">AED {item.amount.toLocaleString()}</span>
                  <div className="income-bar">
                    <div className="income-fill" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <span className="percentage">{item.percentage}%</span>
                </div>
              ))}
              <div className="total-income">
                <span className="label">Total Monthly Income</span>
                <span className="amount">AED 225,000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="tab-content assets-tab">
          <div className="assets-grid">
            {portfolioAssets.map(asset => (
              <div key={asset.id} className={`asset-card gain-${asset.gainPercent >= 0 ? 'positive' : 'negative'}`}>
                <div className="asset-image">{asset.image}</div>
                <div className="asset-header">
                  <h4>{asset.name}</h4>
                  <span className={`gain-badge gain-${asset.gainPercent >= 0 ? 'positive' : 'negative'}`}>
                    {asset.gainPercent >= 0 ? '+' : ''}{asset.gainPercent}%
                  </span>
                </div>
                <div className="asset-metrics">
                  <div className="metric">
                    <span className="label">Allocated</span>
                    <span className="value">{asset.allocation}%</span>
                  </div>
                  <div className="metric">
                    <span className="label">Invested</span>
                    <span className="value">{asset.invested}</span>
                  </div>
                  <div className="metric">
                    <span className="label">Current Value</span>
                    <span className="value">{asset.currentValue}</span>
                  </div>
                  <div className="metric">
                    <span className="label">Gain/Loss</span>
                    <span className="value" style={{ color: getGainColor(asset.gain) }}>
                      {asset.gain}
                    </span>
                  </div>
                </div>
                <button className="asset-action">Manage</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investments Tab */}
      {activeTab === 'investments' && (
        <div className="tab-content investments-tab">
          <div className="investments-list">
            {investments.map(inv => (
              <div key={inv.id} className={`investment-item status-${inv.status}`}>
                <div className="investment-header">
                  <h4>{inv.property}</h4>
                  <span className={`status-badge status-${inv.status}`}>
                    {inv.status === 'excellent' ? '⭐ Excellent' : inv.status === 'performing' ? '✓ Performing' : inv.status === 'underperforming' ? '⚠ Underperforming' : '○ Neutral'}
                  </span>
                </div>
                <p className="investment-details">📍 {inv.location} | {inv.type}</p>
                <div className="investment-metrics">
                  <div className="metric-pair">
                    <div className="metric">
                      <span className="label">Purchase Price</span>
                      <span className="value">{inv.purchasePrice}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Current Value</span>
                      <span className="value">{inv.currentValue}</span>
                    </div>
                  </div>
                  <div className="metric-pair">
                    <div className="metric">
                      <span className="label">Monthly Income</span>
                      <span className="value">{inv.monthlyIncome}</span>
                    </div>
                    <div className="metric">
                      <span className="label">ROI</span>
                      <span className="value" style={{ color: getGainColor(inv.roi) }}>
                        {inv.roi}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="investment-footer">
                  <span className="purchase-date">Purchased: {inv.purchaseDate}</span>
                  <button className="action-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="tab-content opportunities-tab">
          <div className="opportunities-list">
            {opportunities.map(opp => (
              <div key={opp.id} className="opportunity-card">
                <div className="opportunity-header">
                  <h4>{opp.name}</h4>
                  <span className="new-badge">{opp.interest}</span>
                </div>
                <p className="opportunity-location">📍 {opp.location}</p>
                <div className="opportunity-details">
                  <div className="detail-group">
                    <span className="label">Investment</span>
                    <span className="value">{opp.price}</span>
                  </div>
                  <div className="detail-group">
                    <span className="label">Expected ROI</span>
                    <span className="value roi-value">{opp.expectedROI}</span>
                  </div>
                  <div className="detail-group">
                    <span className="label">Risk Level</span>
                    <span className="value">{opp.riskLevel}</span>
                  </div>
                  <div className="detail-group">
                    <span className="label">Timeline</span>
                    <span className="value">{opp.timeline}</span>
                  </div>
                </div>
                <div className="opportunity-actions">
                  <button className="action-btn primary">View Details</button>
                  <button className="action-btn secondary">Schedule Call</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="tab-content analysis-tab">
          <div className="analysis-grid">
            <div className="card">
              <h3>Risk Profile</h3>
              <div className="risk-metrics">
                {riskProfile.map((metric, idx) => (
                  <div key={idx} className="risk-item">
                    <span className="category">{metric.category}</span>
                    <span className="metric-value">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Performance Summary</h3>
              <div className="performance-summary">
                <div className="summary-stat">
                  <span className="label">YTD Return</span>
                  <span className="value success">+18.2%</span>
                </div>
                <div className="summary-stat">
                  <span className="label">3-Year CAGR</span>
                  <span className="value success">+15.4%</span>
                </div>
                <div className="summary-stat">
                  <span className="label">Best Performer</span>
                  <span className="value">Emirates Hills Villa (+30.9%)</span>
                </div>
                <div className="summary-stat">
                  <span className="label">Underperformer</span>
                  <span className="value warning">JBR Mixed-Use (-12.5%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
