/**
 * LeadQualificationTagger — Wave 51 GOAL-058
 * Automated lead qualification tagger (Hot / Warm / Cold / Cash Investor / UHNW / Tenant)
 * White Caves Real Estate LLC — Communications & CRM Suite
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

const LeadGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LeadCard = styled.div<{ $temperature: 'hot' | 'warm' | 'cold' }>`
  padding: 14px;
  border-radius: 10px;
  background: ${p => p.$temperature === 'hot' ? 'rgba(239, 68, 68, 0.08)' : p.$temperature === 'warm' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1.5px solid ${p => p.$temperature === 'hot' ? 'rgba(239, 68, 68, 0.35)' : p.$temperature === 'warm' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(100, 116, 139, 0.2)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const LName = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LDetails = styled.div`
  font-size: 0.72rem;
  color: #94A3B8;
`;

const TagRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ $bg: string; $color: string }>`
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${p => p.$bg};
  color: ${p => p.$color};
`;

export const LeadQualificationTagger: FC = () => {
  const [leads, setLeads] = useState([
    { id: '1', name: 'Dr. Tariq Al Qasimi', temperature: 'hot' as const, tags: ['🔥 Hot (98%)', '💰 Cash Buyer', '🏛️ UHNW (AED 50M+)', 'Palm Jumeirah'], details: 'Seeking off-market beachfront plot. Manager Cheque ready.' },
    { id: '2', name: 'Oliver Vandermeer', temperature: 'warm' as const, tags: ['⚡ Warm (74%)', '📈 Off-Plan Investor', 'Golden Visa Eligible'], details: 'Looking for 2x 2BR units in Emaar Beachfront with 50/50 payment plan.' },
    { id: '3', name: 'Sophie Laurent', temperature: 'warm' as const, tags: ['⚡ Warm (65%)', '🏢 Commercial Tenant', 'DIFC Office'], details: '4,000 sqft fitted commercial space inquiry for boutique hedge fund.' },
    { id: '4', name: 'James Robertson', temperature: 'cold' as const, tags: ['❄️ Cold (22%)', '🏠 1BR Tenant', 'Budget AED 90K'], details: 'General inquiry on Downtown 1BR rentals starting Q4 2026.' },
  ]);

  return (
    <Wrap data-testid="lead-qualification-tagger">
      <Head>
        <Title>🏷️ Automated AI Lead Qualification & Buyer Persona Tagger</Title>
        <Tag>NINA AI SCORER</Tag>
      </Head>
      <Body>
        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
          Automated multi-dimensional intent scoring evaluating buyer liquidity, purchasing timeline, Golden Visa qualification, and direct agency routing.
        </div>

        <LeadGrid>
          {leads.map(lead => (
            <LeadCard key={lead.id} $temperature={lead.temperature}>
              <LInfo>
                <LName>
                  <span>{lead.name}</span>
                </LName>
                <LDetails>{lead.details}</LDetails>
                <TagRow>
                  {lead.tags.map((t, idx) => (
                    <Badge 
                      key={idx}
                      $bg={t.includes('Hot') ? 'rgba(239,68,68,0.15)' : t.includes('Warm') ? 'rgba(245,158,11,0.15)' : t.includes('UHNW') ? 'rgba(139,92,246,0.15)' : 'rgba(100,116,139,0.15)'}
                      $color={t.includes('Hot') ? '#EF4444' : t.includes('Warm') ? '#F59E0B' : t.includes('UHNW') ? '#A78BFA' : '#CBD5E1'}
                    >
                      {t}
                    </Badge>
                  ))}
                </TagRow>
              </LInfo>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: lead.temperature === 'hot' ? '#EF4444' : lead.temperature === 'warm' ? '#F59E0B' : '#64748B' }}>
                  {lead.temperature === 'hot' ? 'P0 PRIORITY' : lead.temperature === 'warm' ? 'P1 PRIORITY' : 'NURTURE'}
                </span>
              </div>
            </LeadCard>
          ))}
        </LeadGrid>
      </Body>
    </Wrap>
  );
};

export default LeadQualificationTagger;
