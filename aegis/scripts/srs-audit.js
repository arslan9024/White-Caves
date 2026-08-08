import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const reportDate = new Date().toISOString().slice(0, 10);
const reportPath = path.join(repoRoot, 'docs/software_docs/01_requirements_engineering/SRS_INSIGHTS_REPORT_2026-08-07.md');
const jsonReportPath = path.join(repoRoot, 'docs/software_docs/01_requirements_engineering/srs-audit-summary.json');

const requiredFiles = [
  'docs/software_docs/INDEX.md',
  'docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md',
  'docs/software_docs/01_requirements_engineering/functional_specifications.md',
  'docs/software_docs/01_requirements_engineering/ENTRPRISE_SRS_INVENTORY_2026-08-06.md',
  'docs/software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md',
  'docs/software_docs/02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md',
  'docs/software_docs/IMPLEMENTATION_TEST_READINESS_MASTER.md',
];

const requiredMarkers = [
  ['docs/software_docs/INDEX.md', 'ENTRPRISE_SRS_INVENTORY_2026-08-06.md'],
  ['docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md', 'traceability matrix'],
  ['docs/software_docs/01_requirements_engineering/functional_specifications.md', 'Canonical traceability links'],
  ['docs/software_docs/01_requirements_engineering/ENTRPRISE_SRS_INVENTORY_2026-08-06.md', 'Traceability backbone'],
];

const scanFiles = [
  'docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md',
  'docs/software_docs/01_requirements_engineering/functional_specifications.md',
  'docs/software_docs/01_requirements_engineering/ENTRPRISE_SRS_INVENTORY_2026-08-06.md',
  'docs/software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md',
];

const requirementPattern = /\b(FR|BR|NFR|POL|SEC|INT|OBS|AC)-[A-Z]+-\d{3,4}\b/g;
const requirementRangePattern = /\b(FR|BR|NFR|POL|SEC|INT|OBS|AC)-([A-Z]+)-(\d{3,4})\.\.(\d{3,4})\b/g;
const categoryOrder = ['FR', 'BR', 'NFR', 'POL', 'SEC', 'INT', 'OBS', 'AC'];

const errors = [];
const categoryCounts = Object.fromEntries(categoryOrder.map((category) => [category, 0]));
const fileSummaries = [];
const seenIds = new Set();
let totalMatches = 0;

for (const file of requiredFiles) {
  const absolutePath = path.join(repoRoot, file);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`Missing required artifact: ${file}`);
  }
}

for (const [file, marker] of requiredMarkers) {
  const absolutePath = path.join(repoRoot, file);
  if (!fs.existsSync(absolutePath)) {
    continue;
  }
  const content = fs.readFileSync(absolutePath, 'utf8');
  if (!content.includes(marker)) {
    errors.push(`Missing expected marker in ${file}: ${marker}`);
  }
}

for (const file of scanFiles) {
  const absolutePath = path.join(repoRoot, file);
  if (!fs.existsSync(absolutePath)) {
    continue;
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  const ids = [];
  const seenInFile = new Set();

  const explicitMatches = content.matchAll(requirementPattern);
  for (const match of explicitMatches) {
    const id = match[0];
    if (!seenInFile.has(id)) {
      seenInFile.add(id);
      ids.push(id);
    }
  }

  const rangeMatches = content.matchAll(requirementRangePattern);
  for (const match of rangeMatches) {
    const category = match[1];
    const family = match[2];
    const start = Number.parseInt(match[3], 10);
    const end = Number.parseInt(match[4], 10);
    if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
      errors.push(`Invalid requirement range in ${file}: ${match[0]}`);
      continue;
    }
    const width = Math.max(match[3].length, match[4].length);
    for (let i = start; i <= end; i += 1) {
      const id = `${category}-${family}-${String(i).padStart(width, '0')}`;
      if (!seenInFile.has(id)) {
        seenInFile.add(id);
        ids.push(id);
      }
    }
  }

  const fileCounts = Object.fromEntries(categoryOrder.map((category) => [category, 0]));

  for (const id of ids) {
    const category = id.split('-')[0];
    if (fileCounts[category] !== undefined) {
      fileCounts[category] += 1;
    }
    if (!seenIds.has(id)) {
      seenIds.add(id);
    }
    totalMatches += 1;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }

  fileSummaries.push({
    file,
    count: ids.length,
    counts: fileCounts,
  });
}

const reportContent = `# SRS Insights Report — ${reportDate}

## Summary

- Total requirement IDs detected across the audited SRS artifacts: ${totalMatches}
- Unique requirement IDs detected: ${seenIds.size}
- Audit scope: ${scanFiles.length} core SRS and traceability files

## Category breakdown

${categoryOrder
  .map((category) => `- ${category}: ${categoryCounts[category] || 0}`)
  .join('\n')}

## File-level counts

${fileSummaries
  .map((summary) => {
    const detail = categoryOrder
      .filter((category) => (summary.counts[category] || 0) > 0)
      .map((category) => `${category}:${summary.counts[category]}`)
      .join(', ');
    return `- ${summary.file}: ${summary.count} requirement IDs (${detail})`;
  })
  .join('\n')}

## Audit status

The SRS audit now verifies the existence of the canonical requirements artifacts, the presence of required traceability markers, and the presence of explicit requirement IDs in the core software-docs requirements set.
`;

if (errors.length > 0) {
  console.error('❌ SRS audit failed:');
  for (const error of errors) {
    console.error(` - ${error}`);
  }
  process.exit(1);
}

const jsonSummary = {
  generatedAt: new Date().toISOString(),
  reportDate,
  totalRequirementIds: totalMatches,
  uniqueRequirementIds: seenIds.size,
  categoryCounts,
  files: fileSummaries,
  requiredArtifactsPresent: requiredFiles.every((file) => fs.existsSync(path.join(repoRoot, file))),
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, reportContent, 'utf8');
fs.writeFileSync(jsonReportPath, JSON.stringify(jsonSummary, null, 2), 'utf8');
console.log(`📝 Updated SRS insights report: ${path.relative(repoRoot, reportPath)}`);
console.log(`🧾 Wrote machine-readable summary: ${path.relative(repoRoot, jsonReportPath)}`);
console.log(`📊 Requirement IDs found: ${totalMatches} total / ${seenIds.size} unique`);
for (const category of categoryOrder) {
  console.log(` - ${category}: ${categoryCounts[category] || 0}`);
}
console.log('✅ SRS audit passed.');
