// turingErrorUtil.ts
// Helper to serialize errors in a structured way for logging/auditing.

export function serializeError(err: any): Record<string, unknown> {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
      // Include custom properties if present
      ...(err as any),
    };
  }
  // Fallback for non‑Error objects
  return { error: err };
}

