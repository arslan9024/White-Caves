import fs from 'node:fs';
import path from 'node:path';

// Department slug mapping
const deptSlugMap = {
  1: 'dept-01-core-system-architects',
  2: 'dept-02-data-engine-vector-sorters',
  3: 'dept-03-frontend-ui-architecture',
  4: 'dept-04-backend-route-api',
  5: 'dept-05-database-schemas-orm',
  6: 'dept-06-software-qa-code',
  7: 'dept-07-devops-infrastructure',
  8: 'dept-08-lease-rent-expiry-logic',
  9: 'dept-09-ledger-accounting-vat-logic',
  10: 'dept-10-crm-framework-pipeline',
  11: 'dept-11-lead-ingestion-media-pipelines',
  12: 'dept-12-asset-tracking-system-file-ops',
};

const deptSkillAttachments = {
  1: [
    'agy-customizations',
    'antigravity_guide',
    'strategic-planner',
    'project-optimizer',
    'aegis-infinite-crucible',
    'orchestration-progress-intelligence',
  ],
  2: [
    'bigquery_ai_ml',
    'bigquery_sql',
    'bigquery_bigframes',
    'bigquery_graph',
    'data_autocleaning',
    'dataform_bigquery',
    'dbt_bigquery',
    'ml_best_practices',
  ],
  3: ['whitecaves-ui-library', 'generative_ui'],
  4: ['gemini-api-dev', 'gemini-interactions-api', 'gemini-live-api-dev', 'gemini-omni-flash-api'],
  5: ['bigquery_sql', 'data_autocleaning', 'accidental_data_loss_prevention'],
  6: ['security-audit', 'pr-review-checklist', 'ts-typecheck-triage', 'release-readiness'],
  7: ['gwynne-git-lifecycle', 'git-manager', 'release-readiness'],
  8: ['whitecaves-ejari-rules'],
  9: ['whitecaves-ejari-rules', 'bigquery_sql'],
  10: ['whitecaves-ui-library', 'generative_ui'],
  11: ['gemini-api-dev', 'gemini-interactions-api'],
  12: ['project-optimizer', 'accidental_data_loss_prevention'],
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
  const rawPath = path.join(rootDir, '.agents', 'matrix-108-raw.json');
  if (!fs.existsSync(rawPath)) {
    console.error('Missing matrix-108-raw.json');
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const departments = rawData.departments;
  console.log(`Processing ${departments.length} departments for Aegis Engineering...`);

  const aegisEngRoot = path.join(rootDir, '.agents', 'aegis-engineering');

  // Remove old departments that do not match the new slugs
  if (fs.existsSync(aegisEngRoot)) {
    const existingDirs = fs.readdirSync(aegisEngRoot);
    for (const d of existingDirs) {
      const full = path.join(aegisEngRoot, d);
      if (fs.statSync(full).isDirectory()) {
        fs.rmSync(full, { recursive: true, force: true });
        console.log(`Pruned legacy folder: ${d}`);
      }
    }
  } else {
    fs.mkdirSync(aegisEngRoot, { recursive: true });
  }

  const allSubagentsList = [];
  const deptSummaryList = [];

  for (const dept of departments) {
    const deptId = dept.id;
    const deptName = dept.name;
    const deptSlug = deptSlugMap[deptId] || `dept-${String(deptId).padStart(2, '0')}`;
    const deptDir = path.join(aegisEngRoot, deptSlug);
    fs.mkdirSync(deptDir, { recursive: true });

    const directorNode = dept.team[0];
    const directorAgentName = directorNode.agent;
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
        id: `aegis-eng-d${deptId}-n${nodeNum}-${agentSlug}`,
        nodeNumber: nodeNum,
        isDirector: isDirector,
        departmentId: deptId,
        departmentName: deptName,
        departmentSlug: deptSlug,
        skill: member.skill,
        responsibility: member.responsibility,
        protocol: 'BHAKTI_1_12_108',
        framework: 'White Caves Engineering Matrix (1-12-108 Software Core)',
        governance: {
          law: 'Aegis V4 Strict Engineering Standard',
          maxFileLines: 350,
          zeroBacklogLaw: true,
          typeScriptStrict: true,
        },
        attachedSkills: attachedSkills.map(s => `.agents/skills/${s}`),
        tools: ['read_file', 'edit_file', 'write_file', 'run_command', 'git', 'search_web'],
      };

      nodesData.push(nodePayload);
      allSubagentsList.push(nodePayload);

      // Write individual node agent file
      const nodeFileName = `node-${String(nodeNum).padStart(2, '0')}-${agentSlug}.agent.json`;
      fs.writeFileSync(
        path.join(deptDir, nodeFileName),
        JSON.stringify(nodePayload, null, 2),
        'utf8'
      );
    });

    // Write director agent file
    const directorSlug = slugify(directorAgentName);
    const directorPayload = {
      name: directorAgentName,
      title: `Director of ${deptName}`,
      departmentId: deptId,
      departmentName: deptName,
      departmentSlug: deptSlug,
      nodeNumber: 1,
      isDirector: true,
      protocol: 'BHAKTI_1_12_108',
      framework: 'White Caves Engineering Matrix (1-12-108 Software Core)',
      primarySkill: directorNode.skill,
      primaryResponsibility: directorNode.responsibility,
      governance: {
        law: 'Aegis V4 Strict Engineering Standard',
        approvalAuthority: 'Full Automated Autopilot & Review Authority',
        maxFileLines: 350,
        zeroBacklogLaw: true,
      },
      attachedSkills: attachedSkills.map(s => `.agents/skills/${s}`),
      subordinateNodes: nodesData.slice(1).map(n => ({
        node: n.nodeNumber,
        agent: n.name,
        skill: n.skill,
        responsibility: n.responsibility,
        file: `node-${String(n.nodeNumber).padStart(2, '0')}-${slugify(n.name)}.agent.json`,
      })),
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
      director: directorAgentName,
      nodeCount: nodesData.length,
      protocol: 'BHAKTI_1_12_108',
      attachedSkills: attachedSkills.map(s => `.agents/skills/${s}`),
      team: nodesData,
    };
    fs.writeFileSync(
      path.join(deptDir, 'dept-manifest.json'),
      JSON.stringify(manifestPayload, null, 2),
      'utf8'
    );

    // Generate department README.md
    const deptReadme = `# Department ${deptId}: ${deptName}

> **Framework:** White Caves Engineering Matrix (1-12-108 Software Core)  
> **Protocol:** Bhakti Protocol (1 Core Sovereign | 12 Departments | 108 Engineering Nodes)  
> **Director:** \`${directorAgentName}\`  
> **Total Nodes:** 9 Nodes (1 Director + 8 Engineering Specialists)  

---

## 🏛️ Department Executive Overview

Department ${deptId} (\`${deptName}\`) serves as an integral pillar of the AEGIS Autonomous Engineering Mesh. Under the leadership of \`${directorAgentName}\`, this department is responsible for ensuring zero-backlog execution, strict single-purpose file compliance (< 350 lines), and 100% type-safe compilation.

---

## 👥 9-Node Engineering Roster

| Node | Agent | Engineering Skill | Primary Codebase Responsibility | Config File |
| :--- | :--- | :--- | :--- | :--- |
${nodesData.map(n => `| Node ${n.nodeNumber} | **${n.name}**${n.isDirector ? ' *(Director)*' : ''} | ${n.skill} | ${n.responsibility} | [\`${n.name.replace('@', '')}.json\`](./node-${String(n.nodeNumber).padStart(2, '0')}-${slugify(n.name)}.agent.json) |`).join('\n')}

