import React, { FC } from 'react';
import {
  Building,
  Copy,
  FileCheck,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { PreviewCanvasCard, ActionButton } from '../styles/HenryDocumentStudio.style';

export interface HenryPassportPreviewProps {
  passportData: any;
  isScanning: boolean;
  handleScanPassport: () => void;
  handleAutoFillTenancyAsPassportTenant: () => void;
  handleAutoFillTenancyAsPassportLandlord: () => void;
  handleAutoFillViewingFromPassport: () => void;
  handleCreateAmlKycRecord: () => void;
  handleCopyPassportJsonVariables: () => void;
}

export const HenryPassportPreview: FC<HenryPassportPreviewProps> = ({
  passportData,
  isScanning,
  handleScanPassport,
  handleAutoFillTenancyAsPassportTenant,
  handleAutoFillTenancyAsPassportLandlord,
  handleAutoFillViewingFromPassport,
  handleCreateAmlKycRecord,
  handleCopyPassportJsonVariables,
}) => {
  return (
    <PreviewCanvasCard style={{ padding: '24px', overflowY: 'auto' }}>
      {/* Passport Header */}
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
              ICAO 9303 TD3 PASSPORT SCANNER
            </span>
            <span
              style={{ fontSize: '11px', color: 'var(--accent-green, #16A34A)', fontWeight: 800 }}
            >
              DEMO PASSPORT — NOT KYC VERIFICATION
            </span>
          </div>
          <h3
            style={{ margin: '6px 0 2px', color: 'var(--color-1e293b, #1E293B)', fontSize: '18px' }}
          >
            International Passport — Demo Preview
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
            Labelled passport fields and TD3 MRZ are extraction candidates when present. Missing
            fields remain blank; neither KYC nor ten-year validity is guaranteed.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionButton
            onClick={() => handleScanPassport()}
            disabled={isScanning}
            title="Rescan Passport Document"
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Scanning...' : 'Rescan Passport'}
          </ActionButton>
          <ActionButton
            $primary
            onClick={handleCopyPassportJsonVariables}
            title="Export All 16+ Variables as JSON"
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
          <ActionButton onClick={handleAutoFillTenancyAsPassportTenant}>
            <UserCheck size={14} color="#2563EB" /> Auto-Fill Tenancy Lease (as Non-Resident Tenant)
          </ActionButton>
          <ActionButton onClick={handleAutoFillTenancyAsPassportLandlord}>
            <Building size={14} color="#16A34A" /> Auto-Fill Tenancy Lease (as Non-Resident
            Landlord)
          </ActionButton>
          <ActionButton onClick={handleAutoFillViewingFromPassport}>
            <FileCheck size={14} color="#D97706" /> Auto-Fill Form B Viewing Register
          </ActionButton>
          <ActionButton onClick={handleCreateAmlKycRecord}>
            <ShieldAlert size={14} color="#DC2626" /> Create goAML KYC Audit Record
          </ActionButton>
        </div>
      </div>

      {/* Extracted Fields Table (16 Attributes) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Box 1: Passport & Document Metadata */}
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
            1. PASSPORT & DOCUMENT METADATA
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <div>
              <strong>Passport Number:</strong>{' '}
              <code
                style={{
                  background: 'var(--color-fef2f2, #FEF2F2)',
                  color: 'var(--color-991b1b, #991B1B)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
              >
                {passportData.passportNumber}
              </code>
            </div>
            <div>
              <strong>Issuing Country:</strong> {passportData.issuingCountry} (
              {passportData.issuingCountryCode})
            </div>
            <div>
              <strong>Passport Type:</strong> {passportData.passportType} (Standard International)
            </div>
            <div>
              <strong>Booklet Number:</strong> {passportData.bookletNumber}
            </div>
            <div>
              <strong>Tracking Number:</strong> {passportData.trackingNumber}
            </div>
            <div>
              <strong>Issuing Authority:</strong> {passportData.issuingAuthority}
            </div>
          </div>
        </div>

        {/* Box 2: Personal Identity & Biometrics */}
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
            2. PERSONAL IDENTITY & BIOMETRICS
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <div>
              <strong>Full Name:</strong>{' '}
              <span style={{ fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>
                {passportData.fullName}
              </span>
            </div>
            <div>
              <strong>Surname:</strong> {passportData.surname} | <strong>Given:</strong>{' '}
              {passportData.givenNames}
            </div>
            <div>
              <strong>Father's Name:</strong> {passportData.fatherName}
            </div>
            <div>
              <strong>National ID / CNIC:</strong>{' '}
              <code
                style={{
                  background: 'var(--color-eff6ff, #EFF6FF)',
                  color: 'var(--accent-blue, #1D4ED8)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
              >
                {passportData.nationalIdentityNumber}
              </code>
            </div>
            <div>
              <strong>Date of Birth:</strong> {passportData.dateOfBirth} (Gender:{' '}
              {passportData.gender === 'M' ? 'Male' : 'Female'})
            </div>
            <div>
              <strong>Place of Birth:</strong> {passportData.placeOfBirth}
            </div>
          </div>
        </div>

        {/* Box 3: Validity & Lifespan */}
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
            3. DEMO DATES & DERIVED DATE SPAN
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <div>
              <strong>Date of Issue:</strong> {passportData.dateOfIssue}
            </div>
            <div>
              <strong>Date of Expiry:</strong>{' '}
              <span style={{ color: 'var(--accent-green, #16A34A)', fontWeight: 'bold' }}>
                {passportData.dateOfExpiry}
              </span>
            </div>
            <div>
              <strong>Validity Period:</strong> {passportData.validityYears} Years (derived date
              span, not current validity)
            </div>
            <div>
              <strong>Nationality:</strong> {passportData.nationality} (
              {passportData.nationalityCode})
            </div>
            <div>
              <strong>Illustrative demo confidence (not measured accuracy):</strong>{' '}
              {(passportData.confidenceScore * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Box 4: ICAO 9303 TD3 MRZ Code */}
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
            4. 2-LINE ICAO 9303 TD3 MRZ CODE
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
            <div>{passportData.mrz?.line1}</div>
            <div>{passportData.mrz?.line2}</div>
          </div>
        </div>
      </div>
    </PreviewCanvasCard>
  );
};
