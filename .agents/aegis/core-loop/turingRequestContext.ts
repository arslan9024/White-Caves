// turingRequestContext.ts
// Simple async‑local storage for request identifiers.
// Uses Node's async_hooks to bind a requestId to the current async execution context.

import { asyncLocalStorage } from 'async_hooks';

const requestStore = new asyncLocalStorage<string>();

export function runWithRequestId<T>(requestId: string, fn: () => T): T {
  return requestStore.run(requestId, fn);
}

export function getCurrentRequestId(): string | undefined {
  return requestStore.getStore();
}

