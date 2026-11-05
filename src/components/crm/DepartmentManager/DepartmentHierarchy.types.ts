/**
 * DepartmentHierarchy.types.ts
 * 7-Category Architecture: Config & Types Layer
 * 3-Tier Bhakti Protocol: 12 Directors -> 9 Managers -> Teams & Supervisors
 */

import type { SupervisorDef } from '../../../data/assistants108Registry.data';

export type HierarchyTier = 'DIRECTOR' | 'MANAGER' | 'SUPERVISOR';

export interface DepartmentDirectorNode {
  _id: string;
  slotNumber: number; // 1 to 12
  fixedCode: string; // DEPT-01 to DEPT-12
  title: string;
  slug: string;
  directorName: string;
  directorRole: string;
  color: string;
  icon: string;
  description: string;
  headcount: number;
}

export interface DivisionManagerNode {
  _id: string;
  parentDeptId: string;
  slotNumber: number; // 1 to 9
  fixedCode: string; // MGR-01 to MGR-09
  title: string; // The primary task domain mandate
  managerName: string;
  managerRole: string;
  slaResponseTime: string;
  status: 'active' | 'optimal' | 'standby';
  description: string;
  teamCount: number;
  headcount: number;
}

export interface SupervisorTeamNode {
  _id: string;
  parentDeptId: string;
  parentManagerId: string;
  teamCode: string; // e.g. TEAM-01
  supervisorCode: string; // e.g. SUP-01
  teamName: string;
  supervisorName: string;
  supervisorRole: string;
  specialty: string;
  capabilities: string[];
  headcount: number;
  status: 'optimal' | 'active' | 'standby';
  slaResponseTime: string;
  metrics?: {
    accuracyRate: number;
    tasksCompletedToday: number;
  };
}

export interface Hierarchy3TierState {
  directors: DepartmentDirectorNode[];
  managersByDeptId: Record<string, DivisionManagerNode[]>;
  teamsByManagerId: Record<string, SupervisorTeamNode[]>;
  unassignedPool: SupervisorDef[];
}

export type HierarchyCrudAction =
  | { type: 'CREATE_DIRECTOR'; payload: Partial<DepartmentDirectorNode>; targetSlot: number }
  | { type: 'UPDATE_DIRECTOR'; id: string; payload: Partial<DepartmentDirectorNode> }
  | { type: 'DEMOTE_DIRECTOR'; id: string }
  | {
      type: 'CREATE_MANAGER';
      deptId: string;
      payload: Partial<DivisionManagerNode>;
      targetSlot: number;
    }
  | { type: 'UPDATE_MANAGER'; id: string; payload: Partial<DivisionManagerNode> }
  | { type: 'DEMOTE_MANAGER'; id: string }
  | { type: 'CREATE_TEAM'; managerId: string; deptId: string; payload: Partial<SupervisorTeamNode> }
  | { type: 'UPDATE_TEAM'; id: string; payload: Partial<SupervisorTeamNode> }
  | { type: 'DEMOTE_TEAM'; id: string }
  | { type: 'REASSIGN_TEAM'; teamId: string; newManagerId: string };
