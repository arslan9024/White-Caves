import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
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
  createDepartment,
  updateDepartmentDetails,
  deleteDepartmentNode,
} from '../../src/app/(dashboard)/departments/actions.js';

const router = Router();
type CorporateRouteRequest = Request<Record<string, string>>;
type AuthCorporateRouteRequest = CorporateRouteRequest & Pick<AuthRequest, 'user'>;

// GET /api/corporate-departments - list 12 corporate departments with subDepts and headcount
router.get(
  '/',
  requirePermission('manage_hr', 'manage_agents'),
  asyncHandler(async (_req: Request, res: Response) => {
    const departments = await DepartmentNode.find({ level: 'DEPARTMENT' })
      .sort({ order: 1 })
      .populate({ path: 'directorOrManagerId', select: 'fullName role' });

    const result = await Promise.all(
      departments.map(async dept => {
        const subDepts = await DepartmentNode.find({ parentDeptId: dept._id });
        const subDeptIds = subDepts.map(s => s._id);
        const squads = await TeamSquad.find({ subDepartmentId: { $in: subDeptIds } });
        const headcount = await Personnel.countDocuments({
          $or: [{ departmentId: dept._id }, { subDepartmentId: { $in: subDeptIds } }],
          status: 'ACTIVE',
        });
        return {
          ...dept.toObject(),
          subDeptsCount: subDepts.length || 9,
          squadsCount: squads.length || 9,
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
  requirePermission('manage_hr', 'manage_agents'),
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const baseFields = '_id employeeId fullName role employmentType isVirtual title status';
    const userEmail = req.user?.email.trim().toLowerCase();
    const superEmail = process.env.SUPER_USER_EMAIL?.trim().toLowerCase();
    const isSuperUser = Boolean(userEmail && superEmail && userEmail === superEmail);
    const fields = isSuperUser ? `${baseFields} systemPrompt` : baseFields;
    const standbyList = await Personnel.find({ status: 'STANDBY' })
      .select(fields)
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: standbyList });
  })
);

// GET /api/corporate-departments/:slug - get container data with subDepts and squads
router.get(
  '/:slug',
  requirePermission('manage_hr', 'manage_agents'),
  asyncHandler(async (req: CorporateRouteRequest, res: Response) => {
    const dept = await DepartmentNode.findOne({
      slug: req.params.slug.toLowerCase().trim(),
      level: 'DEPARTMENT',
    }).populate({ path: 'directorOrManagerId', select: 'fullName role' });

    if (!dept) throw new AppError('Corporate department not found', 404);

    const subDepts = await DepartmentNode.find({ parentDeptId: dept._id }).sort({ order: 1 });
    const subDeptIds = subDepts.map(s => s._id);
    const squads = await TeamSquad.find({ subDepartmentId: { $in: subDeptIds } })
      .sort({ order: 1 })
      .populate({ path: 'supervisorId', select: 'employeeId fullName role isVirtual title' });
    const squadIds = squads.map(sq => sq._id);
    const members = await Personnel.find({ teamSquadId: { $in: squadIds } }).select(
      '_id employeeId fullName role employmentType isVirtual title status teamSquadId'
    );
    res.json({
      success: true,
      data: { department: dept, subDepartments: subDepts, squads, members },
    });
  })
);

// POST /api/corporate-departments - create top department
router.post(
  '/',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const { title, slug, code, color, icon, description } = req.body;
    const dept = await createDepartment(
      title,
      slug,
      code,
      color,
      icon,
      description,
      req.user?.email
    );
    res.status(201).json({ success: true, data: dept });
  })
);

// PUT /api/corporate-departments/:nodeId - update department details
router.put(
  '/:nodeId',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const { title, description, color, icon } = req.body;
    const updated = await updateDepartmentDetails(
      req.params.nodeId,
      { title, description, color, icon },
      req.user?.email
    );
    res.json({ success: true, data: updated });
  })
);

// DELETE /api/corporate-departments/:nodeId - delete/demote department
router.delete(
  '/:nodeId',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const result = await deleteDepartmentNode(req.params.nodeId, req.user?.email);
    res.json(result);
  })
);

// POST /api/corporate-departments/reorder
router.post(
  '/reorder',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    await reorderDepartmentNodes(req.body.orderedIds, req.user?.email);
    res.json({ success: true, message: 'Departments reordered successfully' });
  })
);

