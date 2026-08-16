import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonalDetailsInlineEditor } from './PersonalDetailsInlineEditor';

describe('PersonalDetailsInlineEditor Component', () => {
  it('renders personal details and toggles inline editor inputs', () => {
    render(<PersonalDetailsInlineEditor />);
    expect(screen.getByTestId('personal-details-inline-editor')).toBeDefined();
    expect(screen.getByText(/Personal & Corporate Details/i)).toBeDefined();
    expect(screen.getByText(/Arsalan Malik/i)).toBeDefined();
    expect(screen.getByText(/\+971 50 123 4567/i)).toBeDefined();
    expect(screen.getByText(/Managing Director \(Level 5 Superuser\)/i)).toBeDefined();

    const editBtn = screen.getByRole('button', { name: /Edit Details/i });
    fireEvent.click(editBtn);
    expect(screen.getByDisplayValue('Arsalan Malik')).toBeDefined();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeDefined();

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);
    expect(screen.getByRole('button', { name: /Edit Details/i })).toBeDefined();
  });
});
