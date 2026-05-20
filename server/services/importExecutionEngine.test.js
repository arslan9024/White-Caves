import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockInventoryProperty, mockOwner, mockOwnerPropertyMapping, mockImportSession } =
  vi.hoisted(() => {
    const fn = vi.fn;

    return {
      mockInventoryProperty: {
        findOne: fn(),
        findByIdAndUpdate: fn(),
        findOneAndUpdate: fn(),
        create: fn(),
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

import { executeImport, prepareOwnerData, preparePropertyData } from './importExecutionEngine.js';

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
    mockInventoryProperty.create.mockResolvedValue({ _id: 'property-created-1' });
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

  it('creates a new property record for version deduplication', async () => {
    const session = createSession();
    mockImportSession.findById.mockResolvedValue(session);

    const duplicateProperty = {
      _id: 'property-dup-version-1',
      pNumber: 'P-400',
      area: 'Business Bay',
      plotNumber: 'Plot-12',
      toObject: () => ({ _id: 'property-dup-version-1' }),
    };

    mockInventoryProperty.findOne.mockResolvedValue(duplicateProperty);
    mockInventoryProperty.create.mockResolvedValue({ _id: 'property-version-2' });

    const rows = [
      { pNumber: 'P-400', area: 'Business Bay', ownerName: 'Nora', status: 'Available' },
    ];

    const result = await executeImport('session-5', rows, {
      columnMapping,
      deduplicationStrategy: 'version',
      dryRun: false,
      batchSize: 100,
    });

    expect(mockInventoryProperty.create).toHaveBeenCalledTimes(1);
    expect(mockInventoryProperty.create).toHaveBeenCalledWith(
      expect.objectContaining({
        versionMetadata: expect.objectContaining({
          previousId: 'property-dup-version-1',
          versionNumber: 1,
        }),
      })
    );
    expect(mockInventoryProperty.findOneAndUpdate).not.toHaveBeenCalled();
    expect(result.propertiesCreated).toBe(1);
    expect(result.propertiesUpdated).toBe(0);
    expect(result.duplicatesFound).toBe(1);
    expect(result.duplicatesResolved).toBe(1);
  });

  it('falls back to default batch size when batchSize is invalid', async () => {
    const session = createSession();
    mockImportSession.findById.mockResolvedValue(session);

    const rows = [
      { pNumber: 'P-501', area: 'JVC', ownerName: 'Ali', status: 'Available' },
      { pNumber: 'P-502', area: 'Marina', ownerName: 'Basma', status: 'Available' },
    ];

    const result = await executeImport('session-6', rows, {
      columnMapping,
      dryRun: false,
      batchSize: 0,
    });

    expect(result.processedRows).toBe(2);
    expect(result.errorsCount).toBe(0);
  });

  it('falls back to keep strategy when deduplication strategy is unknown', async () => {
    const session = createSession();
    mockImportSession.findById.mockResolvedValue(session);

    const duplicateProperty = {
      _id: 'property-dup-fallback-1',
      pNumber: 'P-601',
      area: 'Downtown',
      plotNumber: 'Plot-66',
      toObject: () => ({ _id: 'property-dup-fallback-1' }),
    };

    mockInventoryProperty.findOne.mockResolvedValue(duplicateProperty);

    const rows = [{ pNumber: 'P-601', area: 'Downtown', ownerName: 'Dana', status: 'Available' }];

    const result = await executeImport('session-7', rows, {
      columnMapping,
      deduplicationStrategy: 'unexpected-mode',
      dryRun: false,
      batchSize: 100,
    });

    expect(result.skipped).toBe(1);
    expect(result.duplicatesFound).toBe(1);
    expect(result.processedRows).toBe(0);
    expect(result.propertiesCreated).toBe(0);
    expect(result.propertiesUpdated).toBe(0);
  });

  it('fails gracefully when rows payload is not an array', async () => {
    const session = createSession();
    mockImportSession.findById.mockResolvedValue(session);

    const result = await executeImport('session-8', null, {
      columnMapping,
      dryRun: false,
      batchSize: 100,
    });

    expect(result.totalRows).toBe(0);
    expect(result.errorsCount).toBe(1);
    expect(result.errors[0].error).toContain('Invalid rows payload');
    expect(session.status).toBe('failed');
    expect(session.totalRows).toBe(0);
    expect(session.totalRowsProcessed).toBe(0);
  });

  it('treats placeholder dot required fields as invalid and skips row', async () => {
    const session = createSession();
    mockImportSession.findById.mockResolvedValue(session);

    const rows = [{ pNumber: '.', area: '.', ownerName: '.', status: 'Available' }];

    const result = await executeImport('session-9', rows, {
      columnMapping,
      dryRun: false,
      batchSize: 100,
    });

    expect(result.processedRows).toBe(0);
    expect(result.errorsCount).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.errors[0].error).toContain('Missing required fields');
  });

  it('normalizes invalid owner dateOfBirth to null', () => {
    const ownerData = prepareOwnerData(
      {
        ownerName: 'Nora',
        dateOfBirth: 'not-a-date',
        mobile: '+971501234567',
      },
      columnMapping
    );

    expect(ownerData.name).toBe('Nora');
    expect(ownerData.dateOfBirth).toBeNull();
  });

  it('returns error stats when import session cannot be found', async () => {
    mockImportSession.findById.mockResolvedValue(null);

    const result = await executeImport(
      'missing-session',
      [{ pNumber: 'P-700', area: 'JVC', ownerName: 'Nora' }],
      {
        columnMapping,
        dryRun: false,
        batchSize: 100,
      }
    );

    expect(result.processedRows).toBe(0);
    expect(result.errorsCount).toBe(0);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          error: 'Import session not found',
          sessionId: 'missing-session',
        }),
      ])
    );
  });

  it('normalizes owner contacts by deduplicating phone values and lowercasing email', () => {
    const ownerData = prepareOwnerData(
      {
        ownerName: 'Leena',
        mobile: '+971 50 123 4567',
        phone: '+971501234567',
        secondaryMobile: '+971 50 123 4567',
        email: 'LEENA@EXAMPLE.COM',
      },
      columnMapping
    );

    expect(ownerData.contacts).toEqual([
      expect.objectContaining({ type: 'mobile', value: '+971501234567', isPrimary: true }),
      expect.objectContaining({ type: 'email', value: 'leena@example.com' }),
    ]);
  });

  it('normalizes placeholder legal fields to null in prepared property data', () => {
    const propertyData = preparePropertyData(
      {
        pNumber: 'P-880',
        area: 'Marina',
        registration: '.',
        municipalityNo: '.',
        dewaPremiseNumber: '.',
        otpDubaiRest: '.',
        status: 'Available',
      },
      columnMapping,
      {},
      {}
    );

    expect(propertyData.registration).toBeNull();
    expect(propertyData.municipalityNo).toBeNull();
    expect(propertyData.dewaPremiseNumber).toBeNull();
    expect(propertyData.otpDubaiRest).toBeNull();
  });
});
