import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import PDCPaymentsTab from '../PDCPaymentsTab';

describe('PDCPaymentsTab Component', () => {
  it('renders PDCPaymentsTab component without crashing', () => {
    const { container } = render(<PDCPaymentsTab cheques={[]} />);
    expect(container).toBeDefined();
  });
});
