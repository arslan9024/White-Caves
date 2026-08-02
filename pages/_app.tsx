/**
 * pages/_app.tsx — Minimal Next.js Pages Router shell
 *
 * This file exists ONLY to anchor the root-level `pages/` directory so
 * Next.js stops trying to compile `src/pages/` (the Vite React Router pages)
 * as Next.js Pages Router routes.
 *
 * ─── WHY THIS EXISTS ────────────────────────────────────────────────────────
 * Next.js 15 detection priority:
 *   1. ./pages/   ← root-level wins — Next.js uses THIS and ignores src/pages/
 *   2. ./src/pages/ ← only used when no root-level pages/ exists
 *
 * By placing an empty Pages Router here we protect the Vite src/pages/ tree
 * from being accidentally compiled during `npm run next:build`.
 *
 * This file is NOT a real page — it will never be served in production.
 * ────────────────────────────────────────────────────────────────────────────
 */

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
