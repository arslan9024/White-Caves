import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useOfflineViewingNotes, ViewingNote } from '../useOfflineViewingNotes';
import { createCRDTDoc } from '../../utils/offlineCRDT';

describe('useOfflineViewingNotes Hook', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined' && typeof localStorage.clear === 'function') {
      localStorage.clear();
    }
    vi.restoreAllMocks();
  });

  it('initializes with empty notes and online status', () => {
    const { result } = renderHook(() => useOfflineViewingNotes('broker-001'));

    expect(result.current.notes).toEqual([]);
    expect(result.current.conflicts).toEqual([]);
    expect(result.current.isOnline).toBe(true);
  });

  it('allows adding viewing notes offline and persists to CRDT doc', () => {
    const { result } = renderHook(() => useOfflineViewingNotes('broker-001'));

    const testNote: ViewingNote = {
      id: 'note-001',
      propertyId: 'prop-100',
      clientName: 'Sheikh Al Maktoum',
      noteText: 'High interest in DAMAC Hills 2 villa',
      rating: 5,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.addViewingNote(testNote);
    });

    expect(result.current.notes.length).toBe(1);
    expect(result.current.notes[0].clientName).toBe('Sheikh Al Maktoum');
  });

  it('merges remote CRDT document and records conflict resolutions', () => {
    const { result } = renderHook(() => useOfflineViewingNotes('broker-local'));

    const localNote: ViewingNote = {
      id: 'note-002',
      propertyId: 'prop-001',
      clientName: 'Local Client',
      noteText: 'Local draft note',
      rating: 4,
      timestamp: 1000,
    };

    act(() => {
      result.current.addViewingNote(localNote);
    });

    const remoteNote: ViewingNote = {
      id: 'note-002',
      propertyId: 'prop-001',
      clientName: 'Remote Client',
      noteText: 'Remote server note',
      rating: 5,
      timestamp: 2000,
    };

    const remoteDoc = createCRDTDoc({}, 'broker-remote');
    remoteDoc['note-002'] = {
      value: remoteNote,
      timestamp: 2000,
      clientId: 'broker-remote',
    };

    act(() => {
      result.current.syncWithRemoteDoc(remoteDoc);
    });

    expect(result.current.notes[0].noteText).toBe('Remote server note');
    expect(result.current.conflicts.length).toBe(1);
  });

  it('allows clearing detected conflicts', () => {
    const { result } = renderHook(() => useOfflineViewingNotes('broker-local'));

    const remoteDoc = createCRDTDoc({}, 'broker-remote');
    remoteDoc['note-003'] = {
      value: { id: 'note-003', noteText: 'Remote Note', timestamp: 100 },
      timestamp: 100,
      clientId: 'broker-remote',
    };

    act(() => {
      result.current.syncWithRemoteDoc(remoteDoc);
    });

    act(() => {
      result.current.clearConflicts();
    });

    expect(result.current.conflicts).toEqual([]);
  });
});
