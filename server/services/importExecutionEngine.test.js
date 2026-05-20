import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockInventoryProperty, mockOwner, mockOwnerPropertyMapping, mockImportSession } =
  vi.hoisted(() => {
    const fn = vi.fn;

    return {
      mockInventoryProperty: {
        findOne: fn(),
        findByIdAndUpdate: fn(),
        findOneAndUpdate: fn(),
      },
      mockOwner: {
        findOne: fn(),
        findOneAndUpdate: fn(),
      },
      mockOwnerPropertyMapping: {
        findOneAndUpdate: fn(),
      },
      mockImportSession: {
        findById: fn(),
      },
    };
  });

vi.mock('../models/InventoryProperty.js', () => ({ default: mockInventoryProperty }));
vi.mock('../models/Owner.js', () => ({ default: mockOwner }));
vi.mock('../models/OwnerPropertyMapping.js', () => ({ default: mockOwnerPropertyMapping }));
vi.mock('../models/ImportSession.js', () => ({ default: mockImportSession }));
vi.mock('../utils/statusAutoMapper.js', () => ({
  mapLegacyStatusToMultiDimensions: vi.fn(() => ({
    constructionStage: 'handed_over',
    occupancyStatus: 'vacant',
    marketAvailability: 'available_for_both',
    legalStatus: 'clear_title',
  })),
  extractFurnishingLevel: vi.fn(() => 'unfurnished'),
  extractLegalStatus: vi.fn(() => 'clear_title'),
}));
vi.mock('../utils/clusterAutoAssigner.js', () => ({
  assignCluster: vi.fn(() => ({ cluster: 'A', source: 'auto', confidence: 0.9 })),
}));

import { executeImport } from './importExecutionEngine.js';

function createSession() {
  return {
    status: 'processing',
    propertiesCreated: 0,
    propertiesUpdated: 0,
    ownersCreated: 0,
    ownersUpdated: 0,
    duplicatesFound: 0,
    errorsCount: 0,
    totalErrors: 0,
    importErrors: [],
    duplicates: [],
    totalRowsProcessed: 0,
    processedRows: 0,
    completedAt: null,
    save: vi.fn().mockResolvedValue(undefined),
  };
}

const columnMapping = {
  pNumber: 'pNumber',
  area: 'area',
  project: 'project',
  plotNumber: 'plotNumber',
  unitNumber: 'unitNumber',
  building: 'building',
  floor: 'floor',
  layout: 'layout',
  rooms: 'rooms',
  actualArea: 'actualArea',
  viewType: 'viewType',
  askingPrice: 'askingPrice',
  registration: 'registration',
  municipalityNo: 'municipalityNo',
  dewaPremiseNumber: 'dewaPremiseNumber',
  otpDubaiRest: 'otpDubaiRest',
  status: 'status',
  ownerName: 'ownerName',
  nationality: 'nationality',
  emiratesId: 'emiratesId',
  passportNumber: 'passportNumber',
  dateOfBirth: 'dateOfBirth',
  mobile: 'mobile',
  phone: 'phone',
  secondaryMobile: 'secondaryMobile',
  email: 'email',
};

describe('importExecutionEngine status outcomes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInventoryProperty.findOne.mockResolvedValue(null);
    mockInventoryProperty.findOneAndUpdate.mockResolvedValue({ _id: 'property-1' });
    mockOwner.findOne.mockResolvedValue(null);
    mockOwner.findOneAndUpdate.mockResolvedValue({ _id: 'owner-1' });
    mockOwnerPropertyMapping.findOneAndUpdate.mockResolvedValue({ _id: 'map-1' });
  });

  it('marks session as failed when all rows fail validation', async () => {
    const session = createSession();
    mockImportSession.findById.mockResolvedValue(session);

    const rows = [
      { pNumber: '', area: 'JVC', ownerName: '' },
      { pNumber: null, area: '', ownerName: null },
    ];

    const result = await executeImport('session-1', rows, {
      columnMapping,
      dryRun: false,
      batchSize: 100,
    });

    expect(result.errorsCount).toBeGreaterThan(0);
    expect(session.status).toBe('failed');
    expect(session.totalErrors).toBe(result.errors.length);
    expect(session.totalRowsProcessed).toBe(0);
    expect(session.successRate).toBe(0);
    expect(session.totalRows).toBe(rows.length);
  });

  it('marks session as partial when mix of success and failures', async () => {
    const session = createSession();
    mockImportSession.findById.mockResolvedValue(session);

    const rows = [
      { pNumber: 'P-100', area: 'JVC', ownerName: 'Alice', status: 'Available' },
      { pNumber: '', area: 'Marina', ownerName: '' },
    ];

    const result = await executeImport('session-2', rows, {
      columnMapping,
      dryRun: false,
      batchSize: 100,
    });

    expect(result.processedRows).toBeGreaterThan(0);
    expect(result.errorsCount).toBeGreaterThan(0);
    expect(session.status).toBe('partial');
    expect(session.totalRowsProcessed).toBe(result.processedRows);
    expect(session.successRate).toBe(50);
    expect(session.totalRows).toBe(rows.length);
  });

  it('counts overwrite duplicate as single property update', async () => {
    const session = createSession();
    mockImportSession.findById.mockResolvedValue(session);

    const duplicateProperty = {
      _id: 'property-dup-1',
      pNumber: 'P-200',
      area: 'Marina',
      plotNumber: 'Plot-9',
      toObject: () => ({ _id: 'property-dup-1', pNumber: 'P-200', area: 'Marina' }),
    };

    mockInventoryProperty.findOne.mockResolvedValue(duplicateProperty);
    mockInventoryProperty.findByIdAndUpdate.mockResolvedValue({ _id: 'property-dup-1' });

    const rows = [{ pNumber: 'P-200', area: 'Marina', ownerName: 'Bob', status: 'Available' }];

    const result = await executeImport('session-3', rows, {
      columnMapping,
      deduplicationStrategy: 'overwrite',
      dryRun: false,
      batchSize: 100,
    });

    expect(result.propertiesUpdated).toBe(1);
    expect(result.propertiesCreated).toBe(0);
    expect(result.duplicatesFound).toBe(1);
    expect(result.duplicatesResolved).toBe(1);
  });

  it('increments ownersUpdated when owner already exists', async () => {
    const session = createSession();
    mockImportSession.findById.mockResolvedValue(session);

    mockOwner.findOne.mockResolvedValue({ _id: 'owner-existing-1', name: 'Alice' });
    mockOwner.findOneAndUpdate.mockResolvedValue({ _id: 'owner-existing-1' });

    const rows = [{ pNumber: 'P-300', area: 'JVC', ownerName: 'Alice', status: 'Available' }];

    const result = await executeImport('session-4', rows, {
      columnMapping,
      dryRun: false,
      batchSize: 100,
    });

    expect(result.ownersUpdated).toBe(1);
    expect(result.ownersCreated).toBe(0);
  });
});
