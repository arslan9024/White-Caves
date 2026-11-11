// FILE: src/components/crm/TaskManager/TaskManager.test.tsx
/**
 * White Caves Real Estate LLC - Task Manager Unit Tests
 * Standard: AEGIS 12-Way Co-Location Architecture Standard (Tests - Tier 6)
 * Single Purpose File Law: < 350 lines
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskManagerView } from './TaskManagerView';
import {
  executeCreateTaskWorkflow,
  executeUpdateTaskWorkflow,
  executeAdvanceTaskStatusWorkflow,
  executeTaskFunctionalRunWorkflow,
} from './TaskManager.workflow';
import { buildCanonical200Tasks } from './TaskManager.data';
import { TaskManagerFallback } from './TaskManager.fallback';
import { TaskTelemetry } from './TaskManager.telemetry';
import { getTaskI18n } from './TaskManager.i18n';
import {
  saveTasksCache,
  loadTasksCache,
  getTaskByTuringId,
  indexTasksInMemory,
} from './TaskManager.cache';
import { executeTaskWorkbenchOffThread } from './TaskManager.workers';

describe('TaskManager 12-Way Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    indexTasksInMemory(buildCanonical200Tasks());
    TaskTelemetry.clear();
  });

  // --- Tier 1 & 2: View and Logic Integration ---
  it('renders 200 tasks catalog with header, metrics, and cards', () => {
    render(<TaskManagerView />);

    expect(screen.getByTestId('task-manager-view')).toBeInTheDocument();
    expect(screen.getByTestId('task-metrics-row')).toBeInTheDocument();
    expect(screen.getByTestId('tasks-cards-grid')).toBeInTheDocument();

    expect(screen.getByTestId('task-card-TSK-001')).toBeInTheDocument();
    expect(
      screen.getByText('Verify RERA Broker Card Active Status & Renewals')
    ).toBeInTheDocument();
    expect(screen.getByText('RERA / DLD')).toBeInTheDocument();
  });

  it('filters tasks dynamically via search input', () => {
    render(<TaskManagerView />);

    const searchInput = screen.getByTestId('task-search-input');
    fireEvent.change(searchInput, { target: { value: 'TSK-008' } });

    expect(screen.getByTestId('task-card-TSK-008')).toBeInTheDocument();
    expect(screen.queryByTestId('task-card-TSK-001')).not.toBeInTheDocument();
  });

  it('filters tasks by operational pillar', () => {
    render(<TaskManagerView />);

    const pillarSelect = screen.getByTestId('pillar-filter-select');
    fireEvent.change(pillarSelect, { target: { value: 'pillar-1' } });

    expect(screen.getByTestId('task-card-TSK-001')).toBeInTheDocument();
  });

  it('advances task status from PENDING to IN_PROGRESS', () => {
    render(<TaskManagerView />);

    const advanceBtn = screen.getByTestId('advance-task-TSK-001');
    fireEvent.click(advanceBtn);

    expect(
      screen.getByText(/status transitioned from PENDING to IN_PROGRESS/i)
    ).toBeInTheDocument();
  });

  it('opens task registration drawer when clicking Register New Task', () => {
    render(<TaskManagerView />);

    const addBtn = screen.getByTestId('add-task-btn');
    fireEvent.click(addBtn);

    expect(screen.getByText('Register New Dubai Statutory Task')).toBeInTheDocument();
    expect(screen.getByText('Register Task')).toBeInTheDocument();
  });

  it('verifies that buildCanonical200Tasks generates at least 200 tasks with full reporting chains', () => {
    const tasks = buildCanonical200Tasks();
    expect(tasks.length).toBeGreaterThanOrEqual(200);

    tasks.slice(0, 10).forEach(t => {
      expect(t.reportingChain).toBeDefined();
      expect(t.reportingChain.supervisorName).toBeTruthy();
      expect(t.reportingChain.managerName).toBeTruthy();
      expect(t.reportingChain.directorName).toBeTruthy();
      expect(t.actor).toBeDefined();
      expect(t.action).toBeDefined();
    });
  });

  // --- Tier 7: Pure Task Workflow Engine ---
  it('executeCreateTaskWorkflow generates task with sequential code and reporting chain', () => {
    const initial = buildCanonical200Tasks();
    const payload = {
      title: 'Custom Golden Visa Escrow Liaison',
      pillarId: 'pillar-1',
      pillarName: 'Pillar I: Legal & Regulatory',
      category: 'REGULATORY' as const,
      statutoryAuthority: 'GDRFA',
      description: 'Expedited processing for 2M AED real estate investor visa.',
      priority: 'CRITICAL' as const,
      status: 'PENDING' as const,
      defaultSla: '2 Hours',
      reportingChain: {
        supervisorName: 'Supervisor Amira',
        supervisorCode: 'SUP-01',
        managerName: 'Manager Farooq',
        managerCode: 'MGR-01',
        directorName: 'Adv. Tariq Mansoor',
        directorCode: 'DIR-01',
        executiveReviewer: 'Sophia Al-Hashemi',
      },
    };

    const result = executeCreateTaskWorkflow(initial, payload);
    expect(result.success).toBe(true);
    expect(result.tasks.length).toBe(initial.length + 1);
    expect(result.tasks[0].taskCode).toMatch(/^TSK-\d+/);
  });

  it('executeAdvanceTaskStatusWorkflow updates status and recalculates completion rate', () => {
    const initial = buildCanonical200Tasks();
    const result = executeAdvanceTaskStatusWorkflow(initial, 'task-tsk-001', 'COMPLETED');

    expect(result.success).toBe(true);
    const updated = result.tasks.find(t => t._id === 'task-tsk-001')!;
    expect(updated.status).toBe('COMPLETED');
    expect(updated.completionRate).toBe(100);
  });

  it('executeTaskFunctionalRunWorkflow processes atomic task and outputs verification artifacts', () => {
    const initial = buildCanonical200Tasks();
    const task = initial[0];
    const result = executeTaskFunctionalRunWorkflow(task, {
      plotNumber: 'PLT-58204-DH2',
      ownerName: 'White Caves Real Estate Holdings LLC',
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('COMPLETED');
    expect(result.verificationPassed).toBe(true);
    expect(result.awardedXp).toBeGreaterThan(0);
  });

  it('opens TaskExecutionWorkbench when clicking Run on a task card', () => {
    render(<TaskManagerView />);

    const runBtn = screen.getByTestId('run-task-TSK-001');
    fireEvent.click(runBtn);

    expect(screen.getByTestId('task-execution-workbench')).toBeInTheDocument();
    expect(screen.getByText('Stage 1: Input Parameters')).toBeInTheDocument();
  });

  // --- Tier 8: Failure Boundary ---
  it('renders TaskManagerFallback boundary with errorId and triggers onRetry', () => {
    const onRetry = vi.fn();
    const onNavigateBack = vi.fn();

    render(
      <TaskManagerFallback
        error="RUP Statutory Orchestration Node Offline"
        errorId="ERR-TSK-504"
        onRetry={onRetry}
        onNavigateBack={onNavigateBack}
      />
    );

    expect(screen.getByTestId('task-manager-fallback')).toBeInTheDocument();
    expect(screen.getByText('ERR-TSK-504')).toBeInTheDocument();
    expect(screen.getByText(/RUP Statutory Orchestration Node Offline/i)).toBeInTheDocument();

    const retryBtn = screen.getByTestId('task-fallback-retry-btn');
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    const backBtn = screen.getByTestId('task-fallback-back-btn');
    fireEvent.click(backBtn);
    expect(onNavigateBack).toHaveBeenCalledTimes(1);
  });

  // --- Tier 9: Real-Time State Attestations & Telemetry ---
  it('tracks task telemetry events and delivers to queue with non-blocking dispatch', () => {
    TaskTelemetry.track('WORKBENCH_EXECUTE', {
      taskCode: 'TSK-001',
      actorRole: 'MANAGING_DIRECTOR',
    });

    const events = TaskTelemetry.getRecentEvents();
    expect(events.length).toBeGreaterThan(0);
    const lastEvent = events[events.length - 1];
    expect(lastEvent.eventType).toBe('WORKBENCH_EXECUTE');
    expect(lastEvent.taskCode).toBe('TSK-001');
  });

  // --- Tier 10: 4-Language Translation Schemas ---
  it('resolves 4-language i18n schemas with Arabic RTL compliance', () => {
    const arI18n = getTaskI18n('ar');
    expect(arI18n.dir).toBe('rtl');
    expect(arI18n.workspaceTitle).toContain('المهام');

    const enI18n = getTaskI18n('en');
    expect(enI18n.dir).toBe('ltr');
    expect(enI18n.workspaceTitle).toContain('Operations');

    const esI18n = getTaskI18n('es');
    expect(esI18n.workspaceTitle).toContain('Operaciones');

    const ruI18n = getTaskI18n('ru');
    expect(ruI18n.workspaceTitle).toContain('Операций');
  });

  // --- Tier 11: Localized State Persistence & O(1) Cache Lookup ---
  it('persists tasks cache and provides O(1) lookups by Turing ID', () => {
    const canonical = buildCanonical200Tasks();
    saveTasksCache(canonical);
    const cached = loadTasksCache();
    expect(cached).toBeDefined();
    expect(cached?.length).toBeGreaterThanOrEqual(200);

    const lookupByCode = getTaskByTuringId('TSK-001');
    expect(lookupByCode).toBeDefined();
    expect(lookupByCode?.title).toContain('RERA Broker');
  });

  // --- Tier 12: Off-Thread Multi-Agent Background Computation ---
  it('executes task workbench off-thread with Law 5 bounds and +500 XP reward', async () => {
    const result = await executeTaskWorkbenchOffThread({
      taskId: 'task-tsk-001',
      taskCode: 'TSK-001',
      slaDays: 2,
      rupInputs: { verified: true },
      actorClearanceLevel: 5,
    });

    expect(result.taskCode).toBe('TSK-001');
    expect(result.passed).toBe(true);
    expect(result.slaBreachRisk).toBe(false);
    expect(result.awardedMeritXp).toBe(500); // Law 10: Gamified Merit XP
    expect(result.auditAttestationToken).toContain('RUP-ATTEST-TSK-001');
  });
});
