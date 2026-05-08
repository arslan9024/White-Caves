/**
 * AI Assistants Routes — Phase 0.8
 *
 * Endpoints: /api/assistants
 *  GET  /            → list all assistants (public metadata, no plan content)
 *  GET  /:id/plan    → retrieve markdown plan for a specific assistant
 *  POST /            → create a new assistant plan (super-user only)
 *  PUT  /:id         → update assistant plan markdown (super-user only)
 *  DELETE /:id       → delete assistant plan (super-user only)
 *
 * Security:
 *  - Path traversal: :id validated against allowlist of slug characters
 *  - Writes require authMiddleware + super-user role (owner/admin)
 *  - Content sanitised before writing (strips <script> and HTML injection)
 *  - File operations confined to PLANS_DIR
 */

import { Router, Request, Response } from 'express';
import { readFile, writeFile, unlink, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('AssistantsRoute');
const router = Router();

// ─── Resolve the plans directory (business_docs/03_ai_assistants/) ───────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLANS_DIR = path.resolve(__dirname, '../../business_docs/03_ai_assistants');

// ─── In-memory registry (mirrors frontend registry for API representation) ──
// This list is intentionally minimal – the full schema lives in the frontend
// Redux registry. The API adds the plan (markdown) layer on top.
const ASSISTANT_REGISTRY: Record<string, {
  id: string;
  name: string;
  title: string;
  department: string;
  icon: string;
  colorScheme: string;
  avatar: string;
}> = {
  mary:       { id: 'mary',       name: 'Mary',       title: 'Inventory & Data Manager',        department: 'operations',     icon: 'FileText',      colorScheme: '#3B82F6', avatar: '👩‍💻' },
  theodora:   { id: 'theodora',   name: 'Theodora',   title: 'Finance & Accounts Director',     department: 'finance',        icon: 'DollarSign',    colorScheme: '#F59E0B', avatar: '👩‍💼' },
  olivia:     { id: 'olivia',     name: 'Olivia',     title: 'Marketing & Brand Manager',       department: 'marketing',      icon: 'Megaphone',     colorScheme: '#EC4899', avatar: '👩‍🎨' },
  zoe:        { id: 'zoe',        name: 'Zoe',        title: 'Executive Assistant',             department: 'executive',      icon: 'Crown',         colorScheme: '#10B981', avatar: '👑' },
  laila:      { id: 'laila',      name: 'Laila',      title: 'Compliance & Legal Officer',      department: 'compliance',     icon: 'Scale',         colorScheme: '#6366F1', avatar: '⚖️' },
  nadia:      { id: 'nadia',      name: 'Nadia',      title: 'WhatsApp CRM Manager',            department: 'communications', icon: 'MessageSquare', colorScheme: '#25D366', avatar: '👩‍💼' },
  sophia:     { id: 'sophia',     name: 'Sophia',     title: 'Sales Pipeline Manager',          department: 'sales',          icon: 'TrendingUp',    colorScheme: '#F97316', avatar: '📈' },
  daisy:      { id: 'daisy',      name: 'Daisy',      title: 'Leasing & Tenant Manager',        department: 'operations',     icon: 'Key',           colorScheme: '#14B8A6', avatar: '🏠' },
  clara:      { id: 'clara',      name: 'Clara',      title: 'Leads CRM Manager',               department: 'sales',          icon: 'Users',         colorScheme: '#8B5CF6', avatar: '🎯' },
  nina:       { id: 'nina',       name: 'Nina',       title: 'WhatsApp Bot Developer',          department: 'communications', icon: 'Bot',           colorScheme: '#06B6D4', avatar: '🤖' },
  nancy:      { id: 'nancy',      name: 'Nancy',      title: 'HR Manager',                      department: 'operations',     icon: 'UserCheck',     colorScheme: '#84CC16', avatar: '👩‍💻' },
  aurora:     { id: 'aurora',     name: 'Aurora',     title: 'Chief Technology Officer',        department: 'technology',     icon: 'Code',          colorScheme: '#A78BFA', avatar: '🔧' },
  hazel:      { id: 'hazel',      name: 'Hazel',      title: 'Elite Frontend Engineer',         department: 'technology',     icon: 'Layout',        colorScheme: '#FB923C', avatar: '🎨' },
  willow:     { id: 'willow',     name: 'Willow',     title: 'Elite Backend Engineer',          department: 'technology',     icon: 'Server',        colorScheme: '#34D399', avatar: '⚙️' },
  evangeline: { id: 'evangeline', name: 'Evangeline', title: 'Legal Risk Analyst',              department: 'legal',          icon: 'Shield',        colorScheme: '#F43F5E', avatar: '🛡️' },
  atlas:      { id: 'atlas',      name: 'Atlas',      title: 'Infrastructure Engineer',         department: 'technology',     icon: 'Globe',         colorScheme: '#0EA5E9', avatar: '🌐' },
  cipher:     { id: 'cipher',     name: 'Cipher',     title: 'Security Analyst',                department: 'security',       icon: 'Lock',          colorScheme: '#EF4444', avatar: '🔐' },
  maven:      { id: 'maven',      name: 'Maven',      title: 'Data Scientist',                  department: 'analytics',      icon: 'BarChart3',     colorScheme: '#7C3AED', avatar: '📊' },
  vesta:      { id: 'vesta',      name: 'Vesta',      title: 'Property Valuation Specialist',   department: 'operations',     icon: 'Building2',     colorScheme: '#D97706', avatar: '🏢' },
  henry:      { id: 'henry',      name: 'Henry',      title: 'Document Hub Manager (The Record Keeper)',   department: 'legal',          icon: 'FileText',      colorScheme: '#7C3AED', avatar: '📄' },
  hunter:     { id: 'hunter',     name: 'Hunter',     title: 'Lead Generation Specialist',      department: 'sales',          icon: 'Target',        colorScheme: '#DC2626', avatar: '🎯' },
  juno:       { id: 'juno',       name: 'Juno',       title: 'Client Relations Manager',        department: 'sales',          icon: 'Heart',         colorScheme: '#BE185D', avatar: '💼' },
  kairos:     { id: 'kairos',     name: 'Kairos',     title: 'Market Intelligence Analyst',     department: 'analytics',      icon: 'TrendingUp',    colorScheme: '#065F46', avatar: '📡' },
  sentinel:   { id: 'sentinel',   name: 'Sentinel',   title: 'Monitoring & Alerting',           department: 'security',       icon: 'Eye',           colorScheme: '#991B1B', avatar: '👁️' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Validate assistant ID to prevent path traversal (slug chars only). */
const SAFE_ID_RE = /^[a-z0-9-]{1,64}$/;

function assertSafeId(id: string): void {
  if (!SAFE_ID_RE.test(id)) {
    throw new AppError('Invalid assistant ID', 400);
  }
}

/** Resolve plan path and assert it stays inside PLANS_DIR. */
function planPath(id: string): string {
  const resolved = path.resolve(PLANS_DIR, `${id}.md`);
  if (!resolved.startsWith(PLANS_DIR + path.sep)) {
    throw new AppError('Invalid assistant ID', 400);
  }
  return resolved;
}

/**
 * Reject plan content that contains HTML tags, preventing stored-XSS entirely.
 * Plans must be plain markdown — HTML elements are not supported.
 * Throws AppError 400 if HTML is detected.
 */
function assertNoHtml(content: string): void {
  // Detect opening HTML tags (e.g. <script, <img, <div, <!-- etc.)
  if (/<[a-zA-Z!\/]/.test(content)) {
    throw new AppError(
      'Plan content must not contain HTML tags. Use plain Markdown only.',
      400,
    );
  }
  // Block javascript: URIs in markdown links/images
  if (/javascript\s*:/i.test(content)) {
    throw new AppError('Plan content must not contain javascript: URIs.', 400);
  }
}

/** Verify that the request user has super-user access (owner or admin). */
function assertSuperUser(req: AuthRequest): void {
  const role = req.user?.role?.toLowerCase();
  if (role !== 'owner' && role !== 'admin') {
    throw new AppError('Super-user access required', 403);
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * GET /api/assistants
 * Returns the list of all AI assistants (metadata only, no plan content).
 * Public — no auth required.
 */
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const assistants = Object.values(ASSISTANT_REGISTRY);
    res.json({ success: true, data: assistants, total: assistants.length });
  }),
);

/**
 * GET /api/assistants/:id/plan
 * Returns the markdown plan for a specific assistant.
 * Requires authentication.
 */
router.get(
  '/:id/plan',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertSafeId(id);

    if (!ASSISTANT_REGISTRY[id]) {
      throw new AppError(`Assistant '${id}' not found`, 404);
    }

    const filePath = planPath(id);

    try {
      await access(filePath);
    } catch {
      // Plan file doesn't exist yet — return an empty plan
      res.json({ success: true, data: { id, plan: null, exists: false } });
      return;
    }

    const content = await readFile(filePath, 'utf-8');
    res.json({ success: true, data: { id, plan: content, exists: true } });
  }),
);

