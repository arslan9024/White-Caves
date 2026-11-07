import path from 'path';

export const SUPREME_CREDIT_VELOCITY_CONFIG = {
  lawId: 'TURING-LAW-000',
  title: 'Supreme Zero-Waste AI Credit & Sub-Second Velocity Law',
  maxTaskTokens: 15000,
  targetTurnCountMax: 3,
  requireParallelToolCalls: true,
  requireSurgicalLineReads: true,
  requireTargetedVitestRun: true,
} as const;

export const AEGIS_PROTOCOL_FILES = [
  '.agents/aegis/protocols/PROMETHEUS_CORE_UNBOUND.csv',
  '.agents/aegis/protocols/TURING_SILENT_VELOCITY.csv',
  '.agents/aegis/protocols/PHOONIX_SHIELD_ISOLATION.csv',
  '.agents/aegis/protocols/VALKYRIE_LEDGER_RISE.csv',
  '.agents/aegis/protocols/APOCALYPSE_OVERDRIVE_MATRIX.csv',
] as const;

export const ALLOWED_CONTEXT_TRIAD = ['ThemeContext', 'LanguageContext', 'CurrencyContext'] as const;
// Cached Set for fast triad validation (zero‑token, reused across calls)
export const CONTEXT_SET = new Set(ALLOWED_CONTEXT_TRIAD);

// Rule set version – incremented on hot‑reload
export let RULES_VERSION = 1;
export function bumpRulesVersion() {
  RULES_VERSION++;
}
