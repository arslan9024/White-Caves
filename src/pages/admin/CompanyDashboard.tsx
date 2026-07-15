import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/TranslationContext';
import { createLogger } from '../../utils/logger';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import './CompanyDashboard.css';

const logger = createLogger('CompanyDashboard');

const salesData = [
  { name: 'Jan', revenue: 4000, leads: 2400 },
  { name: 'Feb', revenue: 3000, leads: 1398 },
  { name: 'Mar', revenue: 2000, leads: 9800 },
  { name: 'Apr', revenue: 2780, leads: 3908 },
  { name: 'May', revenue: 1890, leads: 4800 },
  { name: 'Jun', revenue: 2390, leads: 3800 },
  { name: 'Jul', revenue: 3490, leads: 4300 },
];

export default function CompanyDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'sales' | 'hr' | 'leasing'>(
    'overview'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-ring"></div>
        <p>Loading God-Mode Metrics...</p>
      </div>
    );
  }

  return (
    <div className="company-dashboard-container">
      <header className="dashboard-header glass-panel">
        <div className="header-content">
          <h1>Executive Dashboard</h1>
          <p className="subtitle">White Caves God-Mode Analytics</p>
        </div>
        <div className="header-actions">
          <button className="btn-glass active">Live</button>
          <button className="btn-glass">Reports</button>
        </div>
      </header>

      <nav className="dashboard-tabs glass-panel">
        {(['overview', 'finance', 'sales', 'leasing', 'hr'] as const).map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overview-grid"
          >
            <div className="metric-card glass-panel highlight">
              <h3>Total Revenue (YTD)</h3>
              <h2>AED 42.5M</h2>
              <span className="trend positive">↑ 12.5% vs Last Year</span>
            </div>
            <div className="metric-card glass-panel">
              <h3>Active Leads</h3>
              <h2>1,248</h2>
              <span className="trend positive">↑ 5.2% vs Last Month</span>
            </div>
            <div className="metric-card glass-panel">
              <h3>Properties Under Management</h3>
              <h2>342</h2>
              <span className="trend neutral">→ Stable</span>
            </div>
            <div className="metric-card glass-panel">
              <h3>Pending Maintenance</h3>
              <h2>14</h2>
              <span className="trend negative">↓ -2 resolved today</span>
            </div>

            <div className="chart-card glass-panel span-2">
              <h3>Revenue vs Leads Trend</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c5a977" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#c5a977" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a202c',
                        borderColor: '#2d3748',
                        color: '#fff',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#c5a977"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'finance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overview-grid"
          >
            <div className="metric-card glass-panel highlight">
              <h3>Net Profit (MTD)</h3>
              <h2>AED 4.2M</h2>
              <span className="trend positive">↑ 18%</span>
            </div>
            <div className="metric-card glass-panel">
              <h3>VAT Collected (5%)</h3>
              <h2>AED 210,000</h2>
              <span className="trend neutral">→ On Track</span>
            </div>
            <div className="chart-card glass-panel span-4">
              <h3>Operating Cash Flow Projection</h3>
              <div
                className="chart-container"
                style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: '#a0aec0' }}>
                  Advanced Finance Chart integration pending data source connection.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sales' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overview-grid"
          >
            <div className="metric-card glass-panel">
              <h3>Closed Deals</h3>
              <h2>184</h2>
              <span className="trend positive">↑ 12%</span>
            </div>
            <div className="metric-card glass-panel">
              <h3>Average Deal Size</h3>
              <h2>AED 3.8M</h2>
              <span className="trend positive">↑ 5%</span>
            </div>
            <div className="metric-card glass-panel">
              <h3>Conversion Rate</h3>
              <h2>14.2%</h2>
              <span className="trend negative">↓ -1.1%</span>
            </div>
          </motion.div>
        )}

        {activeTab === 'hr' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overview-grid"
          >
            <div className="metric-card glass-panel">
              <h3>Active Employees</h3>
              <h2>86</h2>
              <span className="trend neutral">→ Stable</span>
            </div>
            <div className="metric-card glass-panel">
              <h3>Pending Onboarding</h3>
              <h2>4</h2>
            </div>
          </motion.div>
        )}

        {activeTab === 'leasing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overview-grid"
          >
            <div className="metric-card glass-panel highlight">
              <h3>Active Tenancies</h3>
              <h2>428</h2>
              <span className="trend positive">↑ 8%</span>
            </div>
            <div className="metric-card glass-panel">
              <h3>Expiring in 30 Days</h3>
              <h2>34</h2>
              <span className="trend warning">Action Required</span>
            </div>
            <div className="metric-card glass-panel">
              <h3>Ejari Registrations</h3>
              <h2>100%</h2>
              <span className="trend positive">Compliant</span>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
