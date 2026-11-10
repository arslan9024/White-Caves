// FILE: src/components/crm/TaskManager/TaskManager.types.ts
/**
 * White Caves Real Estate LLC - Task Management Types
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Types - Tier 5)
 * Single Purpose File Law: < 350 lines
 */

export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STANDARD';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'BLOCKED';

export interface EntityRolePair {
  entityId: string; // e.g. "DEPT-01"
  entityName?: string; // e.g. "Executive & Architecture"
  roleId: string; // e.g. "DIR-01"
  roleTitle?: string; // e.g. "Department Director"
}

export interface SecondaryActorDef {
  name: string; // e.g. "Dubai Land Department (DLD) REST API"
  role: string; // e.g. "Title Deed & Ejari Attestation"
}

export interface TaskHierarchyLineage {
  deptId: string; // e.g. "DEPT-01" to "DEPT-12"
  deptName?: string;
  directorId: string; // e.g. "DIR-01" to "DIR-12"
  directorName?: string;
  subDeptId: string; // e.g. "SUB-01" to "SUB-09"
  subDeptName?: string;
  managerId: string; // e.g. "MGR-01" to "MGR-09"
  managerName?: string;
  squadId: string; // e.g. "SQD-01" to "SQD-12"
  squadName?: string;
  supervisorId: string; // e.g. "SUP-01" to "SUP-12"
  supervisorName?: string;
  teamId?: string; // e.g. "TEAM-01"
  teamName?: string;
  operatorRoleId?: string; // e.g. "ROLE-OPERATOR"
  isUnassignedPool?: boolean;
}

export interface RUPUseCaseDossier {
  useCaseId: string; // e.g. "UC-TSK-001"
  primaryActor: string; // Required Governing Role (e.g. "L3 Tenancy Supervisor")
  executingUser?: string; // Default: Managing Director Arslan Malik Bashir Ahmad (EMP-001) [Sovereign Clearance]
  secondaryActors?: Array<string | SecondaryActorDef>;
  preconditions: string[];
  trigger: string;
  mainSuccessScenario: {
    input: string;
    processing: string;
    output: string;
    persistence: string;
  };
  postconditions: string[];
  statutoryMandate?: string;
}

export interface TaskReportingChain {
  supervisorName: string; // L3: Execution Lead
  supervisorCode: string;
  managerName: string; // L2: Tactical Lead
  managerCode: string;
  directorName: string; // L1: Strategic Pillar Director
  directorCode: string;
  executiveReviewer: string; // L0: Managing Director / Board
}

export interface TaskNode {
  _id: string;
  id?: string;
  taskCode: string; // e.g. TSK-001 to TSK-200
  title: string;
  pillarId: string; // e.g. 'pillar-1' to 'pillar-7', 'executive'
  pillarName: string;
  category: 'REGULATORY' | 'FINANCE' | 'HR' | 'SALES' | 'MARKETING' | 'TECH' | 'OPERATIONS';
  statutoryAuthority?: string; // DLD, RERA, FTA, DET, GDRFA, etc.
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  defaultSla: string;
  reportingChain: TaskReportingChain;
  actor: string; // Designated executor / agent / system actor
  action: string; // Specific operational or statutory action executed
  results: string; // Measurable outcome, verified artifact, or state change
  actionVerb?: string; // e.g. 'VERIFY_RERA_CARD', 'EXECUTE_FORM_A', 'FILE_EJARI', 'AUDIT_VAT' (TURING-SEPARATION-010)
  sourceActorId?: string; // ERMS Actor Entity Foreign Key (e.g. 'user-001', 'emp-003', 'broker-001')
  targetObjectId?: string; // ERMS Object Entity Foreign Key (e.g. 'prop-001', 'contract-001', 'permit-001')
  departmentCode?: string; // DMS Canonical Department Foreign Key ('DEPT-01' to 'DEPT-12')
  lineage?: TaskHierarchyLineage; // Bhakti 5-Tier Lineage tags
  useCase?: RUPUseCaseDossier; // RUP Specification
  dueDate?: string;
  createdAt: string;
  completionRate?: number;
}

export interface TaskFilterState {
  searchQuery: string;
  selectedPillar: string;
  selectedPriority: string;
  selectedStatus: string;
  viewMode: 'list' | 'board';
}

export type TaskCrudAction =
  | { type: 'CREATE_TASK'; payload: Omit<TaskNode, '_id' | 'taskCode'> }
  | { type: 'UPDATE_TASK'; id: string; payload: Partial<TaskNode> }
  | { type: 'ADVANCE_STATUS'; id: string; newStatus: TaskStatus }
  | { type: 'REASSIGN_CHAIN'; id: string; reportingChain: TaskReportingChain };
