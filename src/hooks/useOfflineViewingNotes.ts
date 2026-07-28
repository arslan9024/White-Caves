import { useState, useEffect, useCallback } from 'react';
import {
  createCRDTDoc,
  updateCRDTField,
  mergeCRDTDocuments,
  exportCRDTValues,
  CRDTDocument,
  ConflictResolution,
} from '../utils/offlineCRDT';

export interface ViewingNote {
  id: string;
  propertyId: string;
  clientName: string;
  noteText: string;
  rating: number;
  timestamp: number;
}

const STORAGE_KEY = 'whitecaves_offline_viewing_notes_crdt';

export function useOfflineViewingNotes(clientId: string = 'broker-client-local') {
  const [doc, setDoc] = useState<CRDTDocument>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback on parse error
    }
    return createCRDTDoc({}, clientId);
  });

  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [conflicts, setConflicts] = useState<ConflictResolution[]>([]);

  // Monitor network online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save CRDT doc to localStorage on update
  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      }
    } catch (err) {
      console.error('Failed to save offline viewing notes:', err);
    }
  }, [doc]);

  // Add or edit a viewing note offline
  const addViewingNote = useCallback(
    (note: ViewingNote) => {
      setDoc((prevDoc) => {
        return updateCRDTField(prevDoc, note.id, note, clientId, note.timestamp || Date.now());
      });
    },
    [clientId]
  );

  // Synchronize remote CRDT document with local document
  const syncWithRemoteDoc = useCallback((remoteDoc: CRDTDocument) => {
    setDoc((prevDoc) => {
      const { mergedDoc, conflicts: newConflicts } = mergeCRDTDocuments(prevDoc, remoteDoc);
      if (newConflicts.length > 0) {
        setConflicts(newConflicts);
      }
      return mergedDoc;
    });
  }, []);

  // Clear detected conflicts
  const clearConflicts = useCallback(() => {
    setConflicts([]);
  }, []);

  // Export plain viewing notes array
  const rawValues = exportCRDTValues(doc);
  const notes: ViewingNote[] = Object.values(rawValues).filter(
    (val): val is ViewingNote => typeof val === 'object' && val !== null && 'id' in val && 'noteText' in val
  );

  return {
    notes,
    doc,
    addViewingNote,
    syncWithRemoteDoc,
    conflicts,
    clearConflicts,
    isOnline,
  };
}
