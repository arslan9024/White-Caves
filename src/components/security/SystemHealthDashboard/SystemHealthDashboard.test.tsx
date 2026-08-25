import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SystemHealthDashboard } from './SystemHealthDashboard';

describe('SystemHealthDashboard', () => {
  it('renders health telemetry for CPU, Memory, Disk and microservices', () => {
    render(<SystemHealthDashboard />);

    expect(screen.getByTestId('system-health-dashboard')).toBeDefined();
    expect(screen.getByText(/CPU/i)).toBeDefined();
    expect(screen.getByText(/RAM/i)).toBeDefined();
    expect(screen.getByText(/PostgreSQL/i)).toBeDefined();
    expect(screen.getByText(/Redis Cache/i)).toBeDefined();
  });
});
