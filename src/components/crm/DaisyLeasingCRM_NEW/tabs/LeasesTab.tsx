import React from 'react';
import { Search, Plus } from 'lucide-react';

const LeasesTab = ({ leases, searchQuery, onSearchChange }) => {
  return (
    <div className="leases-view">
      <div className="view-header">
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search leases..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className="add-btn"><Plus size={16} /> New Lease</button>
      </div>
      <div className="leases-table">
        <div className="table-header">
          <span>Unit</span>
          <span>Tenant</span>
          <span>Annual Rent</span>
          <span>End Date</span>
          <span>Days Left</span>
          <span>Status</span>
        </div>
        {leases.map(lease => (
          <div key={lease.id} className="table-row">
            <span className="unit-name">{lease.unit}</span>
            <span>{lease.tenant}</span>
            <span>AED {(lease.rent * 12).toLocaleString()}</span>
            <span>{lease.endDate}</span>
            <span className={lease.daysRemaining < 60 ? 'warning' : ''}>{lease.daysRemaining}</span>
            <span className={`status-badge ${lease.status}`}>
              {lease.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeasesTab;
