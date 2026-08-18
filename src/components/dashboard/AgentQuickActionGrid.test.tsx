import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardModuleGrid from './DashboardModuleGrid';

describe('AgentQuickActionGrid (DashboardModuleGrid)', () => {
  it('renders correctly with required props', () => {
    const modulesByZone: Array<[string, Array<{ id: string; label: string; icon: string; zone: string }>]> = [
      ['sales', [{ id: 'leads', label: 'Lead Management', icon: '📋', zone: 'sales' }]],
    ];
    const zoneLabels: Record<string, string> = { sales: 'Sales Operations' };

    render(
      <DashboardModuleGrid
        modulesByZone={modulesByZone}
        zoneLabels={zoneLabels}
        onOpenModule={vi.fn()}
      />
    );

    expect(screen.getAllByText('Sales Operations').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Lead Management')).toBeDefined();
  });
});
