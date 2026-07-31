import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import FluxCRM from '../FluxCRM';

describe('FluxCRM Component', () => {
  it('renders FluxCRM component without crashing', () => {
    const { container } = render(<FluxCRM />);
    expect(container).toBeDefined();
  });
});
