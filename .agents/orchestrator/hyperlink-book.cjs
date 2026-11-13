const fs = require('fs');
const path = require('path');

const bookDir = path.join(process.cwd(), '.agents', 'book-white-caves');
const files = fs.readdirSync(bookDir).filter(f => f.endsWith('.html'));

const glossary = [
  { term: 'TURING-BOOK-011', link: 'chapter-09-conversations-and-decisions.html#turing-book-011' },
  { term: 'TURING-LAW-000', link: 'chapter-01-architecture.html#turing-law-000' },
  { term: 'TURING-ROOT-007', link: 'chapter-01-architecture.html#turing-root-007' },
  { term: 'TURING-NAV-TREE-009', link: 'chapter-01-architecture.html#turing-nav-tree-009' },
  { term: 'Perpetual Ouroboros', link: 'chapter-03-ouroboros.html' },
  { term: 'Sovereign Mesh', link: 'chapter-02-mesh.html' },
  { term: 'AEGIS Mesh', link: 'chapter-02-mesh.html' },
  { term: 'Henry OCR', link: 'chapter-04-henry.html' },
  { term: 'Mary Property Inventory', link: 'chapter-05-mary.html' },
  { term: 'Domain Actors Matrix', link: 'chapter-06-actors-matrix.html' },
  { term: 'ERMS', link: 'chapter-06-actors-matrix.html' },
  { term: 'DMS', link: 'chapter-06-actors-matrix.html' },
  { term: 'TMS', link: 'chapter-06-actors-matrix.html' },
  { term: 'White-Caves-Web', link: 'chapter-09-conversations-and-decisions.html#web-decoupling' },
  { term: 'Progress Intelligence', link: 'progress-intelligence.html' }
];

let totalReplacements = 0;

files.forEach(file => {
  const filePath = path.join(bookDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

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
    }
    .book-hyperlink:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
    `;
    content = content.replace('</style>', styleSnippet + '\n</style>');
  }

  glossary.forEach(item => {
    // Escape regex specials
    const escaped = item.term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Match only when outside tags
    const reg = new RegExp('(?<!<[^>]*)' + escaped + '(?![^<]*>)(?![^<]*<\\/a>)', 'g');
    content = content.replace(reg, (match) => {
      totalReplacements++;
      return `<a href="${item.link}" class="book-hyperlink" title="Explore: ${item.term}">${match}</a>`;
    });
  });

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log(`Successfully hyperlinked book elements! Injected ${totalReplacements} hyperlinks across ${files.length} chapters.`);
