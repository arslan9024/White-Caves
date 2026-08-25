import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RbacPermissionMatrixEditor } from './RbacPermissionMatrixEditor';

describe('RbacPermissionMatrixEditor', () => {
  it('renders RBAC editor with role tabs and matrix permissions table', () => {
    render(<RbacPermissionMatrixEditor />);

    expect(screen.getByTestId('rbac-permission-matrix-editor')).toBeDefined();
    expect(screen.getAllByText(/Manager/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Properties/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Financials/i).length).toBeGreaterThan(0);
  });

  it('switches role tabs on click', () => {
    render(<RbacPermissionMatrixEditor />);

    const managerTabs = screen.getAllByText(/Manager/i);
    fireEvent.click(managerTabs[0]);
    expect(screen.getByText(/Save Manager Permissions/i)).toBeDefined();
  });
});
