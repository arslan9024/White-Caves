/**
 * indexedDraftStore.test.ts — Tests for offline-safe IndexedDB draft persistence
 *
 * W18.1-P0-010: Offline-safe draft capture for notes / viewing feedback
 *
 * Strategy: polyfill window.indexedDB with a minimal in-memory fake before
 * importing the module under test (vi.hoisted ensures the mock is applied
 * before any module-level code runs).
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// ─── Minimal in-memory IndexedDB polyfill ───────────────────────────────────

const { buildIndexedDBMock } = vi.hoisted(() => {
  function buildIndexedDBMock() {
    // Each DB: Map<storeName, Map<key, record>>
    const databases = new Map<string, Map<string, Map<string, unknown>>>();

    function getStore(dbName: string, storeName: string): Map<string, unknown> {
      if (!databases.has(dbName)) databases.set(dbName, new Map());
      const db = databases.get(dbName)!;
      if (!db.has(storeName)) db.set(storeName, new Map());
      return db.get(storeName)!;
    }

    function makeRequest<T>(resultFn: () => T): IDBRequest<T> {
      let onSuccess: ((e: Event) => void) | null = null;
      let onError: ((e: Event) => void) | null = null;
      let _result: T;

      const req = {
        get result() { return _result; },
        get error() { return null; },
        set onsuccess(fn: ((e: Event) => void) | null) {
          onSuccess = fn;
          // Schedule synchronously so tests don't need timers
          queueMicrotask(() => {
            try { _result = resultFn(); } catch { /* ignore */ }
            onSuccess?.({} as Event);
          });
        },
        get onsuccess() { return onSuccess; },
        set onerror(fn: ((e: Event) => void) | null) { onError = fn; },
        get onerror() { return onError; },
      } as unknown as IDBRequest<T>;

      return req;
    }

    function makeDB(dbName: string): IDBDatabase {
      return {
        objectStoreNames: { contains: (_n: string) => false } as DOMStringList,
        createObjectStore: (_name: string, _opts: IDBObjectStoreParameters) => {
          // store already initialised via getStore calls
        },
        transaction(storeName: string, mode: IDBTransactionMode): IDBTransaction {
          const store = getStore(dbName, storeName);
          let onComplete: (() => void) | null = null;
          let onError: (() => void) | null = null;

          const txStore: IDBObjectStore = {
            get(key: string) {
              return makeRequest(() => store.get(key));
            },
            put(record: unknown) {
              const r = record as { key: string };
              return makeRequest(() => { store.set(r.key, record); return undefined; });
            },
            delete(key: string) {
              return makeRequest(() => { store.delete(key); return undefined; });
            },
          } as unknown as IDBObjectStore;

          const tx: IDBTransaction = {
            objectStore: (_name: string) => txStore,
            set oncomplete(fn: (() => void) | null) {
              onComplete = fn;
              queueMicrotask(() => onComplete?.());
            },
            get oncomplete() { return onComplete; },
            set onerror(fn: (() => void) | null) { onError = fn; },
            get onerror() { return onError; },
          } as unknown as IDBTransaction;

          return tx;
        },
        close() { /* no-op */ },
      } as unknown as IDBDatabase;
    }

    const indexedDBMock: IDBFactory = {
      open(dbName: string, _version?: number): IDBOpenDBRequest {
        const db = makeDB(dbName);
        let onUpgradeNeeded: ((e: IDBVersionChangeEvent) => void) | null = null;
        let onSuccess: ((e: Event) => void) | null = null;
        let onError: ((e: Event) => void) | null = null;

        const req = {
          result: db,
          error: null,
          set onupgradeneeded(fn: ((e: IDBVersionChangeEvent) => void) | null) {
            onUpgradeNeeded = fn;
            queueMicrotask(() => onUpgradeNeeded?.({ target: { result: db } } as unknown as IDBVersionChangeEvent));
          },
          get onupgradeneeded() { return onUpgradeNeeded; },
          set onsuccess(fn: ((e: Event) => void) | null) {
            onSuccess = fn;
            queueMicrotask(() => onSuccess?.({} as Event));
          },
          get onsuccess() { return onSuccess; },
          set onerror(fn: ((e: Event) => void) | null) { onError = fn; },
          get onerror() { return onError; },
        } as unknown as IDBOpenDBRequest;

        return req;
      },
      deleteDatabase: () => ({} as IDBOpenDBRequest),
      cmp: () => 0,
      databases: async () => [],
    } as unknown as IDBFactory;

    return { indexedDBMock, databases };
  }

  return { buildIndexedDBMock };
});

// Install polyfill before any module import
let databases: ReturnType<typeof buildIndexedDBMock>['databases'];
(() => {
  const result = buildIndexedDBMock();
  databases = result.databases;
  Object.defineProperty(globalThis, 'indexedDB', {
    value: result.indexedDBMock,
    writable: true,
    configurable: true,
  });
  // Ensure window.indexedDB also resolves (jsdom sets window === globalThis)
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'indexedDB', {
      value: result.indexedDBMock,
      writable: true,
      configurable: true,
    });
  }
})();

