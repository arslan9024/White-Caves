// turingZeroTokenScripts.ts
// Small zero‑token utilities that perform filesystem or simple operations
// without invoking any AI models. They are meant to be used by the orchestrator
// when the credit‑budget logic determines a ZERO_TOKEN_SCRIPT lane.

import { existsSync, renameSync, writeFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { format } from 'prettier';

/** Rename a list of files (synchronously). */
export function renameFiles(renameMap: Record<string, string>): void {
  for (const [src, dest] of Object.entries(renameMap)) {
    if (existsSync(src)) {
      renameSync(src, dest);
    }
  }
}

/** Scaffold a basic file with a template string. */
export function scaffoldFile(filePath: string, template: string): void {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, template, { encoding: 'utf8' });
  }
}

/** Format a file using Prettier (if installed). */
export async function formatFile(filePath: string): Promise<void> {
  const source = await readFile(filePath, 'utf8');
  const formatted = await format(source, { filepath: filePath });
  await writeFile(filePath, formatted, 'utf8');
}

/** Run an arbitrary zero‑token callback. */
export async function runZeroTokenScript<T>(fn: () => T | Promise<T>): Promise<T> {
  return await Promise.resolve(fn());
}
