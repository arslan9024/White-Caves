import { createCRDTDoc, mergeCRDTDocuments, ConflictResolution, CRDTDocument } from '../utils/offlineCRDT';

export interface SyncQueueItem {
  id: string;
  action: 'CREATE_NOTE' | 'UPDATE_LEAD' | 'UPDATE_PROPERTY_STATUS' | string;
  payload: Record<string, unknown>;
  timestamp: number;
  attempts: number;
}

type SyncListener = (status: { isSyncing: boolean; pendingCount: number; lastConflict?: ConflictResolution }) => void;

class OfflineSyncQueueService {
  private STORAGE_KEY = 'white_caves_offline_sync_queue';
  private listeners: SyncListener[] = [];
  private isSyncing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.flushQueue();
      });
    }
  }

  /**
   * Add an offline action payload to the sync queue.
   */
  enqueueAction(action: SyncQueueItem['action'], payload: Record<string, unknown>): SyncQueueItem {
    const queue = this.getPendingQueue();
    const item: SyncQueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      payload,
      timestamp: Date.now(),
      attempts: 0,
    };

    queue.push(item);
    this.saveQueue(queue);
    this.notifyListeners();
    return item;
  }

  /**
   * Retrieve all items currently pending in the sync queue.
   */
  getPendingQueue(): SyncQueueItem[] {
    if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Clear all queued actions.
   */
  clearQueue(): void {
    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem(this.STORAGE_KEY);
      this.notifyListeners();
    }
  }

  /**
   * Process all queued offline actions, auto-merging conflicts using LWW CRDT rules.
   */
  async flushQueue(): Promise<{ syncedCount: number; conflicts: ConflictResolution[] }> {
    const queue = this.getPendingQueue();
    if (queue.length === 0 || this.isSyncing) {
      return { syncedCount: 0, conflicts: [] };
    }

    this.isSyncing = true;
    this.notifyListeners();

    let syncedCount = 0;
    const conflicts: ConflictResolution[] = [];
    const remainingQueue: SyncQueueItem[] = [];

    for (const item of queue) {
      try {
        // Simulate server CRDT reconciliation
        const clientDoc = createCRDTDoc(item.payload, 'offline-client');
        const simulatedServerDoc = createCRDTDoc({ ...item.payload, serverSynced: true }, 'server-node');

        const { conflicts: itemConflicts } = mergeCRDTDocuments(clientDoc, simulatedServerDoc);
        if (itemConflicts.length > 0) {
          conflicts.push(...itemConflicts);
        }

        syncedCount++;
      } catch (err) {
        item.attempts += 1;
        if (item.attempts < 3) {
          remainingQueue.push(item);
        }
      }
    }

    this.saveQueue(remainingQueue);
    this.isSyncing = false;

    // Dispatch custom event for UI toast integration
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('offline:synced', {
          detail: { syncedCount, conflicts },
        })
      );
    }

    this.notifyListeners();
    return { syncedCount, conflicts };
  }

  /**
   * Subscribe to offline sync queue status changes.
   */
  subscribe(listener: SyncListener): () => void {
    this.listeners.push(listener);
    listener({ isSyncing: this.isSyncing, pendingCount: this.getPendingQueue().length });

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private saveQueue(queue: SyncQueueItem[]): void {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
    }
  }

  private notifyListeners(): void {
    const pendingCount = this.getPendingQueue().length;
    this.listeners.forEach((l) => l({ isSyncing: this.isSyncing, pendingCount }));
  }
}

export const offlineSyncQueue = new OfflineSyncQueueService();
export default offlineSyncQueue;
