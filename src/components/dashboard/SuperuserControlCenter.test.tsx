import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SuperuserControlCenter from './SuperuserControlCenter';

const createProps = () => ({
  hotLeadsCount: 7,
  superuserModuleCount: 12,
  monthlyRevenueLabel: 'AED 120,000',
  profileCompletionPercent: 80,
  propertiesCount: 45,
  agentsCount: 14,
  leadsCount: 33,
  contractsCount: 9,
  onRefreshData: vi.fn(),
  onOpenCommandPalette: vi.fn(),
  onOpenAdminWorkspace: vi.fn(),
  onOpenAnalyticsWorkspace: vi.fn(),
  onOpenUsersWorkspace: vi.fn(),
  onLaunchUnifiedCRM: vi.fn(),
  onOpenPropertiesWorkspace: vi.fn(),
  onOpenLeadsWorkspace: vi.fn(),
  onOpenAgentsWorkspace: vi.fn(),
  onOpenContractsWorkspace: vi.fn(),
  onOpenFinanceWorkspace: vi.fn(),
  onOpenComplianceWorkspace: vi.fn(),
  onLaunchAIModules: vi.fn(),
});

describe('SuperuserControlCenter', () => {
  it('renders executive persona hierarchy and discoverability actions', () => {
    const props = createProps();
    render(<SuperuserControlCenter {...props} persona="executive" />);

    expect(screen.getByLabelText('Executive controls')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Executive command center/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Command palette/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open properties/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open leads/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open analytics/i })).toBeInTheDocument();
  });

  it('triggers primary discoverability actions', () => {
    const props = createProps();
    render(<SuperuserControlCenter {...props} persona="executive" />);

    fireEvent.click(screen.getByRole('button', { name: /Open leads/i }));
    fireEvent.click(screen.getByRole('button', { name: /Open finance/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Refresh$/i }));

    expect(props.onOpenLeadsWorkspace).toHaveBeenCalledTimes(1);
    expect(props.onOpenFinanceWorkspace).toHaveBeenCalledTimes(1);
    expect(props.onRefreshData).toHaveBeenCalledTimes(1);
  });
});
