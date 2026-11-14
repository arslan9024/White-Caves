/**
 * White Caves Real Estate LLC — Mary Allen Wilkes Protocol
 * Standard: AEGIS V5.0 Modular Architecture Standard
 *
 * Named in honor of Mary Allen Wilkes (author of LAP6 for the LINC,
 * pioneer of personal computing systems, modular design, and workspace isolation).
 *
 * Extends the Canonical 7-Category Architecture Law into a strictly typed,
 * resilient, Turing-compliant 12-Layer Co-Location Protocol.
 */

import { validateTuringExecutionCriteria } from './turingProtocol';

export type WilkesCategoryKey =
  | 'view'
  | 'logic'
  | 'styles'
  | 'data'
  | 'types'
  | 'tests'
  | 'workflow'
  | 'fallback'
  | 'telemetry'
  | 'i18n'
  | 'cache'
  | 'workers'
  | 'policy'
  | 'agent';

export interface WilkesLayerSpec {
  category: WilkesCategoryKey;
  extension: string;
  tier: 'CORE_7' | 'RESILIENCE' | 'ENTERPRISE_AI';
  description: string;
  isExecutable: boolean;
  maxLines: number;
}

/**
 * The Canonical Mary Allen Wilkes Specification Matrix
 */
export const MARY_ALLEN_WILKES_SPEC: Record<WilkesCategoryKey, WilkesLayerSpec> = {
  // --- Core 7 Baseline ---
  view: {
    category: 'view',
    extension: '.view.tsx',
    tier: 'CORE_7',
    description:
      'Pure UI presentation, JSX layout, and DOM structure. Zero inline business logic or side effects.',
    isExecutable: true,
    maxLines: 350,
  },
  logic: {
    category: 'logic',
    extension: '.logic.ts',
    tier: 'CORE_7',
    description:
      'Custom React hooks, local state reducers, UI handlers, and presentation algorithms.',
    isExecutable: true,
    maxLines: 350,
  },
  styles: {
    category: 'styles',
    extension: '.styles.ts',
    tier: 'CORE_7',
    description:
      'CSS variables, Tailwind design-token abstractions, and styled-components primitives.',
    isExecutable: false,
    maxLines: 350,
  },
  data: {
    category: 'data',
    extension: '.data.ts',
    tier: 'CORE_7',
    description:
      'Static registries, lookup tables, constant dictionaries, and baseline entity seed records.',
    isExecutable: false,
    maxLines: 350,
  },
  types: {
    category: 'types',
    extension: '.types.ts',
    tier: 'CORE_7',
    description:
      'Compile-time TypeScript interfaces, union types, DTO contracts, and schema primitives.',
    isExecutable: false,
    maxLines: 350,
  },
  tests: {
    category: 'tests',
    extension: '.test.tsx',
    tier: 'CORE_7',
    description:
      'Vitest unit, integration, and UI snapshot specifications with objective assertions.',
    isExecutable: true,
    maxLines: 350,
  },
  workflow: {
    category: 'workflow',
    extension: '.workflow.ts',
    tier: 'CORE_7',
    description:
      'Deterministic I-P-O-V state transitions, action verbs, and business workflow engines.',
    isExecutable: true,
    maxLines: 350,
  },

  // --- Resilience Extensions ---
  fallback: {
    category: 'fallback',
    extension: '.fallback.tsx',
    tier: 'RESILIENCE',
    description:
      'Dedicated UI error boundaries, skeleton fallbacks, degraded state handlers, and retry gates.',
    isExecutable: true,
    maxLines: 350,
  },
  telemetry: {
    category: 'telemetry',
    extension: '.telemetry.ts',
    tier: 'RESILIENCE',
    description:
      'Non-blocking telemetry emission, XP leaderboard ledger rewards, and statutory audit logging.',
    isExecutable: true,
    maxLines: 350,
  },
  i18n: {
    category: 'i18n',
    extension: '.i18n.ts',
    tier: 'RESILIENCE',
    description:
      'Multi-lingual localized string maps (EN, AR with native dir="rtl", ES, RU) and currency masks.',
    isExecutable: false,
    maxLines: 350,
  },
  cache: {
    category: 'cache',
    extension: '.cache.ts',
    tier: 'RESILIENCE',
    description:
      'Offline storage adapters (localStorage / IndexedDB), cache hydration, and optimistic cache invalidation.',
    isExecutable: true,
    maxLines: 350,
  },
  workers: {
    category: 'workers',
    extension: '.workers.ts',
    tier: 'RESILIENCE',
    description:
      'Off-thread Web Worker computation streams for intensive math, OCR parsing, and heavy regex.',
    isExecutable: true,
    maxLines: 350,
  },

  // --- Enterprise & Autonomous AI Extensions ---
  policy: {
    category: 'policy',
    extension: '.policy.ts',
    tier: 'ENTERPRISE_AI',
    description:
      'Level 5 RBAC, RERA / DLD statutory permissions, tenant screening rules, and contract escrow checks.',
    isExecutable: true,
    maxLines: 350,
  },
  agent: {
    category: 'agent',
    extension: '.agent.ts',
    tier: 'ENTERPRISE_AI',
    description:
      'Subagent copilot tool hooks, prompt embeddings, autonomous form-filling, and Zoe integration.',
    isExecutable: true,
    maxLines: 350,
  },
};

