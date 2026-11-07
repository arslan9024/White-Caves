/**
 * turingRequestContext.ts — Async-local storage for request identifiers across async boundaries.
 * @see AEG-040
 */

import { AsyncLocalStorage } from 'async_hooks';

const requestStore = new AsyncLocalStorage<string>();

/**
 * Executes a callback within an async-local request ID context.
 * @param requestId Unique trace/request identifier.
 * @param fn Callback to execute.
 */
export function runWithRequestId<T>(requestId: string, fn: () => T): T {
  return requestStore.run(requestId, fn);
}

/**
 * Retrieves the current request ID bound to the active async execution context.
 */
export function getCurrentRequestId(): string | undefined {
  return requestStore.getStore();
}
