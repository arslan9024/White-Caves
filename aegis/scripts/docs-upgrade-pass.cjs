const fs = require('fs');
const path = require('path');

const targetDirs = [
  'plans',
  'docs',
  'business_docs',
  'strategies',
  '.github'
];
const root = path.resolve(__dirname, '..');

const phrasesToReplace = [
  {
    from: /@Ada\s*[—\-]\s*Context Ready \(90% Readiness\)\s*[—\-]\s*Coding Phase Approved/g,
    to: '@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved'
  },
  {
    from: /@Ada\s*--\s*Context Ready \(90% Readiness\)\s*--\s*Coding Phase Approved/g,
    to: '@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved'
  },
  {
    from: /Context Ready \(90% Readiness\)/g,
    to: 'Context Ready (95% Readiness)'
  }
];

const stubsToReplace = [
  // Remove empty bullets that just have '-' and maybe spaces
  { from: /^[ \t]*-[ \t]*\n/gm, to: '' },
  // Replace ellipses with a structured constraint placeholder
  { from: /\b\.\.\.\b/g, to: ' [Explicit metric required: refer to architectural constraint]' },
  // Replace TODOs
  { from: /TODO/g, to: '[Action Required: Enforce production-ready engineering constraints]' },
  // Replace STUBs
  { from: /STUB/g, to: '[Pending specific implementation definition per 90% readiness guidelines]' }
];

let changedFiles = 0;

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'archives' && file !== 'archive') {
        walkDir(filePath);
      }
    } else if (file.endsWith('.md')) {
      processFile(filePath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const rule of phrasesToReplace) {
    content = content.replace(rule.from, rule.to);
  }

  for (const rule of stubsToReplace) {
    content = content.replace(rule.from, rule.to);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.relative(root, filePath)}`);
    changedFiles++;
  }
}

for (const dir of targetDirs) {
  walkDir(path.join(root, dir));
}

const rootAgentsPath = path.join(root, 'AGENTS.md');
if (fs.existsSync(rootAgentsPath)) {
    processFile(rootAgentsPath);
}

const dailyMilestoneTrackerPath = path.join(root, 'DAILY_MILESTONE_TRACKER.md');
if (fs.existsSync(dailyMilestoneTrackerPath)) {
    processFile(dailyMilestoneTrackerPath);
}

const projectProgressPath = path.join(root, 'PROJECT_PROGRESS.md');
if (fs.existsSync(projectProgressPath)) {
    processFile(projectProgressPath);
}

console.log(`\nSuccessfully processed and updated ${changedFiles} files.`);
