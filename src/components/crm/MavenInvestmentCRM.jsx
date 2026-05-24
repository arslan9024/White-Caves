import React, { useState } from 'react';
import { 
  PieChart, TrendingUp, Calculator, Lightbulb, BarChart3,
  DollarSign, Percent, Calendar, Target, ArrowUp, ArrowDown,
  Filter, Search, Plus, Eye, Building, MapPin
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const PORTFOLIO_DATA = [
  { id: 1, property: 'Villa 234 - DAMAC Hills 2', type: 'Villa', value: 'AED 2.8M', yield: '7.2%', appreciation: '+12%', recommendation: 'Hold', status: 'performing' },
  { id: 2, property: 'Apt 1205 - Dubai Marina', type: 'Apartment', value: 'AED 1.9M', yield: '6.8%', appreciation: '+8%', recommendation: 'Hold', status: 'performing' },
  { id: 3, property: 'Commercial - Business Bay', type: 'Office', value: 'AED 4.5M', yield: '9.1%', appreciation: '+5%', recommendation: 'Buy More', status: 'strong' },
  { id: 4, property: 'Studio - JVC', type: 'Studio', value: 'AED 650K', yield: '8.5%', appreciation: '-2%', recommendation: 'Sell', status: 'underperforming' },
  { id: 5, property: 'Townhouse - Springs', type: 'Townhouse', value: 'AED 3.2M', yield: '5.8%', appreciation: '+15%', recommendation: 'Hold', status: 'performing' }
];

const YIELD_OPTIMIZATION = [
  { id: 1, property: 'Villa 234', currentRent: 'AED 180K', marketRent: 'AED 210K', upside: '+16.7%', action: 'Increase at renewal' },
  { id: 2, property: 'Apt 1205', currentRent: 'AED 130K', marketRent: 'AED 125K', upside: '-3.8%', action: 'Market competitive' },
  { id: 3, property: 'Studio JVC', currentRent: 'AED 55K', marketRent: 'AED 48K', upside: '-12.7%', action: 'Consider selling' }
];

const INVESTMENT_OPPORTUNITIES = [
  { id: 1, property: 'Off-Plan Tower - MBR City', price: 'AED 1.2M', expectedYield: '8.5%', appreciation: '+18%', roi: '26.5%', risk: 'Medium' },
  { id: 2, property: 'Ready Villa - Arabian Ranches', price: 'AED 3.8M', expectedYield: '5.2%', appreciation: '+12%', roi: '17.2%', risk: 'Low' },
  { id: 3, property: 'Commercial - Dubai South', price: 'AED 2.5M', expectedYield: '10.2%', appreciation: '+8%', roi: '18.2%', risk: 'Medium' },
  { id: 4, property: 'Penthouse - Creek Harbour', price: 'AED 6.8M', expectedYield: '4.8%', appreciation: '+22%', roi: '26.8%', risk: 'Low' }
];

const TAX_INSIGHTS = [
  { id: 1, insight: 'Golden Visa Eligibility', detail: 'Portfolio exceeds AED 2M threshold', action: 'Apply for 10-year visa' },
  { id: 2, insight: 'Corporate Structure', detail: 'Consider freezone company for rental income', action: 'Consult tax advisor' },
  { id: 3, insight: 'Capital Gains', detail: 'No capital gains tax in UAE', action: 'Optimize exit timing' }
];

const MavenInvestmentCRM = () => {
  const [activeTab, setActiveTab] = useState('portfolio');

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'Buy More': return '#10B981';
      case 'Hold': return '#3B82F6';
      case 'Sell': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'High': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="assistant-dashboard maven">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}>
          <PieChart size={28} />
        </div>
        <div className="assistant-info">
          <h2>Maven - Investment Strategy & Portfolio Optimizer</h2>
          <p>Analyzes rental yields, capital appreciation trends, and tax implications to provide data-driven advice on buying, holding, or selling assets</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 13.1M</span>
            <span className="stat-label">Portfolio Value</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 8.5%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <Percent size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">7.4%</span>
            <span className="stat-label">Avg. Yield</span>
          </div>
          <span className="stat-change positive">Above market</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">+9.6%</span>
            <span className="stat-label">Appreciation</span>
          </div>
          <span className="stat-change positive">YTD</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}>
            <Target size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">17%</span>
            <span className="stat-label">Total ROI</span>
          </div>
          <span className="stat-change positive">Excellent</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['portfolio', 'yields', 'opportunities', 'tax', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'docs' ? 'Documentation' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'portfolio' && (
          <div className="portfolio-view">
            <div className="view-header">
              <h3>Portfolio Analysis</h3>
              <button className="add-btn"><Plus size={16} /> Add Property</button>
            </div>
            <div className="portfolio-table">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Yield</th>
                    <th>Appreciation</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {PORTFOLIO_DATA.map(item => (
                    <tr key={item.id} className={item.status}>
                      <td><strong>{item.property}</strong></td>
                      <td>{item.type}</td>
                      <td>{item.value}</td>
                      <td>{item.yield}</td>
                      <td style={{ color: item.appreciation.startsWith('+') ? '#10B981' : '#EF4444' }}>
                        {item.appreciation}
                      </td>
                      <td>
                        <span className="recommendation-badge" style={{ 
                          background: `${getRecommendationColor(item.recommendation)}20`,
                          color: getRecommendationColor(item.recommendation)
                        }}>
                          {item.recommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'yields' && (
          <div className="yields-view">
            <h3>Yield Optimization</h3>
            <div className="yields-list">
              {YIELD_OPTIMIZATION.map(item => (
                <div key={item.id} className="yield-card">
                  <div className="yield-property">
                    <Building size={20} />
                    <h4>{item.property}</h4>
                  </div>
                  <div className="yield-comparison">
                    <div className="yield-current">
                      <span className="label">Current Rent</span>
                      <span className="value">{item.currentRent}/yr</span>
                    </div>
                    <div className="yield-arrow">→</div>
                    <div className="yield-market">
                      <span className="label">Market Rent</span>
                      <span className="value">{item.marketRent}/yr</span>
                    </div>
                    <div className="yield-upside" style={{ color: item.upside.startsWith('+') ? '#10B981' : '#EF4444' }}>
                      {item.upside}
                    </div>
                  </div>
                  <p className="yield-action">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="opportunities-view">
            <h3>Investment Opportunities</h3>
            <div className="opportunities-grid">
              {INVESTMENT_OPPORTUNITIES.map(opp => (
                <div key={opp.id} className="opportunity-card">
                  <h4>{opp.property}</h4>
                  <div className="opp-price">{opp.price}</div>
                  <div className="opp-metrics">
                    <div className="opp-metric">
                      <span className="label">Expected Yield</span>
                      <span className="value">{opp.expectedYield}</span>
                    </div>
                    <div className="opp-metric">
                      <span className="label">Appreciation</span>
                      <span className="value">{opp.appreciation}</span>
                    </div>
                    <div className="opp-metric highlight">
                      <span className="label">Total ROI</span>
                      <span className="value">{opp.roi}</span>
                    </div>
                  </div>
                  <div className="opp-footer">
                    <span className="risk-badge" style={{ color: getRiskColor(opp.risk) }}>
                      Risk: {opp.risk}
                    </span>
                    <button className="view-btn"><Eye size={14} /> Analyze</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="tax-view">
            <h3>Tax Planning Insights</h3>
            <div className="tax-list">
              {TAX_INSIGHTS.map(insight => (
                <div key={insight.id} className="tax-card">
                  <div className="tax-icon">
                    <Lightbulb size={24} />
                  </div>
                  <div className="tax-content">
                    <h4>{insight.insight}</h4>
                    <p>{insight.detail}</p>
                    <span className="tax-action">{insight.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="maven" 
            assistantName="Maven" 
            assistantColor="#8B5CF6" 
          />
        )}
      </div>
    </div>
  );
};

export default MavenInvestmentCRM;
