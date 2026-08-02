import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { WorkspaceProvider } from '../../context/WorkspaceContext';
import { useTopNavbarLogic } from './TopNavbar.logic';
import userReducer from '../../store/userSlice';
import authReducer from '../../store/authSlice';

const testStore = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
});

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={testStore}>
    <MemoryRouter>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </MemoryRouter>
  </Provider>
);

describe('useTopNavbarLogic', () => {
  it('initializes search query state correctly', () => {
    const { result } = renderHook(() => useTopNavbarLogic(), { wrapper });
    expect(result.current.searchQuery).toBe('');
    expect(typeof result.current.handleSearchChange).toBe('function');
  });

  it('updates search query on change', () => {
    const { result } = renderHook(() => useTopNavbarLogic(), { wrapper });

    act(() => {
      result.current.handleSearchChange({
        target: { value: 'DAMAC Hills' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.searchQuery).toBe('DAMAC Hills');
  });
});
