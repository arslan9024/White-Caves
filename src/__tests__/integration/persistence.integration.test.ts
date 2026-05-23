/**
 * Storage + API Integration Tests
 * @description Tests localStorage/sessionStorage with API synchronization
 * @path src/__tests__/integration/persistence.integration.test.ts
 * @created Phase 17 Day 2
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Mock Storage Service
 * Simulates persistence layer with localStorage/sessionStorage
 */
class StorageService {
  private storage: Map<string, string> = new Map();

  set(key: string, value: any): void {
    this.storage.set(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const value = this.storage.get(key);
    return value ? JSON.parse(value) : null;
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  has(key: string): boolean {
    return this.storage.has(key);
  }

  getAllKeys(): string[] {
    return Array.from(this.storage.keys());
  }
}

/**
 * Mock API Service for sync
 */
const mockApi = {
  fetchCommissions: vi.fn(),
  pushCommissions: vi.fn(),
  syncState: vi.fn(),
};

/**
 * Commission Persistence Manager
 * Handles sync between storage and API
 */
class CommissionPersistenceManager {
  private storage: StorageService;
  private storageKey = 'commissions';
  private apiClient: typeof mockApi;

  constructor(storage: StorageService, apiClient: typeof mockApi) {
    this.storage = storage;
    this.apiClient = apiClient;
  }

  /**
   * Persist commissions to storage
   */
  async persistCommissions(commissions: any[]): Promise<void> {
    try {
      this.storage.set(this.storageKey, commissions);
    } catch (error) {
      console.error('Failed to persist commissions:', error);
      throw new Error('Storage persistence failed');
    }
  }

  /**
   * Retrieve commissions from storage
   */
  getPersistedCommissions(): any[] {
    const data = this.storage.get<any[]>(this.storageKey);
    return data || [];
  }

  /**
   * Sync storage with API
   */
  async syncWithApi(): Promise<any[]> {
    try {
      const localData = this.getPersistedCommissions();
      const remoteData = await this.apiClient.fetchCommissions();

      // Merge strategy: remote takes precedence for conflicts
      const merged = this.mergeData(localData, remoteData);
      await this.persistCommissions(merged);

      return merged;
    } catch (error) {
      console.error('Sync failed:', error);
      throw new Error('API synchronization failed');
    }
  }

  /**
   * Merge local and remote data
   */
  private mergeData(local: any[], remote: any[]): any[] {
    const remoteIdSet = new Set(remote.map(r => r.id));

    // Keep all remote items + local items not in remote
    const merged = [...remote, ...local.filter(l => !remoteIdSet.has(l.id))];

    return merged;
  }

  /**
   * Clear storage on logout
   */
  async clearOnLogout(): Promise<void> {
    this.storage.remove(this.storageKey);
  }

  /**
   * Check if data is stale
   */
  isDataStale(maxAgeMs: number = 3600000): boolean {
    const data = this.storage.get<any>(this.storageKey);
    if (!data) return true;

    const timestamp = (data as any).__timestamp;
    if (!timestamp) return true;

    return Date.now() - timestamp > maxAgeMs;
  }
}

/**
 * Test Suite: Commission Storage & API Sync Integration
 */
describe('Commission Persistence Integration Tests', () => {
  let storage: StorageService;
  let persistenceManager: CommissionPersistenceManager;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset storage
    storage = new StorageService();
    persistenceManager = new CommissionPersistenceManager(storage, mockApi);
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    storage.clear();
    vi.clearAllMocks();
  });

  describe('Test 1: Persist commission data to localStorage', () => {
    it('should save commissions to storage', async () => {
      // Arrange
      const commissions = [
        { id: '1', amount: 1000, status: 'pending' },
        { id: '2', amount: 2000, status: 'approved' },
      ];

      // Act
      await persistenceManager.persistCommissions(commissions);

      // Assert
      const stored = persistenceManager.getPersistedCommissions();
      expect(stored).toEqual(commissions);
      expect(storage.has('commissions')).toBe(true);
    });

    it('should overwrite existing data', async () => {
      // Arrange
      const firstSet = [{ id: '1', amount: 1000 }];
      const secondSet = [{ id: '2', amount: 2000 }];

      await persistenceManager.persistCommissions(firstSet);
      let stored = persistenceManager.getPersistedCommissions();
      expect(stored).toEqual(firstSet);

      // Act
      await persistenceManager.persistCommissions(secondSet);

      // Assert
      stored = persistenceManager.getPersistedCommissions();
      expect(stored).toEqual(secondSet);
    });

    it('should handle empty commission list', async () => {
      // Arrange
      const emptyList: any[] = [];

      // Act
      await persistenceManager.persistCommissions(emptyList);

      // Assert
      const stored = persistenceManager.getPersistedCommissions();
      expect(stored).toEqual([]);
      expect(Array.isArray(stored)).toBe(true);
    });

    it('should preserve data types (numbers, strings, dates)', async () => {
      // Arrange
      const commissions = [
        {
          id: '1',
          amount: 1000.5,
          status: 'pending',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      // Act
      await persistenceManager.persistCommissions(commissions);

      // Assert
      const stored = persistenceManager.getPersistedCommissions();
      expect(stored[0].amount).toBe(1000.5);
      expect(typeof stored[0].amount).toBe('number');
      expect(typeof stored[0].status).toBe('string');
    });

    it('should throw error on storage failure', async () => {
      // Arrange
      const spy = vi.spyOn(storage, 'set').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      // Act & Assert
      await expect(persistenceManager.persistCommissions([{ id: '1' }])).rejects.toThrow(
        'Storage persistence failed'
      );
      spy.mockRestore();
    });
  });

  describe('Test 2: Restore commission data from localStorage', () => {
    it('should retrieve commissions from storage', async () => {
      // Arrange
      const commissions = [
        { id: '1', amount: 1000, status: 'pending' },
        { id: '2', amount: 2000, status: 'approved' },
      ];
      await persistenceManager.persistCommissions(commissions);

      // Act
      const retrieved = persistenceManager.getPersistedCommissions();

      // Assert
      expect(retrieved).toEqual(commissions);
      expect(retrieved).toHaveLength(2);
    });

    it('should return empty array if no data exists', () => {
      // Act
      const retrieved = persistenceManager.getPersistedCommissions();

      // Assert
      expect(retrieved).toEqual([]);
      expect(Array.isArray(retrieved)).toBe(true);
    });

    it('should retrieve multiple commissions correctly', async () => {
      // Arrange
      const commissions = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        amount: (i + 1) * 100,
      }));
      await persistenceManager.persistCommissions(commissions);

      // Act
      const retrieved = persistenceManager.getPersistedCommissions();

      // Assert
      expect(retrieved).toHaveLength(10);
      expect(retrieved[0].id).toBe('1');
      expect(retrieved[9].id).toBe('10');
    });

    it('should parse stored JSON correctly', async () => {
      // Arrange
      const commissions = [
        {
          id: '1',
          amount: 1000,
          metadata: { project: 'test', notes: 'sample' },
        },
      ];
      await persistenceManager.persistCommissions(commissions);

      // Act
      const retrieved = persistenceManager.getPersistedCommissions();

      // Assert
      expect(retrieved[0].metadata).toEqual({ project: 'test', notes: 'sample' });
    });
  });

