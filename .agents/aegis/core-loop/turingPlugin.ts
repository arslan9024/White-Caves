// turingPlugin.ts
// Defines the contract for plugins that can extend the Turing Orchestrator.

import { TuringAuditRule } from './turingTypes';

export interface OrchestratorPlugin {
  /** Optional initialization hook – called when the plugin is registered. */
  init?(): void | Promise<void>;
  /** Allows the plugin to provide additional audit rules. */
  getRules?(): TuringAuditRule[];
  /** Allows the plugin to specify a custom priority for its rules.
   *  Lower numbers run earlier. Default is 100.
   */
  getRulePriority?(): number;
}

// Simple container for registered plugins (singleton).
export const pluginRegistry: OrchestratorPlugin[] = [];

export function registerPlugin(plugin: OrchestratorPlugin) {
  pluginRegistry.push(plugin);
  if (plugin.init) {
    // Fire‑and‑forget – errors will surface via the orchestrator's error handling.
    try {
      const result = plugin.init();
      if (result instanceof Promise) result.catch(err => console.error('Plugin init error', err));
    } catch (e) {
      console.error('Plugin init sync error', e);
    }
  }
}

