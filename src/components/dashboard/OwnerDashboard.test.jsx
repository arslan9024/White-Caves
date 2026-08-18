import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../store/store';
import OwnerDashboard from './OwnerDashboard';

describe('OwnerDashboard Component', () => {
  it('renders without crashing with Redux provider and router context', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <OwnerDashboard />
        </MemoryRouter>
      </Provider>
    );
    expect(container).toBeDefined();
  });
});
