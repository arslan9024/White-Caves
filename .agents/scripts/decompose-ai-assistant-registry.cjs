/**
 * AEGIS V4.1 Single Purpose File Law Refactoring
 * Decomposes src/store/slices/aiAssistant/registry.ts (3,700 lines) into modular < 350 line data files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const REGISTRY_PATH = path.join(ROOT, 'src/store/slices/aiAssistant/registry.ts');
const TARGET_DIR = path.join(ROOT, 'src/store/slices/aiAssistant/registryData');

const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
const lines = raw.split(/\r?\n/);

console.log(`Read ${lines.length} lines from ${REGISTRY_PATH}`);

// Ensure target directories exist
const dirs = [
  TARGET_DIR,
  path.join(TARGET_DIR, 'assistants'),
  path.join(TARGET_DIR, 'notifications'),
  path.join(TARGET_DIR, 'tasks'),
];
dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

// 1. EXTRACT ASSISTANTS
// Find assistant bounds: line 19 to 1399
// Assistants list in order:
// mary, theodora, olivia, zoe, laila, nadia, linda, sophia (8)
// daisy, clara, nina, nancy, aurora, hazel, willow, evangeline (8)
// sentinel, hunter, henry, cipher, atlas, vesta, juno, kairos (8)
// maven, archer, prism, sage, echo, mira, rex, iris (8)
// apex, halo, oracle, flux, nova, quill, lumen, crest (8)

const assistantGroups = [
  { name: 'coreAssistants.data.ts', varName: 'coreAssistants', keys: ['mary', 'theodora', 'olivia', 'zoe', 'laila', 'nadia', 'linda', 'sophia'] },
  { name: 'growthAssistants.data.ts', varName: 'growthAssistants', keys: ['daisy', 'clara', 'nina', 'nancy', 'aurora', 'hazel', 'willow', 'evangeline'] },
  { name: 'intelligenceAssistants.data.ts', varName: 'intelligenceAssistants', keys: ['sentinel', 'hunter', 'henry', 'cipher', 'atlas', 'vesta', 'juno', 'kairos'] },
  { name: 'marketAssistants.data.ts', varName: 'marketAssistants', keys: ['maven', 'archer', 'prism', 'sage', 'echo', 'mira', 'rex', 'iris'] },
  { name: 'advancedAssistants.data.ts', varName: 'advancedAssistants', keys: ['apex', 'halo', 'oracle', 'flux', 'nova', 'quill', 'lumen', 'crest'] },
];

// Helper to extract keyed object chunks:
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
        // We reached the closing bracket for this key
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

const assistantChunks = extractObjectChunks(18, 1400, /^\s{2}([a-z_]+):\s*\{/, /^\s{2}\},?/);
console.log('Extracted assistant chunks:', Object.keys(assistantChunks).length);

// Clean up trailing comma on last item if needed
for (const [key, val] of Object.entries(assistantChunks)) {
  let cleaned = val.trimEnd();
  if (cleaned.endsWith('};')) cleaned = cleaned.slice(0, -1); // remove semicolon if any
  if (!cleaned.endsWith(',')) cleaned += ',';
  assistantChunks[key] = cleaned;
}

assistantGroups.forEach(grp => {
  const filePath = path.join(TARGET_DIR, 'assistants', grp.name);
  const itemsContent = grp.keys.map(k => assistantChunks[k]).filter(Boolean).join('\n');
  const fileContent = `import type { AIAssistant } from '../types';\n\nexport const ${grp.varName}: Record<string, AIAssistant> = {\n${itemsContent}\n};\n`;
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Written ${filePath} (${fileContent.split('\n').length} lines)`);
});

// Assistants index.ts
const assistantsIndexContent = `import type { AIAssistant } from '../types';
import { coreAssistants } from './coreAssistants.data';
import { growthAssistants } from './growthAssistants.data';
import { intelligenceAssistants } from './intelligenceAssistants.data';
import { marketAssistants } from './marketAssistants.data';
import { advancedAssistants } from './advancedAssistants.data';

export const AI_ASSISTANTS_REGISTRY: Record<string, AIAssistant> = {
  ...coreAssistants,
  ...growthAssistants,
  ...intelligenceAssistants,
  ...marketAssistants,
  ...advancedAssistants,
};

// URL normalizer for CRM unified routing
Object.values(AI_ASSISTANTS_REGISTRY).forEach(assistant => {
  if (
    assistant &&
    typeof assistant.dashboardUrl === 'string' &&
    assistant.dashboardUrl.startsWith('/owner/dashboard?tab=')
  ) {
    assistant.dashboardUrl = assistant.dashboardUrl.replace('/owner/dashboard', '/crm');
  }
});
`;
fs.writeFileSync(path.join(TARGET_DIR, 'assistants', 'index.ts'), assistantsIndexContent, 'utf8');

// 2. DEPARTMENT COLORS
const deptColorsContent = `export const DEPARTMENT_COLORS: Record<string, string> = {
  operations: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  finance: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  marketing: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  executive: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  compliance: 'linear-gradient(135deg, #EF4444 0%, #8b5cf6 100%)',
  communications: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
  sales: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
  technology: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
  legal: 'linear-gradient(135deg, #C9A84C 0%, #a8883a 100%)',
  intelligence: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
  customer_experience: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  data_and_ai: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'departmentColors.data.ts'), deptColorsContent, 'utf8');

// 3. ACTIVITIES
// Lines 1430 to 1674
const activitiesLines = lines.slice(1429, 1674);
const activitiesContent = `import type { Activity } from '../types';\n\n${activitiesLines.join('\n')}\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'activities.data.ts'), activitiesContent, 'utf8');
console.log(`Written activities.data.ts (${activitiesContent.split('\n').length} lines)`);

// 4. NOTIFICATIONS
const notifChunks = extractObjectChunks(1678, 2137, /^\s{4}([a-z_]+):\s*\[/, /^\s{4}\],?/);
console.log('Extracted notification chunks:', Object.keys(notifChunks).length);

for (const [key, val] of Object.entries(notifChunks)) {
  let cleaned = val.trimEnd();
  if (cleaned.endsWith('};')) cleaned = cleaned.slice(0, -1);
  if (!cleaned.endsWith(',')) cleaned += ',';
  notifChunks[key] = cleaned;
}

const notifKeys = Object.keys(notifChunks);
const notifGroup1Keys = notifKeys.slice(0, 20);
const notifGroup2Keys = notifKeys.slice(20);

const notif1Content = `import type { Notification } from '../types';\n\nexport const getNotificationsPart1 = (now: number): Record<string, Notification[]> => ({\n${notifGroup1Keys.map(k => notifChunks[k]).join('\n')}\n});\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'notifications', 'notificationsPart1.data.ts'), notif1Content, 'utf8');

const notif2Content = `import type { Notification } from '../types';\n\nexport const getNotificationsPart2 = (now: number): Record<string, Notification[]> => ({\n${notifGroup2Keys.map(k => notifChunks[k]).join('\n')}\n});\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'notifications', 'notificationsPart2.data.ts'), notif2Content, 'utf8');

const notifIndexContent = `import type { Notification } from '../types';
import { getNotificationsPart1 } from './notificationsPart1.data';
import { getNotificationsPart2 } from './notificationsPart2.data';

export const generateNotifications = (): Record<string, Notification[]> => {
  const now = Date.now();
  return {
    ...getNotificationsPart1(now),
    ...getNotificationsPart2(now),
  };
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'notifications', 'index.ts'), notifIndexContent, 'utf8');

// 5. TASKS LIFECYCLE HELPER
const lifecycleLines = lines.slice(2139, 2188);
const lifecycleContent = `import type { Task, TaskAction, TaskLifecycleStage } from '../types';\n\nexport ${lifecycleLines.join('\n')}\n`;
fs.writeFileSync(path.join(TARGET_DIR, 'tasks', 'taskLifecycle.ts'), lifecycleContent, 'utf8');

// 6. TASKS
const taskChunks = extractObjectChunks(2191, 3690, /^\s{4}([a-z_]+):\s*\[/, /^\s{4}\],?/);
console.log('Extracted task chunks:', Object.keys(taskChunks).length);

for (const [key, val] of Object.entries(taskChunks)) {
  let cleaned = val.trimEnd();
  if (cleaned.endsWith('};')) cleaned = cleaned.slice(0, -1);
  if (!cleaned.endsWith(',')) cleaned += ',';
  taskChunks[key] = cleaned;
}

const taskGroups = [
  { name: 'coreTasks.data.ts', varName: 'coreRawTasks', keys: ['mary', 'theodora', 'olivia', 'zoe', 'laila', 'nadia', 'linda', 'sophia'] },
  { name: 'growthTasks.data.ts', varName: 'growthRawTasks', keys: ['daisy', 'clara', 'nina', 'nancy', 'aurora', 'hazel', 'willow', 'evangeline'] },
  { name: 'intelligenceTasks.data.ts', varName: 'intelligenceRawTasks', keys: ['sentinel', 'hunter', 'henry', 'cipher', 'atlas', 'vesta', 'juno', 'kairos'] },
  { name: 'marketTasks.data.ts', varName: 'marketRawTasks', keys: ['maven', 'archer', 'prism', 'sage', 'echo', 'mira', 'rex', 'iris'] },
  { name: 'advancedTasks.data.ts', varName: 'advancedRawTasks', keys: ['apex', 'halo', 'oracle', 'flux', 'nova', 'quill', 'lumen', 'crest'] },
];

taskGroups.forEach(grp => {
  const filePath = path.join(TARGET_DIR, 'tasks', grp.name);
  const itemsContent = grp.keys.map(k => taskChunks[k]).filter(Boolean).join('\n');
  const fileContent = `import type { Task } from '../types';\n\nexport const ${grp.varName}: Record<string, Task[]> = {\n${itemsContent}\n};\n`;
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Written ${filePath} (${fileContent.split('\n').length} lines)`);
});

const tasksIndexContent = `import type { Task } from '../types';
import { enrichTaskWithLifecycle } from './taskLifecycle';
import { coreRawTasks } from './coreTasks.data';
import { growthRawTasks } from './growthTasks.data';
import { intelligenceRawTasks } from './intelligenceTasks.data';
import { marketRawTasks } from './marketTasks.data';
import { advancedRawTasks } from './advancedTasks.data';

export const generateTasks = (): Record<string, Task[]> => {
  const rawTasks: Record<string, Task[]> = {
    ...coreRawTasks,
    ...growthRawTasks,
    ...intelligenceRawTasks,
    ...marketRawTasks,
    ...advancedRawTasks,
  };

  const now = Date.now();
  const enriched: Record<string, Task[]> = {};
  for (const [assistantId, taskList] of Object.entries(rawTasks)) {
    // eslint-disable-next-line security/detect-object-injection
    enriched[assistantId] = taskList.map(t => enrichTaskWithLifecycle(t as Task, now));
  }
  return enriched;
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'tasks', 'index.ts'), tasksIndexContent, 'utf8');

// 7. NEW FACADE REGISTRY.TS (< 35 lines)
const newRegistryContent = `// ============================================================================
// AI ASSISTANT DASHBOARD — REGISTRY DATA FACADE
// AEGIS V4.1 Single Purpose File Law: Decomposed into modular < 350-line datasets
// ============================================================================

export { AI_ASSISTANTS_REGISTRY } from './registryData/assistants';
export { DEPARTMENT_COLORS } from './registryData/departmentColors.data';
export { generateActivities } from './registryData/activities.data';
export { generateNotifications } from './registryData/notifications';
export { generateTasks } from './registryData/tasks';
`;
fs.writeFileSync(REGISTRY_PATH, newRegistryContent, 'utf8');
console.log(`Rewrote ${REGISTRY_PATH} to ${newRegistryContent.split('\n').length} lines.`);
