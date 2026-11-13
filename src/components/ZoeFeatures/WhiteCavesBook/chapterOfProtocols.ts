// src/components/ZoeFeatures/WhiteCavesBook/chapterOfProtocols.ts
import { ChapterNode } from './treeTypes';

export const CHAPTER_OF_PROTOCOLS: ChapterNode = {
  level: 5,
  nodeId: 'CH05-PROTOCOLS',
  chapterNumber: 42,
  chapterCode: 'CH-42-PROTOCOLS',
  title: 'Chapter 42: The Sovereign Protocol Canon (AEG-001 to AEG-042)',
  subtitle: 'Unified Mathematical Constitution: Prometheus, Turing, Phoenix, Valkyrie & Apocalypse',
  readTimeMinutes: 25,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-P1',
      subChapterNumber: 1,
      title: 'Sub-Chapter 1: Prometheus Core Unbound (AEG-001 to AEG-009)',
      summary:
        'Frontend layout primitives, Context Triad, Level 5 RBAC, and Right-Sidebar Explorer rules.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-P1.1',
          sectionNumber: 1,
          title: 'Section 1.1: UI Primitives & Context Triad (AEG-001 - AEG-003)',
          summary:
            'Eliminating viewport duplication and anchoring universal theme, language, and currency.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-P1.1.1',
              topicNumber: 1,
              title: 'Topic 1.1.1: Context Triad Mathematical Invariance',
              summary:
                'Every component must derive rendering state from the immutable triad tuple.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-P1.1.1.01',
                  artifactNumber: 1,
                  title: 'Artifact: Context Triad Invariant (AEG-003)',
                  type: 'LAW',
                  filePath: 'src/layouts/UnifiedWorkspaceLayout.tsx',
                  totalLines: 120,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-P1.1.1.01',
                      paragraphNumber: 1,
                      header: 'Paragraph 1: Invariant Formulation of Context Triad',
                      narrative:
                        'Rendering must be a pure deterministic function of Theme, Language, and Currency across all 12 corporate floors.',
                      mathFormulas: [
                        {
                          title: 'Context Triad Function',
                          latex:
                            '\\mathcal{S}_{\\text{view}} = f(\\mathcal{T}_{\\text{theme}}, \\mathcal{L}_{\\text{lang}}, \\mathcal{C}_{\\text{currency}}) \\quad \\text{where} \\; \\mathcal{L} \\in \\{\\text{EN}, \\text{AR}\\}, \\; \\mathcal{C} \\in \\{\\text{AED}, \\text{USD}\\}',
                          explanation:
                            'Language switches automatically trigger bidirectional RTL layouts and currency recalculations without layout thrashing.',
                        },
                      ],
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'S11-P1.1.1.01',
                          sentenceNumber: 1,
                          statement:
                            'No component may instantiate isolated local language or currency state outside Redux.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'L12-P1.1.1.01',
                              lineNumber: 1,
                              text: 'const { theme, language, currency } = useAppSelector(selectContextTriad);',
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
    {
      level: 6,
      nodeId: 'SC06-P2',
      subChapterNumber: 2,
      title: 'Sub-Chapter 2: Turing Silent Velocity (AEG-010 to AEG-017)',
      summary:
        'Zero-waste credit velocity, sub-second single-file tests, zero-runtime Tailwind CSS v4 variables, and 1500ms government API timeout contracts.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-P2.1',
          sectionNumber: 1,
          title: 'Section 2.1: Timeout & Idempotency Safeguards (AEG-011 - AEG-012)',
          summary:
            'Guarding external government handshakes and preventing double-billing on Ejari/DLD APIs.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-P2.1.1',
              topicNumber: 1,
              title: 'Topic 2.1.1: Idempotency Key Generation Algorithm',
              summary:
                'Deterministic payload hash ensuring duplicate sync requests are silently dropped.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-P2.1.1.01',
                  artifactNumber: 1,
                  title: 'Artifact: Idempotent Submission Envelope (AEG-012)',
                  type: 'ALGORITHM',
                  filePath: '.agents/aegis/core-loop/turingOrchestrator.ts',
                  totalLines: 45,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-P2.1.1.01',
                      paragraphNumber: 1,
                      header: 'Paragraph 1: Idempotency Hash Function',
                      narrative:
                        'All submissions to regional tax, DLD, or lease modules embed unique tracking keys.',
                      mathFormulas: [
                        {
                          title: 'Idempotency Key Hash',
                          latex:
                            'K_{\\text{idemp}} = \\text{SHA256}(\\text{ModuleID} \\parallel \\text{Payload} \\parallel \\text{Timestamp}_{\\text{day}})',
                          explanation:
                            'Duplicate sync attempts within the same diurnal window collide deterministically and are safely rejected.',
                        },
                      ],
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'S11-P2.1.1.01',
                          sentenceNumber: 1,
                          statement:
                            'Duplicate network sync loops are dropped instantly before triggering external billing.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'L12-P2.1.1.01',
                              lineNumber: 1,
                              text: 'if (await idempotencyCache.has(key)) return cachedResponse;',
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
    {
      level: 6,
      nodeId: 'SC06-P3',
      subChapterNumber: 3,
      title: 'Sub-Chapter 3: Phoenix Shield Isolation (AEG-018 to AEG-025)',
      summary:
        'Secret abstraction, streaming shells, strict tsc --noEmit gates, Vitest assertions, and stateless DLD parsing.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-P3.1',
          sectionNumber: 1,
          title: 'Section 3.1: Zero-Leak Secret Abstraction (AEG-018)',
          summary: 'Universal exclusion of plaintext credentials from version control.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-P3.1.1',
              topicNumber: 1,
              title: 'Topic 3.1.1: Cryptographic Vault Boundary',
              summary:
                'All API keys, DB connection strings, and certificates live exclusively in secrets/.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-P3.1.1.01',
                  artifactNumber: 1,
                  title: 'Artifact: Pre-Commit Secret Scanner Rule (AEG-016)',
                  type: 'LAW',
                  filePath: '.husky/pre-commit',
                  totalLines: 25,
                  complexity: 'O(n)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-P3.1.1.01',
                      paragraphNumber: 1,
                      header: 'Paragraph 1: Automated Git Hook Interception',
                      narrative:
                        'Husky pre-commit hooks abort commit execution immediately if entropy analysis detects secrets.',
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'S11-P3.1.1.01',
                          sentenceNumber: 1,
                          statement:
                            'Plaintext secret detection triggers immediate abort with nonzero exit code.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'L12-P3.1.1.01',
                              lineNumber: 1,
                              text: 'npx secretlint "**/*" || exit 1',
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
    {
      level: 6,
      nodeId: 'SC06-P4',
      subChapterNumber: 4,
      title: 'Sub-Chapter 4: Valkyrie Ledger Rise (AEG-026 to AEG-033)',
      summary:
        'Static DLD PDF overlays, 90/60/30-day Ejari notifications, 5% UAE FTA VAT + 9% corporate tax reserves, sequential receipts, and Zoho Books synchronization.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-P4.1',
          sectionNumber: 1,
          title: 'Section 4.1: UAE Statutory Tax Buffers (AEG-028 - AEG-030)',
          summary:
            'Mathematical calculation and escrow isolation of 5% VAT and 9% corporate tax reserves.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-P4.1.1',
              topicNumber: 1,
              title: 'Topic 4.1.1: UAE Statutory Reserve Formula',
              summary:
                'Splitting gross commission into net brokerage profit, 5% VAT remittance, and 9% corporate tax reserve.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-P4.1.1.01',
                  artifactNumber: 1,
                  title: 'Artifact: UAE Tax Split Calculation (AEG-028)',
                  type: 'ALGORITHM',
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-P4.1.1.01',
                      paragraphNumber: 1,
                      header: 'Paragraph 1: Tax Reserve Split Equation',
                      narrative:
                        'Every transaction applies statutory UAE FTA VAT and isolates corporate tax buffers before broker payout splits.',
                      mathFormulas: [
                        {
                          title: 'UAE Statutory Tax Allocation',
                          latex:
                            'R_{\\text{VAT}} = 0.05 \\times C_{\\text{gross}}, \\quad R_{\\text{CorpTax}} = 0.09 \\times (C_{\\text{gross}} - E_{\\text{allowable}})',
                          explanation:
                            'Ensures full compliance with UAE Federal Tax Authority mandates and prevents liquidity deficits during audit.',
                        },
                      ],
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'S11-P4.1.1.01',
                          sentenceNumber: 1,
                          statement:
                            'Tax reserve deductions must execute atomically prior to commission ledger distribution.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'L12-P4.1.1.01',
                              lineNumber: 1,
                              text: 'const vatAmount = grossCommission * 0.05;',
                              tokenType: 'KEYWORD',
                            },
                            {
                              level: 12,
                              nodeId: 'L12-P4.1.1.02',
                              lineNumber: 2,
                              text: 'const corpTaxReserve = Math.max(0, (netProfit - 375000) * 0.09);',
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
    {
      level: 6,
      nodeId: 'SC06-P5',
      subChapterNumber: 5,
      title: 'Sub-Chapter 5: Apocalypse Overdrive Matrix (AEG-034 to AEG-042)',
      summary:
        'Web Worker OCR, gated intelligence reports, +500 XP statutory gate rewards, 60%-70% dynamic broker splits, and strict file limits (< 350 lines).',
      sections: [
        {
          level: 7,
          nodeId: 'S07-P5.1',
          sectionNumber: 1,
          title: 'Section 5.1: Merit XP Rewards & Single-Purpose Files (AEG-037, AEG-042)',
          summary:
            'Incentivizing operational compliance and bounding file complexity strictly below 350 lines.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-P5.1.1',
              topicNumber: 1,
              title: 'Topic 5.1.1: Single-Purpose File Limit & XP Hook',
              summary: 'Every file must fulfill a single responsibility with line count <= 350.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-P5.1.1.01',
                  artifactNumber: 1,
                  title: 'Artifact: Architectural Boundary Law (AEG-042)',
                  type: 'LAW',
                  filePath: 'src/config/viewsRegistry.ts',
                  totalLines: 85,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-P5.1.1.01',
                      paragraphNumber: 1,
                      header: 'Paragraph 1: File Line Limit Enforcement',
                      narrative:
                        'Monolithic source files exceeding 350 lines are automatically rejected by static pre-commit ratchets.',
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'S11-P5.1.1.01',
                          sentenceNumber: 1,
                          statement:
                            'No source file in src/ or server/ may exceed 350 lines of code.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'L12-P5.1.1.01',
                              lineNumber: 1,
                              text: 'if (lineCount > 350) throw new Error("File exceeds 350 lines limit");',
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
