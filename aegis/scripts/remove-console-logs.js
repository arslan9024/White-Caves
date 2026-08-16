#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// Patterns to match console statements
const consolePatterns = [
  /console\.log\([^)]*\);?/g,
  /console\.error\([^)]*\);?/g,
  /console\.warn\([^)]*\);?/g,
  /console\.info\([^)]*\);?/g,
];

// Files to exclude from removal (keep console in test/script files)
const excludePatterns = [
  /\.test\.(js|jsx)$/,
  /\.spec\.(js|jsx)$/,
  /scripts\//,
  /test-/,
  /ERROR_HANDLING\./,
  /QUICK_ACTION_CHECKLIST\./,
];

let filesProcessed = 0;
let logsRemoved = 0;

function shouldProcessFile(filePath) {
  // Normalize path separators to forward slashes for consistent matching
  const normalized = filePath.replace(/\\/g, '/');
  
  // Only process src/ and server/ directories
  if (!normalized.includes('/src/') && !normalized.includes('/server/')) {
    return false;
  }

  // Exclude test and documentation files
  return !excludePatterns.some(pattern => pattern.test(normalized));
}

function removeConsoleStatements(content) {
  let updated = content;
  let removed = 0;

  consolePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      removed += matches.length;
    }
    updated = updated.replace(pattern, '');
  });

  // Clean up empty lines left behind (multiple empty lines → single empty line)
  updated = updated.replace(/\n\s*\n\s*\n/g, '\n\n');

  return { updated, removed };
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if ((file.endsWith('.js') || file.endsWith('.jsx')) && shouldProcessFile(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { updated, removed } = removeConsoleStatements(content);

        if (removed > 0) {
          fs.writeFileSync(fullPath, updated, 'utf-8');
          filesProcessed++;
          logsRemoved += removed;
          console.log(`✓ ${fullPath} - Removed ${removed} console statements`);
        }
      } catch (error) {
        console.error(`✗ Error processing ${fullPath}:`, error.message);
      }
    }
  });
}

console.log('🧹 Removing console.log/error/warn statements from production code...\n');

processDirectory(path.join(rootDir, 'src'));
processDirectory(path.join(rootDir, 'src/server'));

console.log(`\n✨ Complete!`);
console.log(`📊 Files processed: ${filesProcessed}`);
console.log(`🗑️  Total console statements removed: ${logsRemoved}`);
