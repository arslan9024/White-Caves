import React, { useState, useEffect } from 'react';
import '../FilterPanel.css';

const PriceRangeFilter = ({ minPrice = null, maxPrice = null, onChange }) => {
  const [localMin, setLocalMin] = useState(minPrice || '');
  const [localMax, setLocalMax] = useState(maxPrice || '');
  const [validationMessage, setValidationMessage] = useState(null);

  // Sync local state with props
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalMin(minPrice || '');
    setLocalMax(maxPrice || '');
  }, [minPrice, maxPrice]);

  const handleMinChange = e => {
    const value = e.target.value;
    setLocalMin(value);
    if (validationMessage) setValidationMessage(null);
  };

  const handleMaxChange = e => {
    const value = e.target.value;
    setLocalMax(value);
    if (validationMessage) setValidationMessage(null);
  };

  const handleApply = () => {
    const min = localMin ? parseInt(localMin, 10) : null;
    const max = localMax ? parseInt(localMax, 10) : null;

    // Validate: min should be less than max
    if (min !== null && max !== null && min > max) {
      setValidationMessage('Min price should be less than max price');
      return;
    }

    setValidationMessage(null);
    onChange(min, max);
  };

  const handleReset = () => {
    setLocalMin('');
    setLocalMax('');
    setValidationMessage(null);
    onChange(null, null);
  };

  const presetRanges = [
    { label: 'All Prices', min: null, max: null },
    { label: '$0 - $100K', min: 0, max: 100000 },
    { label: '$100K - $500K', min: 100000, max: 500000 },
    { label: '$500K - $1M', min: 500000, max: 1000000 },
    { label: '$1M+', min: 1000000, max: null },
  ];

  return (
    <div className="filter-group">
      <label className="filter-label">Price Range</label>

      {validationMessage && (
        <div
          role="alert"
          data-testid="price-range-validation"
          style={{
            marginBottom: '10px',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            borderLeft: '4px solid #F04438',
            background: '#FEF3F2',
            color: '#B42318',
          }}
        >
          ⚠️ {validationMessage}
        </div>
      )}

      {/* Preset Ranges */}
      <div className="preset-ranges">
        {presetRanges.map(range => (
          <button
            key={range.label}
            className={`preset-btn ${
              localMin === (range.min || '') && localMax === (range.max || '') ? 'active' : ''
            }`}
            onClick={() => {
              setLocalMin(range.min || '');
              setLocalMax(range.max || '');
              onChange(range.min, range.max);
            }}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Custom Range Inputs */}
      <div className="price-range-inputs">
        <div className="price-input-group">
          <label htmlFor="min-price">Min Price</label>
          <input
            type="number"
            id="min-price"
            placeholder="0"
            value={localMin}
            onChange={handleMinChange}
            className="price-input"
          />
        </div>
        <span className="price-separator">to</span>
        <div className="price-input-group">
          <label htmlFor="max-price">Max Price</label>
          <input
            type="number"
            id="max-price"
            placeholder="∞"
            value={localMax}
            onChange={handleMaxChange}
            className="price-input"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="price-actions">
        <button className="btn-small btn-primary" onClick={handleApply}>
          Apply
        </button>
        <button className="btn-small btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
