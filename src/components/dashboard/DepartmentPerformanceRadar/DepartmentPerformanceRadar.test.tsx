import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DepartmentPerformanceRadar } from './DepartmentPerformanceRadar';

describe('DepartmentPerformanceRadar Component', () => {
  it('renders department performance radar and department squad scores', () => {
    render(<DepartmentPerformanceRadar />);
    expect(screen.getByTestId('department-performance-radar')).toBeDefined();
    expect(screen.getByText(/Department Performance & SLA Execution Radar/i)).toBeDefined();
    expect(screen.getByText(/MONTHLY SPRINT AUDIT/i)).toBeDefined();
    expect(screen.getByText(/Secondary Luxury Sales/i)).toBeDefined();
    expect(screen.getByText(/VIP & Family Office Desk/i)).toBeDefined();
  });
});
