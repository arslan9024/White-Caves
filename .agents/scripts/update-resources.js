import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'data/dubai-real-estate/resource-manifest.json');

async function main() {
  let manifest;

  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    manifest = { generatedAt: null, items: [] };
  }

  const updated = {
    ...manifest,
    updatedAt: new Date().toISOString(),
    itemCount: Array.isArray(manifest.items) ? manifest.items.length : 0,
  };

  await writeFile(manifestPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`Updated resource manifest metadata at ${updated.updatedAt}`);
}

main().catch(error => {
  console.error('Failed to update resource manifest.');
  console.error(error);
  process.exitCode = 1;
});
