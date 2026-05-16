import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const SRC_ROOT = path.resolve(process.cwd(), 'src');

const shouldScan = (filePath: string) => {
  if (!/\.(js|jsx|ts|tsx)$/.test(filePath)) return false;
  if (/\.(test|spec)\.(js|jsx|ts|tsx)$/.test(filePath)) return false;
  if (filePath.includes(`${path.sep}__tests__${path.sep}`)) return false;
  return true;
};

const collectSourceFiles = (dir: string, result: string[] = []) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, result);
      continue;
    }

    if (entry.isFile() && shouldScan(fullPath)) {
      result.push(fullPath);
    }
  }

  return result;
};

describe('Runtime alert guard', () => {
  it('contains no runtime alert() calls in src production files', () => {
    const files = collectSourceFiles(SRC_ROOT);
    const violations: string[] = [];

    for (const file of files) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split(/\r?\n/);

      lines.forEach((line, index) => {
        if (/\b(?:window\.)?alert\s*\(/.test(line)) {
          violations.push(`${path.relative(process.cwd(), file)}:${index + 1}`);
        }
      });
    }

    expect(violations).toEqual([]);
  });
});
