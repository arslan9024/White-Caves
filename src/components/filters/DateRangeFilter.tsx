/**
 * Date Range Filter Component
 * Allows selection of date ranges for data filtering
 */

import React, { useState } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$active ? '#3498db' : 'rgba(255, 255, 255, 0.2)')};
  background: ${(props) => (props.$active ? '#3498db' : 'rgba(255, 255, 255, 0.05)')};
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.$active ? '#2980b9' : 'rgba(255, 255, 255, 0.1)')};
    border-color: #3498db;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const DateInputWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
  }
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 12px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Separator = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;

  @media (max-width: 600px) {
    display: none;
  }
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(231, 76, 60, 0.2);
    border-color: #e74c3c;
    color: #e74c3c;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface DateRangeFilterProps {
  onDateRangeChange?: (startDate: Date, endDate: Date, range: DateRange) => void;
  onRangeChange?: (range: DateRange) => void;
}

/**
 * Date Range Filter Component
 * Provides quick filter buttons and custom date range picker
 */
export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateRangeChange,
  onRangeChange,
}) => {
  const [activeRange, setActiveRange] = useState<DateRange>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const getDateRange = (range: DateRange): { start: Date; end: Date } => {
    const now = new Date();
    const start = new Date();

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        return { start, end: now };

      case 'week':
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        return { start, end: now };

      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        return { start, end: now };

      case 'quarter': {
        const quarter = Math.floor(now.getMonth() / 3);
        start.setMonth(quarter * 3, 1);
        start.setHours(0, 0, 0, 0);
        return { start, end: now };
      }

      case 'year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        return { start, end: now };

      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate),
          };
        }
        return { start, end: now };

      default:
        return { start, end: now };
    }
  };

  const handleRangeClick = (range: DateRange) => {
    setActiveRange(range);
    onRangeChange?.(range);

    if (range !== 'custom') {
      const { start, end } = getDateRange(range);
      onDateRangeChange?.(start, end, range);
    }
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      setActiveRange('custom');
      onDateRangeChange?.(
        new Date(customStartDate),
        new Date(customEndDate),
        'custom'
      );
    }
  };

  const handleReset = () => {
    setActiveRange('month');
    setCustomStartDate('');
    setCustomEndDate('');
    const { start, end } = getDateRange('month');
    onDateRangeChange?.(start, end, 'month');
  };

  return (
    <FilterContainer>
      <FilterButton
        $active={activeRange === 'today'}
        onClick={() => handleRangeClick('today')}
      >
        Today
      </FilterButton>

      <FilterButton
        $active={activeRange === 'week'}
        onClick={() => handleRangeClick('week')}
      >
        This Week
      </FilterButton>

      <FilterButton
        $active={activeRange === 'month'}
        onClick={() => handleRangeClick('month')}
      >
        This Month
      </FilterButton>

      <FilterButton
        $active={activeRange === 'quarter'}
        onClick={() => handleRangeClick('quarter')}
      >
        This Quarter
      </FilterButton>

      <FilterButton
        $active={activeRange === 'year'}
        onClick={() => handleRangeClick('year')}
      >
        This Year
      </FilterButton>

      <DateInputWrapper>
        <DateInput
          type="date"
          value={customStartDate}
          onChange={(e) => setCustomStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <Separator>→</Separator>
        <DateInput
          type="date"
          value={customEndDate}
          onChange={(e) => setCustomEndDate(e.target.value)}
          placeholder="End Date"
        />
        <FilterButton
          $active={!!(activeRange === 'custom' && customStartDate && customEndDate)}
          onClick={handleCustomDateChange}
        >
          Apply
        </FilterButton>
      </DateInputWrapper>

      <ResetButton onClick={handleReset}>Reset</ResetButton>
    </FilterContainer>
  );
};

export default DateRangeFilter;
