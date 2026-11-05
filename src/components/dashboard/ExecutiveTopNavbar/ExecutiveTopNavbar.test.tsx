import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../../context/ThemeContext';
import { UserRoleProvider } from '../../../context/UserRoleContext';
import ExecutiveTopNavbar from './ExecutiveTopNavbar';

describe('ExecutiveTopNavbar Component (7-Category Co-Location Spec)', () => {
  it('renders the executive navbar with brand logo, DLD and RERA badges', () => {
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
    expect(screen.getByText(/1388443/i)).toBeInTheDocument();
    expect(screen.getByText(/44483/i)).toBeInTheDocument();
  });
});
