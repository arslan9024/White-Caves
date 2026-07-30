import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CipherMarketCRM from '../CipherMarketCRM';

describe('CipherMarketCRM Component', () => {
  it('renders CipherMarketCRM without crashing', () => {
    const { container } = render(<CipherMarketCRM />);
    expect(container).toBeDefined();
  });

  it('renders market trends data', () => {
    render(<CipherMarketCRM />);
    expect(screen.getByText('Palm Jumeirah')).toBeDefined();
  });
});
