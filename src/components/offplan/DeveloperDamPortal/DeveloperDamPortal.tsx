/**
 * DeveloperDamPortal — Wave 53 GOAL-080
 * Developer marketing collateral digital asset management (DAM) portal & high-res brochure repository
 * White Caves Real Estate LLC — Off-Plan & Developer Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(239, 68, 68, 0.05);
  border-bottom: 1px solid rgba(239, 68, 68, 0.12);
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

const Tag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid ${p => p.$active ? '#EF4444' : 'rgba(100, 116, 139, 0.25)'};
  background: ${p => p.$active ? 'rgba(239, 68, 68, 0.15)' : 'transparent'};
  color: ${p => p.$active ? '#FFF' : '#94A3B8'};
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const AssetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const AssetCard = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
`;

const ATitle = styled.div`
  font-size: 0.8rem;
  font-weight: 800;
  color: #FFF;
`;

const AMeta = styled.div`
  font-size: 0.68rem;
  color: #94A3B8;
`;

const DownloadBtn = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: #EF4444;
  color: #FFF;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { filter: brightness(1.1); }
`;

export const DeveloperDamPortal: FC = () => {
  const [selectedDev, setSelectedDev] = useState('ALL');

  const assets = [
    { id: '1', dev: 'EMAAR', title: 'Ocean Point Master Brochure (High-Res)', size: '48.2 MB PDF', type: 'Brochure' },
    { id: '2', dev: 'EMAAR', title: 'Rashid Yachts 3D Floor Plan CAD Bundle', size: '112.5 MB ZIP', type: 'Floor Plans' },
    { id: '3', dev: 'DAMAC', title: 'Damac Islands Private Lagoons Teaser Deck', size: '34.0 MB PDF', type: 'Brochure' },
    { id: '4', dev: 'NAKHEEL', title: 'Palm Crown Mansions Fact Sheet & Payment Plans', size: '18.4 MB PDF', type: 'Fact Sheet' },
    { id: '5', dev: 'MERAAS', title: 'Central Park Plaza 4K CGI Render Pack', size: '280.0 MB ZIP', type: 'CGI Renders' },
    { id: '6', dev: 'ALDAR', title: 'Nikki Beach Residences Official Media Kit', size: '65.0 MB PDF', type: 'Media Kit' },
  ];

  const filteredAssets = selectedDev === 'ALL' ? assets : assets.filter(a => a.dev === selectedDev);

  return (
    <Wrap data-testid="developer-dam-portal">
      <Head>
        <Title>📂 Developer Digital Asset Management (DAM) & Marketing Hub</Title>
        <Tag>BROCHURE REPOSITORY</Tag>
      </Head>
      <Body>
        <FilterTabs>
          {['ALL', 'EMAAR', 'DAMAC', 'NAKHEEL', 'MERAAS', 'ALDAR'].map(dev => (
            <Tab key={dev} $active={selectedDev === dev} onClick={() => setSelectedDev(dev)}>
              {dev}
            </Tab>
          ))}
        </FilterTabs>

        <AssetGrid>
          {filteredAssets.map(asset => (
            <AssetCard key={asset.id}>
              <div>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red, #EF4444)' }}>
                  {asset.dev} · {asset.type}
                </span>
                <ATitle style={{ marginTop: '6px' }}>{asset.title}</ATitle>
                <AMeta>{asset.size}</AMeta>
              </div>
              <DownloadBtn onClick={() => alert(`Downloading ${asset.title}...`)}>
                ⬇️ Download Media
              </DownloadBtn>
            </AssetCard>
          ))}
        </AssetGrid>
      </Body>
    </Wrap>
  );
};

export default DeveloperDamPortal;
