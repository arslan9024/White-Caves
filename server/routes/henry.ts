/**
 * Henry Document Hub Routes
 *
 * Server-side API for Henry — the White Caves Document Hub (AI assistant WC-AI-003).
 * Provides record archival, compliance checking, and Emirates ID OCR via Ollama.
 *
 * Endpoints:
 *   GET  /api/henry/records                   — list archive index
 *   POST /api/henry/records                   — save/update record index entry
 *   GET  /api/henry/records/file              — serve a stored PDF (?path=...)
 *   POST /api/henry/records/file              — upload / archive a PDF
 *   DELETE /api/henry/records/:id             — delete a record entry
 *   POST /api/henry/records/:id/sign          — mark a record as signed with timestamp
 *   POST /api/henry/compliance/check          — run RERA/DLD compliance check
 *   GET  /api/henry/compliance/summary        — available rule counts by template
 *   POST /api/henry/ocr/emirates-id           — OCR Emirates ID via Ollama
 *   POST /api/henry/ai/extract                — AI field extraction via Groq
 *   GET  /api/henry/health                    — health check
 *
 * Auth: requireMinRole('agent') except where noted.
 */

import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { requireMinRole, requireRole } from '../middleware/rbac.js';
import { prisma } from '../database.js';
import {
  evaluateCompliance,
  getComplianceSummary,
  TemplateKey,
} from '../services/henry/complianceEngine.js';
import { HENRY_UPLOADS_PATH, OLLAMA_HOST, GROQ_API_KEY } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { activeDocumentFilter, decodeDocument, decodeSource, documentId, documentOwner, prepareDocument, prepareSource, referenceHash, maxSourceBytes, validateDocumentLinks, vaultKey, vaultOperation } from '../services/henry/documentVault.js';
import dossierRouter from './henry.dossiers.js';

const router = Router();

const mockHenryRecords: Array<Record<string, any>> = [];
const VALID_DEPARTMENTS = ['sales', 'leasing', 'finance', 'compliance', 'legal', 'operations'] as const;
const VALID_HENRY_STATUSES = ['draft', 'pending_signature', 'signed', 'archived'] as const;
type HenryRecordStatus = (typeof VALID_HENRY_STATUSES)[number];

const normalizeId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const createMockHenryRecordModel = () => ({
  findMany: async (args: Record<string, unknown> = {}) => {
    const { where, orderBy, skip = 0, take = 50, select } = args as any;
    let rows = [...mockHenryRecords];
    if (where) {
      rows = rows.filter((row: Record<string, unknown>) => {
        const r = row as any;
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

const getHenryRecordModel = () => {
  const henryRecordModel = (prisma as unknown as { henryRecord?: ReturnType<typeof createMockHenryRecordModel> }).henryRecord;
  if (!henryRecordModel) {
    return createMockHenryRecordModel();
  }
  return henryRecordModel;
};

// ─── Multer: single-file PDF upload ──────────────────────────────────────

const storage = multer.diskStorage({
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

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are accepted'));
    }
  },
});

// ─── GET /api/henry/health ────────────────────────────────────────────────

router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, service: 'henry', timestamp: new Date() });
});

// ─── GET /api/henry/records ───────────────────────────────────────────────

