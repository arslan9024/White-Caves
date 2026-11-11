import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../../context/ThemeContext';
import { UserRoleProvider } from '../../../context/UserRoleContext';
import ExecutiveTopNavbar from './ExecutiveTopNavbar';

describe('ExecutiveTopNavbar Component (7-Category Co-Location Spec)', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the executive navbar with brand logo and single White Caves HQ anchor', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <UserRoleProvider>
            <ExecutiveTopNavbar />
          </UserRoleProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByAltText(/White Caves Logo/i)).toBeInTheDocument();
    expect(screen.getByText(/White Caves HQ/i)).toBeInTheDocument();
  });
});
