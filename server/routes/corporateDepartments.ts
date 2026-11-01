import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { DepartmentNode } from '../../src/models/DepartmentNode.js';
import { Personnel } from '../../src/models/Personnel.js';
import { TeamSquad } from '../../src/models/TeamSquad.js';
import {
  renameDepartmentNode,
  reorderDepartmentNodes,
  createSubDepartment,
  createTeamSquad,
  renameTeamSquad,
  assignMemberToSquad,
  promoteDemotePersonnel,
  updateAIPersonaPrompt,
} from '../../src/app/(dashboard)/departments/actions.js';

const router = Router();

// GET /api/corporate-departments - list all 12 corporate departments with subDepts count and headcount
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const departments = await DepartmentNode.find({ level: 'DEPARTMENT' })
      .sort({ order: 1 })
      .populate('directorOrManagerId');

    const result = await Promise.all(
      departments.map(async (dept) => {
        const subDepts = await DepartmentNode.find({ parentDeptId: dept._id });
        const subDeptIds = subDepts.map((s) => s._id);
        const squads = await TeamSquad.find({ subDepartmentId: { $in: subDeptIds } });
        const headcount = await Personnel.countDocuments({
          $or: [{ departmentId: dept._id }, { subDepartmentId: { $in: subDeptIds } }],
          status: 'ACTIVE',
        });

        return {
          ...dept.toObject(),
          subDeptsCount: subDepts.length,
          squadsCount: squads.length,
          headcount,
        };
      })
    );

    res.json({ success: true, data: result });
  })
);

// GET /api/corporate-departments/standby - unassigned standby roster
router.get(
  '/standby',
  asyncHandler(async (_req: Request, res: Response) => {
    const standbyList = await Personnel.find({ status: 'STANDBY' }).sort({ updatedAt: -1 });
    res.json({ success: true, data: standbyList });
  })
);

// GET /api/corporate-departments/:slug - get department container data with subDepts and squads
router.get(
  '/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const dept = await DepartmentNode.findOne({
      slug: req.params.slug.toLowerCase().trim(),
      level: 'DEPARTMENT',
    }).populate('directorOrManagerId');

    if (!dept) throw new AppError('Corporate department not found', 404);

    const subDepts = await DepartmentNode.find({ parentDeptId: dept._id }).sort({ order: 1 });
    const subDeptIds = subDepts.map((s) => s._id);
    const squads = await TeamSquad.find({ subDepartmentId: { $in: subDeptIds } })
      .sort({ order: 1 })
      .populate('supervisorId');

    const squadIds = squads.map((sq) => sq._id);
    const members = await Personnel.find({ teamSquadId: { $in: squadIds } });

    res.json({
      success: true,
      data: {
        department: dept,
        subDepartments: subDepts,
        squads,
        members,
      },
    });
  })
);

// Mutations
router.patch(
  '/:nodeId/rename',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const updated = await renameDepartmentNode(req.params.nodeId, req.body.newTitle, req.user?.email);
    res.json({ success: true, data: updated });
  })
);

router.post(
  '/reorder',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await reorderDepartmentNodes(req.body.orderedIds, req.user?.email);
    res.json({ success: true, message: 'Departments reordered successfully' });
  })
);

router.post(
  '/:parentDeptId/sub-departments',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, slug, code } = req.body;
    const subDept = await createSubDepartment(req.params.parentDeptId, title, slug, code, req.user?.email);
    res.status(201).json({ success: true, data: subDept });
  })
);

router.post(
  '/squads',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { subDepartmentId, name, supervisorId } = req.body;
    const squad = await createTeamSquad(subDepartmentId, name, supervisorId, req.user?.email);
    res.status(201).json({ success: true, data: squad });
  })
);

router.patch(
  '/squads/:squadId/rename',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const squad = await renameTeamSquad(req.params.squadId, req.body.newName, req.user?.email);
    res.json({ success: true, data: squad });
  })
);

router.patch(
  '/personnel/:personnelId/assign',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const member = await assignMemberToSquad(req.params.personnelId, req.body.targetSquadId ?? null, req.user?.email);
    res.json({ success: true, data: member });
  })
);

router.patch(
  '/personnel/:personnelId/role',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const member = await promoteDemotePersonnel(req.params.personnelId, req.body.newRole, req.user?.email);
    res.json({ success: true, data: member });
  })
);

router.patch(
  '/personnel/:personnelId/prompt',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const member = await updateAIPersonaPrompt(req.params.personnelId, req.body.newPrompt, req.user?.email);
    res.json({ success: true, data: member });
  })
);

export default router;