/**
 * POST /api/assistants
 * Create a new assistant or plan entry (super-user only).
 * Body: { id, plan }
 */
router.post(
  '/',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    assertSuperUser(req);

    const { id, plan } = req.body as { id?: string; plan?: string };

    if (!id || typeof id !== 'string') {
      throw new AppError('Field "id" is required', 400);
    }
    if (typeof plan !== 'string') {
      throw new AppError('Field "plan" must be a string', 400);
    }

    assertSafeId(id);
    assertNoHtml(plan);
    const filePath = planPath(id);

    // Prevent overwriting without explicit PUT
    try {
      await access(filePath);
      throw new AppError(`Plan for '${id}' already exists. Use PUT to update.`, 409);
    } catch (err) {
      if (err instanceof AppError) throw err;
      // File does not exist — continue
    }

    await writeFile(filePath, plan, 'utf-8');
    log.info(`Plan created for assistant '${id}' by user ${req.user?.id}`);

    res.status(201).json({ success: true, data: { id, exists: true } });
  }),
);

/**
 * PUT /api/assistants/:id
 * Update the markdown plan for an existing assistant (super-user only).
 * Body: { plan }
 */
router.put(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    assertSuperUser(req);

    const { id } = req.params;
    assertSafeId(id);

    if (!ASSISTANT_REGISTRY[id]) {
      throw new AppError(`Assistant '${id}' not found`, 404);
    }

    const { plan } = req.body as { plan?: string };
    if (typeof plan !== 'string') {
      throw new AppError('Field "plan" must be a string', 400);
    }

    assertNoHtml(plan);
    const filePath = planPath(id);

    await writeFile(filePath, plan, 'utf-8');
    log.info(`Plan updated for assistant '${id}' by user ${req.user?.id}`);

    res.json({ success: true, data: { id, exists: true } });
  }),
);

/**
 * DELETE /api/assistants/:id
 * Delete the markdown plan for an assistant (super-user only).
 */
router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    assertSuperUser(req);

    const { id } = req.params;
    assertSafeId(id);

    if (!ASSISTANT_REGISTRY[id]) {
      throw new AppError(`Assistant '${id}' not found`, 404);
    }

    const filePath = planPath(id);

    try {
      await access(filePath);
    } catch {
      throw new AppError(`No plan found for assistant '${id}'`, 404);
    }

    await unlink(filePath);
    log.info(`Plan deleted for assistant '${id}' by user ${req.user?.id}`);

    res.json({ success: true, data: { id, deleted: true } });
  }),
);

export default router;
