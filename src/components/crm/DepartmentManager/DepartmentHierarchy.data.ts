/**
 * DepartmentHierarchy.data.ts
 * 7-Category Architecture: Data Layer
 * 3-Tier Seed Structures & Conversion Utilities
 */

import {
  CORPORATE_DEPARTMENTS_12,
  type SupervisorDef,
} from '../../../data/assistants108Registry.data';
import { CANONICAL_108_DIVISIONS } from '../../../data/canonicalDivisions.data';
import type {
  DepartmentDirectorNode,
  DivisionManagerNode,
  SupervisorTeamNode,
} from './DepartmentHierarchy.types';
import { RESEARCHED_ORGANIZATION_POOL } from './DepartmentResearchedPool.data';

export const CANONICAL_DIRECTORS_12: DepartmentDirectorNode[] = CORPORATE_DEPARTMENTS_12.map(
  (dept, idx) => ({
    _id: `dir-${dept.id}`,
    slotNumber: idx + 1,
    fixedCode: `DEPT-${String(idx + 1).padStart(2, '0')}`,
    title: dept.name,
    slug: dept.id,
    directorName: dept.managerAi.name,
    directorRole: dept.managerAi.title,
    color: dept.color,
    icon: dept.icon,
    description: dept.description,
    headcount: 24,
  })
);

export function buildCanonical9ManagersForDept(deptSlugOrId: string): DivisionManagerNode[] {
  const matchedDirector = CANONICAL_DIRECTORS_12.find(
    d => d.slug === deptSlugOrId || d._id === deptSlugOrId || d.fixedCode === deptSlugOrId
  );
  const deptCode = matchedDirector ? matchedDirector.fixedCode : 'DEPT-01';
  const divisions = CANONICAL_108_DIVISIONS.filter(div => div.deptCode === deptCode);

  if (divisions.length > 0) {
    return divisions.map(div => ({
      _id: `mgr-${deptSlugOrId}-${div.slot}`,
      parentDeptId: deptSlugOrId,
      slotNumber: div.slot,
      fixedCode: `MGR-${String(div.slot).padStart(2, '0')}`,
      title: div.title,
      managerName: div.aiManager,
      managerRole: `${div.humanRole} (Vacant Requisition)`,
      slaResponseTime: '< 15 mins',
      status: 'optimal' as const,
      description: `Commands ${div.title} (${div.code}) under ${deptCode}. Authorized headcount: 12 Desks.`,
      teamCount: 12,
      headcount: 12,
    }));
  }

  // Fallback if custom unassigned department
  return Array.from({ length: 9 }, (_, idx) => ({
    _id: `mgr-${deptSlugOrId}-${idx + 1}`,
    parentDeptId: deptSlugOrId,
    slotNumber: idx + 1,
    fixedCode: `MGR-${String(idx + 1).padStart(2, '0')}`,
    title: `Operational Division #${idx + 1}`,
    managerName: `AI Manager ${idx + 1}`,
    managerRole: `Operational Division Lead #${idx + 1} (Vacant)`,
    slaResponseTime: '< 15 mins',
    status: 'optimal' as const,
    description: `Commands task group #${idx + 1} for ${deptSlugOrId}. Enforces 1-12-108 Protocol SLA compliance.`,
    teamCount: 12,
    headcount: 12,
  }));
}

export function buildTeamsForManager(deptId: string, managerId: string): SupervisorTeamNode[] {
  return [
    {
      _id: `team-${managerId}-alpha`,
      parentDeptId: deptId,
      parentManagerId: managerId,
      teamCode: 'TEAM-01',
      supervisorCode: 'SUP-01',
      teamName: 'Alpha Operational Unit',
      supervisorName: 'Supervisor Alpha',
      supervisorRole: 'Lead Operational Supervisor',
      specialty: 'High-Velocity Execution & Verification',
      capabilities: ['Statutory Verification', 'Escrow Check', 'SLA Watch'],
      headcount: 2,
      status: 'optimal',
      slaResponseTime: '< 15 mins',
      metrics: { accuracyRate: 99.8, tasksCompletedToday: 14 },
    },
    {
      _id: `team-${managerId}-bravo`,
      parentDeptId: deptId,
      parentManagerId: managerId,
      teamCode: 'TEAM-02',
      supervisorCode: 'SUP-02',
      teamName: 'Bravo Operational Unit',
      supervisorName: 'Supervisor Bravo',
      supervisorRole: 'Secondary Operational Supervisor',
      specialty: 'Telemetry & Dispute Resolution',
      capabilities: ['Audit Trail Logging', 'NOC Processing'],
      headcount: 2,
      status: 'active',
      slaResponseTime: '< 15 mins',
      metrics: { accuracyRate: 99.7, tasksCompletedToday: 11 },
    },
  ];
}

