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

let totalFilesScanned = 0;
const findings = {
  hardcodedMocks: [],
  stubbedHandlers: [],
  typeAnyUsages: [],
  todoItems: [],
  unoptimizedLoops: [],
};

function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?|js|ts)$/.test(entry.name)) {
      totalFilesScanned++;
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        // Check for hardcoded mocks
        if (/mockData|mockList|dummyData|mockUser/i.test(line) && !relPath.includes('.test.') && !relPath.includes('/mock/')) {
          findings.hardcodedMocks.push({ file: relPath, line: lineNum, snippet: line.trim() });
        }
        // Check for stubbed handlers
        if (/onClick=\{\(\)\s*=>\s*\{\}\}/.test(line) || /onSubmit=\{\(\)\s*=>\s*\{\}\}/.test(line)) {
          findings.stubbedHandlers.push({ file: relPath, line: lineNum, snippet: line.trim() });
        }
        // Check for explicit type any
        if (/:\s*any\b/.test(line) && !relPath.includes('.test.')) {
          findings.typeAnyUsages.push({ file: relPath, line: lineNum, snippet: line.trim() });
        }
        // Check for TODO / FIXME
        if (/\/\/\s*(TODO|FIXME)/i.test(line)) {
          findings.todoItems.push({ file: relPath, line: lineNum, snippet: line.trim() });
        }
      });
    }
  }
}

SOURCE_DIRS.forEach((d) => scanDirectory(path.join(ROOT_DIR, d)));

const reportContent = `# AEGIS V4 Deep Codebase Audit Report

> **Scan Generated:** ${new Date().toISOString()}  
> **Total Files Scanned:** ${totalFilesScanned} source files  
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

${findings.hardcodedMocks.slice(0, 15).map((f) => `- [\`${f.file}:${f.line}\`](file:///${ROOT_DIR.replace(/\\/g, '/')}/${f.file}#L${f.line}): \`${f.snippet}\``).join('\n') || 'None detected.'}

---

## ⚡ Empty / Stubbed Event Handlers (${findings.stubbedHandlers.length})

${findings.stubbedHandlers.slice(0, 15).map((f) => `- [\`${f.file}:${f.line}\`](file:///${ROOT_DIR.replace(/\\/g, '/')}/${f.file}#L${f.line}): \`${f.snippet}\``).join('\n') || 'None detected.'}

---

## 🏷️ TypeScript \`any\` Type Usages (${findings.typeAnyUsages.length})

${findings.typeAnyUsages.slice(0, 15).map((f) => `- [\`${f.file}:${f.line}\`](file:///${ROOT_DIR.replace(/\\/g, '/')}/${f.file}#L${f.line}): \`${f.snippet}\``).join('\n') || 'None detected.'}

---

## 📝 Pending TODO / FIXME Items (${findings.todoItems.length})

${findings.todoItems.slice(0, 15).map((f) => `- [\`${f.file}:${f.line}\`](file:///${ROOT_DIR.replace(/\\/g, '/')}/${f.file}#L${f.line}): \`${f.snippet}\``).join('\n') || 'None detected.'}
`;

const reportPath = path.join(ROOT_DIR, 'docs/plans/DEEP_CODEBASE_AUDIT_REPORT.md');
fs.writeFileSync(reportPath, reportContent, 'utf8');

console.log(`📊 Scanned ${totalFilesScanned} files cleanly.`);
console.log(`• Hardcoded Mocks: ${findings.hardcodedMocks.length}`);
console.log(`• Stubbed Handlers: ${findings.stubbedHandlers.length}`);
console.log(`• Type 'any' Usages: ${findings.typeAnyUsages.length}`);
console.log(`• Pending TODOs: ${findings.todoItems.length}`);
console.log(`✅ Deep Audit Report written to: docs/plans/DEEP_CODEBASE_AUDIT_REPORT.md`);
console.log('========================================================================');
