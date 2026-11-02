import React, { FC } from 'react';
import { Building, Copy, FileCheck, RefreshCw, Sparkles, UserCheck } from 'lucide-react';
import { PreviewCanvasCard, ActionButton } from '../styles/HenryDocumentStudio.style';

export interface HenryEmiratesIdPreviewProps {
  eidData: any;
  isScanning: boolean;
  handleScanEmiratesId: () => void;
  handleAutoFillAsTenant: () => void;
  handleAutoFillAsLandlord: () => void;
  handleAutoFillViewingForm: () => void;
  handleCopyJsonVariables: () => void;
}

export const HenryEmiratesIdPreview: FC<HenryEmiratesIdPreviewProps> = ({
  eidData,
  isScanning,
  handleScanEmiratesId,
  handleAutoFillAsTenant,
  handleAutoFillAsLandlord,
  handleAutoFillViewingForm,
  handleCopyJsonVariables,
}) => {
  return (
    <PreviewCanvasCard style={{ padding: '24px', overflowY: 'auto' }}>
      {/* Emirates ID Ingestion Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #EF4444',
          paddingBottom: '14px',
          marginBottom: '18px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: '#EF4444',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 800,
              }}
            >
              ICP OPTICAL AI SCANNER
            </span>
            <span
              style={{ fontSize: '11px', color: 'var(--accent-green, #16A34A)', fontWeight: 800 }}
            >
              DEMO ID — NOT IDENTITY VERIFICATION
            </span>
          </div>
          <h3
            style={{ margin: '6px 0 2px', color: 'var(--color-1e293b, #1E293B)', fontSize: '18px' }}
          >
            UAE Resident Identity Card (Emirates ID) Ingestion Hub
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
            Demo ID fields only. Real labelled bilingual identity, dates, occupation, employer and
            TD1 MRZ candidates require source review; not all fields are present.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionButton
            onClick={() => handleScanEmiratesId()}
            disabled={isScanning}
            title="Rescan Emirates ID Document"
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Scanning...' : 'Rescan Card'}
          </ActionButton>
          <ActionButton
            $primary
            onClick={handleCopyJsonVariables}
            title="Export All 18 Variables as JSON"
          >
            <Copy size={14} /> Export Variables (JSON)
          </ActionButton>
        </div>
      </div>

      {/* Variable Distribution & 1-Click Platform Actions */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '14px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#1E293B',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={14} color="#EF4444" />
          <span>1-Click Variable Auto-Fill & Platform Distribution:</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <ActionButton onClick={handleAutoFillAsTenant}>
            <UserCheck size={14} color="#2563EB" /> Auto-Fill Tenancy Lease (as Tenant)
          </ActionButton>
          <ActionButton onClick={handleAutoFillAsLandlord}>
            <Building size={14} color="#16A34A" /> Auto-Fill Tenancy Lease (as Landlord)
          </ActionButton>
          <ActionButton onClick={handleAutoFillViewingForm}>
            <FileCheck size={14} color="#D97706" /> Auto-Fill Form B Viewing Register
          </ActionButton>
        </div>
      </div>

      {/* Extracted Fields Table (18 Attributes) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Box 1: Core Legal Identity */}
        <div
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '16px',
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              color: '#EF4444',
              fontWeight: 800,
              fontSize: '12px',
              borderBottom: '1px solid #F1F5F9',
              paddingBottom: '6px',
              marginBottom: '10px',
            }}
          >
            1. CORE LEGAL IDENTITY
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <div>
              <strong>Emirates ID No:</strong>{' '}
              <code
                style={{
                  background: '#FEF2F2',
                  color: '#991B1B',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
              >
                {eidData.idNumber}
              </code>
            </div>
            <div>
              <strong>Card Number:</strong> {eidData.cardNumber}
            </div>
            <div>
              <strong>Chip Number:</strong> {eidData.chipNumber || '2500069345'}
            </div>
            <div>
              <strong>Name (English):</strong> {eidData.fullNameEn}
            </div>
            <div>
              <strong>Name (Arabic):</strong>{' '}
              <span style={{ fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>
                {eidData.fullNameAr}
              </span>
            </div>
          </div>
        </div>

        {/* Box 2: Demographics & Validity */}
        <div
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '16px',
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              color: '#2563EB',
              fontWeight: 800,
              fontSize: '12px',
              borderBottom: '1px solid #F1F5F9',
              paddingBottom: '6px',
              marginBottom: '10px',
            }}
          >
            2. DEMOGRAPHICS & DOCUMENT VALIDITY
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <div>
              <strong>Date of Birth:</strong> {eidData.dateOfBirth}
            </div>
            <div>
              <strong>Gender / Sex:</strong>{' '}
              {eidData.gender === 'M' ? 'Male (ذكر)' : 'Female (أنثى)'}
            </div>
            <div>
              <strong>Nationality:</strong> {eidData.nationalityEn} ({eidData.nationalityAr} /{' '}
              {eidData.nationalityCode})
            </div>
            <div>
              <strong>Card Issue Date:</strong> {eidData.issueDate}
            </div>
            <div>
              <strong>Card Expiry Date:</strong>{' '}
              <span style={{ color: 'var(--accent-green, #16A34A)', fontWeight: 'bold' }}>
                {eidData.expiryDate}
              </span>{' '}
              (demo date, not validity verification)
            </div>
          </div>
        </div>

        {/* Box 3: Employment & Jurisdiction */}
        <div
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '16px',
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              color: '#16A34A',
              fontWeight: 800,
              fontSize: '12px',
              borderBottom: '1px solid #F1F5F9',
              paddingBottom: '6px',
              marginBottom: '10px',
            }}
          >
            3. EMPLOYMENT & JURISDICTION
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <div>
              <strong>Occupation:</strong> {eidData.occupationEn} ({eidData.occupationAr})
            </div>
            <div>
              <strong>Employer / Sponsor:</strong> {eidData.employerEn} ({eidData.employerAr})
            </div>
            <div>
              <strong>Issuing Place:</strong> {eidData.issuingPlaceEn} ({eidData.issuingPlaceAr})
            </div>
            <div>
              <strong>Illustrative demo confidence (not measured accuracy):</strong>{' '}
              {(eidData.confidenceScore * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Box 4: ICAO 9303 TD1 MRZ Code */}
        <div
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '16px',
            background: '#1E293B',
            color: '#F8FAFC',
          }}
        >
          <div
            style={{
              color: '#FACC15',
              fontWeight: 800,
              fontSize: '12px',
              borderBottom: '1px solid #334155',
              paddingBottom: '6px',
              marginBottom: '10px',
            }}
          >
            4. MACHINE READABLE ZONE (MRZ TD1)
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '1px',
              lineHeight: 1.6,
              color: '#E2E8F0',
            }}
          >
            <div>{eidData.mrz?.line1}</div>
            <div>{eidData.mrz?.line2}</div>
            <div>{eidData.mrz?.line3}</div>
          </div>
        </div>
      </div>
    </PreviewCanvasCard>
  );
};
