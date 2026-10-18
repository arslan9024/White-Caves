import { Router } from 'express';
import { prisma } from '../database.js';
import { AuthRequest } from '../middleware/auth.js';
import { requireMinRole } from '../middleware/rbac.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { activeDocumentFilter, decodeDocument, documentId, documentOwner, validateDocumentLinks, vaultKey, vaultOperation } from '../services/henry/documentVault.js';
import { answerDossier, assistanceIntent, dossierKind, lifecycleChange, readDossier } from '../services/henry/dossiers.js';

const router = Router();
router.get('/dossiers/:kind/:entityId', requireMinRole('agent'), asyncHandler(async (req: AuthRequest, res) => {
  const owner = documentOwner(req.user?.id);
  const kind = dossierKind(req.params.kind);
  const id = documentId(req.params.entityId);
  const dossier = await vaultOperation('dossier', () => readDossier(owner, kind, id));
  res.json({ success: true, data: dossier.result });
}));
router.post('/dossiers/:kind/:entityId/assist', requireMinRole('agent'), asyncHandler(async (req: AuthRequest, res) => {
  const owner = documentOwner(req.user?.id);
  const kind = dossierKind(req.params.kind);
  const id = documentId(req.params.entityId);
  const intent = assistanceIntent(req.body?.question);
  const data = await vaultOperation('dossier-assist', async () => answerDossier(intent, await readDossier(owner, kind, id)));
  res.json({ success: true, data });
}));
for (const action of ['lifecycle', 'links'] as const) {
  router.patch(`/:id/${action}`, requireMinRole('agent'), asyncHandler(async (req: AuthRequest, res) => {
    const ownerUserId = documentOwner(req.user?.id);
    const id = documentId(req.params.id);
    vaultKey();
    const change = lifecycleChange(action === 'links' ? { ...req.body, status: 'draft' } : req.body);
    const links = action === 'links' ? await vaultOperation('validate-links', () => validateDocumentLinks(ownerUserId, req.body)) : null;
    if (links && !Object.keys(links).some(key => Object.hasOwn(req.body, key)))
      throw new AppError('At least one explicit dossier link required', 400);
    const row = await vaultOperation(action, () => prisma.$transaction(async tx => {
      const found = await tx.henryScannedDocument.findFirst({ where: { id, ownerUserId, ...activeDocumentFilter } });
      if (!found) throw new AppError('Document not found', 404);
      if (action === 'lifecycle' && found.docType !== 'tenancy_contract')
        throw new AppError('Signature attestation applies only to tenancy agreements', 400);
      const changed = await tx.henryScannedDocument.updateMany({
        where: { id, ownerUserId, updatedAt: change.updatedAt, ...activeDocumentFilter },
        data: links ? Object.fromEntries(Object.entries(links).filter(([key]) => Object.hasOwn(req.body, key))) : { lifecycleStatus: change.lifecycleStatus,
          signedAttestedAt: change.lifecycleStatus === 'signed' ? new Date() : null },
      });
      if (changed.count !== 1) throw new AppError('Document changed; reload before confirming', 409);
      await tx.henryDocumentAudit.create({ data: { ownerUserId, documentId: id,
        action: links ? 'links_confirmed' : `user_attested_${change.lifecycleStatus}` } });
      return tx.henryScannedDocument.findFirstOrThrow({ where: { id, ownerUserId } });
    }));
    res.json({ success: true, data: decodeDocument(row) });
  }));
}
export default router;
