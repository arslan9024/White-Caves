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
  initialPath: string = '/dashboard/dms/departments/slots',
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
  it('renders breadcrumb bar with root HQ, subsystem and collection segments', () => {
    renderBreadcrumbs('/dashboard/dms/departments/slots');

    expect(screen.getByTestId('vscode-breadcrumbs-bar')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-hq')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-dms')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-departments')).toBeInTheDocument();
  });

  it('triggers navigation when breadcrumb subsystem segment is clicked', () => {
    const onNavigate = vi.fn();
    renderBreadcrumbs('/dashboard/dms/departments/slots', onNavigate);

    const dmsBtn = screen.getByTestId('breadcrumb-segment-dms');
    fireEvent.click(dmsBtn);

    expect(onNavigate).toHaveBeenCalledWith('/dashboard/dms/departments');
  });

  it('opens sibling dropdown popover on chevron click', () => {
    renderBreadcrumbs('/dashboard/dms/departments/slots');

    const chevron = screen.getByTestId('breadcrumb-segment-departments').querySelector('svg');
    expect(chevron).toBeInTheDocument();
    if (chevron?.parentElement) {
      fireEvent.click(chevron.parentElement);
      expect(screen.getByTestId('breadcrumb-sibling-popover')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-sibling-option-pillars')).toBeInTheDocument();
    }
  });

  it('navigates to sibling when option is clicked', () => {
    const onNavigate = vi.fn();
    renderBreadcrumbs('/dashboard/dms/departments/slots', onNavigate);

    const chevron = screen.getByTestId('breadcrumb-segment-departments').querySelector('svg');
    if (chevron?.parentElement) {
      fireEvent.click(chevron.parentElement);
      const option = screen.getByTestId('breadcrumb-sibling-option-pillars');
      fireEvent.click(option);
      expect(onNavigate).toHaveBeenCalledWith('/dashboard/dms/departments/pillars');
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

  it('renders 4-tier breadcrumbs on canonical property deep path', () => {
    renderBreadcrumbs('/dashboard/pms/properties/PROP-001');

    expect(screen.getByTestId('breadcrumb-segment-hq')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-pms')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-properties')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-prop-001')).toBeInTheDocument();
  });
});
