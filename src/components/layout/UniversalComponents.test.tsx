import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import UniversalComponents from './UniversalComponents';

const dummyReducer = (state = { isOnline: true }, action: any) => state;

const store = configureStore({
  reducer: {
    navigation: dummyReducer
  }
});

describe('UniversalComponents Component', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <UniversalComponents />
      </Provider>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
