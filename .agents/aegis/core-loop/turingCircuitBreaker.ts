// turingCircuitBreaker.ts
// Simple circuit breaker that disables plan processing after N consecutive failures.

let consecutiveFailures = 0;
const MAX_FAILURES = 5;

export function recordFailure(): void {
  consecutiveFailures++;
}

export function resetFailures(): void {
  consecutiveFailures = 0;
}

export function isOpen(): boolean {
  return consecutiveFailures >= MAX_FAILURES;
}

export function getFailureCount(): number {
  return consecutiveFailures;
}

