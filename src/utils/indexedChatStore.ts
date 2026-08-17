/**
 * Offline-First IndexedDB Chat Store for White Caves WhatsApp CRM & Nina/Linda Desks
 * Persists conversations, messages, contacts, and lead scores for offline resilience.
 */

import { WhatsAppMessage, WhatsAppContact } from '../schemas/whatsappSchemas';

const CHAT_DB_NAME = 'white-caves-whatsapp-cache';
const CHAT_DB_VERSION = 1;
const MESSAGES_STORE = 'messages_by_contact';
const CONTACTS_STORE = 'contacts_cache';

interface CachedConversation {
  contactId: string;
  messages: WhatsAppMessage[];
  updatedAt: number;
}

interface CachedContactList {
  key: string;
  contacts: WhatsAppContact[];
  updatedAt: number;
}

function openChatDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(CHAT_DB_NAME, CHAT_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
        db.createObjectStore(MESSAGES_STORE, { keyPath: 'contactId' });
      }
      if (!db.objectStoreNames.contains(CONTACTS_STORE)) {
        db.createObjectStore(CONTACTS_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open Chat IndexedDB'));
  });
}

/**
 * Saves messages for a contact to IndexedDB
 */
export async function saveMessagesOffline(
  contactId: string,
  messages: WhatsAppMessage[]
): Promise<void> {
  try {
    const db = await openChatDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(MESSAGES_STORE, 'readwrite');
      const store = tx.objectStore(MESSAGES_STORE);
      const record: CachedConversation = {
        contactId,
        messages,
        updatedAt: Date.now(),
      };
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('Failed to save messages to IndexedDB'));
      tx.oncomplete = () => db.close();
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Transaction failed'));
      };
    });
  } catch (err) {
    console.warn('[indexedChatStore] saveMessagesOffline failed:', err);
  }
}

/**
 * Retrieves cached messages for a contact from IndexedDB
 */
export async function getMessagesOffline(
  contactId: string
): Promise<WhatsAppMessage[]> {
  try {
    const db = await openChatDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(MESSAGES_STORE, 'readonly');
      const store = tx.objectStore(MESSAGES_STORE);
      const req = store.get(contactId);

      req.onsuccess = () => {
        const record = req.result as CachedConversation | undefined;
        resolve(record ? record.messages : []);
      };
      req.onerror = () => reject(req.error ?? new Error('Failed to retrieve messages'));
      tx.oncomplete = () => db.close();
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Transaction failed'));
      };
    });
  } catch (err) {
    console.warn('[indexedChatStore] getMessagesOffline failed:', err);
    return [];
  }
}

/**
 * Saves contact list to IndexedDB
 */
export async function saveContactsOffline(
  contacts: WhatsAppContact[]
): Promise<void> {
  try {
    const db = await openChatDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CONTACTS_STORE, 'readwrite');
      const store = tx.objectStore(CONTACTS_STORE);
      const record: CachedContactList = {
        key: 'all_contacts',
        contacts,
        updatedAt: Date.now(),
      };
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('Failed to save contacts to IndexedDB'));
      tx.oncomplete = () => db.close();
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Transaction failed'));
      };
    });
  } catch (err) {
    console.warn('[indexedChatStore] saveContactsOffline failed:', err);
  }
}

/**
 * Retrieves cached contact list from IndexedDB
 */
export async function getContactsOffline(): Promise<WhatsAppContact[]> {
  try {
    const db = await openChatDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CONTACTS_STORE, 'readonly');
      const store = tx.objectStore(CONTACTS_STORE);
      const req = store.get('all_contacts');

      req.onsuccess = () => {
        const record = req.result as CachedContactList | undefined;
        resolve(record ? record.contacts : []);
      };
      req.onerror = () => reject(req.error ?? new Error('Failed to retrieve contacts'));
      tx.oncomplete = () => db.close();
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Transaction failed'));
      };
    });
  } catch (err) {
    console.warn('[indexedChatStore] getContactsOffline failed:', err);
    return [];
  }
}
