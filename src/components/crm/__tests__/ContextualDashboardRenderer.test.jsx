import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ContextualDashboardRenderer from '../ContextualDashboardRenderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

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
  },
});

describe('ContextualDashboardRenderer Component', () => {
  it('renders ContextualDashboardRenderer component without crashing', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <ContextualDashboardRenderer />
      </Provider>
    );
    expect(container).toBeDefined();
  });
});
