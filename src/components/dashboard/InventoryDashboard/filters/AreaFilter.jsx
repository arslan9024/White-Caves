import React, { useState, useRef, useEffect } from 'react';
import '../FilterPanel.css';

const AreaFilter = ({ selected = [], availableAreas = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filter areas based on search term
  const filteredAreas = availableAreas.filter((area) =>
    area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggle = (area) => {
    if (selected.includes(area)) {
      onChange(selected.filter((a) => a !== area));
    } else {
      onChange([...selected, area]);
    }
  };

  const handleRemoveTag = (area) => {
    onChange(selected.filter((a) => a !== area));
  };

  return (
    <div className="filter-group">
      <label className="filter-label">Areas</label>
      <div className="area-filter-container" ref={dropdownRef}>
        {/* Selected Areas Tags */}
        {selected.length > 0 && (
          <div className="selected-tags">
            {selected.map((area) => (
              <span key={area} className="area-tag">
                {area}
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveTag(area)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown Toggle */}
        <button
          className="area-filter-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="toggle-text">
            {selected.length > 0
              ? `${selected.length} selected`
              : 'Select areas...'}
          </span>
          <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>▼</span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="area-dropdown">
            {/* Search Input */}
            <input
              type="text"
              className="area-search-input"
              placeholder="Search areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Area List */}
            <div className="area-list">
              {filteredAreas.length > 0 ? (
                filteredAreas.map((area) => (
                  <div key={area} className="area-item">
                    <input
                      type="checkbox"
                      id={`area-${area}`}
                      checked={selected.includes(area)}
                      onChange={() => handleToggle(area)}
                      className="checkbox-input"
                    />
                    <label htmlFor={`area-${area}`} className="checkbox-label">
                      {area}
                    </label>
                  </div>
                ))
              ) : (
                <p className="no-results">No areas found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaFilter;
