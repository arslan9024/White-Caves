import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import CRMDocumentViewer from '../CRMDocumentViewer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
  reducer: {
    crmView: () => ({
      activeDocument: null,
      documentHistory: [],
      documentHistoryIndex: -1,
      documentViewMode: false,
    }),
  },
});

describe('CRMDocumentViewer Component', () => {
  it('renders CRMDocumentViewer component without crashing', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <CRMDocumentViewer />
      </Provider>
    );
    expect(container).toBeDefined();
  });
});
