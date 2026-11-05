/**
 * TaskManager.data.ts
 * 7-Category Architecture: Data Layer
 * Master Catalog of 600+ Statutory & Operational Tasks with Escalation Chains
 * Single Purpose File Law: < 350 lines
 */

import type { TaskNode } from './TaskManager.types';
import { getRawTaskDefinitions, buildTaskFromDef } from './TaskManager.tasks.data';
import { RAW_TASKS_PART2 } from './TaskManager.tasks2.data';
import { RAW_TASKS_PART3 } from './TaskManager.tasks3.data';
import { RAW_TASKS_PART4 } from './TaskManager.tasks4.data';
import { RAW_TASKS_PART5 } from './TaskManager.tasks5.data';
import { RAW_TASKS_PART6 } from './TaskManager.tasks6.data';
import { OPERATIONAL_TOOL_TASKS } from './TaskManager.tools.data';

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
  { id: 'pillar-8', name: 'Pillar VIII: Client Experience & Concierge' },
  { id: 'pillar-9', name: 'Pillar IX: Secondary Market & Luxury Resale' },
  { id: 'pillar-10', name: 'Pillar X: International Investments' },
  { id: 'pillar-11', name: 'Pillar XI: Commercial & Retail Leasing' },
  { id: 'pillar-12', name: 'Pillar XII: Research & Market Intelligence' },
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
  const tasks3: TaskNode[] = RAW_TASKS_PART3.map((row, idx) => buildTaskFromDef(row, idx + 200));
  const tasks4: TaskNode[] = RAW_TASKS_PART4.map((row, idx) => buildTaskFromDef(row, idx + 300));
  const tasks5: TaskNode[] = RAW_TASKS_PART5.map((row, idx) => buildTaskFromDef(row, idx + 400));
  const tasks6: TaskNode[] = RAW_TASKS_PART6.map((row, idx) => buildTaskFromDef(row, idx + 500));

  return [
    ...OPERATIONAL_TOOL_TASKS,
    ...tasks1,
    ...tasks2,
    ...tasks3,
    ...tasks4,
    ...tasks5,
    ...tasks6,
  ];
}
