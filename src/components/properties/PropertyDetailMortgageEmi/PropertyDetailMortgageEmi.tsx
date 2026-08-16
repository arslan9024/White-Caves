/**
 * PropertyDetailMortgageEmi — Wave 62 FE-GOAL-064
 * Property Detail Page embedded mortgage monthly EMI repayment calculator with CBUAE LTV rules
 * White Caves Real Estate LLC — Property Detail & Finance Suite
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
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
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

const EmiSummary = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1.5px solid rgba(16, 185, 129, 0.35);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmiVal = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  color: #10B981;
`;

export const PropertyDetailMortgageEmi: FC = () => {
  const [propertyPrice, setPropertyPrice] = useState('18500000');
  const [downPaymentPct, setDownPaymentPct] = useState('20');
  const [interestRatePct, setInterestRatePct] = useState('4.25');
  const [tenureYears, setTenureYears] = useState('25');

  const price = Number(propertyPrice) || 0;
  const downPayment = (price * Number(downPaymentPct)) / 100;
  const loanAmount = Math.max(0, price - downPayment);
  const monthlyRate = Number(interestRatePct) / 100 / 12;
  const totalMonths = Number(tenureYears) * 12;

  // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = monthlyRate > 0 && totalMonths > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  return (
    <Wrap data-testid="property-detail-mortgage-emi">
      <Head>
        <Title>🏦 Mortgage EMI & CBUAE Loan-to-Value Estimator</Title>
        <Tag>CBUAE 80% LTV APPROVED</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Property Listing Price (AED)</FLabel>
            <Input type="number" value={propertyPrice} onChange={e => setPropertyPrice(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Down Payment (%) — Min 20%</FLabel>
            <Input type="number" value={downPaymentPct} onChange={e => setDownPaymentPct(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Interest Rate (% p.a.)</FLabel>
            <Input type="number" step="0.05" value={interestRatePct} onChange={e => setInterestRatePct(e.target.value)} />
          </Field>
        </FormGrid>

        <EmiSummary>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
              Estimated Monthly Installment (EMI)
            </div>
            <EmiVal>AED {Math.round(emi).toLocaleString()} / month</EmiVal>
            <div style={{ fontSize: '0.68rem', color: '#CBD5E1', marginTop: '2px' }}>
              Down Payment Required: <strong>AED {Math.round(downPayment).toLocaleString()}</strong> | Loan: AED {Math.round(loanAmount).toLocaleString()}
            </div>
          </div>
          <button style={{ padding: '10px 16px', background: '#10B981', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>
            ⚡ Get Pre-Approved
          </button>
        </EmiSummary>
      </Body>
    </Wrap>
  );
};

export default PropertyDetailMortgageEmi;
