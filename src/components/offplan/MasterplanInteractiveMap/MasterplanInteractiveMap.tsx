/**
 * MasterplanInteractiveMap — Wave 53 GOAL-076
 * Developer master community masterplan interactive map layer with phase filters
 * White Caves Real Estate LLC — Off-Plan & Visualization Suite
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

const MapCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  background: #090D16;
  border-radius: 12px;
  border: 1px solid rgba(100, 116, 139, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ClusterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const ClusterCard = styled.button<{ $selected: boolean }>`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${p => p.$selected ? '#EF4444' : 'rgba(100, 116, 139, 0.2)'};
  background: ${p => p.$selected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.7)'};
  color: ${p => p.$selected ? '#FFF' : '#94A3B8'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; }
`;

export const MasterplanInteractiveMap: FC = () => {
  const [activeCluster, setActiveCluster] = useState('Palm Fronds Sector A');

  const clusters = [
    { name: 'Palm Fronds Sector A', type: 'Signature Beachfront Villas', units: 48, status: 'Ready 2026' },
    { name: 'Lagoon Marina Precinct', type: 'High-Rise Luxury Apartments', units: 320, status: 'Handover Q1 2027' },
    { name: 'Golf Boulevard Mansions', type: 'Fairway View Estates', units: 24, status: 'Off-Plan Launch' },
    { name: 'Rooftop Promenade Retail', type: 'Commercial & F&B Hub', units: 18, status: 'Under Construction' },
  ];

  return (
    <Wrap data-testid="masterplan-interactive-map">
      <Head>
        <Title>🗺️ Master Community Masterplan GIS & Phasing Layer</Title>
        <Tag>GIS MASTERPLAN</Tag>
      </Head>
      <Body>
        <MapCanvas>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '4px' }}>🏝️</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--white, #FFF)' }}>{activeCluster}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--accent-green, #10B981)', marginTop: '2px' }}>Interactive GIS Vector Plot Active</div>
          </div>
        </MapCanvas>

        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Master Community Development Clusters
          </div>
          <ClusterGrid>
            {clusters.map((c, idx) => (
              <ClusterCard 
                key={idx} 
                $selected={activeCluster === c.name}
                onClick={() => setActiveCluster(c.name)}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--white, #FFF)' }}>{c.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-94a3b8, #94A3B8)', marginTop: '2px' }}>{c.type}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--accent-green, #10B981)', fontWeight: 700, marginTop: '4px' }}>{c.status}</div>
              </ClusterCard>
            ))}
          </ClusterGrid>
        </div>
      </Body>
    </Wrap>
  );
};

export default MasterplanInteractiveMap;
