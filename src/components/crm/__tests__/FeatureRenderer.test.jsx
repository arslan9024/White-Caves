import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import FeatureRenderer from '../FeatureRenderer';

describe('FeatureRenderer Component', () => {
  it('renders FeatureRenderer component without crashing', () => {
    const { container } = render(<FeatureRenderer featureId="overview" />);
    expect(container).toBeDefined();
  });
});
