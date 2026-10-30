import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { prisma } from '../../database.js';
import { HENRY_UPLOADS_PATH } from '../../config/env.js';
import { maxSourceBytes } from '../../services/henry/documentVault.js';

export const mockHenryRecords: Array<Record<string, any>> = [];
export const VALID_DEPARTMENTS = ['sales', 'leasing', 'finance', 'compliance', 'legal', 'operations'] as const;
export const VALID_HENRY_STATUSES = ['draft', 'pending_signature', 'signed', 'archived'] as const;
export type HenryRecordStatus = (typeof VALID_HENRY_STATUSES)[number];

export const normalizeId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const createMockHenryRecordModel = () => ({
  findMany: async (args: Record<string, unknown> = {}) => {
    const { where, orderBy, skip = 0, take = 50, select } = args as any;
    let rows = [...mockHenryRecords];
    if (where) {
      rows = rows.filter((row: Record<string, unknown>) => {
        if (where.templateKey && row.templateKey !== where.templateKey) return false;
        if (where.departmentTag && row.departmentTag !== where.departmentTag) return false;
        if (where.ownerUserId && row.ownerUserId !== where.ownerUserId) return false;
        if (where.ownerUserEmail && row.ownerUserEmail !== where.ownerUserEmail) return false;
        if (where.status && row.status !== where.status) return false;
        if (where.signedAt && typeof where.signedAt === 'object' && (where.signedAt as Record<string, unknown>).gte) {
          const rowSignedAt = row.signedAt ? new Date(row.signedAt as string | number | Date).getTime() : NaN;
          if (Number.isNaN(rowSignedAt) || rowSignedAt < new Date((where.signedAt as Record<string, unknown>).gte as string | number | Date).getTime()) {
            return false;
          }
        }
        if (where.signedAt && typeof where.signedAt === 'object' && (where.signedAt as Record<string, unknown>).lte) {
          const rowSignedAt = row.signedAt ? new Date(row.signedAt as string | number | Date).getTime() : NaN;
          if (Number.isNaN(rowSignedAt) || rowSignedAt > new Date((where.signedAt as Record<string, unknown>).lte as string | number | Date).getTime()) {
            return false;
          }
        }
        return true;
      });
    }
    if (orderBy?.createdAt) {
      rows.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        const av = new Date(a.createdAt as string | Date).getTime();
        const bv = new Date(b.createdAt as string | Date).getTime();
        return orderBy.createdAt === 'asc' ? av - bv : bv - av;
      });
    }
    const sliced = rows.slice(skip, skip + take);
    if (!select) return sliced;
    return sliced.map((row: Record<string, unknown>) =>
      Object.fromEntries(
        Object.keys(select)
          .filter((k: string) => select[k])
          .map((k: string) => [k, row[k]])
      )
    );
  },
  count: async () => mockHenryRecords.length,
  create: async ({ data }: { data: Record<string, unknown> }) => {
    const created = {
      id: normalizeId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    mockHenryRecords.push(created as any);
    return created;
  },
  findUnique: async ({ where }: { where: { id: string } }) => mockHenryRecords.find(r => r.id === where.id) ?? null,
  update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
    const idx = mockHenryRecords.findIndex(r => r.id === where.id);
    if (idx < 0) return null;
    const updated = { ...mockHenryRecords[idx], ...data, updatedAt: new Date() };
    mockHenryRecords[idx] = updated as any;
    return updated;
  },
  delete: async ({ where }: { where: { id: string } }) => {
    const idx = mockHenryRecords.findIndex(r => r.id === where.id);
    if (idx < 0) return null;
    const [deleted] = mockHenryRecords.splice(idx, 1);
    return deleted;
  },
});

export const getHenryRecordModel = () => {
  const henryRecordModel = (prisma as unknown as { henryRecord?: ReturnType<typeof createMockHenryRecordModel> }).henryRecord;
  if (!henryRecordModel) {
    return createMockHenryRecordModel();
  }
  return henryRecordModel;
};

// ─── Multer: single-file PDF upload ──────────────────────────────────────

export const recordStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.resolve(HENRY_UPLOADS_PATH);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const stamp = Date.now();
    const safe = file.originalname.replace(/[^\w.-]/g, '_');
    cb(null, `${stamp}_${safe}`);
  },
});

export const recordUpload = multer({
  storage: recordStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are accepted'));
    }
  },
});

export const sourceUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSourceBytes, files: 2, fieldSize: 250000 },
});

export interface HenryEventLogEntry {
  id: string;
  timestamp: string;
  triggerSource: 'nadia' | 'linda' | 'mary' | 'nina';
  event: string;
  payload: Record<string, unknown>;
  complianceResult?: {
    passed: boolean;
    errorCount: number;
    warningCount: number;
    templateKey: string;
  };
}

export const henryEventLog: HenryEventLogEntry[] = [];
export const MAX_HENRY_EVENT_LOG = 20;