---

## 🛠️ Attached Department Skills & Capabilities

The following specialized skills and tools from \`.agents/skills/\` are bound to this department:
${attachedSkills.map(s => `- [\`.agents/skills/${s}\`](../skills/${s}/SKILL.md)`).join('\n')}

---

## 📜 Governance & Quality Standard

1. **Single Purpose File Law:** All written files must not exceed 350 lines of code.
2. **TypeScript Strict Type-Safety:** Zero TypeScript warnings or \`any\` bypasses.
3. **Zero Backlog Law:** All pull requests and issues within this domain must be cleanly resolved.
4. **Autonomous Execution:** Direct authorization granted for subagent dispatch, file generation, and PR validation.
`;

    fs.writeFileSync(path.join(deptDir, 'README.md'), deptReadme, 'utf8');
    deptSummaryList.push({
      id: deptId,
      name: deptName,
      slug: deptSlug,
      director: directorAgentName,
      nodeCount: nodesData.length,
    });

    console.log(`✓ Generated Department ${deptId}: ${deptSlug} (${nodesData.length} nodes)`);
  }

  // Generate Master README.md for aegis-engineering
  const masterReadme = `# White Caves Engineering Matrix (1-12-108 Software Core)

> **AEGIS Autonomous Software Engineering & Architecture Mesh**  
> **Protocol:** Bhakti Protocol (1 Sovereign AEGIS Orchestrator | 12 Departments | 108 Engineering Nodes)  
> **Environment:** Antigravity IDE & VS Code Local Staging  
> **Total Engineering Nodes:** 108 Specialized Agents across 12 Departments  

---

## 🌐 Architectural Overview

The **White Caves Engineering Matrix (1-12-108 Software Core)** defines the complete technical, architectural, and operational engineering workforce for White Caves Real Estate LLC.

It operates strictly separated from the **Zoe AI Real Estate Business Assistants** (\`.agents/zoe-business-assistants/\`):
- **AEGIS Software Engineering** (\`.agents/aegis-engineering/\`): Responsible for code architecture, API endpoints, database schemas, frontend components, CI/CD, testing, and performance optimization.
- **Zoe AI Business Assistants** (\`.agents/zoe-business-assistants/\`): Responsible for brokerage operations, property listings, tenant relations, and DLD compliance.

---

## 🏢 12 Engineering Departments (108 Nodes Total)

| Dept ID | Department Name | Director | Node Count | Directory |
| :---: | :--- | :--- | :---: | :--- |
${deptSummaryList.map(d => `| **${d.id}** | **${d.name}** | \`${d.director}\` | 9 Nodes | [\`${d.slug}\`](./${d.slug}/README.md) |`).join('\n')}

