import React from 'react';
import '../FilterPanel.css';

const FurnishingFilter = ({ selected = [], onChange }) => {
  const furnishingTypes = [
    'Furnished',
    'Semi-Furnished',
    'Unfurnished',
  ];

  const handleToggle = (type) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="filter-group">
      <label className="filter-label">Furnishing Status</label>
      <div className="checkbox-group">
        {furnishingTypes.map((type) => (
          <div key={type} className="checkbox-item">
            <input
              type="checkbox"
              id={`furnishing-${type}`}
              checked={selected.includes(type)}
              onChange={() => handleToggle(type)}
              className="checkbox-input"
            />
            <label htmlFor={`furnishing-${type}`} className="checkbox-label">
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FurnishingFilter;
