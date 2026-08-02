import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const directories = [
  'data/dubai-real-estate/rera/forms',
  'data/dubai-real-estate/dld/forms',
  'data/dubai-real-estate/dld/statistics',
  'data/dubai-real-estate/market-intel/area-guides',
  'docs/best-practices/react-patterns',
  'docs/best-practices/typescript-patterns',
  'docs/best-practices/testing-patterns',
  'docs/compliance-integration/templates',
];

const files = {
  'docs/EXTERNAL_RESOURCES_GUIDE.md': `# External Resources Guide\n\nThis workspace includes local scaffolding for free external resources that accelerate White Caves delivery without adding premium-tool dependency.\n\n## Data Sources\n- \`data/dubai-real-estate/rera/\` — RERA regulations, forms, license references\n- \`data/dubai-real-estate/dld/\` — DLD transaction references, fee guidance, verification notes\n- \`data/dubai-real-estate/market-intel/\` — market snapshots, area guides, competitor research\n\n## Development References\n- \`docs/best-practices/react-patterns/\`\n- \`docs/best-practices/typescript-patterns/\`\n- \`docs/best-practices/testing-patterns/\`\n- \`docs/compliance-integration/\`\n\n## Commands\n- \`npm run resources:setup\` — create/update the local scaffold\n- \`npm run resources:download\` — fetch lightweight public metadata and source snapshots\n- \`npm run resources:update\` — refresh manifests and timestamps\n\n## Operating Notes\n- Prefer official or public, redistributable sources.\n- Treat downloaded material as reference input, not legal advice.\n- Review source pages periodically for changes before using in production workflows.\n`,
  'data/dubai-real-estate/rera/README.md': `# RERA Reference Pack\n\nUse this folder for RERA-related reference materials used by compliance, leasing, and legal planning.\n\n## Expected Contents\n- Regulations summary\n- Public forms index\n- License lookup references\n- Penalty summary and compliance notes\n\n## Source Priorities\n1. Dubai Land Department / official Dubai government pages\n2. RERA forms and notices publicly published online\n3. White Caves-authored summaries with source attribution\n`,
  'data/dubai-real-estate/dld/README.md': `# DLD Reference Pack\n\nUse this folder for DLD transaction and process references that support pricing, transfer-fee logic, and verification workflows.\n\n## Expected Contents\n- Transfer fee rules\n- Transaction process notes\n- Verification checklist\n- Monthly statistics references\n`,
  'data/dubai-real-estate/market-intel/README.md': `# Market Intelligence Pack\n\nThis folder stores public, non-sensitive market research references used for valuation logic, dashboard planning, and area-level analysis.\n\n## Recommended Structure\n- \`area-guides/\` for area-specific notes\n- source snapshots / manifests\n- pricing trend summaries\n- competitor observations\n`,
  'docs/best-practices/react-patterns/README.md': `# React Patterns\n\nStarter location for reusable React patterns relevant to White Caves components.\n\nSuggested topics:\n- container/presentational split\n- compound components\n- custom hooks\n- error boundaries\n- render performance\n`,
  'docs/best-practices/typescript-patterns/README.md': `# TypeScript Patterns\n\nStarter location for strict-mode-friendly TypeScript patterns.\n\nSuggested topics:\n- discriminated unions\n- type guards\n- shared API contracts\n- null-safety patterns\n- utility types\n`,
  'docs/best-practices/testing-patterns/README.md': `# Testing Patterns\n\nStarter location for unit, integration, e2e, accessibility, and performance test patterns.\n\nSuggested topics:\n- Vitest arrangement patterns\n- Playwright critical flows\n- contract tests\n- regression templates\n`,
  'docs/compliance-integration/RERA-Compliance-Checklist.md': `# RERA Compliance Checklist\n\nUse this as a project-level checklist for modules that interact with listings, leasing, notices, or pricing.\n\n- [ ] Listing/business flow references official regulatory source\n- [ ] Required notices or forms are identified\n- [ ] Pricing/rent logic reflects current published guidance\n- [ ] Workflow includes audit trail / timestamping\n- [ ] User-facing copy avoids unsupported legal claims\n`,
  'docs/compliance-integration/templates/Tenancy-Agreement-Template.md': `# Tenancy Agreement Template Notes\n\nThis file is a placeholder for structure guidance only. Final legal language must be reviewed against current UAE / Dubai requirements before use.\n\n## Recommended Sections\n1. Parties\n2. Property details\n3. Term\n4. Rent and payment schedule\n5. Deposit\n6. Maintenance responsibilities\n7. Notice rules\n8. Signatures\n`,
};

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(relativePath) {
  await mkdir(path.join(root, relativePath), { recursive: true });
}

async function ensureFile(relativePath, content) {
  const absolutePath = path.join(root, relativePath);
  const alreadyExists = await exists(absolutePath);

  if (alreadyExists) {
    return { relativePath, created: false };
  }

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content, 'utf8');
  return { relativePath, created: true };
}

async function main() {
  console.log('Setting up free resource scaffolding for White Caves...');

  for (const directory of directories) {
    await ensureDir(directory);
  }

  const results = [];
  for (const [relativePath, content] of Object.entries(files)) {
    results.push(await ensureFile(relativePath, content));
  }

  const createdCount = results.filter(item => item.created).length;
  console.log(`Created ${createdCount} new scaffold file(s).`);

  const reused = results.filter(item => !item.created).map(item => item.relativePath);
  if (reused.length > 0) {
    console.log('Reused existing files:');
    for (const file of reused) {
      console.log(`- ${file}`);
    }
  }

  console.log('Free resource scaffold ready.');
}

main().catch(error => {
  console.error('Failed to set up free resources.');
  console.error(error);
  process.exitCode = 1;
});