export function demoteDirectorToPool(dir: DepartmentDirectorNode): SupervisorDef {
  return {
    id: `pool-demoted-${dir._id}-${Date.now()}`,
    name: dir.directorName,
    code: `SUB-${dir.fixedCode.replace(/^DEPT-/, '')}`,
    title: `${dir.title} Former Director Unit`,
    departmentId: 'unassigned-pool',
    departmentName: 'Unassigned Operational Pool',
    supervisorIndex: 0,
    icon: dir.icon || 'Briefcase',
    color: dir.color || '#64748B',
    avatar: '',
    status: 'standby',
    description:
      dir.description ||
      'Preserved departmental director unit demoted into operational reserve pool.',
    specialty: dir.title,
    assignedTasks: ['Preserved Director Mandate', 'Available for Re-Appointment'],
    capabilities: ['Autonomous Leadership', 'Governance Oversight'],
    slaResponseTime: '< 15 mins',
    metrics: { accuracyRate: 99.8, tasksCompletedToday: 0, systemHealth: 'optimal' },
  };
}

export function demoteManagerToPool(mgr: DivisionManagerNode): SupervisorDef {
  return {
    id: `pool-demoted-${mgr._id}-${Date.now()}`,
    name: mgr.managerName,
    code: `MGR-RES-${mgr.fixedCode.replace(/^MGR-/, '')}`,
    title: `${mgr.title} Division Manager`,
    departmentId: 'unassigned-pool',
    departmentName: 'Unassigned Operational Pool',
    supervisorIndex: 0,
    icon: 'Layers',
    color: '#3B82F6',
    avatar: '',
    status: 'standby',
    description: mgr.description,
    specialty: mgr.title,
    assignedTasks: ['Tactical Division Scope', 'Available for Manager Slot'],
    capabilities: ['Process Automation', 'SLA Response Engine'],
    slaResponseTime: mgr.slaResponseTime,
    metrics: { accuracyRate: 99.7, tasksCompletedToday: 0, systemHealth: 'optimal' },
  };
}

export function demoteTeamToPool(team: SupervisorTeamNode): SupervisorDef {
  return {
    id: `pool-demoted-${team._id}-${Date.now()}`,
    name: team.supervisorName,
    code: `SUP-RES-${team.supervisorCode.replace(/^SUP-/, '')}`,
    title: `${team.teamName} Supervisor`,
    departmentId: 'unassigned-pool',
    departmentName: 'Unassigned Operational Pool',
    supervisorIndex: 0,
    icon: 'Shield',
    color: '#10B981',
    avatar: '',
    status: 'standby',
    description: `Preserved operational team: ${team.teamName}`,
    specialty: team.specialty,
    assignedTasks: team.capabilities,
    capabilities: team.capabilities,
    slaResponseTime: team.slaResponseTime,
    metrics: {
      accuracyRate: team.metrics?.accuracyRate || 99.5,
      tasksCompletedToday: 0,
      systemHealth: 'optimal',
    },
  };
}

export function getInitialHierarchyPool(): SupervisorDef[] {
  return [...RESEARCHED_ORGANIZATION_POOL];
}

export function buildInitialHierarchyState(): import('./DepartmentHierarchy.types').Hierarchy3TierState {
  const directors = [...CANONICAL_DIRECTORS_12];
  const managersByDeptId: Record<string, DivisionManagerNode[]> = {};
  const teamsByManagerId: Record<string, SupervisorTeamNode[]> = {};

  directors.forEach(dept => {
    const managers = buildCanonical9ManagersForDept(dept.slug);
    managersByDeptId[dept.slug] = managers;
    managers.forEach(mgr => {
      teamsByManagerId[mgr._id] = buildTeamsForManager(dept.slug, mgr._id);
    });
  });

  return {
    directors,
    managersByDeptId,
    teamsByManagerId,
    unassignedPool: getInitialHierarchyPool(),
  };
}
