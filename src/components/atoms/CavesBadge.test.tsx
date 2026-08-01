import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CavesBadge } from './CavesBadge';

describe('CavesBadge Component', () => {
  it('renders badge label text correctly', () => {
    render(<CavesBadge variant="primary">LEVEL_5_MASTER</CavesBadge>);
    expect(screen.getByText('LEVEL_5_MASTER')).toBeInTheDocument();
  });
});
