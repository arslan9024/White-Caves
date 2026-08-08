'use client';

/**
 * app/store/StoreProvider.tsx — Minimal Redux Client Provider (Next.js 15 App Router)
 *
 * ─── WHY NO src/store/ IMPORTS ─────────────────────────────────────────────
 * src/store/store.tsx uses `import.meta.env.DEV` (Vite-only global).
 * The individual slices (authSlice, navigationSlice, etc.) have transitive
 * imports that reach store.tsx at module evaluation time, causing:
 *   TypeError: Cannot read properties of undefined (reading 'DEV')
 * during Next.js /_not-found prerendering.
 *
 * App Router pages are Server Components — they fetch data via Prisma directly
 * and don't need the Vite SPA's Redux store. This provider exists purely to
 * satisfy any `'use client'` child components that call useSelector/useDispatch.
 *
 * The Vite SPA's full store (store.tsx) continues to run unmodified in the
 * Vite context. These are two completely separate render trees.
 * ────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';

// ─── Placeholder reducer ──────────────────────────────────────────────────────
// Zero imports from src/store/ — avoids the import.meta.env.DEV crash.
// Child components that need richer state should fetch from the API layer
// (e.g., /api/auth, /api/leads) rather than from the Vite Redux store.

const _placeholder = (state = {}) => state;

function makeNextStore(): EnhancedStore {
  return configureStore({
    reducer: { _placeholder },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() => makeNextStore());

  return <Provider store={store}>{children}</Provider>;
}
