import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import KPIViewContainer from './KPIViewContainer';

describe('KPIViewContainer Component', () => {
  it('renders all 4 dashboard KPI cards within Redux Provider', () => {
    render(
      <Provider store={store}>
        <KPIViewContainer />
      </Provider>
    );

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Critical Alerts')).toBeInTheDocument();
    expect(screen.getByText('Available Listings')).toBeInTheDocument();
  });
});
