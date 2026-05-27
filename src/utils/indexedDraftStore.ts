const DB_NAME = 'white-caves-offline-drafts';
const STORE_NAME = 'drafts';
const DB_VERSION = 1;

type DraftRecord = {
  key: string;
  value: unknown;
  updatedAt: number;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest,
): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = operation(store);

    request.onsuccess = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      resolve(request.result as T);
    };
    request.onerror = () => reject(request.error ?? new Error('IndexedDB operation failed'));

    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error('IndexedDB transaction failed'));
    };
  });
}

export async function getDraft<T = unknown>(key: string): Promise<T | undefined> {
  const record = await withStore<DraftRecord>('readonly', store => store.get(key));
  return record?.value as T | undefined;
}

export async function setDraft(key: string, value: unknown): Promise<void> {
  await withStore('readwrite', store =>
    store.put({
      key,
      value,
      updatedAt: Date.now(),
    } satisfies DraftRecord),
  );
}

export async function clearDraft(key: string): Promise<void> {
  await withStore('readwrite', store => store.delete(key));
}
