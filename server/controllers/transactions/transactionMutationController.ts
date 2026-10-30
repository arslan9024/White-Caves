/**
 * Transaction Mutation Controller
 * Handles transaction creation, status progression with KYC checks, and deletion.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { validate, rules, validateIdParam } from '../../utils/validate.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { AppError } from '../../middleware/errorHandler.js';
import { RISKY_AMOUNT_AED } from '../../middleware/kycGate.js';
import { RISKY_TRANSACTION_AMOUNT_AED } from './transactionCommon.js';

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  // AUTHORIZATION: Only owner, manager, finance, or agents can create transactions
  const allowedRoles = ['owner', 'manager', 'finance', 'agent'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — insufficient permissions to create transactions', 403);
  }

  const { type, amount, propertyId, leadId, agentId, closingDate, notes } = req.body;

  validate(req.body, {
    amount: rules.positiveNumber('Amount'),
    type: rules.oneOf('Transaction type', ['sale', 'lease', 'rental']),
    propertyId: rules.optionalMongoId('Property ID'),
    leadId: rules.optionalMongoId('Lead ID'),
    agentId: rules.optionalMongoId('Agent ID'),
    notes: rules.optionalString('Notes'),
  });

  const parsedAmount = parseFloat(amount);
  const transactionType = type || 'sale';

  // W4-004 compliance baseline: risky transaction flows require verified KYC.
  // Risk definition: any sale OR amount >= AED 500k.
  const isRiskyTransaction =
    transactionType === 'sale' || parsedAmount >= RISKY_TRANSACTION_AMOUNT_AED;
  if (isRiskyTransaction) {
    if (!leadId) {
      throw new AppError(
        'KYC verification required: risky transactions must be linked to a verified lead',
        400
      );
    }

    const linkedLead = await prisma.lead.findUnique({
      where: { id: String(leadId) },
      select: { id: true, tags: true },
    });

    if (!linkedLead) {
      throw new AppError('Linked lead not found for KYC verification', 400);
    }

    const hasVerifiedKyc =
      Array.isArray(linkedLead.tags) &&
      linkedLead.tags.some(tag => String(tag).toLowerCase() === 'kyc_verified');

    if (!hasVerifiedKyc) {
      throw new AppError(
        'KYC verification required: linked lead is not verified for risky transaction',
        403
      );
    }
  }

  // Validate closingDate if provided
  let validClosingDate: Date | null = null;
  if (closingDate) {
    const d = new Date(closingDate);
    if (isNaN(d.getTime())) {
      throw new AppError('Invalid closing date format. Use ISO 8601 format (YYYY-MM-DD)', 400);
    }
    validClosingDate = d;
  }

  const transaction = await prisma.transaction.create({
    data: {
      type: transactionType,
      status: 'draft',
      amount: parsedAmount,
      propertyId: propertyId || null,
      leadId: leadId || null,
      agentId: agentId || null,
      closingDate: validClosingDate,
      notes: notes ? sanitizeString(String(notes)) : null,
      documents: [],
    },
  });

  await prisma.activity.create({
    data: {
      type: 'deal',
      action: 'created',
      description: `New ${transaction.type} transaction created — AED ${transaction.amount.toLocaleString()}`,
      userId: req.user?.id || null,
    },
  });

  res.status(201).json({ success: true, data: transaction });
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Transaction ID');
  const { status, amount, type, closingDate, notes, documents } = req.body;

  validate(req.body, {
    status: rules.oneOf('Status', [
      'draft',
      'pending',
      'active',
      'in_progress',
      'completed',
      'cancelled',
    ]),
    amount: rules.optionalPositiveNumber('Amount'),
    type: rules.oneOf('Transaction type', ['sale', 'lease', 'rental']),
    documents: rules.optionalArray('Documents'),
  });

  // Wrap in Prisma transaction for atomicity (prevent race conditions)
  const transaction = await prisma.$transaction(async tx => {
    const existing = await tx.transaction.findUnique({ where: { id } });
    if (!existing) throw new AppError('Transaction not found', 404);

    // AUTHORIZATION: Only admins/managers/finance/agents can update transactions
    const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'agent'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('You do not have permission to update this transaction', 403);
    }

    // P0-013: KYC gate — block risky status transitions without verified lead
    const riskyStatuses = ['in_progress', 'completed'];
    if (status && riskyStatuses.includes(status)) {
      const effectiveType = type ?? existing.type;
      const effectiveAmount = amount != null ? parseFloat(amount) : Number(existing.amount);
      const isRisky = effectiveType === 'sale' || effectiveAmount >= RISKY_AMOUNT_AED;

      if (isRisky) {
        if (!existing.leadId) {
          throw new AppError(
            'KYC required: risky transactions must reference a verified lead (leadId missing)',
            400
          );
        }
        const lead = await tx.lead.findUnique({
          where: { id: existing.leadId },
          select: { id: true, tags: true },
        });
        if (!lead) throw new AppError('KYC check failed: lead not found', 400);
        const hasKyc =
          Array.isArray(lead.tags) &&
          lead.tags.some((t: unknown) => String(t).toLowerCase() === 'kyc_verified');
        if (!hasKyc) {
          throw new AppError(
            'KYC verification required: lead must be verified before this transaction can proceed',
            403
          );
        }
      }
    }

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = sanitizeString(String(status));
    if (amount !== undefined) {
      const parsed = parseFloat(amount);
      if (isNaN(parsed)) throw new AppError('Amount must be a valid number', 400);
      data.amount = parsed;
    }
    if (type !== undefined) data.type = type;
    if (closingDate !== undefined) {
      if (closingDate) {
        const d = new Date(closingDate);
        if (isNaN(d.getTime())) {
          throw new AppError(
            'Invalid closing date format. Use ISO 8601 format (YYYY-MM-DD)',
            400
          );
        }
        data.closingDate = d;
      } else {
        data.closingDate = null;
      }
    }
    if (notes !== undefined) data.notes = notes ? sanitizeString(String(notes)) : null;
    if (documents !== undefined)
      data.documents = Array.isArray(documents)
        ? documents.map((d: unknown) => (typeof d === 'string' ? sanitizeString(d) : String(d)))
        : [];

    const updated = await tx.transaction.update({ where: { id }, data });

    const statusChanged = status !== undefined && status !== null && status !== existing.status;
    if (statusChanged) {
      await tx.activity.create({
        data: {
          type: 'deal',
          action: 'status_changed',
          description: `Transaction ${existing.status} → ${status} (AED ${Number(updated.amount).toLocaleString()})`,
          userId: req.user?.id || null,
          leadId: existing.leadId ?? null,
          metadata: { transactionId: id, from: existing.status, to: status },
        },
      });
    }

    return updated;
  });

  res.status(200).json({ success: true, data: transaction });
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Transaction ID');
  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing) throw new AppError('Transaction not found', 404);

  // AUTHORIZATION: Only admins/managers can delete transactions
  const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
  if (!isAdmin) {
    throw new AppError('Only managers can delete transactions', 403);
  }

  await prisma.$transaction(async tx => {
    await tx.transaction.delete({ where: { id } });

    await tx.activity.create({
      data: {
        type: 'deal',
        action: 'deleted',
        description: `Transaction deleted — AED ${existing.amount.toLocaleString()} (by ${req.user?.email})`,
        userId: req.user?.id || null,
      },
    });
  });

  res.status(200).json({ success: true, message: 'Transaction deleted' });
};

