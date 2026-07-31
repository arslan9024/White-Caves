import React, { useState } from 'react';
import styled from 'styled-components';

const RED = '#EF4444';
const SLATE = '#1E293B';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 40px 24px;
  background: #FFFFFF;
  border-radius: 24px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(239, 68, 68, 0.1);
  color: ${RED};
  font-weight: 800;
  font-size: 0.8rem;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 2.25rem;
  font-weight: 800;
  color: ${SLATE};
  margin: 0 0 12px;
`;

const Subtitle = styled.p`
  color: #64748B;
  max-width: 680px;
  font-size: 1rem;
  margin: 0 0 32px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #F8FAFC;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 20px;
  padding: 28px;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${SLATE};
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const LabelFlex = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${SLATE};
`;

const ValueHighlight = styled.span`
  color: ${RED};
  font-weight: 800;
`;

const Slider = styled.input`
  width: 100%;
  accent-color: ${RED};
  cursor: pointer;
`;

const MetricBox = styled.div`
  background: #FFFFFF;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 16px;
  padding: 16px 20px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${SLATE};
`;

const MetricValue = styled.span`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${RED};
`;

export const ToolsDashboard: React.FC = () => {
  // Mortgage Calculator State
  const [propertyPrice, setPropertyPrice] = useState(3500000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanTermYears, setLoanTermYears] = useState(25);
  const [interestRate, setInterestRate] = useState(3.99);

  // ROI Calculator State
  const [annualRentAED, setAnnualRentAED] = useState(240000);
  const [maintenanceCostPct, setMaintenanceCostPct] = useState(7);

  // Math Calculations
  const downPaymentAED = (propertyPrice * downPaymentPct) / 100;
  const loanAmountAED = propertyPrice - downPaymentAED;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  const monthlyMortgageAED =
    loanAmountAED > 0
      ? Math.round(
          (loanAmountAED * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
            (Math.pow(1 + monthlyRate, totalPayments) - 1)
        )
      : 0;

  const netAnnualIncomeAED = Math.round(annualRentAED * (1 - maintenanceCostPct / 100));
  const grossYieldPct = ((annualRentAED / propertyPrice) * 100).toFixed(2);
  const netRoiPct = ((netAnnualIncomeAED / propertyPrice) * 100).toFixed(2);

  return (
    <DashboardContainer id="tools-insights">
      <div style={{ textAlign: 'center' }}>
        <SectionBadge>⚡ GAMIFIED FINTECH & INVESTMENT SUITE</SectionBadge>
        <Title>Interactive Financial Calculators</Title>
        <Subtitle style={{ margin: '0 auto 32px' }}>
          Simulate your Dubai property mortgage, net rental yield, and cash flow in real-time.
        </Subtitle>
      </div>

      <Grid>
        {/* Mortgage Calculator */}
        <Card>
          <CardTitle>🧮 Smart Dubai Mortgage Simulator</CardTitle>
          <InputGroup>
            <LabelFlex>
              <span>Property Acquisition Value</span>
              <ValueHighlight>AED {propertyPrice.toLocaleString()}</ValueHighlight>
            </LabelFlex>
            <Slider
              type="range"
              min={1000000}
              max={25000000}
              step={250000}
              value={propertyPrice}
              onChange={e => setPropertyPrice(Number(e.target.value))}
            />
          </InputGroup>

          <InputGroup>
            <LabelFlex>
              <span>Down Payment ({downPaymentPct}%)</span>
              <ValueHighlight>AED {Math.round(downPaymentAED).toLocaleString()}</ValueHighlight>
            </LabelFlex>
            <Slider
              type="range"
              min={15}
              max={50}
              step={5}
              value={downPaymentPct}
              onChange={e => setDownPaymentPct(Number(e.target.value))}
            />
          </InputGroup>

          <InputGroup>
            <LabelFlex>
              <span>Loan Duration</span>
              <ValueHighlight>{loanTermYears} Years</ValueHighlight>
            </LabelFlex>
            <Slider
              type="range"
              min={5}
              max={25}
              step={5}
              value={loanTermYears}
              onChange={e => setLoanTermYears(Number(e.target.value))}
            />
          </InputGroup>

          <InputGroup>
            <LabelFlex>
              <span>Mortgage Interest Rate</span>
              <ValueHighlight>{interestRate}% per annum</ValueHighlight>
            </LabelFlex>
            <Slider
              type="range"
              min={2.5}
              max={8.0}
              step={0.1}
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
            />
          </InputGroup>

          <MetricBox>
            <MetricLabel>Estimated Monthly Repayment</MetricLabel>
            <MetricValue>AED {monthlyMortgageAED.toLocaleString()}/mo</MetricValue>
          </MetricBox>
        </Card>

        {/* ROI Calculator */}
        <Card>
          <CardTitle>📈 Net Rental Yield & ROI Engine</CardTitle>
          <InputGroup>
            <LabelFlex>
              <span>Expected Annual Rent (AED)</span>
              <ValueHighlight>AED {annualRentAED.toLocaleString()}/yr</ValueHighlight>
            </LabelFlex>
            <Slider
              type="range"
              min={60000}
              max={1500000}
              step={10000}
              value={annualRentAED}
              onChange={e => setAnnualRentAED(Number(e.target.value))}
            />
          </InputGroup>

          <InputGroup>
            <LabelFlex>
              <span>Service Charges & Maintenance</span>
              <ValueHighlight>{maintenanceCostPct}% of Rental</ValueHighlight>
            </LabelFlex>
            <Slider
              type="range"
              min={2}
              max={15}
              step={1}
              value={maintenanceCostPct}
              onChange={e => setMaintenanceCostPct(Number(e.target.value))}
            />
          </InputGroup>

          <MetricBox>
            <MetricLabel>Gross Rental Yield</MetricLabel>
            <MetricValue>{grossYieldPct}%</MetricValue>
          </MetricBox>

          <MetricBox>
            <MetricLabel>Estimated Net ROI Yield</MetricLabel>
            <MetricValue style={{ color: 'var(--accent-green, #059669)' }}>{netRoiPct}% Net</MetricValue>
          </MetricBox>

          <MetricBox style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
            <MetricLabel>Net Annual Cash Flow</MetricLabel>
            <MetricValue>AED {netAnnualIncomeAED.toLocaleString()}/yr</MetricValue>
          </MetricBox>
        </Card>
      </Grid>
    </DashboardContainer>
  );
};