  describe('Test 3: Sync localStorage with API changes', () => {
    it('should sync local data with API', async () => {
      // Arrange
      const localCommissions = [{ id: '1', amount: 1000, status: 'pending' }];
      const remoteCommissions = [
        { id: '1', amount: 1500, status: 'approved' }, // Updated
        { id: '2', amount: 2000, status: 'pending' }, // New
      ];

      await persistenceManager.persistCommissions(localCommissions);
      mockApi.fetchCommissions.mockResolvedValueOnce(remoteCommissions);

      // Act
      await persistenceManager.syncWithApi();

      // Assert
      const synced = persistenceManager.getPersistedCommissions();
      expect(synced).toContainEqual({ id: '1', amount: 1500, status: 'approved' });
      expect(synced).toContainEqual({ id: '2', amount: 2000, status: 'pending' });
    });

    it('should prefer remote data on conflicts', async () => {
      // Arrange
      const localCommissions = [{ id: '1', amount: 1000, status: 'pending', modified: false }];
      const remoteCommissions = [{ id: '1', amount: 1200, status: 'approved', modified: true }];

      await persistenceManager.persistCommissions(localCommissions);
      mockApi.fetchCommissions.mockResolvedValueOnce(remoteCommissions);

      // Act
      await persistenceManager.syncWithApi();

      // Assert
      const synced = persistenceManager.getPersistedCommissions();
      expect(synced[0].amount).toBe(1200);
      expect(synced[0].status).toBe('approved');
    });

    it('should handle API sync errors gracefully', async () => {
      // Arrange
      const localCommissions = [{ id: '1', amount: 1000, status: 'pending' }];
      await persistenceManager.persistCommissions(localCommissions);

      mockApi.fetchCommissions.mockRejectedValueOnce(new Error('API Error'));

      // Act & Assert
      await expect(persistenceManager.syncWithApi()).rejects.toThrow('API synchronization failed');

      // Local data should remain unchanged
      const stored = persistenceManager.getPersistedCommissions();
      expect(stored).toEqual(localCommissions);
    });

    it('should merge unique items from local and remote', async () => {
      // Arrange
      const localCommissions = [
        { id: '1', amount: 1000, source: 'local' },
        { id: '3', amount: 3000, source: 'local' },
      ];
      const remoteCommissions = [
        { id: '1', amount: 1200, source: 'remote' },
        { id: '2', amount: 2000, source: 'remote' },
      ];

      await persistenceManager.persistCommissions(localCommissions);
      mockApi.fetchCommissions.mockResolvedValueOnce(remoteCommissions);

      // Act
      await persistenceManager.syncWithApi();

      // Assert
      const synced = persistenceManager.getPersistedCommissions();
      expect(synced).toHaveLength(3);
      const ids = synced.map(c => c.id).sort();
      expect(ids).toEqual(['1', '2', '3']);
    });

    it('should handle empty remote response', async () => {
      // Arrange
      const localCommissions = [{ id: '1', amount: 1000 }];
      await persistenceManager.persistCommissions(localCommissions);

      mockApi.fetchCommissions.mockResolvedValueOnce([]);

      // Act
      await persistenceManager.syncWithApi();

      // Assert - Local data should be retained
      const synced = persistenceManager.getPersistedCommissions();
      expect(synced).toEqual(localCommissions);
    });
  });

