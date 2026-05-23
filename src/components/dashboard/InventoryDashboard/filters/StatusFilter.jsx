import React from 'react';
import '../FilterPanel.css';

const StatusFilter = ({ selected = [], onChange }) => {
  const statuses = [
    'Vacant',
    'Occupied',
    'Maintenance',
    'Available for Lease',
  ];

  const handleToggle = (status) => {
    if (selected.includes(status)) {
      onChange(selected.filter((s) => s !== status));
    } else {
      onChange([...selected, status]);
    }
  };

  return (
    <div className="filter-group">
      <label className="filter-label">Property Status</label>
      <div className="checkbox-group">
        {statuses.map((status) => (
          <div key={status} className="checkbox-item">
            <input
              type="checkbox"
              id={`status-${status}`}
              checked={selected.includes(status)}
              onChange={() => handleToggle(status)}
              className="checkbox-input"
            />
            <label htmlFor={`status-${status}`} className="checkbox-label">
              {status}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
