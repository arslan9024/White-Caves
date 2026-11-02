/**
 * AEGIS V2 Full Agent & Skill Generator
 * Creates Gwynne-quality agent configs + department SKILL.md files
 * for all 108 engineering nodes across 12 departments.
 */
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const matrixPath = path.join(rootDir, '.agents', 'matrix-108-v2.json');
const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
const skillsRoot = path.join(rootDir, '.agents', 'skills');
const aegisEngRoot = path.join(rootDir, '.agents', 'aegis-engineering');

function slugify(name) {
  return name.replace(/^@/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ── Department Slug Map ──
const deptSlugMap = {
  1: 'dept-01-agent-orchestration',
  2: 'dept-02-ui-ux-view-primitives',
  3: 'dept-03-cross-platform-mobile',
  4: 'dept-04-backend-distributed-systems',
  5: 'dept-05-relational-schemas-data',
  6: 'dept-06-gateway-api-routers',
  7: 'dept-07-secops-cryptographic-gates',
  8: 'dept-08-devops-cicd-sre',
  9: 'dept-09-typography-layout-assets',
  10: 'dept-10-localization-i18n-rtl',
  11: 'dept-11-machine-vision-ocr',
  12: 'dept-12-sqa-e2e-testing'
};

// ── Department Skill Slugs ──
const deptSkillSlug = {
  1: 'aegis-dept-01-agent-orchestration',
  2: 'aegis-dept-02-ui-ux-primitives',
  3: 'aegis-dept-03-mobile-engineering',
  4: 'aegis-dept-04-backend-systems',
  5: 'aegis-dept-05-database-schemas',
  6: 'aegis-dept-06-api-gateway',
  7: 'aegis-dept-07-secops',
  8: 'aegis-dept-08-devops-sre',
  9: 'aegis-dept-09-design-assets',
  10: 'aegis-dept-10-i18n-rtl',
  11: 'aegis-dept-11-vision-ocr',
  12: 'aegis-dept-12-sqa-testing'
};

// ── Department Capabilities ──
const deptCapabilities = {
  1: [
    'orchestration:multi-agent-pipeline-design',
    'orchestration:prompt-boundary-enforcement',
    'orchestration:token-budget-monitoring',
    'orchestration:parallel-agent-sync',
    'orchestration:context-memory-optimization',
    'orchestration:agent-output-verification',
    'orchestration:compilation-flow-control',
    'orchestration:human-escalation-hooks'
  ],
  2: [
    'frontend:atomic-component-architecture',
    'frontend:responsive-viewport-framework',
    'frontend:design-system-token-management',
    'frontend:framer-motion-animation',
    'frontend:css-grid-flexbox-layout',
    'frontend:dark-mode-theming',
    'frontend:aria-accessibility-audit',
    'frontend:performance-render-profiling'
  ],
  3: [
    'mobile:cross-platform-build-config',
    'mobile:ios-native-integration',
    'mobile:android-runtime-optimization',
    'mobile:offline-persistence-cache',
    'mobile:sensor-protocol-binding',
    'mobile:battery-consumption-profiling',
    'mobile:gpu-rendering-optimization',
    'mobile:thread-isolation-management'
  ],
  4: [
    'backend:express-route-architecture',
    'backend:node-performance-profiling',
    'backend:abstraction-principle-enforcement',
    'backend:compilation-path-optimization',
    'backend:pricing-calculation-engine',
    'backend:async-queue-management',
    'backend:microservice-networking',
    'backend:memory-leak-detection'
  ],
  5: [
    'database:prisma-schema-design',
    'database:query-performance-tuning',
    'database:index-optimization',
    'database:privacy-model-enforcement',
    'database:nosql-document-stores',
    'database:spatial-entity-mapping',
    'database:concurrency-control',
    'database:migration-management'
  ],
  6: [
    'api:gateway-routing-design',
    'api:rpc-contract-specification',
    'api:payload-scaling-analysis',
    'api:cdn-edge-routing',
    'api:container-orchestration',
    'api:webhook-lifecycle-management',
    'api:cross-service-alignment',
    'api:websocket-stream-processing'
  ],
  7: [
    'security:defense-protocol-architecture',
    'security:rbac-token-engineering',
    'security:xss-sanitization-guard',
    'security:credential-vault-management',
    'security:dependency-vulnerability-scan',
    'security:cryptographic-auth-proofs',
    'security:intrusion-detection-systems',
    'security:process-boundary-defense'
  ],
  8: [
    'devops:ci-cd-pipeline-engineering',
    'devops:cloud-edge-deployment',
    'devops:docker-containerization',
    'devops:environment-state-unification',
    'devops:secret-disclosure-prevention',
    'devops:network-topology-optimization',
    'devops:static-code-style-enforcement',
    'devops:zero-downtime-rollback'
  ],
  9: [
    'design:brand-token-architecture',
    'design:vector-asset-engineering',
    'design:figma-to-css-conversion',
    'design:floating-element-placement',
    'design:high-contrast-palette-design',
    'design:pixel-primitive-engineering',
    'design:responsive-dimension-modeling',
    'design:font-rendering-optimization'
  ],
  10: [
    'i18n:translation-framework-architecture',
    'i18n:rtl-script-reversal',
    'i18n:logical-css-transpilation',
    'i18n:lazy-loaded-dictionary-chunks',
    'i18n:geographic-endpoint-routing',
    'i18n:hardcoded-string-extraction',
    'i18n:data-policy-compliance',
    'i18n:text-expansion-guard'
  ],
  11: [
    'vision:ocr-tesseract-integration',
    'vision:multipart-upload-management',
    'vision:image-compression-pipeline',
    'vision:pdf-table-extraction',
    'vision:object-identification-matrix',
    'vision:byte-mapping-optimization',
    'vision:bounding-box-coordinate-calc',
    'vision:nlp-field-compilation'
  ],
  12: [
    'testing:quality-gate-architecture',
    'testing:unit-assertion-engineering',
    'testing:playwright-e2e-automation',
    'testing:smoke-test-pre-merge-gates',
    'testing:api-contract-validation',
    'testing:visual-regression-detection',
    'testing:async-crash-profiling',
    'testing:fuzz-injection-pipelines'
  ]
};

// ── Department Coding Instructions ──
const deptCodingInstructions = {
  1: {
    techStack: 'Antigravity IDE, VS Code, Node.js, TypeScript',
    keyFiles: ['.agents/aegis.agent.json', '.agents/aegis-engineering/', 'scripts/orchestrator/', 'AGENTS.md'],
    rules: [
      'All agent orchestration configs MUST live under .agents/ directory',
      'Prompt context boundaries must be enforced — never exceed 15,000 tokens per task',
      'Agent output verification must run npx tsc --noEmit --skipLibCheck before any push',
      'Race conditions between parallel agents must be prevented via file-level locking',
      'Human escalation hooks must be triggered for any P0/P1 compilation failure',
      'Token preservation: batch related child slices into single parent prompts',
      'Context memory arrays must be structured for O(1) lookup by file path'
    ],
    procedures: [
      { name: 'Agent Output Verification', cmd: 'npx tsc --noEmit --skipLibCheck' },
      { name: 'Orchestrator Health Check', cmd: 'npm run aegis:health' },
      { name: 'Context Validation', cmd: 'npm run aegis:context:validate' },
      { name: 'Plans Validation', cmd: 'npm run plans:validate' }
    ]
  },
  2: {
    techStack: 'React 18+, TypeScript, Tailwind CSS, Framer Motion, Radix UI',
    keyFiles: ['src/components/', 'src/pages/', 'src/styles/', 'src/hooks/'],
    rules: [
      'All components MUST follow 4-Way Folder Segregation: View (.view.tsx), Logic (.logic.ts), Style (.styles.ts), Data (.data.ts)',
      'Design tokens: primary red #EF4444, dark background #1a1a2e, luxury gold #D4AF37',
      'Dark mode must use CSS variables — never hardcode colors in components',
      'All interactive elements require Framer Motion transitions (duration: 0.2s ease)',
      'ARIA attributes required on every interactive element (buttons, links, modals)',
      'Component files MUST NOT exceed 350 lines — split into sub-components',
      'Tailwind classes only — no inline styles or external CSS files',
      'Every component must be responsive: mobile-first with sm/md/lg/xl breakpoints'
    ],
    procedures: [
      { name: 'Component Render Test', cmd: 'npx vitest run src/components/' },
      { name: 'Accessibility Audit', cmd: 'npx axe-core --tags wcag2a,wcag2aa' },
      { name: 'TypeScript Check', cmd: 'npx tsc --noEmit --skipLibCheck' },
      { name: 'Storybook Build', cmd: 'npm run storybook:build' }
    ]
  },
  3: {
    techStack: 'React Native / PWA, TypeScript, Capacitor, Expo',
    keyFiles: ['src/components/', 'src/hooks/', 'src/utils/registerServiceWorker.ts', 'src/utils/offlineCRDT.ts'],
    rules: [
      'PWA service worker must be registered via registerServiceWorker.ts',
      'Offline-first: all critical data must be cached in IndexedDB via offlineCRDT.ts',
      'Touch targets must be minimum 44x44px for mobile accessibility',
      'Images must use srcset with WebP fallbacks for bandwidth optimization',
      'GPS/camera access must request permissions gracefully with fallback UI',
      'Battery-conscious: reduce background sync intervals on low battery',
      'GPU-accelerated animations only — use transform/opacity, never top/left',
      'Main thread must never be blocked — use Web Workers for heavy computation'
    ],
    procedures: [
      { name: 'PWA Lighthouse Audit', cmd: 'npx lighthouse --preset=desktop --output=json' },
      { name: 'Service Worker Test', cmd: 'npx vitest run src/utils/registerServiceWorker.test.ts' },
      { name: 'Mobile Viewport Test', cmd: 'npx playwright test --project=mobile-chrome' }
    ]
  },
  4: {
    techStack: 'Node.js 20+, Express.js, TypeScript, Prisma, MongoDB',
    keyFiles: ['server/', 'server/routes/', 'server/controllers/', 'server/middleware/', 'server/services/'],
    rules: [
      'All routes must use Express Router with typed request/response handlers',
      'Business logic MUST live in services/ — controllers are thin wrappers only',
      'Every endpoint must have input validation via Zod schemas',
      'Authentication middleware must verify JWT tokens on all protected routes',
      'Error handling: use centralized HttpError class (src/utils/HttpError.ts)',
      'Rate limiting: all public endpoints must have express-rate-limit configured',
      'Response compression: enable gzip for all JSON responses > 1KB',
      'Logging: structured JSON logs via src/utils/logger.ts — no console.log in production'
    ],
    procedures: [
      { name: 'API Integration Tests', cmd: 'npx vitest run server/' },
      { name: 'TypeScript Backend Check', cmd: 'npx tsc --noEmit --project server/tsconfig.json' },
      { name: 'Route Security Scan', cmd: 'npm run security:scan' }
    ]
  },
  5: {
    techStack: 'Prisma ORM, MongoDB, TypeScript, Redis',
    keyFiles: ['prisma/schema.prisma', 'prisma/seed.ts', 'server/services/', 'src/utils/cacheUtils.js'],
    rules: [
      'All schema changes must go through Prisma migrations — never modify DB directly',
      'Query performance: all lookups must use indexed fields — target sub-10ms execution',
      'Aggregation pipelines must be profiled before deployment',
      'Connection pooling: max 10 connections per service instance',
      'Transaction isolation: use Prisma.$transaction() for multi-document writes',
      'Data privacy: PII fields must be encrypted at rest and masked in logs',
      'Cache strategy: use Redis for frequently accessed data with 5-minute TTL',
      'Seed data must be idempotent — re-runnable without duplicating records'
    ],
    procedures: [
      { name: 'Prisma Generate', cmd: 'npx prisma generate' },
      { name: 'Prisma DB Push', cmd: 'npx prisma db push' },
      { name: 'Schema Validation', cmd: 'npx prisma validate' },
      { name: 'Seed Database', cmd: 'npx prisma db seed' }
    ]
  },
  6: {
    techStack: 'Express.js, REST, WebSocket (socket.io), TypeScript, Zod',
    keyFiles: ['server/routes/', 'server/middleware/', 'server/services/', 'src/utils/apiClient.ts'],
    rules: [
      'API versioning: all public endpoints must be under /api/v1/ prefix',
      'Request/response contracts must be defined with Zod schemas',
      'Webhook handlers must validate signatures before processing payloads',
      'CDN: static assets must be served via edge with Cache-Control headers',
      'WebSocket: rooms must be scoped per-tenant — no cross-tenant data leaks',
      'Rate limiting: tier-based — 100/min for standard, 1000/min for premium',
      'CORS: whitelist only known origins — never use wildcard in production',
      'Payload compression: responses > 1KB must use gzip encoding'
    ],
    procedures: [
      { name: 'API Contract Tests', cmd: 'npx vitest run server/routes/' },
      { name: 'WebSocket Load Test', cmd: 'npm run test:ws:load' },
      { name: 'OpenAPI Spec Validation', cmd: 'npx swagger-cli validate openapi.yaml' }
    ]
  },
  7: {
    techStack: 'TypeScript, bcrypt, jsonwebtoken, helmet, csurf, express-rate-limit',
    keyFiles: ['server/middleware/auth.ts', 'src/utils/permissions.ts', 'src/utils/safeRedirect.ts', 'src/utils/piiMasker.ts', 'src/utils/loadSecrets.ts'],
    rules: [
      'All authentication must use JWT with RS256 signing — never HS256 in production',
      'RBAC enforcement: every route must check permissions via src/utils/permissions.ts',
      'XSS prevention: all user inputs must be sanitized before rendering or storage',
      'CSRF: all state-changing endpoints must validate CSRF tokens',
      'Secrets: never commit .env files — use src/utils/loadSecrets.ts for runtime loading',
      'Password hashing: bcrypt with minimum 12 salt rounds',
      'PII masking: all logs must run through src/utils/piiMasker.ts before output',
      'Dependency scanning: npm audit must pass with 0 high/critical vulnerabilities',
      'Safe redirects: all redirect URLs must pass src/utils/safeRedirect.ts validation'
    ],
    procedures: [
      { name: 'Security Audit', cmd: 'npm audit --production' },
      { name: 'Permission Tests', cmd: 'npx vitest run src/utils/permissions.test.ts' },
      { name: 'PII Masker Tests', cmd: 'npx vitest run src/utils/piiMasker.test.ts' },
      { name: 'Safe Redirect Tests', cmd: 'npx vitest run src/utils/safeRedirect.test.ts' }
    ]
  },
  8: {
    techStack: 'Git, GitHub Actions, Docker, Vercel, TypeScript, Husky, lint-staged',
    keyFiles: ['.github/', 'scripts/orchestrator/', '.husky/', 'package.json', 'vercel.json'],
    rules: [
      'All commits must use Conventional Commits format (feat/fix/chore/refactor)',
      'Pre-commit: Husky + lint-staged must run prettier + eslint on staged files',
      'Branch protection: main is protected — all changes via PR only',
      'PR merge: resolve all review threads before merge (use aegis-unblock-pr.js)',
      'Zero dangling branches: delete feature branches after merge',
      'Docker: multi-stage builds — dev dependencies excluded from production image',
      'Rollback: automated revert if post-deploy health check fails within 5 minutes',
      'Secrets: GitHub Secrets for all tokens — never hardcode in CI configs'
    ],
    procedures: [
      { name: 'TypeScript Pre-flight', cmd: 'npx tsc --noEmit --skipLibCheck' },
      { name: 'Full Test Suite', cmd: 'npx vitest run' },
      { name: 'Lint Check', cmd: 'npx eslint --max-warnings 0 .' },
      { name: 'PR Unblock', cmd: 'node scripts/orchestrator/aegis-unblock-pr.js <pr_number>' },
      { name: 'Branch Cleanup', cmd: 'git remote prune origin && git branch --merged main | grep -v main | xargs git branch -d' }
    ]
  },
  9: {
    techStack: 'Figma, CSS Custom Properties, Tailwind CSS, SVG, WebP, WOFF2',
    keyFiles: ['src/styles/', 'src/components/', 'public/assets/', 'tailwind.config.ts'],
    rules: [
      'Brand tokens: White Caves Red #EF4444, Gold #D4AF37, Navy #1a1a2e, Pearl #F8F9FA',
      'All colors must be CSS custom properties — never inline hex values',
      'Icons: SVG only with currentColor for theming support',
      'Images: WebP format with JPEG fallback, max 200KB per image',
      'Fonts: WOFF2 with font-display:swap — no layout shift on load',
      'Typography scale: fluid clamp() values — min 14px, preferred 1rem, max 18px',
      'Dark mode: all components must render correctly in both light and dark themes',
      'Floating elements: position must be calculated relative to viewport center'
    ],
    procedures: [
      { name: 'Image Optimization', cmd: 'npx sharp-cli --webp --quality 80 public/assets/' },
      { name: 'CSS Variable Audit', cmd: 'grep -r "hardcoded hex" src/components/' },
      { name: 'Font Subsetting', cmd: 'npx glyphhanger --whitelist=U+0000-00FF --subset=*.woff2' }
    ]
  },
  10: {
    techStack: 'react-i18next, TypeScript, CSS Logical Properties, dir=rtl',
    keyFiles: ['src/locales/', 'src/i18n/', 'src/components/'],
    rules: [
      'All user-visible strings must use t() translation function — zero hardcoded text',
      'RTL support: use CSS logical properties (margin-inline-start, not margin-left)',
      'Arabic translations must be reviewed for contextual accuracy — not machine-translated blindly',
      'Translation files: one JSON per language per namespace (max 100 keys per file)',
      'Lazy loading: translation chunks must be loaded on-demand per route',
      'dir attribute: must be set dynamically on <html> based on active language',
      'Date/number formatting: use Intl.DateTimeFormat and Intl.NumberFormat',
      'Form validation messages must be translated — not English-only error strings',
      'Text expansion: Arabic/French strings can be 30% longer — test button overflow'
    ],
    procedures: [
      { name: 'Missing Translation Scan', cmd: 'npx i18next-scanner --config i18next-scanner.config.js' },
      { name: 'RTL Layout Test', cmd: 'npx playwright test --project=rtl-chrome' },
      { name: 'Translation Key Audit', cmd: 'npm run i18n:audit' }
    ]
  },
  11: {
    techStack: 'Tesseract.js, Sharp, Multer, TypeScript, PDF-parse, Canvas API',
    keyFiles: ['server/services/', 'server/middleware/', 'src/utils/imageOptimization.ts'],
    rules: [
      'File uploads: max 10MB per file, validate MIME type before processing',
      'Image processing: use Sharp for resize/compress — never load full-res into memory',
      'OCR: Tesseract.js for text extraction from Ejari documents and trade licenses',
      'PDF parsing: extract tables into structured JSON arrays for database ingestion',
      'Memory safety: stream large files — never buffer entire upload in memory',
      'Supported formats: JPEG, PNG, WebP, PDF, TIFF — reject all others',
      'Bounding box coordinates: use normalized 0-1 range for resolution independence',
      'Error handling: corrupted files must return 422 with clear error message'
    ],
    procedures: [
      { name: 'Image Optimization Tests', cmd: 'npx vitest run src/utils/imageOptimization.test.ts' },
      { name: 'Upload Stress Test', cmd: 'npm run test:upload:stress' },
      { name: 'OCR Accuracy Test', cmd: 'npm run test:ocr:accuracy' }
    ]
  },
  12: {
    techStack: 'Vitest, Playwright, TypeScript, Testing Library, MSW (Mock Service Worker)',
    keyFiles: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'e2e/', 'vitest.config.ts', 'playwright.config.ts'],
    rules: [
      'Test coverage: minimum 80% on all business-critical paths',
      'Unit tests: use Vitest + Testing Library for component/util tests',
      'E2E tests: use Playwright for critical user journeys (auth, property search, CRM flows)',
      'API contract tests: validate response shapes against TypeScript interfaces',
      'Mock external APIs: use MSW (Mock Service Worker) — never hit real endpoints in tests',
      'Visual regression: screenshot comparison for critical UI components',
      'Pre-merge gate: all tests must pass before PR merge is allowed',
      'Fuzz testing: run input fuzzing on form fields and search endpoints quarterly',
      'Test data: use deterministic fixtures — never Math.random() in test setup'
    ],
    procedures: [
      { name: 'Full Test Suite', cmd: 'npx vitest run' },
      { name: 'E2E Tests', cmd: 'npx playwright test' },
      { name: 'Coverage Report', cmd: 'npx vitest run --coverage' },
      { name: 'Auth Flow Tests', cmd: 'npx vitest run src/pages/auth/' },
      { name: 'Component Tests', cmd: 'npx vitest run src/components/' }
    ]
  }
};

// ──────────────────────────────────────────────────
// STEP 1: Generate Enhanced Agent JSON Files
// ──────────────────────────────────────────────────
console.log('=== STEP 1: Generating Enhanced Agent Configs ===\n');

for (const dept of matrix.departments) {
  const deptId = dept.id;
  const deptSlug = deptSlugMap[deptId];
  const deptDir = path.join(aegisEngRoot, deptSlug);
  const caps = deptCapabilities[deptId];
  const instructions = deptCodingInstructions[deptId];
  const skillSlug = deptSkillSlug[deptId];

  dept.team.forEach(function(member, index) {
    const nodeNum = index + 1;
    const agentSlug = slugify(member.agent);
    const isDirector = nodeNum === 1;

    const agentJson = {
      $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
      id: 'aegis-v2-d' + deptId + '-n' + nodeNum + '-' + agentSlug,
      name: member.agent.replace('@', ''),
      handle: member.agent,
      title: member.role,
      gender: 'Female',
      protocol: isDirector ? 'AEGIS_DEPARTMENT_DIRECTOR' : 'AEGIS_ENGINEERING_NODE',
      framework: 'White Caves Engineering Matrix V2 (1-12-108 Software Core)',
      hierarchy: {
        level: isDirector ? 2 : 3,
        role: member.role,
        department: dept.name,
        departmentId: deptId,
        departmentSlug: deptSlug,
        nodeNumber: nodeNum,
        reportingTo: isDirector
          ? 'AEGIS Level 0 Orchestrator → Arslan Malik (Level 5 Sovereign)'
          : dept.team[0].agent + ' (Department Director)'
      },
      contextVariables: {
        systemRole: member.responsibility,
        approvalAuthority: isDirector ? 'SOVEREIGN_DEPARTMENT_AUTHORITY' : 'NODE_EXECUTION_AUTHORITY',
        techStack: instructions.techStack,
        maxFileLines: 350,
        singlePurposeFileLaw: true,
        typeScriptStrict: true,
        zeroBacklogLaw: true,
        continuousDeduplication: true,
        tokenCeiling: 15000
      },
      capabilities: [caps[index] || caps[0]].concat(
        isDirector ? ['department:team-coordination', 'department:quality-gate-authority'] : []
      ),
      codingInstructions: {
        keyFiles: instructions.keyFiles,
        rules: instructions.rules,
        primaryProcedures: instructions.procedures.map(function(p) {
          return { name: p.name, command: p.cmd };
        })
      },
      attachedSkill: '.agents/skills/' + skillSlug,
      tools: ['read_file', 'edit_file', 'write_file', 'run_command', 'search_web']
    };

    const nodeFile = 'node-' + String(nodeNum).padStart(2, '0') + '-' + agentSlug + '.agent.json';
    fs.writeFileSync(path.join(deptDir, nodeFile), JSON.stringify(agentJson, null, 2), 'utf8');
  });

  // Also write enhanced director.agent.json
  const dirNode = dept.team[0];
  const dirSlug = slugify(dirNode.agent);
  const directorJson = {
    $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
    id: 'aegis-v2-director-d' + deptId + '-' + dirSlug,
    name: dirNode.agent.replace('@', ''),
    handle: dirNode.agent,
    title: 'Director of ' + dept.name,
    gender: 'Female',
    protocol: 'AEGIS_DEPARTMENT_DIRECTOR',
    framework: 'White Caves Engineering Matrix V2 (1-12-108 Software Core)',
    hierarchy: {
      level: 2,
      role: dirNode.role,
      department: dept.name,
      departmentId: deptId,
      departmentSlug: deptSlug,
      nodeNumber: 1,
      reportingTo: 'AEGIS Level 0 Orchestrator → Arslan Malik (Level 5 Sovereign)'
    },
    contextVariables: {
      systemRole: dirNode.responsibility,
      approvalAuthority: 'SOVEREIGN_DEPARTMENT_AUTHORITY',
      techStack: instructions.techStack,
      maxFileLines: 350,
      zeroBacklogLaw: true,
      continuousDeduplication: true,
      tokenCeiling: 15000
    },
    capabilities: caps.concat([
      'department:team-coordination',
      'department:quality-gate-authority',
      'department:pr-review-authority'
    ]),
    codingInstructions: {
      keyFiles: instructions.keyFiles,
      rules: instructions.rules,
      primaryProcedures: instructions.procedures.map(function(p) {
        return { name: p.name, command: p.cmd };
      })
    },
    attachedSkill: '.agents/skills/' + skillSlug,
    subordinateNodes: dept.team.slice(1).map(function(m, i) {
      return {
        node: i + 2,
        agent: m.agent,
        role: m.role,
        file: 'node-' + String(i + 2).padStart(2, '0') + '-' + slugify(m.agent) + '.agent.json'
      };
    }),
    tools: ['read_file', 'edit_file', 'write_file', 'run_command', 'search_web']
  };
  fs.writeFileSync(path.join(deptDir, 'director.agent.json'), JSON.stringify(directorJson, null, 2), 'utf8');

  console.log('Dept ' + deptId + ': Enhanced ' + dept.team.length + ' agent configs + director');
}

// ──────────────────────────────────────────────────
// STEP 2: Generate Department SKILL.md Files
// ──────────────────────────────────────────────────
console.log('\n=== STEP 2: Generating Department SKILL.md Files ===\n');

for (const dept of matrix.departments) {
  const deptId = dept.id;
  const skillSlug = deptSkillSlug[deptId];
  const instructions = deptCodingInstructions[deptId];
  const skillDir = path.join(skillsRoot, skillSlug);
  fs.mkdirSync(skillDir, { recursive: true });

  // Build node roster table
  var rosterRows = dept.team.map(function(m, i) {
    var label = i === 0 ? ' *(Director)*' : '';
    return '| ' + (i + 1) + ' | `' + m.agent + '`' + label + ' | ' + m.role + ' | ' + m.responsibility + ' |';
  }).join('\n');

  // Build rules list
  var rulesList = instructions.rules.map(function(r, i) {
    return (i + 1) + '. ' + r;
  }).join('\n');

  // Build procedures
  var procBlocks = instructions.procedures.map(function(p) {
    return '### ' + p.name + '\n```bash\n' + p.cmd + '\n```';
  }).join('\n\n');

  var skillContent = '---\n'
    + 'name: ' + skillSlug + '\n'
    + 'description: "Coding standards, operational procedures, and engineering rules for AEGIS Department ' + deptId + ': ' + dept.name + '"\n'
    + '---\n\n'
    + '# Department ' + deptId + ': ' + dept.name + '\n\n'
    + '> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  \n'
    + '> **Protocol:** Bhakti 1-12-108  \n'
    + '> **Director:** `' + dept.team[0].agent + '` — ' + dept.team[0].role + '  \n'
    + '> **Tech Stack:** ' + instructions.techStack + '  \n\n'
    + '---\n\n'
    + '## 9-Node Engineering Roster\n\n'
    + '| # | Agent | Role | Responsibility |\n'
    + '| :--- | :--- | :--- | :--- |\n'
    + rosterRows + '\n\n'
    + '---\n\n'
    + '## Key Codebase Files & Directories\n\n'
    + instructions.keyFiles.map(function(f) { return '- `' + f + '`'; }).join('\n') + '\n\n'
    + '---\n\n'
    + '## Mandatory Coding Rules\n\n'
    + rulesList + '\n\n'
    + '---\n\n'
    + '## Standard Operating Procedures\n\n'
    + procBlocks + '\n\n'
    + '---\n\n'
    + '## Aegis V4.1 Governance (All Departments)\n\n'
    + '1. **Single Purpose File Law:** Every source file must have a single responsibility and remain under 350 lines.\n'
    + '2. **Canonical 5-Way File Standard:** View (`.view.tsx`), Logic (`.logic.ts`), Styles (`.styles.ts`), Data (`.data.ts`), Config (`.config.ts`).\n'
    + '3. **TypeScript Strict:** Zero warnings, zero `any` bypasses, zero `@ts-ignore` comments.\n'
    + '4. **Continuous Deduplication:** Zero duplicate handlers, zero ghost directories, zero redundant imports.\n'
    + '5. **Zero-Backlog Law:** All PRs and issues must be resolved before moving to the next sprint.\n'
    + '6. **Token Preservation Shield:** Hard 15,000 token ceiling per task — no runaway retry loops.\n'
    + '7. **Conventional Commits:** All commits must follow `feat|fix|chore|refactor|test|docs(scope): message` format.\n';

  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillContent, 'utf8');
  console.log('Generated: .agents/skills/' + skillSlug + '/SKILL.md');
}

