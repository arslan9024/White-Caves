/**
 * AEGIS V4.1 Single Purpose File Law Refactoring
 * Decomposes src/data/theodoraReportsRegistry.ts (1,408 lines) into modular < 350 line files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const FILE_PATH = path.join(ROOT, 'src/data/theodoraReportsRegistry.ts');
const TARGET_DIR = path.join(ROOT, 'src/data/theodoraReports');

const raw = fs.readFileSync(FILE_PATH, 'utf8');
const lines = raw.split(/\r?\n/);
console.log(`Read ${lines.length} lines from ${FILE_PATH}`);

fs.mkdirSync(TARGET_DIR, { recursive: true });
fs.mkdirSync(path.join(TARGET_DIR, 'reports'), { recursive: true });

// 1. TYPES (Lines 1 to 50)
const typesContent = lines.slice(0, 50).join('\n') + '\n';
fs.writeFileSync(path.join(TARGET_DIR, 'types.ts'), typesContent, 'utf8');
console.log(`Written types.ts (${typesContent.split('\n').length} lines)`);

// 2. CATEGORIES (Lines 51 to 68)
const catLines = lines.slice(51, 69).join('\n');
const categoriesContent = `import type { ReportCategoryMeta } from './types';\n\n${catLines}\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'categories.data.ts'), categoriesContent, 'utf8');
console.log(`Written categories.data.ts (${categoriesContent.split('\n').length} lines)`);

// 3. REPORTS
// Cluster 1: Overview, Sales, Inventory (lines 70 to 395)
const cluster1Lines = lines.slice(70, 395).join('\n');
const cluster1Content = `import type { EnterpriseReport } from '../types';\n\nexport const overviewSalesReports: EnterpriseReport[] = [\n${cluster1Lines}\n];\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'reports', 'overviewSales.data.ts'), cluster1Content, 'utf8');
console.log(`Written overviewSales.data.ts (${cluster1Content.split('\n').length} lines)`);

// Cluster 2: Receivables & Payments (lines 395 to 667)
const cluster2Lines = lines.slice(395, 667).join('\n');
const cluster2Content = `import type { EnterpriseReport } from '../types';\n\nexport const receivablesPaymentsReports: EnterpriseReport[] = [\n${cluster2Lines}\n];\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'reports', 'receivablesPayments.data.ts'), cluster2Content, 'utf8');
console.log(`Written receivablesPayments.data.ts (${cluster2Content.split('\n').length} lines)`);

// Cluster 3: Payables, Expenses, Tax, Banking (lines 667 to 913)
const cluster3Lines = lines.slice(667, 913).join('\n');
const cluster3Content = `import type { EnterpriseReport } from '../types';\n\nexport const payablesExpensesReports: EnterpriseReport[] = [\n${cluster3Lines}\n];\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'reports', 'payablesExpenses.data.ts'), cluster3Content, 'utf8');
console.log(`Written payablesExpenses.data.ts (${cluster3Content.split('\n').length} lines)`);

// Cluster 4: Projects & Accountant (lines 913 to 1174)
const cluster4Lines = lines.slice(913, 1174).join('\n');
const cluster4Content = `import type { EnterpriseReport } from '../types';\n\nexport const projectsAccountantReports: EnterpriseReport[] = [\n${cluster4Lines}\n];\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'reports', 'projectsAccountant.data.ts'), cluster4Content, 'utf8');
console.log(`Written projectsAccountant.data.ts (${cluster4Content.split('\n').length} lines)`);

// Cluster 5: Currency, Audit, Automation (lines 1174 to 1406)
const cluster5Lines = lines.slice(1174, 1407).join('\n');
const cluster5Content = `import type { EnterpriseReport } from '../types';\n\nexport const auditAutomationReports: EnterpriseReport[] = [\n${cluster5Lines}\n];\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'reports', 'auditAutomation.data.ts'), cluster5Content, 'utf8');
console.log(`Written auditAutomation.data.ts (${cluster5Content.split('\n').length} lines)`);

// Reports index.ts
const reportsIndexContent = `import type { EnterpriseReport } from '../types';
import { overviewSalesReports } from './overviewSales.data';
import { receivablesPaymentsReports } from './receivablesPayments.data';
import { payablesExpensesReports } from './payablesExpenses.data';
import { projectsAccountantReports } from './projectsAccountant.data';
import { auditAutomationReports } from './auditAutomation.data';

export const THEODORA_67_REPORTS: EnterpriseReport[] = [
  ...overviewSalesReports,
  ...receivablesPaymentsReports,
  ...payablesExpensesReports,
  ...projectsAccountantReports,
  ...auditAutomationReports,
];
`;
fs.writeFileSync(path.join(TARGET_DIR, 'reports', 'index.ts'), reportsIndexContent, 'utf8');

// 4. NEW FACADE theodoraReportsRegistry.ts (< 30 lines)
const facadeContent = `// ============================================================================
// Theodora Reports Registry — Enterprise Financial & Operating Reports Facade
// AEGIS V4.1 Single Purpose File Law: Decomposed into modular < 350-line datasets
// ============================================================================

export type {
  ReportCategoryKey,
  ReportCategoryMeta,
  EnterpriseReport,
} from './theodoraReports/types';

export { THEODORA_REPORT_CATEGORIES } from './theodoraReports/categories.data';
export { THEODORA_67_REPORTS } from './theodoraReports/reports';
`;
fs.writeFileSync(FILE_PATH, facadeContent, 'utf8');
console.log(`Rewrote ${FILE_PATH} to ${facadeContent.split('\n').length} lines.`);

