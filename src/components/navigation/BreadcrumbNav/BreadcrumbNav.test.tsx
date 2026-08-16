import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BreadcrumbNav } from './BreadcrumbNav';

describe('BreadcrumbNav Component', () => {
  it('renders semantic breadcrumb navigation and crumb links', () => {
    render(<BreadcrumbNav />);
    expect(screen.getByTestId('breadcrumb-nav')).toBeDefined();
    expect(screen.getByText(/Home/i)).toBeDefined();
    expect(screen.getByText(/Properties/i)).toBeDefined();
    expect(screen.getByText(/Palm Jumeirah/i)).toBeDefined();
    expect(screen.getByText('Signature Villa 14B')).toBeDefined();
  });
});
