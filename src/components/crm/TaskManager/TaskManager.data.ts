/**
 * TaskManager.data.ts
 * 7-Category Architecture: Data Layer
 * Master Catalog of 200 Tasks with Escalation Chains
 */

import type { TaskNode } from './TaskManager.types';
import { getRawTaskDefinitions, buildTaskFromDef } from './TaskManager.tasks.data';
import { RAW_TASKS_PART2 } from './TaskManager.tasks2.data';

export const TASK_PILLARS = [
  { id: 'all', name: 'All Pillars' },
  { id: 'executive', name: 'Executive & Governance' },
  { id: 'pillar-1', name: 'Pillar I: Legal & Regulatory' },
  { id: 'pillar-2', name: 'Pillar II: Finance & Accounting' },
  { id: 'pillar-3', name: 'Pillar III: Human Capital' },
  { id: 'pillar-4', name: 'Pillar IV: Sales Operations' },
  { id: 'pillar-5', name: 'Pillar V: Marketing & Growth' },
  { id: 'pillar-6', name: 'Pillar VI: Technology & CRM' },
  { id: 'pillar-7', name: 'Pillar VII: Operations & PMS' },
];

export const TASK_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'REGULATORY', name: 'Regulatory & Compliance' },
  { id: 'FINANCE', name: 'Finance & Tax' },
  { id: 'HR', name: 'HR & Licensing' },
  { id: 'SALES', name: 'Sales & Brokerage' },
  { id: 'MARKETING', name: 'Marketing & Media' },
  { id: 'TECH', name: 'Technology & AI' },
  { id: 'OPERATIONS', name: 'Property Mgmt & Ops' },
];

export function buildCanonical200Tasks(): TaskNode[] {
  const part1 = getRawTaskDefinitions();
  const part2 = RAW_TASKS_PART2;

  const tasks1: TaskNode[] = part1.map((row, idx) => buildTaskFromDef(row, idx));
  const tasks2: TaskNode[] = part2.map((row, idx) => buildTaskFromDef(row, idx + 100));

  return [...tasks1, ...tasks2];
}
