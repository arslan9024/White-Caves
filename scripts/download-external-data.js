import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const sources = [
  {
    id: 'dld-home',
    url: 'https://dubailand.gov.ae/en/',
    output: 'data/dubai-real-estate/dld/source-dld-home.html',
  },
  {
    id: 'dld-rental-index',
    url: 'https://dubailand.gov.ae/en/eservices/rental-index/rental-index/',
    output: 'data/dubai-real-estate/rera/source-rental-index.html',
  },
  {
    id: 'bayut-market-trends',
    url: 'https://www.bayut.com/mybayut/market-trends/',
    output: 'data/dubai-real-estate/market-intel/source-bayut-market-trends.html',
  },
  {
    id: 'bayut-rules-regulations',
    url: 'https://www.bayut.com/mybayut/rules-regulations/',
    output: 'data/dubai-real-estate/market-intel/source-bayut-rules-regulations.html',
  },
];

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'White-Caves-Resource-Bootstrap/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const manifest = {
    generatedAt: new Date().toISOString(),
    items: [],
  };

  for (const source of sources) {
    const outputPath = path.join(root, source.output);
    await mkdir(path.dirname(outputPath), { recursive: true });

    try {
      const content = await fetchText(source.url);
      await writeFile(outputPath, content, 'utf8');
      manifest.items.push({
        id: source.id,
        url: source.url,
        output: source.output,
        status: 'downloaded',
        bytes: Buffer.byteLength(content, 'utf8'),
      });
      console.log(`Downloaded ${source.id}`);
    } catch (error) {
      manifest.items.push({
        id: source.id,
        url: source.url,
        output: source.output,
        status: 'failed',
        reason: error instanceof Error ? error.message : String(error),
      });
      console.warn(
        `Failed ${source.id}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  const manifestPath = path.join(root, 'data/dubai-real-estate/resource-manifest.json');
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`Wrote manifest: ${path.relative(root, manifestPath)}`);
}

main().catch(error => {
  console.error('External resource download failed.');
  console.error(error);
  process.exitCode = 1;
});
