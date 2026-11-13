// src/components/ZoeFeatures/WhiteCavesBook/masterLibraryData.ts
import { LibraryRoot } from './treeTypes';

export const AEGIS_MASTER_LIBRARY: LibraryRoot = {
  libraryName: 'AEGIS Sovereign Knowledge Repository',
  version: '5.0.0',
  totalBooks: 1,
  books: [
    {
      bookId: 'book-01-white-caves',
      bookNumber: 1,
      title: 'The Book of White Caves',
      subtitle: 'Autonomous Sovereign Enterprise Engineering & Living Chronicles',
      description:
        'The complete software engineering encyclopedia, operational rules, and architectural memory of White Caves Real Estate LLC.',
      author: '@Aurora (Chief Systems CTO & Chronicler) & @Zoe (COO)',
      volumes: [
        {
          nodeId: 'vol-01',
          volumeNumber: 1,
          title: 'Volume I: Core Architecture & Statutory Turing Laws',
          description:
            'Foundations of zero-waste engineering, credit preservation, and tree-state navigation.',
          chapters: [
            {
              nodeId: 'ch-01',
              indexNumber: 1,
              chapterCode: 'CH-01',
              slug: 'chapter-01-architecture',
              title: 'Chapter 01: The Grand Architecture',
              subtitle: 'Statutory Zero-Waste AI Credit Laws & Clean Tree Primitives',
              readTimeMinutes: 7,
              sections: [
                {
                  nodeId: '1.1',
                  indexNumber: 1,
                  title: 'Section 1.1: Supreme Turing Law #0 (TURING-LAW-000)',
                  summary:
                    'Every second and every AI credit counts. Parallel tool execution and zero-token deterministic operations.',
                  topics: [
                    {
                      nodeId: '1.1.1',
                      indexNumber: 1,
                      title: 'Topic 1.1.1: Parallel Batching & Velocity Formula',
                      summary:
                        'Executing all file reads, edits, and shell validations concurrently in a single turn.',
                      leaves: [
                        {
                          nodeId: '1.1.1.01',
                          indexNumber: 1,
                          title: 'Leaf 1.1.1.01: Velocity & Credit Cap Formula',
                          type: 'ALGORITHM',
                          complexity: 'O(1)',
                          content:
                            'Defines the mathematical boundary condition for AI turn efficiency and credit ceiling.',
                          mathFormulas: [
                            {
                              title: 'Credit Velocity Optimization Law',
                              latex:
                                'V_{\\text{turn}} = \\frac{\\sum_{i=1}^n \\Delta_{\\text{ops}, i}}{\\Delta t_{\\text{turn}}} \\quad \\text{subject to} \\quad \\mathcal{C}_{\\text{token}} \\le 15{,}000',
                              explanation:
                                'Velocity measures operations per turn duration while strictly bounding LLM token cost to <= 15,000 tokens per task.',
                            },
                          ],
                          keyRules: [
                            'Batch all independent read_file and write_file calls into one turn.',
                            'Never emit repetitive conversational filler text.',
                            'Limit line ranges to surgical 30-80 line slices.',
                          ],
                        },
                        {
                          nodeId: '1.1.1.02',
                          indexNumber: 2,
                          title: 'Leaf 1.1.1.02: turingOrchestrator.ts Public Facade',
                          type: 'COMPONENT',
                          filePath: '.agents/aegis/core-loop/turingOrchestrator.ts',
                          lineCount: 36,
                          complexity: 'O(1)',
                          content:
                            'Singleton orchestrator coordinating all plan evaluation, circuit breakers, and rate limiters.',
                          codeBlocks: [
                            {
                              language: 'typescript',
                              filename: 'turingOrchestrator.ts',
                              code: `import { TuringOrchestratorCore } from './turingCore';\nexport const turingOrchestrator = TuringOrchestratorCore.getInstance();\nexport default turingOrchestrator;`,
                            },
                          ],
                          keyRules: [
                            'Exported as a singleton instance.',
                            'Strict backward-compatibility facade.',
                          ],
                        },
                      ],
                    },
                    {
                      nodeId: '1.1.2',
                      indexNumber: 2,
                      title: 'Topic 1.1.2: Root Cleanliness & Tree State Navigation',
                      summary:
                        'Enforces TURING-ROOT-007 canonical relocation and TURING-NAV-TREE-009 root-to-leaf viewport.',
                      leaves: [
                        {
                          nodeId: '1.1.2.01',
                          indexNumber: 1,
                          title: 'Leaf 1.1.2.01: Sovereign Path Hygiene (TURING-ROOT-007)',
                          type: 'LAW',
                          content:
                            'The repository root MUST remain pristine. Never create loose docs/, plans/, or strategies/ in root.',
                          keyRules: [
                            'Canonical path: .agents/docs/, .agents/plans/, .agents/strategies/.',
                            'Automated sentinel scripts intercept and move rogue root folders.',
                          ],
                        },
                        {
                          nodeId: '1.1.2.02',
                          indexNumber: 2,
                          title:
                            'Leaf 1.1.2.02: Hierarchical Tree Navigation Law (TURING-NAV-TREE-009)',
                          type: 'LAW',
                          content:
                            'All navigation strictly models an IDE file explorer: TopBar (L1) -> Activity Bars (L2) -> Primary Drawer (L3) -> Sub-Items/Leaf Tasks (L4).',
                          keyRules: [
                            'Upon leaf task completion, return to immediate parent without remounting global state.',
                            'Breadcrumbs reflect root-to-leaf lineage dynamically.',
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              nodeId: 'ch-02',
              indexNumber: 2,
              chapterCode: 'CH-02',
              slug: 'chapter-02-mesh',
              title: 'Chapter 02: AEGIS Sovereign Mesh',
              subtitle: 'Dual Track 1-12-108 Multi-Agent Topology',
              readTimeMinutes: 9,
              sections: [
                {
                  nodeId: '2.1',
                  indexNumber: 1,
                  title: 'Section 2.1: The Dual-Track Workforce Architecture',
                  summary:
                    'Separation of engineering specialists (Track 1) and brokerage business assistants (Track 2).',
                  topics: [
                    {
                      nodeId: '2.1.1',
                      indexNumber: 1,
                      title: 'Topic 2.1.1: 235-Agent Roster Mathematics',
                      summary:
                        'Rigorous calculation of executive, engineering, and brokerage agent distribution.',
                      leaves: [
                        {
                          nodeId: '2.1.1.01',
                          indexNumber: 1,
                          title: 'Leaf 2.1.1.01: Autonomous Workforce Equation',
                          type: 'ALGORITHM',
                          complexity: 'O(1)',
                          content:
                            'Formulation proving total agent distribution across all departments.',
                          mathFormulas: [
                            {
                              title: 'Agent Distribution Function',
                              latex:
                                'N_{\\text{total}} = N_{\\text{exec}} + \\sum_{d=1}^{12} N_{\\text{eng}}(d) + \\sum_{b=1}^{12} N_{\\text{biz}}(b) = 7 + (12 \\times 9) + (12 \\times 10) = 235',
                              explanation:
                                '7 Executive Council nodes + 108 Engineering specialists + 120 Zoe corporate business assistants.',
                            },
                          ],
                          keyRules: [
                            '12 Corporate Departments are permanently anchored.',
                            'Each department maintains exactly 9 engineering nodes and 10 business agents.',
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
          nodeId: 'vol-02',
          volumeNumber: 2,
          title: 'Volume II: Decoupled Multi-Repo Infrastructure',
          description:
            'Sovereign separation of Frontend, Server, Mobile, and Web marketing platforms.',
          chapters: [
            {
              nodeId: 'ch-08',
              indexNumber: 8,
              chapterCode: 'CH-08',
              slug: 'chapter-08-multi-repo-rbac',
              title: 'Chapter 08: Multi-Repo & Portals',
              subtitle: 'Four Independent Repositories with Strict RBAC',
              readTimeMinutes: 8,
              sections: [
                {
                  nodeId: '8.1',
                  indexNumber: 1,
                  title: 'Section 8.1: Port & Process Sovereignty',
                  summary:
                    'Decoupled execution environments preventing monorepo bloat and port collisions.',
                  topics: [
                    {
                      nodeId: '8.1.1',
                      indexNumber: 1,
                      title: 'Topic 8.1.1: Network Port Topology Matrix',
                      summary: 'Mapping independent local development ports and proxy routes.',
                      leaves: [
                        {
                          nodeId: '8.1.1.01',
                          indexNumber: 1,
                          title: 'Leaf 8.1.1.01: Multi-Service Port Map',
                          type: 'DATA_CONTRACT',
                          content:
                            'Authoritative port assignments across the four sovereign repositories.',
                          codeBlocks: [
                            {
                              language: 'json',
                              filename: 'services-port-map.json',
                              code: `{\n  "White-Caves-Frontend": 3000,\n  "White-Caves-Server": 5001,\n  "White-Caves-Web": 3001,\n  "White-Caves-Mobile": 8081\n}`,
                            },
                          ],
                          keyRules: [
                            'Server runs standalone Express 5 + Prisma on port 5001.',
                            'Frontend runs Vite on port 3000 with /api proxy.',
                            'Mobile runs Expo Dev Server on port 8081.',
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              nodeId: 'ch-09',
              indexNumber: 9,
              chapterCode: 'CH-09',
              slug: 'chapter-09-conversations-and-decisions',
              title: 'Chapter 09: Architectural Decisions & ADR Registry',
              subtitle: 'Living Chronicler of Every Milestone & Paradigm Shift',
              readTimeMinutes: 12,
              sections: [
                {
                  nodeId: '9.1',
                  indexNumber: 1,
                  title: 'Section 9.1: Multi-Tier Rule Ingestion (TURING-RULE-TIERS-012)',
                  summary:
                    'Three-tier instruction evaluation hierarchy and sovereign self-learning loop.',
                  topics: [
                    {
                      nodeId: '9.1.1',
                      indexNumber: 1,
                      title: 'Topic 9.1.1: ADR-008 & ADR-009 Specifications',
                      summary:
                        'Codifying instruction precedence and Code-as-Knowledge architecture.',
                      leaves: [
                        {
                          nodeId: '9.1.1.01',
                          indexNumber: 1,
                          title: 'Leaf 9.1.1.01: ADR-008 Tiered Precedence Contract',
                          type: 'ADR',
                          content:
                            'Defines how corrections from user in chat crystallize into Global, Monorepo, or Project markdown layers.',
                          keyRules: [
                            'Tier 1 (Global): ~/.gemini/config/rules/antigravity.md',
                            'Tier 2 (Monorepo): White-Caves/.agents/antigravity.md',
                            'Tier 3 (Project): <repo>/.agents/antigravity.md',
                          ],
                        },
                        {
                          nodeId: '9.1.1.02',
                          indexNumber: 2,
                          title: 'Leaf 9.1.1.02: ADR-009 Tree-State Book Navigation',
                          type: 'ADR',
                          content:
                            'Replaces legacy HTML with 7-level tree data structures and numbered leaf node drilldowns.',
                          keyRules: [
                            'Strict 0 to max counting on all collections.',
                            'Deep horizontal and vertical tree traversal.',
                            'Single-purpose leaf views for ultimate clarity.',
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
