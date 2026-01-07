import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  TrendingUp, TrendingDown, Building2, MapPin, Users, 
  DollarSign, Calendar, BarChart3, PieChart, Activity,
  ArrowUpRight, ArrowDownRight, Target, Zap
} from 'lucide-react';
import './MarketAnalyticsDashboard.css';

const MarketAnalyticsDashboard = ({ data = {} }) => {
  const { t, formatNumber, formatCurrency, isRTL } = useLanguage();
  const [selectedEmirate, setSelectedEmirate] = useState('All');
  const [timeRange, setTimeRange] = useState('month');

  const marketData = useMemo(() => ({
    kpis: [
      {
        name: 'Monthly Deals',
        nameAr: 'الصفقات الشهرية',
        target: 15,
        current: data.monthlyDeals || 12,
        unit: '',
        trend: '+8%',
        icon: Target
      },
      {
        name: 'Avg Time to Close',
        nameAr: 'متوسط وقت الإغلاق',
        target: 45,
        current: data.avgCloseTime || 52,
        unit: 'days',
        trend: '-5%',
        icon: Calendar
      },
      {
        name: 'Lead Conversion',
        nameAr: 'تحويل العملاء المحتملين',
        target: 25,
        current: data.conversionRate || 22,
        unit: '%',
        trend: '+3%',
        icon: Zap
      },
      {
        name: 'Client Satisfaction',
        nameAr: 'رضا العملاء',
        target: 4.8,
        current: data.satisfaction || 4.6,
        unit: '/5',
        trend: '+0.2',
        icon: Users
      }
    ],
    emirates: [
      { name: 'Dubai', nameAr: 'دبي', transactions: 1250, avgPrice: 2100000, growth: '+12%' },
      { name: 'Abu Dhabi', nameAr: 'أبوظبي', transactions: 890, avgPrice: 1800000, growth: '+8%' },
      { name: 'Sharjah', nameAr: 'الشارقة', transactions: 540, avgPrice: 850000, growth: '+15%' },
      { name: 'Ajman', nameAr: 'عجمان', transactions: 320, avgPrice: 450000, growth: '+18%' },
      { name: 'RAK', nameAr: 'رأس الخيمة', transactions: 180, avgPrice: 620000, growth: '+10%' }
    ],
    propertyTypes: [
      { type: 'Apartment', typeAr: 'شقة', percentage: 45, count: 1350, growth: '+12%', color: '#DC2626' },
      { type: 'Villa', typeAr: 'فيلا', percentage: 30, count: 900, growth: '+8%', color: '#059669' },
      { type: 'Townhouse', typeAr: 'تاون هاوس', percentage: 15, count: 450, growth: '+15%', color: '#2563EB' },
      { type: 'Commercial', typeAr: 'تجاري', percentage: 10, count: 300, growth: '+5%', color: '#7C3AED' }
    ],
    leadSources: [
      { source: 'WhatsApp', sourceAr: 'واتساب', percentage: 35, count: 420, color: '#25D366' },
      { source: 'Website', sourceAr: 'الموقع', percentage: 28, count: 336, color: '#DC2626' },
      { source: 'Referral', sourceAr: 'إحالة', percentage: 20, count: 240, color: '#F59E0B' },
      { source: 'Walk-in', sourceAr: 'زيارة مباشرة', percentage: 12, count: 144, color: '#6366F1' },
      { source: 'Other', sourceAr: 'أخرى', percentage: 5, count: 60, color: '#94A3B8' }
    ],
    topAreas: [
      { area: 'Dubai Marina', areaAr: 'دبي مارينا', deals: 45, avgPrice: 1850000, demand: 'High' },
      { area: 'Downtown Dubai', areaAr: 'وسط دبي', deals: 38, avgPrice: 2500000, demand: 'Very High' },
      { area: 'Palm Jumeirah', areaAr: 'نخلة جميرا', deals: 28, avgPrice: 4200000, demand: 'High' },
      { area: 'Business Bay', areaAr: 'بيزنس باي', deals: 35, avgPrice: 1450000, demand: 'Medium' },
      { area: 'JBR', areaAr: 'جي بي آر', deals: 22, avgPrice: 1950000, demand: 'High' }
    ],
    agentPerformance: [
      { name: 'Ahmed Hassan', deals: 8, revenue: 12500000, rating: 4.9, rank: 1 },
      { name: 'Sarah Johnson', deals: 7, revenue: 10800000, rating: 4.8, rank: 2 },
      { name: 'Mohammed Ali', deals: 6, revenue: 9200000, rating: 4.7, rank: 3 },
      { name: 'Fatima Ahmed', deals: 5, revenue: 7500000, rating: 4.9, rank: 4 },
      { name: 'John Smith', deals: 4, revenue: 6100000, rating: 4.6, rank: 5 }
    ]
  }), [data]);

  const getProgressPercentage = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getDemandBadgeClass = (demand) => {
    switch (demand) {
      case 'Very High': return 'demand-badge--very-high';
      case 'High': return 'demand-badge--high';
      case 'Medium': return 'demand-badge--medium';
      default: return 'demand-badge--low';
    }
  };

  return (
    <div className={`market-analytics-dashboard ${isRTL ? 'rtl' : ''}`}>
      <div className="dashboard-header">
        <div className="header-left">
          <h2 className="dashboard-title">
            <BarChart3 size={24} />
            {isRTL ? 'لوحة تحليلات السوق' : 'Market Analytics Dashboard'}
          </h2>
          <p className="dashboard-subtitle">
            {isRTL ? 'تحليلات سوق العقارات في الإمارات' : 'UAE Real Estate Market Insights'}
          </p>
        </div>
        <div className="header-controls">
          <select 
            value={selectedEmirate} 
            onChange={(e) => setSelectedEmirate(e.target.value)}
            className="control-select"
          >
            <option value="All">{isRTL ? 'جميع الإمارات' : 'All Emirates'}</option>
            <option value="Dubai">{isRTL ? 'دبي' : 'Dubai'}</option>
            <option value="Abu Dhabi">{isRTL ? 'أبوظبي' : 'Abu Dhabi'}</option>
            <option value="Sharjah">{isRTL ? 'الشارقة' : 'Sharjah'}</option>
          </select>
          <div className="time-range-buttons">
            {['week', 'month', 'quarter', 'year'].map(range => (
              <button
                key={range}
                className={`time-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        {marketData.kpis.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <kpi.icon className="kpi-icon" size={20} />
              <span className={`kpi-trend ${kpi.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                {kpi.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.trend}
              </span>
            </div>
            <div className="kpi-value">
              {formatNumber(kpi.current)}{kpi.unit}
            </div>
            <div className="kpi-name">{isRTL ? kpi.nameAr : kpi.name}</div>
            <div className="kpi-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgressPercentage(kpi.current, kpi.target)}%` }}
                />
              </div>
              <span className="progress-text">
                {isRTL ? `الهدف: ${kpi.target}${kpi.unit}` : `Target: ${kpi.target}${kpi.unit}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        <div className="analytics-card emirates-card">
          <h3 className="card-title">
            <MapPin size={18} />
            {isRTL ? 'المعاملات حسب الإمارة' : 'Transactions by Emirate'}
          </h3>
          <div className="emirates-list">
            {marketData.emirates.map((emirate, index) => (
              <div key={index} className="emirate-row">
                <div className="emirate-info">
                  <span className="emirate-name">{isRTL ? emirate.nameAr : emirate.name}</span>
                  <span className="emirate-transactions">{formatNumber(emirate.transactions)} deals</span>
                </div>
                <div className="emirate-stats">
                  <span className="emirate-price">{formatCurrency(emirate.avgPrice)}</span>
                  <span className={`emirate-growth ${emirate.growth.startsWith('+') ? 'positive' : 'negative'}`}>
                    {emirate.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card property-types-card">
          <h3 className="card-title">
            <Building2 size={18} />
            {isRTL ? 'أنواع العقارات' : 'Property Types'}
          </h3>
          <div className="property-types-chart">
            <div className="pie-chart-placeholder">
              {marketData.propertyTypes.map((type, index) => (
                <div 
                  key={index}
                  className="pie-segment"
                  style={{ 
                    '--segment-color': type.color,
                    '--segment-percentage': type.percentage
                  }}
                />
              ))}
            </div>
            <div className="property-types-legend">
              {marketData.propertyTypes.map((type, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ background: type.color }} />
                  <span className="legend-name">{isRTL ? type.typeAr : type.type}</span>
                  <span className="legend-value">{type.percentage}%</span>
                  <span className={`legend-growth ${type.growth.startsWith('+') ? 'positive' : 'negative'}`}>
                    {type.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-card lead-sources-card">
          <h3 className="card-title">
            <Activity size={18} />
            {isRTL ? 'مصادر العملاء' : 'Lead Sources'}
          </h3>
          <div className="lead-sources-list">
            {marketData.leadSources.map((source, index) => (
              <div key={index} className="lead-source-row">
                <div className="source-info">
                  <span className="source-color" style={{ background: source.color }} />
                  <span className="source-name">{isRTL ? source.sourceAr : source.source}</span>
                </div>
                <div className="source-bar-container">
                  <div 
                    className="source-bar" 
                    style={{ width: `${source.percentage}%`, background: source.color }}
                  />
                </div>
                <span className="source-percentage">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card top-areas-card">
          <h3 className="card-title">
            <TrendingUp size={18} />
            {isRTL ? 'أفضل المناطق أداءً' : 'Top Performing Areas'}
          </h3>
          <div className="areas-table">
            <div className="table-header">
              <span>{isRTL ? 'المنطقة' : 'Area'}</span>
              <span>{isRTL ? 'الصفقات' : 'Deals'}</span>
              <span>{isRTL ? 'متوسط السعر' : 'Avg Price'}</span>
              <span>{isRTL ? 'الطلب' : 'Demand'}</span>
            </div>
            {marketData.topAreas.map((area, index) => (
              <div key={index} className="table-row">
                <span className="area-name">{isRTL ? area.areaAr : area.area}</span>
                <span className="area-deals">{area.deals}</span>
                <span className="area-price">{formatCurrency(area.avgPrice)}</span>
                <span className={`demand-badge ${getDemandBadgeClass(area.demand)}`}>
                  {area.demand}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card agent-performance-card">
          <h3 className="card-title">
            <Users size={18} />
            {isRTL ? 'أداء الوكلاء' : 'Agent Performance'}
          </h3>
          <div className="agents-leaderboard">
            {marketData.agentPerformance.map((agent, index) => (
              <div key={index} className="agent-row">
                <div className="agent-rank">
                  <span className={`rank-badge rank-${agent.rank}`}>#{agent.rank}</span>
                </div>
                <div className="agent-info">
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-deals">{agent.deals} deals</span>
                </div>
                <div className="agent-stats">
                  <span className="agent-revenue">{formatCurrency(agent.revenue)}</span>
                  <span className="agent-rating">
                    <span className="star">★</span> {agent.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalyticsDashboard;
