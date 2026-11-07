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
      check: (ctx) => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('read all files in repo') ||
          text.includes('unlimited tokens') ||
          text.includes('ignore token budget') ||
          text.includes('run full e2e suite on every edit')
        ) {
          return { valid: false, message: 'Violation [TURING-LAW-000]: High‑burn token/time operation blocked. Enforce surgical line‑range reads, parallel tool batching, and targeted single‑file test runs.' };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-001',
      name: 'Zero Duplication Law (Sidebar Symmetry)',
      description: 'Scrub all duplicate White Caves Explorer nodes from Left Sidebar; bind singular explorer to Right Sidebar',
      check: (ctx) => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('leftsidebar') &&
          text.includes('explorer') &&
          !text.includes('remove') &&
          !text.includes('scrub')
        ) {
          return { valid: false, message: 'Violation: Attempting to link White Caves Explorer into Left Sidebar. Explorer must strictly reside in Right Sidebar.' };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-002',
      name: 'Single Purpose File Law',
      description: 'Every newly authored or modified source file must strictly stay below 350 lines',
      check: (ctx) => {
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
      check: (ctx) => {
        const text = ctx.promptText.toLowerCase();
        if (text.includes('remove department') || text.includes('trim agents') || text.includes('merge 12 departments')) {
          return { valid: false, message: 'Violation: Attempting to reduce the 12 corporate departments or 108 supervisors below statutory ratio.' };
        }
        return { valid: true };
      },
    },
    {
      id: 'TURING-RULE-004',
      name: 'FTA VAT & Corporate Tax Reserve Enclosure',
      description: 'Ensure 5% VAT and 9% corporate tax reserve buffers are strictly maintained in financial pipelines',
      check: (ctx) => {
        const text = ctx.promptText.toLowerCase();
        if (text.includes('zero vat') || text.includes('bypass vat') || text.includes('omit 5% vat')) {
          return { valid: false, message: 'Violation: Statutory 5% FTA VAT calculation cannot be bypassed or omitted.' };
        }
        return { valid: true };
      },
    },
    {
      id: 'AEG-041',
      name: 'Zero Context Overcrowding & Context Triad Enforcement',
      description: 'Halt any context generation requests attempting to introduce custom transactional variables outside Theme, Language, and Currency.',
      check: (ctx) => {
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
          return { valid: false, message: 'Violation [AEG-003/AEG-041]: Custom transactional React Context nodes are forbidden. Use Redux Toolkit slices.' };
        }
        return { valid: true };
      },
    },
    {
      id: 'AEG-012',
      name: 'Idempotent DLD/Ejari/Tax Submission Guard',
      description: 'Prevent duplicate submissions of critical compliance data.',
      check: (ctx) => ({ valid: true }), // placeholder implementation
    },
    // Additional rules can be added here following the same shape.
  ];
}
