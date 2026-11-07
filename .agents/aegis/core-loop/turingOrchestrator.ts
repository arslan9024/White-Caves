// turingOrchestrator.ts
/**
 * Thin wrapper that re‑exports the singleton instance of the refactored Turing Orchestrator.
 * All core logic now lives in ./turingCore.ts (class `TuringOrchestratorCore`).
 * This file maintains the original public API so existing imports continue to work.
 */
import { TuringOrchestratorCore } from './turingCore.ts';
/**
 * Alias for the core orchestrator class, kept for backward compatibility.
 * @see AEG-001 – Orchestration API contract.
 */
export { TuringOrchestratorCore as TuringOrchestrator };


/**
 * Public singleton instance used throughout the codebase.
 * @see AEG-001 – Orchestration API contract.
 */
export const turingOrchestrator = TuringOrchestratorCore.getInstance();
export default turingOrchestrator;
