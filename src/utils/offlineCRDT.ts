export interface CRDTElement<T = unknown> {
  value: T;
  timestamp: number;
  clientId: string;
}

export type CRDTDocument = Record<string, CRDTElement>;

export interface ConflictResolution<T = unknown> {
  key: string;
  localValue: T;
  remoteValue: T;
  winningValue: T;
  winningClient: string;
  timestamp: number;
}

export interface MergeResult {
  mergedDoc: CRDTDocument;
  conflicts: ConflictResolution[];
}

/**
 * Creates an initial CRDT document wrapping plain object key-values.
 */
export function createCRDTDoc(initialData: Record<string, unknown>, clientId: string): CRDTDocument {
  const doc: CRDTDocument = {};
  const now = Date.now();

  Object.entries(initialData).forEach(([key, val]) => {
    doc[key] = {
      value: val,
      timestamp: now,
      clientId,
    };
  });

  return doc;
}

/**
 * Updates or sets a single field in a CRDT document using Last-Write-Wins (LWW) semantics.
 */
export function updateCRDTField<T = unknown>(
  doc: CRDTDocument,
  key: string,
  value: T,
  clientId: string,
  timestamp: number = Date.now()
): CRDTDocument {
  const current = doc[key];

  if (!current || timestamp > current.timestamp || (timestamp === current.timestamp && clientId > current.clientId)) {
    return {
      ...doc,
      [key]: {
        value,
        timestamp,
        clientId,
      },
    };
  }

  return doc;
}

/**
 * Merges two CRDT documents deterministically using vector timestamps (LWW).
 */
export function mergeCRDTDocuments(localDoc: CRDTDocument, remoteDoc: CRDTDocument): MergeResult {
  const mergedDoc: CRDTDocument = { ...localDoc };
  const conflicts: ConflictResolution[] = [];

  Object.entries(remoteDoc).forEach(([key, remoteElem]) => {
    const localElem = mergedDoc[key];

    if (!localElem) {
      mergedDoc[key] = remoteElem;
    } else {
      // Determine winner: higher timestamp wins. If equal, lexicographical client ID tie-breaker.
      const remoteWins =
        remoteElem.timestamp > localElem.timestamp ||
        (remoteElem.timestamp === localElem.timestamp && remoteElem.clientId > localElem.clientId);

      if (localElem.value !== remoteElem.value) {
        conflicts.push({
          key,
          localValue: localElem.value,
          remoteValue: remoteElem.value,
          winningValue: remoteWins ? remoteElem.value : localElem.value,
          winningClient: remoteWins ? remoteElem.clientId : localElem.clientId,
          timestamp: Math.max(localElem.timestamp, remoteElem.timestamp),
        });
      }

      if (remoteWins) {
        mergedDoc[key] = remoteElem;
      }
    }
  });

  return { mergedDoc, conflicts };
}

/**
 * Extracts plain key-value pairs from a CRDT document.
 */
export function exportCRDTValues(doc: CRDTDocument): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  Object.entries(doc).forEach(([key, elem]) => {
    result[key] = elem.value;
  });
  return result;
}
