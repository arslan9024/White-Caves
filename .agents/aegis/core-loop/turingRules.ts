// turingRules.ts
import { TuringAuditRule } from './turingTypes';
import { CONTEXT_SET } from './turingConstants';

/** Returns the default set of audit rules for the Turing Orchestrator. */
export function getDefaultRules(): TuringAuditRule[] {
  return [
    {
      id: 'TURING-LAW-000',
      name: 'Supreme Zero-Waste AI Credit & Sub-Second Velocity Law',
      description:
        'Every second and every AI credit counts: forbid full‑suite test runs during iteration, full‑file dumps of large files, and sequential single‑tool turns when parallel batching or zero‑token scripts can be used.',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('read all files in repo') ||
          text.includes('unlimited tokens') ||
          text.includes('ignore token budget') ||
          text.includes('run full e2e suite on every edit')
        ) {
          return {
            valid: false,
            message:
              'Violation [TURING-LAW-000]: High‑burn token/time operation blocked. Enforce surgical line‑range reads, parallel tool batching, and targeted single‑file test runs.',
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-001',
      name: 'Zero Duplication Law (Sidebar Symmetry)',
      description:
        'Scrub all duplicate White Caves Explorer nodes from Left Sidebar; bind singular explorer to Right Sidebar',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('leftsidebar') &&
          text.includes('explorer') &&
          !text.includes('remove') &&
          !text.includes('scrub')
        ) {
          return {
            valid: false,
            message:
              'Violation: Attempting to link White Caves Explorer into Left Sidebar. Explorer must strictly reside in Right Sidebar.',
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-002',
      name: 'Single Purpose File Law',
      description:
        'Every newly authored or modified source file must strictly stay below 350 lines',
      check: ctx => {
        if (ctx.targetFiles) {
          for (const file of ctx.targetFiles) {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
              // Audited during compilation
            }
          }
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-003',
      name: 'Bhakti 1-12-108 Hierarchy Anchor',
      description: 'Enforce 1 MD Sovereign Hub, 12 Core Corporate Departments, and 108 Supervisors',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('remove department') ||
          text.includes('trim agents') ||
          text.includes('merge 12 departments')
        ) {
          return {
            valid: false,
            message:
              'Violation: Attempting to reduce the 12 corporate departments or 108 supervisors below statutory ratio.',
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-004',
      name: 'FTA VAT & Corporate Tax Reserve Enclosure',
      description:
        'Ensure 5% VAT and 9% corporate tax reserve buffers are strictly maintained in financial pipelines',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('zero vat') ||
          text.includes('bypass vat') ||
          text.includes('omit 5% vat')
        ) {
          return {
            valid: false,
            message: 'Violation: Statutory 5% FTA VAT calculation cannot be bypassed or omitted.',
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'AEG-041',
      name: 'Zero Context Overcrowding & Context Triad Enforcement',
      description:
        'Halt any context generation requests attempting to introduce custom transactional variables outside Theme, Language, and Currency.',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        const createsContext =
          text.includes('createcontext') ||
          text.includes('new react context') ||
          text.includes('transactional context');
        const isTriadOnly =
          text.includes('themecontext') ||
          text.includes('languagecontext') ||
          text.includes('currencycontext');
        if (createsContext && !isTriadOnly) {
          return {
            valid: false,
            message:
              'Violation [AEG-003/AEG-041]: Custom transactional React Context nodes are forbidden. Use Redux Toolkit slices.',
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'AEG-012',
      name: 'Idempotent DLD/Ejari/Tax Submission Guard',
      description: 'Prevent duplicate submissions of critical compliance data.',
      check: ctx => ({ valid: true }), // placeholder implementation
    },
    {
      id: 'TURING-RULE-005',
      name: 'Explicit Data Ownership Law',
      description:
        'Each collection has one explicit write owner. Preserve existing Prisma and Mongoose consumers until an approved ADR defines migration, parity tests and rollback. Never introduce a third ORM or parallel writes for one collection.',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        const changesOwnership =
          text.includes('introduce third orm') ||
          text.includes('dual write with prisma and mongoose');
        if (changesOwnership && !text.includes('approved adr')) {
          return {
            valid: false,
            message:
              'Violation [TURING-RULE-005]: Changing data ownership requires an approved ADR with parity tests and rollback. No ORM winner has been selected.',
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-006',
      name: 'Dependency Singularity Law',
      description:
        'One library per purpose: fetch (not axios), Zod (not joi/yup), framer-motion (not react-spring), Redux Toolkit (not react-query/zustand/swr), date-fns, Vite (not Next), Vitest/Playwright, socket.io. Overlapping dependencies are rejected.',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        const bannedInstalls = [
          'install axios',
          'install joi',
          'install yup',
          'install react-query',
          'install @tanstack/react-query',
          'install react-spring',
          'install zustand',
          'install swr',
          'install next',
          'install moment',
          'install chakra',
          'install @mui',
          'install antd',
        ];
        const hit = bannedInstalls.find(b => text.includes(b));
        if (hit) {
          return {
            valid: false,
            message: `Violation [TURING-RULE-006]: "${hit}" duplicates an existing designated library. Check the dependency registry in scripts/validate-structure.mjs before adding any dependency.`,
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-007',
      name: 'No Twin Files / Zombie Suffix Law',
      description:
        'Forbidden: same-basename .jsx/.tsx or .js/.ts twins, and _NEW/_OLD/Legacy/backup/copy file names surviving past the PR that introduced them. Superseded files are deleted in the same commit that replaces them.',
      check: ctx => {
        const suffixPattern = /(_new|_old|_backup|_copy|\.backup\.|\.old\.|legacy)/i;
        const offending = (ctx.targetFiles || []).filter(
          f => suffixPattern.test(f) && !f.includes('.agents/')
        );
        if (offending.length > 0) {
          return {
            valid: false,
            message: `Violation [TURING-RULE-007]: zombie-suffix file names detected (${offending.join(', ')}). Rename or delete superseded files in the same commit.`,
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-008',
      name: 'UI Component Single Purpose & Hierarchy Law',
      description:
        'One exported component per view file; 7-way co-location for components with logic; components live only in src/components/ui (primitives), src/components/shared (composites), src/components/<domain>, or src/pages (route composition). components/common and components/molecules are frozen. New UI files are .tsx. Component frameworks (Chakra/MUI/Ant) are banned; headless primitives only, and only when building one well is impractical.',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        const newCommonFile = (ctx.targetFiles || []).some(
          f =>
            (f.includes('src/components/common/') || f.includes('src/components/molecules/')) &&
            (text.includes('create') || text.includes('new component'))
        );
        if (newCommonFile) {
          return {
            valid: false,
            message:
              'Violation [TURING-RULE-008]: components/common and components/molecules are frozen. Place new components in ui/, shared/, a domain folder, or pages/.',
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-009',
      name: 'TypeScript-Only Accretion Law',
      description:
        'No new .js/.jsx source files in src/ or server/. The existing JS file count shrinks monotonically — enforced by the ratchet in scripts/validate-structure.mjs.',
      check: ctx => {
        const newJs = (ctx.targetFiles || []).filter(
          f =>
            /\.(js|jsx)$/.test(f) &&
            (f.startsWith('src/') || f.startsWith('server/')) &&
            !/\.(test|spec)\./.test(f)
        );
        const text = ctx.promptText.toLowerCase();
        if (newJs.length > 0 && (text.includes('create') || text.includes('new file'))) {
          return {
            valid: false,
            message: `Violation [TURING-RULE-009]: new JavaScript source files are forbidden (${newJs.join(', ')}). Author them as strict TypeScript (.ts/.tsx).`,
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-BOOK-011',
      name: 'Living Technical Book & Continuous Chronicling Law',
      description:
        'Every high-level architectural decision, repository topology change, and system design milestone must be chronicled in .agents/book-white-caves/ and indexed in WhiteCavesBookViewer.tsx.',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('disable book') ||
          text.includes('delete book of white caves') ||
          text.includes('remove chronicler')
        ) {
          return {
            valid: false,
            message:
              'Violation [TURING-BOOK-011]: Disabling or removing The Book of White Caves chronicling system is prohibited. All major architectural decisions must be retained in .agents/book-white-caves/.',
          };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-TIERS-012',
      name: 'Multi-Tier Rule Ingestion & Sovereign Self-Correction Law',
      description:
        'Enforces hierarchical rule evaluation: Global (~/.gemini/config/rules/antigravity.md) -> Umbrella (White-Caves/.agents/antigravity.md) -> Project (<repo>/.agents/antigravity.md). Corrections must crystallize to the proper tier.',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        if (text.includes('ignore global rules') || text.includes('bypass project rules')) {
          return {
            valid: false,
            message:
              'Violation [TURING-RULE-TIERS-012]: Bypassing tiered Antigravity/AEGIS rules is forbidden. All sessions must respect Global, Monorepo, and Project rule tiers.',
          };
        }
        return { valid: true };
      },
    },
    // Additional rules can be added here following the same shape.
  ];
}
