import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import Checkout from '../Checkout';

describe('Checkout Component', () => {
  it('renders checkout component without crashing', () => {
    const { container } = render(<Checkout property={{ title: 'Luxury Villa' }} amount={5000} />);
    expect(container).toBeDefined();
  });
});
