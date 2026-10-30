/**
 * complianceKycController.ts
 * Handlers for KYC document uploads, review queues, and approval/rejection workflows.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import {
  ensureComplianceManagerRole,
  normalizeMetadata,
} from './complianceCommon.js';

const db = prisma as any;

export async function uploadKycDocument(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'agent'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — KYC upload requires agent role or above', 403);
  }

  const { leadId } = req.params as Record<string, string>;
  const { documentType, documentUrl, fileName, mimeType, fileSize, notes } = req.body;

  if (!documentType || !documentUrl) {
    throw new AppError('documentType and documentUrl are required', 400);
  }

  const lead = await db.lead.findUnique({ where: { id: leadId }, select: { id: true } });
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  const created = await db.activity.create({
    data: {
      type: 'compliance',
      action: 'kyc_document_uploaded',
      description: `KYC document uploaded (${sanitizeString(String(documentType)).substring(0, 80)})`,
      userId: req.user?.id || null,
      leadId,
      metadata: {
        documentType: sanitizeString(String(documentType)).substring(0, 80),
        documentUrl: sanitizeString(String(documentUrl)).substring(0, 1000),
        fileName: fileName ? sanitizeString(String(fileName)).substring(0, 200) : null,
        mimeType: mimeType ? sanitizeString(String(mimeType)).substring(0, 120) : null,
        fileSize: Number.isFinite(Number(fileSize)) ? Number(fileSize) : null,
        notes: notes ? sanitizeString(String(notes)).substring(0, 2000) : null,
        reviewStatus: 'pending',
        uploadedAt: new Date().toISOString(),
      },
    },
  });

  res.status(201).json({
    success: true,
    data: {
      id: created.id,
      leadId,
      reviewStatus: 'pending',
      createdAt: created.createdAt,
    },
  });
}

export async function getLeadKycDocuments(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'agent'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — KYC documents require agent role or above', 403);
  }

  const { leadId } = req.params;
  const docs = await db.activity.findMany({
    where: {
      type: 'compliance',
      action: 'kyc_document_uploaded',
      leadId,
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const mapped = docs.map((d: any) => {
    const metadata = normalizeMetadata(d.metadata);
    return {
      id: d.id,
      leadId: d.leadId,
      documentType: metadata.documentType || null,
      documentUrl: metadata.documentUrl || null,
      fileName: metadata.fileName || null,
      reviewStatus: metadata.reviewStatus || 'pending',
      reviewDecision: metadata.reviewDecision || null,
      reviewComments: metadata.reviewComments || null,
      reviewedBy: metadata.reviewedBy || null,
      reviewedAt: metadata.reviewedAt || null,
      uploadedAt: metadata.uploadedAt || d.createdAt?.toISOString?.() || new Date().toISOString(),
    };
  });

  res.json({ success: true, data: mapped });
}

export async function getKycReviewQueue(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — KYC review queue requires manager role', 403);
  }

  const take = Math.min(parseInt(String(req.query.limit || '100'), 10) || 100, 300);
  const docs = await db.activity.findMany({
    where: {
      type: 'compliance',
      action: 'kyc_document_uploaded',
    },
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      lead: { select: { id: true, name: true, email: true, phone: true, status: true } },
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  const pending = docs.filter((d: any) => {
    const metadata = normalizeMetadata(d.metadata);
    return (metadata.reviewStatus || 'pending') === 'pending';
  });

  res.json({
    success: true,
    data: pending.map((d: any) => {
      const metadata = normalizeMetadata(d.metadata);
      return {
        id: d.id,
        leadId: d.leadId,
        lead: d.lead,
        uploadedBy: d.user,
        documentType: metadata.documentType || null,
        documentUrl: metadata.documentUrl || null,
        uploadedAt: metadata.uploadedAt || d.createdAt.toISOString(),
        reviewStatus: metadata.reviewStatus || 'pending',
      };
    }),
    summary: {
      totalFetched: docs.length,
      pending: pending.length,
    },
  });
}

export async function reviewKycDocument(req: Request, res: Response): Promise<void> {
  ensureComplianceManagerRole(req.user?.role, 'Access denied — KYC review requires manager role');

  const { documentId } = req.params as Record<string, string>;
  const { decision, comments } = req.body;
  if (!['approved', 'rejected'].includes(String(decision))) {
    throw new AppError('decision must be one of: approved, rejected', 400);
  }

  const docActivity = await db.activity.findUnique({ where: { id: documentId } });
  if (
    !docActivity ||
    docActivity.type !== 'compliance' ||
    docActivity.action !== 'kyc_document_uploaded'
  ) {
    throw new AppError('KYC document record not found', 404);
  }

  const currentMetadata = normalizeMetadata(docActivity.metadata);
  const nextMetadata = {
    ...currentMetadata,
    reviewStatus: 'reviewed',
    reviewDecision: decision,
    reviewComments: comments ? sanitizeString(String(comments)).substring(0, 2000) : null,
    reviewedBy: req.user?.id || null,
    reviewedAt: new Date().toISOString(),
  };

  const updated = await db.activity.update({
    where: { id: documentId },
    data: { metadata: nextMetadata },
  });

  if (docActivity.leadId) {
    const lead = await db.lead.findUnique({
      where: { id: docActivity.leadId },
      select: { id: true, tags: true },
    });

    if (lead) {
      const normalizedTags = (lead.tags || []).map((t: unknown) => String(t).toLowerCase());
      const hasVerified = normalizedTags.includes('kyc_verified');
      const hasRejected = normalizedTags.includes('kyc_rejected');

      let nextTags = [...(lead.tags || [])];
      if (decision === 'approved') {
        if (!hasVerified) nextTags.push('kyc_verified');
        nextTags = nextTags.filter(t => String(t).toLowerCase() !== 'kyc_rejected');
      } else {
        nextTags = nextTags.filter(t => String(t).toLowerCase() !== 'kyc_verified');
        if (!hasRejected) nextTags.push('kyc_rejected');
      }

      await db.lead.update({
        where: { id: lead.id },
        data: { tags: nextTags },
      });
    }
  }

  await db.activity.create({
    data: {
      type: 'compliance',
      action: 'kyc_document_reviewed',
      description: `KYC document ${decision}`,
      userId: req.user?.id || null,
      leadId: docActivity.leadId || null,
      metadata: {
        documentActivityId: documentId,
        decision,
        comments: comments ? sanitizeString(String(comments)).substring(0, 2000) : null,
      },
    },
  });

  res.json({
    success: true,
    data: {
      id: updated.id,
      decision,
      metadata: nextMetadata,
    },
  });
}

