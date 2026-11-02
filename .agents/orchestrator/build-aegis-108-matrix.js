import fs from 'node:fs';
import path from 'node:path';

// V2 Department slug mapping — pure software engineering, zero business overlap
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
  12: 'dept-12-sqa-e2e-testing',
};

// Skill attachments per department — only genuine engineering skills
const deptSkillAttachments = {
  1: [
    'aegis-infinite-crucible',
    'orchestration-progress-intelligence',
    'strategic-planner',
    'project-optimizer',
    'agy-customizations',
    'antigravity_guide',
  ],
  2: ['whitecaves-ui-library', 'generative_ui'],
  3: ['whitecaves-ui-library'],
  4: ['gemini-api-dev', 'gemini-interactions-api'],
  5: ['bigquery_sql', 'data_autocleaning', 'accidental_data_loss_prevention'],
  6: ['gemini-api-dev', 'gemini-interactions-api', 'gemini-live-api-dev'],
  7: ['security-audit', 'credentials'],
  8: ['gwynne-git-lifecycle', 'git-manager', 'release-readiness', 'pr-review-checklist'],
  9: ['whitecaves-ui-library', 'generative_ui'],
  10: ['whitecaves-ui-library'],
  11: ['gemini-api-dev', 'gemini-omni-flash-api'],
  12: ['ts-typecheck-triage', 'release-readiness', 'pr-review-checklist', 'security-audit'],
};

