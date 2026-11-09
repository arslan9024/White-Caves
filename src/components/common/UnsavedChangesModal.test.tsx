import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnsavedChangesModal, TaskActionBar } from './UnsavedChangesModal';
import { ThemeProvider } from '../../context/ThemeContext';

describe('UnsavedChangesModal', () => {
  it('renders modal when open and handles proceed/cancel', () => {
    const handleProceed = vi.fn();
    const handleCancel = vi.fn();

    const { rerender } = render(
      <ThemeProvider>
        <UnsavedChangesModal
          isOpen={false}
          onProceed={handleProceed}
          onCancel={handleCancel}
        />
      </ThemeProvider>
    );

    expect(screen.queryByRole('dialog')).toBeNull();

    rerender(
      <ThemeProvider>
        <UnsavedChangesModal
          isOpen={true}
          onProceed={handleProceed}
          onCancel={handleCancel}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Unsaved Changes Detected')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Discard Changes'));
    expect(handleProceed).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Keep Editing'));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});

describe('TaskActionBar', () => {
  it('renders action bar with Save, Save & Close, and Cancel buttons', () => {
    const handleSave = vi.fn();
    const handleSaveAndClose = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ThemeProvider>
        <TaskActionBar
          isDirty={true}
          onSave={handleSave}
          onSaveAndClose={handleSaveAndClose}
          onCancel={handleCancel}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/Unsaved changes/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(handleSave).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Save & Close/i }));
    expect(handleSaveAndClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
