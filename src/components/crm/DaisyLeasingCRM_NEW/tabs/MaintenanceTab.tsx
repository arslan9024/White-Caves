import React from 'react';

const MaintenanceTab = ({ requests }) => {
  return (
    <div className="maintenance-view">
      <h3>Maintenance Requests</h3>
      <div className="maintenance-list">
        {requests.map(request => (
          <div key={request.id} className={`maintenance-card ${request.priority}`}>
            <div className="maintenance-header">
              <span className="unit">{request.unit}</span>
              <span className={`priority-badge ${request.priority}`}>{request.priority}</span>
            </div>
            <p className="issue">{request.issue}</p>
            <div className="maintenance-footer">
              <span className={`status ${request.status}`}>{request.status.replace('_', ' ')}</span>
              <span className="date">{request.created}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceTab;
