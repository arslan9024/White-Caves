import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Reads all markdown plan files from the .agents/plans directory.
 * Returns a map where the key is the filename and the value is the file content.
 * Files larger than 5KB are truncated to the first 500 lines to respect token limits.
 */
export async function readPlans(): Promise<Record<string, string>> {
  const plansDir = path.resolve(__dirname, '..', '..', 'plans');
  const entries = await fs.readdir(plansDir, { withFileTypes: true });
  const result: Record<string, string> = {};
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const filePath = path.join(plansDir, entry.name);
      const stat = await fs.stat(filePath);
      // If file > 5KB, read only first 500 lines (surgical read).
      if (stat.size > 5 * 1024) {
        const raw = await fs.readFile(filePath, 'utf-8');
        const lines = raw.split('\n').slice(0, 500).join('\n');
        result[entry.name] = lines;
      } else {
        const content = await fs.readFile(filePath, 'utf-8');
        result[entry.name] = content;
      }
    }
  }
  return result;
}