// ─── Now import the module under test ───────────────────────────────────────

import { clearDraft, getDraft, setDraft } from './indexedDraftStore';

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('indexedDraftStore — offline draft persistence (W18.1-P0-010)', () => {
  beforeEach(() => {
    // Clear all stored data between tests
    databases.forEach(db => db.forEach(store => store.clear()));
    vi.clearAllMocks();
  });

  // ── setDraft / getDraft ─────────────────────────────────────────────────

  describe('setDraft + getDraft round-trip', () => {
    it('stores a string value and retrieves it', async () => {
      await setDraft('note:viewing-1', 'Great property, interested');
      const result = await getDraft<string>('note:viewing-1');
      expect(result).toBe('Great property, interested');
    });

    it('stores a complex object and retrieves it intact', async () => {
      const feedbackPayload = {
        viewingId: 'v-123',
        rating: 4,
        notes: 'Clean unit, parking available',
        savedAt: Date.now(),
      };
      await setDraft('viewing-feedback:v-123', feedbackPayload);
      const result = await getDraft<typeof feedbackPayload>('viewing-feedback:v-123');
      expect(result).toEqual(feedbackPayload);
    });

    it('overwrites an existing draft with new value', async () => {
      await setDraft('note:lead-55', 'First draft');
      await setDraft('note:lead-55', 'Updated draft');
      const result = await getDraft<string>('note:lead-55');
      expect(result).toBe('Updated draft');
    });

    it('returns undefined for a key that has never been set', async () => {
      const result = await getDraft('non-existent-key');
      expect(result).toBeUndefined();
    });

    it('isolates drafts by key — different keys do not collide', async () => {
      await setDraft('note:lead-1', 'Lead 1 note');
      await setDraft('note:lead-2', 'Lead 2 note');
      const r1 = await getDraft<string>('note:lead-1');
      const r2 = await getDraft<string>('note:lead-2');
      expect(r1).toBe('Lead 1 note');
      expect(r2).toBe('Lead 2 note');
    });
  });

  // ── clearDraft ──────────────────────────────────────────────────────────

  describe('clearDraft', () => {
    it('removes a draft so subsequent getDraft returns undefined', async () => {
      await setDraft('draft:form-1', { field: 'value' });
      await clearDraft('draft:form-1');
      const result = await getDraft('draft:form-1');
      expect(result).toBeUndefined();
    });

    it('does not throw when clearing a key that does not exist', async () => {
      await expect(clearDraft('key-that-never-existed')).resolves.toBeUndefined();
    });

    it('only removes the targeted key, not siblings', async () => {
      await setDraft('draft:a', 'alpha');
      await setDraft('draft:b', 'beta');
      await clearDraft('draft:a');
      expect(await getDraft('draft:a')).toBeUndefined();
      expect(await getDraft<string>('draft:b')).toBe('beta');
    });
  });

  // ── Offline-safe contract ───────────────────────────────────────────────

  describe('offline contract — data survives across multiple operations', () => {
    it('set → clear → set sequence returns the new value', async () => {
      await setDraft('session:x', 'v1');
      await clearDraft('session:x');
      await setDraft('session:x', 'v2');
      expect(await getDraft<string>('session:x')).toBe('v2');
    });

    it('stores viewing feedback draft before sync (server-wins pattern)', async () => {
      // Simulate field agent capturing viewing feedback offline
      const offlineFeedback = { viewingId: 'v-999', rating: 5, notes: 'Perfect sea view' };
      await setDraft(`viewing-feedback:${offlineFeedback.viewingId}`, offlineFeedback);

      // Simulate "server-wins" merge — server returns authoritative version
      const serverRecord = { viewingId: 'v-999', rating: 5, notes: 'Perfect sea view — server confirmed', syncedAt: '2026-05-28T09:00:00Z' };
      await setDraft(`viewing-feedback:${offlineFeedback.viewingId}`, serverRecord);

      const merged = await getDraft<typeof serverRecord>(`viewing-feedback:${offlineFeedback.viewingId}`);
      expect(merged?.syncedAt).toBe('2026-05-28T09:00:00Z');
      expect(merged?.notes).toContain('server confirmed');
    });

    it('stores note drafts for multiple leads without conflict', async () => {
      const keys = ['lead-1', 'lead-2', 'lead-3', 'lead-4', 'lead-5'];
      await Promise.all(keys.map(k => setDraft(`note:${k}`, `Note for ${k}`)));

      for (const k of keys) {
        expect(await getDraft<string>(`note:${k}`)).toBe(`Note for ${k}`);
      }
    });
  });

  // ── Unavailable IndexedDB ────────────────────────────────────────────────

  describe('unavailable IndexedDB — graceful rejection', () => {
    it('rejects if window.indexedDB is undefined', async () => {
      const original = window.indexedDB;
      // @ts-expect-error intentional undefined assignment for test
      window.indexedDB = undefined;

      await expect(getDraft('any-key')).rejects.toThrow('IndexedDB is not available');

      // Restore
      Object.defineProperty(window, 'indexedDB', {
        value: original,
        writable: true,
        configurable: true,
      });
    });
  });
});
