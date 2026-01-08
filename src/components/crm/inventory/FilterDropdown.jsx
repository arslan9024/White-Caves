import React from 'react';
import { ChevronDown } from 'lucide-react';
import './FilterDropdown.css';

const FilterDropdown = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = 'All',
  showCount = false,
  disabled = false 
}) => {
  return (
    <div className={`filter-dropdown ${disabled ? 'disabled' : ''}`}>
      <label className="filter-label">{label}</label>
      <div className="select-wrapper">
        <select 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value || null)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            const count = typeof option === 'object' ? option.count : null;
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}{showCount && count ? ` (${count})` : ''}
              </option>
            );
          })}
        </select>
        <ChevronDown className="dropdown-icon" size={16} />
      </div>
    </div>
  );
};

export default FilterDropdown;
