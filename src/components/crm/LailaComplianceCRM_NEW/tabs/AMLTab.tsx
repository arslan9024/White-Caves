import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';

interface AMLAlert {
  id: string | number;
  client: string;
  type: string;
  amount: number;
  date: string;
  status: string;
}

interface AMLTabProps {
  alerts: AMLAlert[];
  onResolve: (id: string | number) => void;
}

const AMLTab: React.FC<AMLTabProps> = ({ alerts, onResolve }) => {
  return (
    <div className="aml-view">
      <h3>AML & Sanctions Monitoring</h3>
      
      <div className="aml-summary">
        <div className="summary-card">
          <Shield size={20} />
          <span>Active Investigations</span>
          <strong>{alerts.filter((a: AMLAlert) => a.status === 'investigating').length}</strong>
        </div>
        <div className="summary-card">
          <CheckCircle size={20} />
          <span>Cleared Alerts</span>
          <strong>{alerts.filter((a: AMLAlert) => a.status === 'cleared').length}</strong>
        </div>
      </div>

      <table className="aml-table">
        <thead>
          <tr>
            <th>Client / Source</th>
            <th>Alert Type</th>
            <th>Amount</th>
            <th>Date Detected</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert: AMLAlert) => (
            <tr key={alert.id} className={`status-${alert.status}`}>
              <td>
                <div className="alert-client">
                  <AlertTriangle size={14} />
                  {alert.client}
                </div>
              </td>
              <td>
                <span className="type-badge">{alert.type.replace('_', ' ')}</span>
              </td>
              <td className="amount">
                {alert.amount > 0 ? `AED ${(alert.amount / 1000000).toFixed(1)}M` : '-'}
              </td>
              <td>{alert.date}</td>
              <td>
                <span className={`status-badge status-${alert.status}`}>
                  {alert.status}
                </span>
              </td>
              <td>
                {alert.status === 'investigating' && (
                  <button
                    className="btn-resolve"
                    onClick={() => onResolve(alert.id)}
                    title="Mark as cleared"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AMLTab;
