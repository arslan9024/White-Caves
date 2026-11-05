/**
 * White Caves Real Estate LLC - Document Management Logic
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Logic)
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { DocumentItem, DocumentType, DocumentStatus } from './DocumentManager.types';
import { CANONICAL_DOCUMENTS } from './DocumentManager.data';

export interface UseDocumentManagerProps {
  initialDocuments?: DocumentItem[];
  selectedDocId?: string | null;
  onSelectDoc?: (id: string) => void;
}

export function useDocumentManager({
  initialDocuments = CANONICAL_DOCUMENTS,
  selectedDocId,
  onSelectDoc,
}: UseDocumentManagerProps = {}) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | DocumentType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DocumentStatus>('ALL');

  // Modal / Drawer state
  const [selectedDocForModal, setSelectedDocForModal] = useState<DocumentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync with selectedDocId deep link
  useEffect(() => {
    if (selectedDocId) {
      const match = documents.find(
        d =>
          d.id.toLowerCase() === selectedDocId.toLowerCase() ||
          d._id.toLowerCase() === selectedDocId.toLowerCase() ||
          d.docCode.toLowerCase() === selectedDocId.toLowerCase()
      );
      if (match) {
        setSelectedDocForModal(match);
      }
    }
  }, [selectedDocId, documents]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      if (typeFilter !== 'ALL' && doc.docType !== typeFilter) return false;
      if (statusFilter !== 'ALL' && doc.status !== statusFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        doc.id.toLowerCase().includes(q) ||
        doc.docCode.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        doc.entityName.toLowerCase().includes(q) ||
        (doc.dealId && doc.dealId.toLowerCase().includes(q)) ||
        (doc.propertyId && doc.propertyId.toLowerCase().includes(q))
      );
    });
  }, [documents, typeFilter, statusFilter, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const verified = documents.filter(d => d.status === 'VERIFIED').length;
    const avgOcr =
      documents.length > 0
        ? Math.round(documents.reduce((acc, d) => acc + d.ocrConfidence, 0) / documents.length)
        : 100;
    const uniqueDeals = new Set(documents.map(d => d.dealId).filter(Boolean)).size;

    return {
      totalDocsCount: documents.length,
      verifiedDocsCount: verified,
      verifiedRatePercent: Math.round((verified / (documents.length || 1)) * 100),
      avgOcrConfidence: avgOcr,
      linkedDealsCount: uniqueDeals,
    };
  }, [documents]);

  // Handlers
  const handleOpenDetailModal = useCallback(
    (doc: DocumentItem) => {
      setSelectedDocForModal(doc);
      onSelectDoc?.(doc.id);
    },
    [onSelectDoc]
  );

  const handleCloseDetailModal = useCallback(() => {
    setSelectedDocForModal(null);
  }, []);

  const handleOpenUploadDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleCloseUploadDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleVerifyDocument = useCallback((docId: string) => {
    setDocuments(prev =>
      prev.map(d => {
        if (d.id === docId || d._id === docId) {
          return { ...d, status: 'VERIFIED', ocrConfidence: 99.5 };
        }
        return d;
      })
    );

    setSelectedDocForModal(prev => {
      if (!prev) return null;
      if (prev.id === docId || prev._id === docId) {
        return { ...prev, status: 'VERIFIED', ocrConfidence: 99.5 };
      }
      return prev;
    });
  }, []);

  const handleSaveDocument = useCallback((docData: Partial<DocumentItem>) => {
    setDocuments(prev => {
      const newId = `DOC-00${prev.length + 1}`;
      const newDoc: DocumentItem = {
        id: newId,
        _id: `doc-00${prev.length + 1}`,
        docCode: docData.docCode || `DOC-CODE-${prev.length + 1}`,
        title: docData.title || 'Untitled Document',
        docType: docData.docType || 'TITLE_DEED',
        status: docData.status || 'VERIFIED',
        fileUrl: docData.fileUrl || '/documents/sample-doc.pdf',
        fileSizeKB: docData.fileSizeKB || 1024,
        uploadedAt: new Date().toISOString().split('T')[0],
        dealId: docData.dealId || 'DEAL-001',
        propertyId: docData.propertyId || 'REP-001',
        entityId: docData.entityId || 'tenant-001',
        entityName: docData.entityName || 'Hassan Al-Nuaimi',
        ocrConfidence: docData.ocrConfidence || 99.0,
        metadata: docData.metadata || { note: 'Directly ingested via Document Vault' },
      };
      return [newDoc, ...prev];
    });
    setIsDrawerOpen(false);
  }, []);

  return {
    documents: filteredDocuments,
    allDocuments: documents,
    metrics,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    selectedDocForModal,
    isDrawerOpen,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleOpenUploadDrawer,
    handleCloseUploadDrawer,
    handleVerifyDocument,
    handleSaveDocument,
  };
}
