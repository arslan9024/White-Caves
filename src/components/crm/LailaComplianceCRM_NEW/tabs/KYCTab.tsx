import React from 'react';
import { CheckCircle, AlertTriangle, Clock, Eye, User } from 'lucide-react';

const KYCTab = ({ verifications, onApprove, onReject }) => {
  return (
    <div className="kyc-view">
      <h3>KYC Verification Management</h3>
      
      <div className="kyc-filters">
        <button className="filter-tag active">All</button>
        <button className="filter-tag">Verified</button>
        <button className="filter-tag">Pending</button>
        <button className="filter-tag">Issues</button>
      </div>

      <table className="verifications-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Risk Level</th>
            <th>Documents</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {verifications.map((v) => (
            <tr key={v.id} className={`status-${v.status}`}>
              <td>
                <div className="client-name">
                  <User size={14} />
                  {v.name}
                </div>
              </td>
              <td>
                <span className="type-badge">{v.type}</span>
              </td>
              <td>
                <span className={`status-badge status-${v.status}`}>
                  {v.status.replace('_', ' ')}
                </span>
              </td>
              <td>
                <span className={`risk-badge risk-${v.riskLevel}`}>
                  {v.riskLevel}
                </span>
              </td>
              <td>
                <div className="docs">
                  {v.documents.length}
                  <Eye size={12} />
                </div>
              </td>
              <td>{v.date}</td>
              <td>
                {v.status === 'requires_review' && (
                  <div className="kyc-actions">
                    <button
                      className="btn-approve"
                      onClick={() => onApprove(v.id)}
                      title="Approve verification"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => onReject(v.id)}
                      title="Reject verification"
                    >
                      <AlertTriangle size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KYCTab;
