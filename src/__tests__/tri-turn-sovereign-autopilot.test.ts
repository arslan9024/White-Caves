// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

type AutopilotModule = typeof import('../../aegis/orchestrator/tri-turn-sovereign-autopilot.js');
let autopilot: AutopilotModule;

beforeAll(async () => {
  const loader = new Function('specifier', 'return import(specifier)') as (
    specifier: string
  ) => Promise<AutopilotModule>;
  const moduleUrl = pathToFileURL(
    path.resolve(process.cwd(), 'aegis/orchestrator/tri-turn-sovereign-autopilot.js')
  ).href;
  autopilot = await loader(moduleUrl);
});

describe('tri-turn sovereign autopilot', () => {
  it('requires the canonical 333x3 turn order and 999 total quota', () => {
    expect(() =>
      autopilot.validateOptions({
        turns: ['docs-governance', 'frontend', 'backend'],
        quota: 333,
        requireExact999: true,
      })
    ).not.toThrow();

    expect(() =>
      autopilot.validateOptions({
        turns: ['frontend', 'docs-governance', 'backend'],
        quota: 333,
        requireExact999: true,
      })
    ).toThrow(/Turn order must be docs-governance,frontend,backend/);

    expect(() =>
      autopilot.validateOptions({
        turns: ['docs-governance', 'frontend', 'backend'],
        quota: 200,
        requireExact999: true,
      })
    ).toThrow(/Strict sovereign999 requires quota\*turns === 999/);
  });

  it('maps issue rules to the expected AEGIS owner and backup sub-agents', () => {
    expect(autopilot.resolveSubAgentOwnership('todo-marker')).toEqual({
      ownerSubAgent: 'aegis-ledger',
      backupSubAgent: 'aegis-gate',
    });

    expect(autopilot.resolveSubAgentOwnership('placeholder-test')).toEqual({
      ownerSubAgent: 'aegis-flux',
      backupSubAgent: 'aegis-verdict',
    });

    expect(autopilot.resolveSubAgentOwnership('body-validation-gap')).toEqual({
      ownerSubAgent: 'aegis-shield',
      backupSubAgent: 'aegis-forge',
    });
  });

  it('builds issue packets with skill playbooks and closure criteria', () => {
    const packet = autopilot.createIssueWorkPacket(
      {
        fp: 'frontend|placeholder-test|src/components/Home.tsx|L12',
        lane: 'frontend',
        priority: 'P1',
        priorityScore: 300,
        effectiveOrder: 4,
        rule: 'placeholder-test',
        attempts: 1,
        status: 'queued',
      },
      3
    );

    expect(packet.ownerSubAgent).toBe('aegis-flux');
    expect(packet.backupSubAgent).toBe('aegis-verdict');
    expect(packet.requiredSkillPacks).toContain('frontend-improvement-loop');
    expect(packet.skillProfileFile).toBe('aegis/team/skills/aegis-flux.md');
    expect(packet.resolutionPlaybook).toEqual([
      'open aegis/team/skills/aegis-flux.md',
      'read the issue packet and matched skill playbook',
      'apply the smallest safe fix that satisfies the issue',
      'run the full validation set',
      'post evidence and risk note before closure',
    ]);
    expect(packet.validationCommands).toEqual(autopilot.buildValidationCommands());
    expect(packet.acceptanceCriteria).toEqual([
      'real fix applied',
      'gates passed',
      'evidence comment posted',
    ]);
    expect(packet.maxAttempts).toBe(3);
    expect(packet.status).toBe('queued');
  });

  it('attaches the AEGIS owner, skill profile, and resolution playbook to the issue payload', () => {
    const payload = autopilot.buildIssuePayload(
      {
        fp: 'backend|body-validation-gap|server/routes/example.ts|L20',
        lane: 'backend',
        priority: 'P0',
        priorityScore: 400,
        effectiveOrder: 9,
        rule: 'body-validation-gap',
        file: 'server/routes/example.ts',
        line: 20,
        action: 'Add schema validation at the route boundary.',
      },
      '2026-09-06-C001',
      3,
      9
    );

    expect(payload.labels).toContain('tri-turn-sovereign');
    expect(payload.labels).toContain('lane:backend');
    expect(payload.body).toContain('AEGIS Owner: **aegis-shield**');
    expect(payload.body).toContain('Skill Profile: `aegis/team/skills/aegis-shield.md`');
    expect(payload.body).toContain('### Resolution Playbook');
    expect(payload.body).toContain('1. open aegis/team/skills/aegis-shield.md');
    expect(payload.body).toContain('### Acceptance Criteria');
  });

  it('returns the correct fix commands for backend validation gaps', () => {
    expect(
      autopilot.resolveFixCommands(
        { lane: 'backend', rule: 'body-validation-gap' },
        { fixCommand: '' }
      )
    ).toEqual(['npm run lint:fix', 'npm run orchestrator:error:scan:autofix']);

    expect(
      autopilot.resolveFixCommands(
        { lane: 'docs-governance', rule: 'todo-marker' },
        { fixCommand: '' }
      )
    ).toEqual(['npm run orchestrator:plans:clean:apply']);
  });

  it('classifies broad GitHub feature issues as approval-gated chat handoffs', () => {
    const classification = autopilot.classifyGitHubIssue({
      number: 1932,
      title: 'AI Mesh V2 — Document AI extraction',
      body: '- [ ] Define extraction contract\n- [ ] Add tests\n\nImplement passport, title deed, and contract extraction.',
      labels: [{ name: 'P1-High' }],
      html_url: 'https://github.com/arslan9024/White-Caves/issues/1932',
    });

    expect(classification.issueType).toBe('repository-feature');
    expect(classification.handoffState).toBe('PLAN_READY');
    expect(classification.planRequired).toBe(true);
    expect(classification.requiresApproval).toBe(true);
    expect(classification.priority).toBe('P1');
  });

  it('builds a closure-protected GitHub handoff packet', () => {
    const handoff = autopilot.buildGitHubIssueHandoff({
      number: 1932,
      title: 'Document AI extraction',
      body: '- [ ] Define extraction contract',
      labels: [{ name: 'P1-High' }],
      html_url: 'https://github.com/arslan9024/White-Caves/issues/1932',
    });

    expect(handoff.issueNumber).toBe(1932);
    expect(handoff.handoffState).toBe('PLAN_READY');
    expect(handoff.closurePolicy.parentIssueClosureAllowed).toBe(false);
    expect(handoff.closurePolicy.closeOnlyAfter).toContain('evidence comment posted');
    expect(handoff.acceptanceCriteria).toEqual(['Define extraction contract']);
  });

  it('blocks closure when completion evidence is incomplete', () => {
    const handoff = autopilot.buildGitHubIssueHandoff({
      number: 1932,
      title: 'Document AI extraction',
      body: '- [ ] Define extraction contract',
      labels: [{ name: 'P1-High' }],
    });
    const decision = autopilot.validateCompletionEvidence(handoff, {
      changedFiles: ['src/services/documentExtraction.ts'],
      commandResults: [{ command: 'npm run typecheck', passed: true }],
      acceptanceCriteria: [],
      evidenceComment: '',
      rollbackNote: '',
    });

    expect(decision.ready).toBe(false);
    expect(decision.state).toBe('BLOCKED');
    expect(decision.blockers).toEqual(
      expect.arrayContaining([
        'missing validation evidence: npm run lint, npm run build, npm run plans:validate, npm run aegis:policy:gate, npm run aegis:gates',
        'unchecked acceptance criteria: Define extraction contract',
        'missing evidence comment',
        'missing rollback note',
        'parent issue closure is prohibited by policy',
      ])
    );
  });

  it('requires complete evidence before reporting closure readiness', () => {
    const handoff = {
      ...autopilot.buildGitHubIssueHandoff({
        number: 2001,
        title: 'Small local fix',
        body: '- [ ] Fix the targeted behavior',
        labels: [{ name: 'P1-High' }],
      }),
      closurePolicy: { parentIssueClosureAllowed: true },
      validationCommands: ['npm run typecheck', 'npm run lint'],
    };
    const evidence = {
      changedFiles: ['src/example.ts'],
      commandResults: [
        { command: 'npm run typecheck', passed: true },
        { command: 'npm run lint', passed: true },
      ],
      acceptanceCriteria: [{ criterion: 'Fix the targeted behavior', satisfied: true }],
      evidenceComment: 'Implemented and validated the targeted behavior.',
      rollbackNote: 'Revert src/example.ts if validation regresses.',
    };

    expect(autopilot.validateCompletionEvidence(handoff, evidence)).toMatchObject({
      ready: true,
      state: 'CLOSURE_READY',
      blockers: [],
    });
    expect(autopilot.buildCompletionArtifact(handoff, evidence).closureReady).toBe(true);
  });

  it('does not authorize GitHub closure for a parent feature issue', () => {
    const handoff = autopilot.buildGitHubIssueHandoff({
      number: 1932,
      title: 'Document AI extraction',
      body: '- [ ] Define extraction contract',
      labels: [{ name: 'P1-High' }],
    });
    const completion = autopilot.buildCompletionArtifact(handoff, {
      changedFiles: ['src/services/documentExtraction.ts'],
      commandResults: handoff.validationCommands.map((command: string) => ({
        command,
        passed: true,
      })),
      acceptanceCriteria: [{ criterion: 'Define extraction contract', satisfied: true }],
      evidenceComment: 'Implemented the complete parent feature.',
      rollbackNote: 'Revert the implementation commit.',
    });

    expect(completion.closureReady).toBe(false);
    expect(autopilot.canCloseGitHubIssue(handoff, completion)).toBe(false);
  });

  it('creates an approval-gated bounded child task without permitting parent closure', () => {
    const child = autopilot.buildChildImplementationTask({
      issueNumber: 1932,
      issueUrl: 'https://github.com/arslan9024/White-Caves/issues/1932',
      title: '[WAVE-56-FINANCE-EXPENSE] Expense Claims workflow',
    });

    expect(child.taskId).toBe('ISSUE-1932-CHILD-001');
    expect(child.handoffState).toBe('WAITING_FOR_APPROVAL');
    expect(child.requiresApproval).toBe(true);
    expect(child.parentIssueNumber).toBe(1932);
    expect(child.closurePolicy.parentIssueClosureAllowed).toBe(false);
    expect(child.scope.excluded).toContain('receipt upload/storage');
  });

  it('blocks local coding when no provider is configured', () => {
    const config = autopilot.resolveExecutorConfig({ provider: 'none' });
    const status = autopilot.validateExecutorStatus(config);

    expect(config.enabled).toBe(false);
    expect(status.available).toBe(false);
    expect(status.reason).toBe('LOCAL_EXECUTOR_UNAVAILABLE');
  });

  it('rejects unsafe executor commands and out-of-scope files', () => {
    expect(autopilot.validateCommandSafety('git push --force origin main').safe).toBe(false);
    expect(autopilot.validateCommandSafety('npm run typecheck').safe).toBe(true);
    expect(
      autopilot.validateExecutionScope(['src/example.ts'], ['src/example.ts', 'server/unsafe.ts'])
    ).toEqual({
      allowed: false,
      outOfScope: ['server/unsafe.ts'],
    });
  });

  it('does not invoke a local executor when provider status is unavailable', () => {
    const result = autopilot.runCodingExecutor(
      {
        issueNumber: 2372,
        objective: 'bounded child task',
        candidateFiles: ['src/example.ts'],
        acceptanceCriteria: [],
      },
      autopilot.resolveExecutorConfig({ provider: 'none' })
    );

    expect(result.started).toBe(false);
    expect(result.status).toBe('LOCAL_EXECUTOR_UNAVAILABLE');
  });

  it('rejects a wrapper that reports the underlying Copilot CLI is missing', () => {
    const originalSpawn = process.env.AEGIS_CODING_EXECUTOR_STATUS_COMMAND;
    process.env.AEGIS_CODING_EXECUTOR_STATUS_COMMAND =
      'node -e "console.log(\\\'Cannot find GitHub Copilot CLI\\\')"';
    const config = autopilot.resolveExecutorConfig({ provider: 'copilot-cli', command: 'copilot' });
    const status = autopilot.validateExecutorStatus(config);
    if (originalSpawn === undefined) delete process.env.AEGIS_CODING_EXECUTOR_STATUS_COMMAND;
    else process.env.AEGIS_CODING_EXECUTOR_STATUS_COMMAND = originalSpawn;

    expect(status.available).toBe(false);
    expect(status.reason).toBe('EXECUTOR_BINARY_MISSING');
  });

  it('keeps GitHub API tokens out of the Copilot child environment by policy', () => {
    expect(
      autopilot.buildExecutorPrompt({
        issueNumber: 2375,
        objective: 'bounded child task',
        candidateFiles: ['src/example.ts'],
        acceptanceCriteria: [],
      })
    ).not.toContain('GITHUB_TOKEN');
  });

  it('parses bounded local executor controls', () => {
    const originalArgv = process.argv;
    process.argv = [
      'node',
      'runner',
      '--executor=local',
      '--child-only',
      '--max-issues=1',
      '--executor-timeout-ms=120000',
    ];
    const options = autopilot.parseArgs();
    process.argv = originalArgv;

    expect(options.executor).toBe('local');
    expect(options.childOnly).toBe(true);
    expect(options.maxIssues).toBe(1);
    expect(options.executorTimeoutMs).toBe(120000);
  });

  it('defaults autoChain on and honors the opt-out flag', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'runner', '--autopilot'];
    const defaults = autopilot.parseArgs();
    expect(defaults.autoChain).toBe(true);

    process.argv = ['node', 'runner', '--autopilot', '--no-auto-chain'];
    const optedOut = autopilot.parseArgs();
    process.argv = originalArgv;

    expect(optedOut.autoChain).toBe(false);
  });

  it('parses git workflow flags with safe defaults', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'runner', '--autopilot'];
    const defaults = autopilot.parseArgs();
    expect(defaults.gitWorkflow).toBe(false);
    expect(defaults.gitPush).toBe(false);
    expect(defaults.baseBranch).toBe('main');

    process.argv = ['node', 'runner', '--autopilot', '--git-push', '--base-branch=develop'];
    const enabled = autopilot.parseArgs();
    process.argv = originalArgv;

    expect(enabled.gitWorkflow).toBe(true);
    expect(enabled.gitPush).toBe(true);
    expect(enabled.baseBranch).toBe('develop');
  });

  it('parses the auto-merge flag and cascades git workflow + push', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'runner', '--autopilot'];
    const defaults = autopilot.parseArgs();
    expect(defaults.autoMerge).toBe(false);

    process.argv = ['node', 'runner', '--autopilot', '--auto-merge'];
    const enabled = autopilot.parseArgs();
    process.argv = originalArgv;

    expect(enabled.autoMerge).toBe(true);
    expect(enabled.gitWorkflow).toBe(true);
    expect(enabled.gitPush).toBe(true);
  });

  it('parses the unlimited self-healing flag with safe defaults', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'runner', '--autopilot'];
    const defaults = autopilot.parseArgs();
    expect(defaults.unlimited).toBe(false);
    expect(defaults.maxConsecutiveBlocked).toBe(5);
    expect(defaults.blockedBackoffMs).toBe(60000);

    process.argv = [
      'node',
      'runner',
      '--autopilot',
      '--unlimited',
      '--max-consecutive-blocked=8',
      '--blocked-backoff-ms=30000',
    ];
    const enabled = autopilot.parseArgs();
    process.argv = originalArgv;

    expect(enabled.unlimited).toBe(true);
    expect(enabled.loop).toBe(true);
    expect(enabled.autoChain).toBe(true);
    expect(enabled.maxConsecutiveBlocked).toBe(8);
    expect(enabled.blockedBackoffMs).toBe(30000);
  });

  it('decomposes an expense parent into bounded child tasks', () => {
    const children = autopilot.decomposeBroadIssue({
      number: 1932,
      title: 'Finance Engine — Expense Claims: Category, Receipt Upload, Approval Workflow',
      body: 'Expense receipt approval workflow',
      html_url: 'https://github.com/arslan9024/White-Caves/issues/1932',
    });

    expect(children).toHaveLength(3);
    expect(
      children.every(
        (child: { closurePolicy: { parentIssueClosureAllowed: boolean } }) =>
          child.closurePolicy.parentIssueClosureAllowed === false
      )
    ).toBe(true);
    expect(children[0].objective).toContain('typed expense-claim');
  });

  it('decomposes a generic broad parent into child tasks with concrete candidate files', () => {
    const children = autopilot.decomposeBroadIssue({
      number: 2027,
      title:
        '[WAVE-58-AI-MESH-DOCS-AI] AI Mesh V2 — Document AI: Extract Data from Passports, Title Deeds, Contracts',
      body: 'Extract data from passports, title deeds, contracts',
      html_url: 'https://github.com/arslan9024/White-Caves/issues/2027',
    });

    expect(children).toHaveLength(3);
    for (const child of children) {
      expect(child.candidateFiles.length).toBeGreaterThan(0);
      expect(child.candidateFiles[0]).toMatch(/^src\/features\/documents\//);
    }
    expect(
      children.every(
        (child: { closurePolicy: { parentIssueClosureAllowed: boolean } }) =>
          child.closurePolicy.parentIssueClosureAllowed === false
      )
    ).toBe(true);
  });

  it('adds deterministic SRS/SDD traceability and disjoint boundaries to children', () => {
    const children = autopilot.decomposeBroadIssue({
      number: 1943,
      title: '[WAVE-56-FINANCE-REPORT] Finance Engine — P&L, Balance Sheet, Trial Balance Reports',
      body: 'Finance reporting with AED formatting',
      html_url: 'https://github.com/arslan9024/White-Caves/issues/1943',
    });

    expect(children[0].traceability.srsId).toBe('SRS-ISSUE-W56-FINANCE-REPORT-1943');
    expect(children[0].traceability.sddId).toBe('SDD-ISSUE-W56-FINANCE-REPORT-1943');
    expect(children[0].traceability.status).toBe('REQUIRED');
    expect(children.every(child => child.fileBoundaries.owner.startsWith('CHILD-'))).toBe(true);
    expect(children[0].fileBoundaries.tests.length).toBeGreaterThan(0);
  });

  it('marks existing repository files and closed issue matches for reuse', () => {
    const children = autopilot.decomposeBroadIssue(
      {
        number: 1943,
        title: '[WAVE-56-FINANCE-REPORT] Finance Engine — P&L Reports',
        body: 'Finance reporting',
      },
      3,
      {
        repositoryFiles: [
          'src/features/finance/financeEngineReports/financeEngineReports.types.ts',
        ],
        historicalIssues: [
          {
            number: 1888,
            state: 'closed',
            title: 'Finance reports types',
            body: 'financeEngineReports.types.ts',
          },
        ],
      }
    );

    expect(children[0].analysis.decision).toBe('REUSE_EXISTING');
    expect(children[0].analysis.exactMatches).toContain(
      'src/features/finance/financeEngineReports/financeEngineReports.types.ts'
    );
    expect(children[0].analysis.issueMatches[0].number).toBe(1888);
  });

  it('builds a non-interactive Copilot CLI invocation with tool allowances', () => {
    const invocation = autopilot.buildExecutorInvocation(
      'C:\\Tools\\copilot.cmd',
      'copilot-cli',
      'C:\\Temp\\prompt.md'
    );

    expect(invocation).toContain('-p');
    expect(invocation).toContain('--allow-all');
    expect(invocation).toContain('--no-ask-user');
    expect(invocation).toContain('--no-custom-instructions');
    expect(invocation).toContain('prompt.md');
  });

  it('filters orchestrator logs and env files out of closure evidence', () => {
    const filtered = autopilot.filterEvidenceFiles([
      'src/features/documents/example/example.types.ts',
      'logs/orchestrator/coding-executor-result.json',
      'node_modules/pkg/index.js',
      '.env',
    ]);

    expect(filtered).toEqual(['src/features/documents/example/example.types.ts']);
  });

  it('collects only candidate files from the executor staging directory', () => {
    const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'aegis-staging-test-'));
    try {
      const wanted = 'src/features/documents/example/example.types.ts';
      const ignored = 'src/features/documents/example/other.ts';
      fs.mkdirSync(path.join(staging, path.dirname(wanted)), { recursive: true });
      fs.writeFileSync(path.join(staging, wanted), 'export {};\n', 'utf8');
      fs.writeFileSync(path.join(staging, ignored), 'export {};\n', 'utf8');

      const collected = autopilot.collectStagedCandidateFiles(staging, [wanted]);
      expect(collected).toEqual([wanted]);
    } finally {
      fs.rmSync(staging, { recursive: true, force: true });
    }
  });
});
