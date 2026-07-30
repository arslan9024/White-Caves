import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import CRMShell from '../CRMShell';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

const mockStore = configureStore({
  reducer: {
    crmView: () => ({
      activeCategory: 'overview',
      activeSubItem: null,
      selectedAssistantForChat: null,
      documentViewMode: false,
      activeDocument: null,
      assistants: [],
    }),
    user: () => ({ currentUser: { role: 'admin' } }),
  },
});

describe('CRMShell Component', () => {
  it('renders CRMShell component without crashing', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <CRMShell />
        </BrowserRouter>
      </Provider>
    );
    expect(container).toBeDefined();
  });
});
