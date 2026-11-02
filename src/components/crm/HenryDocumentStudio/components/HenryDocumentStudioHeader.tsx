import React, { FC } from 'react';
import { Check, FilePlus2 } from 'lucide-react';
import { StudioHeader, Badge } from '../styles/HenryDocumentStudio.style';

export interface HenryDocumentStudioHeaderProps {
  handleOpenTenancyModal: () => void;
  actionSuccessMessage: string | null;
}

export const HenryDocumentStudioHeader: FC<HenryDocumentStudioHeaderProps> = ({
  handleOpenTenancyModal,
  actionSuccessMessage,
}) => {
  return (
    <>
      <StudioHeader>
        <div>
          <h2>
            <span>📄</span> Henry AI — Sovereign Record Keeper & Document Studio
          </h2>
          <p style={{ margin: 0, color: 'var(--color-94a3b8, #94A3B8)', fontSize: '0.88rem' }}>
            Document preparation previews and reviewed OCR candidates. No government registration or
            external dispatch.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleOpenTenancyModal}
            data-testid="prepare-tenancy-btn"
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              border: '1px solid #DC2626',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <FilePlus2 size={16} /> Prepare New Tenancy Contract
          </button>
          <Badge>HENRY RECORD KEEPER</Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
            Demo / preparation previews
          </span>
        </div>
      </StudioHeader>
      <p>
        Specialized OCR scanners support Emirates ID, passport, title deed and tenancy contract.
        Review every extraction; neither authenticity nor signatures are verified. Ejari
        certificates, licences, NOCs, agency forms, sale agreements, invoices, receipts and cheques
        use the separate Reviewed document intake in Henry Records: labelled fields and manual
        corrections only, never official validation. Preparation templates do not add OCR
        capability.
      </p>
      <p>
        Studio scanner cards show synthetic demo data, not your vault records. Use the upload/review
        scanners in Henry Records for real documents. Preparation previews start with sample values;
        review all fields before use.
      </p>

      {actionSuccessMessage && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            color: '#065F46',
            border: '1.5px solid #A7F3D0',
            padding: '10px 16px',
            borderRadius: '8px',
            margin: '0 24px 12px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} color="#10B981" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}
    </>
  );
};
