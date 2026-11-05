/**
 * White Caves Real Estate LLC - Sovereign Document Vault Sidebar List
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { FileText, ShieldCheck, Tag, UploadCloud } from 'lucide-react';
import { CANONICAL_DOCUMENTS } from '../../crm/DocumentManager/DocumentManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

interface SidebarDocumentsListProps {
  filterQuery?: string;
  selectedDocId?: string | null;
  onSelectDoc?: (id: string, title: string) => void;
  onOpenUpload?: () => void;
}

export const SidebarDocumentsList: FC<SidebarDocumentsListProps> = ({
  filterQuery = '',
  selectedDocId,
  onSelectDoc,
  onOpenUpload,
}) => {
  const query = filterQuery.trim().toLowerCase();

  const visibleDocs = CANONICAL_DOCUMENTS.filter(doc => {
    if (!query) return true;
    return (
      doc.id.toLowerCase().includes(query) ||
      doc.docCode.toLowerCase().includes(query) ||
      doc.title.toLowerCase().includes(query) ||
      doc.entityName.toLowerCase().includes(query) ||
      (doc.dealId && doc.dealId.toLowerCase().includes(query)) ||
      (doc.propertyId && doc.propertyId.toLowerCase().includes(query))
    );
  });

  return (
    <SidebarListWrapper data-testid="sidebar-documents-list">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px 10px 8px',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#38BDF8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Document Vault ({visibleDocs.length})
        </span>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            data-testid="sidebar-upload-doc-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38BDF8',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>+ Upload</span>
          </button>
        )}
      </div>

      {visibleDocs.map(doc => {
        const isSelected = selectedDocId === doc.id;
        const isVerified = doc.status === 'VERIFIED';

        return (
          <div
            key={doc._id}
            onClick={() => onSelectDoc?.(doc.id, doc.title)}
            data-testid={`sidebar-doc-${doc.id}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#070D18',
              border: `1px solid ${isSelected ? '#38BDF8' : 'rgba(255, 255, 255, 0.05)'}`,
              marginBottom: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#38BDF8',
                    background: 'rgba(56, 189, 248, 0.2)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {doc.id}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <Tag size={10} />
                  {doc.docCode}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: isVerified ? '#34D399' : '#FBBF24',
                  background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {doc.status}
              </span>
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: isSelected ? '#FFFFFF' : '#CBD5E1',
                lineHeight: '1.2',
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={doc.title}
            >
              {doc.title}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
              }}
            >
              <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={10} color="#3B82F6" />
                {doc.entityName}
              </span>
              <span style={{ fontWeight: 800, color: '#38BDF8' }}>{doc.ocrConfidence}% OCR</span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarDocumentsList;
