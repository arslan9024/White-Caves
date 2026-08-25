import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeadDetailSlideOver } from './LeadDetailSlideOver';

describe('LeadDetailSlideOver', () => {
  it('renders panel when open', () => {
    render(<LeadDetailSlideOver open={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('lead-detail-slide-over')).toBeTruthy();
    expect(screen.getByText('Ahmed Al Mansouri')).toBeTruthy();
  });

  it('shows timeline events', () => {
    render(<LeadDetailSlideOver open={true} onClose={vi.fn()} />);
    expect(screen.getByText('Initial Call')).toBeTruthy();
  });
});
