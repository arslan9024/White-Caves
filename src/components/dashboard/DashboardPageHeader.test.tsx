import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPageHeader from './DashboardPageHeader';

const baseProps = {
  currentModule: 'Sales CRM',
  currentRole: 'agent',
  roleLabel: 'Sales Agent',
  roleDescription: 'Manage leads, viewings, and listings',
  greetingLine: 'Good evening, Arslan!',
  userEmail: 'arslan@whitecaves.ae',
};

describe('DashboardPageHeader', () => {
  it('renders the role dashboard heading', () => {
    render(<DashboardPageHeader {...baseProps} />);
    expect(screen.getByText('Sales Agent Dashboard')).toBeInTheDocument();
  });

  it('renders the greeting line', () => {
    render(<DashboardPageHeader {...baseProps} />);
    expect(screen.getByText('Good evening, Arslan!')).toBeInTheDocument();
  });

  it('renders breadcrumb with role and tab labels', () => {
    render(<DashboardPageHeader {...baseProps} currentTabLabel="Leads" />);
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Leads')).toBeInTheDocument();
  });

  it('shows "Overview" fallback when no tab label is provided', () => {
    render(<DashboardPageHeader {...baseProps} />);
    const overviewElements = screen.getAllByText('Overview');
    expect(overviewElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders user email as a status pill', () => {
    render(<DashboardPageHeader {...baseProps} />);
    expect(screen.getByText('arslan@whitecaves.ae')).toBeInTheDocument();
  });

  it('displays "Live workspace" status pill', () => {
    render(<DashboardPageHeader {...baseProps} />);
    expect(screen.getByText('Live workspace')).toBeInTheDocument();
  });

  it('uses selectedCRMModuleLabel over currentTabLabel when both provided', () => {
    render(
      <DashboardPageHeader
        {...baseProps}
        currentTabLabel="Leads"
        selectedCRMModuleLabel="Ejari Management"
      />
    );
    const ejariElements = screen.getAllByText('Ejari Management');
    expect(ejariElements.length).toBeGreaterThanOrEqual(1);
  });
});
