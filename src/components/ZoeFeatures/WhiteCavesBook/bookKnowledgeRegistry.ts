// src/components/ZoeFeatures/WhiteCavesBook/bookKnowledgeRegistry.ts
import { ChapterDefinition, TopicGlossaryItem } from './types';

export const TOPIC_GLOSSARY: Record<string, TopicGlossaryItem> = {
  Frontend: {
    targetSlug: 'chapter-01-architecture',
    category: 'Core Architecture',
    definition:
      'White-Caves-Frontend: React 19 + TypeScript + Vite CRM command center with 12 corporate floor modules.',
  },
  Server: {
    targetSlug: 'chapter-08-multi-repo-rbac',
    category: 'Multi-Repo Decoupling',
    definition:
      'White-Caves-Server: Node.js/Express 5 + Prisma ORM + MongoDB Atlas backend running on port 5001.',
  },
  Mobile: {
    targetSlug: 'chapter-08-multi-repo-rbac',
    category: 'Multi-Repo Decoupling',
    definition:
      'White-Caves-Mobile: React Native / Expo cross-platform mobile companion application.',
  },
  'White-Caves-Web': {
    targetSlug: 'chapter-07-web-decoupling',
    category: 'Multi-Repo Decoupling',
    definition: 'Decoupled public luxury portal running Next.js 16 App Router on Vercel.',
  },
  'TURING-LAW-000': {
    targetSlug: 'chapter-01-architecture',
    category: 'Core Architecture',
    definition:
      'Supreme law enforcing zero-waste AI credit spending, parallel tool batching, and sub-second execution velocity.',
  },
  'TURING-BOOK-011': {
    targetSlug: 'chapter-09-conversations-and-decisions',
    category: 'Living Chronicler',
    definition:
      'Sovereign law requiring every key architectural decision and conversational breakthrough to be preserved in the living book.',
  },
  'TURING-ROOT-007': {
    targetSlug: 'chapter-01-architecture',
    category: 'Core Architecture',
    definition:
      'Strict cleanliness law forbidding rogue root directories and consolidating all documentation under .agents/.',
  },
  'TURING-RULE-TIERS-012': {
    targetSlug: 'chapter-09-conversations-and-decisions',
    category: 'Living Chronicler',
    definition:
      'Hierarchical rule ingestion: Tier 1 Global (~/.gemini) -> Tier 2 Monorepo Umbrella -> Tier 3 Project Nodes.',
  },
  'Perpetual Ouroboros': {
    targetSlug: 'chapter-03-ouroboros',
    category: 'Autonomous Mesh',
    definition:
      'Non-stop autonomous autopilot loop continuously scanning, planning, delegating, verifying, and committing improvements.',
  },
  'Sovereign Mesh': {
    targetSlug: 'chapter-02-mesh',
    category: 'Autonomous Mesh',
    definition:
      'The AEGIS 1-12-108 dual-track multi-agent workforce spanning 108 engineering and 120 business nodes.',
  },
  'Henry OCR': {
    targetSlug: 'chapter-04-henry',
    category: 'Autonomous Mesh',
    definition:
      'Autonomous document parsing agent powered by in-browser Tesseract Web Workers for Title Deeds and Passports.',
  },
  'Mary Property Inventory': {
    targetSlug: 'chapter-05-mary',
    category: 'Domain & Actors',
    definition:
      'Inventory management supervisor enforcing real-time unit status synchronization and UAE statutory escrow tracking.',
  },
  'Domain Actors Matrix': {
    targetSlug: 'chapter-06-actors-matrix',
    category: 'Domain & Actors',
    definition:
      'High-precision operational matrix mapping actors to statutory permissions and department floors.',
  },
  'Progress Intelligence': {
    targetSlug: 'progress-intelligence',
    category: 'Living Chronicler',
    definition:
      'Real-time telemetry, automated velocity calculation, and milestone completion forecasting.',
  },
};

