import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface MarketHotspot {
  area: string;
  demand: string;
  avgPrice: number;
  priceChange: number;
}

interface PriceTrend {
  month: string;
  priceIndex: number;
}

interface MarketInsights {
  priceIndex: number;
  priceChange: number;
  avgRentalYield: number;
  supplyDemandRatio: number;
  hotspots: MarketHotspot[];
  trends: PriceTrend[];
}

interface InsightsState {
  marketInsights: MarketInsights;
}

interface InsightsTabProps {
  state: InsightsState;
}

export default function InsightsTab({ state }: InsightsTabProps) {
  const { marketInsights } = state;

  return (
    <div className="insights-view">
      <div className="view-header">
        <h3>Market Research & Insights</h3>
        <p className="view-subtitle">Real-time market analytics and trend analysis</p>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <h4>Price Index</h4>
          <div className="metric-value">{marketInsights.priceIndex}</div>
          <div className="metric-change" style={{ color: marketInsights.priceChange > 0 ? '#10b981' : '#ef4444' }}>
            {marketInsights.priceChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(marketInsights.priceChange)}% change
          </div>
        </div>

        <div className="insight-card">
          <h4>Avg Rental Yield</h4>
          <div className="metric-value">{marketInsights.avgRentalYield}%</div>
          <p className="metric-desc">annual return expectation</p>
        </div>

        <div className="insight-card">
          <h4>Supply/Demand</h4>
          <div className="metric-value">{marketInsights.supplyDemandRatio}</div>
          <p className="metric-desc">ratio (lower = more demand)</p>
        </div>
      </div>

      <div className="hotspots-section">
        <h4>Market Hotspots</h4>
        <div className="hotspots-list">
          {marketInsights.hotspots.map((spot: MarketHotspot) => (
            <div key={spot.area} className="hotspot-item">
              <div className="hotspot-header">
                <h5>{spot.area}</h5>
                <span className={`demand ${spot.demand}`}>{spot.demand} demand</span>
              </div>
              <div className="hotspot-metrics">
                <span>Avg Price: {(spot.avgPrice / 1000000).toFixed(1)}M AED</span>
                <span style={{ color: spot.priceChange > 0 ? '#10b981' : '#ef4444' }}>
                  {spot.priceChange > 0 ? '+' : ''}{spot.priceChange}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="trends-section">
        <h4>Price Trends (6 Months)</h4>
        <div className="trends-chart">
          {(() => {
            const trends = marketInsights?.trends ?? [];
            const maxIndex = Math.max(...trends.map(t => t.priceIndex), 1);
            return trends.map((trend: PriceTrend) => (
              <div key={trend.month} className="trend-bar" style={{ height: `${(trend.priceIndex / maxIndex) * 100}%` }}>
                <span className="trend-label">{trend.month}</span>
                <span className="trend-value">{trend.priceIndex}</span>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
