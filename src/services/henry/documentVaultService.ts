/**
 * [Category 4: Processing Engine]
 * White Caves Real Estate - Persistent In-Browser Document Vault (IndexedDB)
 * Stores compiled PDFs, KYC documents, Title Deeds, and deal payloads offline (< 140 lines).
 */

const DB_NAME = 'white_caves_henry_vault';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

export interface VaultDocument {
  id?: string;
  title: string;
  documentType: string;
  tenantName?: string;
  propertyNo?: string;
  contractNo?: string;
  createdAt?: string;
  updatedAt?: string;
  fileBlob?: Blob | ArrayBuffer;
  metadata?: Record<string, unknown>;
}

export const openVaultDb = (): Promise<IDBDatabase | null> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('documentType', 'documentType', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('tenantName', 'tenantName', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveDocumentToVault = async (doc: VaultDocument): Promise<VaultDocument | null> => {
  const db = await openVaultDb();
  if (!db) return null;

  const record: VaultDocument = {
    ...doc,
    id: doc.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: doc.title || 'Untitled Document',
    documentType: doc.documentType || 'general',
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);

    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
};

export const getDocumentFromVault = async (id: string): Promise<VaultDocument | null> => {
  const db = await openVaultDb();
  if (!db) return null;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);

    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
};

export const listVaultDocuments = async (): Promise<VaultDocument[]> => {
  const db = await openVaultDb();
  if (!db) return [];

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

export const deleteDocumentFromVault = async (id: string): Promise<boolean> => {
  const db = await openVaultDb();
  if (!db) return false;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
};
