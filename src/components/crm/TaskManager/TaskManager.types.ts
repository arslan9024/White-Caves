/**
 * TaskManager.types.ts
 * 7-Category Architecture: Config & Types Layer
 * 200+ Statutory & Operational Tasks Catalog and Reporting Escalation Contracts
 */

export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STANDARD';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'BLOCKED';

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