export const BOOK_CHAPTERS: ChapterDefinition[] = [
  {
    id: 'ch-01',
    slug: 'chapter-01-architecture',
    title: 'Chapter 01: The Grand Architecture',
    subtitle: 'V5.0 Sovereign Architectural Principles & Turing Laws',
    category: 'Core Architecture',
    readTime: '6 min read',
    summary:
      'Establishes TURING-LAW-000 zero-waste AI credit rules, TURING-ROOT-007 cleanliness, and 12-way enterprise architecture.',
    topics: ['Frontend', 'TURING-LAW-000', 'TURING-ROOT-007', 'TURING-NAV-TREE-009'],
    sections: [
      {
        id: 's1',
        title: '1. Supreme Law #0: Zero-Waste AI Credits & Sub-Second Speed',
        content:
          'Every AI credit and execution second counts. The Turing Orchestrator enforces parallel tool executions, targeted line reads, and zero-token deterministic operations first.',
        mathFormulas: [
          {
            title: 'Credit Velocity Optimization Law',
            latex:
              'V_{turn} = \\frac{\\sum \\Delta_{\\text{ops}}}{\\Delta t_{turn}} \\quad \\text{subject to} \\quad C_{token} \\le 15{,}000',
            explanation:
              'Velocity per turn maximizes operations completed while strictly bounding LLM token consumption to <= 15,000 tokens.',
          },
        ],
        codeSnippets: [
          {
            language: 'typescript',
            filename: 'turingOrchestrator.ts',
            code: `// TURING-LAW-000: Parallel tool execution
await Promise.all([
  readFileSurgically(targetPath, startLine, endLine),
  evaluateStaticRules(promptContext),
  dispatchWorkerNode('flash_lite')
]);`,
          },
        ],
        keyTakeaways: [
          'Parallel batching reduces LLM turns by 50%–70%.',
          'Surgical 30–80 line range reads eliminate context overcrowding.',
          'Local Node/PowerShell one-liners cost 0 LLM tokens.',
        ],
      },
      {
        id: 's2',
        title: '2. Root Cleanliness & Canonical Control Plane',
        content:
          'Under TURING-ROOT-007, the project root remains completely pristine. All architecture plans, ADRs, documentation, and agent rules are housed strictly inside .agents/.',
        keyTakeaways: [
          'No rogue markdown or planning dumps in workspace root.',
          'Automated sentinel scripts redirect root writes to .agents/ canonically.',
        ],
      },
    ],
  },
  {
    id: 'ch-02',
    slug: 'chapter-02-mesh',
    title: 'Chapter 02: AEGIS Sovereign Mesh',
    subtitle: 'Dual Track 1-12-108 Autonomous Network',
    category: 'Autonomous Mesh',
    readTime: '8 min read',
    summary:
      'Detailed decomposition of 108 Engineering specialist nodes across 12 departments and 120 Business supervisors.',
    topics: ['Sovereign Mesh', 'AEGIS Mesh', '1-12-108 Hierarchy'],
    sections: [
      {
        id: 's1',
        title: '1. The Dual-Track Workforce Topology',
        content:
          'AEGIS divides operational capability into Track 1 (108 Engineering nodes across 12 tech departments) and Track 2 (120 Zoe corporate business assistants across 12 brokerage floors).',
        mathFormulas: [
          {
            title: 'Workforce Capacity Matrix',
            latex:
              'N_{workforce} = N_{exec} + (12_{\\text{depts}} \\times 9_{\\text{nodes}}) + (12_{\\text{brokerage}} \\times 10_{\\text{assistants}}) = 7 + 108 + 120 = 235',
            explanation:
              'The full active autonomous workforce comprises exactly 235 specialized agents.',
          },
        ],
        keyTakeaways: [
          'Track 1 manages architecture, testing, API gateways, SecOps, and UI primitives.',
          'Track 2 handles luxury sales, offplan allocations, Ejari compliance, and conveyancing.',
        ],
      },
    ],
  },
  {
    id: 'ch-03',
    slug: 'chapter-03-ouroboros',
    title: 'Chapter 03: Protocol Perpetual Ouroboros',
    subtitle: 'Autonomous Self-Evolution & Continuous Autopilot',
    category: 'Autonomous Mesh',
    readTime: '7 min read',
    summary:
      'The self-sustaining engineering lifecycle: diagnostics, planning, parallel multi-agent delegation, zero-token execution, and telemetry.',
    topics: ['Perpetual Ouroboros', 'Autopilot Loop'],
    sections: [
      {
        id: 's1',
        title: '1. Autonomous Wave Execution Lifecycle',
        content:
          'The Perpetual Ouroboros autopilot runs end-to-end without requiring human prompting. It diagnoses system health, generates targeted tasks, writes code, verifies via Vitest, and commits progress.',
        keyTakeaways: [
          'Continuous 5% improvements per autonomous wave.',
          'Zero manual prompting needed for standard refactoring and testing waves.',
        ],
      },
    ],
  },
  {
    id: 'ch-08',
    slug: 'chapter-08-multi-repo-rbac',
    title: 'Chapter 08: Multi-Repo Sovereignty & RBAC Portals',
    subtitle: 'Four Independent Repositories with Strict RBAC',
    category: 'Multi-Repo Decoupling',
    readTime: '8 min read',
    summary:
      'Unified security architecture across White-Caves-Web, White-Caves-Frontend, White-Caves-Server, and White-Caves-Mobile.',
    topics: ['Server', 'Mobile', 'Frontend', 'Multi-Repo Architecture'],
    sections: [
      {
        id: 's1',
        title: '1. The Decoupled Repository Topology',
        content:
          'White Caves is decoupled into four sovereign nodes: Frontend (:3000), Server (:5001), Web (Next.js 16), and Mobile (Expo). This ensures isolated builds and high-velocity iteration.',
        codeSnippets: [
          {
            language: 'bash',
            filename: 'services.config',
            code: `# Port allocation matrix
White-Caves-Frontend -> http://localhost:3000
White-Caves-Server   -> http://localhost:5001
White-Caves-Web      -> http://localhost:3001
White-Caves-Mobile   -> exp://localhost:8081`,
          },
        ],
        keyTakeaways: [
          'Server runs independent backend jobs, Prisma, and WebSockets.',
          'Frontend communicates via zero-CORS Vite development proxy.',
        ],
      },
    ],
  },
  {
    id: 'ch-09',
    slug: 'chapter-09-conversations-and-decisions',
    title: 'Chapter 09: Architectural Decisions & ADR Registry',
    subtitle: 'Living Chronicler of Every Milestone & Paradigm Shift',
    category: 'Living Chronicler',
    readTime: '12 min read',
    summary:
      'Captures every conversational decision, ADR, sovereign repo restructuring, and TURING-BOOK-011 continuous learning loop.',
    topics: ['TURING-BOOK-011', 'TURING-RULE-TIERS-012'],
    sections: [
      {
        id: 's1',
        title: 'ADR-008: Tiered Antigravity & AEGIS Autonomous Entry-Point Architecture',
        content:
          'Established a 3-tier instruction hierarchy (Global System -> Monorepo Umbrella -> Project Node). Mistakes corrected in chat are automatically codified into the proper tier so agents get progressively smarter.',
        keyTakeaways: [
          'Tier 1: ~/.gemini/config/rules/antigravity.md (Global).',
          'Tier 2: White-Caves/.agents/antigravity.md (Monorepo umbrella).',
          'Tier 3: <repo>/.agents/antigravity.md (Project specifics).',
        ],
      },
      {
        id: 's2',
        title: 'ADR-009: Code-as-Knowledge React/TypeScript Living Book Architecture',
        content:
          'Migrated The Book of White Caves from legacy raw static HTML/iframe wrappers to modern React component trees, typed data structures, and interactive hooks. Both human engineers and AI agents consume JavaScript/TypeScript natively.',
        keyTakeaways: [
          'Human-readable English + Agent-readable TypeScript data structures.',
          'KaTeX mathematical formula rendering directly in React.',
          'Zero iframe sandboxing overhead.',
        ],
      },
    ],
  },
  {
    id: 'ch-progress',
    slug: 'progress-intelligence',
    title: 'Appendix: Progress Intelligence & Target Mesh',
    subtitle: 'Autonomous Telemetry, Wave Velocity & Metric Graphs',
    category: 'Living Chronicler',
    readTime: '5 min read',
    summary: 'Live velocity telemetry, daily milestone logs, and statutory audit readiness charts.',
    topics: ['Progress Intelligence'],
    sections: [
      {
        id: 's1',
        title: '1. Autonomous Milestone Tracking',
        content:
          'Telemetry engine tracking velocity, burn-down rates, and statutory gate achievements in real time.',
        mathFormulas: [
          {
            title: 'Autonomous Velocity Formulation',
            latex:
              '\\text{Velocity}_{avg} = \\frac{\\sum_{i=1}^n \\text{Points}_i}{\\sum_{i=1}^n t_i} \\times \\left(1 - \\text{DebtRatio}\\right)',
            explanation:
              'Velocity accounts for technical debt penalty, rewarding pristine code that passes all static gates on first iteration.',
          },
        ],
        keyTakeaways: [
          'Automated daily scorecards for all 12 corporate departments.',
          'Zero-blocker threshold enforced for release candidates.',
        ],
      },
    ],
  },
];
