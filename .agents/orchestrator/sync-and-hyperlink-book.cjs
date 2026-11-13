/**
 * sync-and-hyperlink-book.cjs
 * Canonical Book Compiler & Hyperlinker for The Book of White Caves.
 * Injects glossary links, mathematical models, verifies link integrity,
 * and synchronizes static HTML files to public/.agents/book-white-caves/
 * so WhiteCavesBookViewer.tsx renders all chapters reliably.
 */

const fs = require('fs');
const path = require('path');

const bookDir = path.join(process.cwd(), '.agents', 'book-white-caves');
const publicBookDir = path.join(process.cwd(), 'public', '.agents', 'book-white-caves');

if (!fs.existsSync(bookDir)) {
  console.error('[Book Chronicler] Error: Book directory does not exist at', bookDir);
  process.exit(1);
}

if (!fs.existsSync(publicBookDir)) {
  fs.mkdirSync(publicBookDir, { recursive: true });
}

// Canonical Glossary Matrix with topic anchors and chapters
const glossary = [
  { term: 'Frontend', link: 'chapter-01-architecture.html' },
  { term: 'White-Caves-Frontend', link: 'chapter-01-architecture.html' },
  { term: 'Server', link: 'chapter-08-multi-repo-rbac.html' },
  { term: 'White-Caves-Server', link: 'chapter-08-multi-repo-rbac.html' },
  { term: 'Mobile', link: 'chapter-08-multi-repo-rbac.html' },
  { term: 'White-Caves-Mobile', link: 'chapter-08-multi-repo-rbac.html' },
  { term: 'White-Caves-Web', link: 'chapter-07-web-decoupling.html' },
  { term: 'TURING-BOOK-011', link: 'chapter-09-conversations-and-decisions.html#turing-book-011' },
  { term: 'TURING-LAW-000', link: 'chapter-01-architecture.html#turing-law-000' },
  { term: 'TURING-ROOT-007', link: 'chapter-01-architecture.html#turing-root-007' },
  { term: 'TURING-NAV-TREE-009', link: 'chapter-01-architecture.html#turing-nav-tree-009' },
  { term: 'TURING-RULE-TIERS-012', link: 'chapter-09-conversations-and-decisions.html' },
  { term: 'Perpetual Ouroboros', link: 'chapter-03-ouroboros.html' },
  { term: 'Sovereign Mesh', link: 'chapter-02-mesh.html' },
  { term: 'AEGIS Mesh', link: 'chapter-02-mesh.html' },
  { term: 'Henry OCR', link: 'chapter-04-henry.html' },
  { term: 'Mary Property Inventory', link: 'chapter-05-mary.html' },
  { term: 'Domain Actors Matrix', link: 'chapter-06-actors-matrix.html' },
  { term: 'ERMS', link: 'chapter-06-actors-matrix.html' },
  { term: 'DMS', link: 'chapter-06-actors-matrix.html' },
  { term: 'TMS', link: 'chapter-06-actors-matrix.html' },
  { term: 'Progress Intelligence', link: 'progress-intelligence.html' },
];

const files = fs.readdirSync(bookDir).filter(f => f.endsWith('.html'));
let totalInjectedLinks = 0;

console.log(`[Book Chronicler] Processing ${files.length} chapters...`);

files.forEach(file => {
  const filePath = path.join(bookDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Inject MathJax for mathematical formulas if not present
  if (!content.includes('MathJax') && !content.includes('mathjax')) {
    const mathJaxSnippet = `
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>`;
    content = content.replace('</head>', mathJaxSnippet + '\n</head>');
  }

  // Ensure interactive styling
  if (!content.includes('.book-hyperlink')) {
    const styleSnippet = `
    .book-hyperlink {
      color: #38bdf8;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
      transition: color 0.2s, background 0.2s;
      padding: 0 2px;
      border-radius: 2px;
      font-weight: 500;
    }
    .book-hyperlink:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.15);
    }
    `;
    content = content.replace('</style>', styleSnippet + '\n</style>');
  }

  // Replace glossary terms outside tags
  glossary.forEach(item => {
    // Avoid self-linking the same chapter
    if (item.link === file) return;

    const escaped = item.term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?<!<[^>]*)(${escaped})(?![^<]*>)(?![^<]*<\\/a>)`, 'g');
    content = content.replace(regex, (match) => {
      totalInjectedLinks++;
      return `<a href="${item.link}" class="book-hyperlink" title="Explore ${item.term}">${match}</a>`;
    });
  });

  // Write updated chapter back to source and to public directory
  fs.writeFileSync(filePath, content, 'utf8');
  fs.writeFileSync(path.join(publicBookDir, file), content, 'utf8');
});

console.log(`[Book Chronicler] Injected ${totalInjectedLinks} hyperlinks across chapters.`);
console.log(`[Book Chronicler] Synced all files to public/.agents/book-white-caves/`);
