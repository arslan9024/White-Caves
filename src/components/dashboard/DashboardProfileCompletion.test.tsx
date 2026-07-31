import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardProfileCompletion from './DashboardProfileCompletion';

const items = [
  { id: 'photo', label: 'Upload photo', complete: true },
  { id: 'bio', label: 'Add bio', complete: false },
  { id: 'phone', label: 'Verify phone', complete: false },
];

describe('DashboardProfileCompletion', () => {
  it('renders the profile setup section with aria-label', () => {
    render(<DashboardProfileCompletion percent={40} items={items} onFinishSetup={vi.fn()} />);
    expect(screen.getByLabelText('Profile setup status')).toBeInTheDocument();
  });

  it('displays the completion percentage', () => {
    render(<DashboardProfileCompletion percent={40} items={items} onFinishSetup={vi.fn()} />);
    expect(screen.getByText(/40% complete/)).toBeInTheDocument();
  });

  it('renders all profile completion items', () => {
    render(<DashboardProfileCompletion percent={40} items={items} onFinishSetup={vi.fn()} />);
    expect(screen.getByText('Upload photo')).toBeInTheDocument();
    expect(screen.getByText('Add bio')).toBeInTheDocument();
    expect(screen.getByText('Verify phone')).toBeInTheDocument();
  });

  it('shows ✅ for completed items and ⬜ for incomplete', () => {
    const { container } = render(
      <DashboardProfileCompletion percent={40} items={items} onFinishSetup={vi.fn()} />
    );
    const listItems = container.querySelectorAll('li');
    expect(listItems[0].textContent).toContain('✅');
    expect(listItems[1].textContent).toContain('⬜');
    expect(listItems[2].textContent).toContain('⬜');
  });

  it('calls onFinishSetup when CTA button is clicked', () => {
    const spy = vi.fn();
    render(<DashboardProfileCompletion percent={40} items={items} onFinishSetup={spy} />);
    fireEvent.click(screen.getByText('Finish profile setup'));
    expect(spy).toHaveBeenCalledOnce();
  });

  it('renders heading "Complete your profile"', () => {
    render(<DashboardProfileCompletion percent={80} items={items} onFinishSetup={vi.fn()} />);
    expect(screen.getByText('Complete your profile')).toBeInTheDocument();
  });
});
