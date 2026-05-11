import path from 'path';
import fs from 'fs-extra';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import PlanService from '../../src/server/services/PlanService.js';

const testPlansDir = path.resolve('.tmp-plan-service-tests');

describe('PlanService hardening', () => {
  beforeEach(async () => {
    await fs.remove(testPlansDir);
    await fs.ensureDir(testPlansDir);
  });

  afterEach(async () => {
    await fs.remove(testPlansDir);
  });

  it('rejects unsafe filenames during create', async () => {
    const service = new PlanService(testPlansDir);
    await service.initializePlansFolder();

    await expect(
      service.createPlan('../outside.md', '# unsafe', { title: 'unsafe' })
    ).rejects.toThrow(/Invalid plan filename/i);
  });

  it('computes stats from full content instead of preview snippet', async () => {
    const service = new PlanService(testPlansDir);
    await service.initializePlansFolder();

    const longBody = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ');
    await service.createPlan('long-plan.md', longBody, { title: 'Long plan' });

    const stats = await service.getPlanStats();
    expect(stats.totalPlans).toBe(1);
    expect(stats.totalWords).toBeGreaterThan(200);
  });
});
