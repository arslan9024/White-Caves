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
    title: '🔱 AEGIS Sovereign AI Command Grid (1-12-108 Protocol)',
    subtitle: 'Autonomous multi-agent neural grid: 1 Managing Director / AI Zoe + 12 Department Managers + 108 Operational Supervisors (121 AI Agents Total).',
    badge: '1-12-108 Protocol · 121 Agents Active',
  },
  stats: {
    activeAgentsLabel: 'Operational Supervisors',
    systemHealthLabel: 'System Neural Health',
    tasksExecutedLabel: 'Tasks Executed Today',
    slaAdherenceLabel: '15-Min SLA Adherence',
  },
  filters: {
    allDepartments: 'All 12 Departments',
    searchPlaceholder: 'Search 108 supervisors by name, department, or assigned task (e.g. Ejari, goAML, Form 12, VAT)...',
    viewGrid: 'Grid View',
    viewList: 'List View',
  },
  agentCard: {
    slaResponseLabel: 'SLA Response Time',
    accuracyRateLabel: 'Accuracy Rate',
    tasksTodayLabel: 'Completed Today',
    openCockpitButton: 'Launch Supervisor Cockpit',
    viewCapabilitiesButton: 'Inspect Tasks',
  },
};

export const EXECUTIVE_DATA = EXECUTIVE_COMMAND_1;
export const DEPARTMENTS_DATA = CORPORATE_DEPARTMENTS_12;
export const ASSISTANTS_DATA = SUPERVISORS_108;
export const HIERARCHY_COUNTS = CANONICAL_COUNTS;
