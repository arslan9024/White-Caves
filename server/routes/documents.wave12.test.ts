import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const mockGenerateContractPdf = vi.fn();
const mockGenerateCommissionPdf = vi.fn();

vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('../middleware/errorHandler.js', () => ({
  asyncHandler:
    (fn: (req: unknown, res: unknown, next: unknown) => Promise<unknown>) =>
    async (req: unknown, res: unknown, next: unknown) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        (next as (value: unknown) => void)(err);
      }
    },
}));

vi.mock('../services/documents/documentGenerator.js', () => ({
  generateDocument: vi.fn(),
  getDocument: vi.fn(),
  listDocuments: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  updateDocumentStatus: vi.fn(),
  getAvailableDocumentTypes: vi.fn().mockReturnValue([]),
}));

vi.mock('../services/documents/documentAutoFill.js', () => ({
  autoFillVariables: vi.fn(),
  getAutoFillableEntities: vi.fn().mockReturnValue([]),
  getEntityRequirements: vi.fn(),
}));

vi.mock('../services/DocumentService.js', () => ({
  documentService: {
    generateContractPdf: (...args: unknown[]) => mockGenerateContractPdf(...args),
    generateCommissionPdf: (...args: unknown[]) => mockGenerateCommissionPdf(...args),
  },
}));

vi.mock('../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import documentsRoutes from './documents';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/documents', documentsRoutes);
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Documents Wave 12 download routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/documents/contract/:id/pdf returns PDF stream', async () => {
    mockGenerateContractPdf.mockResolvedValue({
      mimeType: 'application/pdf',
      filename: 'contract-1.pdf',
      buffer: Buffer.from('pdf-content'),
    });

    const res = await request(createApp()).get('/api/documents/contract/contract-1/pdf');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.headers['content-disposition']).toContain('contract-1.pdf');
    expect(mockGenerateContractPdf).toHaveBeenCalledWith('contract-1');
  });

  it('GET /api/documents/commission/:agentId/pdf returns PDF stream', async () => {
    mockGenerateCommissionPdf.mockResolvedValue({
      mimeType: 'application/pdf',
      filename: 'commission-agent-1.pdf',
      buffer: Buffer.from('pdf-content'),
    });

    const res = await request(createApp()).get('/api/documents/commission/agent-1/pdf');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.headers['content-disposition']).toContain('commission-agent-1.pdf');
    expect(mockGenerateCommissionPdf).toHaveBeenCalledWith('agent-1');
  });
});

