import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CmaReportGenerator from './CmaReportGenerator';

describe('CmaReportGenerator Component', () => {
  it('renders without crashing and displays the CMA report generator interface', () => {
    render(<CmaReportGenerator />);
    expect(screen.getByTestId('cma-report-generator')).toBeDefined();
  });
});
