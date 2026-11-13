// .agents/orchestrator/synthesize-docs-clusters.cjs
const fs = require('fs');
const path = require('path');
const { parseFileToChapter, renderChapterTs, cleanStr } = require('./generate-book-chapters.cjs');

const destDir = path.resolve('src/components/ZoeFeatures/WhiteCavesBook');
const docsDir = path.resolve('.agents/docs');

const clusters = {
  'PHASE': [],
  'WAVE': [],
  'SESSION': [],
  'DEPLOYMENT_SYS': []
};

for (const f of fs.readdirSync(docsDir)) {
  if (!f.endsWith('.md')) continue;
  const upper = f.toUpperCase();
  if (upper.includes('PHASE')) clusters['PHASE'].push(f);
  else if (upper.includes('WAVE')) clusters['WAVE'].push(f);
  else if (upper.includes('SESSION') || upper.includes('SUMMARY')) clusters['SESSION'].push(f);
  else clusters['DEPLOYMENT_SYS'].push(f);
}

console.log('Cluster counts:', {
  PHASE: clusters['PHASE'].length,
  WAVE: clusters['WAVE'].length,
  SESSION: clusters['SESSION'].length,
  DEPLOYMENT_SYS: clusters['DEPLOYMENT_SYS'].length
});

function buildConsolidatedChapter(name, clusterFiles, chapterNum, chapterTitle, subtitle) {
  const subChapters = [];
  let scNum = 1;
  for (const f of clusterFiles.slice(0, 12)) {
    const full = path.join(docsDir, f);
    const cData = parseFileToChapter(full, name + '-' + scNum, scNum);
    if (cData.subChapters && cData.subChapters.length > 0) {
      subChapters.push({
        ...cData.subChapters[0],
        subChapterNumber: scNum,
        title: cleanStr(cData.title),
        nodeId: 'SC06-' + name + '-' + scNum
      });
      scNum++;
    }
  }

  return {
    nodeId: 'CH05-' + name,
    chapterNumber: chapterNum,
    chapterCode: 'CH-' + chapterNum + '-' + name,
    title: cleanStr(chapterTitle),
    subtitle: cleanStr(subtitle),
    readTimeMinutes: Math.max(10, subChapters.length * 4),
    subChapters
  };
}

const chPhase = buildConsolidatedChapter('PHASE-EXEC', clusters['PHASE'], 33, 'Chapter 33: Historical Engineering Phases & Migrations', 'Consolidated historical milestones from Phase 0 through Phase 6');
fs.writeFileSync(path.join(destDir, 'chapterPhaseHistory.ts'), renderChapterTs(chPhase, 'CHAPTER_PHASE_HISTORY'), 'utf8');

const chWave = buildConsolidatedChapter('WAVE-SPRINTS', clusters['WAVE'], 34, 'Chapter 34: Wave Sprints & SQA Delivery Tracks', 'Autonomous wave iterations, security hardening, and test suites');
fs.writeFileSync(path.join(destDir, 'chapterWaveSprints.ts'), renderChapterTs(chWave, 'CHAPTER_WAVE_SPRINTS'), 'utf8');

const chSessions = buildConsolidatedChapter('SESSION-COMPACTION', clusters['SESSION'], 35, 'Chapter 35: Session Transcripts & Knowledge Compaction', 'Memory compaction, developer alignment, and executive summaries');
fs.writeFileSync(path.join(destDir, 'chapterSessionTranscripts.ts'), renderChapterTs(chSessions, 'CHAPTER_SESSION_TRANSCRIPTS'), 'utf8');

console.log('Successfully wrote chapterPhaseHistory.ts, chapterWaveSprints.ts, chapterSessionTranscripts.ts');
