import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import v1AiAssistantsRouter from './v1AiAssistants';

// Mock authMiddleware to simulate authenticated user
vi.mock('../middleware/auth.js', () => ({
  default: (req: any, _res: any, next: any) => {
    req.user = { id: 'admin-001', role: 'managing_director' };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use('/api/v1/ai-assistants', v1AiAssistantsRouter);

describe('V1 AI Assistants CRUD REST Routes & Prisma Pathways', () => {
  it('GET /api/v1/ai-assistants returns list of assistants with total count', async () => {
    const res = await request(app).get('/api/v1/ai-assistants');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  it('GET /api/v1/ai-assistants/:id retrieves single agent Linda', async () => {
    const res = await request(app).get('/api/v1/ai-assistants/linda');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.agentId).toBe('linda');
    expect(res.body.data.name).toBe('AI Linda');
  });

  it('POST /api/v1/ai-assistants creates a new assistant agent', async () => {
    const newAgent = {
      agentId: 'dept-01-sup-01',
      name: 'Ada Lovelace',
      role: 'Chief Architect Lead',
      department: 'Agent Orchestration Core',
      tier: 'SUPERVISOR',
      capabilities: ['Prompt Engineering', 'Orchestration'],
    };

    const res = await request(app).post('/api/v1/ai-assistants').send(newAgent);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.agentId).toBe('dept-01-sup-01');
    expect(res.body.data.name).toBe('Ada Lovelace');
  });

  it('PUT /api/v1/ai-assistants/:id updates assistant workload and status', async () => {
    const res = await request(app)
      .put('/api/v1/ai-assistants/linda')
      .send({ status: 'BUSY', activeWorkload: 25 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('BUSY');
    expect(res.body.data.activeWorkload).toBe(25);
  });

  it('DELETE /api/v1/ai-assistants/:id removes an assistant', async () => {
    const res = await request(app).delete('/api/v1/ai-assistants/dept-01-sup-01');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('deleted');
  });
});
