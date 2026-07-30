import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import DealsTab from '../DealsTab';

describe('DealsTab Component', () => {
  it('renders DealsTab component without crashing', () => {
    const { container } = render(<DealsTab />);
    expect(container).toBeDefined();
  });
});
