import React, { FC } from 'react';
import {
  Building,
  Copy,
  FileCheck,
  FileText,
  Home,
  RefreshCw,
  Scan,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { PreviewCanvasCard, ActionButton } from '../styles/HenryDocumentStudio.style';

export interface HenryTenancyContractPreviewProps {
  scannedContractData: any;
  isScanning: boolean;
  handleScanTenancyContract: (
    template?: 'sample' | 'sample_sanit' | 'sample_svetlana' | 'blank'
  ) => void | Promise<void>;
  handleLoadContractIntoPreparationStudio: () => void;
  handleCreateCrmLandlordFromContract: () => void;
  handleCreateCrmTenantFromContract: () => void;
  handleCopyContractJsonVariables: () => void;
}

export const HenryTenancyContractPreview: FC<HenryTenancyContractPreviewProps> = ({
  scannedContractData,
  isScanning,
  handleScanTenancyContract,
  handleLoadContractIntoPreparationStudio,
  handleCreateCrmLandlordFromContract,
  handleCreateCrmTenantFromContract,
  handleCopyContractJsonVariables,
}) => {
  return (
    <PreviewCanvasCard style={{ padding: '24px', overflowY: 'auto' }}>
      {/* Header */}
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
              TENANCY CONTRACT DEMO PREVIEW
            </span>
            <span
              style={{
                fontSize: '11px',
                background: scannedContractData.isFilled
                  ? 'rgba(22, 163, 74, 0.15)'
                  : 'rgba(234, 179, 8, 0.15)',
                color: scannedContractData.isFilled ? '#16A34A' : '#CA8A04',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 800,
              }}
            >
              {scannedContractData.isFilled
                ? `Demo field coverage (${scannedContractData.fillScorePercent}% Score)`
                : '⚠️ BLANK REUSABLE TEMPLATE (0% Score)'}
            </span>
          </div>
          <h3
            style={{ margin: '6px 0 2px', color: 'var(--color-1e293b, #1E293B)', fontSize: '18px' }}
          >
            Tenancy Contract Scanner — Demo Preview
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
            Demo field coverage ({scannedContractData.filledFieldsCount}/
            {scannedContractData.totalFieldsCount} Fields), not accuracy or signature verification.
            No autonomous learning.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <ActionButton
            $primary
            onClick={() => handleScanTenancyContract('sample_sanit')}
            disabled={isScanning}
            title="Scan & Extract Camelia 608 (Sanit Singh & Keshivani)"
          >
            <Scan size={14} /> Scan Camelia 608 (Sanit Singh)
          </ActionButton>
          <ActionButton
            $primary
            onClick={() => handleScanTenancyContract('sample_svetlana')}
            disabled={isScanning}
            title="Scan & Extract Janusia XH2858B (Svetlana & William Abernethy)"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-blue, #0284C7) 0%, var(--color-0369a1, #0369A1) 100%)',
              borderColor: 'var(--accent-blue, #0284C7)',
            }}
          >
            <Sparkles size={14} /> Scan Janusia XH2858B (Svetlana)
          </ActionButton>
          <ActionButton
            onClick={() => handleScanTenancyContract('blank')}
            disabled={isScanning}
            title="Scan Blank Unfilled Contract Template"
          >
            <RefreshCw size={14} /> Scan Blank Template
          </ActionButton>
          <ActionButton
            onClick={handleCopyContractJsonVariables}
            title="Copy All Variables as JSON"
          >
            <Copy size={14} /> Export Variables (JSON)
          </ActionButton>
        </div>
      </div>

      {/* Field Completeness & Missing Fields Alert */}
      <div
        style={{
          background: scannedContractData.isFilled
            ? 'rgba(22, 163, 74, 0.08)'
            : 'rgba(234, 179, 8, 0.08)',
          border: `1px solid ${scannedContractData.isFilled ? 'rgba(22, 163, 74, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: scannedContractData.isFilled
                ? 'var(--color-15803d, #15803D)'
                : 'var(--color-a16207, #A16207)',
            }}
          >
            {scannedContractData.isFilled
              ? `Contract Completeness: ${scannedContractData.fillScorePercent}% (${scannedContractData.filledFieldsCount} of ${scannedContractData.totalFieldsCount} fields populated)`
              : 'Unfilled DLD Base Contract: 0% Populated (Ready for Auto-Fill Template)'}
          </div>
          <div
            style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)', marginTop: '2px' }}
          >
            {scannedContractData.missingFields.length > 0
              ? `Missing / Optional Fields: ${scannedContractData.missingFields.join(', ')}`
              : 'Demo fields populated; completeness, accuracy and legal validity are not verified.'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)', fontWeight: 700 }}
          >
            Contract Date:
          </span>
          <code
            style={{
              background: 'var(--color-f1f5f9, #F1F5F9)',
              color: 'var(--color-0f172a, #0F172A)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '11px',
            }}
          >
            {scannedContractData.contractDate || 'Unspecified'}
          </code>
        </div>
      </div>

      {/* Grouped Extraction Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '18px',
        }}
      >
        {/* Group 1: Landlord */}
        <div
          style={{
            background: 'var(--color-f8fafc, #F8FAFC)',
            border: '1px solid var(--text-secondary, #E2E8F0)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <h4
            style={{
              margin: '0 0 10px 0',
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--accent-red, #EF4444)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Building size={15} /> 1. Landlord / Lessor (معلومات المالك)
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '11px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Owner / Lessor Name
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)', fontSize: '12px' }}>
                {scannedContractData.landlord.name || '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Emirates ID
              </span>
              <strong style={{ color: 'var(--accent-red, #EF4444)', fontFamily: 'monospace' }}>
                {scannedContractData.landlord.emiratesId || '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Phone Number
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>
                {scannedContractData.landlord.phone || '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Email Address
              </span>
              <strong style={{ color: 'var(--accent-blue, #2563EB)' }}>
                {scannedContractData.landlord.email || '—'}
              </strong>
            </div>
          </div>
        </div>

        {/* Group 2: Tenant */}
        <div
          style={{
            background: 'var(--color-f8fafc, #F8FAFC)',
            border: '1px solid var(--text-secondary, #E2E8F0)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <h4
            style={{
              margin: '0 0 10px 0',
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--accent-blue, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <UserCheck size={15} /> 2. Tenant Information (معلومات المستأجر)
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '11px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Tenant Name
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)', fontSize: '12px' }}>
                {scannedContractData.tenant.name || '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Emirates ID
              </span>
              <strong style={{ color: 'var(--accent-blue, #2563EB)', fontFamily: 'monospace' }}>
                {scannedContractData.tenant.emiratesId || '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Phone Number
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>
                {scannedContractData.tenant.phone || '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Email Address
              </span>
              <strong style={{ color: 'var(--accent-blue, #2563EB)' }}>
                {scannedContractData.tenant.email || '—'}
              </strong>
            </div>
          </div>
        </div>

        {/* Group 3: Property Specifications */}
        <div
          style={{
            background: 'var(--color-f8fafc, #F8FAFC)',
            border: '1px solid var(--text-secondary, #E2E8F0)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <h4
            style={{
              margin: '0 0 10px 0',
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--accent-gold, #D97706)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Home size={15} /> 3. Property Specifications (معلومات العقار)
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '11px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Building & Unit
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>
                {scannedContractData.property.buildingName} Unit{' '}
                {scannedContractData.property.propertyNumber}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Plot Number
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>
                Plot {scannedContractData.property.plotNumber}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Property Type & Usage
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>
                {scannedContractData.property.propertyType} ({scannedContractData.property.usage})
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Area (Sq.M / Sq.Ft)
              </span>
              <strong style={{ color: 'var(--accent-green, #16A34A)' }}>
                {scannedContractData.property.areaSqM ?? 'Not visible'} m² (
                {scannedContractData.property.areaSqFt ?? 'Not visible'} sq.ft)
              </strong>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Location / Community
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>
                {scannedContractData.property.location}
              </strong>
            </div>
          </div>
        </div>

        {/* Group 4: Lease Financials */}
        <div
          style={{
            background: 'var(--color-f8fafc, #F8FAFC)',
            border: '1px solid var(--text-secondary, #E2E8F0)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <h4
            style={{
              margin: '0 0 10px 0',
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--accent-green, #16A34A)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={15} /> 4. Lease & Financials (معلومات العقد والمالية)
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '11px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Lease Period
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>
                {scannedContractData.financials.periodFrom} ➔{' '}
                {scannedContractData.financials.periodTo}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Annual Rent
              </span>
              <strong style={{ color: 'var(--accent-green, #16A34A)', fontSize: '13px' }}>
                AED {scannedContractData.financials.annualRentAed.toLocaleString()}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Security Deposit
              </span>
              <strong style={{ color: 'var(--accent-gold, #D97706)' }}>
                {scannedContractData.financials.securityDepositAed === undefined
                  ? 'Not visible'
                  : `AED ${scannedContractData.financials.securityDepositAed.toLocaleString()}`}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>
                Mode of Payment
              </span>
              <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>
                {scannedContractData.financials.modeOfPayment}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Group 5: Additional Terms / Addenda */}
      <div
        style={{
          background: 'var(--color-f8fafc, #F8FAFC)',
          border: '1px solid var(--text-secondary, #E2E8F0)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '18px',
        }}
      >
        <h4
          style={{
            margin: '0 0 8px 0',
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--color-475569, #475569)',
          }}
        >
          📜 Additional Special Terms & Addenda (شروط إضافية ملحقة بالعقد)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
          {scannedContractData.additionalTerms.map((term: string, i: number) => (
            <div
              key={i}
              style={{ display: 'flex', gap: '6px', color: 'var(--color-1e293b, #1E293B)' }}
            >
              <span style={{ color: 'var(--accent-green, #16A34A)', fontWeight: 800 }}>✓</span>
              <span>{term}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 1-Click Platform Ingestion Actions Bar */}
      <div
        style={{
          background: '#F1F5F9',
          border: '1px solid #CBD5E1',
          borderRadius: '10px',
          padding: '14px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--color-334155, #334155)',
            marginRight: '6px',
          }}
        >
          1-Click Platform Actions:
        </span>
        <ActionButton $primary onClick={handleLoadContractIntoPreparationStudio}>
          <FileCheck size={14} /> Load into Preparation Studio as Reusable Draft
        </ActionButton>
        <ActionButton onClick={handleCreateCrmLandlordFromContract}>
          <Building size={14} color="#EF4444" /> Create CRM Landlord Profile
        </ActionButton>
        <ActionButton onClick={handleCreateCrmTenantFromContract}>
          <UserCheck size={14} color="#2563EB" /> Create CRM Tenant Profile
        </ActionButton>
      </div>
    </PreviewCanvasCard>
  );
};
