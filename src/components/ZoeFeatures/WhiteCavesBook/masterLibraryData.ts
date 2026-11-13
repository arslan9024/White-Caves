// src/components/ZoeFeatures/WhiteCavesBook/masterLibraryData.ts
import { MasterCorpusRoot } from './treeTypes';
import { CHAPTER_OF_PROTOCOLS } from './chapterOfProtocols';
import { CHAPTER_DEPARTMENT_SOPS } from './chapterDepartmentSOPs';
import { CHAPTER_STRATEGIC_PLANS } from './chapterStrategicPlans';
import { CHAPTER_BUSINESS_STRATEGIES } from './chapterBusinessStrategies';
import { CHAPTER_PHASE_HISTORY } from './chapterPhaseHistory';
import { CHAPTER_WAVE_SPRINTS } from './chapterWaveSprints';
import { CHAPTER_SESSION_TRANSCRIPTS } from './chapterSessionTranscripts';

export const AEGIS_12_LEVEL_CORPUS: MasterCorpusRoot = {
  level: 0,
  corpusName: 'AEGIS Sovereign Omniverse',
  version: '5.0.0',
  totalProjects: 1,
  libraries: [
    {
      level: 1,
      libraryId: 'lib-01-enterprise',
      libraryNumber: 1,
      title: 'Enterprise Real Estate Division',
      description: 'Master collection of real estate and prop-tech operational engines.',
      books: [
        {
          level: 2,
          bookId: 'book-01-white-caves',
          bookNumber: 1,
          title: 'The Book of White Caves',
          subtitle: 'Autonomous Sovereign Enterprise Engineering & Living Chronicles',
          description:
            'The monumental software encyclopedia and memory mesh of White Caves Real Estate LLC.',
          author: '@Aurora (Chief Systems CTO) & @Zoe (COO)',
          volumes: [
            {
              level: 3,
              nodeId: 'VL03-001',
              volumeNumber: 1,
              title: 'Volume I: Core Architecture & Statutory Turing Laws',
              description:
                'Foundations of zero-waste engineering, sub-second velocity, and tree navigation.',
              cantos: [
                {
                  level: 4,
                  nodeId: 'CN04-001',
                  cantoNumber: 1,
                  title: 'Canto 1: Sovereign Governance & Optimization Laws',
                  description: 'Statutory constitutional rules governing all agents and subagents.',
                  chapters: [
                    CHAPTER_OF_PROTOCOLS,
                    {
                      level: 5,
                      nodeId: 'CH05-001',
                      chapterNumber: 1,
                      chapterCode: 'CH-01',
                      title: 'Chapter 01: The Grand Architecture',
                      subtitle: 'Statutory Zero-Waste AI Credit Laws & Clean Tree Primitives',
                      readTimeMinutes: 15,
                      subChapters: [
                        {
                          level: 6,
                          nodeId: 'SC06-001',
                          subChapterNumber: 1,
                          title: 'Sub-Chapter 1: The Turing Zero-Waste AI Credit Law',
                          summary:
                            'Statutory directives to eliminate token inflation, sequential roundtrips, and bloated context dumps.',
                          sections: [
                            {
                              level: 7,
                              nodeId: 'S07-001',
                              sectionNumber: 1,
                              title: 'Section 1.1: Foundations of Parallel Execution',
                              summary:
                                'How parallel tool batching and surgical slicing guarantee sub-second iteration.',
                              topics: [
                                {
                                  level: 8,
                                  nodeId: 'T08-001',
                                  topicNumber: 1,
                                  title: 'Topic 1.1.1: Token Budget Invariance',
                                  summary:
                                    'Maintaining strict sub-15,000 token envelopes across complex refactoring cycles.',
                                  artifacts: [
                                    {
                                      level: 9,
                                      nodeId: 'A09-001',
                                      artifactNumber: 1,
                                      title: 'Artifact: Execution Envelope Constraint',
                                      type: 'LAW',
                                      filePath: '.agents/AGENTS.md',
                                      totalLines: 120,
                                      complexity: 'O(1)',
                                      paragraphs: [
                                        {
                                          level: 10,
                                          nodeId: 'P10-001',
                                          paragraphNumber: 1,
                                          header: 'Paragraph 1: Invariant Ceiling Enforcement',
                                          narrative:
                                            'Token consumption is governed by deterministic rules that reject uncompressed context payloads and enforce sub-second batch dispatch.',
                                          sentences: [
                                            {
                                              level: 11,
                                              nodeId: 'S11-001',
                                              sentenceNumber: 1,
                                              statement:
                                                'Every single AI credit and execution second counts toward operational resilience.',
                                              statutoryInvariant: true,
                                              lines: [
                                                {
                                                  level: 12,
                                                  nodeId: 'L12-001',
                                                  lineNumber: 1,
                                                  text: 'const TOKEN_HARD_LIMIT = 15000;',
                                                  tokenType: 'OPERATOR',
                                                },
                                              ],
                                            },
                                            {
                                              level: 11,
                                              nodeId: 'S11-002',
                                              sentenceNumber: 2,
                                              statement:
                                                'Parallel tool batching eliminates 50% to 70% of unnecessary conversational waiting rounds.',
                                              statutoryInvariant: true,
                                              lines: [
                                                {
                                                  level: 12,
                                                  nodeId: 'L12-005',
                                                  lineNumber: 5,
                                                  text: 'await Promise.all([runCommand(), readFile(), editFile()]);',
                                                  tokenType: 'KEYWORD',
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              level: 3,
              nodeId: 'VL03-002',
              volumeNumber: 2,
              title: 'Volume II: Department Operations & Floor SOPs',
              description: 'Standard Operating Procedures across the 12 Brokerage Divisions.',
              cantos: [
                {
                  level: 4,
                  nodeId: 'CN04-002',
                  cantoNumber: 1,
                  title: 'Canto 1: Brokerage Department Floor Playbooks',
                  description: 'SOPs, compliance checkpoints, and automated task specifications.',
                  chapters: [CHAPTER_DEPARTMENT_SOPS],
                },
              ],
            },
            {
              level: 3,
              nodeId: 'VL03-003',
              volumeNumber: 3,
              title: 'Volume III: Strategic Master Plans & Autopilot Roadmaps',
              description: 'Infinite Crucible execution loops, wave roadmaps, and backlog targets.',
              cantos: [
                {
                  level: 4,
                  nodeId: 'CN04-003',
                  cantoNumber: 1,
                  title: 'Canto 1: Autopilot Execution & Backlog Architecture',
                  description: 'Ouroboros loop directives, daily milestones, and ERMS upgrades.',
                  chapters: [CHAPTER_STRATEGIC_PLANS],
                },
              ],
            },
            {
              level: 3,
              nodeId: 'VL03-004',
              volumeNumber: 4,
              title: 'Volume IV: Business Strategy & Legal Invariants',
              description:
                'Dubai Land Department regulations, credit preservation, and security models.',
              cantos: [
                {
                  level: 4,
                  nodeId: 'CN04-004',
                  cantoNumber: 1,
                  title: 'Canto 1: Real Estate Strategy & Constitutional Laws',
                  description:
                    'Enterprise business strategy, engine continuity, and role matrices.',
                  chapters: [CHAPTER_BUSINESS_STRATEGIES],
                },
              ],
            },
            {
              level: 3,
              nodeId: 'VL03-005',
              volumeNumber: 5,
              title: 'Volume V: Autonomous Evolution, Phases & Wave Sprints',
              description:
                'Historical engineering phases, wave sprints, and continuous memory compaction.',
              cantos: [
                {
                  level: 4,
                  nodeId: 'CN04-005',
                  cantoNumber: 1,
                  title: 'Canto 1: Engineering Execution & SQA Wave Chronicles',
                  description: 'Milestones, sprint logs, and compacted memory records.',
                  chapters: [
                    CHAPTER_PHASE_HISTORY,
                    CHAPTER_WAVE_SPRINTS,
                    CHAPTER_SESSION_TRANSCRIPTS,
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
