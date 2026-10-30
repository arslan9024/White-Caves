import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError, asyncHandler } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validateIdParam } from '../../utils/validate.js';
import { generateTaxInvoice } from '../../services/invoiceService.js';
import { AuthRequest } from '../../middleware/auth.js';
import { RouteRequest, routeParamToString } from './financeCommon.js';

export const getInvoices = asyncHandler(async (req: RouteRequest, res: Response) => {
  const {
    page = '1',
    pageSize = '20',
    status,
    client,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query as Record<string, string | undefined>;

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 20));

  const where: Record<string, unknown> = {};
  if (status && status !== 'all') where.status = status as string;
  if (client) where.client = { contains: client as string, mode: 'insensitive' };

  const validSorts = ['createdAt', 'amount', 'totalAmount', 'dueDate', 'status'];
  const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
  const orderBy: Record<string, 'asc' | 'desc'> = {
    [field]: sortOrder === 'asc' ? 'asc' : 'desc',
  };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({ where, orderBy, skip: (pageNum - 1) * limit, take: limit }),
    prisma.invoice.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: invoices,
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const getInvoiceById = asyncHandler(async (req: Request, res: Response) => {
  const invoiceId = routeParamToString(req.params.id);
  if (!invoiceId) {
    throw new AppError('Invoice ID is required', 400);
  }

  validateIdParam(invoiceId, 'Invoice ID');
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new AppError('Invoice not found', 404);
  res.status(200).json({ success: true, data: invoice });
});

export const createInvoice = asyncHandler(async (req: RouteRequest, res: Response) => {
  const { client, property, amount, dueDate, notes, lineItems, vatAmount } = req.body;

  if (!client) throw new AppError('Client name is required', 400);
  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new AppError('Amount must be a positive number', 400);
  }
  if (!dueDate) throw new AppError('Due date is required', 400);

  const lastInvoice = await prisma.invoice.findFirst({ orderBy: { createdAt: 'desc' } });
  const year = new Date().getFullYear();
  let seq = 1;
  if (lastInvoice?.invoiceNumber) {
    const match = lastInvoice.invoiceNumber.match(/INV-\d{4}-(\d+)/);
    if (match) seq = parseInt(match[1]) + 1;
  }
  const invoiceNumber = `INV-${year}-${String(seq).padStart(4, '0')}`;

  const vat = Number(vatAmount) || 0;
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      client: sanitizeString(client),
      property: property ? sanitizeString(property) : null,
      amount: parsedAmount,
      vatAmount: vat,
      totalAmount: parsedAmount + vat,
      status: 'pending',
      dueDate: new Date(dueDate),
      notes: notes ? sanitizeString(notes) : null,
      lineItems: lineItems || null,
      createdById: req.user?.id || null,
    },
  });

  res.status(201).json({ success: true, data: invoice });
});

export const updateInvoice = asyncHandler(async (req: Request, res: Response) => {
  const invoiceId = routeParamToString(req.params.id);
  if (!invoiceId) {
    throw new AppError('Invoice ID is required', 400);
  }

  validateIdParam(invoiceId, 'Invoice ID');
  const existing = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!existing) throw new AppError('Invoice not found', 404);

  const { status, amount, vatAmount, notes, client, property, dueDate } = req.body;
  const data: Record<string, unknown> = {};

  if (status !== undefined) {
    const validStatuses = ['draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status))
      throw new AppError(`Invalid status. Allowed: ${validStatuses.join(', ')}`, 400);
    data.status = status;
    if (status === 'paid') data.paidAt = new Date();
  }
  if (amount !== undefined) {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed < 0)
      throw new AppError('Amount must be a valid non-negative number', 400);
    data.amount = parsed;
    const vat = vatAmount !== undefined ? Number(vatAmount) : existing.vatAmount;
    data.vatAmount = vat;
    data.totalAmount = parsed + vat;
  }
  if (notes !== undefined) data.notes = notes ? sanitizeString(String(notes)) : null;
  if (client !== undefined) data.client = sanitizeString(client);
  if (property !== undefined) data.property = property ? sanitizeString(property) : null;
  if (dueDate !== undefined) data.dueDate = new Date(dueDate);
  const invoice = await prisma.invoice.update({ where: { id: invoiceId }, data });
  res.status(200).json({ success: true, data: invoice });
});

export const deleteInvoice = asyncHandler(async (req: Request, res: Response) => {
  const invoiceId = routeParamToString(req.params.id);
  if (!invoiceId) {
    throw new AppError('Invoice ID is required', 400);
  }

  validateIdParam(invoiceId, 'Invoice ID');
  const existing = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!existing) throw new AppError('Invoice not found', 404);
  if (existing.status === 'paid') throw new AppError('Cannot delete a paid invoice', 400);
  await prisma.invoice.delete({ where: { id: invoiceId } });
  res.status(200).json({ success: true, message: 'Invoice deleted' });
});

export const createTaxInvoiceHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { clientId, dealId, propertyTitle, lineItems } = req.body;

  if (!clientId) throw new AppError('Client ID is required', 400);
  if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
    throw new AppError('Line items are required', 400);
  }

  const invoice = await generateTaxInvoice(
    clientId,
    dealId,
    propertyTitle,
    lineItems,
    req.user?.id
  );

  res.status(201).json({ success: true, data: invoice });
});

export const getInvoicePdf = asyncHandler(async (req: Request, res: Response) => {
  const invoiceId = routeParamToString(req.params.id);
  if (!invoiceId) throw new AppError('Invoice ID is required', 400);

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice || !invoice.pdfUrl) {
    throw new AppError('Invoice PDF not found', 404);
  }

  res.redirect(invoice.pdfUrl);
});
