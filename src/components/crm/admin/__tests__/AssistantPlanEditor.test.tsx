import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AssistantPlanEditor } from '../AssistantPlanEditor';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const createMockStore = (role: string) =>
  configureStore({
    reducer: {
      auth: () => ({ user: { id: 'u1', role, token: 'tok' } }),
    },
  });

describe('AssistantPlanEditor Component', () => {
  it('renders assistant plan editor for executive-management roles', () => {
    const store = createMockStore('managing_director');
    render(
      <Provider store={store}>
        <AssistantPlanEditor />
      </Provider>
    );

    expect(screen.getByText('AI Assistant Plan Editor')).toBeTruthy();
  });

  it('blocks access for non-management roles', () => {
    const store = createMockStore('agent');
    render(
      <Provider store={store}>
        <AssistantPlanEditor />
      </Provider>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
  });
});
