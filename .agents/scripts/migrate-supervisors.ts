// Migration script to convert department supervisor JSON files to typed TypeScript modules
// and archive the original JSONs.
// Run with `ts-node .agents/scripts/migrate-supervisors.ts` or compile then execute.

import { promises as fs } from 'fs';
import * as path from 'path';

// Repository root (adjust if script is moved)
const REPO_ROOT = process.cwd(); // Use current working directory as repo root

async function findJsonFiles(): Promise<string[]> {
  const results: string[] = [];
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (full.endsWith('.json') && full.includes('departments')) {
        results.push(full);
      }
    }
  }
  await walk(REPO_ROOT);
  return results.filter(p => p.includes('supervisor') || p.includes('manager'));
}

interface Supervisor {
  $schema?: string;
  id: string;
  name: string;
  gender: string;
  title: string;
  supervisorSlot: number;
  department: { code: string; name: string };
  hierarchy: { level: number; role: string; reportingTo: string };
  assignedTasks: string[];
  performanceStandard: {
    slaResponseTime: string;
    targetLookupLatency: string;
    complianceAudit: string;
  };
}

async function migrate() {
  const jsonFiles = await findJsonFiles();
  const archiveRoot = path.join(REPO_ROOT, '.agents', 'legacy_archive', 'supervisors');
  await fs.mkdir(archiveRoot, { recursive: true });

  for (const jsonPath of jsonFiles) {
    const raw = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(raw);
    const tsDir = path.dirname(jsonPath);
    const baseName = path.basename(jsonPath, '.json');
    const tsFile = path.join(tsDir, `${baseName}.ts`);

    const interfaceName = `${baseName.replace(/[^a-zA-Z0-9]/g, '_')}Export`;
    const tsContent = `/** Auto‑generated from ${path.basename(jsonPath)} */\nexport interface ${interfaceName} ${JSON.stringify(data, null, 2).replace(/"([^"]+)":/g, '$1:')}\nexport const ${baseName.toUpperCase().replace(/[^A-Z0-9]/g, '_')} = ${JSON.stringify(data, null, 2)} as ${interfaceName};\n`;
    await fs.writeFile(tsFile, tsContent, 'utf-8');

    // Archive original JSON
    const archivePath = path.join(archiveRoot, path.relative(REPO_ROOT, jsonPath));
    await fs.mkdir(path.dirname(archivePath), { recursive: true });
    await fs.rename(jsonPath, archivePath);
    console.log(`Migrated ${jsonPath} → ${tsFile}`);
  }
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
