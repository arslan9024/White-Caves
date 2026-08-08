import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockReadFile } = vi.hoisted(() => ({
  mockReadFile: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  readFile: mockReadFile,
  default: {
    readFile: mockReadFile,
  },
}));

vi.mock('../../../database.js', () => ({
  prisma: {
    corporateDocument: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    corporateDocumentAlert: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    corporateDocumentAuditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../../../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { prisma } from '../../../database.js';
import {
  acknowledgeCorporateDocumentAlert,
  archiveCorporateDocument,
  createCorporateDocument,
  getCorporateDocumentById,
  importCorporateDocumentsFromRegistry,
  listCorporateDocumentAlerts,
  listCorporateDocuments,
  updateCorporateDocument,
} from '../corporateDocumentService.js';

const mockPrisma = prisma as unknown as {
  corporateDocument: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  corporateDocumentAlert: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  corporateDocumentAuditLog: {
    create: ReturnType<typeof vi.fn>;
  };
};

describe('corporateDocumentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockPrisma.corporateDocument.findMany.mockResolvedValue([]);
    mockPrisma.corporateDocument.findUnique.mockResolvedValue(null);
    mockPrisma.corporateDocument.findFirst.mockResolvedValue(null);
    mockPrisma.corporateDocument.create.mockResolvedValue({ id: 'corp-1', title: 'DET License' });
    mockPrisma.corporateDocument.update.mockResolvedValue({
      id: 'corp-1',
      title: 'DET License Updated',
      expiryDate: null,
      status: 'active',
    });

    mockPrisma.corporateDocumentAlert.findMany.mockResolvedValue([]);
    mockPrisma.corporateDocumentAlert.findFirst.mockResolvedValue(null);
    mockPrisma.corporateDocumentAlert.findUnique.mockResolvedValue(null);
    mockPrisma.corporateDocumentAlert.create.mockResolvedValue({ id: 'alert-1', status: 'open' });
    mockPrisma.corporateDocumentAlert.update.mockResolvedValue({
      id: 'alert-1',
      status: 'acknowledged',
    });

    mockPrisma.corporateDocumentAuditLog.create.mockResolvedValue({ id: 'audit-1' });

    mockReadFile.mockResolvedValue(
      JSON.stringify({
        documents: [
          {
            id: 'det_license_package',
            title: 'DET Commercial License Package',
            authority: 'Dubai Department of Economy and Tourism',
            licenseNo: '1388443',
            issueDate: '2024-07-31',
            expiryDate: '2026-07-30',
            status: 'reference-stored',
            parsedTextFile: 'company_documents/parsed_text/det_commercial_license_package.txt',
            pdfFile: 'company_documents/pdf/det_commercial_license_package.pdf',
          },
        ],
      })
    );
  });

  describe('listCorporateDocuments', () => {
    it('applies filters and default limit', async () => {
      await listCorporateDocuments({
        status: 'active',
        authority: 'RERA',
        search: 'license',
      });

      expect(mockPrisma.corporateDocument.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'active',
            authority: { contains: 'RERA', mode: 'insensitive' },
            OR: expect.any(Array),
          }),
          take: 100,
        })
      );
    });

    it('clamps limit to max 500', async () => {
      await listCorporateDocuments({ limit: 9999 });
      expect(mockPrisma.corporateDocument.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 500 })
      );
    });
  });

  describe('getCorporateDocumentById', () => {
    it('returns document with scoped alerts', async () => {
      await getCorporateDocumentById('corp-1');
      expect(mockPrisma.corporateDocument.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'corp-1' },
          include: expect.objectContaining({ alerts: expect.any(Object) }),
        })
      );
    });
  });

  describe('createCorporateDocument', () => {
    it('creates expiring alert when expiry is within warning window', async () => {
      const soon = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      mockPrisma.corporateDocument.create.mockResolvedValueOnce({
        id: 'corp-2',
        title: 'RERA Registration',
        status: 'expiring_soon',
      });

      await createCorporateDocument(
        {
          title: 'RERA Registration',
          authority: 'RERA',
          expiryDate: soon.toISOString(),
        },
        'user-1'
      );

      expect(mockPrisma.corporateDocumentAlert.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            documentId: 'corp-2',
            alertType: 'expiry_warning',
            status: 'open',
          }),
        })
      );
      expect(mockPrisma.corporateDocumentAuditLog.create).toHaveBeenCalled();
    });

    it('throws for invalid date input', async () => {
      await expect(
        createCorporateDocument({
          title: 'Invalid Date Doc',
          authority: 'DET',
          expiryDate: 'not-a-date',
        })
      ).rejects.toThrow(/invalid date/i);
    });
  });

  describe('updateCorporateDocument', () => {
    it('throws when target document does not exist', async () => {
      mockPrisma.corporateDocument.findUnique.mockResolvedValueOnce(null);
      await expect(updateCorporateDocument('missing-id', { title: 'X' })).rejects.toThrow(
        /not found/i
      );
    });

    it('updates document and writes audit log', async () => {
      mockPrisma.corporateDocument.findUnique.mockResolvedValueOnce({
        id: 'corp-1',
        title: 'Old Title',
        authority: 'DET',
        referenceNumber: null,
        licenseNumber: null,
        establishmentNumber: null,
        issueDate: null,
        expiryDate: null,
        registrationDate: null,
        startDate: null,
        endDate: null,
        parsedTextFile: null,
        pdfFile: null,
        metadata: {},
        status: 'active',
      });

      mockPrisma.corporateDocument.update.mockResolvedValueOnce({
        id: 'corp-1',
        title: 'New Title',
        status: 'active',
      });

      const updated = await updateCorporateDocument('corp-1', { title: 'New Title' }, 'user-2');

      expect(updated.title).toBe('New Title');
      expect(mockPrisma.corporateDocumentAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            documentId: 'corp-1',
            action: 'updated',
          }),
        })
      );
    });
  });

  describe('archiveCorporateDocument', () => {
    it('throws when target document does not exist', async () => {
      mockPrisma.corporateDocument.findUnique.mockResolvedValueOnce(null);

      await expect(archiveCorporateDocument('missing-id', 'owner-1')).rejects.toThrow(/not found/i);
    });

    it('archives an active document and appends immutable audit log entry', async () => {
      mockPrisma.corporateDocument.findUnique.mockResolvedValueOnce({
        id: 'corp-archive-1',
        title: 'ICP Establishment Card',
        status: 'active',
      });
      mockPrisma.corporateDocument.update.mockResolvedValueOnce({
        id: 'corp-archive-1',
        title: 'ICP Establishment Card',
        status: 'archived',
      });

      const archived = await archiveCorporateDocument('corp-archive-1', 'owner-1');

      expect(archived.status).toBe('archived');
      expect(mockPrisma.corporateDocument.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'corp-archive-1' },
          data: { status: 'archived' },
        })
      );
      expect(mockPrisma.corporateDocumentAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            documentId: 'corp-archive-1',
            action: 'archived',
            actorUserId: 'owner-1',
          }),
        })
      );
    });
  });

  describe('listCorporateDocumentAlerts', () => {
    it('returns alerts with include document and clamped limit', async () => {
      await listCorporateDocumentAlerts(1000);
      expect(mockPrisma.corporateDocumentAlert.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 500,
          include: expect.objectContaining({ document: expect.any(Object) }),
        })
      );
    });
  });

  describe('acknowledgeCorporateDocumentAlert', () => {
    it('throws when alert is missing', async () => {
      mockPrisma.corporateDocumentAlert.findUnique.mockResolvedValueOnce(null);
      await expect(acknowledgeCorporateDocumentAlert('missing-alert')).rejects.toThrow(/not found/i);
    });

    it('acknowledges alert and writes audit log', async () => {
      mockPrisma.corporateDocumentAlert.findUnique.mockResolvedValueOnce({
        id: 'alert-1',
        documentId: 'corp-1',
        alertType: 'expiry_warning',
      });

      const result = await acknowledgeCorporateDocumentAlert('alert-1', 'user-1');

      expect(result.status).toBe('acknowledged');
      expect(mockPrisma.corporateDocumentAlert.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'alert-1' },
          data: expect.objectContaining({ status: 'acknowledged' }),
        })
      );
      expect(mockPrisma.corporateDocumentAuditLog.create).toHaveBeenCalled();
    });
  });

  describe('importCorporateDocumentsFromRegistry', () => {
    it('imports new registry documents and reports created count', async () => {
      mockPrisma.corporateDocument.findFirst.mockResolvedValueOnce(null);
      mockPrisma.corporateDocument.create.mockResolvedValueOnce({
        id: 'corp-created-1',
        title: 'DET Commercial License Package',
      });

      const result = await importCorporateDocumentsFromRegistry({ actorUserId: 'admin-1' });

      expect(result.total).toBe(1);
      expect(result.created).toBe(1);
      expect(result.updated).toBe(0);
      expect(mockPrisma.corporateDocument.create).toHaveBeenCalled();
      expect(mockPrisma.corporateDocumentAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'imported',
          }),
        })
      );
    });

    it('updates existing registry documents (idempotent path)', async () => {
      mockPrisma.corporateDocument.findFirst.mockResolvedValueOnce({
        id: 'corp-existing-1',
        registryDocumentId: 'det_license_package',
      });
      mockPrisma.corporateDocument.update.mockResolvedValueOnce({
        id: 'corp-existing-1',
        title: 'DET Commercial License Package',
      });

      const result = await importCorporateDocumentsFromRegistry({ actorUserId: 'admin-2' });

      expect(result.total).toBe(1);
      expect(result.created).toBe(0);
      expect(result.updated).toBe(1);
      expect(mockPrisma.corporateDocument.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'corp-existing-1' } })
      );
      expect(mockPrisma.corporateDocument.create).not.toHaveBeenCalled();
    });

    it('resolves custom relative file path under workspace', async () => {
      mockPrisma.corporateDocument.findFirst.mockResolvedValueOnce(null);
      mockPrisma.corporateDocument.create.mockResolvedValueOnce({ id: 'corp-xyz' });

      await importCorporateDocumentsFromRegistry({
        filePath: 'docs/company_documents/normalized/company_documents_registry.json',
      });

      expect(mockReadFile).toHaveBeenCalledWith(
        expect.stringContaining('docs\\company_documents\\normalized\\company_documents_registry.json'),
        'utf8'
      );
    });
  });
});
