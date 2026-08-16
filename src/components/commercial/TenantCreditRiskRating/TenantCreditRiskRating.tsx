/**
 * TenantCreditRiskRating — Wave 54 GOAL-084
 * Commercial tenant credit risk rating & corporate parent guarantor appraisal sheet
 * White Caves Real Estate LLC — Commercial & Corporate Leasing Suite
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  &:focus { border-color: #EF4444; }
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

const RiskScoreCard = styled.div<{ $rating: 'AAA' | 'A' | 'BBB' | 'C' }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => p.$rating === 'AAA' ? 'rgba(16, 185, 129, 0.1)' : p.$rating === 'A' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 1.5px solid ${p => p.$rating === 'AAA' ? '#10B981' : p.$rating === 'A' ? '#38BDF8' : '#EF4444'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RatingVal = styled.div<{ $rating: 'AAA' | 'A' | 'BBB' | 'C' }>`
  font-size: 2rem;
  font-weight: 900;
  color: ${p => p.$rating === 'AAA' ? '#10B981' : p.$rating === 'A' ? '#38BDF8' : '#EF4444'};
`;

export const TenantCreditRiskRating: FC = () => {
  const [companyName, setCompanyName] = useState('Nexus Financial Technologies FZ-LLC');
  const [annualRentAed, setAnnualRentAed] = useState('850000');
  const [auditedRevAed, setAuditedRevAed] = useState('32000000');
  const [yearsOperating, setYearsOperating] = useState('6');
  const [hasCorporateGuarantor, setHasCorporateGuarantor] = useState('Yes - Global Parent Co.');

  const rent = Number(annualRentAed) || 1;
  const revenue = Number(auditedRevAed) || 1;
  const rentToRevRatio = (rent / revenue) * 100;

  let rating: 'AAA' | 'A' | 'BBB' | 'C' = 'A';
  if (rentToRevRatio < 5 && Number(yearsOperating) >= 5 && hasCorporateGuarantor.includes('Yes')) rating = 'AAA';
  else if (rentToRevRatio < 10) rating = 'A';
  else if (rentToRevRatio < 20) rating = 'BBB';
  else rating = 'C';

  return (
    <Wrap data-testid="tenant-credit-risk-rating">
      <Head>
        <Title>📊 Commercial Tenant Underwriting & Credit Risk Rating</Title>
        <Tag>RISK APPRAISAL</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Corporate Tenant Legal Entity</FLabel>
            <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Annual Lease Commitment (AED)</FLabel>
            <Input type="number" value={annualRentAed} onChange={e => setAnnualRentAed(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Annual Audited Revenue (AED)</FLabel>
            <Input type="number" value={auditedRevAed} onChange={e => setAuditedRevAed(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Operating History in UAE</FLabel>
            <Input type="number" value={yearsOperating} onChange={e => setYearsOperating(e.target.value)} />
          </Field>
          <Field style={{ gridColumn: 'span 2' }}>
            <FLabel>Parent Corporate Guarantor / Bank Guarantee</FLabel>
            <Select value={hasCorporateGuarantor} onChange={e => setHasCorporateGuarantor(e.target.value)}>
              <option value="Yes - Global Parent Co.">Yes - Global Parent Company Guarantee (Investment Grade)</option>
              <option value="Yes - Local Bank Guarantee (6 Months)">Yes - Local Bank Guarantee (6 Months Deposit)</option>
              <option value="None - Standalone Entity">None - Standalone Entity (Security Deposit Only)</option>
            </Select>
          </Field>
        </FormGrid>

        <RiskScoreCard $rating={rating}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
              Underwriting Assessment Grade
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {rating === 'AAA' ? 'Prime Institutional Grade (Low Risk)' : rating === 'A' ? 'Investment Grade Corporate (Moderate Risk)' : 'High Risk Profile'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#CBD5E1', marginTop: '4px' }}>
              Rent-to-Revenue Ratio: <strong>{rentToRevRatio.toFixed(1)}%</strong> (Threshold &lt; 10% is healthy)
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <RatingVal $rating={rating}>{rating}</RatingVal>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>CREDIT SCORE</div>
          </div>
        </RiskScoreCard>
      </Body>
    </Wrap>
  );
};

export default TenantCreditRiskRating;
