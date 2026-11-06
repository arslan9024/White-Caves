/**
 * White Caves Real Estate LLC - AI Mesh Management REST API Router
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Backend Route)
 * Single Purpose File Law: < 350 lines
 * Protocol: AiAssistantAgent Database Table CRUD Integration & Prisma Pathways
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// In-memory fallback dataset initialized from 1-12-108 registry if DB connection is unavailable
let inMemoryAgents = [
  {
    id: 'ai-linda-001',
    agentId: 'linda',
    name: 'AI Linda',
    code: 'WC-AI-LINDA',
    role: 'Autonomous WhatsApp Broker & Lead Nurturer',
    department: 'Marketing & Strategic Growth',
    status: 'ACTIVE',
    tier: 'SPECIALIST',
    model: 'gemini-1.5-flash',
    systemPrompt:
      'Sovereign conversational AI agent driving luxury lead conversions and automated property match proposals.',
    capabilities: ['WhatsApp Outreach', 'Bilingual EN/AR', 'Ejari Guidance', 'Escalation Routing'],
    metrics: { tasksCompleted: 450, accuracy: 98.4, latencyMs: 380 },
    activeWorkload: 14,
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ai-zoe-001',
    agentId: 'zoe',
    name: 'AI Zoe',
    code: 'WC-AI-ZOE',
    role: 'Chief Operating Partner & Autonomous Workforce Orchestrator',
    department: 'Executive Governance & Sovereign Operations',
    status: 'ACTIVE',
    tier: 'EXECUTIVE',
    model: 'gemini-1.5-pro',
    systemPrompt:
      'Directs the 120-agent business mesh and executes P0 emergency SLA workflows under sovereign authority.',
    capabilities: [
      'Mesh Orchestration',
      '1-12-108 Supervision',
      'SLA Monitoring',
      'Deep Telemetry',
    ],
    metrics: { tasksCompleted: 1280, accuracy: 99.8, latencyMs: 210 },
    activeWorkload: 28,
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/v1/ai-assistants - List AI Assistants
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { department, status, tier, search } = req.query;

    try {
      if ((prisma as any)?.aiAssistantAgent) {
        const where: any = {};
        if (department && department !== 'all') where.department = String(department);
        if (status && status !== 'all') where.status = String(status);
        if (tier && tier !== 'all') where.tier = String(tier);
        if (search && typeof search === 'string') {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { role: { contains: search, mode: 'insensitive' } },
            { agentId: { contains: search, mode: 'insensitive' } },
          ];
        }

        const agents = await (prisma as any).aiAssistantAgent.findMany({
          where,
          orderBy: { updatedAt: 'desc' },
        });

        if (agents && agents.length > 0) {
          return res.json({ success: true, count: agents.length, data: agents });
        }
      }
    } catch {
      // Fallback gracefully to inMemory pool if DB table is unmigrated in dev
    }

    let filtered = [...inMemoryAgents];
    if (department && department !== 'all') {
      filtered = filtered.filter(a =>
        a.department.toLowerCase().includes(String(department).toLowerCase())
      );
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(a => a.status === status);
    }
    if (tier && tier !== 'all') {
      filtered = filtered.filter(a => a.tier === tier);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.agentId.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  })
);

// GET /api/v1/ai-assistants/:id - Get Single AI Assistant
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      if ((prisma as any)?.aiAssistantAgent) {
        const agent = await (prisma as any).aiAssistantAgent.findFirst({
          where: { OR: [{ id }, { agentId: id }] },
        });
        if (agent) return res.json({ success: true, data: agent });
      }
    } catch {
      // Fallback
    }

    const found = inMemoryAgents.find(a => a.id === id || a.agentId === id);
    if (!found) throw new AppError(`AI Assistant with ID '${id}' not found`, 404);
    return res.json({ success: true, data: found });
  })
);

// POST /api/v1/ai-assistants - Create New AI Assistant
router.post(
  '/',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { agentId, name, role, department, tier, status, model, systemPrompt, capabilities } =
      req.body;

    if (!agentId || !name || !role || !department) {
      throw new AppError('Fields agentId, name, role, and department are required', 400);
    }

    const payload = {
      agentId,
      name,
      role,
      department,
      tier: tier || 'SUPERVISOR',
      status: status || 'ACTIVE',
      model: model || 'gemini-1.5-flash',
      systemPrompt: systemPrompt || null,
      capabilities: Array.isArray(capabilities) ? capabilities : [],
      metrics: { tasksCompleted: 0, accuracy: 100, latencyMs: 250 },
      activeWorkload: 0,
      lastActiveAt: new Date(),
    };

    try {
      if ((prisma as any)?.aiAssistantAgent) {
        // Run inside transaction pathway
        const created = await prisma.$transaction(async tx => {
          return await (tx as any).aiAssistantAgent.create({
            data: payload,
          });
        });
        return res.status(201).json({ success: true, data: created });
      }
    } catch {
      // Fallback
    }

    const memoryItem = {
      ...payload,
      id: `ai-${Date.now()}`,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryAgents.unshift(memoryItem as any);
    return res.status(201).json({ success: true, data: memoryItem });
  })
);

// PUT /api/v1/ai-assistants/:id - Update AI Assistant
router.put(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
      if ((prisma as any)?.aiAssistantAgent) {
        const updated = await prisma.$transaction(async tx => {
          const target = await (tx as any).aiAssistantAgent.findFirst({
            where: { OR: [{ id }, { agentId: id }] },
          });
          if (!target) throw new AppError(`AI Assistant '${id}' not found`, 404);
          return await (tx as any).aiAssistantAgent.update({
            where: { id: target.id },
            data: {
              ...updateData,
              updatedAt: new Date(),
            },
          });
        });
        return res.json({ success: true, data: updated });
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
    }

    const idx = inMemoryAgents.findIndex(a => a.id === id || a.agentId === id);
    if (idx === -1) throw new AppError(`AI Assistant '${id}' not found`, 404);
    inMemoryAgents[idx] = {
      ...inMemoryAgents[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return res.json({ success: true, data: inMemoryAgents[idx] });
  })
);

// DELETE /api/v1/ai-assistants/:id - Delete AI Assistant
router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      if ((prisma as any)?.aiAssistantAgent) {
        await prisma.$transaction(async tx => {
          const target = await (tx as any).aiAssistantAgent.findFirst({
            where: { OR: [{ id }, { agentId: id }] },
          });
          if (!target) throw new AppError(`AI Assistant '${id}' not found`, 404);
          await (tx as any).aiAssistantAgent.delete({
            where: { id: target.id },
          });
        });
        return res.json({ success: true, message: `AI Assistant '${id}' successfully deleted` });
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
    }

    const idx = inMemoryAgents.findIndex(a => a.id === id || a.agentId === id);
    if (idx === -1) throw new AppError(`AI Assistant '${id}' not found`, 404);
    inMemoryAgents.splice(idx, 1);
    return res.json({ success: true, message: `AI Assistant '${id}' successfully deleted` });
  })
);

export default router;
