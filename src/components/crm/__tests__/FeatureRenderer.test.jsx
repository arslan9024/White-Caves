import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import FeatureRenderer from '../FeatureRenderer';

describe('FeatureRenderer Component', () => {
  it('renders FeatureRenderer component without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <FeatureRenderer featureId="overview" />
      </Provider>
    );
    expect(container).toBeDefined();
  });
});
