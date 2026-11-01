/**
 * loadSecrets – runtime secret loader placeholder.
 *
 * In a Vite/TS front‑end project the environment variables are injected at build
 * time via `import.meta.env`. Production builds already contain the resolved
 * values, so this function intentionally does nothing. It exists only to satisfy
 * the compile‑time reference from `src/auth/firebaseInit.ts` and to provide a
 * clear extension point for future secret‑management strategies (e.g. fetching
 * from a remote secret manager or loading a local `.env` file during development).
 */
export function loadSecrets(): void {
  // No‑op for front‑end; keep for API compatibility.
}

