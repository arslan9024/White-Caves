import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import AuroraAnalysisDashboard from '../AuroraAnalysisDashboard';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
  reducer: {
    aurora: () => ({
      providers: [],
      analysis: null,
      srs: [],
      audit: null,
      loading: false,
    }),
  },
});

describe('AuroraAnalysisDashboard Component', () => {
  it('renders AuroraAnalysisDashboard component without crashing', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <AuroraAnalysisDashboard />
      </Provider>
    );
    expect(container).toBeDefined();
  });
});
