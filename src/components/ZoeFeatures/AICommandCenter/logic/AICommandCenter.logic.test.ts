import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import aiAssistantDashboardReducer from '../../../../store/slices/aiAssistantDashboardSlice';
import { useAICommandCenterLogic } from './AICommandCenter.logic';

const createMockStore = () =>
  configureStore({
    reducer: {
      aiAssistantDashboard: aiAssistantDashboardReducer,
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(Provider, { store: createMockStore() }, children)
);

describe('AICommandCenter.logic', () => {
  it('filters assistants by department and search query', () => {
    const { result } = renderHook(() => useAICommandCenterLogic(), { wrapper });

    expect(result.current.filteredAssistants.length).toBeGreaterThan(0);
    expect(result.current.stats.totalAgents).toBeGreaterThan(0);

    act(() => {
      result.current.setSearchTerm('clara');
    });

    expect(result.current.filteredAssistants.every(a => a.name.toLowerCase().includes('clara') || a.id.includes('clara'))).toBe(true);

    act(() => {
      result.current.handleSelectAssistant('theodora');
    });

    expect(result.current.selectedAssistantId).toBe('theodora');
  });
});
