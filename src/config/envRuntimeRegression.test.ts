import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_ROOT = path.resolve(__dirname, '..');

const FILES_REQUIRING_BROWSER_SAFE_ENV = [
  ['config/apiConfig.ts', 'import.meta.env'],
  ['components/ErrorBoundary.tsx', 'import.meta.env'],
  ['services/PropertyQueryService.js', 'getApiUrl'],
  ['services/relationalSidebarAPI.js', 'getApiUrl'],
  ['services/whatsapp/whatsapp.service.ts', 'getApiUrl'],
] as const;

describe('Client env runtime regression', () => {
  it.each(FILES_REQUIRING_BROWSER_SAFE_ENV)(
    '%s uses browser-safe runtime configuration',
    (relativePath, expectedConfiguration) => {
      const absolutePath = path.resolve(SRC_ROOT, relativePath);
      const source = fs.readFileSync(absolutePath, 'utf8');

      expect(source).not.toMatch(/\bprocess\.env\b/);
      expect(source).toContain(expectedConfiguration);
    }
  );
});
