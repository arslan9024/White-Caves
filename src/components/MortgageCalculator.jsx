import React, { useState, useMemo } from 'react';
import {
  CalculatorWrapper,
  CalculatorHeader,
  CalculatorIcon,
  HeaderContent,
  CalculatorTitle,
  CalculatorSubtitle,
  CalculatorBody,
  CalculatorInputs,
  InputGroup,
  InputLabel,
  InputWithPrefix,
  PrefixLabel,
  InputField,
  RangeSlider,
  DownPaymentDisplay,
  DownPaymentAmount,
  CalculatorResults,
  MonthlyPaymentBox,
  PaymentLabel,
  PaymentAmount,
  BreakdownSection,
  BreakdownTitle,
  BreakdownBar,
  BreakdownSegment,
  SummaryTable,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  PrintButton,
} from './MortgageCalculator.styles';

export default function MortgageCalculator({ propertyPrice = 5000000 }) {
  const [values, setValues] = useState({
    propertyPrice: propertyPrice,
    downPayment: 25,
    loanTerm: 25,
    interestRate: 4.5,
  });

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const calculations = useMemo(() => {
    const principal = values.propertyPrice * (1 - values.downPayment / 100);
    const monthlyRate = values.interestRate / 100 / 12;
    const numPayments = values.loanTerm * 12;
    
    let monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = principal / numPayments;
    } else {
      monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;
    const downPaymentAmount = values.propertyPrice * (values.downPayment / 100);

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal),
      downPaymentAmount: Math.round(downPaymentAmount),
    };
  }, [values]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const principalPercent = (calculations.principal / calculations.totalPayment) * 100;
  const interestPercent = (calculations.totalInterest / calculations.totalPayment) * 100;

  return (
    <CalculatorWrapper>
      <CalculatorHeader>
        <CalculatorIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h4M14 16h4"/>
          </svg>
        </CalculatorIcon>
        <HeaderContent>
          <CalculatorTitle>Mortgage Calculator</CalculatorTitle>
          <CalculatorSubtitle>Estimate your monthly payments</CalculatorSubtitle>
        </HeaderContent>
      </CalculatorHeader>

      <CalculatorBody>
        <CalculatorInputs>
          <InputGroup>
            <InputLabel>Property Price</InputLabel>
            <InputWithPrefix>
              <PrefixLabel>AED</PrefixLabel>
              <InputField
                type="number"
                value={values.propertyPrice}
                onChange={(e) => handleChange('propertyPrice', Number(e.target.value))}
                min="0"
                step="100000"
              />
            </InputWithPrefix>
            <RangeSlider
              type="range"
              min="500000"
              max="100000000"
              step="100000"
              value={values.propertyPrice}
              onChange={(e) => handleChange('propertyPrice', Number(e.target.value))}
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>Down Payment: {values.downPayment}%</InputLabel>
            <DownPaymentDisplay>
              <DownPaymentAmount>{formatCurrency(calculations.downPaymentAmount)}</DownPaymentAmount>
            </DownPaymentDisplay>
            <RangeSlider
              type="range"
              min="10"
              max="80"
              step="5"
              value={values.downPayment}
              onChange={(e) => handleChange('downPayment', Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <span>10%</span>
              <span>80%</span>
            </div>
          </InputGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputGroup>
              <InputLabel>Loan Term</InputLabel>
              <InputField as="select"
                value={values.loanTerm}
                onChange={(e) => handleChange('loanTerm', Number(e.target.value))}
              >
                <option value="5">5 Years</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="25">25 Years</option>
              </InputField>
            </InputGroup>

            <InputGroup>
              <InputLabel>Interest Rate</InputLabel>
              <InputWithPrefix>
                <InputField
                  style={{ paddingRight: '2.5rem' }}
                  type="number"
                  value={values.interestRate}
                  onChange={(e) => handleChange('interestRate', Number(e.target.value))}
                  min="1"
                  max="15"
                  step="0.1"
                />
                <PrefixLabel style={{ right: '1rem', left: 'auto' }}>%</PrefixLabel>
              </InputWithPrefix>
            </InputGroup>
          </div>
        </CalculatorInputs>

        <CalculatorResults>
          <MonthlyPaymentBox>
            <PaymentLabel>Monthly Payment</PaymentLabel>
            <PaymentAmount>{formatCurrency(calculations.monthlyPayment)}</PaymentAmount>
          </MonthlyPaymentBox>

          <BreakdownSection>
            <BreakdownTitle>Payment Breakdown</BreakdownTitle>
            <BreakdownBar>
              <BreakdownSegment percentage={principalPercent} color="var(--primary-color)" />
              <BreakdownSegment percentage={interestPercent} color="var(--secondary-color)" />
            </BreakdownBar>
          </BreakdownSection>

          <SummaryTable>
            <SummaryRow>
              <SummaryLabel>Total Payment</SummaryLabel>
              <SummaryValue>{formatCurrency(calculations.totalPayment)}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Principal</SummaryLabel>
              <SummaryValue>{formatCurrency(calculations.principal)}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Total Interest</SummaryLabel>
              <SummaryValue>{formatCurrency(calculations.totalInterest)}</SummaryValue>
            </SummaryRow>
          </SummaryTable>

          <PrintButton onClick={() => window.print()}>
            Print Estimate
          </PrintButton>
        </CalculatorResults>
      </CalculatorBody>
    </CalculatorWrapper>
  );
}

export default MortgageCalculator;
                <span className="legend-label">Interest</span>
                <span className="legend-value">{formatCurrency(calculations.totalInterest)}</span>
              </div>
            </div>
          </div>

          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Total Payment</span>
              <span className="stat-value">{formatCurrency(calculations.totalPayment)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Loan Amount</span>
              <span className="stat-value">{formatCurrency(calculations.principal)}</span>
            </div>
          </div>

          <button className="apply-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            Get Pre-Approved
          </button>
        </div>
      </div>

      <div className="calculator-disclaimer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <p>This calculator provides estimates only. Actual rates and payments may vary based on your credit profile and lender terms.</p>
      </div>
    </div>
  );
}
