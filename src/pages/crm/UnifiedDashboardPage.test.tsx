import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { UnifiedDashboardPage } from './UnifiedDashboardPage';

// Mock WorkspaceContext
vi.mock('../../context/WorkspaceContext', () => ({
  useWorkspace: () => ({
    activeUser: { email: 'arslanmalikgoraha@gmail.com', name: 'Arsalan Malik' },
    effectiveAccessLevel: 5,
    isMaster: true,
    personnel: [],
  }),
}));

describe('UnifiedDashboardPage Component', () => {
  it('renders workspace control panel header and tabs for Level 5 Master MD', () => {
    render(
      <BrowserRouter>
        <UnifiedDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome Back, Arslan Malik/i)).toBeInTheDocument();
    expect(screen.getByText('LEVEL 5 MASTER MD')).toBeInTheDocument();
  });
});
