// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { comparePathDebt, importedModules } from '../../scripts/validate-structure.mjs';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const baseline = {
  jsFiles: ['src/legacy.js'],
  oversizedFiles: { 'src/Large.ts': 400 },
  frozenFiles: ['src/components/common/Existing.tsx'],
};

describe('structure enforcement', () => {
  it('rejects swapping grandfathered JS for a new file without changing the count', () => {
    expect(comparePathDebt({ ...baseline, jsFiles: ['src/replacement.js'] }, baseline)).toContain(
      '[RULE-009 new JS] src/replacement.js'
    );
  });
  it('rejects growth of an existing oversized file', () => {
    expect(
      comparePathDebt(
        {
          ...baseline,
          oversizedFiles: { 'src/Large.ts': 401 },
        },
        baseline
      )
    ).toHaveLength(1);
  });
  it('rejects replacing one oversized file with another', () => {
    expect(
      comparePathDebt(
        {
          ...baseline,
          oversizedFiles: { 'src/Another.ts': 401 },
        },
        baseline
      )
    ).toHaveLength(1);
  });
  it('allows debt reduction without new debt', () => {
    expect(
      comparePathDebt(
        {
          jsFiles: [],
          oversizedFiles: { 'src/Large.ts': 380 },
          frozenFiles: [],
        },
        baseline
      )
    ).toEqual([]);
  });
  it('cannot swap files in frozen directories', () => {
    expect(
      comparePathDebt(
        {
          ...baseline,
          frozenFiles: ['src/components/common/Replacement.tsx'],
        },
        baseline
      )
    ).toHaveLength(1);
  });
  it('recognizes import, export, require and dynamic imports but not comments', () => {
    expect(
      importedModules(`
      // from 'fake'
      import 'side-effect';
      import A from 'axios';
      export { A } from 'next/server';
      const b = require('joi');
      const c = import('react-query');
      const text = "from 'not-an-import'";
    `)
    ).toEqual(['side-effect', 'axios', 'next/server', 'joi', 'react-query']);
  });

  it('refuses to bless new JS debt when --update-baseline is requested', () => {
    const root = mkdtempSync(join(tmpdir(), 'whitecaves-structure-'));
    try {
      mkdirSync(join(root, 'scripts'));
      mkdirSync(join(root, 'src'));
      const source = readFileSync(
        new URL('../../scripts/validate-structure.mjs', import.meta.url),
        'utf8'
      );
      const parserUrl = pathToFileURL(createRequire(import.meta.url).resolve('typescript')).href;
      writeFileSync(
        join(root, 'scripts', 'validate-structure.mjs'),
        source.replace("from 'typescript'", `from '${parserUrl}'`)
      );
      writeFileSync(join(root, 'package.json'), '{}');
      writeFileSync(join(root, 'src', 'New.js'), 'export const value = 1;\n');
      const baselinePath = join(root, 'scripts', 'structure-baseline.json');
      const previous = JSON.stringify({
        jsSourceCount: 0,
        oversizedCount: 0,
        frozenCounts: {},
        twins: [],
        zombies: [],
        bannedImportHits: [],
        paths: { jsFiles: [], oversizedFiles: {}, frozenFiles: [] },
      });
      writeFileSync(baselinePath, previous);
      const result = spawnSync(
        process.execPath,
        [join(root, 'scripts', 'validate-structure.mjs'), '--update-baseline'],
        { encoding: 'utf8', timeout: 15_000 }
      );
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('[RULE-009 new JS] src/New.js');
      expect(readFileSync(baselinePath, 'utf8')).toBe(previous);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
