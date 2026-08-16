/**
 * NeighborhoodAmenityVisualizer — Wave 62 FE-GOAL-067
 * Neighborhood proximity & key amenity commute time visualizer (DXB Airport, Dubai Mall, Metro, Schools)
 * White Caves Real Estate LLC — Property Detail & Spatial Suite
 */
import React, { FC } from 'react';
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
  color: #38BDF8;
  background: rgba(56, 189, 248, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

const AmenityCard = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
`;

const Icon = styled.div`
  font-size: 1.5rem;
`;

const AName = styled.div`
  font-size: 0.78rem;
  font-weight: 800;
  color: #FFF;
`;

const TimeVal = styled.div`
  font-size: 0.95rem;
  font-weight: 900;
  color: #EF4444;
`;

const Dist = styled.div`
  font-size: 0.65rem;
  color: #94A3B8;
`;

export const NeighborhoodAmenityVisualizer: FC = () => {
  const amenities = [
    { icon: '✈️', name: 'DXB Int. Airport', time: '18 Mins', dist: '24.5 km Drive' },
    { icon: '🛍️', name: 'The Dubai Mall / Burj Khalifa', time: '12 Mins', dist: '14.2 km Drive' },
    { icon: '🚇', name: 'Dubai Metro Red Line Station', time: '4 Mins', dist: '650m Walking' },
    { icon: '🎓', name: 'Dubai College & Regent School', time: '8 Mins', dist: '6.8 km Drive' },
  ];

  return (
    <Wrap data-testid="neighborhood-amenity-visualizer">
      <Head>
        <Title>📍 Neighborhood Proximity & Commute Distances</Title>
        <Tag>MAP TELEMETRY</Tag>
      </Head>
      <Body>
        {amenities.map((a, idx) => (
          <AmenityCard key={idx}>
            <Icon>{a.icon}</Icon>
            <AName>{a.name}</AName>
            <TimeVal>{a.time}</TimeVal>
            <Dist>{a.dist}</Dist>
          </AmenityCard>
        ))}
      </Body>
    </Wrap>
  );
};

export default NeighborhoodAmenityVisualizer;
