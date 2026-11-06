// FILE: src/components/dashboard/VSCodeBreadcrumbs/VSCodeBreadcrumbs.test.tsx
/**
 * White Caves Real Estate LLC - VSCode Breadcrumbs Unit Tests
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { VSCodeBreadcrumbs } from './VSCodeBreadcrumbs.view';
import { ThemeProvider } from '../../../context/ThemeContext';

function renderBreadcrumbs(
  initialPath: string = '/dashboard/departments/slots',
  onNavigate = vi.fn()
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ThemeProvider>
        <VSCodeBreadcrumbs currentPath={initialPath} onNavigate={onNavigate} />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('VSCodeBreadcrumbs Component Suite', () => {
  it('renders breadcrumb bar with root HQ and system segments', () => {
    renderBreadcrumbs('/dashboard/departments/slots');

    expect(screen.getByTestId('vscode-breadcrumbs-bar')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-hq')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-departments')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-slots')).toBeInTheDocument();
  });

  it('triggers navigation when breadcrumb segment is clicked', () => {
    const onNavigate = vi.fn();
    renderBreadcrumbs('/dashboard/departments/slots', onNavigate);

    const deptBtn = screen.getByTestId('breadcrumb-segment-departments');
    fireEvent.click(deptBtn);

    expect(onNavigate).toHaveBeenCalledWith('/dashboard/departments');
  });

  it('opens sibling dropdown popover on chevron click', () => {
    renderBreadcrumbs('/dashboard/departments/slots');

    const chevron = screen.getByTestId('breadcrumb-segment-slots').querySelector('svg');
    expect(chevron).toBeInTheDocument();
    if (chevron?.parentElement) {
      fireEvent.click(chevron.parentElement);
      expect(screen.getByTestId('breadcrumb-sibling-popover')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-sibling-option-pillars')).toBeInTheDocument();
    }
  });

  it('navigates to sibling when option is clicked', () => {
    const onNavigate = vi.fn();
    renderBreadcrumbs('/dashboard/departments/slots', onNavigate);

    const chevron = screen.getByTestId('breadcrumb-segment-slots').querySelector('svg');
    if (chevron?.parentElement) {
      fireEvent.click(chevron.parentElement);
      const option = screen.getByTestId('breadcrumb-sibling-option-pillars');
      fireEvent.click(option);
      expect(onNavigate).toHaveBeenCalledWith('/dashboard/departments/pillars');
    }
  });

  it('handles history back and forward button clicks', () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    const forwardSpy = vi.spyOn(window.history, 'forward').mockImplementation(() => {});

    renderBreadcrumbs();

    fireEvent.click(screen.getByTestId('breadcrumb-history-back'));
    expect(backSpy).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('breadcrumb-history-forward'));
    expect(forwardSpy).toHaveBeenCalled();

    backSpy.mockRestore();
    forwardSpy.mockRestore();
  });
});
