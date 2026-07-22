import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SQATab } from '../SQATab';

describe('SQATab Component', () => {
  it('renders SQATab header and SQA Quality Cockpit title', () => {
    render(<SQATab />);
    expect(
      screen.getByText(/Software Quality Assurance & Quality Control Cockpit/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('sqa-tab-root')).toBeInTheDocument();
  });

  it('renders sub-tabs navigation items', () => {
    render(<SQATab />);
    expect(screen.getByText(/SQA Quality Scorecard/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Suite Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Code Deduplication & Perf/i)).toBeInTheDocument();
    expect(screen.getByText(/Security & RBAC Audit/i)).toBeInTheDocument();
  });
});
