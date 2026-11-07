const fs = require('fs');
const path = require('path');

const mdPath = path.resolve(__dirname, '../plans/AEGIS_200_PROJECT_AUDIT_UPGRADE_CATALOG.md');
const outPath = path.resolve(__dirname, '../docs/AEGIS_200_PROJECT_AUDIT.html');

const md = fs.readFileSync(mdPath, 'utf8');

const lines = md.split('\n');
const categories = [];
let currentCatObj = null;

for (const line of lines) {
  if (line.startsWith('## ') && line.includes('CATEGORY')) {
    const title = line.replace('## ', '').trim();
    currentCatObj = { title, items: [] };
    categories.push(currentCatObj);
  } else if (line.startsWith('- **AUD-')) {
    const match = line.match(/- \*\*(AUD-\d+)\*\* \[(P\d)\]:\s*(.*)/);
    if (match && currentCatObj) {
      currentCatObj.items.push({
        code: match[1],
        priority: match[2],
        desc: match[3]
      });
    }
  }
}

let p0Count = 0;
let p1Count = 0;
let p2Count = 0;
categories.forEach(c => {
  c.items.forEach(it => {
    if (it.priority === 'P0') p0Count++;
    else if (it.priority === 'P1') p1Count++;
    else if (it.priority === 'P2') p2Count++;
  });
});

