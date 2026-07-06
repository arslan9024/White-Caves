import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { AI_ASSISTANTS_REGISTRY } from '../store/slices/aiAssistant/registry';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');
const PLANS_DIR = path.resolve(REPO_ROOT, 'business_docs/03_ai_assistants');

describe('Assistant plan files parity', () => {
  it('ensures each assistant id has a matching markdown plan file', () => {
    const assistantIds = Object.keys(AI_ASSISTANTS_REGISTRY);

    const missingPlanFiles = assistantIds.filter(id => {
      const filePath = path.resolve(PLANS_DIR, `${id}.md`);
      return !fs.existsSync(filePath);
    });

    expect(missingPlanFiles).toEqual([]);
  });
});
