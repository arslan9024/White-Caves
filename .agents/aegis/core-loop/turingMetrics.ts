// turingMetrics.ts – lightweight in‑memory metrics (no external deps)
// Provides simple counters and a Prometheus‑compatible plain‑text export.

const counters = new Map<string, number>();
const gauges = new Map<string, number>();

export function inc(metric: string, value: number = 1): void {
  counters.set(metric, (counters.get(metric) ?? 0) + value);
}

export function set(metric: string, value: number): void {
  gauges.set(metric, value);
}

export function getMetrics(): string {
  let out = '';
  for (const [k, v] of counters.entries()) {
    out += `${k} ${v}\n`;
  }
  for (const [k, v] of gauges.entries()) {
    out += `${k} ${v}\n`;
  }
  return out;
}

// Convenience helpers used by the orchestrator:
export const planProcessed = () => inc('turing_plan_processed_total');
export const ruleViolation = () => inc('turing_rule_violations_total');
export const creditUsage = (v: number) => set('turing_credit_usage', v);

