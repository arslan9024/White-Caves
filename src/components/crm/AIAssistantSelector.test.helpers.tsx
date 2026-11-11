// FILE: src/components/crm/AIAssistantSelector.test.helpers.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AIAssistantSelector from './AIAssistantSelector';

export function createAIAssistant(overrides: Record<string, unknown> = {}) {
  return {
    id: 'mary',
    name: 'Mary AI',
    title: 'Document Specialist',
    department: 'operations',
    colorScheme: '#4A90D9',
    specialization: 'documents',
    metrics: {
      activeUsers: 45,
      systemHealth: 'optimal' as const,
      accuracy: 96,
      responseTime: 200,
    },
    quickStats: { value: '12', label: 'Docs today' },
    ...overrides,
  };
}

export const testAssistantsList = [
  createAIAssistant(),
  createAIAssistant({
    id: 'theodora',
    name: 'Theodora AI',
    title: 'Finance Manager',
    department: 'finance',
  }),
  createAIAssistant({
    id: 'olivia',
    name: 'Olivia AI',
    title: 'Marketing Lead',
    department: 'marketing',
  }),
  createAIAssistant({
    id: 'zoe',
    name: 'Zoe AI',
    title: 'HR Specialist',
    department: 'operations',
  }),
];

export function createTestStore(overrides: Record<string, unknown> = {}) {
  const defaultState: Record<string, unknown> = {
    assistants: {
      byId: Object.fromEntries(testAssistantsList.map(a => [a.id, a])),
      allIds: testAssistantsList.map(a => a.id),
    },
    ui: {
      selectedAssistant: 'mary',
      dropdownOpen: false,
      filters: { department: 'all', search: '' },
    },
    favorites: ['mary'],
    recent: ['theodora'],
    performance: {},
    ...overrides,
  };

  return configureStore({
    reducer: {
      aiAssistantDashboard: (state = defaultState, action: { type: string; payload?: unknown }) => {
        switch (action.type) {
          case 'aiAssistantDashboard/toggleDropdown':
            return {
              ...state,
              ui: { ...(state as any).ui, dropdownOpen: !(state as any).ui.dropdownOpen },
            };
          case 'aiAssistantDashboard/closeDropdown':
            return { ...state, ui: { ...(state as any).ui, dropdownOpen: false } };
          case 'aiAssistantDashboard/selectAssistant':
            return {
              ...state,
              ui: { ...(state as any).ui, selectedAssistant: action.payload, dropdownOpen: false },
            };
          case 'aiAssistantDashboard/toggleFavorite': {
            const id = action.payload as string;
            const favs = (state as any).favorites.includes(id)
              ? (state as any).favorites.filter((f: string) => f !== id)
              : [...(state as any).favorites, id];
            return { ...state, favorites: favs };
          }
          case 'aiAssistantDashboard/setSearchQuery':
            return {
              ...state,
              ui: {
                ...(state as any).ui,
                filters: { ...(state as any).ui.filters, search: action.payload },
              },
            };
          case 'aiAssistantDashboard/setDepartmentFilter':
            return {
              ...state,
              ui: {
                ...(state as any).ui,
                filters: { ...(state as any).ui.filters, department: action.payload },
              },
            };
          default:
            return state;
        }
      },
    },
  });
}

export function renderSelector(
  props: Partial<React.ComponentProps<typeof AIAssistantSelector>> = {},
  storeOverrides: Record<string, unknown> = {}
) {
  const store = createTestStore(storeOverrides);
  return {
    store,
    ...render(
      <Provider store={store}>
        <AIAssistantSelector {...props} />
      </Provider>
    ),
  };
}
