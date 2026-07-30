import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import AuroraDocumentIndex from '../AuroraDocumentIndex';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
  reducer: {
    crmView: () => ({ activeDocument: null }),
  },
});

describe('AuroraDocumentIndex Component', () => {
  it('renders AuroraDocumentIndex component without crashing', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <AuroraDocumentIndex />
      </Provider>
    );
    expect(container).toBeDefined();
  });
});