export interface WilkesModuleValidationResult {
  moduleName: string;
  compliant: boolean;
  detectedLayers: WilkesCategoryKey[];
  missingCoreLayers: WilkesCategoryKey[];
  turingCompliance: {
    valid: boolean;
    violations: string[];
  };
  scorePercent: number;
}

/**
 * The Mary Allen Wilkes Protocol Evaluator
 * Validates a component/module directory against both the Wilkes Category Law
 * and the Turing Zero-Waste Protocol.
 */
export function validateMaryAllenWilkesModule(
  moduleName: string,
  existingFiles: string[],
  fileLineCounts?: Record<string, number>
): WilkesModuleValidationResult {
  const detectedLayers: WilkesCategoryKey[] = [];
  const core7: WilkesCategoryKey[] = [
    'view',
    'logic',
    'styles',
    'data',
    'types',
    'tests',
    'workflow',
  ];

  for (const [key, spec] of Object.entries(MARY_ALLEN_WILKES_SPEC) as [
    WilkesCategoryKey,
    WilkesLayerSpec,
  ][]) {
    const hasLayer = existingFiles.some(
      f => f.endsWith(`${spec.extension}`) || f.endsWith(`${spec.extension.replace('.tsx', '.ts')}`)
    );
    if (hasLayer) {
      detectedLayers.push(key);
    }
  }

  const missingCoreLayers = core7.filter(cat => !detectedLayers.includes(cat));

  // Validate Turing Constraints (< 350 lines per file)
  const lineCountViolations: string[] = [];
  if (fileLineCounts) {
    for (const [file, lines] of Object.entries(fileLineCounts)) {
      const turingCheck = validateTuringExecutionCriteria({ maxLineCount: lines });
      if (!turingCheck.valid) {
        lineCountViolations.push(`${file}: ${turingCheck.violations.join(', ')}`);
      }
    }
  }

  const scorePercent = Math.round((detectedLayers.length / 12) * 100);
  const compliant = missingCoreLayers.length === 0 && lineCountViolations.length === 0;

  return {
    moduleName,
    compliant,
    detectedLayers,
    missingCoreLayers,
    turingCompliance: {
      valid: lineCountViolations.length === 0,
      violations: lineCountViolations,
    },
    scorePercent,
  };
}

/**
 * Returns scaffolding templates for any Mary Allen Wilkes layer
 */
export function getWilkesLayerTemplate(
  moduleName: string,
  category: WilkesCategoryKey,
  targetDir: string = 'src/components/crm'
): { filename: string; content: string } {
  const spec = MARY_ALLEN_WILKES_SPEC[category];
  const filename = `${moduleName}${spec.extension}`;

  switch (category) {
    case 'view':
      return {
        filename,
        content: `// FILE: ${targetDir}/${moduleName}/${filename}
import React, { FC } from 'react';
import { use${moduleName}Logic } from './${moduleName}.logic';
import { ${moduleName}Container } from './${moduleName}.styles';
import { ${moduleName}Fallback } from './${moduleName}.fallback';

export interface ${moduleName}ViewProps {
  initialId?: string;
  isReadOnly?: boolean;
}

export const ${moduleName}View: FC<${moduleName}ViewProps> = (props) => {
  const { data, loading, error, handleAction } = use${moduleName}Logic(props);

  if (error) {
    return <${moduleName}Fallback error={error} onRetry={() => handleAction('RETRY')} />;
  }

  return (
    <${moduleName}Container data-testid="${moduleName.toLowerCase()}-view">
      <header className="p-4 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white">${moduleName} Workspace</h1>
        <p className="text-xs text-slate-400">Mary Allen Wilkes & Turing Protocol Compliant</p>
      </header>
      <main className="p-4">
        {loading ? <div className="text-xs text-slate-500 font-mono">Hydrating state...</div> : <div>Loaded {data.length} records.</div>}
      </main>
    </${moduleName}Container>
  );
};

export default ${moduleName}View;
`,
      };

    case 'policy':
      return {
        filename,
        content: `// FILE: ${targetDir}/${moduleName}/${filename}
/**
 * Mary Allen Wilkes Protocol: Security & Statutory Policy Layer
 */
export interface ${moduleName}PolicyGate {
  userRole: string;
  hasReraPermit?: boolean;
  kycVerified?: boolean;
}

export function canAccess${moduleName}(gate: ${moduleName}PolicyGate): boolean {
  if (['FOUNDER', 'EXECUTIVE', 'SUPER_ADMIN'].includes(gate.userRole)) return true;
  return Boolean(gate.kycVerified);
}
`,
      };

    case 'agent':
      return {
        filename,
        content: `// FILE: ${targetDir}/${moduleName}/${filename}
/**
 * Mary Allen Wilkes Protocol: Autonomous Agent & Copilot Tool Layer
 */
export const ${moduleName}AgentTools = {
  name: '${moduleName.toLowerCase()}-tools',
  description: 'Zoe & Ada copilot integration for ${moduleName}',
  inspectState: (state: any) => ({
    count: state?.length || 0,
    timestamp: Date.now(),
  }),
};
`,
      };

    default:
      return {
        filename,
        content: `// FILE: ${targetDir}/${moduleName}/${filename}\n// Standard: Mary Allen Wilkes Protocol (${spec.category})\nexport const ${moduleName}_${spec.category.toUpperCase()} = {};\n`,
      };
  }
}
