/**
 * MobileCRMBottomNav.test.tsx — Unit Tests
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileCRMBottomNav } from './MobileCRMBottomNav';

const mockNavigate = vi.fn();
vi.mock('./logic/MobileCRMBottomNav.logic', () => ({
  useMobileCRMBottomNavLogic: () => ({
    tabs: [
      { id: 'dashboard', label: 'Dashboard', path: '/crm/dashboard', icon: 'LayoutDashboard' },
      { id: 'leads', label: 'Leads', path: '/crm/leads', icon: 'Users' },
    ],
    activeTabId: 'dashboard',
    navigate: mockNavigate,
  }),
}));

describe('MobileCRMBottomNav', () => {
  it('renders all tabs', () => {
    render(<MobileCRMBottomNav />);
    expect(screen.getByTestId('mobile-crm-bottom-nav')).toBeDefined();
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Leads')).toBeDefined();
  });

  it('calls navigate when a tab is clicked', () => {
    render(<MobileCRMBottomNav />);
    fireEvent.click(screen.getByText('Leads'));
    expect(mockNavigate).toHaveBeenCalledWith('/crm/leads');
  });
});
