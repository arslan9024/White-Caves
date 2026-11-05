/**
 * White Caves Real Estate LLC - Corporate Hierarchy & Tasks API Routes
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Server Route)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol & Bhakti Protocol
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';

const router = Router();

// In-memory persistent caches seeded from canonical Turing Protocol standards
interface TaskRecord {
  _id: string;
  taskCode: string;
  title: string;
  pillarId: string;
  pillarName: string;
  category: string;
  statutoryAuthority?: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STANDARD';
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'BLOCKED';
  defaultSla: string;
  completionRate: number;
  reportingChain: {
    supervisorName: string;
    supervisorCode: string;
    managerName: string;
    managerCode: string;
    directorName: string;
    directorCode: string;
    executiveReviewer: string;
  };
  meritXpAwarded?: number;
}

interface EmployeeRecord {
  _id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  roleTier: string;
  designation: string;
  departmentName: string;
  supervisorName: string;
  meritXp: number;
  tasksCompleted: number;
  slaOnTimeRate: number;
  status: string;
}

// In-memory data store for testing and persistence fallback
let taskStore: TaskRecord[] = [
  {
    _id: 'TSK-001',
    taskCode: 'T001',
    title: 'Qualify incoming residential tenant leads',
    pillarId: 'pillar-leasing',
    pillarName: 'Leasing Brokerage',
    category: 'OPERATIONS',
    statutoryAuthority: 'RERA',
    description: 'Screen inbound tenant inquiries against budget, move-in date, and family size.',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    defaultSla: '4 Hours',
    completionRate: 50,
    reportingChain: {
      supervisorName: 'Tariq Mansoor',
      supervisorCode: 'SUP-001',
      managerName: 'Residential Leasing Manager',
      managerCode: 'M01',
      directorName: 'Director of Leasing',
      directorCode: 'D01',
      executiveReviewer: 'Managing Director (MD-01)',
    },
    meritXpAwarded: 135,
  },
  {
    _id: 'TSK-002',
    taskCode: 'T002',
    title: 'Register lease in Ejari portal',
    pillarId: 'pillar-compliance',
    pillarName: 'Compliance & RERA',
    category: 'REGULATORY',
    statutoryAuthority: 'DLD / Ejari',
    description: 'Upload tenancy agreement, Emirates IDs, and issue official Ejari certificate.',
    priority: 'CRITICAL',
    status: 'PENDING',
    defaultSla: '2 Hours',
    completionRate: 0,
    reportingChain: {
      supervisorName: 'Fatima Zahra Al-Kindi',
      supervisorCode: 'SUP-002',
      managerName: 'Ejari Registration Manager',
      managerCode: 'M21',
      directorName: 'Director of Compliance',
      directorCode: 'D03',
      executiveReviewer: 'Managing Director (MD-01)',
    },
    meritXpAwarded: 135,
  },
];

let employeeStore: EmployeeRecord[] = [
  {
    _id: 'EMP-001',
    employeeCode: 'EMP-001',
    fullName: 'Tariq Mansoor',
    email: 'tariq.mansoor@whitecaves.ae',
    roleTier: 'SUPERVISOR',
    designation: 'Senior Residential Leasing Specialist',
    departmentName: 'Leasing Brokerage',
    supervisorName: 'Residential Leasing Manager (M01)',
    meritXp: 2950,
    tasksCompleted: 28,
    slaOnTimeRate: 96.4,
    status: 'active',
  },
  {
    _id: 'EMP-002',
    employeeCode: 'EMP-002',
    fullName: 'Fatima Zahra Al-Kindi',
    email: 'fatima.alkindi@whitecaves.ae',
    roleTier: 'SPECIALIST',
    designation: 'Trakheesi & Permits Specialist',
    departmentName: 'Compliance & RERA',
    supervisorName: 'Ejari Registration Manager (M21)',
    meritXp: 2720,
    tasksCompleted: 26,
    slaOnTimeRate: 98.2,
    status: 'active',
  },
];

// ── TASKS ENDPOINTS ────────────────────────────────────────────────────────

// GET /api/corporate-hierarchy/tasks
router.get(
  '/tasks',
  asyncHandler(async (req: Request, res: Response) => {
    const { pillarId, status, priority, search } = req.query;
    let filtered = [...taskStore];

    if (pillarId) {
      filtered = filtered.filter(t => t.pillarId === pillarId);
    }
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }
    if (priority) {
      filtered = filtered.filter(t => t.priority === priority);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        t => t.title.toLowerCase().includes(q) || t.taskCode.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  })
);

// POST /api/corporate-hierarchy/tasks
router.post(
  '/tasks',
  asyncHandler(async (req: Request, res: Response) => {
    const { title, pillarId, pillarName, priority, defaultSla, reportingChain, description } =
      req.body;

    if (!title || !priority || !reportingChain) {
      throw new AppError('Title, priority, and reporting chain are required', 400);
    }

    const nextIdx = taskStore.length + 1;
    const newTask: TaskRecord = {
      _id: `TSK-${String(nextIdx).padStart(3, '0')}`,
      taskCode: `T${String(nextIdx).padStart(3, '0')}`,
      title,
      pillarId: pillarId || 'pillar-operations',
      pillarName: pillarName || 'General Operations',
      category: req.body.category || 'OPERATIONS',
      statutoryAuthority: req.body.statutoryAuthority || 'Internal SOP',
      description: description || '',
      priority,
      status: 'PENDING',
      defaultSla: defaultSla || '24 Hours',
      completionRate: 0,
      reportingChain,
    };

    taskStore.unshift(newTask);
    res.status(201).json({ success: true, data: newTask });
  })
);

// PUT /api/corporate-hierarchy/tasks/:id/status
router.put(
  '/tasks/:id/status',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const taskIndex = taskStore.findIndex(t => t._id === id || t.taskCode === id);
    if (taskIndex === -1) {
      throw new AppError(`Task ${id} not found`, 404);
    }

    const task = taskStore[taskIndex];
    task.status = status;
    task.completionRate =
      status === 'COMPLETED' ? 100 : status === 'REVIEW' ? 85 : status === 'IN_PROGRESS' ? 50 : 0;

    let xpCredited = 0;
    if (status === 'COMPLETED') {
      xpCredited =
        task.priority === 'CRITICAL'
          ? 135
          : task.priority === 'HIGH'
            ? 68
            : task.priority === 'MEDIUM'
              ? 34
              : 14;
      task.meritXpAwarded = xpCredited;
    }

    res.json({
      success: true,
      message: `Task ${task.taskCode} status updated to ${status}.`,
      awardedXp: xpCredited,
      data: task,
    });
  })
);

// PUT /api/corporate-hierarchy/tasks/:id/reassign (Drag & Drop Reassignment)
router.put(
  '/tasks/:id/reassign',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { supervisorName, supervisorCode, managerName, managerCode } = req.body;

    const task = taskStore.find(t => t._id === id || t.taskCode === id);
    if (!task) {
      throw new AppError(`Task ${id} not found`, 404);
    }

    if (supervisorName) task.reportingChain.supervisorName = supervisorName;
    if (supervisorCode) task.reportingChain.supervisorCode = supervisorCode;
    if (managerName) task.reportingChain.managerName = managerName;
    if (managerCode) task.reportingChain.managerCode = managerCode;

    res.json({
      success: true,
      message: `Task ${task.taskCode} reassigned to ${task.reportingChain.supervisorName}.`,
      data: task,
    });
  })
);

// ── EMPLOYEES ENDPOINTS ───────────────────────────────────────────────────

// GET /api/corporate-hierarchy/employees
router.get(
  '/employees',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      success: true,
      count: employeeStore.length,
      data: employeeStore,
    });
  })
);

// POST /api/corporate-hierarchy/promotions
router.post(
  '/promotions',
  asyncHandler(async (req: Request, res: Response) => {
    const { employeeId, targetTier, targetRole } = req.body;

    const emp = employeeStore.find(e => e._id === employeeId || e.employeeCode === employeeId);
    if (!emp) {
      throw new AppError(`Employee ${employeeId} not found`, 404);
    }

    const previousRole = emp.designation;
    emp.roleTier = targetTier || 'SUPERVISOR';
    emp.designation = targetRole || `Operational Supervisor (${emp.departmentName})`;

    res.json({
      success: true,
      message: `Promoted ${emp.fullName} from ${previousRole} to ${emp.designation}!`,
      data: emp,
    });
  })
);

// GET /api/corporate-hierarchy/leaderboard
router.get(
  '/leaderboard',
  asyncHandler(async (_req: Request, res: Response) => {
    const sorted = [...employeeStore].sort((a, b) => b.meritXp - a.meritXp);
    res.json({
      success: true,
      count: sorted.length,
      topPodium: {
        gold: sorted[0] || null,
        silver: sorted[1] || null,
        bronze: sorted[2] || null,
      },
      data: sorted,
    });
  })
);

export default router;
