import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CreateTenancyAgreement from '../CreateTenancyAgreement';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
  reducer: {
    user: () => ({ currentUser: { id: 'user-1', name: 'John Doe' } }),
  },
});

describe('CreateTenancyAgreement Component', () => {
  it('renders create tenancy agreement component', () => {
    render(
      <Provider store={mockStore}>
        <CreateTenancyAgreement />
      </Provider>
    );
    expect(screen.getByText('Create Tenancy Agreement') || screen.getByRole('button')).toBeDefined();
  });
});
