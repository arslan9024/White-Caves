import React from 'react';
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';

interface SecurityCheck {
  name: string;
  status: string;
  lastCheck: string;
}

interface SecurityStatus {
  percentage: number;
  passed: number;
  total: number;
}

interface SecurityTabProps {
  checks: SecurityCheck[];
  securityStatus: SecurityStatus;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ checks, securityStatus }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle size={16} className="status-pass" />;
      case 'warning': return <AlertTriangle size={16} className="status-warning" />;
      default: return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="security-view">
      <div className="security-header">
        <h3>Security Monitoring</h3>
        <div className="security-score">
          <Shield size={24} />
          <div className="score-info">
            <span className="score-value">{securityStatus.percentage}%</span>
            <span className="score-label">Security Score</span>
            <span className="score-detail">{securityStatus.passed}/{securityStatus.total} checks passed</span>
          </div>
        </div>
      </div>
      <div className="security-checks">
        {checks.map((check: SecurityCheck) => (
          <div key={check.name} className={`security-check ${check.status}`}>
            <div className="check-icon">
              {getStatusIcon(check.status)}
            </div>
            <div className="check-info">
              <h4>{check.name}</h4>
              <span className="check-time">Last checked: {check.lastCheck}</span>
            </div>
            <span className={`check-badge ${check.status}`}>
              {check.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityTab;
