import { Router } from 'express';
import { prisma } from '../database.js';
import { type AuthRequest } from '../middleware/auth.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { requireMinRole } from '../middleware/rbac.js';
import { createLogger } from '../utils/logger.js';
import { documentId, documentOwner, validateDocumentLinks, vaultKey } from '../services/henry/documentVault.js';
import { driveConfigured, driveOAuth } from '../services/henry/driveGoogle.js';
import { disconnectDrive, finishDriveOAuth, startDriveOAuth, type DriveConnectionData } from '../services/henry/driveConnection.js';
import { openDrive } from '../services/henry/driveCrypto.js';
import { approveDriveFolders, downloadDriveSource, driveLimits, freshDriveSource, indexDrive, reviewDriveSource, searchDrive } from '../services/henry/driveIndex.js';

const router = Router();
const log = createLogger('HenryDriveRoutes');
router.use(requireMinRole('agent'), (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});
const owner = (req: AuthRequest) => documentOwner(req.user?.id);
const session = (req: AuthRequest) => req.get('authorization') || '';
router.get('/status', asyncHandler(async (req: AuthRequest, res) => {
  const ownerUserId = owner(req);
  let configured = driveConfigured();
  try { vaultKey(); driveOAuth(); } catch { configured = false; }
  if (!configured) { res.json({ success: true, data: { configured: false, connected: false, roots: [] } }); return; }
  const row = await prisma.henryDriveConnection.findUnique({ where: { ownerUserId } });
  const data = row ? openDrive<DriveConnectionData>(row.encryptedPayload) : null;
  res.json({ success: true, data: { configured, connected: !!data, roots: data?.roots || [],
    identity: data ? JSON.parse(data.identity).label : undefined, indexedAt: data?.indexedAt, partial: data?.partial } });
}));
router.post('/connect', asyncHandler(async (req: AuthRequest, res) => {
  res.json({ success: true, data: await startDriveOAuth(owner(req), session(req)) });
}));
router.post('/finish', asyncHandler(async (req: AuthRequest, res) => {
  await finishDriveOAuth(owner(req), session(req), req.body || {});
  res.json({ success: true, data: { connected: true } });
}));
router.post('/folders', asyncHandler(async (req: AuthRequest, res) => {
  res.json({ success: true, data: { roots: await approveDriveFolders(owner(req), req.body || {}) } });
}));
router.post('/index', asyncHandler(async (req: AuthRequest, res) => {
  res.json({ success: true, data: await indexDrive(owner(req)) });
}));
router.post('/search', asyncHandler(async (req: AuthRequest, res) => {
  res.json({ success: true, data: await searchDrive(owner(req), req.body || {}) });
}));
router.post('/sources/:id/review', asyncHandler(async (req: AuthRequest, res) => {
  res.json({ success: true, data: await reviewDriveSource(owner(req), req.params.id, req.body || {}) });
}));
router.post('/sources/:id/original', asyncHandler(async (req: AuthRequest, res) => {
  const original = await downloadDriveSource(owner(req), req.params.id, req.body?.version);
  res.setHeader('X-Henry-Drive-Proof', original.proof);
  res.setHeader('Content-Type', original.mime);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', 'attachment; filename="drive-original"');
  res.send(original.bytes);
}));
router.get('/dossiers/:kind/:entityId', asyncHandler(async (req: AuthRequest, res) => {
  const ownerUserId = owner(req);
  const map = { client: 'leadId', property: 'propertyId', tenancy: 'tenancyId', transaction: 'transactionId' } as const;
  const kind = req.params.kind;
  if (typeof kind !== 'string' || !Object.hasOwn(map, kind)) throw new AppError('Invalid dossier type', 400);
  const field = map[kind as keyof typeof map];
  const entityId = documentId(req.params.entityId);
  await validateDocumentLinks(ownerUserId, { [field]: entityId });
  const rows = await prisma.henryDriveSource.findMany({ where: { ownerUserId, [field]: entityId }, take: 26, orderBy: { id: 'asc' } });
  const sources = [];
  const deadline = Date.now() + driveLimits.scanMilliseconds;
  let partial = rows.length > 25;
  for (const row of rows.slice(0, 25)) {
    if (Date.now() >= deadline) { partial = true; break; }
    try {
      const fresh = await freshDriveSource(ownerUserId, row.id);
      if (fresh.source.reviewedVersion === fresh.info.version)
        sources.push({ id: row.id, name: fresh.info.name, version: fresh.info.version, modified: fresh.info.modified, stale: false });
    } catch {
      sources.push({ id: row.id, name: 'Stale or unavailable Drive citation — review again', stale: true });
    }
  }
  res.json({ success: true, data: { sources, partial, inventoryOnly: true } });
}));
router.post('/disconnect', asyncHandler(async (req: AuthRequest, res) => {
  if (req.body?.confirmed !== true) throw new AppError('Confirm clearing this connection and its local index', 400);
  await disconnectDrive(owner(req));
  res.json({ success: true, data: { disconnected: true } });
}));
// Never send provider error objects (which can include codes, headers and credentials) to logs or clients.
router.use((error: unknown, _req: AuthRequest, _res: unknown, next: (error: Error) => void) => {
  if (error instanceof AppError) { next(error); return; }
  log.warn('Drive operation failed; no provider details recorded');
  next(new AppError('Drive unavailable. Check account access, reconnect or retry.', 502));
});
export default router;
