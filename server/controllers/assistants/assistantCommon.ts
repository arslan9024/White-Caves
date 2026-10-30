/**
 * Assistant Common Helpers & Security Assertions
 */

import path from 'path';
import { fileURLToPath } from 'url';
import type { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { createLogger } from '../../utils/logger.js';

export const log = createLogger('AssistantsRoute');

// Resolve the plans directory (business_docs/03_ai_assistants/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PLANS_DIR = path.resolve(__dirname, '../../../business_docs/03_ai_assistants');

/** Validate assistant ID to prevent path traversal (slug chars only). */
export const SAFE_ID_RE = /^[a-z0-9-]{1,64}$/;

export function assertSafeId(id: string): void {
  if (!SAFE_ID_RE.test(id)) {
    throw new AppError('Invalid assistant ID', 400);
  }
}

/** Resolve plan path and assert it stays inside PLANS_DIR. */
export function planPath(id: string): string {
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
export function assertNoHtml(content: string): void {
  // Detect opening HTML tags (e.g. <script, <img, <div, <!-- etc.)
  if (/<[a-zA-Z!\/]/.test(content)) {
    throw new AppError('Plan content must not contain HTML tags. Use plain Markdown only.', 400);
  }
  // Block javascript: URIs in markdown links/images
  if (/javascript\s*:/i.test(content)) {
    throw new AppError('Plan content must not contain javascript: URIs.', 400);
  }
}

/** Verify that the request user has super-user access (owner or admin). */
export function assertSuperUser(req: AuthRequest): void {
  const role = req.user?.role?.toLowerCase();
  if (role !== 'owner' && role !== 'admin') {
    throw new AppError('Super-user access required', 403);
  }
}

