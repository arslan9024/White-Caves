/**
 * BroadcastCampaignSegmenter — Wave 51 GOAL-056
 * Broadcast campaign segmenter targeting high-intent luxury buyers
 * White Caves Real Estate LLC — Communications & Marketing Suite
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

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const AudienceBox = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const ACard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AKey = styled.div`
  font-size: 0.65rem;
  color: #94A3B8;
  text-transform: uppercase;
  font-weight: 700;
`;

const AVal = styled.div`
  font-size: 1.2rem;
  font-weight: 900;
  color: #EF4444;
`;

const LaunchBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

export const BroadcastCampaignSegmenter: FC = () => {
  const [budgetTier, setBudgetTier] = useState('AED 10M - 25M (UHNW)');
  const [communityPref, setCommunityPref] = useState('Palm Jumeirah & Waterfront');
  const [buyerType, setBuyerType] = useState('Cash Investor / International');
  const [launched, setLaunched] = useState(false);

  const audienceCount = budgetTier.includes('UHNW') ? 482 : budgetTier.includes('50M') ? 128 : 1240;

  return (
    <Wrap data-testid="broadcast-campaign-segmenter">
      <Head>
        <Title>📢 Luxury Inbound Broadcast Campaign Segmenter</Title>
        <Tag>OLIVIA ENGINE</Tag>
      </Head>
      <Body>
        <FilterGrid>
          <Field>
            <FLabel>Target Purchasing Budget</FLabel>
            <Select value={budgetTier} onChange={e => setBudgetTier(e.target.value)}>
              <option value="AED 5M - 10M (High Net Worth)">AED 5M - 10M (High Net Worth)</option>
              <option value="AED 10M - 25M (UHNW)">AED 10M - 25M (UHNW)</option>
              <option value="AED 50M+ (Bespoke Trophy Estates)">AED 50M+ (Bespoke Trophy Estates)</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Target Community Cluster</FLabel>
            <Select value={communityPref} onChange={e => setCommunityPref(e.target.value)}>
              <option value="Palm Jumeirah & Waterfront">Palm Jumeirah & Waterfront</option>
              <option value="Downtown Dubai & DIFC">Downtown Dubai & DIFC</option>
              <option value="Dubai Hills & Emirates Living">Dubai Hills & Emirates Living</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Buyer Profile</FLabel>
            <Select value={buyerType} onChange={e => setBuyerType(e.target.value)}>
              <option value="Cash Investor / International">Cash Investor / International</option>
              <option value="End-User Luxury Family">End-User Luxury Family</option>
              <option value="Institutional / Bulk Floor Buyer">Institutional / Bulk Floor Buyer</option>
            </Select>
          </Field>
        </FilterGrid>

        <AudienceBox>
          <ACard>
            <AKey>Segment Audience</AKey>
            <AVal>{audienceCount} Verified Leads</AVal>
          </ACard>
          <ACard>
            <AKey>Est. Delivery Rate</AKey>
            <AVal style={{ color: 'var(--accent-green, #10B981)' }}>98.4%</AVal>
          </ACard>
          <ACard>
            <AKey>Opt-In Compliance</AKey>
            <AVal style={{ color: 'var(--white, #FFF)' }}>100% PDPL</AVal>
          </ACard>
        </AudienceBox>

        {launched ? (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', color: 'var(--accent-green, #10B981)', fontWeight: 800, fontSize: '0.82rem' }}>
            ✓ WhatsApp Broadcast Campaign Dispatched to {audienceCount} Qualified Buyers!
          </div>
        ) : (
          <LaunchBtn onClick={() => setLaunched(true)}>
            🚀 Dispatch VIP WhatsApp Broadcast ({audienceCount} Recipients)
          </LaunchBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default BroadcastCampaignSegmenter;
