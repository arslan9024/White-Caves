export * from '../aegis/scripts/generate-seo-assets.js';
import { generateSeoAssets } from '../aegis/scripts/generate-seo-assets.js';
import { fileURLToPath } from 'node:url';

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  generateSeoAssets();
}
