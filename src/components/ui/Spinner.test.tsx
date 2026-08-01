import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner Component', () => {
  it('renders spinner loading indicator correctly', () => {
    const { container } = render(<Spinner size="medium" label="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });
});
