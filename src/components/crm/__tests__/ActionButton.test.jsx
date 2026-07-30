import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ActionButton from '../ActionButton';

describe('ActionButton Component', () => {
  it('renders button with children text', () => {
    render(<ActionButton>Click Me</ActionButton>);
    expect(screen.getByText('Click Me')).toBeDefined();
  });
});
