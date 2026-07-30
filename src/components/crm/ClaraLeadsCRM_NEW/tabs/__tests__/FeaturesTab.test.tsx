import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import FeaturesTab from '../FeaturesTab';

describe('FeaturesTab Component', () => {
  it('renders FeaturesTab component without crashing', () => {
    const { container } = render(<FeaturesTab />);
    expect(container).toBeDefined();
  });
});
