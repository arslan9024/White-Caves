/**
 * useDocuments — Data hook for document generation and management
 *
 * Provides:
 *   - Actions: generate, fetch, list documents
 *   - Data: documents list, document types, current document
 *   - State: loading, error
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import {
  generateDocumentAPI,
  fetchDocumentsAPI,
  fetchDocumentTypesAPI,
} from '../../store/crmDataSlice';

interface DocumentItem {
  id: string;
  type: string;
  title: string;
  version: number;
  status: string;
  htmlContent: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface DocumentType {
  type: string;
  label: string;
}

export function useDocuments() {
  const dispatch = useDispatch<AppDispatch>();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [currentDocument, setCurrentDocument] = useState<DocumentItem | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Generate a new document from template */
  const generateDocument = useCallback(
    async (input: {
      type: string;
      variables: Record<string, string>;
      transactionId?: string;
      leadId?: string;
      propertyId?: string;
      commissionId?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(generateDocumentAPI(input)).unwrap();
        setCurrentDocument(result as unknown as DocumentItem);
        return result;
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to generate document');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /** Fetch documents list with optional filters */
  const fetchDocuments = useCallback(
    async (filters?: { type?: string; status?: string; leadId?: string; propertyId?: string; page?: number; pageSize?: number }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(fetchDocumentsAPI(filters)).unwrap();
        setDocuments(result.data as unknown as DocumentItem[]);
        setTotal(result.total);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /** Fetch available document types */
  const fetchTypes = useCallback(async () => {
    setError(null);
    try {
      const types = await dispatch(fetchDocumentTypesAPI()).unwrap();
      setDocumentTypes(types);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch document types');
    }
  }, [dispatch]);

  return {
    // Data
    documents,
    documentTypes,
    currentDocument,
    total,

    // State
    loading,
    error,

    // Actions
    generateDocument,
    fetchDocuments,
    fetchTypes,
  };
}