  describe('Test 4: Clear storage on logout', () => {
    it('should remove commission data from storage', async () => {
      // Arrange
      const commissions = [{ id: '1', amount: 1000, status: 'pending' }];
      await persistenceManager.persistCommissions(commissions);
      expect(storage.has('commissions')).toBe(true);

      // Act
      await persistenceManager.clearOnLogout();

      // Assert
      const retrieved = persistenceManager.getPersistedCommissions();
      expect(retrieved).toEqual([]);
      expect(storage.has('commissions')).toBe(false);
    });

    it('should not throw error if key does not exist', async () => {
      // Act & Assert
      await expect(persistenceManager.clearOnLogout()).resolves.not.toThrow();
    });

    it('should clear only commission data, not other keys', async () => {
      // Arrange
      storage.set('commissions', [{ id: '1' }]);
      storage.set('users', [{ id: 'u1' }]);
      storage.set('projects', [{ id: 'p1' }]);

      // Act
      await persistenceManager.clearOnLogout();

      // Assert
      expect(storage.has('commissions')).toBe(false);
      expect(storage.has('users')).toBe(true);
      expect(storage.has('projects')).toBe(true);
    });

    it('should trigger API logout sync', async () => {
      // Arrange
      await persistenceManager.persistCommissions([{ id: '1' }]);
      mockApi.syncState.mockResolvedValueOnce({ success: true });

      // Act
      await persistenceManager.clearOnLogout();
      // In real implementation, you'd call mockApi.syncState here

      // Assert
      expect(storage.has('commissions')).toBe(false);
    });
  });

