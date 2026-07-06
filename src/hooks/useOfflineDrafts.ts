/**
 * useOfflineDrafts — IndexedDB-backed offline draft persistence
 *
 * P0-010: Offline-safe draft capture for notes and viewing feedback.
 * Stores drafts locally when network is unavailable, syncs on restore.
 *
 * Usage:
 *   const { saveDraft, getDraft, deleteDraft, listDrafts } = useOfflineDrafts('viewingFeedback');
 */

import { useCallback, useEffect, useRef } from 'react';

const DB_NAME = 'white-caves-offline';
const DB_VERSION = 1;

export type DraftStoreKey = 'viewingFeedback' | 'draftNotes';

export interface DraftRecord<T = unknown> {
  id: string;
  store: DraftStoreKey;
  payload: T;
  savedAt: string;
  synced: boolean;
}

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('viewingFeedback')) {
        db.createObjectStore('viewingFeedback', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('draftNotes')) {
        db.createObjectStore('draftNotes', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const idbGet = <T>(db: IDBDatabase, store: DraftStoreKey, id: string): Promise<T | null> =>
  new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(id);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => reject(req.error);
  });

const idbPut = <T>(db: IDBDatabase, store: DraftStoreKey, record: T): Promise<void> =>
  new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

const idbDelete = (db: IDBDatabase, store: DraftStoreKey, id: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

const idbGetAll = <T>(db: IDBDatabase, store: DraftStoreKey): Promise<T[]> =>
  new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });

export const useOfflineDrafts = <T = unknown>(storeKey: DraftStoreKey) => {
  const dbRef = useRef<IDBDatabase | null>(null);

  useEffect(() => {
    openDB()
      .then(db => {
        dbRef.current = db;
      })
      .catch(error => {
        console.error('[useOfflineDrafts] Failed to open IndexedDB:', error);
      });

    return () => {
      dbRef.current?.close();
      dbRef.current = null;
    };
  }, []);

  const saveDraft = useCallback(
    async (id: string, payload: T): Promise<void> => {
      if (!dbRef.current) return;

      const record: DraftRecord<T> = {
        id,
        store: storeKey,
        payload,
        savedAt: new Date().toISOString(),
        synced: false,
      };

      await idbPut(dbRef.current, storeKey, record);
    },
    [storeKey]
  );

  const getDraft = useCallback(
    async (id: string): Promise<DraftRecord<T> | null> => {
      if (!dbRef.current) return null;
      return idbGet<DraftRecord<T>>(dbRef.current, storeKey, id);
    },
    [storeKey]
  );

  const deleteDraft = useCallback(
    async (id: string): Promise<void> => {
      if (!dbRef.current) return;
      await idbDelete(dbRef.current, storeKey, id);
    },
    [storeKey]
  );

  const listDrafts = useCallback(async (): Promise<DraftRecord<T>[]> => {
    if (!dbRef.current) return [];
    return idbGetAll<DraftRecord<T>>(dbRef.current, storeKey);
  }, [storeKey]);

  const markSynced = useCallback(
    async (id: string): Promise<void> => {
      if (!dbRef.current) return;
      const existing = await idbGet<DraftRecord<T>>(dbRef.current, storeKey, id);
      if (existing) {
        await idbPut(dbRef.current, storeKey, { ...existing, synced: true });
      }
    },
    [storeKey]
  );

  return { saveDraft, getDraft, deleteDraft, listDrafts, markSynced };
};
