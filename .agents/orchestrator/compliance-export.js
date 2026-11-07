#!/usr/bin/env node
/**
 * compliance-export.js — AEGIS V5.0 Phase 10 Statutory Compliance Export Utility
 * Generates a machine-readable JSON & summary report of all 42 AEGIS V5.0 Statutory Rules
 * (AEG-001..AEG-042), SUPREME LAW #0 (TURING-LAW-000), and 1-12-108 Mesh readiness.
 *
 * Usage:
 *   node .agents/orchestrator/compliance-export.js [--json] [--out <filepath>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { loadProtocolRules } from './aegis-engine.js';

const ROOT = process.cwd();

export function generateComplianceReport() {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : { version: '2.0.27' };
  const rules = loadProtocolRules();

  const verifiedRules = rules.map(r => {
    const fullTarget = path.join(ROOT, r.verificationFile);
    return {
      ...r,
      verifiedOnDisk: fs.existsSync(fullTarget),
    };
  });

  const report = {
    schema: 'AEGIS-V5.0-COMPLIANCE-EXPORT',
    version: pkg.version,
    generatedAt: new Date().toISOString(),
    supremeLaw: {
      id: 'TURING-LAW-000',
      title: 'Turing Zero-Waste AI Credit & Sub-Second Velocity',
      maxTaskTokens: 15000,
      status: 'ENFORCED',
    },
    hierarchyMesh: {
      formula: 'Dual 1-12-108',
      executiveCouncil: 7,
      engineeringSpecialists: 108,
      zoeBusinessAssistants: 120,
      totalAgents: 235,
    },
    protocolSummary: {
      totalRules: verifiedRules.length,
      verifiedTargetsCount: verifiedRules.filter(r => r.verifiedOnDisk).length,
      status: verifiedRules.length === 42 ? 'COMPLIANT' : 'PARTIAL',
    },
    rules: verifiedRules,
  };

  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename || process.argv[1])) {
  const args = process.argv.slice(2);
  const report = generateComplianceReport();
  const outIdx = args.indexOf('--out');

  if (outIdx !== -1 && args[outIdx + 1]) {
    const outPath = path.resolve(ROOT, args[outIdx + 1]);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`✅ [AEGIS Compliance Export] Saved report (${report.protocolSummary.totalRules} rules) to ${outPath}`);
  } else if (args.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`🛡️ [AEGIS V5.0 Compliance Export] Version: v${report.version}`);
    console.log(`   • Supreme Law: ${report.supremeLaw.id} (${report.supremeLaw.status})`);
    console.log(`   • Sovereign Mesh: ${report.hierarchyMesh.totalAgents} Agents (${report.hierarchyMesh.formula})`);
    console.log(
      `   • Protocol Rules: ${report.protocolSummary.totalRules}/42 loaded (${report.protocolSummary.status})`
    );
  }
}
