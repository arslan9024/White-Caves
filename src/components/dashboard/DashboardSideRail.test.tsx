import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import DashboardSideRail from './DashboardSideRail';
import type { RoleTab } from '../../config/ROLE_TAB_MAPPING';

const baseTabs: RoleTab[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'properties', label: 'Properties', icon: '🏙️' },
  { id: 'ai-command', label: 'AI Command', icon: '🤖' },
];

describe('DashboardSideRail — MD workspace split', () => {
  it('renders exactly two top-level workspaces for managing director role', () => {
    render(
      <DashboardSideRail
        availableTabs={baseTabs}
        activeTab="overview"
        selectedCRMModule={null}
        currentRole="managing_director"
        isSuperUser={false}
        modulesExpanded={false}
        moduleEntries={[]}
        tabButtonRefs={{ current: [] }}
        onSelectTab={vi.fn()}
        onTabKeyDown={vi.fn()}
        onToggleModules={vi.fn()}
        onSelectModule={vi.fn()}
      />
    );

    const workspaceNav = screen.getByRole('navigation', { name: /Workspace navigation/i });
    const buttons = within(workspaceNav).getAllByRole('button');

    expect(buttons).toHaveLength(2);
    expect(
      within(workspaceNav).getByRole('button', { name: /Company Structure & Business Process/i })
    ).toBeInTheDocument();
    expect(
      within(workspaceNav).getByRole('button', { name: /AI Command Center/i })
    ).toBeInTheDocument();
  });

  it('maps AI workspace selection to canonical ai-command tab route', () => {
    const onSelectTab = vi.fn();

    render(
      <DashboardSideRail
        availableTabs={baseTabs}
        activeTab="overview"
        selectedCRMModule={null}
        currentRole="managing_director"
        isSuperUser={false}
        modulesExpanded={false}
        moduleEntries={[]}
        tabButtonRefs={{ current: [] }}
        onSelectTab={onSelectTab}
        onTabKeyDown={vi.fn()}
        onToggleModules={vi.fn()}
        onSelectModule={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /AI Command Center/i }));
    expect(onSelectTab).toHaveBeenCalledWith('ai-command');
  });
});
