/**
 * OffMarketLeadRouter — Wave 49 GOAL-038
 * Off-market penthouse & private island exclusive lead routing engine
 * White Caves Real Estate LLC — VIP & Ultra-High-Net-Worth Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0A0614 0%, #0F172A 100%);
  border: 2px solid rgba(139, 92, 246, 0.35);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(139, 92, 246, 0.08);
  border-bottom: 1px solid rgba(139, 92, 246, 0.18);
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

const UhnwTag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #A78BFA;
  background: rgba(139, 92, 246, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(139, 92, 246, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LeadCard = styled.div<{ $tier: 'ultra' | 'exclusive' }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => p.$tier === 'ultra' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1.5px solid ${p => p.$tier === 'ultra' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(100, 116, 139, 0.2)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const LTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: #FFF;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LMeta = styled.div`
  font-size: 0.72rem;
  color: #94A3B8;
`;

const LPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 900;
  color: #A78BFA;
  text-align: right;
`;

const RouteBtn = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: linear-gradient(90deg, #7C3AED, #8B5CF6);
  color: #FFF;
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  margin-top: 4px;
  &:hover { filter: brightness(1.1); }
`;

export const OffMarketLeadRouter: FC = () => {
  const [offMarketLeads, setOffMarketLeads] = useState([
    { id: 'OM-901', asset: 'Palatial Beachfront Island Estate, The World Islands', client: 'Royal Family Office (Doha)', budget: 'AED 180,000,000', assignedSeniorPartner: 'Arsalan Malik (MD)', tier: 'ultra' as const, status: 'Direct MD Routed' },
    { id: 'OM-902', asset: 'Triplex Sky Penthouse, One Palm, Palm Jumeirah', client: 'Billionaire Tech Founder (Geneva)', budget: 'AED 95,000,000', assignedSeniorPartner: 'Arsalan Malik (MD)', tier: 'ultra' as const, status: 'NDA Verified' },
    { id: 'OM-903', asset: 'Custom Luxury Mansion, Emirates Hills Sector E', client: 'Family Office Principal (London)', budget: 'AED 72,000,000', assignedSeniorPartner: 'Partner Elena Rostova', tier: 'exclusive' as const, status: 'Direct Partner Routed' },
  ]);

  const handleRoute = (id: string) => {
    // Lead routed via encrypted channel to Managing Director Private Desk
    setOffMarketLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'Direct MD Routed' } : l));
  };

  return (
    <Wrap data-testid="off-market-lead-router">
      <Head>
        <Title>🏝️ Off-Market Ultra-Luxury Lead Router</Title>
        <UhnwTag>LEVEL 5 SOVEREIGN ACCESS</UhnwTag>
      </Head>
      <Body>
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', fontSize: '0.72rem', color: 'var(--text-secondary, #CBD5E1)' }}>
          👑 <strong>UHNW Exclusive Routing Protocol:</strong> Properties exceeding AED 50,000,000 (Off-market islands, trophy penthouses) automatically bypass standard broker queues and route directly to the Managing Director & Senior Equity Partners.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {offMarketLeads.map(lead => (
            <LeadCard key={lead.id} $tier={lead.tier}>
              <LInfo>
                <LTitle>
                  <span>{lead.asset}</span>
                </LTitle>
                <LMeta>👤 Buyer Context: {lead.client}</LMeta>
                <LMeta style={{ color: 'var(--color-a78bfa, #A78BFA)', fontWeight: 700 }}>
                  🛡️ Routed To: {lead.assignedSeniorPartner} ({lead.status})
                </LMeta>
              </LInfo>
              <div style={{ textAlign: 'right' }}>
                <LPrice>{lead.budget}</LPrice>
                <RouteBtn onClick={() => handleRoute(lead.id)}>
                  🔐 Open Vault Room
                </RouteBtn>
              </div>
            </LeadCard>
          ))}
        </div>
      </Body>
    </Wrap>
  );
};

export default OffMarketLeadRouter;
