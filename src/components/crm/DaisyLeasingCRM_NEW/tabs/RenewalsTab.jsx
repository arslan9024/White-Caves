import React from 'react';

const RenewalsTab = ({ renewalStats, renewalList }) => {
  return (
    <div className="renewals-view">
      <h3>Lease Renewals</h3>
      <div className="renewal-summary">
        <div className="renewal-stat">
          <span className="value">{renewalStats.dueThisMonth}</span>
          <span className="label">Due This Month</span>
        </div>
        <div className="renewal-stat">
          <span className="value">{renewalStats.renewalSent}</span>
          <span className="label">Renewal Sent</span>
        </div>
        <div className="renewal-stat">
          <span className="value">{renewalStats.confirmed}</span>
          <span className="label">Confirmed</span>
        </div>
      </div>
      {renewalList && renewalList.length > 0 && (
        <div className="renewal-list">
          {renewalList.map((renewal, index) => (
            <div key={index} className="renewal-item">
              <span className="unit">{renewal.unit}</span>
              <span className="date">{renewal.renewalDate}</span>
              <span className={`status ${renewal.status}`}>{renewal.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenewalsTab;
