// src/components/WhiteCavesBook/chapterAegisPhilosophy.ts
import { ChapterNode } from './treeTypes';

export const CHAPTER_AEGIS_OUROBOROS: ChapterNode = {
  level: 5,
  nodeId: 'CH05-AEGIS-OUROBOROS',
  chapterNumber: 3,
  chapterCode: 'AEGIS-CH-03',
  title: 'Chapter 03: Protocol Perpetual Ouroboros & Self-Evolution',
  subtitle:
    'The 6-Step Autonomous Development Loop: From Diagnostic Scan to Self-Healing Telemetry',
  readTimeMinutes: 22,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-AOU1',
      subChapterNumber: 1,
      title: 'Sub-Chapter 1: The Six-Phase Ouroboros Lifecycle',
      summary:
        'Deep diagnostic scan, planning, delegation, zero-token synthesis, SQA check, and commit telemetry.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AOU1.1',
          sectionNumber: 1,
          title: 'Section 1.1: Ouroboros Loop State Equations',
          summary: 'Mathematical formulation of the autonomous self-healing software cycle.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-AOU1.1.1',
              topicNumber: 1,
              title: 'Topic 1.1.1: Zero-Human Bottleneck Engineering',
              summary:
                'Running end-to-end development without conversational hesitation or manual approval friction.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-AOU1.1.1.01',
                  artifactNumber: 1,
                  title: 'Artifact: Ouroboros Loop State Machine',
                  type: 'LAW',
                  filePath: 'Aegis-Sterling/engines/orchestrator/aegis-engine.js',
                  totalLines: 180,
                  complexity: 'O(N)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-AOU1.1.1.01',
                      paragraphNumber: 1,
                      header: 'Paragraph 1: Continuous Self-Evolution Invariant',
                      narrative:
                        'The perpetual loop must self-trigger upon completion of each wave. A wave is only complete when SQA verification confirms 0 compilation errors and test invariants hold.',
                      mathFormulas: [
                        {
                          title: 'Ouroboros Progression State',
                          latex:
                            '\\mathcal{W}_{k+1} = \\text{Verify}\\Big(\\text{Synthesize}\\big(\\text{Plan}(\\text{Diag}(\\mathcal{W}_k))\\big)\\Big) \\implies \\Delta \\text{Quality} \\ge +5\\%',
                          explanation:
                            'Every wave must achieve at least a 5% net improvement in code quality, feature coverage, or token efficiency.',
                        },
                      ],
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'S11-AOU1.1.1.01',
                          sentenceNumber: 1,
                          statement:
                            'Autopilot must never pause to ask rhetorical questions; it executes all six steps and reports empirical metrics upon completion.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'L12-AOU1.1.1.01',
                              lineNumber: 1,
                              text: 'export const runOuroborosCycle = async () => { await diagnostic(); await plan(); await execute(); await verify(); };',
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
};

export const CHAPTER_AEGIS_TURING_CREDIT: ChapterNode = {
  level: 5,
  nodeId: 'CH05-AEGIS-CREDIT',
  chapterNumber: 4,
  chapterCode: 'AEGIS-CH-04',
  title: 'Chapter 04: The Turing Law of Credit Preservation & Velocity',
  subtitle:
    'The Economics of AI Engineering: Parallel Batching, Deterministic Scripts & Zero Token Waste',
  readTimeMinutes: 20,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-ATC1',
      subChapterNumber: 1,
      title: 'Sub-Chapter 1: The Economics of Sub-Second Velocity',
      summary:
        'Why token waste is an architectural failure, and how Aegis optimizes cost per line of code.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-ATC1.1',
          sectionNumber: 1,
          title: 'Section 1.1: Parallel Batching vs Sequential Thrashing',
          summary:
            'Executing 5 to 10 tool calls in a single turn cuts API roundtrips by up to 70%.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-ATC1.1.1',
              topicNumber: 1,
              title: 'Topic 1.1.1: The 15,000 Token Ceiling',
              summary: 'Hard statutory ceiling on context consumption per discrete subtask.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-ATC1.1.1.01',
                  artifactNumber: 1,
                  title: 'Artifact: Credit Shield Protocol',
                  type: 'LAW',
                  filePath: 'Aegis-Sterling/knowledge/strategies/credit-preservation-law.md',
                  totalLines: 120,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-ATC1.1.1.01',
                      paragraphNumber: 1,
                      header: 'Paragraph 1: Surgical Tool Execution',
                      narrative:
                        'Never read entire lockfiles or multi-thousand line schemas. Use targeted grep line ranges, run deterministic one-liner PowerShell/Node commands, and produce zero conversational filler.',
                      mathFormulas: [
                        {
                          title: 'Credit Efficiency Metric',
                          latex:
                            '\\eta_{\\text{credit}} = \\frac{\\text{Completed Verified Features}}{\\sum_{i} \\text{Tokens}_i \\times \\text{Latency}_i} \\longrightarrow \\max',
                          explanation:
                            'Maximizing the feature-to-token ratio separates sovereign autonomous engineering from naive brute-force prompting.',
                        },
                      ],
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'S11-ATC1.1.1.01',
                          sentenceNumber: 1,
                          statement:
                            'Deterministic code scripts cost 0 LLM tokens and run in milliseconds; prefer them over repetitive manual LLM file edits.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'L12-ATC1.1.1.01',
                              lineNumber: 1,
                              text: 'const efficiencyRatio = verifiedFeatures / totalTokensSpent;',
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
};

export const CHAPTER_AEGIS_SELF_LEARNING: ChapterNode = {
  level: 5,
  nodeId: 'CH05-AEGIS-LEARNING',
  chapterNumber: 5,
  chapterCode: 'AEGIS-CH-05',
  title: 'Chapter 05: The Self-Learning Memory Mesh',
  subtitle:
    'Crystallizing Conversational Corrections into Multi-Tier Statutory Rules & Living Chapters',
  readTimeMinutes: 24,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-ASL1',
      subChapterNumber: 1,
      title: 'Sub-Chapter 1: The Three-Tier Rule Hierarchy',
      summary: 'Tier 1 Global System, Tier 2 Monorepo Umbrella, and Tier 3 Project-Specific Rules.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-ASL1.1',
          sectionNumber: 1,
          title: 'Section 1.1: Recursive Feedback Loop',
          summary: 'How user architectural guidance becomes permanent constitutional law.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-ASL1.1.1',
              topicNumber: 1,
              title: 'Topic 1.1.1: Automatic Crystallization',
              summary:
                'Every time the human architect corrects direction, the insight is written into the book and agent rules.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-ASL1.1.1.01',
                  artifactNumber: 1,
                  title: 'Artifact: Sovereign Feedback Engine',
                  type: 'LAW',
                  filePath: 'Aegis-Sterling/knowledge/bookData.ts',
                  totalLines: 160,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-ASL1.1.1.01',
                      paragraphNumber: 1,
                      header: 'Paragraph 1: Memory Invariance Under Context Compaction',
                      narrative:
                        'Context windows are temporary, but the Living Book and typed TypeScript structures are eternal. By anchoring learnings into typed schemas, future agents wake up with complete memory of past decisions.',
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'S11-ASL1.1.1.01',
                          sentenceNumber: 1,
                          statement:
                            'Knowledge is preserved in TSX and JSON schemas, completely eliminating context loss across Antigravity sessions.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'L12-ASL1.1.1.01',
                              lineNumber: 1,
                              text: 'export const permanentMemory = { law: "TURING-BOOK-011", persisted: true };',
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
};
