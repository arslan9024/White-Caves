/**
 * AEGIS V4.1 Single Purpose File Law Refactoring
 * Decomposes src/config/assistantRegistry.ts (1,466 lines) into modular < 350 line files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const FILE_PATH = path.join(ROOT, 'src/config/assistantRegistry.ts');
const TARGET_DIR = path.join(ROOT, 'src/config/assistantRegistryData');

const raw = fs.readFileSync(FILE_PATH, 'utf8');
const lines = raw.split(/\r?\n/);
console.log(`Read ${lines.length} lines from ${FILE_PATH}`);

fs.mkdirSync(TARGET_DIR, { recursive: true });
fs.mkdirSync(path.join(TARGET_DIR, 'assistants'), { recursive: true });

// 1. TYPES (Lines 7 to 104)
const typesContent = lines.slice(6, 105).join('\n') + '\n';
fs.writeFileSync(path.join(TARGET_DIR, 'types.ts'), typesContent, 'utf8');
console.log(`Written types.ts (${typesContent.split('\n').length} lines)`);

// 2. DEPARTMENTS (Lines 109 to 199)
const deptLines = lines.slice(109, 200).join('\n');
const departmentsContent = `import type { Department, DepartmentId } from './types';\n\n${deptLines}\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'departments.data.ts'), departmentsContent, 'utf8');
console.log(`Written departments.data.ts (${departmentsContent.split('\n').length} lines)`);

// 3. ASSISTANTS (Lines 200 to 1382)
function extractObjectChunks(startLineIdx, endLineIdx, keyRegex, endRegex) {
  const chunks = {};
  let currentKey = null;
  let currentLines = [];

  for (let i = startLineIdx; i <= endLineIdx; i++) {
    const line = lines[i];
    const m = line.match(keyRegex);
    if (m) {
      if (currentKey) {
        chunks[currentKey] = currentLines.join('\n');
      }
      currentKey = m[1];
      currentLines = [line];
    } else if (currentKey) {
      currentLines.push(line);
      if (endRegex && endRegex.test(line)) {
        chunks[currentKey] = currentLines.join('\n');
        currentKey = null;
        currentLines = [];
      }
    }
  }
  if (currentKey) {
    chunks[currentKey] = currentLines.join('\n');
  }
  return chunks;
}

const assistantChunks = extractObjectChunks(200, 1382, /^\s{2}([a-z_]+):\s*\{/, /^\s{2}\},?/);
console.log('Extracted assistant chunks:', Object.keys(assistantChunks).length);

for (const [key, val] of Object.entries(assistantChunks)) {
  let cleaned = val.trimEnd();
  if (cleaned.endsWith('};')) cleaned = cleaned.slice(0, -1);
  if (!cleaned.endsWith(',')) cleaned += ',';
  assistantChunks[key] = cleaned;
}

const assistantGroups = [
  { name: 'coreAssistants.data.ts', varName: 'coreAssistants', keys: ['nadia', 'nina', 'mary', 'nancy', 'daisy', 'clara', 'sophia', 'theodora'] },
  { name: 'growthAssistants.data.ts', varName: 'growthAssistants', keys: ['olivia', 'zoe', 'laila', 'aurora', 'hazel', 'willow', 'evangeline', 'sentinel'] },
  { name: 'intelligenceAssistants.data.ts', varName: 'intelligenceAssistants', keys: ['hunter', 'henry', 'cipher', 'atlas', 'vesta', 'juno', 'kairos', 'maven'] },
  { name: 'marketAssistants.data.ts', varName: 'marketAssistants', keys: ['linda', 'archer', 'prism', 'sage', 'echo', 'mira', 'rex', 'iris'] },
  { name: 'advancedAssistants.data.ts', varName: 'advancedAssistants', keys: ['apex', 'halo', 'oracle', 'flux', 'nova', 'quill', 'lumen', 'crest'] },
];

assistantGroups.forEach(grp => {
  const filePath = path.join(TARGET_DIR, 'assistants', grp.name);
  const itemsContent = grp.keys.map(k => assistantChunks[k]).filter(Boolean).join('\n');
  const fileContent = `import type { Assistant, AssistantId } from '../types';\n\nexport const ${grp.varName}: Partial<Record<AssistantId, Assistant>> = {\n${itemsContent}\n};\n`;
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Written ${filePath} (${fileContent.split('\n').length} lines)`);
});

const assistantsIndexContent = `import type { Assistant, AssistantId } from '../types';
import { coreAssistants } from './coreAssistants.data';
import { growthAssistants } from './growthAssistants.data';
import { intelligenceAssistants } from './intelligenceAssistants.data';
import { marketAssistants } from './marketAssistants.data';
import { advancedAssistants } from './advancedAssistants.data';

export const AI_ASSISTANTS: Record<AssistantId, Assistant> = {
  ...coreAssistants,
  ...growthAssistants,
  ...intelligenceAssistants,
  ...marketAssistants,
  ...advancedAssistants,
} as Record<AssistantId, Assistant>;
`;
fs.writeFileSync(path.join(TARGET_DIR, 'assistants', 'index.ts'), assistantsIndexContent, 'utf8');

// 4. ACCESSORS (Lines 1387 to 1445)
const accessorLines = lines.slice(1387, 1445).join('\n');
const accessorsContent = `import type { Assistant, AssistantId, Department, DepartmentId, NavigationItem, AssistantDataFlows } from './types';
import { DEPARTMENTS } from './departments.data';
import { AI_ASSISTANTS } from './assistants';

${accessorLines}
`;
fs.writeFileSync(path.join(TARGET_DIR, 'accessors.ts'), accessorsContent, 'utf8');
console.log(`Written accessors.ts (${accessorsContent.split('\n').length} lines)`);

// 5. NEW FACADE assistantRegistry.ts (< 60 lines)
const facadeContent = `// ============================================================================
// AI Assistant Registry - TypeScript Facade
// AEGIS V4.1 Single Purpose File Law: Decomposed into modular < 350-line datasets
// ============================================================================

export type {
  Department,
  DepartmentId,
  AssistantId,
  DataAccessLevel,
  AssistantPermissions,
  AssistantDataFlows,
  Assistant,
  NavigationItem,
} from './assistantRegistryData/types';

export { DEPARTMENTS } from './assistantRegistryData/departments.data';
export { AI_ASSISTANTS } from './assistantRegistryData/assistants';

export {
  getAssistantById,
  getAssistantsByDepartment,
  getAllAssistants,
  getAllDepartments,
  getDepartmentById,
  getAssistantCount,
  getDepartmentCount,
  ASSISTANT_IDS,
  DEPARTMENT_IDS,
  getDepartmentOrder,
  getNavigationStructure,
  getDataFlowsForAssistant,
} from './assistantRegistryData/accessors';

import { DEPARTMENTS } from './assistantRegistryData/departments.data';
import { AI_ASSISTANTS } from './assistantRegistryData/assistants';
import {
  getAssistantById,
  getAssistantsByDepartment,
  getAllAssistants,
  getAllDepartments,
  getDepartmentById,
  getAssistantCount,
  getDepartmentCount,
  ASSISTANT_IDS,
  DEPARTMENT_IDS,
  getDepartmentOrder,
  getNavigationStructure,
  getDataFlowsForAssistant,
} from './assistantRegistryData/accessors';

export default {
  AI_ASSISTANTS,
  DEPARTMENTS,
  getAssistantById,
  getAssistantsByDepartment,
  getAllAssistants,
  getAllDepartments,
  getDepartmentById,
  getAssistantCount,
  getDepartmentCount,
  getDepartmentOrder,
  getNavigationStructure,
  getDataFlowsForAssistant,
  ASSISTANT_IDS,
  DEPARTMENT_IDS,
};
`;
fs.writeFileSync(FILE_PATH, facadeContent, 'utf8');
console.log(`Rewrote ${FILE_PATH} to ${facadeContent.split('\n').length} lines.`);
