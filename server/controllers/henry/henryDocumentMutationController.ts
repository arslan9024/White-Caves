import { Response } from 'express';
import { prisma } from '../../database.js';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError, asyncHandler } from '../../middleware/errorHandler.js';
import {
  activeDocumentFilter,
  decodeDocument,
  documentId,
  documentOwner,
  prepareDocument,
  prepareSource,
  validateDocumentLinks,
  vaultKey,
  vaultOperation,
} from '../../services/henry/documentVault.js';
import { isGenericDocumentType } from '../../shared/henryDocumentRegistry.js';
import { validateDriveProvenance } from '../../services/henry/driveIndex.js';

export const saveDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ownerUserId = documentOwner(req.user?.id);
  if (req.body.metadata) {
    try {
      req.body = JSON.parse(req.body.metadata);
    } catch {
      throw new AppError('Invalid document metadata', 400);
    }
  }
  const sources = (req.files as Express.Multer.File[] | undefined) || [];
  if (
    (['passport', 'tenancy_contract'].includes(req.body.docType) ||
      isGenericDocumentType(req.body.docType)) &&
    !sources.length
  ) {
    throw new AppError('Original source required for archival', 400);
  }
  const data = {
    ...prepareDocument(req.body, ownerUserId),
    ...prepareSource(sources),
    ...(await validateDriveProvenance(ownerUserId, req.body.driveOrigin, sources)),
  };
  const links = await validateDocumentLinks(ownerUserId, req.body);
  const result = await vaultOperation('save', () =>
    prisma.$transaction(async tx => {
      const replacesId = req.body.replacesId ? documentId(req.body.replacesId) : null;
      if (replacesId) {
        const previous = await tx.henryScannedDocument.findFirst({
          where: { id: replacesId, ownerUserId, docType: data.docType, ...activeDocumentFilter },
        });
        if (!previous) throw new AppError('Replacement target not found', 404);
        const released = await tx.henryScannedDocument.updateMany({
          where: {
            id: replacesId,
            ownerUserId,
            ...activeDocumentFilter,
            referenceHash: previous.referenceHash,
          },
          data: { referenceHash: `archived:${replacesId}` },
        });
        if (released.count !== 1) throw new AppError('Document changed; reload before replacing', 409);
      }
      const row = await tx.henryScannedDocument.create({
        data: { ...data, ...links, ownerUserId, replacedById: null },
      });
      if (replacesId) {
        await tx.henryScannedDocument.updateMany({
          where: { id: replacesId, ownerUserId, ...activeDocumentFilter },
          data: { replacedById: row.id },
        });
      }
      await tx.henryDocumentAudit.create({
        data: { ownerUserId, documentId: row.id, action: 'save' },
      });
      return row;
    })
  );
  res.json({ success: true, data: decodeDocument(result) });
});

export const patchDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ownerUserId = documentOwner(req.user?.id);
  const id = documentId(req.params.id);
  const data = prepareDocument(req.body, ownerUserId);
  const links = await validateDocumentLinks(ownerUserId, req.body);
  const row = await vaultOperation('update', () =>
    prisma.$transaction(async tx => {
      const found = await tx.henryScannedDocument.findFirst({
        where: { id, ownerUserId, docType: data.docType, ...activeDocumentFilter },
      });
      if (!found) throw new AppError('Document not found', 404);
      const changed = await tx.henryScannedDocument.updateMany({
        where: { id, ownerUserId, updatedAt: found.updatedAt, ...activeDocumentFilter },
        data: {
          ...data,
          ...('leadId' in req.body ? { leadId: links.leadId } : {}),
          ...('propertyId' in req.body ? { propertyId: links.propertyId } : {}),
          ...('tenancyId' in req.body ? { tenancyId: links.tenancyId } : {}),
          ...('transactionId' in req.body ? { transactionId: links.transactionId } : {}),
          lifecycleStatus: 'draft',
          signedAttestedAt: null,
          ...(found.expiryAt?.getTime() !== data.expiryAt?.getTime()
            ? { reminderDismissedAt: null }
            : {}),
        },
      });
      if (changed.count !== 1) throw new AppError('Document changed; reload before updating', 409);
      await tx.henryDocumentAudit.create({ data: { ownerUserId, documentId: id, action: 'update' } });
      return tx.henryScannedDocument.findFirstOrThrow({ where: { id, ownerUserId } });
    })
  );
  res.json({ success: true, data: decodeDocument(row) });
});

export const patchDocumentReminder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ownerUserId = documentOwner(req.user?.id);
  const id = documentId(req.params.id);
  vaultKey();
  await vaultOperation('reminder', () =>
    prisma.$transaction(async tx => {
      const changed = await tx.henryScannedDocument.updateMany({
        where: { id, ownerUserId, ...activeDocumentFilter },
        data: { reminderDismissedAt: req.body.dismissed === true ? new Date() : null },
      });
      if (!changed.count) throw new AppError('Document not found', 404);
      await tx.henryDocumentAudit.create({ data: { ownerUserId, documentId: id, action: 'reminder' } });
    })
  );
  res.json({ success: true });
});

export const deleteDocumentHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ownerUserId = documentOwner(req.user?.id);
  const id = documentId(req.params.id);
  vaultKey();
  if (req.body.confirmDocumentId !== id) {
    throw new AppError('Explicit document deletion confirmation required', 400);
  }
  await vaultOperation('delete', () =>
    prisma.$transaction(async tx => {
      const deleted = await tx.henryScannedDocument.deleteMany({ where: { id, ownerUserId } });
      if (deleted.count !== 1) throw new AppError('Document not found', 404);
      await tx.henryDocumentAudit.create({
        data: { ownerUserId, documentId: id, action: 'user_requested_delete' },
      });
    })
  );
  res.json({ success: true });
});

