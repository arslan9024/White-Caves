import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import { AICommandCenter } from './AICommandCenter';

describe('AICommandCenter View Component (1-12-108 Protocol)', () => {
  it('renders root container, Managing Director, and AI Zoe', () => {
    render(
      <Provider store={store}>
        <AICommandCenter />
      </Provider>
    );
    expect(screen.getByTestId('ai-command-center-root')).toBeDefined();
    expect(screen.getByText(/ARSLAN MALIK BASHIR AHMAD/i)).toBeDefined();
    expect(screen.getAllByText(/AI Zoe/i).length).toBeGreaterThan(0);
  });

  it('renders stats grid and 108 supervisors department pills', () => {
    render(
      <Provider store={store}>
        <AICommandCenter />
      </Provider>
    );
    expect(screen.getAllByText(/Operational Supervisors/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId('dept-pill-all')).toBeDefined();
  });
});
