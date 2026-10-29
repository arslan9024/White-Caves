/**
 * leadImportController.ts
 * Handlers for uploading and bulk-importing leads from CSV/XLSX spreadsheets or JSON payloads.
 */

import { Request, Response } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import {
  RouteRequest,
  VALID_LEAD_STATUSES,
  BulkImportLeadInput,
  BulkImportRowError,
  PreparedBulkLead,
} from './leadCommon.js';

export const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.csv') ||
      file.originalname.endsWith('.xlsx');
    cb(null, ok);
  },
});

export async function importLeadsFile(req: Request, res: Response): Promise<void> {
  if (!req.file) throw new AppError('No file uploaded', 400);

  const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, string | number | null>>(ws, {
    defval: null,
  });

  if (rawRows.length === 0) throw new AppError('File contains no data rows', 400);
  if (rawRows.length > 500) throw new AppError('Maximum 500 rows per import', 400);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

  const perRowErrors: { row: number; field: string; message: string }[] = [];
  const candidates: {
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    status: string;
    source: string;
    budget: number | null;
    score: number;
    notes: string | null;
    tags: string[];
  }[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const r = rawRows[i];
    const rowNum = i + 2;

    const get = (...keys: string[]): string | null => {
      for (const k of keys) {
        const v = r[k] ?? r[k.toLowerCase()] ?? r[k.toUpperCase()];
        if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
      }
      return null;
    };

    const name = get('name', 'Name', 'Full Name', 'full_name');
    if (!name) {
      perRowErrors.push({ row: rowNum, field: 'name', message: 'Name is required' });
      continue;
    }

    const emailRaw = get('email', 'Email', 'email_address');
    const email =
      emailRaw && emailRegex.test(emailRaw) ? emailRaw.toLowerCase().slice(0, 254) : null;
    if (emailRaw && !email) {
      perRowErrors.push({ row: rowNum, field: 'email', message: `Invalid email: ${emailRaw}` });
    }

    const phoneRaw = get('phone', 'Phone', 'mobile', 'Mobile', 'phone_number');
    const phone = phoneRaw && phoneRegex.test(phoneRaw) ? phoneRaw.slice(0, 20) : null;
    if (phoneRaw && !phone) {
      perRowErrors.push({ row: rowNum, field: 'phone', message: `Invalid phone: ${phoneRaw}` });
    }

    const statusRaw = get('status', 'Status') ?? 'new';
    const status = VALID_LEAD_STATUSES.includes(statusRaw as (typeof VALID_LEAD_STATUSES)[number])
      ? statusRaw
      : 'new';

    const budgetRaw = get('budget', 'Budget');
    const budget = budgetRaw ? parseFloat(budgetRaw) || null : null;

    const scoreRaw = get('score', 'Score');
    const score = scoreRaw
      ? Math.min(100, Math.max(0, Math.round(parseFloat(scoreRaw) || 0)))
      : 0;

    candidates.push({
      name: sanitizeString(name.slice(0, 200)),
      email,
      phone,
      company: sanitizeString((get('company', 'Company') ?? '').slice(0, 200)) || null,
      status,
      source: sanitizeString((get('source', 'Source') ?? 'import').slice(0, 100)),
      budget,
      score,
      notes: sanitizeString((get('notes', 'Notes') ?? '').slice(0, 5000)) || null,
      tags: [],
    });
  }

  const candidateEmails = candidates.map(c => c.email).filter(Boolean) as string[];
  const candidatePhones = candidates.map(c => c.phone).filter(Boolean) as string[];

  const existing = await prisma.lead.findMany({
    where: {
      OR: [
        ...(candidateEmails.length ? [{ email: { in: candidateEmails } }] : []),
        ...(candidatePhones.length ? [{ phone: { in: candidatePhones } }] : []),
      ],
    },
    select: { email: true, phone: true },
  });

  const existingEmails = new Set(existing.map(e => e.email).filter(Boolean));
  const existingPhones = new Set(existing.map(e => e.phone).filter(Boolean));

  const toInsert = candidates.filter(
    c => !(c.email && existingEmails.has(c.email)) && !(c.phone && existingPhones.has(c.phone))
  );
  const duplicates = candidates.length - toInsert.length;

  const result = toInsert.length
    ? await prisma.lead.createMany({ data: toInsert })
    : { count: 0 };

  res.status(201).json({
    success: true,
    data: {
      imported: result.count,
      duplicates,
      errors: perRowErrors,
      total: rawRows.length,
    },
  });
}

