// turingIntegrity.ts
// Handles SHA‑256 integrity verification for plan markdown files.
// Stores a simple JSON map of planName -> hash in `.planHashes.json`.

import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { PlanReadError } from './turingErrors';
import { logger } from './turingLogger';

const HASH_FILE = path.join(process.cwd(), '.agents', 'aegis', 'core-loop', '.planHashes.json');

/** Compute SHA‑256 hash of a string. */
export function computeHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/** Load stored hashes (creates file if missing). */
export function loadHashes(): Record<string, string> {
  try {
    const raw = fs.readFileSync(HASH_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    // If file doesn't exist or is invalid, return empty map.
    return {};
  }
}

/** Persist hash map to disk. */
export function saveHashes(map: Record<string, string>): void {
  try {
    fs.writeFileSync(HASH_FILE, JSON.stringify(map, null, 2), 'utf8');
  } catch (e) {
    logger.error('Failed to write plan hash file', e);
  }
}

/** Verify the integrity of a plan's content; throws PlanReadError on mismatch. */
export function verifyPlanIntegrity(name: string, content: string): void {
  const stored = loadHashes();
  const currentHash = computeHash(content);
  if (stored[name] && stored[name] !== currentHash) {
    throw new PlanReadError(`Integrity check failed for plan "${name}"`);
  }
  // Update the stored hash (idempotent when unchanged).
  stored[name] = currentHash;
  saveHashes(stored);
}