// ──────────────────────────────────────────────────
// STEP 3: Update Department READMEs with Skill Links
// ──────────────────────────────────────────────────
console.log('\n=== STEP 3: Updating Department READMEs ===\n');

for (const dept of matrix.departments) {
  const deptId = dept.id;
  const deptSlug = deptSlugMap[deptId];
  const deptDir = path.join(aegisEngRoot, deptSlug);
  const skillSlug = deptSkillSlug[deptId];
  const instructions = deptCodingInstructions[deptId];

  var nodeRows2 = dept.team.map(function(m, i) {
    var dirLabel = i === 0 ? ' *(Director)*' : '';
    var nodeFile = 'node-' + String(i + 1).padStart(2, '0') + '-' + slugify(m.agent) + '.agent.json';
    return '| ' + (i + 1) + ' | **' + m.agent + '**' + dirLabel + ' | ' + m.role + ' | ' + m.responsibility + ' | [`config`](./' + nodeFile + ') |';
  }).join('\n');

  var rulesList2 = instructions.rules.map(function(r, i) {
    return (i + 1) + '. ' + r;
  }).join('\n');

  var procList = instructions.procedures.map(function(p) {
    return '- **' + p.name + ':** `' + p.cmd + '`';
  }).join('\n');

  var readme = '# Department ' + deptId + ': ' + dept.name + '\n\n'
    + '> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  \n'
    + '> **Protocol:** Bhakti 1-12-108  \n'
    + '> **Director:** `' + dept.team[0].agent + '` — ' + dept.team[0].role + '  \n'
    + '> **Tech Stack:** ' + instructions.techStack + '  \n'
    + '> **Skill Reference:** [`.agents/skills/' + skillSlug + '/SKILL.md`](../../skills/' + skillSlug + '/SKILL.md)  \n\n'
    + '---\n\n'
    + '## 9-Node Engineering Roster\n\n'
    + '| # | Agent | Role | Responsibility | Config |\n'
    + '| :--- | :--- | :--- | :--- | :--- |\n'
    + nodeRows2 + '\n\n'
    + '---\n\n'
    + '## Key Codebase Ownership\n\n'
    + instructions.keyFiles.map(function(f) { return '- `' + f + '`'; }).join('\n') + '\n\n'
    + '---\n\n'
    + '## Mandatory Coding Rules\n\n'
    + rulesList2 + '\n\n'
    + '---\n\n'
    + '## Operational Procedures\n\n'
    + procList + '\n\n'
    + '---\n\n'
    + '## Governance\n\n'
    + '- Single Purpose File Law (< 350 lines)\n'
    + '- TypeScript Strict (zero warnings)\n'
    + '- Zero Backlog Law\n'
    + '- Continuous Deduplication\n'
    + '- Conventional Commits\n';

  fs.writeFileSync(path.join(deptDir, 'README.md'), readme, 'utf8');
}
console.log('Updated 12 department READMEs with skill links and coding rules');

console.log('\n=== ALL 108 AGENTS + 12 DEPARTMENT SKILLS GENERATED ===');
console.log('Total agent configs: 108 enhanced .agent.json files');
console.log('Total director configs: 12 director.agent.json files');
console.log('Total department skills: 12 SKILL.md files');

