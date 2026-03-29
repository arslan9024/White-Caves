import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  FilterDropdownContainer,
  FilterLabel,
  SelectWrapper,
  Select,
  DropdownIcon
} from './FilterDropdown.styles';

type FilterOption = string | { value: string; label: string; count?: number };

interface FilterDropdownProps {
  label: string;
  value: string | null;
  options: FilterOption[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  showCount?: boolean;
  disabled?: boolean;
}

const FilterDropdown = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = 'All',
  showCount = false,
  disabled = false 
}: FilterDropdownProps) => {
  return (
    <FilterDropdownContainer $disabled={disabled}>
      <FilterLabel>{label}</FilterLabel>
      <SelectWrapper>
        <Select 
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
        </Select>
        <DropdownIcon>
          <ChevronDown size={16} />
        </DropdownIcon>
      </SelectWrapper>
    </FilterDropdownContainer>
  );
};

export default FilterDropdown;