---

## 📜 The Bhakti Protocol & Aegis V4 Standard

Every agent and node within this matrix strictly abides by:
1. **The Single Purpose File Law:** All code files must have a single responsibility and remain under 350 lines.
2. **Canonical 5-Way File Category Standard:** Strict separation of View (\`*.view.tsx\`), Logic (\`*.logic.ts\`), Styles (\`*.styles.ts\`), Data (\`*.data.ts\`), and Config/Types (\`*.config.ts\`).
3. **Continuous Deduplication:** Zero tolerance for duplicate handlers or ghost directories.
4. **Zero-Backlog Law:** Zero open blockers, immediate PR resolution, and automated merge verification.
`;

  fs.writeFileSync(path.join(aegisEngRoot, 'README.md'), masterReadme, 'utf8');
  console.log('✓ Generated .agents/aegis-engineering/README.md');

  // Update .agents/subagent-registry-108.json
  const registry108 = {
    framework: 'White Caves Engineering Matrix (1-12-108 Software Core)',
    totalDepartments: 12,
    nodesPerDepartment: 9,
    totalNodes: 108,
    generatedAt: new Date().toISOString(),
    departments: deptSummaryList,
    nodes: allSubagentsList,
  };
  fs.writeFileSync(
    path.join(rootDir, '.agents', 'subagent-registry-108.json'),
    JSON.stringify(registry108, null, 2),
    'utf8'
  );
  console.log('✓ Generated .agents/subagent-registry-108.json');

  // Update .agents/aegis.agent.json
  const aegisAgentPath = path.join(rootDir, '.agents', 'aegis.agent.json');
  if (fs.existsSync(aegisAgentPath)) {
    const aegisAgent = JSON.parse(fs.readFileSync(aegisAgentPath, 'utf8'));
    if (!aegisAgent.workforceSeparationArchitecture) {
      aegisAgent.workforceSeparationArchitecture = {};
    }
    aegisAgent.workforceSeparationArchitecture.aegisSoftwareEngineering = {
      description:
        'Autonomous Software Engineering, Architecture, Testing, CI/CD, and Codebase Orchestration Mesh',
      rootFolder: '.agents/aegis-engineering',
      protocol: 'BHAKTI_1_12_108',
      framework: 'White Caves Engineering Matrix (1-12-108 Software Core)',
      sovereignLeader: 'AEGIS (Level 0 Orchestrator)',
      departmentsCount: 12,
      nodesPerDepartment: 9,
      totalEngineeringNodes: 108,
      departments: deptSummaryList.map(d => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        director: d.director,
        manifest: `.agents/aegis-engineering/${d.slug}/dept-manifest.json`,
      })),
    };
    fs.writeFileSync(aegisAgentPath, JSON.stringify(aegisAgent, null, 2), 'utf8');
    console.log(
      '✓ Updated .agents/aegis.agent.json with 1-12-108 software engineering architecture'
    );
  }

  console.log('\n🎉 ALL 12 DEPARTMENTS & 108 NODES SUCCESSFULLY BUILT!');
}

run();
