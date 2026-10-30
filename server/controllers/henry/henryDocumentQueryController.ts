import { Response } from 'express';
import { prisma } from '../../database.js';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError, asyncHandler } from '../../middleware/errorHandler.js';
import {
  activeDocumentFilter,
  decodeDocument,
  decodeSource,
  documentId,
  documentOwner,
  referenceHash,
  validateDocumentLinks,
  vaultKey,
  vaultOperation,
} from '../../services/henry/documentVault.js';

export const searchDocuments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ownerUserId = documentOwner(req.user?.id);
  vaultKey();
  const filters = req.method === 'POST' ? req.body : req.query;
  if (!filters || typeof filters !== 'object' || Array.isArray(filters)) {
    throw new AppError('Search metadata required', 400);
  }
  if (req.method === 'GET' && 'referenceNumber' in filters) {
    throw new AppError(
      'Use POST /documents/search with referenceNumber in the JSON body',
      400
    );
  }
  const limit = Math.max(1, Math.min(100, Math.floor(Number(filters.limit) || 50)));
  const page = Math.max(1, Math.floor(Number(filters.page) || 1));
  if (!Number.isFinite(limit) || !Number.isSafeInteger(page) || page > 100000) {
    throw new AppError('Invalid pagination', 400);
  }
  if (filters.q || filters.clientName) {
    throw new AppError(
      'Use exact referenceNumber with docType; substring search is not supported',
      400
    );
  }
  if (
    filters.referenceNumber &&
    (typeof filters.referenceNumber !== 'string' || filters.referenceNumber.length > 100)
  ) {
    throw new AppError('Invalid document reference', 400);
  }
  const links = await validateDocumentLinks(ownerUserId, filters);
  const status = String(filters.expiryStatus || '');
  if (status && !['expired', 'soon_expiring', 'current', 'unknown'].includes(status)) {
    throw new AppError('Invalid expiry filter', 400);
  }
  const today = new Date(Math.floor(Date.now() / 86400000) * 86400000);
  const soon = new Date(Date.now() + 30 * 86400000);
  const where = {
    ownerUserId,
    ...activeDocumentFilter,
    ...(links.leadId ? { leadId: links.leadId } : {}),
    ...(links.propertyId ? { propertyId: links.propertyId } : {}),
    ...(links.tenancyId ? { tenancyId: links.tenancyId } : {}),
    ...(links.transactionId ? { transactionId: links.transactionId } : {}),
    ...(filters.docType ? { docType: String(filters.docType) } : {}),
    ...(filters.referenceNumber
      ? {
          referenceHash: referenceHash(
            ownerUserId,
            String(filters.docType || ''),
            filters.referenceNumber
          ),
        }
      : {}),
    ...(status === 'unknown'
      ? { AND: [{ OR: [{ expiryAt: null }, { expiryAt: { isSet: false } }] }] }
      : status
      ? {
          expiryAt:
            status === 'expired'
              ? { lt: today }
              : status === 'soon_expiring'
              ? { gte: today, lt: soon }
              : { gte: soon },
        }
      : {}),
  };
  if (filters.referenceNumber && !filters.docType) {
    throw new AppError('Document type required for exact reference search', 400);
  }
  const rows = await vaultOperation('list', () =>
    prisma.henryScannedDocument.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * limit,
      take: limit + 1,
      select: {
        id: true,
        docType: true,
        encryptedPayload: true,
        createdAt: true,
        updatedAt: true,
        replacedById: true,
        leadId: true,
        propertyId: true,
        retentionUntil: true,
        reminderDismissedAt: true,
      },
    })
  );
  const data = rows.slice(0, limit).map(row => {
    const decoded = decodeDocument(row);
    return {
      id: row.id,
      docType: row.docType,
      title: 'Reviewed document',
      referenceNumber: `••••${String(decoded.referenceNumber).slice(-4)}`,
      createdAt: row.createdAt,
      leadId: row.leadId,
      propertyId: row.propertyId,
      expiryStatus: decoded.expiryStatus,
      reminderDismissedAt: row.reminderDismissedAt,
      retentionUntil: row.retentionUntil,
    };
  });
  res.json({ success: true, count: data.length, page, hasMore: rows.length > limit, data });
});

