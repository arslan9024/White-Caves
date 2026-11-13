// .agents/orchestrator/generate-book-chapters.cjs
const fs = require('fs');
const path = require('path');

function cleanStr(s) {
  if (!s) return '';
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .trim();
}

function parseFileToChapter(filePath, baseId, chapterNum) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let title = path.basename(filePath, '.md').replace(/[-_]/g, ' ').toUpperCase();

  const rawSections = [];
  let curSec = { title: 'General Overview', lines: [] };

  for (const rawLine of lines) {
    const l = rawLine.trim();
    if (l.startsWith('# ')) {
      title = l.replace(/^#\s+/, '').trim();
    } else if (l.startsWith('## ') || l.startsWith('### ')) {
      if (curSec.lines.length > 0) rawSections.push(curSec);
      curSec = { title: l.replace(/^#+\s+/, '').trim(), lines: [] };
    } else if (l.length > 0) {
      curSec.lines.push(l);
    }
  }
  if (curSec.lines.length > 0) rawSections.push(curSec);

  const subChapters = rawSections.slice(0, 10).map((sec, sIdx) => {
    const scId = `SC06-${baseId}-${sIdx + 1}`;
    let textLines = [];
    let bulletLines = [];

    for (const line of sec.lines) {
      if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
        bulletLines.push(line.replace(/^[-*]|\d+\.\s+/, '').trim());
      } else if (!line.startsWith('```')) {
        textLines.push(line);
      }
    }

    const narrative = textLines.join(' ') || bulletLines.slice(0, 2).join(' ') || sec.title;
    const allSentences = [];

    textLines.join(' ').split(/(?<=[.?!])\s+/).filter(Boolean).slice(0, 6).forEach((st, idx) => {
      allSentences.push({
        statement: cleanStr(st),
        isInvariant: false,
        tokenType: 'LITERAL'
      });
    });

    bulletLines.slice(0, 6).forEach((b, idx) => {
      allSentences.push({
        statement: cleanStr(b),
        isInvariant: true,
        tokenType: 'KEYWORD'
      });
    });

    if (allSentences.length === 0) {
      allSentences.push({
        statement: cleanStr(sec.title),
        isInvariant: false,
        tokenType: 'LITERAL'
      });
    }

    return {
      nodeId: scId,
      subChapterNumber: sIdx + 1,
      title: cleanStr(sec.title),
      summary: cleanStr(narrative.slice(0, 160)),
      sectionTitle: cleanStr(`Section: ${sec.title}`),
      topicTitle: cleanStr(`Topic: ${sec.title}`),
      artifactTitle: cleanStr(`Artifact: ${sec.title}`),
      filePath: filePath.replace(/\\/g, '/'),
      totalLines: sec.lines.length,
      narrative: cleanStr(narrative.slice(0, 300)),
      sentences: allSentences
    };
  });

  return {
    nodeId: `CH05-${baseId}`,
    chapterNumber: chapterNum,
    chapterCode: `CH-${chapterNum}-${baseId}`,
    title: cleanStr(title),
    subtitle: cleanStr(`Operational Canon & Architecture for ${title}`),
    readTimeMinutes: Math.max(5, Math.ceil(lines.length / 50)),
    subChapters
  };
}

function renderChapterTs(chapterData, exportName) {
  let out = `// Auto-generated 12-Level Living Book Chapter Node\nimport { ChapterNode } from './treeTypes';\n\n`;
  out += `export const ${exportName}: ChapterNode = {\n`;
  out += `  level: 5,\n`;
  out += `  nodeId: "${chapterData.nodeId}",\n`;
  out += `  chapterNumber: ${chapterData.chapterNumber},\n`;
  out += `  chapterCode: "${chapterData.chapterCode}",\n`;
  out += `  title: "${chapterData.title}",\n`;
  out += `  subtitle: "${chapterData.subtitle}",\n`;
  out += `  readTimeMinutes: ${chapterData.readTimeMinutes},\n`;
  out += `  subChapters: [\n`;

  chapterData.subChapters.forEach(sc => {
    out += `    {\n`;
    out += `      level: 6,\n`;
    out += `      nodeId: "${sc.nodeId}",\n`;
    out += `      subChapterNumber: ${sc.subChapterNumber},\n`;
    out += `      title: "${sc.title}",\n`;
    out += `      summary: "${sc.summary}",\n`;
    out += `      sections: [\n`;
    out += `        {\n`;
    out += `          level: 7,\n`;
    out += `          nodeId: "S07-${sc.nodeId}",\n`;
    out += `          sectionNumber: 1,\n`;
    out += `          title: "${sc.sectionTitle}",\n`;
    out += `          summary: "${sc.summary.slice(0, 100)}",\n`;
    out += `          topics: [\n`;
    out += `            {\n`;
    out += `              level: 8,\n`;
    out += `              nodeId: "T08-${sc.nodeId}",\n`;
    out += `              topicNumber: 1,\n`;
    out += `              title: "${sc.topicTitle}",\n`;
    out += `              summary: "${sc.summary.slice(0, 80)}",\n`;
    out += `              artifacts: [\n`;
    out += `                {\n`;
    out += `                  level: 9,\n`;
    out += `                  nodeId: "A09-${sc.nodeId}",\n`;
    out += `                  artifactNumber: 1,\n`;
    out += `                  title: "${sc.artifactTitle}",\n`;
    out += `                  type: "LAW",\n`;
    out += `                  filePath: "${sc.filePath}",\n`;
    out += `                  totalLines: ${sc.totalLines},\n`;
    out += `                  complexity: "O(1)",\n`;
    out += `                  paragraphs: [\n`;
    out += `                    {\n`;
    out += `                      level: 10,\n`;
    out += `                      nodeId: "P10-${sc.nodeId}",\n`;
    out += `                      paragraphNumber: 1,\n`;
    out += `                      header: "${sc.title}",\n`;
    out += `                      narrative: "${sc.narrative}",\n`;
    out += `                      sentences: [\n`;

    sc.sentences.forEach((st, stIdx) => {
      out += `                        {\n`;
      out += `                          level: 11,\n`;
      out += `                          nodeId: "ST11-${sc.nodeId}-${stIdx+1}",\n`;
      out += `                          sentenceNumber: ${stIdx+1},\n`;
      out += `                          statement: "${st.statement}",\n`;
      out += `                          statutoryInvariant: ${st.isInvariant},\n`;
      out += `                          lines: [\n`;
      out += `                            {\n`;
      out += `                              level: 12,\n`;
      out += `                              nodeId: "LN12-${sc.nodeId}-${stIdx+1}-1",\n`;
      out += `                              lineNumber: 1,\n`;
      out += `                              text: "${st.statement}",\n`;
      out += `                              tokenType: "${st.tokenType}"\n`;
      out += `                            }\n`;
      out += `                          ]\n`;
      out += `                        },\n`;
    });

    out += `                      ]\n`;
    out += `                    }\n`;
    out += `                  ]\n`;
    out += `                }\n`;
    out += `              ]\n`;
    out += `            }\n`;
    out += `          ]\n`;
    out += `        }\n`;
    out += `      ]\n`;
    out += `    },\n`;
  });

  out += `  ]\n`;
  out += `};\n`;
  return out;
}

module.exports = { parseFileToChapter, renderChapterTs, cleanStr };
