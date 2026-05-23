import React from 'react';
import { Database, HardDrive, Zap } from 'lucide-react';

interface QueryPerformance {
  avgTime: number;
  slowQueries: number;
  indexHits: number;
}

interface Operations {
  reads: number;
  writes: number;
  updates: number;
}

interface DatabaseMetrics {
  queryPerformance: QueryPerformance;
  operations: Operations;
}

interface DBHealth {
  connections: number;
  connectionPercentage: number;
  storage: string;
  storagePercentage: number;
}

interface DatabaseTabProps {
  metrics: DatabaseMetrics;
  dbHealth: DBHealth;
}

const DatabaseTab: React.FC<DatabaseTabProps> = ({ metrics, dbHealth }) => {
  return (
    <div className="database-view">
      <h3>Database Metrics</h3>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Zap size={20} />
          </div>
          <div className="metric-info">
            <h4>Connections</h4>
            <div className="metric-value">{dbHealth.connections}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${dbHealth.connectionPercentage}%` }} />
            </div>
            <span className="metric-percentage">{dbHealth.connectionPercentage}% used</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <HardDrive size={20} />
          </div>
          <div className="metric-info">
            <h4>Storage</h4>
            <div className="metric-value">{dbHealth.storage}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${dbHealth.storagePercentage}%` }} />
            </div>
            <span className="metric-percentage">{dbHealth.storagePercentage}% used</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Database size={20} />
          </div>
          <div className="metric-info">
            <h4>Query Performance</h4>
            <div className="metric-value">{metrics.queryPerformance.avgTime}ms</div>
            <div className="metric-detail">Slow Queries: {metrics.queryPerformance.slowQueries}</div>
            <div className="metric-detail">Index Hit Rate: {metrics.queryPerformance.indexHits}%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Database size={20} />
          </div>
          <div className="metric-info">
            <h4>Operations</h4>
            <div className="metric-ops">
              <span>Reads: {metrics.operations.reads.toLocaleString()}</span>
              <span>Writes: {metrics.operations.writes.toLocaleString()}</span>
              <span>Updates: {metrics.operations.updates.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTab;