export const getDocumentLinkOptions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const owner = documentOwner(req.user?.id);
  const kind = req.query.kind;
  const page = Number(req.query.page ?? 1);
  if (
    typeof kind !== 'string' ||
    !['lead', 'property', 'tenancy', 'transaction'].includes(kind) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 1000
  ) {
    throw new AppError('Valid link kind and page (1–1000) required', 400);
  }
  const data = await vaultOperation('link-options', async () =>
    kind === 'lead'
      ? prisma.lead.findMany({
          where: { assignedToId: owner },
          select: { id: true, name: true },
          orderBy: { id: 'asc' },
          skip: (page - 1) * 25,
          take: 26,
        })
      : kind === 'property'
      ? prisma.property.findMany({
          where: { userId: owner },
          select: { id: true, title: true },
          orderBy: { id: 'asc' },
          skip: (page - 1) * 25,
          take: 26,
        })
      : kind === 'tenancy'
      ? prisma.lease.findMany({
          where: { property: { userId: owner } },
          select: { id: true, leaseNumber: true },
          orderBy: { id: 'asc' },
          skip: (page - 1) * 25,
          take: 26,
        })
      : prisma.transaction.findMany({
          where: { agentId: owner },
          select: { id: true, type: true },
          orderBy: { id: 'asc' },
          skip: (page - 1) * 25,
          take: 26,
        })
  );
  res.json({
    success: true,
    data: data.slice(0, 25).map(row => ({
      id: row.id,
      name:
        'name' in row
          ? row.name
          : 'title' in row
          ? row.title
          : 'leaseNumber' in row
          ? row.leaseNumber || `Tenancy …${row.id.slice(-4)}`
          : `${row.type} …${row.id.slice(-4)}`,
    })),
    hasMore: data.length > 25,
  });
});

export const getLatestDocumentByType = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ownerUserId = documentOwner(req.user?.id);
  vaultKey();
  const row = await vaultOperation('latest', () =>
    prisma.henryScannedDocument.findFirst({
      where: { ownerUserId, docType: String(req.params.docType), ...activeDocumentFilter },
      orderBy: { createdAt: 'desc' },
    })
  );
  if (!row) throw new AppError('Document not found', 404);
  await vaultOperation('audit', () =>
    prisma.henryDocumentAudit.create({ data: { ownerUserId, documentId: row.id, action: 'latest' } })
  );
  res.json({ success: true, data: decodeDocument(row) });
});

export const serveDocumentOrDownload = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ownerUserId = documentOwner(req.user?.id);
  vaultKey();
  const id = documentId(req.params.id);
  const isDownload = req.path.endsWith('/download');
  const row = await vaultOperation('read', () =>
    prisma.henryScannedDocument.findFirst({ where: { id, ownerUserId } })
  );
  if (!row) throw new AppError('Document not found', 404);
  await vaultOperation('audit', () =>
    prisma.henryDocumentAudit.create({
      data: { ownerUserId, documentId: id, action: isDownload ? 'download' : 'read' },
    })
  );
  res.setHeader('Cache-Control', 'no-store');
  if (isDownload) {
    if (!row.encryptedSource) {
      throw new AppError('No original archived; reviewed fields remain available in detail', 404);
    }
    const index = Number(req.query.side || 0);
    if (!Number.isInteger(index) || index < 0 || index > 1) {
      throw new AppError('Invalid original side', 400);
    }
    const source = await vaultOperation('decrypt original', async () =>
      decodeSource(row.encryptedSource!, index)
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="original-${index}.${
        source.mime === 'application/pdf' ? 'pdf' : source.mime === 'image/png' ? 'png' : 'jpg'
      }"`
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.type(source.mime).send(source.bytes);
    return;
  }
  res.json({ success: true, data: decodeDocument(row) });
});

