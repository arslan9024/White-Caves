import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders default empty state copy', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders custom content and action', () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        icon="🔎"
        title="No matching rows"
        description="Try another filter."
        actionLabel="Reset"
        onAction={onAction}
      />
    );

    expect(screen.getByText('No matching rows')).toBeInTheDocument();
    expect(screen.getByText('Try another filter.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
