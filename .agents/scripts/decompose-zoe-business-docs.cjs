/**
 * AEGIS V4.1 Single Purpose File Law Refactoring
 * Decomposes src/data/zoeBusinessDocsRegistry.ts (1,120 lines) into modular < 350 line files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const FILE_PATH = path.join(ROOT, 'src/data/zoeBusinessDocsRegistry.ts');
const TARGET_DIR = path.join(ROOT, 'src/data/zoeBusinessDocs');

const raw = fs.readFileSync(FILE_PATH, 'utf8');
const lines = raw.split(/\r?\n/);
console.log(`Read ${lines.length} lines from ${FILE_PATH}`);

fs.mkdirSync(TARGET_DIR, { recursive: true });
fs.mkdirSync(path.join(TARGET_DIR, 'docs'), { recursive: true });

// 1. TYPES (Lines 1 to 54)
const typesContent = lines.slice(0, 55).join('\n') + '\n';
fs.writeFileSync(path.join(TARGET_DIR, 'types.ts'), typesContent, 'utf8');
console.log(`Written types.ts (${typesContent.split('\n').length} lines)`);

// 2. CATEGORIES (Lines 55 to 76)
const catLines = lines.slice(55, 77).join('\n');
const categoriesContent = `import type { ZoeBusinessDocCategory } from './types';\n\n${catLines}\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'categories.data.ts'), categoriesContent, 'utf8');
console.log(`Written categories.data.ts (${categoriesContent.split('\n').length} lines)`);

// 3. DOC CLUSTERS WITH EXACT BOUNDS
// Cluster 1: DOC-BUS-00 to DOC-BUS-03 (0-indexed 81 to 411)
let c1 = lines.slice(81, 411).join('\n').trimEnd();
if (!c1.endsWith(',')) c1 += ',';
const cluster1Content = `import type { BusinessDocItem } from '../types';\n\nexport const corporateComplianceDocs: BusinessDocItem[] = [\n${c1}\n];\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'docs', 'corporateCompliance.data.ts'), cluster1Content, 'utf8');
console.log(`Written corporateCompliance.data.ts (${cluster1Content.split('\n').length} lines)`);

// Cluster 2: DOC-BUS-04 to DOC-BUS-07 (0-indexed 411 to 650)
let c2 = lines.slice(411, 650).join('\n').trimEnd();
if (!c2.endsWith(',')) c2 += ',';
const cluster2Content = `import type { BusinessDocItem } from '../types';\n\nexport const leasingFinanceOpsDocs: BusinessDocItem[] = [\n${c2}\n];\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'docs', 'leasingFinanceOps.data.ts'), cluster2Content, 'utf8');
console.log(`Written leasingFinanceOps.data.ts (${cluster2Content.split('\n').length} lines)`);

// Cluster 3: DOC-BUS-08 to DOC-BUS-11 (0-indexed 650 to 874)
let c3 = lines.slice(650, 874).join('\n').trimEnd();
if (!c3.endsWith(',')) c3 += ',';
const cluster3Content = `import type { BusinessDocItem } from '../types';\n\nexport const marketingTechStrategyDocs: BusinessDocItem[] = [\n${c3}\n];\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'docs', 'marketingTechStrategy.data.ts'), cluster3Content, 'utf8');
console.log(`Written marketingTechStrategy.data.ts (${cluster3Content.split('\n').length} lines)`);

// Cluster 4: DOC-BUS-12 to DOC-BUS-16 (0-indexed 874 to 1119)
let c4 = lines.slice(874, 1119).join('\n').trimEnd();
if (!c4.endsWith(',')) c4 += ',';
const cluster4Content = `import type { BusinessDocItem } from '../types';\n\nexport const governanceAuditDocs: BusinessDocItem[] = [\n${c4}\n];\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'docs', 'governanceAudit.data.ts'), cluster4Content, 'utf8');
console.log(`Written governanceAudit.data.ts (${cluster4Content.split('\n').length} lines)`);

// Docs index.ts
const docsIndexContent = `import type { BusinessDocItem } from '../types';
import { corporateComplianceDocs } from './corporateCompliance.data';
import { leasingFinanceOpsDocs } from './leasingFinanceOps.data';
import { marketingTechStrategyDocs } from './marketingTechStrategy.data';
import { governanceAuditDocs } from './governanceAudit.data';

export const ZOE_BUSINESS_DOCS: BusinessDocItem[] = [
  ...corporateComplianceDocs,
  ...leasingFinanceOpsDocs,
  ...marketingTechStrategyDocs,
  ...governanceAuditDocs,
];
`;
fs.writeFileSync(path.join(TARGET_DIR, 'docs', 'index.ts'), docsIndexContent, 'utf8');

// 4. NEW FACADE zoeBusinessDocsRegistry.ts (< 25 lines)
const facadeContent = `// ============================================================================
// Zoe Business Docs Registry — Comprehensive Knowledge & Regulatory Facade
// AEGIS V4.1 Single Purpose File Law: Decomposed into modular < 350-line datasets
// ============================================================================

export type {
  DocSubItem,
  ZoeBusinessDocCategory,
  BusinessDocItem,
} from './zoeBusinessDocs/types';

export { ZOE_BUSINESS_CATEGORIES } from './zoeBusinessDocs/categories.data';
export { ZOE_BUSINESS_DOCS } from './zoeBusinessDocs/docs';
`;
fs.writeFileSync(FILE_PATH, facadeContent, 'utf8');
console.log(`Rewrote ${FILE_PATH} to ${facadeContent.split('\n').length} lines.`);
