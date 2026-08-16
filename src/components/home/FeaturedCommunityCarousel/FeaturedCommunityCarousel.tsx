/**
 * FeaturedCommunityCarousel — Wave 57 FE-GOAL-020
 * Featured Dubai prime communities carousel with active listings counts and price-per-sqft benchmarks
 * White Caves Real Estate LLC — Homepage & Discovery Suite
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const CommCard = styled.div<{ $selected: boolean }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => p.$selected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1.5px solid ${p => p.$selected ? '#EF4444' : 'rgba(100, 116, 139, 0.2)'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; transform: translateY(-2px); }
`;

const CName = styled.div`
  font-size: 0.9rem;
  font-weight: 900;
  color: #FFF;
`;

const CType = styled.div`
  font-size: 0.68rem;
  color: #94A3B8;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
`;

export const FeaturedCommunityCarousel: FC = () => {
  const [selected, setSelected] = useState('Palm Jumeirah');

  const communities = [
    { name: 'Palm Jumeirah', type: 'Iconic Beachfront Living', listings: 42, avgSqft: 'AED 3,450/sqft', icon: '🏝️' },
    { name: 'Downtown Dubai', type: 'Urban Luxury & Burj Views', listings: 68, avgSqft: 'AED 2,850/sqft', icon: '🏙️' },
    { name: 'Dubai Hills Estate', type: 'Golf Course Mansions', listings: 35, avgSqft: 'AED 2,150/sqft', icon: '⛳' },
    { name: 'Emirates Hills', type: 'Ultra-Private Sovereign Estates', listings: 14, avgSqft: 'AED 4,200/sqft', icon: '🏰' },
  ];

  return (
    <Wrap data-testid="featured-community-carousel">
      <Head>
        <Title>🌟 Featured Prime Dubai Communities</Title>
        <Tag>DISCOVERY HUBS</Tag>
      </Head>
      <Body>
        {communities.map((c, idx) => (
          <CommCard 
            key={idx} 
            $selected={selected === c.name}
            onClick={() => setSelected(c.name)}
          >
            <div>
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{c.icon}</div>
              <CName>{c.name}</CName>
              <CType>{c.type}</CType>
            </div>
            <div>
              <StatRow>
                <span style={{ color: '#94A3B8' }}>Active Listings:</span>
                <span style={{ color: '#FFF', fontWeight: 700 }}>{c.listings} Properties</span>
              </StatRow>
              <StatRow style={{ marginTop: '3px' }}>
                <span style={{ color: '#94A3B8' }}>Avg Rate:</span>
                <span style={{ color: '#10B981', fontWeight: 800 }}>{c.avgSqft}</span>
              </StatRow>
            </div>
          </CommCard>
        ))}
      </Body>
    </Wrap>
  );
};

export default FeaturedCommunityCarousel;
