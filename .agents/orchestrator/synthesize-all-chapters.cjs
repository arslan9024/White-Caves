// .agents/orchestrator/synthesize-all-chapters.cjs
const fs = require('fs');
const path = require('path');
const { parseFileToChapter, renderChapterTs, cleanStr } = require('./generate-book-chapters.cjs');

const destDir = path.resolve('src/components/ZoeFeatures/WhiteCavesBook');

// 1. Synthesize Department Business SOPs into Volume III
const bizDir = path.resolve('.agents/business_docs');
function getBizFiles(dir) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, ent.name);
    if (ent.isDirectory()) res = res.concat(getBizFiles(f));
    else if (ent.isFile() && ent.name.endsWith('.md')) res.push(f);
  }
  return res;
}

const bizFiles = getBizFiles(bizDir);
console.log('Found business docs:', bizFiles.length);

const deptSubChapters = [];
let scIdx = 1;
for (const bf of bizFiles) {
  const baseName = path.basename(bf, '.md').toUpperCase();
  const cData = parseFileToChapter(bf, `BIZ-${scIdx}`, scIdx);
  if (cData.subChapters && cData.subChapters.length > 0) {
    deptSubChapters.push({
      ...cData.subChapters[0],
      subChapterNumber: scIdx,
      title: cleanStr(cData.title || baseName),
      nodeId: `SC06-BIZ-${scIdx}`
    });
    scIdx++;
  }
}

const chapterDeptSOPs = {
  nodeId: 'CH05-DEPT-SOPS',
  chapterNumber: 30,
  chapterCode: 'CH-30-DEPT-SOPS',
  title: 'Chapter 30: 12 Corporate Department Operations & Governance',
  subtitle: 'SOPs, Compliance Gates, Financial Controls & CRM Primitives across All Floors',
  readTimeMinutes: 45,
  subChapters: deptSubChapters
};
fs.writeFileSync(path.join(destDir, 'chapterDepartmentSOPs.ts'), renderChapterTs(chapterDeptSOPs, 'CHAPTER_DEPARTMENT_SOPS'), 'utf8');
console.log('Wrote chapterDepartmentSOPs.ts with subChapters:', deptSubChapters.length);

// 2. Synthesize Strategic Plans into Volume IV
const plansDir = path.resolve('.agents/plans');
const planFiles = fs.existsSync(plansDir) ? fs.readdirSync(plansDir).filter(f => f.endsWith('.md')) : [];
console.log('Found plans:', planFiles.length);

const planSubChapters = [];
let pIdx = 1;
for (const pf of planFiles.slice(0, 15)) {
  const full = path.join(plansDir, pf);
  const cData = parseFileToChapter(full, `PLAN-${pIdx}`, pIdx);
  if (cData.subChapters && cData.subChapters.length > 0) {
    planSubChapters.push({
      ...cData.subChapters[0],
      subChapterNumber: pIdx,
      title: cleanStr(cData.title),
      nodeId: `SC06-PLAN-${pIdx}`
    });
    pIdx++;
  }
}

const chapterStrategicPlans = {
  nodeId: 'CH05-STRAT-PLANS',
  chapterNumber: 31,
  chapterCode: 'CH-31-STRAT-PLANS',
  title: 'Chapter 31: Strategic Master Plans & Autopilot Directives',
  subtitle: 'Ouroboros Execution Loops, ERMS Upgrades, Backlog Deduplication & Wave Roadmaps',
  readTimeMinutes: 40,
  subChapters: planSubChapters
};
fs.writeFileSync(path.join(destDir, 'chapterStrategicPlans.ts'), renderChapterTs(chapterStrategicPlans, 'CHAPTER_STRATEGIC_PLANS'), 'utf8');
console.log('Wrote chapterStrategicPlans.ts with subChapters:', planSubChapters.length);

// 3. Synthesize Business Strategies into Volume V
const stratDir = path.resolve('.agents/strategies');
const stratFiles = fs.existsSync(stratDir) ? fs.readdirSync(stratDir).filter(f => f.endsWith('.md')) : [];
console.log('Found strategies:', stratFiles.length);

const stratSubChapters = [];
let sIdx = 1;
for (const sf of stratFiles) {
  const full = path.join(stratDir, sf);
  const cData = parseFileToChapter(full, `STRAT-${sIdx}`, sIdx);
  if (cData.subChapters && cData.subChapters.length > 0) {
    stratSubChapters.push({
      ...cData.subChapters[0],
      subChapterNumber: sIdx,
      title: cleanStr(cData.title),
      nodeId: `SC06-STRAT-${sIdx}`
    });
    sIdx++;
  }
}

const chapterBusinessStrategies = {
  nodeId: 'CH05-BIZ-STRAT',
  chapterNumber: 32,
  chapterCode: 'CH-32-BIZ-STRAT',
  title: 'Chapter 32: Enterprise Business Strategies & Continuous Laws',
  subtitle: 'Credit Preservation Law, Dubai Market Strategy, RBAC Engine & Infinite Crucible',
  readTimeMinutes: 35,
  subChapters: stratSubChapters
};
fs.writeFileSync(path.join(destDir, 'chapterBusinessStrategies.ts'), renderChapterTs(chapterBusinessStrategies, 'CHAPTER_BUSINESS_STRATEGIES'), 'utf8');
console.log('Wrote chapterBusinessStrategies.ts with subChapters:', stratSubChapters.length);
