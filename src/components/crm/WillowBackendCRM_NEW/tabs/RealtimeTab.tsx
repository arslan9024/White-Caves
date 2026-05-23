import React from 'react';
import { Wifi, Activity, TrendingUp } from 'lucide-react';

interface RealtimeConnection {
  type: string;
  status: string;
  active: number;
  peak: number;
}

interface RealtimeStats {
  totalActive: number;
  totalPeak: number;
}

interface RealtimeTabProps {
  connections: RealtimeConnection[];
  realtimeStats: RealtimeStats;
}

const RealtimeTab: React.FC<RealtimeTabProps> = ({ connections, realtimeStats }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy': return '#10B981';
      case 'degraded': return '#F59E0B';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="realtime-view">
      <h3>Real-time Connections</h3>
      <div className="realtime-stats">
        <div className="stat-box">
          <Wifi size={20} />
          <div>
            <span className="stat-label">Total Active</span>
            <span className="stat-value">{realtimeStats.totalActive}</span>
          </div>
        </div>
        <div className="stat-box">
          <TrendingUp size={20} />
          <div>
            <span className="stat-label">Peak Connections</span>
            <span className="stat-value">{realtimeStats.totalPeak}</span>
          </div>
        </div>
      </div>

      <div className="connections-list">
        {connections.map((conn: RealtimeConnection) => (
          <div key={conn.type} className="connection-card" style={{ borderLeftColor: getStatusColor(conn.status) }}>
            <div className="connection-header">
              <h4>{conn.type}</h4>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(conn.status) }}
              >
                {conn.status}
              </span>
            </div>
            <div className="connection-metrics">
              <div className="metric">
                <span className="label">Active:</span>
                <span className="value">{conn.active}</span>
              </div>
              <div className="metric">
                <span className="label">Peak:</span>
                <span className="value">{conn.peak}</span>
              </div>
              <div className="metric">
                <span className="label">Utilization:</span>
                <span className="value">{((conn.active / conn.peak) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealtimeTab;
