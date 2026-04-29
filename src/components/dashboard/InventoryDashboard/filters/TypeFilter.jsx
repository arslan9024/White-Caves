import React from 'react';
import '../FilterPanel.css';

const TypeFilter = ({ selected = [], onChange }) => {
  const types = [
    'Apartment',
    'Villa',
    'Studio',
    'Penthouse',
    'Townhouse',
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
      <label className="filter-label">Property Type</label>
      <div className="checkbox-group">
        {types.map((type) => (
          <div key={type} className="checkbox-item">
            <input
              type="checkbox"
              id={`type-${type}`}
              checked={selected.includes(type)}
              onChange={() => handleToggle(type)}
              className="checkbox-input"
            />
            <label htmlFor={`type-${type}`} className="checkbox-label">
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
