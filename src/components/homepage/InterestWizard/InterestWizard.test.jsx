import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../../store/store';
import Component from './InterestWizard';

describe('InterestWizard Component', () => {
  it('renders cleanly with Provider and Router', () => {
    expect(Component).toBeDefined();
    if (typeof Component === 'function') {
      const { container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <Component />
          </BrowserRouter>
        </Provider>
      );
      expect(container).toBeDefined();
    }
  });
});
