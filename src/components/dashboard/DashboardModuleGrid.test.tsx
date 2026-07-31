import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardModuleGrid from './DashboardModuleGrid';

const modulesByZone: Array<[string, Array<{ id: string; label: string; icon: string; zone: string }>]> = [
  [
    'sales',
    [
      { id: 'leads', label: 'Lead Management', icon: '📋', zone: 'sales' },
      { id: 'pipeline', label: 'Sales Pipeline', icon: '📊', zone: 'sales' },
    ],
  ],
  [
    'leasing',
    [
      { id: 'tenancy', label: 'Tenancy Contracts', icon: '📝', zone: 'leasing' },
    ],
  ],
];

const zoneLabels: Record<string, string> = {
  sales: 'Sales Operations',
  leasing: 'Leasing & Tenancy',
};

describe('DashboardModuleGrid', () => {
  it('renders zone headings from zoneLabels map', () => {
    render(
      <DashboardModuleGrid
        modulesByZone={modulesByZone}
        zoneLabels={zoneLabels}
        onOpenModule={vi.fn()}
      />
    );
    expect(screen.getAllByText('Sales Operations').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Leasing & Tenancy').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all module cards across zones', () => {
    render(
      <DashboardModuleGrid
        modulesByZone={modulesByZone}
        zoneLabels={zoneLabels}
        onOpenModule={vi.fn()}
      />
    );
    expect(screen.getByText('Lead Management')).toBeInTheDocument();
    expect(screen.getByText('Sales Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Tenancy Contracts')).toBeInTheDocument();
  });

  it('calls onOpenModule with module id when card is clicked', () => {
    const onOpen = vi.fn();
    render(
      <DashboardModuleGrid
        modulesByZone={modulesByZone}
        zoneLabels={zoneLabels}
        onOpenModule={onOpen}
      />
    );
    fireEvent.click(screen.getByText('Lead Management'));
    expect(onOpen).toHaveBeenCalledWith('leads');
  });

  it('renders nothing when modulesByZone is empty', () => {
    const { container } = render(
      <DashboardModuleGrid modulesByZone={[]} zoneLabels={zoneLabels} onOpenModule={vi.fn()} />
    );
    expect(container.querySelector('.dashboard-module-grid')).toBeNull();
  });

  it('falls back to zone key when zoneLabels has no entry', () => {
    const sparse: Array<[string, Array<{ id: string; label: string; icon: string; zone: string }>]> = [
      ['unknown-zone', [{ id: 'x', label: 'Module X', icon: '❓', zone: 'unknown-zone' }]],
    ];
    render(
      <DashboardModuleGrid modulesByZone={sparse} zoneLabels={{}} onOpenModule={vi.fn()} />
    );
    expect(screen.getAllByText('unknown-zone').length).toBeGreaterThanOrEqual(1);
  });
});
