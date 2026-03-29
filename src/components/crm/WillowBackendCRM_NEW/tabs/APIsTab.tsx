import React from 'react';
import { Filter, Search } from 'lucide-react';

interface APIEndpoint {
  path: string;
  method: string;
  avgTime: number;
  successRate: number;
  calls: number;
  cached: boolean;
}

interface APIStats {
  totalCalls: number;
  avgResponseTime: number;
  avgSuccessRate: number;
}

interface APIsTabProps {
  endpoints: APIEndpoint[];
  apiStats: APIStats;
}

const APIsTab: React.FC<APIsTabProps> = ({ endpoints, apiStats }) => {
  return (
    <div className="apis-view">
      <div className="view-header">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search endpoints..." aria-label="Search API endpoints" />
        </div>
        <div className="stat-summary">
          <span>Total Calls: {(apiStats.totalCalls / 1000).toFixed(0)}K</span>
          <span>Avg Response: {apiStats.avgResponseTime}ms</span>
          <span>Success Rate: {apiStats.avgSuccessRate}%</span>
        </div>
      </div>
      <div className="endpoints-table">
        <div className="table-header">
          <span>Endpoint</span>
          <span>Method</span>
          <span>Avg Time</span>
          <span>Success Rate</span>
          <span>Calls</span>
          <span>Cached</span>
        </div>
        {endpoints.map((endpoint: APIEndpoint) => (
          <div key={`${endpoint.method}-${endpoint.path}`} className="table-row">
            <span className="endpoint-path">{endpoint.path}</span>
            <span className={`method-badge ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
            <span>{endpoint.avgTime}ms</span>
            <span className="success-rate">{endpoint.successRate}%</span>
            <span>{(endpoint.calls / 1000).toFixed(0)}K</span>
            <span className={`cache-badge ${endpoint.cached ? 'cached' : 'not-cached'}`}>
              {endpoint.cached ? '✓' : '✗'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APIsTab;
