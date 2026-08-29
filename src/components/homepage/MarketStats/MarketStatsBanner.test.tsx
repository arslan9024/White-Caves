import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import Component from './MarketStatsBanner';

describe('MarketStatsBanner Component', () => {
  it('renders cleanly with Redux Provider', () => {
    expect(Component).toBeDefined();
    if (typeof Component === 'function') {
      const { container } = render(
        <Provider store={store}>
          <Component />
        </Provider>
      );
      expect(container).toBeDefined();
    }
  });
});
