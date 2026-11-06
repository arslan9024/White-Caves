// FILE: src/services/__tests__/RemoteInspectionOfflineService.test.ts
/**
 * White Caves Real Estate LLC - Remote Property Inspection Offline Service Vitest Suite
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  RemoteInspectionOfflineService,
  RemoteInspectionRecord,
} from '../RemoteInspectionOfflineService';

describe('RemoteInspectionOfflineService (Wave 15 PWA Readiness)', () => {
  let service: RemoteInspectionOfflineService;

  const mockRecord: RemoteInspectionRecord = {
    id: 'insp-dxb-001',
    propertyId: 'prop-marina-01',
    unitNumber: 'Unit 1204',
    inspectorName: 'Rashid Al-Nuaimi',
    inspectorId: 'EMP-014',
    inspectionDate: '2026-11-06',
    snags: [
      {
        id: 'snag-01',
        room: 'Master Bathroom',
        item: 'Water pressure valve',
        severity: 'minor',
        notes: 'Needs calibration',
        status: 'pending',
      },
    ],
    clientSignature: 'data:image/svg+xml;base64,mockSignaturePayload',
    syncStatus: 'cached_offline',
    lastModified: Date.now(),
  };

  beforeEach(() => {
    localStorage.clear();
    service = RemoteInspectionOfflineService.getInstance();
  });

  it('saves an inspection offline and assigns cached_offline status when offline', () => {
    vi.spyOn(service, 'isOnline').mockReturnValue(false);

    const saved = service.saveInspectionOffline(mockRecord);
    expect(saved.syncStatus).toBe('cached_offline');

    const retrieved = service.getInspection('insp-dxb-001');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.propertyId).toBe('prop-marina-01');
    expect(retrieved?.snags.length).toBe(1);

    const queue = service.getSyncQueue();
    expect(queue).toContain('insp-dxb-001');
  });

  it('saves an inspection with synced status when online', () => {
    vi.spyOn(service, 'isOnline').mockReturnValue(true);

    const saved = service.saveInspectionOffline(mockRecord);
    expect(saved.syncStatus).toBe('synced');

    const queue = service.getSyncQueue();
    expect(queue.length).toBe(0);
  });

  it('flushes pending inspections when network connectivity is restored', async () => {
    vi.spyOn(service, 'isOnline').mockReturnValue(false);
    service.saveInspectionOffline(mockRecord);

    expect(service.getSyncQueue().length).toBe(1);

    const result = await service.syncPendingInspections();
    expect(result.syncedCount).toBe(1);
    expect(result.remainingCount).toBe(0);

    const updated = service.getInspection('insp-dxb-001');
    expect(updated?.syncStatus).toBe('synced');
  });

  it('reports correct offline stats for dashboard indicators', () => {
    vi.spyOn(service, 'isOnline').mockReturnValue(false);
    service.saveInspectionOffline(mockRecord);

    const stats = service.getStats();
    expect(stats.totalCached).toBe(1);
    expect(stats.pendingSync).toBe(1);
    expect(stats.isOnline).toBe(false);
  });
});
