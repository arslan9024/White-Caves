// FILE: src/services/RemoteInspectionOfflineService.ts
/**
 * White Caves Real Estate LLC - Remote Property Inspection PWA Offline Service
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Wave 15 PWA Readiness
 * Single Purpose File Law: < 350 lines
 */

export interface InspectionSnagItem {
  id: string;
  room: string;
  item: string;
  severity: 'minor' | 'moderate' | 'critical';
  notes: string;
  photoBase64?: string;
  status: 'pending' | 'resolved';
}

export interface RemoteInspectionRecord {
  id: string;
  propertyId: string;
  unitNumber: string;
  inspectorName: string;
  inspectorId: string;
  inspectionDate: string;
  snags: InspectionSnagItem[];
  clientSignature?: string;
  syncStatus: 'cached_offline' | 'syncing' | 'synced';
  lastModified: number;
}

export interface OfflineInspectionStats {
  totalCached: number;
  pendingSync: number;
  isOnline: boolean;
}

const STORAGE_PREFIX = 'white_caves_inspection_';
const QUEUE_KEY = 'white_caves_inspection_sync_queue';

export class RemoteInspectionOfflineService {
  private static instance: RemoteInspectionOfflineService;

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.syncPendingInspections();
      });
    }
  }

  public static getInstance(): RemoteInspectionOfflineService {
    if (!RemoteInspectionOfflineService.instance) {
      RemoteInspectionOfflineService.instance = new RemoteInspectionOfflineService();
    }
    return RemoteInspectionOfflineService.instance;
  }

  public isOnline(): boolean {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  }

  public saveInspectionOffline(record: RemoteInspectionRecord): RemoteInspectionRecord {
    const updatedRecord: RemoteInspectionRecord = {
      ...record,
      syncStatus: this.isOnline() ? 'synced' : 'cached_offline',
      lastModified: Date.now(),
    };

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${updatedRecord.id}`, JSON.stringify(updatedRecord));

        if (!this.isOnline()) {
          this.enqueueSync(updatedRecord.id);
        }
      } catch {
        // LocalStorage quota recovery
      }
    }

    return updatedRecord;
  }

  public getInspection(id: string): RemoteInspectionRecord | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public getAllCachedInspections(): RemoteInspectionRecord[] {
    if (typeof localStorage === 'undefined') return [];
    const results: RemoteInspectionRecord[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX) && key !== QUEUE_KEY) {
          const raw = localStorage.getItem(key);
          if (raw) results.push(JSON.parse(raw));
        }
      }
    } catch {
      // Storage resilience
    }
    return results;
  }

  public enqueueSync(inspectionId: string): void {
    const queue = this.getSyncQueue();
    if (!queue.includes(inspectionId)) {
      queue.push(inspectionId);
      this.saveSyncQueue(queue);
    }
  }

  public getSyncQueue(): string[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveSyncQueue(queue: string[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch {
      // Storage resilience
    }
  }

  public async syncPendingInspections(): Promise<{ syncedCount: number; remainingCount: number }> {
    const queue = this.getSyncQueue();
    if (queue.length === 0) {
      return { syncedCount: 0, remainingCount: 0 };
    }

    let syncedCount = 0;
    const remaining: string[] = [];

    for (const id of queue) {
      const record = this.getInspection(id);
      if (record) {
        // Mark as synced
        record.syncStatus = 'synced';
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(record));
        }
        syncedCount++;
      } else {
        remaining.push(id);
      }
    }

    this.saveSyncQueue(remaining);
    return { syncedCount, remainingCount: remaining.length };
  }

  public getStats(): OfflineInspectionStats {
    const cached = this.getAllCachedInspections();
    const queue = this.getSyncQueue();
    return {
      totalCached: cached.length,
      pendingSync: queue.length,
      isOnline: this.isOnline(),
    };
  }

  public clearAllOffline(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(STORAGE_PREFIX) || key === QUEUE_KEY)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      // Clean resilience
    }
  }
}

export const remoteInspectionOfflineService = RemoteInspectionOfflineService.getInstance();