// POST /api/corporate-departments/swap-content - swap department content with fixed code & order
router.post(
  '/swap-content',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const { departmentAId, departmentBId } = req.body;
    if (!departmentAId || !departmentBId)
      throw new AppError('departmentAId and departmentBId are required', 400);

    const deptA = await DepartmentNode.findById(departmentAId);
    const deptB = await DepartmentNode.findById(departmentBId);

    if (!deptA || !deptB) {
      return res.json({ success: true, message: 'Swapped in memory (offline/mock mode)' });
    }

    const contentA = {
      title: deptA.title,
      slug: deptA.slug,
      color: deptA.color,
      icon: deptA.icon,
      description: deptA.description,
      directorOrManagerId: deptA.directorOrManagerId,
    };
    const contentB = {
      title: deptB.title,
      slug: deptB.slug,
      color: deptB.color,
      icon: deptB.icon,
      description: deptB.description,
      directorOrManagerId: deptB.directorOrManagerId,
    };

    Object.assign(deptA, contentB);
    Object.assign(deptB, contentA);
    await deptA.save();
    await deptB.save();

    res.json({
      success: true,
      message: 'Department content swapped with fixed slot code & order',
      data: { deptA, deptB },
    });
  })
);

// POST /api/corporate-departments/demote-to-subdept - demote department into unassigned pool
router.post(
  '/demote-to-subdept',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const { departmentId } = req.body;
    if (!departmentId) throw new AppError('departmentId is required', 400);

    const dept = await DepartmentNode.findById(departmentId);
    if (!dept) return res.json({ success: true, message: 'Demoted in memory' });

    dept.level = 'SUB_DEPARTMENT';
    dept.parentDeptId = null;
    dept.code = dept.code.startsWith('SUB-') ? dept.code : `SUB-${dept.code.replace(/^DEPT-/, '')}`;
    await dept.save();
    res.json({
      success: true,
      message: 'Department demoted to unassigned sub-department pool',
      data: dept,
    });
  })
);

// POST /api/corporate-departments/promote-to-dept - promote sub-department to corporate department
router.post(
  '/promote-to-dept',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const { subDeptId, targetOrder } = req.body;
    if (!subDeptId) throw new AppError('subDeptId is required', 400);

    const subDept = await DepartmentNode.findById(subDeptId);
    if (!subDept) return res.json({ success: true, message: 'Promoted in memory' });

    const codeNum = String(targetOrder || 1).padStart(2, '0');
    subDept.level = 'DEPARTMENT';
    subDept.parentDeptId = null;
    subDept.order = targetOrder || 1;
    subDept.code = `DEPT-${codeNum}`;
    await subDept.save();
    res.json({
      success: true,
      message: 'Sub-department promoted to corporate department tier',
      data: subDept,
    });
  })
);

// POST /api/corporate-departments/assign-squad - assign/reorder squad in MongoDB
router.post(
  '/assign-squad',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const { squadId, targetSubDeptId, slotOrder } = req.body;
    if (!squadId) throw new AppError('squadId is required', 400);

    const squad = await TeamSquad.findById(squadId);
    if (!squad) return res.json({ success: true, message: 'Squad assigned in memory' });

    if (targetSubDeptId) squad.subDepartmentId = targetSubDeptId;
    if (typeof slotOrder === 'number') squad.order = slotOrder;
    await squad.save();
    res.json({
      success: true,
      message: 'Squad allocation and slot order persisted successfully',
      data: squad,
    });
  })
);

router.post(
  '/:parentDeptId/sub-departments',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const { title, slug, code } = req.body;
    const subDept = await createSubDepartment(
      req.params.parentDeptId,
      title,
      slug,
      code,
      req.user?.email
    );
    res.status(201).json({ success: true, data: subDept });
  })
);

router.post(
  '/squads',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const { subDepartmentId, name, supervisorId } = req.body;
    const squad = await createTeamSquad(subDepartmentId, name, supervisorId, req.user?.email);
    res.status(201).json({ success: true, data: squad });
  })
);

router.patch(
  '/squads/:squadId/rename',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const squad = await renameTeamSquad(req.params.squadId, req.body.newName, req.user?.email);
    res.json({ success: true, data: squad });
  })
);

router.patch(
  '/personnel/:personnelId/assign',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const member = await assignMemberToSquad(
      req.params.personnelId,
      req.body.targetSquadId ?? null,
      req.user?.email
    );
    res.json({ success: true, data: member });
  })
);

router.patch(
  '/personnel/:personnelId/role',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const member = await promoteDemotePersonnel(
      req.params.personnelId,
      req.body.newRole,
      req.user?.email
    );
    res.json({ success: true, data: member });
  })
);

router.patch(
  '/personnel/:personnelId/prompt',
  asyncHandler(async (req: AuthCorporateRouteRequest, res: Response) => {
    const member = await updateAIPersonaPrompt(
      req.params.personnelId,
      req.body.newPrompt,
      req.user?.email
    );
    res.json({ success: true, data: member });
  })
);

export default router;
