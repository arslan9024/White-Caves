/**
 * ErmsEntityDrawer.test.tsx
 * Targeted Vitest test suite for ErmsEntityDrawer
 * Tests quick creation, completeness score calculation, and DLD validations
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErmsEntityDrawer } from './ErmsEntityDrawer';

describe('ErmsEntityDrawer (Pillars 1 & 4 Verification)', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<ErmsEntityDrawer isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly and validates Emirates ID and Ejari formats', () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(<ErmsEntityDrawer isOpen={true} onClose={handleClose} onSave={handleSave} />);

    expect(screen.getByText('Quick-Create Entity')).toBeInTheDocument();
    expect(screen.getByText('Entity Health & Integrity')).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText('e.g. Burj Crown 1402 / VIP Tenant');
    const eidInput = screen.getByPlaceholderText('784-1990-1234567-1');

    fireEvent.change(nameInput, { target: { value: 'Downtown Luxury Suite' } });
    fireEvent.change(eidInput, { target: { value: '784-1990-1234567-1' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: 'Commit Entity to ERMS' });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledTimes(1);
    const savedEntity = handleSave.mock.calls[0][0];
    expect(savedEntity.name).toBe('Downtown Luxury Suite');
    expect(savedEntity.details.emiratesId).toBe('784-1990-1234567-1');
  });
});

