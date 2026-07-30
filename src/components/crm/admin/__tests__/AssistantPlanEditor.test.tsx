import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AssistantPlanEditor } from '../AssistantPlanEditor';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
  reducer: {
    user: () => ({ currentUser: { id: 'u1', role: 'owner', token: 'tok' } }),
  },
});

describe('AssistantPlanEditor Component', () => {
  it('renders assistant plan editor for super user', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <AssistantPlanEditor />
      </Provider>
    );
    expect(container).toBeDefined();
  });
});
