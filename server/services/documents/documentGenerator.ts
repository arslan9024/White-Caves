// @ts-nocheck
/**
 * Document Generator — Renders Handlebars templates into documents
 *
 * Features:
 *   - Render 6 document types with dynamic variables
 *   - Store rendered HTML in Document model
 *   - Version tracking (auto-increment on re-generation)
 *   - Document listing and retrieval
 *   - Activity logging for audit trail
 */

import Handlebars from 'handlebars';
import { prisma } from '../../database.js';
import { logger } from '../../utils/logger.js';
import { DOCUMENT_TEMPLATES, DOCUMENT_TYPE_LABELS } from './documentTemplates.js';
const db = prisma as any;

// ─── Types ──────────────────────────────────────────────────────────────

export interface GenerateDocumentInput {
  type: string;                         // mou, form_f, noc, commission_invoice, viewing_report, offer_letter
  variables: Record<string, string>;    // template variables
  transactionId?: string;
  leadId?: string;
  propertyId?: string;
  commissionId?: string;
  generatedById?: string;
}

export interface GeneratedDocument {
  id: string;
  type: string;
  title: string;
  version: number;
  status: string;
  htmlContent: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

// ─── Register Handlebars helpers ────────────────────────────────────────

Handlebars.registerHelper('formatCurrency', (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return isNaN(num) ? '0.00' : num.toLocaleString('en-AE', { minimumFractionDigits: 2 });
});

Handlebars.registerHelper('uppercase', (str: string) => (str || '').toUpperCase());
Handlebars.registerHelper('lowercase', (str: string) => (str || '').toLowerCase());

// ─── Generate a document ────────────────────────────────────────────────

/**
 * Generate a document from a template type + variables.
 *
 * 1. Validates template type exists
 * 2. Compiles Handlebars template
 * 3. Renders with provided variables
 * 4. Stores in Document model (with version tracking)
 * 5. Logs activity
 */
export async function generateDocument(
  input: GenerateDocumentInput,
): Promise<GeneratedDocument> {
  const { type, variables, transactionId, leadId, propertyId, commissionId, generatedById } = input;

  // 1. Validate template type
  const templateSource = DOCUMENT_TEMPLATES[type];
  if (!templateSource) {
    throw new Error(
      `Unknown document type: "${type}". Valid types: ${Object.keys(DOCUMENT_TEMPLATES).join(', ')}`,
    );
  }

  // 2. Auto-fill standard variables
  const now = new Date();
  const enrichedVars: Record<string, string> = {
    ...variables,
    generatedAt: now.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric',
    }),
    date: variables.date || now.toLocaleDateString('en-GB'),
    referenceNumber: variables.referenceNumber || generateRefNumber(type),
  };

  // 3. Compile and render
  const template = Handlebars.compile(templateSource);
  const htmlContent = template(enrichedVars);

  // 4. Determine version (auto-increment if same type+entity exists)
  const title = DOCUMENT_TYPE_LABELS[type] || type;
  let version = 1;

  if (transactionId || leadId || propertyId || commissionId) {
    const existing = await db.document.findMany({
      where: {
        type,
        ...(transactionId && { transactionId }),
        ...(leadId && { leadId }),
        ...(propertyId && { propertyId }),
        ...(commissionId && { commissionId }),
      },
      orderBy: { version: 'desc' },
      take: 1,
    });
    if (existing.length > 0) {
      version = existing[0].version + 1;
    }
  }

  // 5. Store in DB
  const document = await db.document.create({
    data: {
      type,
      title: `${title} v${version}`,
      version,
      status: 'draft',
      htmlContent,
      metadata: {
        variables: enrichedVars,
        templateType: type,
        generatedAt: now.toISOString(),
      },
      transactionId: transactionId || null,
      leadId: leadId || null,
      propertyId: propertyId || null,
      commissionId: commissionId || null,
      generatedById: generatedById || null,
    },
  });

  // 6. Log activity
  if (leadId) {
    await db.activity.create({
      data: {
        type: 'lead',
        action: 'document_generated',
        description: `${title} v${version} generated`,
        leadId,
        userId: generatedById || null,
        metadata: { documentId: document.id, documentType: type, version },
      },
    });
  }

  logger.info(`Document generated: ${title} v${version} [${document.id}]`);

  return {
    id: document.id,
    type: document.type,
    title: document.title,
    version: document.version,
    status: document.status,
    htmlContent: document.htmlContent,
    metadata: document.metadata as Record<string, unknown> | null,
    createdAt: document.createdAt,
  };
}

// ─── Get document by ID ─────────────────────────────────────────────────

export async function getDocument(documentId: string): Promise<GeneratedDocument | null> {
  const doc = await db.document.findUnique({ where: { id: documentId } });
  if (!doc) return null;

  return {
    id: doc.id,
    type: doc.type,
    title: doc.title,
    version: doc.version,
    status: doc.status,
    htmlContent: doc.htmlContent,
    metadata: doc.metadata as Record<string, unknown> | null,
    createdAt: doc.createdAt,
  };
}

// ─── List documents ─────────────────────────────────────────────────────

export async function listDocuments(filters?: {
  type?: string;
  status?: string;
  transactionId?: string;
  leadId?: string;
  propertyId?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: GeneratedDocument[]; total: number }> {
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;

  const where: Record<string, unknown> = {};
  if (filters?.type) where.type = filters.type;
  if (filters?.status) where.status = filters.status;
  if (filters?.transactionId) where.transactionId = filters.transactionId;
  if (filters?.leadId) where.leadId = filters.leadId;
  if (filters?.propertyId) where.propertyId = filters.propertyId;

  const [total, documents] = await Promise.all([
    db.document.count({ where }),
    db.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, type: true, title: true, version: true, status: true,
        htmlContent: false, // don't send full HTML in list
        metadata: true, createdAt: true, updatedAt: true,
        transactionId: true, leadId: true, propertyId: true,
      },
    }),
  ]);

  return {
    data: documents.map((d) => ({
      id: d.id,
      type: d.type,
      title: d.title,
      version: d.version,
      status: d.status,
      htmlContent: '', // omitted in list
      metadata: d.metadata as Record<string, unknown> | null,
      createdAt: d.createdAt,
    })),
    total,
  };
}

// ─── Update document status ─────────────────────────────────────────────

export async function updateDocumentStatus(
  documentId: string,
  status: 'draft' | 'final' | 'signed' | 'archived',
): Promise<void> {
  const doc = await db.document.findUnique({ where: { id: documentId } });
  if (!doc) throw new Error(`Document not found: ${documentId}`);

  await db.document.update({
    where: { id: documentId },
    data: { status },
  });

  logger.info(`Document ${documentId} status updated to ${status}`);
}

// ─── Get available document types ───────────────────────────────────────

export function getAvailableDocumentTypes(): Array<{ type: string; label: string }> {
  return Object.entries(DOCUMENT_TYPE_LABELS).map(([type, label]) => ({ type, label }));
}

// ─── Helper: generate reference number ──────────────────────────────────

function generateRefNumber(type: string): string {
  const prefix = type.toUpperCase().replace(/_/g, '').substring(0, 3);
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
