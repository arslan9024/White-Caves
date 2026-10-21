/**
 * AICommandCenter.data.ts — Content & Data Variables (1-12-108 Hierarchy Protocol)
 * Separated for 100% multi-language translation and zero-logic isolation.
 */

import {
  CORPORATE_DEPARTMENTS_12,
  SUPERVISORS_108,
  EXECUTIVE_COMMAND_1,
  CANONICAL_COUNTS,
} from '../../../../data/assistants108Registry.data';

export const COMMAND_CENTER_TEXT = {
  header: {
    title: 'White Caves AI Command Center',
    subtitle:
      'Configured 1-12-108 assistant directory. The structural audit checks the local registry, not live agent activity or staffing.',
    badge: 'Registry audit · not live telemetry',
  },
  stats: {
    departmentsLabel: 'Configured departments',
    supervisorsLabel: 'Configured supervisor slots',
    openSlotsLabel: 'Open allocations',
    integrityLabel: 'Structure check',
  },
  filters: {
    allDepartments: 'All 12 Departments',
    searchPlaceholder: 'Search configured profiles by name, department, or responsibility...',
    viewGrid: 'Grid View',
    viewList: 'List View',
  },
  agentCard: {
    openCockpitButton: 'Select profile',
    viewCapabilitiesButton: 'Inspect Tasks',
  },
  audit: {
    title: '1-12-108 structure audit',
    description:
      'This verifies the configured hierarchy only. It does not confirm live agent health, employee assignments, or active vacancies.',
    success: 'Registry matches the required 1 executive, 12 departments, and 108 supervisor slots.',
    mockAssignmentsTitle: 'Mock open-slot staffing examples',
    mockAssignmentsDescription:
      'Fictional demo data only — these are not employee records and do not indicate current vacancies.',
  },
};

export const EXECUTIVE_DATA = EXECUTIVE_COMMAND_1;
export const DEPARTMENTS_DATA = CORPORATE_DEPARTMENTS_12;
export const ASSISTANTS_DATA = SUPERVISORS_108;
export const HIERARCHY_COUNTS = CANONICAL_COUNTS;

export interface MockStaffingAssignment {
  slotId: string;
  departmentCode: string;
  departmentName: string;
  employeeName: string;
  roleTitle: string;
  slotStatus: 'Open (mock preview)';
  assignmentStatus: 'Active (mock)';
  isMock: true;
}

export const MOCK_STAFFING_ASSIGNMENTS: MockStaffingAssignment[] = [
  {
    slotId: 'MOCK-DEPT-01-SUP-09',
    departmentCode: 'DEPT-01',
    departmentName: 'Luxury Sales & Brokerage',
    employeeName: 'Amina Example',
    roleTitle: 'Supervisor — sample allocation',
    slotStatus: 'Open (mock preview)',
    assignmentStatus: 'Active (mock)',
    isMock: true,
  },
  {
    slotId: 'MOCK-DEPT-02-SUP-09',
    departmentCode: 'DEPT-02',
    departmentName: 'Strategic Off-Plan Developments',
    employeeName: 'Omar Example',
    roleTitle: 'Supervisor — sample allocation',
    slotStatus: 'Open (mock preview)',
    assignmentStatus: 'Active (mock)',
    isMock: true,
  },
  {
    slotId: 'MOCK-DEPT-04-SUP-09',
    departmentCode: 'DEPT-04',
    departmentName: 'Portfolio Management & Residential Leasing',
    employeeName: 'Sara Example',
    roleTitle: 'Supervisor — sample allocation',
    slotStatus: 'Open (mock preview)',
    assignmentStatus: 'Active (mock)',
    isMock: true,
  },
];