export async function bulkImportLeads(req: RouteRequest, res: Response): Promise<void> {
  const { leads } = req.body;
  if (!Array.isArray(leads) || leads.length === 0)
    throw new AppError('Provide an array of leads', 400);
  if (leads.length > 500) throw new AppError('Maximum 500 leads per batch', 400);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

  const rowErrors: BulkImportRowError[] = [];
  const preparedRows: PreparedBulkLead[] = [];
  const batchEmailIndex = new Set<string>();
  const batchPhoneIndex = new Set<string>();

  for (let idx = 0; idx < leads.length; idx += 1) {
    const raw = leads[idx] as BulkImportLeadInput;
    const row = idx + 1;

    const cleanNameRaw = typeof raw.name === 'string' ? raw.name.trim() : '';
    const cleanName = sanitizeString(cleanNameRaw).slice(0, 200);

    if (!cleanName) {
      rowErrors.push({
        row,
        code: 'missing_name',
        message: 'Missing required field: name',
      });
      continue;
    }

    const normalizedEmail =
      typeof raw.email === 'string' && raw.email.trim().length > 0
        ? raw.email.trim().toLowerCase().slice(0, 254)
        : null;
    const normalizedPhone =
      typeof raw.phone === 'string' && raw.phone.trim().length > 0
        ? raw.phone.trim().slice(0, 20)
        : null;

    if (normalizedEmail && !emailRegex.test(normalizedEmail)) {
      rowErrors.push({
        row,
        code: 'invalid_email',
        message: `Invalid email format: ${normalizedEmail}`,
      });
      continue;
    }

    if (normalizedPhone && !phoneRegex.test(normalizedPhone)) {
      rowErrors.push({
        row,
        code: 'invalid_phone',
        message: `Invalid phone format: ${normalizedPhone}`,
      });
      continue;
    }

    const duplicateKey = normalizedEmail ?? normalizedPhone;
    if (duplicateKey) {
      const duplicateInBatch =
        (normalizedEmail && batchEmailIndex.has(normalizedEmail)) ||
        (normalizedPhone && batchPhoneIndex.has(normalizedPhone));
      if (duplicateInBatch) {
        rowErrors.push({
          row,
          code: 'duplicate_in_batch',
          message: 'Duplicate lead in this import batch (same email/phone)',
        });
        continue;
      }
    }

    if (normalizedEmail) batchEmailIndex.add(normalizedEmail);
    if (normalizedPhone) batchPhoneIndex.add(normalizedPhone);

    const sanitizedSource =
      typeof raw.source === 'string' ? sanitizeString(raw.source.trim().slice(0, 100)) : 'direct';

    preparedRows.push({
      row,
      data: {
        name: cleanName,
        email: normalizedEmail,
        phone: normalizedPhone,
        company:
          sanitizeString(
            (typeof raw.company === 'string' ? raw.company.trim() : '').slice(0, 200)
          ) || null,
        status:
          typeof raw.status === 'string' &&
          VALID_LEAD_STATUSES.includes(raw.status as (typeof VALID_LEAD_STATUSES)[number])
            ? raw.status
            : 'new',
        source: sanitizedSource.length > 0 ? sanitizedSource : 'direct',
        budget:
          typeof raw.budget === 'number'
            ? raw.budget
            : typeof raw.budget === 'string'
              ? parseFloat(raw.budget) || null
              : null,
        score:
          typeof raw.score === 'number' ? Math.min(Math.max(Math.round(raw.score), 0), 100) : 0,
        notes:
          sanitizeString((typeof raw.notes === 'string' ? raw.notes : '').slice(0, 5000)) || null,
        tags: Array.isArray(raw.tags)
          ? raw.tags
              .slice(0, 20)
              .map(t => String(t).slice(0, 50))
              .filter(Boolean)
          : [],
      },
    });
  }

  const incomingEmails = preparedRows
    .map(row => row.data.email)
    .filter((value): value is string => Boolean(value));
  const incomingPhones = preparedRows
    .map(row => row.data.phone)
    .filter((value): value is string => Boolean(value));

  const existing =
    incomingEmails.length > 0 || incomingPhones.length > 0
      ? await prisma.lead.findMany({
          where: {
            OR: [
              ...(incomingEmails.length > 0 ? [{ email: { in: incomingEmails } }] : []),
              ...(incomingPhones.length > 0 ? [{ phone: { in: incomingPhones } }] : []),
            ],
          },
          select: { email: true, phone: true },
        })
      : [];

  const existingEmails = new Set(
    existing
      .map(item => item.email)
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .map(value => value.toLowerCase())
  );
  const existingPhones = new Set(
    existing
      .map(item => item.phone)
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
  );

  const importableRows: PreparedBulkLead[] = [];
  for (const row of preparedRows) {
    const isDuplicateExisting =
      (row.data.email ? existingEmails.has(row.data.email.toLowerCase()) : false) ||
      (row.data.phone ? existingPhones.has(row.data.phone) : false);

    if (isDuplicateExisting) {
      rowErrors.push({
        row: row.row,
        code: 'duplicate_existing',
        message: 'Lead already exists (matching email/phone)',
      });
      continue;
    }

    importableRows.push(row);
  }

  const results =
    importableRows.length > 0
      ? await prisma.lead.createMany({
          data: importableRows.map(row => row.data),
        })
      : { count: 0 };

  res.status(201).json({
    success: true,
    data: {
      imported: results.count,
      total: leads.length,
      skipped: leads.length - results.count,
      errors: rowErrors.sort((a, b) => a.row - b.row),
    },
  });
}
