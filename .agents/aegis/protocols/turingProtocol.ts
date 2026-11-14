/**
 * White Caves Real Estate LLC — Sovereign Turing Protocol Matrix & Laws
 * Standard: AEGIS V5.0 & Turing Law Suite
 *
 * Migrated from legacy CSV (.agents/aegis/protocols/TURING_SILENT_VELOCITY.csv)
 * to strongly typed TypeScript system under TURING-DUAL-FORMAT-014.
 */

export interface TuringLawDefinition {
  lawId: string;
  name: string;
  category: 'GOVERNANCE' | 'SYSTEM' | 'EXECUTION' | 'COMPLIANCE';
  statement: string;
  enforcementMechanism: string;
}

export interface TuringProtocolRule {
  ruleId: `AEG-${string}`;
  departmentCode: string;
  orchestrationDomain: string;
  ruleDefinition: string;
  executionTrigger: string;
  validationCriteria: string;
  verificationTarget: string;
}

/**
 * Supreme Turing Laws (TURING-LAW-000 through TURING-SHELL-015)
 */
export const SUPREME_TURING_LAWS: Record<string, TuringLawDefinition> = {
  'TURING-LAW-000': {
    lawId: 'TURING-LAW-000',
    name: 'Turing Zero-Waste AI Credit & Sub-Second Velocity',
    category: 'GOVERNANCE',
    statement:
      'Every AI credit and execution second counts. Enforce parallel tool batching, surgical line-range reads, targeted single-file tests, zero-token deterministic scripts, and cost-aware subagent routing.',
    enforcementMechanism:
      'Hard token limits, static linting, parallel batching, surgical line-slice reading.',
  },
  'TURING-ROOT-007': {
    lawId: 'TURING-ROOT-007',
    name: 'Strict Root Cleanliness & Canonical .agents/ Relocation',
    category: 'GOVERNANCE',
    statement:
      'The project root must remain pristine. No docs/, plans/, strategies/, or business_docs/ in root. All documentation and task registries belong strictly under .agents/.',
    enforcementMechanism: 'Sovereign root cleanliness sentinel and path canonicalization scripts.',
  },
  'TURING-PERPETUAL-OUROBOROS': {
    lawId: 'TURING-PERPETUAL-OUROBOROS',
    name: '100% Autonomous Continuous Autopilot Execution',
    category: 'EXECUTION',
    statement:
      'Automated waves run end-to-end without pausing for trivial confirmations, re-triggering subsequent cycles autonomously.',
    enforcementMechanism: 'Turing orchestrator core-loop and scheduler background tasks.',
  },
  'TURING-NAV-TREE-009': {
    lawId: 'TURING-NAV-TREE-009',
    name: 'Hierarchical Tree-State Navigation & Leaf-Task Return',
    category: 'SYSTEM',
    statement:
      'Viewport and workflow navigation strictly models a hierarchical 4-level tree (Top Bar > Activity Bars > Primary Drawer > Leaf Task). Deepest leaves return cleanly without global re-render.',
    enforcementMechanism: 'TreeNavigationContext and breadcrumb lineage tracking.',
  },
  'TURING-SEPARATION-010': {
    lawId: 'TURING-SEPARATION-010',
    name: 'Strict Entity-Action-Structure Separation',
    category: 'SYSTEM',
    statement:
      'Decouple Actors, Actions, and Structure: DMS defines organizational structure, ERMS defines entities/objects, and TMS defines action verbs. ERMS relations update strictly upon TMS completion.',
    enforcementMechanism: 'Domain-driven isolation across DMS, ERMS, and TMS components.',
  },
  'TURING-BOOK-011': {
    lawId: 'TURING-BOOK-011',
    name: 'Living Book Chronicler & Continuous Knowledge Grounding',
    category: 'COMPLIANCE',
    statement:
      'Key architectural decisions, decoupling milestones, and operational kernels are chronicled in .agents/book-white-caves/ and indexed in WhiteCavesBookViewer.tsx.',
    enforcementMechanism:
      'Hyperlink sync scripts, Book of White Caves HTML chapters, and TypeScript chapter index.',
  },
  'TURING-RULE-TIERS-012': {
    lawId: 'TURING-RULE-TIERS-012',
    name: 'Multi-Tier Rule Ingestion & Sovereign Self-Correction Loop',
    category: 'GOVERNANCE',
    statement:
      'Hierarchical rule evaluation: Tier 1 (Global), Tier 2 (Monorepo Umbrella), Tier 3 (Node/Project). User feedback is immediately crystallized into the governing tier.',
    enforcementMechanism: 'Session boot evaluation and rule tier resolution.',
  },
  'TURING-DEV-SERVER-BAN-013': {
    lawId: 'TURING-DEV-SERVER-BAN-013',
    name: 'Strict AI Dev Server Ban',
    category: 'SYSTEM',
    statement:
      'Agents must never run continuous local dev servers (vite, npm run dev, nodemon, expo start). Dev servers are reserved for human terminals. Agents run non-blocking static checks only.',
    enforcementMechanism: 'Tool execution interceptor and script audit.',
  },
  'TURING-DUAL-FORMAT-014': {
    lawId: 'TURING-DUAL-FORMAT-014',
    name: 'Dual Format Optimization (Markdown for Steering vs. TypeScript for Knowledge Bases)',
    category: 'SYSTEM',
    statement:
      'Prompts and behavioral steering live in pure Markdown (.md). Structured architectural registries and protocols live in typed TypeScript (.ts) for compile verification (tsc --noEmit) and surgical slice reads.',
    enforcementMechanism: 'TypeScript compiler checks and strict file format policy.',
  },
  'TURING-SHELL-015': {
    lawId: 'TURING-SHELL-015',
    name: 'PowerShell Zero-Waste Shell Laws',
    category: 'EXECUTION',
    statement:
      'Ban head command (use Select-Object -First N). Ban Get-ChildItem -Recurse discovery dumps. Use git grep -n first. Verify script existence before executing. Hard budget <= 8,000 tokens.',
    enforcementMechanism:
      'Zero-waste PowerShell command formatting guidelines and budget monitoring.',
  },
};

