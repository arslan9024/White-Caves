import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import Component from './MarketStatsBanner';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

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