function slugify(name) {
  return name
    .replace(/^@/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function run() {
  const rootDir = process.cwd();
  const rawPath = path.join(rootDir, '.agents', 'matrix-108-v2.json');
  if (!fs.existsSync(rawPath)) {
    console.error('Missing matrix-108-v2.json');
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const departments = rawData.departments;
  console.log('Processing ' + departments.length + ' V2 departments for Aegis Engineering...');

  const aegisEngRoot = path.join(rootDir, '.agents', 'aegis-engineering');

  // Remove ALL old department directories
  if (fs.existsSync(aegisEngRoot)) {
    const existingDirs = fs.readdirSync(aegisEngRoot);
    for (const d of existingDirs) {
      const full = path.join(aegisEngRoot, d);
      if (fs.statSync(full).isDirectory()) {
        fs.rmSync(full, { recursive: true, force: true });
        console.log('Pruned legacy folder: ' + d);
      }
    }
  } else {
    fs.mkdirSync(aegisEngRoot, { recursive: true });
  }

  const allNodesList = [];
  const deptSummaryList = [];

  for (const dept of departments) {
    const deptId = dept.id;
    const deptName = dept.name;
    const deptSlug = deptSlugMap[deptId] || 'dept-' + String(deptId).padStart(2, '0');
    const deptDir = path.join(aegisEngRoot, deptSlug);
    fs.mkdirSync(deptDir, { recursive: true });

    const directorNode = dept.team[0];
    const attachedSkills = deptSkillAttachments[deptId] || [];

    const nodesData = [];

    // Process all 9 nodes
    dept.team.forEach((member, index) => {
      const nodeNum = index + 1;
      const agentHandle = member.agent;
      const agentSlug = slugify(agentHandle);
      const isDirector = nodeNum === 1;

      const nodePayload = {
        name: agentHandle,
        id: 'aegis-eng-v2-d' + deptId + '-n' + nodeNum + '-' + agentSlug,
        nodeNumber: nodeNum,
        isDirector: isDirector,
        departmentId: deptId,
        departmentName: deptName,
        departmentSlug: deptSlug,
        role: member.role,
        responsibility: member.responsibility,
        protocol: 'BHAKTI_1_12_108',
        framework: 'White Caves Engineering Matrix V2 (1-12-108 Software Core)',
        governance: {
          law: 'Aegis V4.1 Strict Engineering Standard',
          maxFileLines: 350,
          zeroBacklogLaw: true,
          typeScriptStrict: true,
          singlePurposeFileLaw: true,
          continuousDeduplication: true,
        },
        attachedSkills: attachedSkills.map(function (s) {
          return '.agents/skills/' + s;
        }),
        tools: ['read_file', 'edit_file', 'write_file', 'run_command', 'search_web'],
      };

      nodesData.push(nodePayload);
      allNodesList.push(nodePayload);

      // Write individual node agent file
      const nodeFileName =
        'node-' + String(nodeNum).padStart(2, '0') + '-' + agentSlug + '.agent.json';
      fs.writeFileSync(
        path.join(deptDir, nodeFileName),
        JSON.stringify(nodePayload, null, 2),
        'utf8'
      );
    });

    // Write director agent file
    const directorSlug = slugify(directorNode.agent);
    const directorPayload = {
      name: directorNode.agent,
      title: 'Director of ' + deptName,
      departmentId: deptId,
      departmentName: deptName,
      departmentSlug: deptSlug,
      nodeNumber: 1,
      isDirector: true,
      protocol: 'BHAKTI_1_12_108',
      framework: 'White Caves Engineering Matrix V2 (1-12-108 Software Core)',
      primaryRole: directorNode.role,
      primaryResponsibility: directorNode.responsibility,
      governance: {
        law: 'Aegis V4.1 Strict Engineering Standard',
        approvalAuthority: 'Full Automated Autopilot & Review Authority',
        maxFileLines: 350,
        zeroBacklogLaw: true,
      },
      attachedSkills: attachedSkills.map(function (s) {
        return '.agents/skills/' + s;
      }),
      subordinateNodes: nodesData.slice(1).map(function (n) {
        return {
          node: n.nodeNumber,
          agent: n.name,
          role: n.role,
          responsibility: n.responsibility,
          file:
            'node-' + String(n.nodeNumber).padStart(2, '0') + '-' + slugify(n.name) + '.agent.json',
        };
      }),
    };

    fs.writeFileSync(
      path.join(deptDir, 'director.agent.json'),
      JSON.stringify(directorPayload, null, 2),
      'utf8'
    );

    // Write dept-manifest.json
    const manifestPayload = {
      departmentId: deptId,
      departmentName: deptName,
      departmentSlug: deptSlug,
      director: directorNode.agent,
      directorRole: directorNode.role,
      nodeCount: nodesData.length,
      protocol: 'BHAKTI_1_12_108',
      attachedSkills: attachedSkills.map(function (s) {
        return '.agents/skills/' + s;
      }),
      team: nodesData,
    };
    fs.writeFileSync(
      path.join(deptDir, 'dept-manifest.json'),
      JSON.stringify(manifestPayload, null, 2),
      'utf8'
    );

    // Generate department README.md
    var nodeRows = nodesData
      .map(function (n) {
        var dirLabel = n.isDirector ? ' *(Director)*' : '';
        var nodeFile =
          'node-' + String(n.nodeNumber).padStart(2, '0') + '-' + slugify(n.name) + '.agent.json';
        return (
          '| Node ' +
          n.nodeNumber +
          ' | **' +
          n.name +
          '**' +
          dirLabel +
          ' | ' +
          n.role +
          ' | ' +
          n.responsibility +
          ' | [`' +
          n.name.replace('@', '') +
          '.json`](./' +
          nodeFile +
          ') |'
        );
      })
      .join('\n');

    var skillLines = attachedSkills
      .map(function (s) {
        return '- [`.agents/skills/' + s + '`](../../skills/' + s + '/SKILL.md)';
      })
      .join('\n');

    var deptReadme =
      '# Department ' +
      deptId +
      ': ' +
      deptName +
      '\n\n' +
      '> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  \n' +
      '> **Protocol:** Bhakti Protocol (1 Core Sovereign | 12 Departments | 108 Engineering Nodes)  \n' +
      '> **Director:** `' +
      directorNode.agent +
      '` — ' +
      directorNode.role +
      '  \n' +
      '> **Total Nodes:** 9 Nodes (1 Director + 8 Engineering Specialists)  \n\n' +
      '---\n\n' +
      '## Department Mission\n\n' +
      directorNode.responsibility +
      '\n\n' +
      '---\n\n' +
      '## 9-Node Engineering Roster\n\n' +
      '| Node | Agent | Engineering Role | Primary Responsibility | Config |\n' +
      '| :--- | :--- | :--- | :--- | :--- |\n' +
      nodeRows +
      '\n\n' +
      '---\n\n' +
      '## Attached Skills\n\n' +
      skillLines +
      '\n\n' +
      '---\n\n' +
      '## Governance\n\n' +
      '1. **Single Purpose File Law:** < 350 lines per file.\n' +
      '2. **TypeScript Strict:** Zero warnings, zero `any` bypasses.\n' +
      '3. **Zero Backlog Law:** All PRs and issues resolved cleanly.\n' +
      '4. **Continuous Deduplication:** Zero duplicate handlers or ghost files.\n';

    fs.writeFileSync(path.join(deptDir, 'README.md'), deptReadme, 'utf8');

    deptSummaryList.push({
      id: deptId,
      name: deptName,
      slug: deptSlug,
      director: directorNode.agent,
      directorRole: directorNode.role,
      nodeCount: nodesData.length,
    });

    console.log(
      'Generated Department ' + deptId + ': ' + deptSlug + ' (' + nodesData.length + ' nodes)'
    );
  }

  // Generate Master README.md
  var deptTableRows = deptSummaryList
    .map(function (d) {
      return (
        '| **' +
        d.id +
        '** | **' +
        d.name +
        '** | `' +
        d.director +
        '` | ' +
        d.directorRole +
        ' | [' +
        d.slug +
        '](./' +
        d.slug +
        '/README.md) |'
      );
    })
    .join('\n');

  var masterReadme =
    '# White Caves Engineering Matrix V2 (1-12-108 Software Core)\n\n' +
    '> **AEGIS Autonomous Software Engineering & Architecture Mesh**  \n' +
    '> **Protocol:** Bhakti Protocol (1 Sovereign AEGIS Orchestrator | 12 Departments | 108 Engineering Nodes)  \n' +
    '> **Environment:** Antigravity IDE & VS Code Local Staging  \n' +
    '> **Version:** V2 — Pure Software Engineering (Zero Business Overlap)  \n\n' +
    '---\n\n' +
    '## Architecture Separation\n\n' +
    '| Domain | Root Folder | Leader | Scope |\n' +
    '| :--- | :--- | :--- | :--- |\n' +
    '| **AEGIS Software Engineering** | `.agents/aegis-engineering/` | AEGIS L0 Orchestrator | Code, architecture, testing, CI/CD, performance |\n' +
    '| **Zoe AI Business Assistants** | `.agents/zoe-business-assistants/` | @Zoe (COO) | Brokerage, tenants, DLD, property operations |\n\n' +
    '---\n\n' +
    '## 12 Engineering Departments (108 Nodes)\n\n' +
    '| ID | Department | Director | Director Role | Directory |\n' +
    '| :---: | :--- | :--- | :--- | :--- |\n' +
    deptTableRows +
    '\n\n' +
    '---\n\n' +
    '## Aegis V4.1 Governance\n\n' +
    '1. **Single Purpose File Law:** All files < 350 lines, single responsibility.\n' +
    '2. **5-Way File Standard:** View (`.view.tsx`), Logic (`.logic.ts`), Styles (`.styles.ts`), Data (`.data.ts`), Config (`.config.ts`).\n' +
    '3. **Continuous Deduplication:** Zero duplicate handlers or ghost directories.\n' +
    '4. **Zero-Backlog Law:** All PRs resolved, immediate merge verification.\n' +
    '5. **Token Preservation Shield:** Hard 15,000 token ceiling per task.\n';

  fs.writeFileSync(path.join(aegisEngRoot, 'README.md'), masterReadme, 'utf8');
  console.log('Generated master README.md');

  // Write subagent-registry-108.json
  var registry108 = {
    framework: 'White Caves Engineering Matrix V2 (1-12-108 Software Core)',
    version: 'v2',
    totalDepartments: 12,
    nodesPerDepartment: 9,
    totalNodes: 108,
    generatedAt: new Date().toISOString(),
    departments: deptSummaryList,
    nodes: allNodesList,
  };
  fs.writeFileSync(
    path.join(rootDir, '.agents', 'subagent-registry-108.json'),
    JSON.stringify(registry108, null, 2),
    'utf8'
  );
  console.log('Generated .agents/subagent-registry-108.json');

  // Update .agents/aegis.agent.json
  var aegisAgentPath = path.join(rootDir, '.agents', 'aegis.agent.json');
  if (fs.existsSync(aegisAgentPath)) {
    var aegisAgent = JSON.parse(fs.readFileSync(aegisAgentPath, 'utf8'));
    if (!aegisAgent.workforceSeparationArchitecture) {
      aegisAgent.workforceSeparationArchitecture = {};
    }
    aegisAgent.workforceSeparationArchitecture.aegisSoftwareEngineering = {
      description:
        'Autonomous Software Engineering, Architecture, Testing, CI/CD, and Codebase Orchestration Mesh — V2 Pure Engineering Matrix',
      rootFolder: '.agents/aegis-engineering',
      protocol: 'BHAKTI_1_12_108',
      framework: 'White Caves Engineering Matrix V2 (1-12-108 Software Core)',
      version: 'v2',
      sovereignLeader: 'AEGIS (Level 0 Orchestrator)',
      departmentsCount: 12,
      nodesPerDepartment: 9,
      totalEngineeringNodes: 108,
      departments: deptSummaryList.map(function (d) {
        return {
          id: d.id,
          name: d.name,
          slug: d.slug,
          director: d.director,
          directorRole: d.directorRole,
          manifest: '.agents/aegis-engineering/' + d.slug + '/dept-manifest.json',
        };
      }),
    };
    aegisAgent.version = '4.1.0';
    aegisAgent.lastUpdated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(aegisAgentPath, JSON.stringify(aegisAgent, null, 2), 'utf8');
    console.log('Updated .agents/aegis.agent.json');
  }

  console.log('\nALL 12 V2 DEPARTMENTS & 108 NODES BUILT SUCCESSFULLY!');
}

run();
