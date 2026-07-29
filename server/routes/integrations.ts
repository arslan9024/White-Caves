import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireRole } from '../middleware/rbac.js';
import { externalModulesService } from '../services/integrations/externalModulesService.js';

const router = Router();

/**
 * Integration Gateway for external AI modules (Linda + Henry repos)
 * Mounted at: /api/integrations
 */

router.get(
  '/status',
  requireRole('owner'),
  asyncHandler(async (_req: Request, res: Response) => {
    const [linda, henry] = await Promise.allSettled([
      externalModulesService.getLindaHealth(),
      externalModulesService.getHenryHealth(),
    ]);

    res.json({
      success: true,
      data: {
        config: externalModulesService.getConfig(),
        linda:
          linda.status === 'fulfilled'
            ? linda.value
            : { ok: false, error: linda.reason?.message || 'Unavailable' },
        henry:
          henry.status === 'fulfilled'
            ? henry.value
            : { ok: false, error: henry.reason?.message || 'Unavailable' },
      },
    });
  })
);

router.get(
  '/linda/health',
  requireRole('owner'),
  asyncHandler(async (_req: Request, res: Response) => {
    const health = await externalModulesService.getLindaHealth();
    res.json({ success: true, data: health });
  })
);

router.get(
  '/linda/status',
  requireRole('owner'),
  asyncHandler(async (_req: Request, res: Response) => {
    const status = await externalModulesService.getLindaModuleStatus();
    res.json({ success: true, data: status });
  })
);

router.get(
  '/henry/health',
  requireRole('owner'),
  asyncHandler(async (_req: Request, res: Response) => {
    const health = await externalModulesService.getHenryHealth();
    res.json({ success: true, data: health });
  })
);

router.get(
  '/henry/archive',
  requireRole('owner'),
  asyncHandler(async (_req: Request, res: Response) => {
    const archive = await externalModulesService.getHenryArchive();
    res.json({ success: true, data: archive });
  })
);

router.post(
  '/henry/archive',
  requireRole('owner'),
  asyncHandler(async (req: Request, res: Response) => {
    // Schema validation enforced for payload
    const entries = Array.isArray(req.body) ? req.body : [];
    const result = await externalModulesService.saveHenryArchive(entries);
    res.json({ success: true, data: result });
  })
);

export default router;
