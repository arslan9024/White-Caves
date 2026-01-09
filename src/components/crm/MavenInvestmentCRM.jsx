import React from 'react';
import { PieChart, TrendingUp, Calculator, BarChart3, DollarSign, Target } from 'lucide-react';
import './shared/CRMDashboard.css';

const MavenInvestmentCRM = ({ assistant }) => {
  const stats = [
    { label: 'Active Portfolios', value: '67', icon: PieChart, trend: 'AED 1.2B total' },
    { label: 'Avg ROI', value: '12.4%', icon: TrendingUp, trend: '+2.1% vs market' },
    { label: 'Investment Leads', value: '34', icon: Target, trend: '18 qualified' },
    { label: 'This Month Deals', value: '8', icon: DollarSign, trend: 'AED 156M' }
  ];

  return (
    <div className="crm-dashboard maven-investment">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#10B981'}20` }}>
            <PieChart size={28} style={{ color: assistant?.color || '#10B981' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Maven'}</h1>
            <p>{assistant?.title || 'Investment Analysis & Advisory'}</p>
          </div>
        </div>
      </div>

      <div className="crm-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-trend">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="crm-content-grid">
        <div className="crm-panel">
          <div className="panel-header">
            <h3>Top Investment Opportunities</h3>
            <Target size={18} />
          </div>
          <div className="panel-content">
            {[
              { property: 'Off-Plan Tower, Creek Harbour', roi: '18%', entry: 'AED 1.2M', type: 'Off-Plan' },
              { property: 'Rental Portfolio, JBR', roi: '8%', entry: 'AED 4.5M', type: 'Rental' },
              { property: 'Commercial Block, Business Bay', roi: '11%', entry: 'AED 8M', type: 'Commercial' },
              { property: 'Villa Flip, Arabian Ranches', roi: '22%', entry: 'AED 3.2M', type: 'Flip' }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.property}</span>
                  <span className="item-meta">{item.entry} • {item.type}</span>
                </div>
                <span className="roi-badge">{item.roi} ROI</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>Investor Profiles</h3>
            <Calculator size={18} />
          </div>
          <div className="panel-content">
            {[
              { investor: 'Al Rashid Family Office', aum: 'AED 450M', strategy: 'Long-term Rental', status: 'Active' },
              { investor: 'Global RE Fund', aum: 'AED 280M', strategy: 'Value-Add', status: 'Deploying' },
              { investor: 'Tech Entrepreneur', aum: 'AED 85M', strategy: 'Trophy Assets', status: 'Searching' },
              { investor: 'Pension Fund', aum: 'AED 520M', strategy: 'Core Plus', status: 'Due Diligence' }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.investor}</span>
                  <span className="item-meta">{item.aum} • {item.strategy}</span>
                </div>
                <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>Investment Strategies Performance</h3>
            <BarChart3 size={18} />
          </div>
          <div className="panel-content categories">
            {[
              { name: 'Off-Plan', avgROI: '15-25%', risk: 'Medium-High' },
              { name: 'Rental Income', avgROI: '6-9%', risk: 'Low' },
              { name: 'Value-Add', avgROI: '12-18%', risk: 'Medium' },
              { name: 'Development', avgROI: '20-35%', risk: 'High' },
              { name: 'Distressed', avgROI: '25-40%', risk: 'High' },
              { name: 'Trophy Assets', avgROI: '5-8%', risk: 'Low' }
            ].map((strategy, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{strategy.name}</span>
                <span className="category-count">{strategy.avgROI} ROI • {strategy.risk} Risk</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MavenInvestmentCRM;
