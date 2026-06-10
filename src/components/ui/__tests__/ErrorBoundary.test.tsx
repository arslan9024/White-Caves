import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

const ThrowingChild = () => {
  throw new Error('Test render error');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Healthy content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Healthy content')).toBeInTheDocument();
  });

  it('renders fallback UI and calls retry callback', () => {
    const onRetry = vi.fn();

    render(
      <ErrorBoundary onRetry={onRetry}>
        <ThrowingChild />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
