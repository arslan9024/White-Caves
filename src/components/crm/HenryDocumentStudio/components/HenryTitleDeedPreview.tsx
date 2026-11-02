import React, { FC } from 'react';
import { Building, Copy, FileText, Home, RefreshCw, Sparkles } from 'lucide-react';
import { PreviewCanvasCard, ActionButton } from '../styles/HenryDocumentStudio.style';

export interface HenryTitleDeedPreviewProps {
  titleDeedData: any;
  isScanning: boolean;
  handleScanTitleDeed: () => void;
  handleCreateCrmListing: () => void;
  handleAutoFillTenancyFromTitleDeed: () => void;
  handleAutoFillFormA: () => void;
  handleCopyTitleDeedJsonVariables: () => void;
}

export const HenryTitleDeedPreview: FC<HenryTitleDeedPreviewProps> = ({
  titleDeedData,
  isScanning,
  handleScanTitleDeed,
  handleCreateCrmListing,
  handleAutoFillTenancyFromTitleDeed,
  handleAutoFillFormA,
  handleCopyTitleDeedJsonVariables,
}) => {
  return (
    <PreviewCanvasCard style={{ padding: '24px', overflowY: 'auto' }}>
      {/* Title Deed Header */}
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
              DLD TITLE DEED AI SCANNER
            </span>
            <span
              style={{ fontSize: '11px', color: 'var(--accent-green, #16A34A)', fontWeight: 800 }}
            >
              DEMO TITLE DEED — NOT OWNERSHIP VERIFICATION
            </span>
          </div>
          <h3
            style={{ margin: '6px 0 2px', color: 'var(--color-1e293b, #1E293B)', fontSize: '18px' }}
          >
            Dubai Land Department (DLD) Title Deed Ingestion Hub
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
            Demo property fields only. Real extraction depends on visible labels and owner tables;
            missing values remain blank.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionButton
            onClick={() => handleScanTitleDeed()}
            disabled={isScanning}
            title="Rescan DLD Title Deed Document"
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Scanning...' : 'Rescan Title Deed'}
          </ActionButton>
          <ActionButton
            $primary
            onClick={handleCopyTitleDeedJsonVariables}
            title="Export All 22 Variables as JSON"
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
          <ActionButton onClick={handleAutoFillTenancyFromTitleDeed}>
            <Building size={14} color="#16A34A" /> Auto-Fill Tenancy Lease (Property & Landlord)
          </ActionButton>
          <ActionButton onClick={handleCreateCrmListing}>
            <Home size={14} color="#2563EB" /> Create CRM Property Inventory Listing
          </ActionButton>
          <ActionButton onClick={handleAutoFillFormA}>
            <FileText size={14} color="#D97706" /> Auto-Fill Form A Seller Mandate
          </ActionButton>
        </div>
      </div>

      {/* Extracted Fields Table (22 Attributes) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Box 1: Property Specs & Location */}
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
            1. PROPERTY & LOCATION SPECIFICATIONS
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <div>
              <strong>Property Type:</strong> {titleDeedData.propertyTypeEn} (
              {titleDeedData.propertyTypeAr})
            </div>
            <div>
              <strong>Community:</strong> {titleDeedData.communityEn} ({titleDeedData.communityAr})
            </div>
            <div>
              <strong>Building:</strong>{' '}
              <span style={{ fontWeight: 'bold', color: 'var(--accent-red, #EF4444)' }}>
                {titleDeedData.buildingNameEn}
              </span>{' '}
              ({titleDeedData.buildingNameAr}), Bldg #{titleDeedData.buildingNumber}
            </div>
            <div>
              <strong>Unit / Property No:</strong>{' '}
              <code
                style={{
                  background: 'var(--color-fef2f2, #FEF2F2)',
                  color: 'var(--color-991b1b, #991B1B)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
              >
                Unit {titleDeedData.propertyNumber}
              </code>{' '}
              (Floor {titleDeedData.floorNumber})
            </div>
            <div>
              <strong>Plot No:</strong> {titleDeedData.plotNumber} | <strong>Municipality:</strong>{' '}
              {titleDeedData.municipalityNumber}
            </div>
            <div>
              <strong>Parking Bay:</strong> {titleDeedData.parkingNumber} |{' '}
              <strong>Mortgage:</strong> {titleDeedData.mortgageStatusEn}
            </div>
          </div>
        </div>

        {/* Box 2: Area Measurements */}
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
            2. PRECISION AREA MEASUREMENTS
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <div>
              <strong>Suite Area (Internal):</strong> {titleDeedData.suiteAreaSqM} m² (المساحة
              الداخلية)
            </div>
            <div>
              <strong>Balcony Area:</strong> {titleDeedData.balconyAreaSqM} m² (مساحة البلكونة)
            </div>
            <div>
              <strong>Total Area (Sq Meters):</strong>{' '}
              <span style={{ fontWeight: 'bold', color: 'var(--accent-blue, #2563EB)' }}>
                {titleDeedData.totalAreaSqM} m²
              </span>
            </div>
            <div>
              <strong>Total Area (Sq Feet):</strong>{' '}
              <span style={{ fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>
                {titleDeedData.totalAreaSqFt} sq.ft
              </span>
            </div>
            <div>
              <strong>Common Area:</strong> {titleDeedData.commonAreaSqM} m²
            </div>
          </div>
        </div>

        {/* Box 3: Registered Ownership */}
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
            3. REGISTERED OWNERSHIP (DLD)
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
            <div>
              <strong>Owner DLD No:</strong>{' '}
              <code
                style={{
                  background: 'var(--color-f0fdf4, #F0FDF4)',
                  color: 'var(--color-166534, #166534)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
              >
                {titleDeedData.ownerDldNumber}
              </code>
            </div>
            <div>
              <strong>Owner Name (EN):</strong> {titleDeedData.ownerNameEn}
            </div>
            <div>
              <strong>Owner Name (AR):</strong>{' '}
              <span style={{ fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>
                {titleDeedData.ownerNameAr}
              </span>
            </div>
            <div>
              <strong>Ownership Share:</strong> {titleDeedData.ownerSharePercent}% (
              {titleDeedData.ownedAreaSqM} m²)
            </div>
            <div>
              <strong>DLD Certificate No:</strong> {titleDeedData.certificateNumber} (Issued:{' '}
              {titleDeedData.issueDate})
            </div>
          </div>
        </div>

        {/* Box 4: Conveyancing History */}
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
            4. CONVEYANCING & PURCHASE CONTRACT
          </div>
          <div
            style={{ fontSize: '12px', lineHeight: 1.8, color: 'var(--text-secondary, #E2E8F0)' }}
          >
            <div>
              <strong>Purchased From:</strong> {titleDeedData.purchasedFromEn}
            </div>
            <div>
              <strong>Arabic Entity:</strong> {titleDeedData.purchasedFromAr}
            </div>
            <div>
              <strong>Land Registration No:</strong> {titleDeedData.registrationContractNumber} (
              {titleDeedData.registrationDate})
            </div>
            <div>
              <strong>Purchase Price:</strong>{' '}
              <span
                style={{
                  color: 'var(--color-facc15, #FACC15)',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                AED {titleDeedData.purchasePriceAed.toLocaleString()}
              </span>
            </div>
            <div
              style={{ fontSize: '11px', color: 'var(--color-94a3b8, #94A3B8)', marginTop: '4px' }}
            >
              <em>"{titleDeedData.purchasePriceWordsEn}"</em>
            </div>
          </div>
        </div>
      </div>
    </PreviewCanvasCard>
  );
};
