import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import EvangelineLegalCRM from '../EvangelineLegalCRM';

describe('EvangelineLegalCRM Component', () => {
  it('renders EvangelineLegalCRM component without crashing', () => {
    const { container } = render(<EvangelineLegalCRM />);
    expect(container).toBeDefined();
  });
});
