// fix-aegis-imports.cjs
const fs = require('fs');

const bcPath = '../Aegis-Sterling/ui/src/components/WhiteCavesBook/BookContext.tsx';
if (fs.existsSync(bcPath)) {
  let content = fs.readFileSync(bcPath, 'utf8');
  content = content.replace('BookCategory,', '').replace(', BookCategory', '');
  fs.writeFileSync(bcPath, content, 'utf8');
}

const mbvPath = '../Aegis-Sterling/ui/src/components/WhiteCavesBook/ModernBookView.tsx';
if (fs.existsSync(mbvPath)) {
  let content = fs.readFileSync(mbvPath, 'utf8');
  content = content.replace('Layers,', '').replace('Sparkles,', '');
  fs.writeFileSync(mbvPath, content, 'utf8');
}

const tpPath = '../Aegis-Sterling/ui/src/components/WhiteCavesBook/types.ts';
if (fs.existsSync(tpPath)) {
  let content = fs.readFileSync(tpPath, 'utf8');
  content = content.replace("import { ReactNode } from 'react';", "");
  fs.writeFileSync(tpPath, content, 'utf8');
}

console.log('Cleaned unused imports successfully');
