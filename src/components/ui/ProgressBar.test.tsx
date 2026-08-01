import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar Component', () => {
  it('renders progress bar with label correctly', () => {
    render(<ProgressBar value={75} showLabel ariaLabel="Lead score progress" />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});
