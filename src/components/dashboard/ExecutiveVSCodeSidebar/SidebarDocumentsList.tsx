/**
 * SidebarDocumentsList.tsx
 * White Caves Real Estate LLC - Documents Left Sidebar Drawer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Double-Layer Routing
 */

import React, { FC } from 'react';
import { FileText, ShieldCheck, Tag, UploadCloud, ArrowRight, Lock } from 'lucide-react';
import { CANONICAL_DOCUMENTS } from '../../crm/DocumentManager/DocumentManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

export interface SidebarDocumentsListProps {
  filterQuery?: string;
  selectedDocId?: string | null;
  onSelectDoc?: (id: string, title: string) => void;
  onOpenUpload?: () => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarDocumentsList: FC<SidebarDocumentsListProps> = ({
  filterQuery = '',
  selectedDocId,
  onSelectDoc,
  onOpenUpload,
  onNavigateToView,
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
      {/* ── Level 1 Category Portals ─────────────────────────────────── */}
      <div style={{ marginBottom: '8px' }}>
        <div
          onClick={() => onNavigateToView?.('/dashboard/documents/vault')}
          style={{
            fontSize: '0.68rem',
            color: '#38BDF8',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '6px',
            marginBottom: '4px',
          }}
          data-testid="link-all-docs-vault"
        >
          📁 Open Document Archive (CRUD) <ArrowRight size={11} />
        </div>
        <div
          onClick={() => onNavigateToView?.('/dashboard/documents/compliance')}
          style={{
            fontSize: '0.68rem',
            color: '#34D399',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
          data-testid="link-docs-compliance"
        >
          📜 Statutory DLD/RERA Vault <ArrowRight size={11} />
        </div>
      </div>

      {/* Header bar with Count and Upload action */}
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
            <UploadCloud size={12} />
            <span>Upload</span>
          </button>
        )}
      </div>

      {/* ── Level 2 Sub-Items: Documents with Turing IDs ─────────────── */}
      {visibleDocs.map(doc => {
        const isSelected = selectedDocId === doc.id;
        return (
          <div
            key={doc.id}
            onClick={() => {
              onSelectDoc?.(doc.id, doc.title);
              onNavigateToView?.(`/dashboard/documents/${doc.id}`);
            }}
            data-testid={`sidebar-doc-${doc.docCode}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#070D18',
              border: isSelected ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'monospace',
                  color: '#38BDF8',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}
              >
                {doc.docCode}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: doc.status === 'VERIFIED' ? '#10B981' : '#F59E0B',
                }}
              >
                {doc.status}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC' }}>{doc.title}</div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: '#64748B',
              }}
            >
              <span>{doc.docType}</span>
              <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={11} /> OCR Match
              </span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarDocumentsList;
