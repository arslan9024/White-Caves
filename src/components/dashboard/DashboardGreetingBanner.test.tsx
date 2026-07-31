import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardGreetingBanner from './DashboardGreetingBanner';

const baseProps = {
  currentModule: 'Sales CRM',
  currentRole: 'agent',
  workspaceLabel: 'White Caves HQ',
  roleLabel: 'Sales Agent',
  roleDescription: 'Manage leads, viewings, and property listings',
  greetingLine: 'Good morning, Arslan!',
  userEmail: 'arslan@whitecaves.ae',
  profileCompletionPercent: 60,
  profileCompletionItems: [
    { id: 'photo', label: 'Upload photo', complete: true },
    { id: 'bio', label: 'Add bio', complete: false },
  ],
  showProfileCompletion: true,
  onOpenProfile: vi.fn(),
};

describe('DashboardGreetingBanner', () => {
  it('renders the role dashboard heading', () => {
    render(<DashboardGreetingBanner {...baseProps} />);
    expect(screen.getByText('Sales Agent Dashboard')).toBeInTheDocument();
  });

  it('renders the greeting line', () => {
    render(<DashboardGreetingBanner {...baseProps} />);
    expect(screen.getByText('Good morning, Arslan!')).toBeInTheDocument();
  });

  it('shows breadcrumb navigation', () => {
    render(<DashboardGreetingBanner {...baseProps} />);
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });

  it('renders profile completion section when showProfileCompletion is true', () => {
    render(<DashboardGreetingBanner {...baseProps} />);
    expect(screen.getByLabelText('Profile setup status')).toBeInTheDocument();
    expect(screen.getByText(/60% complete/)).toBeInTheDocument();
  });

  it('hides profile completion section when showProfileCompletion is false', () => {
    render(<DashboardGreetingBanner {...baseProps} showProfileCompletion={false} />);
    expect(screen.queryByLabelText('Profile setup status')).toBeNull();
  });

  it('calls onOpenProfile when CTA button is clicked', () => {
    const spy = vi.fn();
    render(<DashboardGreetingBanner {...baseProps} onOpenProfile={spy} />);
    fireEvent.click(screen.getByText('Finish profile setup'));
    expect(spy).toHaveBeenCalledOnce();
  });
});
