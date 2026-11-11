/**
 * ErmsSyncBridge.test.ts
 * Vitest suite for TURING-SEPARATION-010 ERMS <-> TMS Sync Bridge
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { loadErmsRelations, saveErmsRelations, syncCompletedTaskToErms } from './ErmsSyncBridge';
import { CANONICAL_ERD_RELATIONS } from './RelationshipErd.data';
import type { TaskNode } from '../TaskManager/TaskManager.types';

describe('ErmsSyncBridge (TURING-SEPARATION-010 Compliance Suite)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads canonical relations when storage is empty', () => {
    const relations = loadErmsRelations();
    expect(relations.length).toBe(CANONICAL_ERD_RELATIONS.length);
    expect(relations[0].actionVerb).toBe('DISPATCH_TASK');
  });

  it('refuses to establish relational links for pending or in-progress tasks', () => {
    const pendingTask: TaskNode = {
      _id: 't-1',
      taskCode: 'TSK-001',
      title: 'Verify Title Deed',
      category: 'DLD_VERIFICATION',
      pillarId: 'pillar-1',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      completionRate: 50,
      createdAt: '2026-11-11',
      deptId: 'DEPT-11',
      actionVerb: 'VERIFY_TITLE_DEED',
      reportingChain: {
        supervisorId: 'sup-1',
        supervisorName: 'Sofia',
        directorId: 'dir-1',
        directorName: 'Zayed',
      },
    };

    const res = syncCompletedTaskToErms(pendingTask);
    expect(res.success).toBe(false);
    expect(res.message).toContain('TURING-SEPARATION-010 forbids linking pending tasks');
  });

  it('successfully synchronizes completed statutory tasks and updates ERD relations', () => {
    const completedTask: TaskNode = {
      _id: 't-2',
      taskCode: 'TSK-044',
      title: 'Audit Tenancy Contract Lifecycle',
      category: 'EJARI_CONTRACT',
      pillarId: 'pillar-2',
      status: 'COMPLETED',
      priority: 'CRITICAL',
      completionRate: 100,
      createdAt: '2026-11-11',
      deptId: 'DEPT-11',
      actionVerb: 'AUDIT_LEASE_LIFECYCLE',
      reportingChain: {
        supervisorId: 'sup-1',
        supervisorName: 'Sofia',
        directorId: 'dir-1',
        directorName: 'Zayed',
      },
    };

    const res = syncCompletedTaskToErms(completedTask);
    expect(res.success).toBe(true);
    expect(res.relationUpdated?.actionTaskId).toBe('TSK-044');
    expect(res.relationUpdated?.actionVerb).toBe('AUDIT_LEASE_LIFECYCLE');
    expect(res.relationUpdated?.label).toContain('Verified via TSK-044');

    const updatedRelations = loadErmsRelations();
    const rel6 = updatedRelations.find(r => r.actionTaskId === 'TSK-044');
    expect(rel6).toBeDefined();
    expect(rel6?.label).toContain('Verified via TSK-044');
  });

  it('dynamically spawns a new relation for unmapped completed tasks', () => {
    const customCompletedTask: TaskNode = {
      _id: 't-3',
      taskCode: 'TSK-999',
      title: 'Sign Sovereign Joint Venture',
      category: 'M_AND_A',
      pillarId: 'pillar-3',
      status: 'COMPLETED',
      priority: 'CRITICAL',
      completionRate: 100,
      createdAt: '2026-11-11',
      deptId: 'DEPT-07',
      actionVerb: 'SIGN_SOVEREIGN_JV',
      reportingChain: {
        supervisorId: 'sup-7',
        supervisorName: 'Maktoum',
        directorId: 'dir-7',
        directorName: 'Maktoum',
      },
    };

    const res = syncCompletedTaskToErms(customCompletedTask);
    expect(res.success).toBe(true);
    expect(res.relationUpdated?.id).toBe('rel-dyn-tsk-999');
    expect(res.relationUpdated?.actionVerb).toBe('SIGN_SOVEREIGN_JV');
    expect(res.relationUpdated?.departmentCode).toBe('DEPT-07');

    const updatedRelations = loadErmsRelations();
    expect(updatedRelations.length).toBe(CANONICAL_ERD_RELATIONS.length + 1);
  });
});
