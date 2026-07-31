import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import InquiriesTab from '../InquiriesTab';

describe('InquiriesTab Component', () => {
  it('renders InquiriesTab without crashing with empty inquiries', () => {
    const { container } = render(<InquiriesTab inquiries={[]} />);
    expect(container).toBeDefined();
  });
});
