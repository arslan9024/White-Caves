/**
 * ErmsSyncBridge.ts
 * White Caves Real Estate LLC - ERMS <-> TMS Action-Driven Sync Bridge
 * Rule: TURING-SEPARATION-010 (Strict Entity-Action-Structure Separation)
 * Single Purpose File Law: < 350 lines
 */

import type { ERDRelation } from './RelationshipManager.types';
import { CANONICAL_ERD_RELATIONS } from './RelationshipErd.data';
import type { TaskNode } from '../TaskManager/TaskManager.types';

const ERMS_STORAGE_KEY = 'white_caves_erms_relations_v1';

/**
 * Loads dynamic ERD relations from localStorage or falls back to canonical defaults.
 */
export function loadErmsRelations(): ERDRelation[] {
  if (typeof window === 'undefined') return [...CANONICAL_ERD_RELATIONS];
  try {
    const raw = localStorage.getItem(ERMS_STORAGE_KEY);
    if (!raw) return [...CANONICAL_ERD_RELATIONS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...CANONICAL_ERD_RELATIONS];
  } catch {
    return [...CANONICAL_ERD_RELATIONS];
  }
}

/**
 * Saves ERD relations to localStorage for persistent state across ERMS views.
 */
export function saveErmsRelations(relations: ERDRelation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ERMS_STORAGE_KEY, JSON.stringify(relations));
  } catch {
    // Non-blocking storage fallback
  }
}

/**
 * TURING-SEPARATION-010: Synchronize a completed TMS task into ERMS.
 * Relationships between entities are established and updated strictly on the basis
 * of completed actions in TMS.
 */
export function syncCompletedTaskToErms(task: TaskNode): {
  success: boolean;
  relationUpdated?: ERDRelation;
  message: string;
} {
  if (task.status !== 'COMPLETED') {
    return {
      success: false,
      message: `Task ${task.taskCode} is not completed. TURING-SEPARATION-010 forbids linking pending tasks.`,
    };
  }

  const currentRelations = loadErmsRelations();
  const existingIdx = currentRelations.findIndex(
    r => r.actionTaskId === task.taskCode || (task.actionVerb && r.actionVerb === task.actionVerb)
  );

  const timestamp = new Date().toISOString();
  let updatedRelation: ERDRelation;

  if (existingIdx !== -1) {
    // Update existing relationship with verified completion metadata
    updatedRelation = {
      ...currentRelations[existingIdx],
      actionTaskId: task.taskCode,
      actionVerb: task.actionVerb || currentRelations[existingIdx].actionVerb,
      departmentCode: (task as any).deptId || task.departmentCode || currentRelations[existingIdx].departmentCode,
      label: `${currentRelations[existingIdx].label} (Verified via ${task.taskCode})`,
    };
    currentRelations[existingIdx] = updatedRelation;
  } else {
    // Establish a new relation dynamically spawned by this completed statutory task
    updatedRelation = {
      id: `rel-dyn-${task.taskCode.toLowerCase()}`,
      from: 'TaskNodeRecord',
      to: 'EntityRecord',
      label: `established by ${task.actionVerb || task.taskCode}`,
      multiplicity: '1 to 1',
      type: 'ASSOCIATION',
      foreignKey: 'actionTaskId',
      actionVerb: task.actionVerb || 'EXECUTE_STATUTORY_TASK',
      actionTaskId: task.taskCode,
      departmentCode: task.deptId || task.departmentCode || 'DEPT-01',
    };
    currentRelations.push(updatedRelation);
  }

  saveErmsRelations(currentRelations);

  return {
    success: true,
    relationUpdated: updatedRelation,
    message: `[TURING-SEPARATION-010] Relational link verified: ${updatedRelation.actionVerb} (${task.taskCode}) at ${timestamp}.`,
  };
}