router.get('/records', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const henryRecordModel = getHenryRecordModel();
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const pageSize = Math.min(parseInt(String(req.query.pageSize ?? '50'), 10), 100);
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    const templateKey = req.query.templateKey ? String(req.query.templateKey) : undefined;
    const departmentTag = req.query.departmentTag ? String(req.query.departmentTag) : undefined;
    const ownerUserId = req.query.ownerUserId ? String(req.query.ownerUserId) : undefined;
    const ownerUserEmail = req.query.ownerUserEmail ? String(req.query.ownerUserEmail) : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;
    const signedFrom = req.query.signedFrom ? String(req.query.signedFrom) : undefined;
    const signedTo = req.query.signedTo ? String(req.query.signedTo) : undefined;

    if (templateKey) where.templateKey = templateKey;
    if (departmentTag) where.departmentTag = departmentTag;
    if (ownerUserId) where.ownerUserId = ownerUserId;
    if (ownerUserEmail) where.ownerUserEmail = ownerUserEmail;
    if (status) where.status = status;
    if (signedFrom || signedTo) {
      where.signedAt = {
        ...(signedFrom ? { gte: new Date(signedFrom) } : {}),
        ...(signedTo ? { lte: new Date(signedTo) } : {}),
      };
    }

    const [records, total] = await Promise.all([
      henryRecordModel.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          templateKey: true,
          templateLabel: true,
          fileName: true,
          recordPath: true,
          departmentTag: true,
          ownerUserId: true,
          ownerUserEmail: true,
          unit: true,
          community: true,
          tenantName: true,
          isDraft: true,
          status: true,
          signedAt: true,
          archivedAt: true,
          copyNumber: true,
          createdAt: true,
          createdBy: true,
        },
      }),
      henryRecordModel.count(),
    ]);

    res.json({ success: true, data: { records, total, page, pageSize } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/henry/records ──────────────────────────────────────────────

router.post('/records', requireMinRole('agent'), async (req: AuthRequest, res: Response) => {
  try {
    const henryRecordModel = getHenryRecordModel();
    const {
      templateKey,
      templateLabel,
      fileName,
      recordPath,
      unit,
      community,
      tenantName,
      departmentTag,
      ownerUserId,
      ownerUserEmail,
      status,
      signedAt,
      archivedAt,
      isDraft,
      copyNumber,
      documentSnapshot,
    } = req.body;

    if (!templateKey || !fileName) {
      return res
        .status(400)
        .json({ success: false, error: 'templateKey and fileName are required' });
    }
    if (departmentTag && !VALID_DEPARTMENTS.includes(departmentTag)) {
      return res.status(400).json({
        success: false,
        error: `departmentTag must be one of: ${VALID_DEPARTMENTS.join(', ')}`,
      });
    }
    if (status && !VALID_HENRY_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `status must be one of: ${VALID_HENRY_STATUSES.join(', ')}`,
      });
    }

    const computedStatus: HenryRecordStatus =
      status ??
      (isDraft ? 'draft' : signedAt ? 'signed' : 'pending_signature');

    const record = await henryRecordModel.create({
      data: {
        templateKey,
        templateLabel: templateLabel ?? templateKey,
        fileName,
        recordPath: recordPath ?? '',
        departmentTag: departmentTag ?? null,
        ownerUserId: ownerUserId ?? req.user?.id ?? null,
        ownerUserEmail: ownerUserEmail ?? req.user?.email ?? null,
        unit: unit ?? null,
        community: community ?? null,
        tenantName: tenantName ?? null,
        isDraft: isDraft ?? false,
        status: computedStatus,
        signedAt: signedAt ? new Date(signedAt) : null,
        archivedAt: archivedAt ? new Date(archivedAt) : null,
        copyNumber: copyNumber ?? 1,
        documentSnapshot: documentSnapshot ?? {},
        createdBy: req.user?.id ?? 'system',
      },
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── DELETE /api/henry/records/:id ───────────────────────────────────────

router.delete('/records/:id', requireMinRole('agent'), async (req: AuthRequest, res: Response) => {
  try {
    const henryRecordModel = getHenryRecordModel();
    const { id } = req.params as Record<string, string>;
    const record = await henryRecordModel.findUnique({ where: { id } });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    // Clean up the stored file if it exists
    if (record.recordPath) {
      const filePath = path.resolve(HENRY_UPLOADS_PATH, record.recordPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await henryRecordModel.delete({ where: { id } });
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/henry/records/file ─────────────────────────────────────────

router.post(
  '/records/file',
  requireMinRole('agent'),
  upload.single('pdf'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No PDF file uploaded' });
      }

      // Organise into year/month/property subdirectory
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const community = (req.body.community ?? 'general').replace(/[^\w-]/g, '_');
      const departmentTag = String(req.body.departmentTag ?? 'general').replace(/[^\w-]/g, '_');
      const ownerUserId = String(req.body.ownerUserId ?? req.user?.id ?? 'unassigned').replace(
        /[^\w-]/g,
        '_'
      );

      const subDir = path.join(year, month, departmentTag, ownerUserId, community);
      const destDir = path.resolve(HENRY_UPLOADS_PATH, subDir);
      fs.mkdirSync(destDir, { recursive: true });

      // Move uploaded file from default location to organised sub-dir
      const destPath = path.join(destDir, req.file.filename);
      fs.renameSync(req.file.path, destPath);

      const relativePath = path.join(subDir, req.file.filename);

      res.status(201).json({
        success: true,
        data: {
          fileName: req.file.originalname,
          storedAs: req.file.filename,
          relativePath,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── POST /api/henry/records/:id/sign ─────────────────────────────────────

router.post('/records/:id/sign', requireMinRole('agent'), async (req: AuthRequest, res: Response) => {
  try {
    const henryRecordModel = getHenryRecordModel();
    const { id } = req.params as Record<string, string>;
    const record = await henryRecordModel.findUnique({ where: { id } });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    const signedAt = req.body.signedAt ? new Date(String(req.body.signedAt)) : new Date();
    if (Number.isNaN(signedAt.getTime())) {
      return res.status(400).json({ success: false, error: 'signedAt must be a valid date' });
    }

    const updated = await henryRecordModel.update({
      where: { id },
      data: {
        isDraft: false,
        status: 'signed',
        signedAt,
        ownerUserId: req.body.ownerUserId ?? record.ownerUserId ?? req.user?.id ?? null,
        ownerUserEmail: req.body.ownerUserEmail ?? record.ownerUserEmail ?? req.user?.email ?? null,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── GET /api/henry/records/file ──────────────────────────────────────────

router.get('/records/file', requireMinRole('agent'), (req: Request, res: Response) => {
  try {
    const relPath = req.query.path as string;
    if (!relPath) {
      return res.status(400).json({ success: false, error: 'path query parameter is required' });
    }

    // Sanitise path to prevent directory traversal
    const normalised = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const filePath = path.resolve(HENRY_UPLOADS_PATH, normalised);

    // Ensure path stays within uploads directory
    if (!filePath.startsWith(path.resolve(HENRY_UPLOADS_PATH))) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    res.sendFile(filePath);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/henry/compliance/check ────────────────────────────────────

router.post('/compliance/check', requireMinRole('agent'), (req: Request, res: Response) => {
  try {
    const { templateKey, documentData } = req.body;

    if (!templateKey) {
      return res.status(400).json({ success: false, error: 'templateKey is required' });
    }
    if (!documentData || typeof documentData !== 'object') {
      return res.status(400).json({ success: false, error: 'documentData must be an object' });
    }

    const validTemplateKeys: TemplateKey[] = [
      'tenancy_contract',
      'booking_form',
      'addendum',
      'viewing_agreement',
      'key_handover',
      'offer_letter',
      'invoice',
      'salary_certificate',
      'gov_employee_booking',
    ];
    if (!validTemplateKeys.includes(templateKey as TemplateKey)) {
      return res.status(400).json({
        success: false,
        error: `Invalid templateKey. Valid options: ${validTemplateKeys.join(', ')}`,
      });
    }

    const report = evaluateCompliance(
      templateKey as TemplateKey,
      documentData as Record<string, unknown>
    );
    res.json({ success: true, data: report });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── GET /api/henry/compliance/summary ───────────────────────────────────

router.get('/compliance/summary', requireMinRole('agent'), (_req: Request, res: Response) => {
  try {
    const summary = getComplianceSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/henry/ocr/emirates-id ─────────────────────────────────────

router.post('/ocr/emirates-id', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const { imageBase64, imageUrl } = req.body;

    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({ success: false, error: 'imageBase64 or imageUrl is required' });
    }

    // Use Ollama via the existing OLLAMA_HOST env var
    const ollamaEndpoint = `${OLLAMA_HOST}/api/generate`;

    const prompt = `You are an Emirates ID card OCR parser. Extract the following fields from this Emirates ID card image and return them as a JSON object:
{
  "name": "Full name in English",
  "nameArabic": "Full name in Arabic",
  "emiratesId": "ID number in format 784-YYYY-XXXXXXX-D",
  "dateOfBirth": "DD/MM/YYYY",
  "nationality": "Nationality",
  "gender": "Male or Female",
  "expiryDate": "DD/MM/YYYY",
  "cardNumber": "Card number if visible"
}
Return ONLY the JSON object. If a field is not visible or readable, use null for that field.
Confidence: include a "confidence" field from 0.0 to 1.0 indicating overall extraction confidence.`;

    const ollamaRequest = {
      model: 'llava', // Vision-capable model
      prompt,
      images: imageBase64 ? [imageBase64] : undefined,
      stream: false, // Request complete response instead of token-by-token streaming
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000); // 30s timeout

    let extractedData: Record<string, unknown> = {};
    let confidence = 0;

    try {
      const ollamaRes = await fetch(ollamaEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ollamaRequest),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (ollamaRes.ok) {
        const ollamaData = (await ollamaRes.json()) as { response?: string };
        const raw = ollamaData?.response ?? '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
          confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.6;
          delete parsed.confidence;
          extractedData = parsed;
        }
      }
    } catch (ollamaError) {
      clearTimeout(timeout);
      // Ollama unavailable — return empty result with explanation
      console.warn(
        '[Henry OCR] Ollama unavailable:',
        ollamaError instanceof Error ? ollamaError.message : ollamaError
      );
    }

    // Apply Emirates ID regex validation
    if (extractedData.emiratesId) {
      const eidPattern = /784-\d{4}-\d{7}-\d/;
      const eidStr = String(extractedData.emiratesId);
      const match = eidStr.match(eidPattern);
      if (match) {
        extractedData.emiratesId = match[0];
        confidence = Math.min(confidence + 0.1, 1);
      } else {
        extractedData.emiratesId = null;
        confidence = Math.max(confidence - 0.1, 0);
      }
    }

    res.json({
      success: true,
      data: {
        ...extractedData,
        confidence,
        ocrProvider: 'ollama',
        processedAt: new Date(),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/henry/ai/extract ───────────────────────────────────────────

router.post('/ai/extract', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const { text, templateKey } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'text is required' });
    }

    if (!GROQ_API_KEY) {
      // Fall back to Ollama if Groq not configured
      const ollamaPrompt = `Extract structured document fields from the following text for a ${templateKey ?? 'real estate'} document template. Return as JSON:\n\n${String(text).substring(0, 2000)}`;
      const ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'mistral', prompt: ollamaPrompt, stream: false }), // stream:false = complete response
      });
      if (!ollamaRes.ok) {
        return res
          .status(503)
          .json({
            success: false,
            error: 'AI extraction unavailable — configure GROQ_API_KEY or ensure Ollama is running',
          });
      }
      const ollamaData = (await ollamaRes.json()) as { response?: string };
      const raw = ollamaData?.response ?? '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const fields = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      return res.json({ success: true, data: { fields, provider: 'ollama', confidence: 0.6 } });
    }

    // Use Groq via server-side API key
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a Dubai real estate document parser. Extract structured data from document text and return ONLY a JSON object with field names matching common real estate document fields (landlordName, tenantName, propertyAddress, startDate, endDate, annualRent, etc.). Include a "confidence" field (0–1).`,
          },
          {
            role: 'user',
            content: `Extract fields from this ${templateKey ?? 'document'} text:\n\n${String(text).substring(0, 4000)}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res
        .status(500)
        .json({ success: false, error: `Groq API error: ${errText.substring(0, 200)}` });
    }

    const groqData = (await groqRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = groqData?.choices?.[0]?.message?.content ?? '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const fields = jsonMatch ? (JSON.parse(jsonMatch[0]) as Record<string, unknown>) : {};
    const confidence = typeof fields.confidence === 'number' ? fields.confidence : 0.8;
    delete fields.confidence;

    res.json({ success: true, data: { fields, provider: 'groq', confidence } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── In-memory Henry cross-trigger event log ──────────────────────────────────

/** Shape of a single Henry cross-trigger log entry */
interface HenryEventLogEntry {
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

const henryEventLog: HenryEventLogEntry[] = [];
const MAX_HENRY_EVENT_LOG = 20;

// ─── POST /api/henry/orchestrator-trigger ─────────────────────────────────────

/**
 * Handle a cross-assistant trigger arriving from Nadia, Linda, Mary, or Nina.
 *
 * - Logs the trigger to the in-memory Henry event log
 * - Runs a compliance check when payload contains a valid templateKey
 * - Emits the appropriate orchestrator event
 * - Returns { processed: true, complianceResult? }
 *
 * Body: {
 *   triggerSource: 'nadia' | 'linda' | 'mary' | 'nina',
 *   event:         string,
 *   payload:       object
 * }
 */
router.post('/orchestrator-trigger', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const { triggerSource, event, payload } = req.body as {
      triggerSource?: unknown;
      event?: unknown;
      payload?: unknown;
    };

    const VALID_SOURCES = ['nadia', 'linda', 'mary', 'nina'] as const;
    type TriggerSource = (typeof VALID_SOURCES)[number];

    if (!triggerSource || !VALID_SOURCES.includes(triggerSource as TriggerSource)) {
      return res.status(400).json({
        success: false,
        error: `triggerSource must be one of: ${VALID_SOURCES.join(', ')}`,
      });
    }
    if (!event || typeof event !== 'string') {
      return res.status(400).json({ success: false, error: 'event is required' });
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res
        .status(400)
        .json({ success: false, error: 'payload must be a non-null object' });
    }

    const safeSource  = triggerSource as TriggerSource;
    const safePayload = payload as Record<string, unknown>;

    console.info(`[Henry] Cross-trigger from ${safeSource}: event="${event}"`);

    // Optional compliance check when a recognised templateKey is present in payload
    let complianceResult: HenryEventLogEntry['complianceResult'];
    const validTemplateKeys: TemplateKey[] = [
      'tenancy_contract', 'booking_form', 'addendum', 'viewing_agreement',
      'key_handover', 'offer_letter', 'invoice', 'salary_certificate', 'gov_employee_booking',
    ];
    if (
      typeof safePayload.templateKey === 'string' &&
      validTemplateKeys.includes(safePayload.templateKey as TemplateKey)
    ) {
      const report = evaluateCompliance(
        safePayload.templateKey as TemplateKey,
        safePayload
      );
      complianceResult = {
        passed:      report.isCompliant,
        errorCount:  report.errorCount,
        warningCount: report.warningCount,
        templateKey: safePayload.templateKey,
      };
    }

    // Append to in-memory ring buffer
    const logEntry: HenryEventLogEntry = {
      id:            `hlog-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp:     new Date().toISOString(),
      triggerSource: safeSource,
      event,
      payload:       safePayload,
      complianceResult,
    };
    henryEventLog.push(logEntry);
    if (henryEventLog.length > MAX_HENRY_EVENT_LOG) henryEventLog.shift();

    // Emit the appropriate orchestrator event
    const { assistantOrchestrator } = await import(
      '../services/orchestrator/AssistantOrchestrator.js'
    );

    if (event === 'cross:viewing_booked') {
      assistantOrchestrator.emitEvent('cross:viewing_booked', {
        propertyId:   String(safePayload.propertyId ?? 'unknown'),
        contactPhone: String(safePayload.contactPhone ?? ''),
        scheduledAt:  String(safePayload.scheduledAt ?? new Date().toISOString()),
        documentData: safePayload,
      });
    } else if (event === 'cross:offer_accepted') {
      assistantOrchestrator.emitEvent('cross:offer_accepted', {
        propertyId:  String(safePayload.propertyId ?? 'unknown'),
        buyerPhone:  String(safePayload.buyerPhone ?? ''),
        agentPhone:  typeof safePayload.agentPhone === 'string' ? safePayload.agentPhone : undefined,
        offerAmount: Number(safePayload.offerAmount ?? 0),
        documentData: safePayload,
      });
    } else if (complianceResult && !complianceResult.passed) {
      assistantOrchestrator.emitEvent('henry:compliance_failed', {
        templateKey: String(safePayload.templateKey ?? event),
        violations:  [`${complianceResult.errorCount} compliance error(s) in "${complianceResult.templateKey}"`],
        severity:    'error',
      });
    } else {
      assistantOrchestrator.emitEvent('henry:document_generated', {
        documentId:  logEntry.id,
        templateKey: String(safePayload.templateKey ?? event),
        fileName:    `${String(safePayload.templateKey ?? event)}_${Date.now()}.pdf`,
      });
    }

    res.json({
      success: true,
      data: { processed: true, complianceResult: complianceResult ?? null },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── GET /api/henry/event-log ─────────────────────────────────────────────────

/**
 * Returns the last 20 document/compliance cross-trigger events received by Henry,
 * newest first.
 */
router.get('/event-log', requireMinRole('agent'), (_req: Request, res: Response) => {
  try {
    const events = [...henryEventLog].reverse().slice(0, MAX_HENRY_EVENT_LOG);
    res.json({ success: true, data: { events, count: events.length } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/henry/ai-draft ─────────────────────────────────────────────────

/**
 * Generate an AI first-draft for a legal document using Groq.
 * Falls back to a handlebars template when GROQ_API_KEY is absent.
 *
 * Body: DocumentDraftInput (see server/services/henry/aiDocumentDrafter.ts)
 */
router.post('/ai-draft', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const { generateDocumentDraft } = await import('../services/henry/aiDocumentDrafter.js');
    const result = await generateDocumentDraft(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/henry/ejari-submit ────────────────────────────────────────────

/**
 * Submit a tenancy contract to Ejari / DLD.
 * Returns mock response when DLD_API_KEY is not configured.
 *
 * Body: EjariPayload (see server/services/henry/ejariService.ts)
 */
router.post('/ejari-submit', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const { submitToEjari } = await import('../services/henry/ejariService.js');
    const result = await submitToEjari(req.body);
    const status = result.success ? 200 : 422;
    res.status(status).json({ success: result.success, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/henry/translate ────────────────────────────────────────────────

/**
 * Translate or produce a bilingual (AR/EN) version of a legal document.
 * Uses OpenAI when OPENAI_API_KEY is set, otherwise falls back to clause bank.
 *
 * Body: TranslationInput (see server/services/henry/multiLangContract.ts)
 */
router.post('/translate', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const { generateMultiLangContract } = await import('../services/henry/multiLangContract.js');
    const result = await generateMultiLangContract(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/henry/documents/save ──────────────────────────────────────────

router.use('/documents', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
router.use('/documents', dossierRouter);

const sourceUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxSourceBytes, files: 2, fieldSize: 250000 } });
router.post('/documents/save', requireMinRole('agent'), sourceUpload.array('source', 2), asyncHandler(async (req: AuthRequest, res) => {
  const ownerUserId = documentOwner(req.user?.id);
  if (req.body.metadata) {
    try { req.body = JSON.parse(req.body.metadata); } catch { throw new AppError('Invalid document metadata', 400); }
  }
  const sources = (req.files as Express.Multer.File[] | undefined) || [];
  if (['passport', 'tenancy_contract'].includes(req.body.docType) && !sources.length)
    throw new AppError('Original passport or agreement required for archival', 400);
  const data = { ...prepareDocument(req.body, ownerUserId), ...prepareSource(sources) };
  const links = await validateDocumentLinks(ownerUserId, req.body);
  const result = await vaultOperation('save', () => prisma.$transaction(async tx => {
    const replacesId = req.body.replacesId ? documentId(req.body.replacesId) : null;
    if (replacesId) {
      const previous = await tx.henryScannedDocument.findFirst({ where: { id: replacesId, ownerUserId, docType: data.docType, ...activeDocumentFilter } });
      if (!previous) throw new AppError('Replacement target not found', 404);
      // Release only this active reference inside the same transaction; rollback preserves it on failure.
      const released = await tx.henryScannedDocument.updateMany({ where: { id: replacesId, ownerUserId, ...activeDocumentFilter, referenceHash: previous.referenceHash }, data: { referenceHash: `archived:${replacesId}` } });
      if (released.count !== 1) throw new AppError('Document changed; reload before replacing', 409);
    }
    const row = await tx.henryScannedDocument.create({ data: { ...data, ...links, ownerUserId, replacedById: null } });
    if (replacesId) await tx.henryScannedDocument.updateMany({ where: { id: replacesId, ownerUserId, ...activeDocumentFilter }, data: { replacedById: row.id } });
    await tx.henryDocumentAudit.create({ data: { ownerUserId, documentId: row.id, action: 'save' } });
    return row;
  }));
  res.json({ success: true, data: decodeDocument(result) });
}));

const searchDocuments = asyncHandler(async (req: AuthRequest, res) => {
  const ownerUserId = documentOwner(req.user?.id);
  vaultKey();
  const filters = req.method === 'POST' ? req.body : req.query;
  if (!filters || typeof filters !== 'object' || Array.isArray(filters)) throw new AppError('Search metadata required', 400);
  if (req.method === 'GET' && 'referenceNumber' in filters) throw new AppError('Use POST /documents/search with referenceNumber in the JSON body', 400);
  const limit = Math.max(1, Math.min(100, Math.floor(Number(filters.limit) || 50)));
  const page = Math.max(1, Math.floor(Number(filters.page) || 1));
  if (!Number.isFinite(limit) || !Number.isSafeInteger(page) || page > 100000) throw new AppError('Invalid pagination', 400);
  if (filters.q || filters.clientName) throw new AppError('Use exact referenceNumber with docType; substring search is not supported', 400);
  if (filters.referenceNumber && (typeof filters.referenceNumber !== 'string' || filters.referenceNumber.length > 100))
    throw new AppError('Invalid document reference', 400);
  const links = await validateDocumentLinks(ownerUserId, filters);
  const status = String(filters.expiryStatus || '');
  if (status && !['expired', 'soon_expiring', 'current', 'unknown'].includes(status)) throw new AppError('Invalid expiry filter', 400);
  const today = new Date(Math.floor(Date.now() / 86400000) * 86400000);
  const soon = new Date(Date.now() + 30 * 86400000);
  const where = { ownerUserId, ...activeDocumentFilter,
    ...(links.leadId ? { leadId: links.leadId } : {}), ...(links.propertyId ? { propertyId: links.propertyId } : {}),
    ...(links.tenancyId ? { tenancyId: links.tenancyId } : {}), ...(links.transactionId ? { transactionId: links.transactionId } : {}),
    ...(filters.docType ? { docType: String(filters.docType) } : {}),
    ...(filters.referenceNumber ? { referenceHash: referenceHash(ownerUserId, String(filters.docType || ''), filters.referenceNumber) } : {}),
    ...(status === 'unknown' ? { AND: [{ OR: [{ expiryAt: null }, { expiryAt: { isSet: false } }] }] }
      : status ? { expiryAt: status === 'expired' ? { lt: today } : status === 'soon_expiring' ? { gte: today, lt: soon } : { gte: soon } } : {}),
  };
  if (filters.referenceNumber && !filters.docType) throw new AppError('Document type required for exact reference search', 400);
  const rows = await vaultOperation('list', () => prisma.henryScannedDocument.findMany({
    where, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * limit, take: limit + 1,
    select: { id: true, docType: true, encryptedPayload: true, createdAt: true, updatedAt: true, replacedById: true, leadId: true, propertyId: true, retentionUntil: true, reminderDismissedAt: true },
  }));
  const data = rows.slice(0, limit).map(row => {
    const decoded = decodeDocument(row);
    return { id: row.id, docType: row.docType, title: 'Reviewed document', referenceNumber: `••••${String(decoded.referenceNumber).slice(-4)}`, createdAt: row.createdAt,
      leadId: row.leadId, propertyId: row.propertyId, expiryStatus: decoded.expiryStatus, reminderDismissedAt: row.reminderDismissedAt, retentionUntil: row.retentionUntil };
  });
  res.json({ success: true, count: data.length, page, hasMore: rows.length > limit, data });
});
router.get('/documents', requireMinRole('agent'), searchDocuments);
router.post('/documents/search', requireMinRole('agent'), searchDocuments);

router.get('/documents/link-options', requireMinRole('agent'), asyncHandler(async (req: AuthRequest, res) => {
  const owner = documentOwner(req.user?.id);
  const kind = req.query.kind;
  const page = Number(req.query.page ?? 1);
  if (typeof kind !== 'string' || !['lead', 'property', 'tenancy', 'transaction'].includes(kind) || !Number.isInteger(page) || page < 1 || page > 1000)
    throw new AppError('Valid link kind and page (1–1000) required', 400);
  const data = await vaultOperation('link-options', async () => kind === 'lead'
    ? prisma.lead.findMany({ where: { assignedToId: owner }, select: { id: true, name: true }, orderBy: { id: 'asc' }, skip: (page - 1) * 25, take: 26 })
    : kind === 'property' ? prisma.property.findMany({ where: { userId: owner }, select: { id: true, title: true }, orderBy: { id: 'asc' }, skip: (page - 1) * 25, take: 26 })
    : kind === 'tenancy' ? prisma.lease.findMany({ where: { property: { userId: owner } }, select: { id: true, leaseNumber: true }, orderBy: { id: 'asc' }, skip: (page - 1) * 25, take: 26 })
    : prisma.transaction.findMany({ where: { agentId: owner }, select: { id: true, type: true }, orderBy: { id: 'asc' }, skip: (page - 1) * 25, take: 26 }));
  res.json({ success: true, data: data.slice(0, 25).map(row => ({ id: row.id, name: 'name' in row ? row.name : 'title' in row ? row.title : 'leaseNumber' in row ? row.leaseNumber || `Tenancy …${row.id.slice(-4)}` : `${row.type} …${row.id.slice(-4)}` })), hasMore: data.length > 25 });
}));

router.get('/documents/latest/:docType', requireMinRole('agent'), asyncHandler(async (req: AuthRequest, res) => {
  const ownerUserId = documentOwner(req.user?.id);
  vaultKey();
  const row = await vaultOperation('latest', () => prisma.henryScannedDocument.findFirst({ where: { ownerUserId, docType: String(req.params.docType), ...activeDocumentFilter }, orderBy: { createdAt: 'desc' } }));
  if (!row) throw new AppError('Document not found', 404);
  await vaultOperation('audit', () => prisma.henryDocumentAudit.create({ data: { ownerUserId, documentId: row.id, action: 'latest' } }));
  res.json({ success: true, data: decodeDocument(row) });
}));

router.patch('/documents/:id', requireMinRole('agent'), asyncHandler(async (req: AuthRequest, res) => {
  const ownerUserId = documentOwner(req.user?.id);
  const id = documentId(req.params.id);
  const data = prepareDocument(req.body, ownerUserId);
  const links = await validateDocumentLinks(ownerUserId, req.body);
  const row = await vaultOperation('update', () => prisma.$transaction(async tx => {
    const found = await tx.henryScannedDocument.findFirst({ where: { id, ownerUserId, docType: data.docType, ...activeDocumentFilter } });
    if (!found) throw new AppError('Document not found', 404);
    const changed = await tx.henryScannedDocument.updateMany({
      where: { id, ownerUserId, updatedAt: found.updatedAt, ...activeDocumentFilter },
      data: {
        ...data,
        ...('leadId' in req.body ? { leadId: links.leadId } : {}),
        ...('propertyId' in req.body ? { propertyId: links.propertyId } : {}),
        ...('tenancyId' in req.body ? { tenancyId: links.tenancyId } : {}),
        ...('transactionId' in req.body ? { transactionId: links.transactionId } : {}),
        // Field corrections invalidate a previous signature attestation; originals remain immutable.
        lifecycleStatus: 'draft', signedAttestedAt: null,
        ...(found.expiryAt?.getTime() !== data.expiryAt?.getTime() ? { reminderDismissedAt: null } : {}),
      },
    });
    if (changed.count !== 1) throw new AppError('Document changed; reload before updating', 409);
    await tx.henryDocumentAudit.create({ data: { ownerUserId, documentId: id, action: 'update' } });
    return tx.henryScannedDocument.findFirstOrThrow({ where: { id, ownerUserId } });
  }));
  res.json({ success: true, data: decodeDocument(row) });
}));

router.patch('/documents/:id/reminder', requireMinRole('agent'), asyncHandler(async (req: AuthRequest, res) => {
  const ownerUserId = documentOwner(req.user?.id);
  const id = documentId(req.params.id);
  vaultKey();
  await vaultOperation('reminder', () => prisma.$transaction(async tx => {
    const changed = await tx.henryScannedDocument.updateMany({ where: { id, ownerUserId, ...activeDocumentFilter }, data: { reminderDismissedAt: req.body.dismissed === true ? new Date() : null } });
    if (!changed.count) throw new AppError('Document not found', 404);
    await tx.henryDocumentAudit.create({ data: { ownerUserId, documentId: id, action: 'reminder' } });
  }));
  res.json({ success: true });
}));

router.delete('/documents/:id', requireMinRole('agent'), asyncHandler(async (req: AuthRequest, res) => {
  const ownerUserId = documentOwner(req.user?.id);
  const id = documentId(req.params.id);
  vaultKey();
  if (req.body.confirmDocumentId !== id) throw new AppError('Explicit document deletion confirmation required', 400);
  await vaultOperation('delete', () => prisma.$transaction(async tx => {
    const deleted = await tx.henryScannedDocument.deleteMany({ where: { id, ownerUserId } });
    if (deleted.count !== 1) throw new AppError('Document not found', 404);
    await tx.henryDocumentAudit.create({ data: { ownerUserId, documentId: id, action: 'user_requested_delete' } });
  }));
  res.json({ success: true });
}));

for (const route of ['/documents/:id/download', '/documents/:id']) {
  router.get(route, requireMinRole('agent'), asyncHandler(async (req: AuthRequest, res) => {
    const ownerUserId = documentOwner(req.user?.id);
    vaultKey();
    const id = documentId(req.params.id);
    const row = await vaultOperation('read', () => prisma.henryScannedDocument.findFirst({ where: { id, ownerUserId } }));
    if (!row) throw new AppError('Document not found', 404);
    await vaultOperation('audit', () => prisma.henryDocumentAudit.create({ data: { ownerUserId, documentId: id, action: route.endsWith('download') ? 'download' : 'read' } }));
    res.setHeader('Cache-Control', 'no-store');
    if (route.endsWith('download')) {
      if (!row.encryptedSource) throw new AppError('No original archived; reviewed fields remain available in detail', 404);
      const index = Number(req.query.side || 0);
      if (!Number.isInteger(index) || index < 0 || index > 1) throw new AppError('Invalid original side', 400);
      const source = await vaultOperation('decrypt original', async () => decodeSource(row.encryptedSource!, index));
      res.setHeader('Content-Disposition', `attachment; filename="original-${index}.${source.mime === 'application/pdf' ? 'pdf' : source.mime === 'image/png' ? 'png' : 'jpg'}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.type(source.mime).send(source.bytes);
      return;
    }
    res.json({ success: true, data: decodeDocument(row) });
  }));
}

export default router;
