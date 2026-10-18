import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('========================================================================');
console.log('  🛡️ AEGIS V4 DEEP CODEBASE INTELLIGENCE & AUDIT ENGINE');
console.log('========================================================================');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const SOURCE_DIRS = ['src', 'server'];
const CACHE_DIR = path.join(ROOT_DIR, '.aegis');
const CACHE_FILE = path.join(CACHE_DIR, 'analyzer-cache.json');

// Initialize cache directory
if (!fs.existsSync(CACHE_DIR)) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch {}
}

let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    cache = {};
  }
}

let totalFilesScanned = 0;
let cacheHits = 0;
const findings = {
  hardcodedMocks: [],
  stubbedHandlers: [],
  typeAnyUsages: [],
  todoItems: [],
  unoptimizedLoops: [],
};

const updatedCache = {};

function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (
        entry.name !== 'node_modules' &&
        entry.name !== '.git' &&
        entry.name !== 'dist' &&
        entry.name !== '.aegis'
      ) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?|js|ts)$/.test(entry.name)) {
      totalFilesScanned++;
      const stats = fs.statSync(fullPath);
      const cached = cache[relPath];

      if (cached && cached.mtime === stats.mtimeMs && cached.size === stats.size) {
        cacheHits++;
        updatedCache[relPath] = cached;
        if (cached.hardcodedMocks) findings.hardcodedMocks.push(...cached.hardcodedMocks);
        if (cached.stubbedHandlers) findings.stubbedHandlers.push(...cached.stubbedHandlers);
        if (cached.typeAnyUsages) findings.typeAnyUsages.push(...cached.typeAnyUsages);
        if (cached.todoItems) findings.todoItems.push(...cached.todoItems);
        continue;
      }

      const fileFindings = {
        hardcodedMocks: [],
        stubbedHandlers: [],
        typeAnyUsages: [],
        todoItems: [],
      };

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        // Check for hardcoded mocks
        if (
          /mockData|mockList|dummyData|mockUser/i.test(line) &&
          !relPath.includes('.test.') &&
          !relPath.includes('/mock/')
        ) {
          fileFindings.hardcodedMocks.push({ file: relPath, line: lineNum, snippet: line.trim() });
        }
        // Check for stubbed handlers
        if (
          /onClick=\{\(\)\s*=>\s*\{\}\}/.test(line) ||
          /onSubmit=\{\(\)\s*=>\s*\{\}\}/.test(line)
        ) {
          fileFindings.stubbedHandlers.push({ file: relPath, line: lineNum, snippet: line.trim() });
        }
        // Check for explicit type any
        if (/:\s*any\b/.test(line) && !relPath.includes('.test.')) {
          fileFindings.typeAnyUsages.push({ file: relPath, line: lineNum, snippet: line.trim() });
        }
        // Check for TODO / FIXME
        if (/\/\/\s*(TODO|FIXME)/i.test(line)) {
          fileFindings.todoItems.push({ file: relPath, line: lineNum, snippet: line.trim() });
        }
      });

      findings.hardcodedMocks.push(...fileFindings.hardcodedMocks);
      findings.stubbedHandlers.push(...fileFindings.stubbedHandlers);
      findings.typeAnyUsages.push(...fileFindings.typeAnyUsages);
      findings.todoItems.push(...fileFindings.todoItems);

      updatedCache[relPath] = {
        mtime: stats.mtimeMs,
        size: stats.size,
        ...fileFindings,
      };
    }
  }
}

const startTime = Date.now();
SOURCE_DIRS.forEach(d => scanDirectory(path.join(ROOT_DIR, d)));

try {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(updatedCache), 'utf8');
} catch {}

const durationMs = Date.now() - startTime;

const reportContent = `# AEGIS V4 Deep Codebase Audit Report

> **Scan Generated:** ${new Date().toISOString()}  
> **Total Files Scanned:** ${totalFilesScanned} source files (Cache Hits: ${cacheHits})  
> **Scan Duration:** ${durationMs}ms  
> **Status:** Deep Static Analysis Complete  

---

## 📊 Deep Metric Breakdown

- **Total Source Files Scanned:** ${totalFilesScanned}
- **Hardcoded Production Mocks Detected:** ${findings.hardcodedMocks.length}
- **Empty / Stubbed Event Handlers:** ${findings.stubbedHandlers.length}
- **TypeScript \`any\` Annotations:** ${findings.typeAnyUsages.length}
- **Unresolved TODO / FIXME Tags:** ${findings.todoItems.length}

---

## 🔍 Hardcoded Production Mocks (${findings.hardcodedMocks.length})

${
  findings.hardcodedMocks
    .slice(0, 15)
    .map(
      f =>
        `- [\`${f.file}:${f.line}\`](file:///${ROOT_DIR.replace(/\\/g, '/')}/${f.file}#L${f.line}): \`${f.snippet}\``
    )
    .join('\n') || 'None detected.'
}

---

## ⚡ Empty / Stubbed Event Handlers (${findings.stubbedHandlers.length})

${
  findings.stubbedHandlers
    .slice(0, 15)
    .map(
      f =>
        `- [\`${f.file}:${f.line}\`](file:///${ROOT_DIR.replace(/\\/g, '/')}/${f.file}#L${f.line}): \`${f.snippet}\``
    )
    .join('\n') || 'None detected.'
}

---

## 🏷️ TypeScript \`any\` Type Usages (${findings.typeAnyUsages.length})

${
  findings.typeAnyUsages
    .slice(0, 15)
    .map(
      f =>
        `- [\`${f.file}:${f.line}\`](file:///${ROOT_DIR.replace(/\\/g, '/')}/${f.file}#L${f.line}): \`${f.snippet}\``
    )
    .join('\n') || 'None detected.'
}

---

## 📝 Pending TODO / FIXME Items (${findings.todoItems.length})

${
  findings.todoItems
    .slice(0, 15)
    .map(
      f =>
        `- [\`${f.file}:${f.line}\`](file:///${ROOT_DIR.replace(/\\/g, '/')}/${f.file}#L${f.line}): \`${f.snippet}\``
    )
    .join('\n') || 'None detected.'
}
`;

const reportPath = path.join(ROOT_DIR, 'docs/plans/DEEP_CODEBASE_AUDIT_REPORT.md');
fs.writeFileSync(reportPath, reportContent, 'utf8');

console.log(`📊 Scanned ${totalFilesScanned} files in ${durationMs}ms (${cacheHits} cache hits).`);
console.log(`• Hardcoded Mocks: ${findings.hardcodedMocks.length}`);
console.log(`• Stubbed Handlers: ${findings.stubbedHandlers.length}`);
console.log(`• Type 'any' Usages: ${findings.typeAnyUsages.length}`);
console.log(`• Pending TODOs: ${findings.todoItems.length}`);
console.log(`✅ Deep Audit Report written to: docs/plans/DEEP_CODEBASE_AUDIT_REPORT.md`);
console.log('========================================================================');