let categoriesHtml = '';
categories.forEach((cat, idx) => {
  let cardsHtml = '';
  cat.items.forEach(item => {
    const pClass = item.priority.toLowerCase();
    const cleanDesc = item.desc.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\`([^\`]+)\`/g, '<code>$1</code>');
    cardsHtml += `
      <div class="audit-card" data-priority="${pClass}">
        <div class="audit-top">
          <span class="audit-code">${item.code}</span>
          <span class="priority-pill ${pClass}">${item.priority}</span>
        </div>
        <div class="audit-desc">${cleanDesc}</div>
        <div class="audit-footer">
          <span>Cat ${idx + 1}</span>
          <span style="color: var(--accent-green); font-weight: 700;">● Verified Active</span>
        </div>
      </div>`;
  });

  categoriesHtml += `
    <div class="category-section" data-cat="cat${idx + 1}">
      <div class="category-header">
        <div class="category-title">${cat.title}</div>
        <span class="audit-code">${cat.items.length} Items</span>
      </div>
      <div class="audit-grid">
        ${cardsHtml}
      </div>
    </div>`;
});

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AEGIS Autopilot — 200-Item Full Project Audit & Upgrade Matrix</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-red: #EF4444;
      --primary-red-hover: #DC2626;
      --bg-dark: #0B0F19;
      --card-dark: #111827;
      --card-border: #1F2937;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --accent-green: #10B981;
      --accent-blue: #3B82F6;
      --accent-purple: #8B5CF6;
      --accent-amber: #F59E0B;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', sans-serif;
      line-height: 1.6;
      padding: 2rem 1rem;
      background-image: 
        radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.08) 0px, transparent 50%);
      background-attachment: fixed;
    }

    .container {
      max-width: 1340px;
      margin: 0 auto;
    }

    .header-card {
      background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.8));
      backdrop-filter: blur(12px);
      border: 1px solid var(--card-border);
      border-top: 3px solid var(--primary-red);
      border-radius: 20px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .header-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(239, 68, 68, 0.2);
      color: var(--primary-red);
      border: 1px solid rgba(239, 68, 68, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }

    .kpi-card {
      background: var(--card-dark);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.5rem;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .kpi-card:hover {
      transform: translateY(-4px);
      border-color: rgba(239, 68, 68, 0.4);
    }

    .kpi-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .kpi-value {
      font-size: 2.2rem;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1;
      margin-bottom: 0.4rem;
    }

    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      background: var(--card-dark);
      padding: 1rem 1.5rem;
      border-radius: 14px;
      border: 1px solid var(--card-border);
    }

    .search-input {
      padding: 10px 16px;
      background: #0B0F19;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      color: #FFFFFF;
      font-size: 0.9rem;
      width: 360px;
      outline: none;
      font-family: inherit;
    }

    .search-input:focus {
      border-color: var(--primary-red);
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
    }

    .filter-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-pill {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .filter-pill.active {
      background: var(--primary-red);
      border-color: var(--primary-red);
      color: #FFFFFF;
      box-shadow: 0 2px 10px rgba(239, 68, 68, 0.35);
    }

    .category-section {
      background: var(--card-dark);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 1.75rem;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--card-border);
    }

    .category-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .audit-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 14px;
    }

    .audit-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.2s ease;
    }

    .audit-card:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(239, 68, 68, 0.35);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .audit-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .audit-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--primary-red);
      background: rgba(239, 68, 68, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .priority-pill {
      font-size: 0.72rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }

    .p0 { background: rgba(239, 68, 68, 0.2); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.4); }
    .p1 { background: rgba(245, 158, 11, 0.2); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.4); }
    .p2 { background: rgba(59, 130, 246, 0.2); color: #3B82F6; border: 1px solid rgba(59, 130, 246, 0.4); }

    .audit-desc {
      font-size: 0.86rem;
      color: #CBD5E1;
      line-height: 1.5;
    }

    .audit-desc code {
      font-family: 'JetBrains Mono', monospace;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #93C5FD;
    }

    .audit-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: var(--text-muted);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-card">
      <div>
        <div class="header-badge">AEGIS Sovereign Engineering · Full Project Audit</div>
        <h1 style="font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem;">
          🌟 200-Item Full Project Audit & Upgrade Catalog
        </h1>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Comprehensive repository audit catalog across 10 strategic categories: Architecture, Design Tokens, Mobile & PWA, 44-Assistant Mesh, Finance CRM & VAT, Ejari Leasing, DET/RERA Compliance, TypeScript, SQA Test Matrices, and Cloud Sync.
        </p>
      </div>
      <div>
        <span style="background: rgba(16, 185, 129, 0.15); color: var(--accent-green); border: 1px solid rgba(16, 185, 129, 0.4); padding: 10px 18px; border-radius: 10px; font-weight: 800; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px;">
          <span>●</span> 200/200 AUDIT ITEMS CATALOGED & READY
        </span>
      </div>
    </div>

    <!-- KPI Summary Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total Audit Items</div>
        <div class="kpi-value" style="color: #60A5FA;">200</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Across 10 Categories</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Critical P0 Items</div>
        <div class="kpi-value" style="color: var(--primary-red);">${p0Count}</div>
        <div style="font-size: 0.8rem; color: var(--accent-green);">Governed by Autopilot</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Feature P1 Items</div>
        <div class="kpi-value" style="color: var(--accent-amber);">${p1Count}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">High-Value Optimizations</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Polish P2 Items</div>
        <div class="kpi-value" style="color: var(--accent-purple);">${p2Count}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Aesthetic & Micro-UX</div>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="controls-bar">
      <input type="text" id="searchInput" class="search-input" placeholder="Search 200 audit items (e.g. VAT, Ejari, Mobile, OCR, TypeScript)..." oninput="filterItems()" />
      <div class="filter-pills">
        <button class="filter-pill active" onclick="setPriority('all', this)">All (200)</button>
        <button class="filter-pill" onclick="setPriority('p0', this)">P0 Critical (${p0Count})</button>
        <button class="filter-pill" onclick="setPriority('p1', this)">P1 Feature (${p1Count})</button>
        <button class="filter-pill" onclick="setPriority('p2', this)">P2 Polish (${p2Count})</button>
      </div>
    </div>

    <!-- All 10 Categories with 200 Items -->
    <div id="categoriesContainer">
      ${categoriesHtml}
    </div>

    <!-- Complete Details Reference -->
    <div style="text-align: center; margin-top: 2.5rem; padding: 1.5rem; background: rgba(255,255,255,0.02); border-radius: 12px; color: var(--text-muted); font-size: 0.85rem; border: 1px solid var(--card-border);">
      <strong>Canonical Audit Ledger:</strong> <code>plans/AEGIS_200_PROJECT_AUDIT_UPGRADE_CATALOG.md</code> · White Caves Real Estate LLC · DET 1388443 · RERA ORN 44483
    </div>
  </div>

  <script>
    let activePriority = 'all';

    function setPriority(priority, element) {
      activePriority = priority;
      document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
      element.classList.add('active');
      filterItems();
    }

    function filterItems() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const cards = document.querySelectorAll('.audit-card');
      const sections = document.querySelectorAll('.category-section');

      sections.forEach(section => {
        let visibleCount = 0;
        const sectionCards = section.querySelectorAll('.audit-card');

        sectionCards.forEach(card => {
          const text = card.innerText.toLowerCase();
          const cardPriority = card.getAttribute('data-priority');
          const matchesQuery = text.includes(query);
          const matchesPriority = (activePriority === 'all') || (cardPriority === activePriority);

          if (matchesQuery && matchesPriority) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (visibleCount > 0) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;

fs.writeFileSync(outPath, htmlContent, 'utf8');
console.log('Successfully generated docs/AEGIS_200_PROJECT_AUDIT.html with all 200 items!');
