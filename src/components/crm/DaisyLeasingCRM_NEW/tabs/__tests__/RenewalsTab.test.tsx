import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import RenewalsTab from '../RenewalsTab';

describe('RenewalsTab Component', () => {
  it('renders RenewalsTab component without crashing', () => {
    const { container } = render(<RenewalsTab renewals={[]} />);
    expect(container).toBeDefined();
  });
});
