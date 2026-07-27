import { describe, it, expect } from 'vitest';
import {
  createCRDTDoc,
  updateCRDTField,
  mergeCRDTDocuments,
  exportCRDTValues,
} from '../offlineCRDT';

describe('offlineCRDT Utility', () => {
  it('creates a valid CRDT document with vector timestamps', () => {
    const doc = createCRDTDoc({ title: 'DAMAC Villa', price: 4500000 }, 'client-a');

    expect(doc.title.value).toBe('DAMAC Villa');
    expect(doc.price.value).toBe(4500000);
    expect(doc.title.clientId).toBe('client-a');
  });

  it('updates CRDT field using LWW rules when timestamp is newer', () => {
    let doc = createCRDTDoc({ note: 'Initial Note' }, 'client-a');
    const earlierTime = doc.note.timestamp;
    const laterTime = earlierTime + 1000;

    doc = updateCRDTField(doc, 'note', 'Updated Note', 'client-a', laterTime);

    expect(doc.note.value).toBe('Updated Note');
    expect(doc.note.timestamp).toBe(laterTime);
  });

  it('ignores field update when timestamp is older than current', () => {
    const doc = createCRDTDoc({ note: 'Current Note' }, 'client-a');
    const currentTime = doc.note.timestamp;

    const staleDoc = updateCRDTField(doc, 'note', 'Stale Note', 'client-b', currentTime - 500);

    expect(staleDoc.note.value).toBe('Current Note');
  });

  it('merges two documents deterministically and records conflict resolution', () => {
    const baseTime = Date.now();
    const localDoc = createCRDTDoc({ status: 'pending', notes: 'Local offline note' }, 'client-local');
    localDoc.notes.timestamp = baseTime + 200;

    const remoteDoc = createCRDTDoc({ status: 'approved', notes: 'Remote server note' }, 'client-remote');
    remoteDoc.notes.timestamp = baseTime + 100;

    const { mergedDoc, conflicts } = mergeCRDTDocuments(localDoc, remoteDoc);

    const values = exportCRDTValues(mergedDoc);
    expect(values.status).toBe('approved');
    expect(values.notes).toBe('Local offline note');
    expect(conflicts.length).toBeGreaterThan(0);
  });
});
