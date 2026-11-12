import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AutoReplyPlannerTab } from './AutoReplyPlannerTab';

describe('AutoReplyPlannerTab Component', () => {
  it('renders auto reply rule planner and initial trigger rules', () => {
    render(<AutoReplyPlannerTab />);
    expect(screen.getByText(/Automated Auto-Reply Rule Planner/i)).toBeDefined();
    expect(screen.getByText(/DAMAC Hills 2 Villa & Pricing Inquiry/i)).toBeDefined();
    expect(screen.getByText(/Ejari & Lease Contract Support/i)).toBeDefined();
    expect(screen.getByText(/DLD Title Deed Verification Request/i)).toBeDefined();
  });

  it('opens add rule modal and toggles modal visibility', () => {
    render(<AutoReplyPlannerTab />);
    const addBtn = screen.getByRole('button', { name: /Add Auto-Reply Rule/i });
    fireEvent.click(addBtn);
    expect(screen.getByText(/Create Nina AI Auto-Reply Rule/i)).toBeDefined();

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(screen.queryByText(/Create Nina AI Auto-Reply Rule/i)).toBeNull();
  });
});
