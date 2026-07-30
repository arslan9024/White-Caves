import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import APIPerformanceTab from '../APIPerformanceTab';

describe('APIPerformanceTab Component', () => {
  it('renders APIPerformanceTab without crashing', () => {
    const mockComponents = [
      { id: '1', name: 'Core API', type: 'api', status: 'healthy', version: 'v1.0', metrics: { cpu: 12, memory: 45, responseTime: 120, uptime: 99.9 } },
    ];

    const { container } = render(<APIPerformanceTab systemComponents={mockComponents} />);
    expect(container).toBeDefined();
    expect(screen.getByText('API Performance Monitoring')).toBeDefined();
  });
});
