import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import AtlasProjectsCRM from '../AtlasProjectsCRM';

describe('AtlasProjectsCRM Component', () => {
  it('renders Atlas Projects CRM component without crashing', () => {
    const { container } = render(<AtlasProjectsCRM />);
    expect(container).toBeDefined();
  });

  it('renders project list items', () => {
    render(<AtlasProjectsCRM />);
    expect(screen.getByText('Marina Vista Tower')).toBeDefined();
  });
});
