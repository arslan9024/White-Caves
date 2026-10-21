import { describe, it, expect } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

  it('renders configured hierarchy counts and structural validation', () => {
    render(
      <Provider store={store}>
        <AICommandCenter />
      </Provider>
    );
    expect(screen.getByText('Configured supervisor slots')).toBeDefined();
    expect(screen.getByText('108 / 108')).toBeDefined();
    expect(screen.getByTestId('framework-integrity-status').textContent).toContain('COMPLIANT');
    expect(screen.getByText(/Open allocations in registry: 0/i)).toBeDefined();
    expect(screen.getByTestId('dept-pill-all')).toBeDefined();
  });

  it('labels sample staffing entries as mock data', () => {
    render(
      <Provider store={store}>
        <AICommandCenter />
      </Provider>
    );

    fireEvent.click(screen.getByText('Mock open-slot staffing examples'));
    expect(screen.getByText(/Fictional demo data only/i)).toBeDefined();
    expect(screen.getByText('Amina Example')).toBeDefined();
    expect(screen.getByText(/Active \(mock\) · fictional preview/)).toBeDefined();
  });
});
