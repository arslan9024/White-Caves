import React, { useState } from 'react';
import { 
  LineChart, TrendingUp, TrendingDown, Activity, Target,
  MapPin, Building, DollarSign, Calendar, Eye,
  ArrowUp, ArrowDown, Filter, Search, BarChart3, PieChart
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const MARKET_TRENDS = [
  { id: 1, area: 'Palm Jumeirah', type: 'Villa', avgPrice: 'AED 8.2M', change: 12.5, trend: 'up', volume: 45, prediction: 'Strong growth expected' },
  { id: 2, area: 'Dubai Marina', type: 'Apartment', avgPrice: 'AED 2.1M', change: 8.3, trend: 'up', volume: 156, prediction: 'Steady increase' },
  { id: 3, area: 'JVC', type: 'Apartment', avgPrice: 'AED 850K', change: -2.1, trend: 'down', volume: 234, prediction: 'Market correction' },
  { id: 4, area: 'Downtown Dubai', type: 'Apartment', avgPrice: 'AED 3.5M', change: 15.2, trend: 'up', volume: 89, prediction: 'Premium demand' },
  { id: 5, area: 'DAMAC Hills 2', type: 'Townhouse', avgPrice: 'AED 1.8M', change: 5.6, trend: 'up', volume: 78, prediction: 'Growing interest' }
];

const PRICE_PREDICTIONS = [
  { id: 1, property: 'Villa 234 - DAMAC Hills', current: 'AED 2.5M', predicted: 'AED 2.8M', confidence: 85, timeframe: '6 months' },
  { id: 2, property: 'Apt 1205 - Marina', current: 'AED 1.8M', predicted: 'AED 2.0M', confidence: 78, timeframe: '6 months' },
  { id: 3, property: 'Penthouse - Downtown', current: 'AED 8.5M', predicted: 'AED 9.2M', confidence: 72, timeframe: '12 months' },
  { id: 4, property: 'Townhouse - Springs', current: 'AED 3.2M', predicted: 'AED 3.1M', confidence: 65, timeframe: '6 months' }
];

const ECONOMIC_INDICATORS = [
  { id: 1, indicator: 'UAE GDP Growth', value: '3.8%', change: 0.5, status: 'positive' },
  { id: 2, indicator: 'Inflation Rate', value: '2.1%', change: -0.3, status: 'neutral' },
  { id: 3, indicator: 'Interest Rate', value: '5.25%', change: 0, status: 'stable' },
  { id: 4, indicator: 'Tourism Growth', value: '12.4%', change: 2.1, status: 'positive' },
  { id: 5, indicator: 'Expat Population', value: '+145K', change: 15, status: 'positive' }
];

const COMPETITOR_DATA = [
  { id: 1, company: 'Emaar Properties', listings: 2456, avgDays: 45, marketShare: '18%' },
  { id: 2, company: 'DAMAC Properties', listings: 1823, avgDays: 52, marketShare: '14%' },
  { id: 3, company: 'Sobha Realty', listings: 892, avgDays: 38, marketShare: '8%' },
  { id: 4, company: 'Nakheel', listings: 756, avgDays: 41, marketShare: '7%' }
];

const CipherMarketCRM = () => {
  const [activeTab, setActiveTab] = useState('trends');

  return (
    <div className="assistant-dashboard cipher">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)' }}>
          <LineChart size={28} />
        </div>
        <div className="assistant-info">
          <h2>Cipher - Predictive Market Analyst</h2>
          <p>Uses advanced analytics on DLD transaction data, news, and economic indicators to generate predictive reports on neighborhood trends and property valuation</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(13, 148, 136, 0.2)', color: '#0D9488' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">+8.4%</span>
            <span className="stat-label">Market Growth</span>
          </div>
          <span className="stat-change positive">YoY</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Activity size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">4,521</span>
            <span className="stat-label">Transactions</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 12%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 2.8M</span>
            <span className="stat-label">Avg. Price</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 5%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <Target size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">87%</span>
            <span className="stat-label">Prediction Accuracy</span>
          </div>
          <span className="stat-change positive">Last quarter</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['trends', 'predictions', 'competitors', 'indicators', 'docs'].map(tab => (
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
        {activeTab === 'trends' && (
          <div className="trends-view">
            <div className="view-header">
              <h3>Market Trends by Area</h3>
              <div className="filter-group">
                <select>
                  <option value="all">All Areas</option>
                  <option value="palm">Palm Jumeirah</option>
                  <option value="marina">Dubai Marina</option>
                  <option value="downtown">Downtown</option>
                </select>
                <select>
                  <option value="all">All Types</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>
            </div>
            <div className="trends-grid">
              {MARKET_TRENDS.map(trend => (
                <div key={trend.id} className="trend-card">
                  <div className="trend-header">
                    <div className="trend-location">
                      <MapPin size={16} />
                      <span>{trend.area}</span>
                    </div>
                    <span className="trend-type">{trend.type}</span>
                  </div>
                  <div className="trend-price">{trend.avgPrice}</div>
                  <div className="trend-change" style={{ color: trend.trend === 'up' ? '#10B981' : '#EF4444' }}>
                    {trend.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </div>
                  <div className="trend-meta">
                    <span>{trend.volume} transactions</span>
                  </div>
                  <p className="trend-prediction">{trend.prediction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="predictions-view">
            <h3>AI Price Predictions</h3>
            <div className="predictions-list">
              {PRICE_PREDICTIONS.map(pred => (
                <div key={pred.id} className="prediction-card">
                  <div className="prediction-property">
                    <Building size={20} />
                    <div>
                      <h4>{pred.property}</h4>
                      <span>{pred.timeframe} forecast</span>
                    </div>
                  </div>
                  <div className="prediction-values">
                    <div className="value-current">
                      <span className="label">Current</span>
                      <span className="amount">{pred.current}</span>
                    </div>
                    <div className="value-arrow">→</div>
                    <div className="value-predicted">
                      <span className="label">Predicted</span>
                      <span className="amount">{pred.predicted}</span>
                    </div>
                  </div>
                  <div className="prediction-confidence">
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: `${pred.confidence}%` }} />
                    </div>
                    <span>{pred.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'competitors' && (
          <div className="competitors-view">
            <h3>Competitor Analysis</h3>
            <div className="competitors-table">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Active Listings</th>
                    <th>Avg. Days on Market</th>
                    <th>Market Share</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITOR_DATA.map(comp => (
                    <tr key={comp.id}>
                      <td><strong>{comp.company}</strong></td>
                      <td>{comp.listings.toLocaleString()}</td>
                      <td>{comp.avgDays} days</td>
                      <td>{comp.marketShare}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="indicators-view">
            <h3>Economic Indicators</h3>
            <div className="indicators-grid">
              {ECONOMIC_INDICATORS.map(ind => (
                <div key={ind.id} className="indicator-card">
                  <h4>{ind.indicator}</h4>
                  <div className="indicator-value">{ind.value}</div>
                  <div className={`indicator-change ${ind.status}`}>
                    {ind.change > 0 ? <ArrowUp size={14} /> : ind.change < 0 ? <ArrowDown size={14} /> : null}
                    {ind.change !== 0 ? `${ind.change > 0 ? '+' : ''}${ind.change}%` : 'Stable'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="cipher" 
            assistantName="Cipher" 
            assistantColor="#0D9488" 
          />
        )}
      </div>
    </div>
  );
};

export default CipherMarketCRM;
