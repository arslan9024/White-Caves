/**
 * Orchestration Routes — Unit Tests
 * Covers /api/orchestration status, task creation, state updates, and quota controls.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));

vi.mock('../middleware/rbac', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

import orchestrationRoutes from './orchestration';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/orchestration', orchestrationRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Orchestration Routes — /api/orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /status returns profiles, graph, quota, and tasks', async () => {
    const res = await request(createApp()).get('/api/orchestration/status');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('profiles');
    expect(res.body.data).toHaveProperty('collaborationGraph');
    expect(res.body.data).toHaveProperty('quota');
    expect(res.body.data).toHaveProperty('metrics');
    expect(res.body.data).toHaveProperty('tasks');
    expect(res.body.data.profiles).toHaveProperty('linda');
    expect(res.body.data.profiles).toHaveProperty('henry');
    expect(res.body.data.metrics).toHaveProperty('totalTasks');
    expect(res.body.data.metrics).toHaveProperty('queuedTasks');
  });

  it('GET /metrics returns quota and aggregated metrics payload', async () => {
    const res = await request(createApp()).get('/api/orchestration/metrics');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('quota');
    expect(res.body.data).toHaveProperty('metrics');
    expect(res.body.data.metrics).toHaveProperty('totalTasks');
    expect(res.body.data.metrics).toHaveProperty('premiumTasks');
    expect(res.body.data.metrics).toHaveProperty('lastTaskCreatedAt');
  });

  it('POST /snapshots/export creates a snapshot and GET /snapshots lists it', async () => {
    await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'henry',
      taskType: 'review',
      title: 'Snapshot seed task',
    });

    const exportRes = await request(createApp())
      .post('/api/orchestration/snapshots/export')
      .send({ label: 'nightly' });

    expect(exportRes.status).toBe(201);
    expect(exportRes.body.success).toBe(true);
    expect(String(exportRes.body.data.fileName || '')).toMatch(/orch-snapshot-/i);

    const listRes = await request(createApp()).get('/api/orchestration/snapshots');
    expect(listRes.status).toBe(200);
    expect(listRes.body.success).toBe(true);
    expect(Array.isArray(listRes.body.data)).toBe(true);
    expect(listRes.body.data.length).toBeGreaterThan(0);
  });

  it('POST /snapshots/restore restores latest snapshot when fileName omitted', async () => {
    await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'henry',
      taskType: 'review',
      title: 'Restore baseline task',
    });

    await request(createApp())
      .post('/api/orchestration/snapshots/export')
      .send({ label: 'baseline' });

    const restoreRes = await request(createApp())
      .post('/api/orchestration/snapshots/restore')
      .send({});

    expect(restoreRes.status).toBe(200);
    expect(restoreRes.body.success).toBe(true);
    expect(restoreRes.body.data).toHaveProperty('snapshot');
    expect(restoreRes.body.data).toHaveProperty('metrics');
  });

  it('GET /contracts/assistant-endpoints returns runtime endpoint contract payload', async () => {
    const res = await request(createApp()).get('/api/orchestration/contracts/assistant-endpoints');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.mountedPrefixes)).toBe(true);
    expect(Array.isArray(res.body.data.activeAssistantIds)).toBe(true);
    expect(res.body.data.mountedPrefixes).toContain('/api/orchestration');
    expect(res.body.data.mountedPrefixes).toContain('/api/invoices/lease');
    expect(res.body.data.activeAssistantIds).toContain('mary');
    expect(res.body.data.activeAssistantIds).toContain('henry');
    expect(typeof res.body.data.generatedAt).toBe('string');
  });

  it('POST /tasks creates queued task for allowed assistant/task type', async () => {
    const res = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'linda',
      taskType: 'planning',
      title: 'Prepare handoff workflow for leasing leads',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.assistantId).toBe('linda');
    expect(res.body.data.taskType).toBe('planning');
    expect(['queued', 'blocked']).toContain(res.body.data.state);
  });

  it('POST /tasks blocks premium tier for assistant without premium permission', async () => {
    const res = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'linda',
      taskType: 'planning',
      title: 'Attempt premium execution',
      requestedTier: 'premium',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.state).toBe('blocked');
    expect(String(res.body.data.blockedReason || '')).toMatch(/premium/i);
  });

  it('POST /tasks rejects invalid task type for assistant', async () => {
    const res = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'linda',
      taskType: 'implementation',
      title: 'Should fail because linda is planning/review/docs focused',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(String(res.body.error || '')).toMatch(/not allowed/i);
  });

  it('POST /tasks rejects missing required fields', async () => {
    const res = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'linda',
      taskType: 'planning',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(String(res.body.error || '')).toMatch(/required/i);
  });

  it('POST /tasks returns 404 for unknown assistant', async () => {
    const res = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'unknown-agent',
      taskType: 'planning',
      title: 'Unknown assistant request',
    });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(String(res.body.error || '')).toMatch(/unknown assistant/i);
  });

  it('POST /tasks blocks premium tasks when daily cap is exhausted', async () => {
    await request(createApp()).put('/api/orchestration/quota').send({
      weeklyPremiumRemaining: 2,
      businessDaysRemaining: 1,
      premiumConsumedToday: 2,
    });

    const res = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'mira',
      taskType: 'implementation',
      title: 'Premium implementation after cap reached',
      requestedTier: 'premium',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.state).toBe('blocked');
    expect(String(res.body.data.blockedReason || '')).toMatch(/daily premium cap exhausted/i);
  });

  it('GET /tasks filters by assistantId', async () => {
    await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'henry',
      taskType: 'review',
      title: 'Henry review task',
    });

    await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'linda',
      taskType: 'planning',
      title: 'Linda planning task',
    });

    const res = await request(createApp()).get('/api/orchestration/tasks?assistantId=henry');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(
      res.body.data.every((task: { assistantId: string }) => task.assistantId === 'henry')
    ).toBe(true);
  });

  it('PATCH /tasks/:id/state updates existing task state', async () => {
    const createRes = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'henry',
      taskType: 'review',
      title: 'Review compliance event stream',
    });

    const taskId = createRes.body?.data?.id;
    expect(taskId).toBeTruthy();

    const patchRes = await request(createApp())
      .patch(`/api/orchestration/tasks/${taskId}/state`)
      .send({ state: 'running' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.success).toBe(true);
    expect(patchRes.body.data.state).toBe('running');
  });

  it('PATCH /tasks/:id/state rejects invalid state values', async () => {
    const createRes = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'henry',
      taskType: 'review',
      title: 'State validation test',
    });

    const taskId = createRes.body?.data?.id;

    const patchRes = await request(createApp())
      .patch(`/api/orchestration/tasks/${taskId}/state`)
      .send({ state: 'invalid-state' });

    expect(patchRes.status).toBe(400);
    expect(patchRes.body.success).toBe(false);
    expect(String(patchRes.body.error || '')).toMatch(/invalid task state/i);
  });

  it('PATCH /tasks/:id/state rejects invalid transitions', async () => {
    const createRes = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'henry',
      taskType: 'review',
      title: 'Transition validation test',
    });

    const taskId = createRes.body?.data?.id;

    const patchRes = await request(createApp())
      .patch(`/api/orchestration/tasks/${taskId}/state`)
      .send({ state: 'done' });

    expect(patchRes.status).toBe(400);
    expect(patchRes.body.success).toBe(false);
    expect(String(patchRes.body.error || '')).toMatch(/invalid state transition/i);
  });

  it('PATCH /tasks/:id/state stores blocked reason when moving to blocked', async () => {
    const createRes = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'henry',
      taskType: 'review',
      title: 'Blocked reason test',
    });

    const taskId = createRes.body?.data?.id;

    await request(createApp())
      .patch(`/api/orchestration/tasks/${taskId}/state`)
      .send({ state: 'running' });

    const patchRes = await request(createApp())
      .patch(`/api/orchestration/tasks/${taskId}/state`)
      .send({ state: 'blocked', blockedReason: 'Awaiting legal sign-off' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.success).toBe(true);
    expect(patchRes.body.data.state).toBe('blocked');
    expect(patchRes.body.data.blockedReason).toBe('Awaiting legal sign-off');
  });

  it('PATCH /tasks/:id/state rejects missing state', async () => {
    const createRes = await request(createApp()).post('/api/orchestration/tasks').send({
      assistantId: 'henry',
      taskType: 'review',
      title: 'Create task for empty-state patch test',
    });

    const taskId = createRes.body?.data?.id;

    const patchRes = await request(createApp())
      .patch(`/api/orchestration/tasks/${taskId}/state`)
      .send({});

    expect(patchRes.status).toBe(400);
    expect(patchRes.body.success).toBe(false);
    expect(String(patchRes.body.error || '')).toMatch(/state is required/i);
  });

  it('PATCH /tasks/:id/state returns 404 for unknown task id', async () => {
    const patchRes = await request(createApp())
      .patch('/api/orchestration/tasks/not-found-id/state')
      .send({ state: 'running' });

    expect(patchRes.status).toBe(404);
    expect(patchRes.body.success).toBe(false);
    expect(String(patchRes.body.error || '')).toMatch(/task not found/i);
  });

  it('PUT /quota updates quota values', async () => {
    const res = await request(createApp()).put('/api/orchestration/quota').send({
      weeklyPremiumRemaining: 25,
      businessDaysRemaining: 5,
      premiumConsumedToday: 2,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.weeklyPremiumRemaining).toBe(25);
    expect(res.body.data.businessDaysRemaining).toBe(5);
    expect(res.body.data.premiumConsumedToday).toBe(2);
    expect(res.body.data.dailyCap).toBe(5);
  });
});
