import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert Component', () => {
  it('renders title and message correctly', () => {
    render(<Alert title="Success Alert" message="Operation completed successfully" type="success" />);
    expect(screen.getByText('Success Alert')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
  });

  it('renders dismissible close button and handles dismiss', () => {
    const handleDismiss = vi.fn();
    render(<Alert title="Dismissible Alert" type="info" dismissible onDismiss={handleDismiss} />);
    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
