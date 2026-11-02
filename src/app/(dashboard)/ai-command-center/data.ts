import masterWorkforceGrid from '../../../config/ai-command-center/master-workforce-grid.json';
import type { DepartmentGroup, VirtualStaffMember } from './types';

export const INITIAL_DEPARTMENTS: DepartmentGroup[] = masterWorkforceGrid.departments.map(dept => ({
  deptCode: dept.deptCode,
  deptName: dept.deptName,
  color: dept.color,
  manager: {
    id: dept.manager.id,
    name: dept.manager.name,
    gender: (dept.manager as { gender?: string }).gender || 'Female',
    title: dept.manager.title,
    role: 'MANAGER',
    status: 'ACTIVE',
    departmentCode: dept.deptCode,
    departmentName: dept.deptName,
    assignedTasks: [
      'Department Oversight & Operations',
      'Supervisors Workflow Distribution',
      'Daily Performance Audits',
    ],
    reportingTo: 'AI Zoe (COO)',
    color: dept.color,
  },
  supervisors: dept.supervisors.map(sup => ({
    id: sup.id,
    name: sup.name,
    gender: sup.gender || 'Female',
    title: sup.title,
    role: 'SUPERVISOR',
    status: 'ACTIVE',
    departmentCode: dept.deptCode,
    departmentName: dept.deptName,
    supervisorSlot: sup.slot,
    assignedTasks: sup.tasks || [],
    reportingTo: dept.manager.name,
    color: dept.color,
    slaResponseTime: '15-Minute Watchdog',
  })),
  subDepartments: [],
}));

export const EXECUTIVE_PARTNER: VirtualStaffMember = {
  id: masterWorkforceGrid.executiveAiPartner.id,
  name: masterWorkforceGrid.executiveAiPartner.name,
  gender: masterWorkforceGrid.executiveAiPartner.gender || 'Female',
  title: masterWorkforceGrid.executiveAiPartner.title || 'Chief Operations Officer (COO)',
  role: 'EXECUTIVE',
  status: 'ACTIVE',
  assignedTasks: [
    'Executive Autonomous Override',
    'Real-time Security Guard Node',
    '108 Supervisors SLA Enforcement',
  ],
  color: '#8B5CF6',
};

export const INITIAL_STANDBY_ROSTER: VirtualStaffMember[] = [
  {
    id: 'standby-01',
    name: 'Seraphina',
    gender: 'Female',
    title: 'Reserve AML & KYC Auditor',
    role: 'STANDBY',
    status: 'STANDBY',
    assignedTasks: ['Unassigned Standby Queue', 'Surge Auditing Capacity'],
    color: '#6B7280',
  },
  {
    id: 'standby-02',
    name: 'Kallista',
    gender: 'Female',
    title: 'Off-Plan Launch Reserve Specialist',
    role: 'STANDBY',
    status: 'STANDBY',
    assignedTasks: ['Unassigned Standby Queue', 'Developer Launch Surge Support'],
    color: '#6B7280',
  },
];
