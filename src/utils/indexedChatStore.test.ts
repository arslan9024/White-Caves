import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  saveMessagesOffline,
  getMessagesOffline,
  saveContactsOffline,
  getContactsOffline,
} from './indexedChatStore';
import { WhatsAppMessage, WhatsAppContact } from '../schemas/whatsappSchemas';

// ─── In-Memory IndexedDB Mock ───────────────────────────────────────────────

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
    objectStoreNames: { contains: () => true } as unknown as DOMStringList,
    createObjectStore: () => {},
    transaction(storeName: string, mode: IDBTransactionMode): IDBTransaction {
      const store = getStore(dbName, storeName);
      let onComplete: (() => void) | null = null;

      const txStore: IDBObjectStore = {
        get(key: string) {
          return makeRequest(() => store.get(key));
        },
        put(record: any) {
          const key = record.contactId || record.key;
          return makeRequest(() => { store.set(key, record); return undefined; });
        },
      } as unknown as IDBObjectStore;

      const tx: IDBTransaction = {
        objectStore: () => txStore,
        set oncomplete(fn: (() => void) | null) {
          onComplete = fn;
          queueMicrotask(() => onComplete?.());
        },
        get oncomplete() { return onComplete; },
        set onerror(_fn: any) {},
        get onerror() { return null; },
      } as unknown as IDBTransaction;

      return tx;
    },
    close() {},
  } as unknown as IDBDatabase;
}

const indexedDBMock: IDBFactory = {
  open(dbName: string): IDBOpenDBRequest {
    const db = makeDB(dbName);
    let onSuccess: ((e: Event) => void) | null = null;

    const req = {
      result: db,
      error: null,
      set onupgradeneeded(fn: any) {
        queueMicrotask(() => fn?.({ target: { result: db } }));
      },
      set onsuccess(fn: any) {
        onSuccess = fn;
        queueMicrotask(() => onSuccess?.({} as Event));
      },
      get onsuccess() { return onSuccess; },
      set onerror(_fn: any) {},
      get onerror() { return null; },
    } as unknown as IDBOpenDBRequest;

    return req;
  },
  deleteDatabase: () => ({} as IDBOpenDBRequest),
  cmp: () => 0,
  databases: async () => [],
};

describe('indexedChatStore', () => {
  beforeEach(() => {
    databases.clear();
    Object.defineProperty(globalThis, 'indexedDB', {
      value: indexedDBMock,
      configurable: true,
      writable: true,
    });
  });

  it('persists and retrieves messages by contact ID', async () => {
    const mockMessages: WhatsAppMessage[] = [
      {
        id: 'msg-1',
        sender: 'client',
        senderName: 'Tariq Mansoor',
        text: 'Is the Palm villa still available?',
        timestamp: '2026-08-16T12:00:00Z',
        status: 'read',
        leadScore: 92,
      },
      {
        id: 'msg-2',
        sender: 'nina',
        senderName: 'Nina AI',
        text: 'Yes Mr. Tariq, viewing is available tomorrow at 4 PM.',
        timestamp: '2026-08-16T12:01:00Z',
        status: 'delivered',
        leadScore: 92,
      },
    ];

    await saveMessagesOffline('contact-001', mockMessages);
    const retrieved = await getMessagesOffline('contact-001');

    expect(retrieved).toHaveLength(2);
    expect(retrieved[0].text).toBe('Is the Palm villa still available?');
    expect(retrieved[1].sender).toBe('nina');
  });

  it('persists and retrieves cached contacts list', async () => {
    const mockContacts: WhatsAppContact[] = [
      {
        id: 'contact-001',
        name: 'Tariq Mansoor',
        phone: '+971501234567',
        lastMessage: 'Yes Mr. Tariq, viewing is available...',
        unreadCount: 0,
        timestamp: '2026-08-16T12:01:00Z',
        leadScore: 92,
        status: 'VIP',
      },
    ];

    await saveContactsOffline(mockContacts);
    const retrieved = await getContactsOffline();

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].name).toBe('Tariq Mansoor');
    expect(retrieved[0].status).toBe('VIP');
  });

  it('returns empty array when querying non-existent contact', async () => {
    const retrieved = await getMessagesOffline('non-existent');
    expect(retrieved).toEqual([]);
  });
});
