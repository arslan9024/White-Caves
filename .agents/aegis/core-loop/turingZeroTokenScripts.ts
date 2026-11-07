// turingZeroTokenScripts.ts
// Small zero‑token utilities that perform filesystem or simple operations
// without invoking any AI models. They are meant to be used by the orchestrator
// when the credit‑budget logic determines a ZERO_TOKEN_SCRIPT lane.

/** Rename a list of files (synchronously). */
export function renameFiles(renameMap: Record<string, string>): void {
  const fs = require('fs');
  for (const [src, dest] of Object.entries(renameMap)) {
    if (fs.existsSync(src)) {
      fs.renameSync(src, dest);
    }
  }
}

/** Scaffold a basic file with a template string. */
export function scaffoldFile(filePath: string, template: string): void {
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, template, { encoding: 'utf8' });
  }
}

/** Format a file using Prettier (if installed). */
export async function formatFile(filePath: string): Promise<void> {
  const { exec } = require('child_process');
  await new Promise((resolve, reject) => {
    exec(`npx prettier --write "${filePath}"`, (err: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
}

/** Run an arbitrary zero‑token callback. */
export async function runZeroTokenScript<T>(fn: () => T | Promise<T>): Promise<T> {
  return await Promise.resolve(fn());
}

