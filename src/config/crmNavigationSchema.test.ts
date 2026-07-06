import { describe, expect, it } from 'vitest';
import {
  MD_WORKSPACE_KPI_BOUNDARIES,
  MD_TOP_LEVEL_WORKSPACES,
  getMDModuleOwnershipMap,
  getWorkspaceForMDTab,
  getWorkspaceForMDModule,
} from './crmNavigationSchema';

describe('crmNavigationSchema — MD workspace split', () => {
  it('defines exactly two top-level MD workspaces', () => {
    expect(MD_TOP_LEVEL_WORKSPACES).toHaveLength(2);
    expect(MD_TOP_LEVEL_WORKSPACES.map(workspace => workspace.id)).toEqual([
      'md-company-workspace',
      'md-ai-command-center',
    ]);
  });

  it('maps AI zone modules to AI command center workspace', () => {
    expect(getWorkspaceForMDModule('nadia')).toBe('md-ai-command-center');
    expect(getWorkspaceForMDModule('nina')).toBe('md-ai-command-center');
  });

  it('maps non-AI modules to company structure workspace', () => {
    expect(getWorkspaceForMDModule('unified')).toBe('md-company-workspace');
    expect(getWorkspaceForMDModule('theodora')).toBe('md-company-workspace');
  });

  it('produces unique ownership mapping for every module', () => {
    const moduleEntries: Array<[string, { label: string }]> = [
      ['unified', { label: 'Unified CRM Dashboard' }],
      ['nadia', { label: 'WhatsApp CRM' }],
      ['theodora', { label: 'Finance CRM' }],
      ['nina', { label: 'WhatsApp Bot CRM' }],
      ['zoe', { label: 'Executive CRM' }],
    ];

    const ownership = getMDModuleOwnershipMap(moduleEntries);
    expect(ownership).toHaveLength(moduleEntries.length);

    const uniqueModuleIds = new Set(ownership.map(item => item.moduleId));
    expect(uniqueModuleIds.size).toBe(moduleEntries.length);

    ownership.forEach(item => {
      expect(['md-company-workspace', 'md-ai-command-center']).toContain(item.workspaceId);
    });
  });

  it('defines KPI boundaries and drill-down ownership per workspace', () => {
    expect(MD_WORKSPACE_KPI_BOUNDARIES).toHaveLength(2);

    const companyBoundary = MD_WORKSPACE_KPI_BOUNDARIES.find(
      boundary => boundary.workspaceId === 'md-company-workspace'
    );
    const aiBoundary = MD_WORKSPACE_KPI_BOUNDARIES.find(
      boundary => boundary.workspaceId === 'md-ai-command-center'
    );

    expect(companyBoundary?.aiCommandSurface).toBe(false);
    expect(companyBoundary?.drillDownTabs).toContain('overview');
    expect(companyBoundary?.drillDownTabs).toContain('analytics');

    expect(aiBoundary?.aiCommandSurface).toBe(true);
    expect(aiBoundary?.drillDownTabs).toEqual(expect.arrayContaining(['ai-command', 'ai-hub']));
  });

  it('keeps AI command tabs centralized to AI workspace', () => {
    expect(getWorkspaceForMDTab('ai-command')).toBe('md-ai-command-center');
    expect(getWorkspaceForMDTab('ai-hub')).toBe('md-ai-command-center');
    expect(getWorkspaceForMDTab('overview')).toBe('md-company-workspace');
    expect(getWorkspaceForMDTab('properties')).toBe('md-company-workspace');
  });
});
