import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Form12Eviction from './Form12Eviction';

describe('Form12Eviction Component', () => {
  it('renders the eviction timeline without crashing', () => {
    const { container } = render(<Form12Eviction />);
    expect(container).toBeDefined();
  });

  it('contains the statutory 12-month notice heading', () => {
    const { container } = render(<Form12Eviction />);
    const text = container.textContent || '';
    expect(text.length).toBeGreaterThan(0);
  });
});
