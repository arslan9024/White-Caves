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

const router = Router();

const mockHenryRecords: Array<Record<string, any>> = [];

const normalizeId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const createMockHenryRecordModel = () => ({
  findMany: async ({ orderBy, skip = 0, take = 50, select }: any = {}) => {
    let rows = [...mockHenryRecords];
    if (orderBy?.createdAt) {
      rows.sort((a, b) => {
        const av = new Date(a.createdAt).getTime();
        const bv = new Date(b.createdAt).getTime();
        return orderBy.createdAt === 'asc' ? av - bv : bv - av;
      });
    }
    const sliced = rows.slice(skip, skip + take);
    if (!select) return sliced;
    return sliced.map(row =>
      Object.fromEntries(
        Object.keys(select)
          .filter(k => select[k])
          .map(k => [k, row[k]])
      )
    );
  },
  count: async () => mockHenryRecords.length,
  create: async ({ data }: any) => {
    const created = {
      id: normalizeId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    mockHenryRecords.push(created);
    return created;
  },
  findUnique: async ({ where }: any) => mockHenryRecords.find(r => r.id === where.id) ?? null,
  delete: async ({ where }: any) => {
    const idx = mockHenryRecords.findIndex(r => r.id === where.id);
    if (idx < 0) return null;
    const [deleted] = mockHenryRecords.splice(idx, 1);
    return deleted;
  },
});

const getHenryRecordModel = () => {
  const henryRecordModel = (prisma as unknown as { henryRecord?: any }).henryRecord;
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

    const [records, total] = await Promise.all([
      henryRecordModel.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          templateKey: true,
          templateLabel: true,
          fileName: true,
          recordPath: true,
          unit: true,
          community: true,
          tenantName: true,
          isDraft: true,
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
      isDraft,
      copyNumber,
      documentSnapshot,
    } = req.body;

    if (!templateKey || !fileName) {
      return res
        .status(400)
        .json({ success: false, error: 'templateKey and fileName are required' });
    }

    const record = await henryRecordModel.create({
      data: {
        templateKey,
        templateLabel: templateLabel ?? templateKey,
        fileName,
        recordPath: recordPath ?? '',
        unit: unit ?? null,
        community: community ?? null,
        tenantName: tenantName ?? null,
        isDraft: isDraft ?? false,
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
    const { id } = req.params;
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

      const subDir = path.join(year, month, community);
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

export default router;
