// generate_tasks_from_docs.js
// This script scans the `business_docs` and `plans` directories,
// selects up to 20 markdown files (or other relevant files),
// and emits simple task descriptors to stdout.
// You can replace the console.log with a proper orchestrator call
// to enqueue tasks in your workflow system.

const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFiles(full));
    } else if (entry.isFile()) {
      // Consider markdown, JSON, or any text files as potential task sources
      if (/[.](md|txt|json)$/i.test(entry.name)) {
        files.push(full);
      }
    }
  }
  return files;
}

function generateTasks() {
  const base = path.resolve(__dirname, '..');
  const docsDir = path.join(base, 'business_docs');
  const plansDir = path.join(base, 'plans');

  const docFiles = fs.existsSync(docsDir) ? getFiles(docsDir) : [];
  const planFiles = fs.existsSync(plansDir) ? getFiles(plansDir) : [];
  const allFiles = [...docFiles, ...planFiles];

  // Randomly shuffle and take up to 20
  const shuffled = allFiles.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 20);

  selected.forEach((file, idx) => {
    const task = {
      id: `generated-${idx + 1}`,
      description: `Review and expand from ${path.relative(base, file)}`,
      sourceFile: file,
    };
    // Placeholder: emit as JSON line – you can pipe this to an orchestrator tool
    console.log(JSON.stringify(task));
  });
}

generateTasks();
