import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConstructionProgressStream } from './ConstructionProgressStream';

describe('ConstructionProgressStream Component', () => {
  it('renders live construction telemetry and drone stream milestones', () => {
    render(<ConstructionProgressStream />);
    expect(screen.getByTestId('construction-progress-stream')).toBeDefined();
    expect(screen.getByText(/Live Construction Telemetry & 4K Drone Stream/i)).toBeDefined();
    expect(screen.getByText(/DLD AUDIT VERIFIED/i)).toBeDefined();
    expect(screen.getByText(/4K Drone Aerial Site Fly-Over Stream/i)).toBeDefined();
    expect(screen.getByText(/82\.4%/i)).toBeDefined();
    expect(screen.getByText(/Facade Installation/i)).toBeDefined();
    expect(screen.getByText(/MEP & Interiors/i)).toBeDefined();
  });
});
