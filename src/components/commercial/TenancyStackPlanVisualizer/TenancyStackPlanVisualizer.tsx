/**
 * TenancyStackPlanVisualizer — Wave 54 GOAL-086
 * Multi-story commercial building vertical tenancy stack plan visualizer
 * White Caves Real Estate LLC — Commercial & Asset Management Suite
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

const StackContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FloorRow = styled.div<{ $status: 'occupied' | 'vacant' | 'expiring' }>`
  padding: 10px 14px;
  border-radius: 8px;
  background: ${p => p.$status === 'occupied' ? 'rgba(16, 185, 129, 0.08)' : p.$status === 'expiring' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
  border: 1px solid ${p => p.$status === 'occupied' ? 'rgba(16, 185, 129, 0.3)' : p.$status === 'expiring' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FloorLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FloorNum = styled.span`
  font-size: 0.85rem;
  font-weight: 900;
  color: #FFF;
  min-width: 45px;
`;

const TenantInfo = styled.div`
  font-size: 0.78rem;
  color: #E2E8F0;
  font-weight: 700;
`;

const ExpiryTag = styled.span<{ $status: 'occupied' | 'vacant' | 'expiring' }>`
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${p => p.$status === 'occupied' ? '#10B981' : p.$status === 'expiring' ? '#F59E0B' : '#EF4444'};
  color: #FFF;
`;

export const TenancyStackPlanVisualizer: FC = () => {
  const [floors] = useState([
    { floor: 'L18 - L20', tenant: 'Morgan Stanley MENA Headquarters', area: '36,000 SqFt', rent: 'AED 9.0M', status: 'occupied' as const, expiry: 'Expires 2029' },
    { floor: 'L15 - L17', tenant: 'White Caves Global Executive Suites', area: '36,000 SqFt', rent: 'Owner Occupied', status: 'occupied' as const, expiry: 'Permanent' },
    { floor: 'L12 - L14', tenant: 'Global Tech Capital FZ-LLC', area: '36,000 SqFt', rent: 'AED 8.1M', status: 'expiring' as const, expiry: 'Expires in 90 Days' },
    { floor: 'L08 - L11', tenant: 'VACANT FULL FLOORS (Grade A Fitted)', area: '48,000 SqFt', rent: 'AED 10.8M Target', status: 'vacant' as const, expiry: 'Available Immediately' },
    { floor: 'L04 - L07', tenant: 'Clifford Chance Legal Consultants', area: '48,000 SqFt', rent: 'AED 11.5M', status: 'occupied' as const, expiry: 'Expires 2031' },
    { floor: 'L01 - L03', tenant: 'Luxury Retail & Dining Pavilion', area: '32,000 SqFt', rent: 'AED 14.2M', status: 'occupied' as const, expiry: 'Expires 2033' },
  ]);

  return (
    <Wrap data-testid="tenancy-stack-plan-visualizer">
      <Head>
        <Title>🏢 Commercial Building Vertical Tenancy Stack Plan</Title>
        <Tag>ASSET STACK 20-STOREY</Tag>
      </Head>
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Total NLA</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--white, #FFF)' }}>236,000 SqFt</div>
          </div>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Occupancy Rate</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--accent-green, #10B981)' }}>79.6%</div>
          </div>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--color-94a3b8, #94A3B8)' }}>WAULT (Lease Term)</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--color-38bdf8, #38BDF8)' }}>5.4 Years</div>
          </div>
        </div>

        <StackContainer>
          {floors.map((f, idx) => (
            <FloorRow key={idx} $status={f.status}>
              <FloorLeft>
                <FloorNum>{f.floor}</FloorNum>
                <div>
                  <TenantInfo>{f.tenant}</TenantInfo>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-94a3b8, #94A3B8)' }}>{f.area} | {f.rent}</div>
                </div>
              </FloorLeft>
              <ExpiryTag $status={f.status}>{f.expiry}</ExpiryTag>
            </FloorRow>
          ))}
        </StackContainer>
      </Body>
    </Wrap>
  );
};

export default TenancyStackPlanVisualizer;
