/**
 * White Caves Real Estate LLC - Document Upload Drawer Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { X, UploadCloud, Save } from 'lucide-react';
import { DocumentItem, DocumentType } from './DocumentManager.types';

interface DocumentUploadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (docData: Partial<DocumentItem>) => void;
}

export const DocumentUploadDrawer: FC<DocumentUploadDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('TITLE_DEED');
  const [docCode, setDocCode] = useState('');
  const [entityName, setEntityName] = useState('');
  const [dealId, setDealId] = useState('DEAL-001');
  const [propertyId, setPropertyId] = useState('REP-001');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      docType,
      docCode: docCode || `${docType.slice(0, 3)}-${Date.now().toString().slice(-4)}`,
      entityName,
      dealId,
      propertyId,
      status: 'VERIFIED',
      ocrConfidence: 99.2,
      fileSizeKB: 1200,
    });
    setTitle('');
    setEntityName('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      data-testid="document-upload-drawer"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#070D18',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={18} color="#38BDF8" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
              Upload Statutory Document Dossier
            </h3>
          </div>
          <button
            onClick={onClose}
            data-testid="close-upload-drawer"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#94A3B8',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Ejari Tenancy Agreement 2026"
              data-testid="doc-title-input"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Statutory Doc Type
              </label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as DocumentType)}
                data-testid="doc-type-select"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              >
                <option value="TITLE_DEED">Title Deed</option>
                <option value="EMIRATES_ID">Emirates ID</option>
                <option value="PASSPORT">Passport</option>
                <option value="EJARI_CONTRACT">Ejari Contract</option>
                <option value="PAYMENT_RECEIPT">Payment Receipt</option>
                <option value="TRADE_LICENSE">Trade License</option>
                <option value="MOU_FORM_F">MOU Form F</option>
                <option value="NOC_CERTIFICATE">Developer NOC</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Document Reference Code
              </label>
              <input
                type="text"
                value={docCode}
                onChange={e => setDocCode(e.target.value)}
                placeholder="e.g. TD-908124"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#94A3B8',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Counterparty Entity / Holder Name
            </label>
            <input
              type="text"
              value={entityName}
              onChange={e => setEntityName(e.target.value)}
              placeholder="e.g. Hassan Al-Nuaimi"
              data-testid="doc-entity-input"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Associated Deal ID
              </label>
              <input
                type="text"
                value={dealId}
                onChange={e => setDealId(e.target.value)}
                placeholder="DEAL-001"
                data-testid="doc-deal-input"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Target Property Unit
              </label>
              <input
                type="text"
                value={propertyId}
                onChange={e => setPropertyId(e.target.value)}
                placeholder="REP-001"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              data-testid="save-doc-btn"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                background: '#38BDF8',
                color: '#070D18',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Save size={16} />
              Save Document
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94A3B8',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
