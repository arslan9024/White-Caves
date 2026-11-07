/**
 * turingConstants.ts — Canonical constants for the AEGIS V5.0 Turing Orchestrator.
 * @see TURING-LAW-000
 * @see AEG-001 – AEG-042
 */

/**
 * Supreme Law #0 configuration for AI credit and execution velocity.
 * @see TURING-LAW-000
 */
export const SUPREME_CREDIT_VELOCITY_CONFIG = {
  lawId: 'TURING-LAW-000',
  title: 'Supreme Zero-Waste AI Credit & Sub-Second Velocity Law',
  maxTaskTokens: 15000,
  targetTurnCountMax: 3,
  requireParallelToolCalls: true,
  requireSurgicalLineReads: true,
  requireTargetedVitestRun: true,
} as const;

/**
 * Canonical 5 V5.0 CSV Protocol Matrices.
 * @see AEG-001 – AEG-042
 */
export const AEGIS_PROTOCOL_FILES = [
  '.agents/aegis/protocols/PROMETHEUS_CORE_UNBOUND.csv',
  '.agents/aegis/protocols/TURING_SILENT_VELOCITY.csv',
  '.agents/aegis/protocols/PHOENIX_SHIELD_ISOLATION.csv',
  '.agents/aegis/protocols/VALKYRIE_LEDGER_RISE.csv',
  '.agents/aegis/protocols/APOCALYPSE_OVERDRIVE_MATRIX.csv',
] as const;

/**
 * Strict Context Triad boundary (Theme, Language, Currency).
 * @see AEG-003
 * @see AEG-041
 */
export const ALLOWED_CONTEXT_TRIAD = [
  'ThemeContext',
  'LanguageContext',
  'CurrencyContext',
] as const;

/** Cached Set for fast O(1) triad validation. */
export const CONTEXT_SET: ReadonlySet<string> = new Set<string>(ALLOWED_CONTEXT_TRIAD);

/** Rule set version – incremented on hot-reload. */
export let RULES_VERSION = 1;

/**
 * Increments the active rule set version upon hot-reload.
 * @returns The updated RULES_VERSION number.
 */
export function bumpRulesVersion(): number {
  RULES_VERSION++;
  return RULES_VERSION;
}
