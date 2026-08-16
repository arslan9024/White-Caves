/**
 * VendorRatingMatrix — Wave 52 GOAL-070
 * Facilities management vendor rating matrix & OpEx expenditure analytics
 * White Caves Real Estate LLC — Asset Management & Vendor Procurement Suite
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

const VendorTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.72rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px 10px;
  color: #94A3B8;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.62rem;
  border-bottom: 1px solid rgba(100, 116, 139, 0.2);
`;

const Tr = styled.tr`
  border-bottom: 1px solid rgba(100, 116, 139, 0.08);
  &:hover { background: rgba(239, 68, 68, 0.04); }
`;

const Td = styled.td`
  padding: 8px 10px;
  color: #CBD5E1;
`;

export const VendorRatingMatrix: FC = () => {
  const [vendors] = useState([
    { name: 'CoolTech HVAC Solutions', trade: 'HVAC & Chillers', jobsCompleted: 142, slaRating: '98.5%', avgCost: 'AED 850', score: '4.9 / 5.0 ⭐', status: 'Preferred Partner' },
    { name: 'Emirates Plumbing LLC', trade: 'Plumbing & Drainage', jobsCompleted: 88, slaRating: '94.2%', avgCost: 'AED 420', score: '4.7 / 5.0 ⭐', status: 'Approved Vendor' },
    { name: 'SmartSecure IoT Systems', trade: 'Access & Intercoms', jobsCompleted: 54, slaRating: '96.0%', avgCost: 'AED 1,200', score: '4.8 / 5.0 ⭐', status: 'Preferred Partner' },
    { name: 'CleanPro Facilities UAE', trade: 'Deep Cleaning & Snags', jobsCompleted: 210, slaRating: '91.8%', avgCost: 'AED 350', score: '4.5 / 5.0 ⭐', status: 'Under Review' },
  ]);

  return (
    <Wrap data-testid="vendor-rating-matrix">
      <Head>
        <Title>📊 Facilities Vendor Performance & OpEx Rating Matrix</Title>
        <Tag>PROCUREMENT AUDIT</Tag>
      </Head>
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div style={{ padding: '10px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Annual FM OpEx</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#EF4444' }}>AED 1.48M</div>
          </div>
          <div style={{ padding: '10px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Contractor SLA Adherence</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10B981' }}>96.2% On-Time</div>
          </div>
          <div style={{ padding: '10px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Active Contract Vendors</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFF' }}>18 Contractors</div>
          </div>
        </div>

        <VendorTable>
          <thead>
            <tr>
              <Th>Vendor Entity</Th>
              <Th>Trade Category</Th>
              <Th>Jobs Done</Th>
              <Th>SLA Speed</Th>
              <Th>Avg Job Cost</Th>
              <Th>Quality Score</Th>
              <Th>Procurement Status</Th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v, idx) => (
              <Tr key={idx}>
                <Td style={{ fontWeight: 800, color: '#FFF' }}>{v.name}</Td>
                <Td>{v.trade}</Td>
                <Td>{v.jobsCompleted}</Td>
                <Td style={{ color: '#10B981', fontWeight: 700 }}>{v.slaRating}</Td>
                <Td>{v.avgCost}</Td>
                <Td style={{ color: '#F59E0B', fontWeight: 800 }}>{v.score}</Td>
                <Td>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: v.status.includes('Preferred') ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)', color: v.status.includes('Preferred') ? '#10B981' : '#CBD5E1' }}>
                    {v.status}
                  </span>
                </Td>
              </Tr>
            ))}
          </tbody>
        </VendorTable>
      </Body>
    </Wrap>
  );
};

export default VendorRatingMatrix;