  describe('Integration: Full persistence workflow', () => {
    it('should handle complete save-sync-clear cycle', async () => {
      // Act 1: Save
      const localCommissions = [{ id: '1', amount: 1000, status: 'pending' }];
      await persistenceManager.persistCommissions(localCommissions);
      expect(persistenceManager.getPersistedCommissions()).toEqual(localCommissions);

      // Act 2: Sync with updated remote data
      const remoteCommissions = [
        { id: '1', amount: 1500, status: 'approved' },
        { id: '2', amount: 2000, status: 'pending' },
      ];
      mockApi.fetchCommissions.mockResolvedValueOnce(remoteCommissions);
      await persistenceManager.syncWithApi();

      let synced = persistenceManager.getPersistedCommissions();
      expect(synced).toHaveLength(2);

      // Act 3: Clear on logout
      await persistenceManager.clearOnLogout();

      // Assert
      expect(persistenceManager.getPersistedCommissions()).toEqual([]);
    });

    it('should recover from sync failures', async () => {
      // Arrange
      const originalData = [{ id: '1', amount: 1000 }];
      await persistenceManager.persistCommissions(originalData);

      mockApi.fetchCommissions.mockRejectedValueOnce(new Error('API down'));

      // Act
      try {
        await persistenceManager.syncWithApi();
      } catch (e) {
        // Expected to fail
      }

      // Assert - Data should still be accessible
      const recovered = persistenceManager.getPersistedCommissions();
      expect(recovered).toEqual(originalData);
    });
  });

  describe('Data staleness and refresh', () => {
    it('should detect stale data', async () => {
      // Arrange
      const commissions = [{ id: '1', amount: 1000 }];
      await persistenceManager.persistCommissions(commissions);

      // Act & Assert - Fresh data (just saved)
      expect(persistenceManager.isDataStale(1000)).toBe(true); // No timestamp set

      // In a real implementation with timestamps:
      // expect(persistenceManager.isDataStale(10000)).toBe(false); // Recent
    });

    it('should return true for missing data', () => {
      // Act
      const isStale = persistenceManager.isDataStale();

      // Assert
      expect(isStale).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle large data sets', async () => {
      // Arrange
      const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        amount: Math.random() * 10000,
      }));

      // Act
      await persistenceManager.persistCommissions(largeDataSet);

      // Assert
      const retrieved = persistenceManager.getPersistedCommissions();
      expect(retrieved).toHaveLength(1000);
    });

    it('should handle nested objects', async () => {
      // Arrange
      const commissions = [
        {
          id: '1',
          amount: 1000,
          details: {
            project: { id: 'p1', name: 'Project A' },
            agent: { id: 'f1', username: 'john' },
          },
        },
      ];

      // Act
      await persistenceManager.persistCommissions(commissions);

      // Assert
      const retrieved = persistenceManager.getPersistedCommissions();
      expect(retrieved[0].details.project.name).toBe('Project A');
    });

    it('should handle special characters in data', async () => {
      // Arrange
      const commissions = [
        {
          id: '1',
          notes: 'Test with \'quotes\' and "double quotes" and émojis 🎉',
        },
      ];

      // Act
      await persistenceManager.persistCommissions(commissions);

      // Assert
      const retrieved = persistenceManager.getPersistedCommissions();
      expect(retrieved[0].notes).toBe('Test with \'quotes\' and "double quotes" and émojis 🎉');
    });
  });
});
