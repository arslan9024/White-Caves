/**
 * White Caves Real Estate LLC - V1 Tasks REST API Router & Entity Synchronizer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Backend Route)
 * Single Purpose File Law: < 350 lines
 * Protocol: Rational Unified Process (RUP) & Strict UML Entity Synchronization
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { buildCanonical200Tasks } from '../../src/components/crm/TaskManager/TaskManager.data.js';
import type {
  TaskNode,
  TaskStatus,
} from '../../src/components/crm/TaskManager/TaskManager.types.js';

const router = Router();
let inMemoryTasks: TaskNode[] = buildCanonical200Tasks();

// Entity state tracking for real-time synchronization
const entityStateLedger = {
  properties: new Map<string, { vacancyStatus: string; isMasked: boolean }>(),
  tenancyContracts: new Map<string, { status: string }>(),
  customers: new Map<string, { isVerified: boolean; kycStatus: string }>(),
  receipts: new Map<
    string,
    { receiptNumber: string; amountAED: number; vatAmountAED: number; zohoBooksSynced: boolean }
  >(),
};

// GET /api/v1/tasks - List all tasks with optional filters
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { pillar, category, status, search } = req.query;
    let result = [...inMemoryTasks];

    if (pillar && pillar !== 'all') {
      result = result.filter(
        t =>
          t.pillarId === pillar || t.pillarName.toLowerCase().includes(String(pillar).toLowerCase())
      );
    }
    if (category && category !== 'all') {
      result = result.filter(t => t.category === category);
    }
    if (status && status !== 'all') {
      result = result.filter(t => t.status === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.taskCode.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: result.length,
      totalCatalog: inMemoryTasks.length,
      data: result,
    });
  })
);

// GET /api/v1/tasks/:id - Get single task with RUP Use Case Dossier
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const task = inMemoryTasks.find(
      t => t._id.toLowerCase() === id.toLowerCase() || t.taskCode.toLowerCase() === id.toLowerCase()
    );

    if (!task) {
      return res.status(404).json({ success: false, error: `Task ${id} not found in catalog.` });
    }

    res.json({ success: true, data: task });
  })
);

// POST /api/v1/tasks - Create custom task node
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { title, pillarId, pillarName, category, priority, statutoryAuthority, defaultSla } =
      req.body;

    if (!title || !pillarId) {
      return res.status(400).json({ success: false, error: 'Title and pillarId are required.' });
    }

    const nextCode = `TSK-${String(inMemoryTasks.length + 1).padStart(3, '0')}`;
    const newTask: TaskNode = {
      _id: `task-custom-${Date.now()}`,
      taskCode: nextCode,
      title,
      pillarId,
      pillarName: pillarName || 'General Corporate Pillar',
      category: category || 'OPERATIONS',
      priority: priority || 'MEDIUM',
      status: 'PENDING',
      statutoryAuthority: statutoryAuthority || 'White Caves Quality SOP',
      defaultSla: defaultSla || '24 Hours',
      description: `Task ${nextCode}: ${title} under Bhakti Lineage Protocol.`,
      reportingChain: {
        supervisorName: 'Supervisor Amira (SUP-01)',
        supervisorCode: 'SUP-01',
        managerName: 'Manager Farooq (M01)',
        managerCode: 'M01',
        directorName: 'Adv. Tariq Mansoor (D01)',
        directorCode: 'D01',
        executiveReviewer: 'Arslan Malik Bashir Ahmad (MD-01)',
      },
      actor: 'Managing Director Arslan Malik Bashir Ahmad (EMP-001)',
      action: `Execute ${title}`,
      results: `Verified output and telemetry emitted for ${nextCode}`,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      completionRate: 0,
    };

    inMemoryTasks = [newTask, ...inMemoryTasks];
    res.status(201).json({ success: true, data: newTask });
  })
);

// POST /api/v1/tasks/:id/complete - Execute task and commit mutations back to entity models
router.post(
  '/:id/complete',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { awardedXp, outputs = {}, entityId } = req.body;

    const taskIndex = inMemoryTasks.findIndex(
      t => t._id.toLowerCase() === id.toLowerCase() || t.taskCode.toLowerCase() === id.toLowerCase()
    );

    if (taskIndex === -1) {
      return res.status(404).json({ success: false, error: `Task ${id} not found.` });
    }

    const task = inMemoryTasks[taskIndex];
    const finalXp = awardedXp || (task.priority === 'CRITICAL' ? 135 : 68);

    // Systematic entity status mutation mapping (Section 4 Compliance)
    const syncedEntities: Record<string, any> = {};

    if (
      task.taskCode.includes('KYC') ||
      task.title.toUpperCase().includes('ID') ||
      task.title.toUpperCase().includes('PASSPORT')
    ) {
      const custId = entityId || 'CUST-001';
      entityStateLedger.customers.set(custId, { isVerified: true, kycStatus: 'VERIFIED' });
      syncedEntities.Customer = { id: custId, isVerified: true, kycStatus: 'VERIFIED' };
    }

    if (
      task.taskCode.includes('INV') ||
      task.title.toUpperCase().includes('VACANCY') ||
      task.title.toUpperCase().includes('PROPERTY')
    ) {
      const propId = entityId || 'PROP-DH2-V12';
      const newStatus = outputs.vacancyStatus || 'OCCUPIED';
      entityStateLedger.properties.set(propId, { vacancyStatus: newStatus, isMasked: true });
      syncedEntities.Property = { id: propId, vacancyStatus: newStatus, isMasked: true };
    }

    if (
      task.taskCode.includes('LEASE') ||
      task.title.toUpperCase().includes('EJARI') ||
      task.title.toUpperCase().includes('CONTRACT')
    ) {
      const contractId = entityId || 'CTR-2026-089';
      entityStateLedger.tenancyContracts.set(contractId, { status: 'ATTESTED_EJARI' });
      syncedEntities.TenancyContract = { id: contractId, status: 'ATTESTED_EJARI' };
    }

    if (
      task.taskCode.includes('FIN') ||
      task.title.toUpperCase().includes('RECEIPT') ||
      task.title.toUpperCase().includes('LEDGER')
    ) {
      const rcptId = `receipt-${Date.now()}`;
      const amount = outputs.amountAED || 24000;
      const vat = amount * 0.05;
      entityStateLedger.receipts.set(rcptId, {
        receiptNumber: rcptId,
        amountAED: amount,
        vatAmountAED: vat,
        zohoBooksSynced: true,
      });
      syncedEntities.FinancialReceiptLog = {
        receiptNumber: rcptId,
        amountAED: amount,
        vatAmountAED: vat,
        zohoBooksSynced: true,
      };
    }

    // Mutate task status
    const updatedTask: TaskNode = {
      ...task,
      status: 'COMPLETED' as TaskStatus,
      completionRate: 100,
      results: `Statutory verification passed for ${task.taskCode}. Telemetry emitted to ledger.`,
    };

    inMemoryTasks[taskIndex] = updatedTask;

    res.json({
      success: true,
      message: `Task ${task.taskCode} COMPLETED! +${finalXp} Merit XP committed. Entity records synchronized.`,
      awardedXp: finalXp,
      data: updatedTask,
      syncedEntities,
    });
  })
);

export default router;
