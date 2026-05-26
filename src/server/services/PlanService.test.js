import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { afterEach, describe, expect, it } from 'vitest';
import PlanService from './PlanService.js';

const tmpDirs = [];

async function makeService() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'wc-plan-service-'));
  tmpDirs.push(dir);
  const service = new PlanService(dir);
  await service.initializePlansFolder();
  return service;
}

afterEach(async () => {
  for (const dir of tmpDirs.splice(0, tmpDirs.length)) {
    await fs.remove(dir);
  }
});

describe('PlanService.deletePlan safeguards', () => {
  it('blocks deletion when plan is not archived', async () => {
    const service = await makeService();
    const created = await service.createPlan('draft.md', '# Draft', { status: 'completed' });

    await expect(service.deletePlan(created.id)).rejects.toThrow(
      'only archived plans marked as fully implemented may be deleted'
    );
  });

  it('blocks deletion when plan is archived but not implemented', async () => {
    const service = await makeService();
    const created = await service.createPlan('archived-draft.md', '# Draft', {
      archived: true,
      status: 'draft',
      tags: ['archived'],
    });

    await expect(service.deletePlan(created.id)).rejects.toThrow(
      'only archived plans marked as fully implemented may be deleted'
    );
  });

  it('allows deletion only when plan is archived and implemented', async () => {
    const service = await makeService();
    const created = await service.createPlan('ready-to-delete.md', '# Completed Plan', {
      archived: true,
      status: 'completed',
      tags: ['archived'],
    });

    const result = await service.deletePlan(created.id);
    expect(result.success).toBe(true);
    await expect(service.readPlan(created.id)).rejects.toThrow('Plan not found');
  });
});
