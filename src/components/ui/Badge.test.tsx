import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders badge label text correctly', () => {
    render(<Badge label="LEVEL_5_MASTER" variant="primary" />);
    expect(screen.getByText('LEVEL_5_MASTER')).toBeInTheDocument();
  });

  it('renders badge with custom count badge', () => {
    render(<Badge label="Notifications" count={5} variant="danger" />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
