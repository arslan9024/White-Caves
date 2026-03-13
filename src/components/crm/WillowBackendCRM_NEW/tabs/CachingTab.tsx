import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';

const CachingTab = ({ cacheStats, cacheHealth }) => {
  return (
    <div className="caching-view">
      <h3>Caching Strategy</h3>
      <div className="cache-grid">
        <div className="cache-card">
          <div className="cache-icon">
            <Zap size={24} />
          </div>
          <h4>Hit Rate</h4>
          <div className="cache-value">{cacheHealth}%</div>
          <div className="cache-bar">
            <div className="cache-fill" style={{ width: `${cacheHealth}%` }} />
          </div>
          <p className="cache-stat">Hits: {(cacheStats.totalHits / 1000).toFixed(0)}K</p>
          <p className="cache-stat">Misses: {(cacheStats.totalMisses / 1000).toFixed(0)}K</p>
        </div>

        <div className="cache-card">
          <div className="cache-icon">
            <TrendingUp size={24} />
          </div>
          <h4>Memory Usage</h4>
          <div className="cache-value">{cacheStats.memoryUsed}MB / {cacheStats.memoryTotal}MB</div>
          <div className="cache-bar">
            <div className="cache-fill" style={{ width: `${(cacheStats.memoryUsed / cacheStats.memoryTotal) * 100}%` }} />
          </div>
          <p className="cache-stat">Utilization: {((cacheStats.memoryUsed / cacheStats.memoryTotal) * 100).toFixed(1)}%</p>
          <p className="cache-stat">Miss Rate: {cacheStats.missRate}%</p>
        </div>

        <div className="cache-card">
          <h4>TTL Configuration</h4>
          <div className="cache-stat">Average TTL: {cacheStats.ttlAvg}s</div>
          <div className="cache-detail">
            <p>Total Hits: {cacheStats.totalHits.toLocaleString()}</p>
            <p>Hit/Miss Ratio: {(cacheStats.totalHits / cacheStats.totalMisses).toFixed(2)}:1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CachingTab;
