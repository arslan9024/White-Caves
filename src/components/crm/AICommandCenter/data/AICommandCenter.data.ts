/**
 * AICommandCenter.data.ts — Content & Data Variables
 * Separated for 100% multi-language translation and zero-logic isolation.
 */

import { CORPORATE_DEPARTMENTS_12, MASTER_35_AI_ASSISTANTS } from '../../../../data/assistants35Registry.data';

export const COMMAND_CENTER_TEXT = {
  header: {
    title: '🔱 AEGIS 2.0 AI Command Center',
    subtitle: 'Autonomous multi-agent neural grid commanding 35 specialized enterprise AI assistants across 12 corporate departments.',
    badge: '35 Autonomous Agents Live',
  },
  stats: {
    activeAgentsLabel: 'Active AI Agents',
    systemHealthLabel: 'System Neural Health',
    tasksExecutedLabel: 'Tasks Executed Today',
    slaAdherenceLabel: '15-Min SLA Adherence',
  },
  filters: {
    allDepartments: 'All 12 Departments',
    searchPlaceholder: 'Search agents by name, role, or capability (e.g. Ejari, Lead Scoring, NOC)...',
    viewGrid: 'Grid View',
    viewList: 'List View',
  },
  agentCard: {
    slaResponseLabel: 'SLA Response Time',
    accuracyRateLabel: 'Accuracy Rate',
    tasksTodayLabel: 'Completed Today',
    openCockpitButton: 'Launch Agent Cockpit',
    viewCapabilitiesButton: 'Inspect Capabilities',
  },
};

export const DEPARTMENTS_DATA = CORPORATE_DEPARTMENTS_12;
export const ASSISTANTS_DATA = MASTER_35_AI_ASSISTANTS;
