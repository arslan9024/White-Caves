import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import UniversalComponents from './UniversalComponents';

const dummyReducer = (state = { isOnline: true }) => state;

const store = configureStore({
  reducer: {
    navigation: dummyReducer,
  },
});

describe('UniversalComponents Component', () => {
  it('renders without crashing and keeps the canvas clean', () => {
    const { container } = render(
      <Provider store={store}>
        <UniversalComponents />
      </Provider>
    );
    expect(container.firstChild).toBeNull();
  });
});
