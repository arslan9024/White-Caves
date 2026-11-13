const fs = require('fs');
const path = require('path');

const bookDir = path.join(process.cwd(), '.agents', 'book-white-caves');
if (!fs.existsSync(bookDir)) {
  console.error('Book directory does not exist:', bookDir);
  process.exit(1);
}

const files = fs.readdirSync(bookDir).filter(f => f.endsWith('.html'));
const broken = [];
const allTargets = new Set();

files.forEach(file => {
  const content = fs.readFileSync(path.join(bookDir, file), 'utf8');
  const hrefRegex = /href=["']([^"'#]+)(?:#[^"']*)?["']/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const target = match[1];
    if (target.endsWith('.html') && !target.startsWith('http')) {
      allTargets.add(target);
      if (!fs.existsSync(path.join(bookDir, target))) {
        broken.push({ source: file, target });
      }
    }
  }
});

console.log('Total HTML files in book:', files.length);
console.log('Linked HTML targets:', Array.from(allTargets));
console.log('Broken links found:', broken.length);
if (broken.length > 0) {
  console.log(JSON.stringify(broken, null, 2));
}
