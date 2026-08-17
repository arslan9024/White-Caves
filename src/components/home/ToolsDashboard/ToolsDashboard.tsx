/**
 * ToolsDashboard.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational shell drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { useToolsDashboardLogic } from './logic/ToolsDashboard.logic';
import { TOOLS_TEXT } from './data/ToolsDashboard.data';
import {
  DashboardContainer,
  HeaderArea,
  Badge,
  MainTitle,
  SubTitle,
  ThreeColumnGrid,
  ToolCard,
  CardTitle,
  ControlGroup,
  ControlLabel,
  RangeSlider,
  GaugeWrapper,
  ResultHighlight,
  FeeRow,
} from './styles/ToolsDashboard.style';

export const ToolsDashboard: FC = () => {
  const {
    propertyPrice,
    setPropertyPrice,
    downPaymentPercent,
    setDownPaymentPercent,
    interestRate,
    setInterestRate,
    loanPeriodYears,
    setLoanPeriodYears,
    annualRent,
    setAnnualRent,
    serviceCharges,
    setServiceCharges,
    mortgageStats,
    yieldStats,
    dldFees,
  } = useToolsDashboardLogic();

  // SVG Gauge calculations
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (Math.min(yieldStats.netYield, 15) / 15) * circumference;

  return (
    <DashboardContainer data-testid="tools-dashboard">
      <HeaderArea>
        <Badge>{TOOLS_TEXT.headerBadge}</Badge>
        <MainTitle>{TOOLS_TEXT.headerTitle}</MainTitle>
        <SubTitle>{TOOLS_TEXT.headerSubtitle}</SubTitle>
      </HeaderArea>

      <ThreeColumnGrid>
        {/* Column 1: Mortgage Slider */}
        <ToolCard data-testid="mortgage-calculator-card">
          <div>
            <CardTitle>{TOOLS_TEXT.col1Title}</CardTitle>

            <ControlGroup>
              <ControlLabel>
                <span>Property Value</span>
                <strong>AED {propertyPrice.toLocaleString()}</strong>
              </ControlLabel>
              <RangeSlider
                type="range"
                min="500000"
                max="30000000"
                step="100000"
                value={propertyPrice}
                onChange={e => setPropertyPrice(Number(e.target.value))}
                data-testid="slider-property-price"
              />
            </ControlGroup>

            <ControlGroup>
              <ControlLabel>
                <span>Down Payment ({downPaymentPercent}%)</span>
                <strong>AED {mortgageStats.downPaymentAmount.toLocaleString()}</strong>
              </ControlLabel>
              <RangeSlider
                type="range"
                min="15"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={e => setDownPaymentPercent(Number(e.target.value))}
                data-testid="slider-down-payment"
              />
            </ControlGroup>

            <ControlGroup>
              <ControlLabel>
                <span>Interest Rate</span>
                <strong>{interestRate}% Fixed</strong>
              </ControlLabel>
              <RangeSlider
                type="range"
                min="2.5"
                max="8.0"
                step="0.25"
                value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))}
                data-testid="slider-interest-rate"
              />
            </ControlGroup>

            <ControlGroup>
              <ControlLabel>
                <span>Tenure Duration</span>
                <strong>{loanPeriodYears} Years</strong>
              </ControlLabel>
              <RangeSlider
                type="range"
                min="5"
                max="30"
                step="1"
                value={loanPeriodYears}
                onChange={e => setLoanPeriodYears(Number(e.target.value))}
                data-testid="slider-tenure-years"
              />
            </ControlGroup>
          </div>

          <ResultHighlight>
            <div className="amount">AED {mortgageStats.monthlyPayment.toLocaleString()}/mo</div>
            <div className="caption">Estimated Monthly Repayment</div>
          </ResultHighlight>
        </ToolCard>

        {/* Column 2: Circular SVG ROI & Yield Gauge */}
        <ToolCard data-testid="yield-calculator-card">
          <div>
            <CardTitle>{TOOLS_TEXT.col2Title}</CardTitle>

            <ControlGroup>
              <ControlLabel>
                <span>Expected Annual Rent</span>
                <strong>AED {annualRent.toLocaleString()}</strong>
              </ControlLabel>
              <RangeSlider
                type="range"
                min="50000"
                max="1500000"
                step="10000"
                value={annualRent}
                onChange={e => setAnnualRent(Number(e.target.value))}
                data-testid="slider-annual-rent"
              />
            </ControlGroup>

            <ControlGroup>
              <ControlLabel>
                <span>Est. Service Charges (Annual)</span>
                <strong>AED {serviceCharges.toLocaleString()}</strong>
              </ControlLabel>
              <RangeSlider
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={serviceCharges}
                onChange={e => setServiceCharges(Number(e.target.value))}
                data-testid="slider-service-charges"
              />
            </ControlGroup>

            {/* Circular SVG Gauge */}
            <GaugeWrapper>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke="#F1F5F9"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke="#EF4444"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
                <text
                  x="60"
                  y="55"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="900"
                  fill="#0F172A"
                >
                  {yieldStats.netYield}%
                </text>
                <text
                  x="60"
                  y="72"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#64748B"
                >
                  NET YIELD
                </text>
              </svg>
            </GaugeWrapper>
          </div>

          <ResultHighlight>
            <div className="amount">{yieldStats.grossYield}% Gross</div>
            <div className="caption">Annual Return on Capital</div>
          </ResultHighlight>
        </ToolCard>

        {/* Column 3: DLD Fee Breakdown */}
        <ToolCard data-testid="dld-fees-card">
          <div>
            <CardTitle>{TOOLS_TEXT.col3Title}</CardTitle>

            <div style={{ marginTop: '12px' }}>
              <FeeRow>
                <span>DLD Transfer Fee (4%)</span>
                <strong>AED {dldFees.dldTransferFee.toLocaleString()}</strong>
              </FeeRow>
              <FeeRow>
                <span>DLD Admin & Knowledge Fee</span>
                <strong>AED {dldFees.dldAdminFee.toLocaleString()}</strong>
              </FeeRow>
              <FeeRow>
                <span>Registration Trustee Fee</span>
                <strong>AED {dldFees.trusteeFee.toLocaleString()}</strong>
              </FeeRow>
              <FeeRow>
                <span>Conveyancing / Agency (2% + VAT)</span>
                <strong>AED {dldFees.agencyFee.toLocaleString()}</strong>
              </FeeRow>
              <FeeRow>
                <span>Total Acquisition Fees</span>
                <span>AED {dldFees.totalFees.toLocaleString()}</span>
              </FeeRow>
            </div>
          </div>

          <ResultHighlight>
            <div className="amount">AED {dldFees.totalFees.toLocaleString()}</div>
            <div className="caption">Total Mandatory DLD & Closing Costs</div>
          </ResultHighlight>
        </ToolCard>
      </ThreeColumnGrid>
    </DashboardContainer>
  );
};

export default ToolsDashboard;
