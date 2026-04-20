/**
 * useDocuments — Unit tests
 * Pattern: Mock dispatch → verify thunk dispatch + state management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocuments } from '../useDocuments';

const mockDispatch = vi.fn();
const mockUnwrap = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/crmDataSlice', async () => {
  const actual = await vi.importActual('../../../store/crmDataSlice');
  return {
    ...actual,
    generateDocumentAPI: vi.fn((data) => ({ type: 'mock/generateDocument', payload: data })),
    fetchDocumentsAPI: vi.fn((filters) => ({ type: 'mock/fetchDocuments', payload: filters })),
    fetchDocumentTypesAPI: vi.fn(() => ({ type: 'mock/fetchDocumentTypes' })),
  };
});

describe('useDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUnwrap.mockResolvedValue({});
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });
  });

  describe('initial state', () => {
    it('starts with empty documents', () => {
      const { result } = renderHook(() => useDocuments());
      expect(result.current.documents).toEqual([]);
      expect(result.current.documentTypes).toEqual([]);
      expect(result.current.currentDocument).toBeNull();
    });

    it('starts with no loading or error', () => {
      const { result } = renderHook(() => useDocuments());
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('generateDocument', () => {
    it('dispatches generateDocumentAPI', async () => {
      const mockDoc = {
        id: 'doc-1',
        type: 'mou',
        title: 'Memorandum of Understanding v1',
        version: 1,
        status: 'draft',
        htmlContent: '<html>...</html>',
        metadata: {},
        createdAt: '2026-01-01',
      };
      mockUnwrap.mockResolvedValueOnce(mockDoc);

      const { result } = renderHook(() => useDocuments());

      await act(async () => {
        await result.current.generateDocument({
          type: 'mou',
          variables: { buyerName: 'John', sellerName: 'Jane' },
          leadId: 'lead-1',
        });
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/generateDocument',
          payload: expect.objectContaining({ type: 'mou', leadId: 'lead-1' }),
        }),
      );
      expect(result.current.currentDocument).toEqual(mockDoc);
    });

    it('sets error on failure', async () => {
      mockUnwrap.mockRejectedValueOnce('Generation failed');
      const { result } = renderHook(() => useDocuments());

      await act(async () => {
        await result.current.generateDocument({
          type: 'mou',
          variables: { buyerName: 'John' },
        });
      });

      expect(result.current.error).toBe('Generation failed');
    });
  });

  describe('fetchDocuments', () => {
    it('dispatches fetchDocumentsAPI and sets documents', async () => {
      const mockDocs = {
        data: [
          { id: 'd1', type: 'mou', title: 'MoU v1', version: 1, status: 'draft', htmlContent: '', metadata: null, createdAt: '2026-01-01' },
          { id: 'd2', type: 'noc', title: 'NOC v1', version: 1, status: 'final', htmlContent: '', metadata: null, createdAt: '2026-01-02' },
        ],
        total: 2,
      };
      mockUnwrap.mockResolvedValueOnce(mockDocs);

      const { result } = renderHook(() => useDocuments());

      await act(async () => {
        await result.current.fetchDocuments({ type: 'mou' });
      });

      expect(result.current.documents).toHaveLength(2);
      expect(result.current.total).toBe(2);
    });
  });

  describe('fetchTypes', () => {
    it('dispatches fetchDocumentTypesAPI and sets types', async () => {
      const mockTypes = [
        { type: 'mou', label: 'Memorandum of Understanding' },
        { type: 'noc', label: 'No Objection Certificate' },
      ];
      mockUnwrap.mockResolvedValueOnce(mockTypes);

      const { result } = renderHook(() => useDocuments());

      await act(async () => {
        await result.current.fetchTypes();
      });

      expect(result.current.documentTypes).toHaveLength(2);
      expect(result.current.documentTypes[0].type).toBe('mou');
    });
  });

  describe('handler exposure', () => {
    it('exposes all expected functions', () => {
      const { result } = renderHook(() => useDocuments());
      expect(typeof result.current.generateDocument).toBe('function');
      expect(typeof result.current.fetchDocuments).toBe('function');
      expect(typeof result.current.fetchTypes).toBe('function');
    });

    it('exposes all expected data properties', () => {
      const { result } = renderHook(() => useDocuments());
      expect(result.current).toHaveProperty('documents');
      expect(result.current).toHaveProperty('documentTypes');
      expect(result.current).toHaveProperty('currentDocument');
      expect(result.current).toHaveProperty('total');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
    });
  });
});