/**
 * Turing Silent Velocity Matrix (AEG-010 to AEG-017)
 */
export const TURING_SILENT_VELOCITY_RULES: TuringProtocolRule[] = [
  {
    ruleId: 'AEG-010',
    departmentCode: 'WC-UXA',
    orchestrationDomain: 'UX Architecture',
    ruleDefinition:
      'Implement dynamic zero-runtime Tailwind CSS v4 variables to scrap client style calculations.',
    executionTrigger: 'Production Build Step',
    validationCriteria:
      'Strips styled-components compilation latency completely out of browser engines.',
    verificationTarget: 'package.json',
  },
  {
    ruleId: 'AEG-011',
    departmentCode: 'WC-API',
    orchestrationDomain: 'API Framework',
    ruleDefinition:
      'Wrap all external government handshake API endpoints within hard 1500ms timeout contracts.',
    executionTrigger: 'Network Request Dispatches',
    validationCriteria: 'Triggers immediate local failure failovers if state connections freeze.',
    verificationTarget: 'src/components/dashboard/LeasingModule/workflow.ts',
  },
  {
    ruleId: 'AEG-012',
    departmentCode: 'WC-API',
    orchestrationDomain: 'API Framework',
    ruleDefinition:
      'Embed unique idempotent tracking keys on all payload submissions to regional tax or lease modules.',
    executionTrigger: 'DLD / Ejari Sync Phase',
    validationCriteria:
      'Drops duplicate submission loops to block double-billing or multiple document uploads.',
    verificationTarget: '.agents/aegis/core-loop/turingOrchestrator.ts',
  },
  {
    ruleId: 'AEG-013',
    departmentCode: 'WC-DBP',
    orchestrationDomain: 'Data Pipelines',
    ruleDefinition:
      'Transition transactional data parameters out of React Context trees into Redux Toolkit domain slices.',
    executionTrigger: 'State Mutation Event',
    validationCriteria:
      'Centralizes shared entities data pipelines to eliminate cross-departmental re-renders.',
    verificationTarget: 'src/store/slices/dealsSlice.ts',
  },
  {
    ruleId: 'AEG-014',
    departmentCode: 'WC-DBP',
    orchestrationDomain: 'Data Pipelines',
    ruleDefinition:
      'Optimize entity schemas by extracting flat database fields into strongly-typed relational models.',
    executionTrigger: 'Prisma Client Generation',
    validationCriteria:
      'Enforces foreign-key safety contracts linking users, properties, leases, and cheques.',
    verificationTarget: 'prisma/schema.prisma',
  },
  {
    ruleId: 'AEG-015',
    departmentCode: 'WC-DBP',
    orchestrationDomain: 'Data Pipelines',
    ruleDefinition:
      'Isolate specific client identity fields securely to safeguard confidential contact parameters.',
    executionTrigger: 'Data Ingestion Pipeline',
    validationCriteria:
      'Validates that raw landlord or tenant contact items are locked against data-leak vectors.',
    verificationTarget: 'prisma/schema.prisma',
  },
  {
    ruleId: 'AEG-016',
    departmentCode: 'WC-SEC',
    orchestrationDomain: 'Security Control',
    ruleDefinition:
      'Establish automated pre-commit scanners to detect plaintext keys before tracking commits.',
    executionTrigger: 'Staging Git Verification',
    validationCriteria: 'Husky pre-commit hooks abort repository commit if secrets are caught.',
    verificationTarget: '.husky/pre-commit',
  },
  {
    ruleId: 'AEG-017',
    departmentCode: 'WC-SEC',
    orchestrationDomain: 'Security Control',
    ruleDefinition:
      'Mask physical house or plot indicators on external visual elements automatically.',
    executionTrigger: 'Public Inventory Listing',
    validationCriteria: 'Preserves project and cluster names while hiding exact unit rows.',
    verificationTarget: 'src/components/dashboard/LeasingModule/logic.ts',
  },
];

/**
 * Look up a Turing protocol rule by ID
 */
export function getTuringRuleById(ruleId: string): TuringProtocolRule | undefined {
  return TURING_SILENT_VELOCITY_RULES.find(r => r.ruleId === ruleId);
}

/**
 * Validate that an operation or payload respects Turing Protocol criteria
 */
export function validateTuringExecutionCriteria(options: {
  maxLineCount?: number;
  isDevServerProcess?: boolean;
  hasIdempotencyKey?: boolean;
  timeoutMs?: number;
}): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  if (options.isDevServerProcess) {
    violations.push(
      'Violation [TURING-DEV-SERVER-BAN-013]: AI agents are prohibited from starting persistent dev servers.'
    );
  }

  if (options.maxLineCount !== undefined && options.maxLineCount > 350) {
    violations.push(
      `Violation [TURING-LAW-000 / Single-Purpose]: File length of ${options.maxLineCount} exceeds the maximum 350-line ceiling.`
    );
  }

  if (options.timeoutMs !== undefined && options.timeoutMs > 1500) {
    violations.push(
      'Violation [AEG-011]: Government/external handshake timeout contract must not exceed 1500ms.'
    );
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}
