import { describe, it, expect, beforeEach, vi } from 'vitest';

// Install a full localStorage mock at the global level BEFORE importing the service
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
    _reset: () => { store = {}; },
  };
})();

vi.stubGlobal('localStorage', storageMock);

// Now import — the singleton will see our mock
import { offlineSyncQueue } from '../offlineSyncQueue';

describe('offlineSyncQueue Service', () => {
  beforeEach(() => {
    storageMock._reset();
    offlineSyncQueue.clearQueue();
  });

  it('enqueues offline actions into queue state', () => {
    offlineSyncQueue.enqueueAction('CREATE_NOTE', { text: 'Desert viewing note' });

    const queue = offlineSyncQueue.getPendingQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].action).toBe('CREATE_NOTE');
    expect(queue[0].payload.text).toBe('Desert viewing note');
  });

  it('flushes pending queue items and reports synced count', async () => {
    offlineSyncQueue.enqueueAction('UPDATE_LEAD', { leadId: '101', status: 'contacted' });
    offlineSyncQueue.enqueueAction('UPDATE_PROPERTY_STATUS', { propertyId: 'p-20', status: 'reserved' });

    const result = await offlineSyncQueue.flushQueue();

    expect(result.syncedCount).toBe(2);
    expect(offlineSyncQueue.getPendingQueue().length).toBe(0);
  });

  it('notifies status listeners during queue changes', () => {
    const listener = vi.fn();
    const unsubscribe = offlineSyncQueue.subscribe(listener);

    offlineSyncQueue.enqueueAction('CREATE_NOTE', { text: 'Test' });

    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });
});
