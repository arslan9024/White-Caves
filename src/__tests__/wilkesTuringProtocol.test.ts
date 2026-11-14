import { describe, it, expect } from 'vitest';
import {
  validateTuringExecutionCriteria,
  getTuringRuleById,
  SUPREME_TURING_LAWS,
} from '../../.agents/aegis/protocols/turingProtocol';
import {
  validateMaryAllenWilkesModule,
  getWilkesLayerTemplate,
  MARY_ALLEN_WILKES_SPEC,
} from '../../.agents/aegis/protocols/maryAllenWilkesProtocol';
import {
  AEGIS_42_PROTOCOLS,
  enforceProtocolGuard,
} from '../../.agents/aegis/protocols/aegisMasterProtocols';

describe('Turing Protocol & Mary Allen Wilkes Protocol Suite', () => {
  describe('AEGIS 42 Law Protocol Suite', () => {
    it('indexes all 42 rules from AEG-001 to AEG-042 across all 5 pillars', () => {
      const allKeys = Object.keys(AEGIS_42_PROTOCOLS);
      expect(allKeys.length).toBe(42);
      expect(AEGIS_42_PROTOCOLS['AEG-001'].pillar).toBe('PROMETHEUS');
      expect(AEGIS_42_PROTOCOLS['AEG-010'].pillar).toBe('TURING');
      expect(AEGIS_42_PROTOCOLS['AEG-018'].pillar).toBe('PHOENIX');
      expect(AEGIS_42_PROTOCOLS['AEG-028'].pillar).toBe('VALKYRIE');
      expect(AEGIS_42_PROTOCOLS['AEG-037'].pillar).toBe('APOCALYPSE');
    });

    it('enforces runtime protocol guards correctly', () => {
      // Valid run
      const valid = enforceProtocolGuard({
        contextCount: 3,
        maxLineCount: 250,
        hasPlainTextSecrets: false,
        vatRatePercent: 5,
      });
      expect(valid.pass).toBe(true);
      expect(valid.violations.length).toBe(0);

      // Violations
      const invalid = enforceProtocolGuard({
        contextCount: 5, // Violates AEG-003
        maxLineCount: 420, // Violates AEG-008
        hasPlainTextSecrets: true, // Violates AEG-016
        vatRatePercent: 10, // Violates AEG-028
      });
      expect(invalid.pass).toBe(false);
      expect(invalid.violations.length).toBe(4);
    });
  });

  describe('Turing Protocol', () => {
    it('indexes all supreme Turing laws', () => {
      expect(SUPREME_TURING_LAWS['TURING-LAW-000']).toBeDefined();
      expect(SUPREME_TURING_LAWS['TURING-ROOT-007']).toBeDefined();
      expect(SUPREME_TURING_LAWS['TURING-DEV-SERVER-BAN-013']).toBeDefined();
      expect(SUPREME_TURING_LAWS['TURING-DUAL-FORMAT-014']).toBeDefined();
      expect(SUPREME_TURING_LAWS['TURING-SHELL-015']).toBeDefined();
    });

    it('retrieves silent velocity rules by ID', () => {
      const rule = getTuringRuleById('AEG-010');
      expect(rule).toBeDefined();
      expect(rule?.departmentCode).toBe('WC-UXA');
      expect(rule?.verificationTarget).toBe('package.json');
    });

    it('enforces Turing criteria constraints', () => {
      const validCheck = validateTuringExecutionCriteria({ maxLineCount: 200, timeoutMs: 1200 });
      expect(validCheck.valid).toBe(true);

      const invalidCheck = validateTuringExecutionCriteria({
        maxLineCount: 400,
        isDevServerProcess: true,
        timeoutMs: 2500,
      });
      expect(invalidCheck.valid).toBe(false);
      expect(invalidCheck.violations.length).toBe(3);
    });
  });

  describe('Mary Allen Wilkes Protocol', () => {
    it('defines 14 architectural layers spanning Core 7, Resilience, and Enterprise AI', () => {
      const categories = Object.keys(MARY_ALLEN_WILKES_SPEC);
      expect(categories).toContain('view');
      expect(categories).toContain('logic');
      expect(categories).toContain('styles');
      expect(categories).toContain('data');
      expect(categories).toContain('types');
      expect(categories).toContain('tests');
      expect(categories).toContain('workflow');
      expect(categories).toContain('fallback');
      expect(categories).toContain('telemetry');
      expect(categories).toContain('i18n');
      expect(categories).toContain('cache');
      expect(categories).toContain('workers');
      expect(categories).toContain('policy');
      expect(categories).toContain('agent');
    });

    it('evaluates module compliance accurately', () => {
      const files = [
        'DealManager.view.tsx',
        'DealManager.logic.ts',
        'DealManager.styles.ts',
        'DealManager.data.ts',
        'DealManager.types.ts',
        'DealManager.test.tsx',
        'DealManager.workflow.ts',
        'DealManager.fallback.tsx',
      ];

      const result = validateMaryAllenWilkesModule('DealManager', files, {
        'DealManager.view.tsx': 120,
        'DealManager.logic.ts': 180,
      });

      expect(result.compliant).toBe(true);
      expect(result.missingCoreLayers.length).toBe(0);
      expect(result.turingCompliance.valid).toBe(true);
    });

    it('detects missing core layers and Turing violations', () => {
      const partialFiles = ['DealManager.view.tsx', 'DealManager.logic.ts'];
      const result = validateMaryAllenWilkesModule('DealManager', partialFiles, {
        'DealManager.view.tsx': 500, // Violates < 350 limit
      });

      expect(result.compliant).toBe(false);
      expect(result.missingCoreLayers.length).toBeGreaterThan(0);
      expect(result.turingCompliance.valid).toBe(false);
    });

    it('generates scaffolding templates correctly', () => {
      const policyTemplate = getWilkesLayerTemplate('EscrowManager', 'policy');
      expect(policyTemplate.filename).toBe('EscrowManager.policy.ts');
      expect(policyTemplate.content).toContain('canAccessEscrowManager');
    });
  });
});
