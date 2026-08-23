/**
 * TrakheesiQrScanner — Wave 48 GOAL-024
 * Trakheesi Permit QR code scanner and verification badge renderer
 * White Caves Real Estate LLC — Compliance Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const scanAnimation = keyframes`
  0% { top: 0%; opacity: 0.8; }
  50% { top: 90%; opacity: 1; }
  100% { top: 0%; opacity: 0.8; }
`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(16, 185, 129, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(16, 185, 129, 0.06);
  border-bottom: 1px solid rgba(16, 185, 129, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DldTag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #10B981;
  background: rgba(16, 185, 129, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ScannerBox = styled.div`
  position: relative;
  width: 100%;
  height: 190px;
  background: #090D16;
  border-radius: 12px;
  border: 2px dashed rgba(16, 185, 129, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ScanLine = styled.div<{ $scanning: boolean }>`
  position: absolute;
  left: 5%;
  width: 90%;
  height: 2px;
  background: #10B981;
  box-shadow: 0 0 10px #10B981;
  display: ${p => p.$scanning ? 'block' : 'none'};
  animation: ${scanAnimation} 2s ease-in-out infinite;
`;

const QrGraphic = styled.div`
  font-size: 3.5rem;
  filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.3));
`;

const PermitBadge = styled.div<{ $valid: boolean }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => p.$valid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
  border: 1.5px solid ${p => p.$valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BadgeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PermitNumber = styled.div`
  font-size: 0.95rem;
  font-weight: 800;
  color: #E2E8F0;
`;

const StatusPill = styled.span<{ $valid: boolean }>`
  font-size: 0.68rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${p => p.$valid ? '#10B981' : '#EF4444'};
  color: #FFF;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  font-size: 0.72rem;
`;

const DItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DKey = styled.span`
  color: #64748B;
  font-weight: 600;
`;

const DVal = styled.span`
  color: #CBD5E1;
  font-weight: 700;
`;

const Btn = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 18px;
  border-radius: 8px;
  border: ${p => p.$variant === 'primary' ? 'none' : '1px solid rgba(100, 116, 139, 0.3)'};
  background: ${p => p.$variant === 'primary' ? 'linear-gradient(90deg, #059669, #10B981)' : 'rgba(15, 23, 42, 0.6)'};
  color: ${p => p.$variant === 'primary' ? '#FFF' : '#94A3B8'};
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); }
`;

export const TrakheesiQrScanner: FC = () => {
  const [scanning, setScanning] = useState(false);
  const [permitData, setPermitData] = useState<{
    permitNo: string;
    property: string;
    brokerName: string;
    orn: string;
    expiryDate: string;
    advertisingChannels: string[];
    valid: boolean;
  } | null>({
    permitNo: 'TRK-2026-789421',
    property: 'Luxury Sea View Villa, Palm Jumeirah',
    brokerName: 'White Caves Real Estate LLC',
    orn: '44483',
    expiryDate: '2026-12-31',
    advertisingChannels: ['PropertyFinder', 'Bayut', 'Dubizzle', 'Instagram', 'Web'],
    valid: true,
  });

  const handleSimulateScan = () => {
    setScanning(true);
    setPermitData(null);
    setTimeout(() => {
      setScanning(false);
      setPermitData({
        permitNo: `TRK-2026-${Math.floor(Math.random() * 900000 + 100000)}`,
        property: 'Penthouse 5201, Downtown Views II, Downtown Dubai',
        brokerName: 'White Caves Real Estate LLC',
        orn: '44483',
        expiryDate: '2027-02-28',
        advertisingChannels: ['Website', 'Portal Feeds', 'Social Media', 'Signboard'],
        valid: true,
      });
    }, 1500);
  };

  return (
    <Wrap data-testid="trakheesi-qr-scanner">
      <Head>
        <Title>📱 Trakheesi QR & Permit Validator</Title>
        <DldTag>RERA COMPLIANT</DldTag>
      </Head>
      <Body>
        <ScannerBox>
          <QrGraphic>🏁</QrGraphic>
          <ScanLine $scanning={scanning} />
          <div style={{ position: 'absolute', bottom: 12, fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)' }}>
            {scanning ? 'Decoding DLD Cryptographic QR...' : 'Position camera over Trakheesi QR or click Scan'}
          </div>
        </ScannerBox>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Btn $variant="primary" onClick={handleSimulateScan} disabled={scanning}>
            {scanning ? '⏳ Scanning QR Code...' : '📸 Simulate Camera Scan'}
          </Btn>
          <Btn onClick={() => setPermitData(null)}>Clear</Btn>
        </div>

        {permitData && (
          <PermitBadge $valid={permitData.valid}>
            <BadgeHeader>
              <div>
                <PermitNumber>{permitData.permitNo}</PermitNumber>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-green, #10B981)', fontWeight: 600 }}>DLD Trakheesi Active Advertisement Permit</div>
              </div>
              <StatusPill $valid={permitData.valid}>VERIFIED ACTIVE</StatusPill>
            </BadgeHeader>

            <DetailGrid>
              <DItem>
                <DKey>Listing Title</DKey>
                <DVal>{permitData.property}</DVal>
              </DItem>
              <DItem>
                <DKey>Licensed Agency</DKey>
                <DVal>{permitData.brokerName} (ORN: {permitData.orn})</DVal>
              </DItem>
              <DItem>
                <DKey>Permit Validity</DKey>
                <DVal>Until {permitData.expiryDate}</DVal>
              </DItem>
              <DItem>
                <DKey>Approved Media</DKey>
                <DVal>{permitData.advertisingChannels.join(', ')}</DVal>
              </DItem>
            </DetailGrid>
          </PermitBadge>
        )}
      </Body>
    </Wrap>
  );
};

export default TrakheesiQrScanner;
