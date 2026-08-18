/**
 * PwaOfflineCacheService.ts — Cache-First Offline Strategy Service
 * Manages IndexedDB offline queue, background sync, and cache invalidation.
 */

export interface OfflineQueueItem {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  payload?: unknown;
  timestamp: number;
  retries: number;
  maxRetries: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  tag: string;
}

export interface CacheStats {
  totalItems: number;
  pendingSync: number;
  failedItems: number;
  lastSyncAt: number | null;
  isOnline: boolean;
  cacheVersion: string;
}

const CACHE_VERSION = '1.0.0';
const QUEUE_STORAGE_KEY = 'wc_offline_queue';
const MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

class PwaOfflineCacheService {
  private queue: OfflineQueueItem[] = [];
  private isOnline: boolean = navigator.onLine;
  private listeners: Array<(stats: CacheStats) => void> = [];

  constructor() {
    this.loadQueueFromStorage();
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = (): void => {
    this.isOnline = true;
    this.notifyListeners();
    this.flushQueue();
  };

  private handleOffline = (): void => {
    this.isOnline = false;
    this.notifyListeners();
  };

  private loadQueueFromStorage(): void {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OfflineQueueItem[];
        // Purge items older than MAX_CACHE_AGE_MS
        this.queue = parsed.filter(item => Date.now() - item.timestamp < MAX_CACHE_AGE_MS);
      }
    } catch {
      this.queue = [];
    }
  }

  private saveQueueToStorage(): void {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch {
      // Storage quota exceeded — prune oldest items
      this.queue = this.queue.slice(-50);
      try {
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      } catch {
        // Silently fail — queue will persist in memory only
      }
    }
  }

  private notifyListeners(): void {
    const stats = this.getStats();
    this.listeners.forEach(fn => fn(stats));
  }

  /** Enqueue an offline request for later background sync */
  enqueue(
    endpoint: string,
    method: OfflineQueueItem['method'],
    payload?: unknown,
    tag = 'default'
  ): string {
    const id = `wc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const item: OfflineQueueItem = {
      id,
      endpoint,
      method,
      payload,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3,
      status: 'pending',
      tag,
    };
    this.queue.push(item);
    this.saveQueueToStorage();
    this.notifyListeners();
    return id;
  }

  /** Attempt to flush all pending queue items (called when back online) */
  async flushQueue(): Promise<void> {
    const pending = this.queue.filter(i => i.status === 'pending');
    for (const item of pending) {
      await this.syncItem(item);
    }
  }

  private async syncItem(item: OfflineQueueItem): Promise<void> {
    item.status = 'syncing';
    this.notifyListeners();
    try {
      const opts: RequestInit = {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (item.payload && item.method !== 'GET') {
        opts.body = JSON.stringify(item.payload);
      }
      const res = await fetch(item.endpoint, opts);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      item.status = 'completed';
    } catch {
      item.retries += 1;
      item.status = item.retries >= item.maxRetries ? 'failed' : 'pending';
    }
    this.saveQueueToStorage();
    this.notifyListeners();
  }

  /** Get current cache stats snapshot */
  getStats(): CacheStats {
    const lastSync =
      this.queue
        .filter(i => i.status === 'completed')
        .map(i => i.timestamp)
        .sort((a, b) => b - a)[0] ?? null;

    return {
      totalItems: this.queue.length,
      pendingSync: this.queue.filter(i => i.status === 'pending').length,
      failedItems: this.queue.filter(i => i.status === 'failed').length,
      lastSyncAt: lastSync,
      isOnline: this.isOnline,
      cacheVersion: CACHE_VERSION,
    };
  }

  /** Subscribe to cache stat changes */
  subscribe(fn: (stats: CacheStats) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  /** Clear all completed and failed items */
  purgeCompleted(): void {
    this.queue = this.queue.filter(i => i.status === 'pending' || i.status === 'syncing');
    this.saveQueueToStorage();
    this.notifyListeners();
  }

  /** Retry all failed items */
  retryFailed(): void {
    this.queue
      .filter(i => i.status === 'failed')
      .forEach(i => {
        i.status = 'pending';
        i.retries = 0;
      });
    this.saveQueueToStorage();
    if (this.isOnline) this.flushQueue();
  }

  destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.listeners = [];
  }
}

const pwaOfflineCacheService = new PwaOfflineCacheService();
export default pwaOfflineCacheService;
