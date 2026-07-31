import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import HaloCRM from '../HaloCRM';

describe('HaloCRM Component', () => {
  it('renders HaloCRM component without crashing', () => {
    const { container } = render(<HaloCRM />);
    expect(container).toBeDefined();
  });
});
