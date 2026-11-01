import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.js';

const { personnelFind } = vi.hoisted(() => ({ personnelFind: vi.fn() }));

vi.mock('../../src/models/DepartmentNode.js', () => ({ DepartmentNode: {} }));
vi.mock('../../src/models/Personnel.js', () => ({ Personnel: { find: personnelFind } }));
vi.mock('../../src/models/TeamSquad.js', () => ({ TeamSquad: {} }));

import corporateDepartmentsRouter from './corporateDepartments.js';

function createApp(role: string, email = 'staff@example.com'): express.Application {
  const app = express();
  app.use((req: Request, _res: Response, next: NextFunction) => {
    (req as AuthRequest).user = { id: 'test-user', email, role };
    next();
  });
  app.use('/api/corporate-departments', corporateDepartmentsRouter);
  app.use(errorHandler);
  return app;
}

describe('corporate departments access control', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    personnelFind.mockReset();
  });

  it('rejects portal users from all department and personnel reads', async () => {
    const app = createApp('buyer');

    await request(app).get('/api/corporate-departments').expect(403);
    await request(app).get('/api/corporate-departments/standby').expect(403);
    await request(app).get('/api/corporate-departments/luxury-sales').expect(403);

    expect(personnelFind).not.toHaveBeenCalled();
  });

  it('limits standby roster fields and only returns system prompts to the configured superuser', async () => {
    const select = vi.fn().mockReturnThis();
    const sort = vi.fn().mockResolvedValue([]);
    personnelFind.mockReturnValue({ select, sort });

    await request(createApp('hr_staff')).get('/api/corporate-departments/standby').expect(200);

    expect(select).toHaveBeenCalledWith(
      '_id employeeId fullName role employmentType isVirtual title status'
    );

    personnelFind.mockReturnValue({ select, sort });
    vi.stubEnv('SUPER_USER_EMAIL', 'owner@example.com');
    await request(createApp('owner', 'owner@example.com'))
      .get('/api/corporate-departments/standby')
      .expect(200);

    expect(select).toHaveBeenLastCalledWith(
      '_id employeeId fullName role employmentType isVirtual title status systemPrompt'
    );
  });
});
