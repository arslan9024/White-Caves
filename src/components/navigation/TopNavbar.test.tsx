import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { WorkspaceProvider } from '../../context/WorkspaceContext';
import Component from './TopNavbar';

describe('TopNavbar Component', () => {
  it('renders and mounts TopNavbar cleanly within WorkspaceProvider', () => {
    expect(Component).toBeDefined();
    const { container } = render(
      <Provider store={store}>
        <WorkspaceProvider>
          <MemoryRouter>
            <Component />
          </MemoryRouter>
        </WorkspaceProvider>
      </Provider>
    );
    expect(container).toBeDefined();
  });
});

