import React from 'react';
import { LineChart, TrendingUp, Building2, DollarSign, BarChart3, Globe } from 'lucide-react';
import './shared/CRMDashboard.css';

const CipherMarketCRM = ({ assistant }) => {
  const stats = [
    { label: 'Market Index', value: '1,847', icon: LineChart, trend: '+3.2% this month' },
    { label: 'Avg. Price/sqft', value: 'AED 1,250', icon: DollarSign, trend: '+5% YoY' },
    { label: 'Active Listings', value: '12.4K', icon: Building2, trend: '+890 new' },
    { label: 'Market Sentiment', value: 'Bullish', icon: TrendingUp, trend: 'Strong demand' }
  ];

  return (
    <div className="crm-dashboard cipher-market">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#0EA5E9'}20` }}>
            <LineChart size={28} style={{ color: assistant?.color || '#0EA5E9' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Cipher'}</h1>
            <p>{assistant?.title || 'Market Intelligence & Analytics'}</p>
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
            <h3>Market Trends</h3>
            <TrendingUp size={18} />
          </div>
          <div className="panel-content">
            {[
              { area: 'Dubai Marina', trend: 'Up', change: '+8.5%', demand: 'Very High', forecast: 'Bullish' },
              { area: 'Downtown Dubai', trend: 'Up', change: '+6.2%', demand: 'High', forecast: 'Bullish' },
              { area: 'Palm Jumeirah', trend: 'Stable', change: '+2.1%', demand: 'High', forecast: 'Stable' },
              { area: 'Business Bay', trend: 'Up', change: '+5.8%', demand: 'Medium', forecast: 'Bullish' },
              { area: 'JBR', trend: 'Up', change: '+4.3%', demand: 'High', forecast: 'Stable' }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.area}</span>
                  <span className="item-meta">{item.change} • {item.demand} demand</span>
                </div>
                <span className={`trend-badge ${item.trend.toLowerCase()}`}>{item.forecast}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>Competitor Analysis</h3>
            <Globe size={18} />
          </div>
          <div className="panel-content">
            {[
              { company: 'Bayut', listings: '45,230', growth: '+12%', share: '28%' },
              { company: 'Property Finder', listings: '38,450', growth: '+8%', share: '24%' },
              { company: 'Dubizzle', listings: '32,120', growth: '+5%', share: '20%' },
              { company: 'White Caves', listings: '2,450', growth: '+45%', share: '2%' }
            ].map((competitor, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{competitor.company}</span>
                  <span className="item-meta">{competitor.listings} listings</span>
                </div>
                <div className="item-actions">
                  <span className="growth-badge">{competitor.growth}</span>
                  <span className="share-badge">{competitor.share}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>Property Type Performance</h3>
            <BarChart3 size={18} />
          </div>
          <div className="panel-content categories">
            {[
              { name: 'Apartments', avgPrice: 'AED 1.8M', growth: '+7%' },
              { name: 'Villas', avgPrice: 'AED 4.5M', growth: '+12%' },
              { name: 'Townhouses', avgPrice: 'AED 2.8M', growth: '+9%' },
              { name: 'Penthouses', avgPrice: 'AED 8.2M', growth: '+15%' },
              { name: 'Commercial', avgPrice: 'AED 3.2M', growth: '+4%' },
              { name: 'Land', avgPrice: 'AED 6.8M', growth: '+18%' }
            ].map((category, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.avgPrice} ({category.growth})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CipherMarketCRM;
