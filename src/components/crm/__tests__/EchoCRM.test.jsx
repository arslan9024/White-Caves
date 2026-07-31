import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import EchoCRM from '../EchoCRM';

describe('EchoCRM Component', () => {
  it('renders EchoCRM component without crashing', () => {
    const { container } = render(<EchoCRM />);
    expect(container).toBeDefined();
  });
});
