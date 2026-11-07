// turingRetry.ts
// Simple exponential back‑off retry utility.

export async function retry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 100): Promise<T> {
  let lastError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      // If this was the last attempt, rethrow.
      if (i === attempts - 1) break;
      // Wait before next attempt.
      await new Promise(res => setTimeout(res, delayMs * Math.pow(2, i)));
    }
  }
  throw lastError;
}

