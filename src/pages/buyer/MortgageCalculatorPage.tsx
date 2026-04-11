import React, { FC, useState, useMemo } from 'react';
import { formatCurrency } from '../../utils';
import { Config } from '../../config/constants';
import '../RolePages.css';

const MortgageCalculatorPage: FC = () => {
  const [propertyPrice, setPropertyPrice] = useState<number>(Config.REAL_ESTATE.DEFAULT_PROPERTY_PRICE);
  const [downPayment, setDownPayment] = useState<number>(Config.MORTGAGE.DEFAULT_DOWN_PAYMENT);
  const [interestRate, setInterestRate] = useState<number>(Config.MORTGAGE.DEFAULT_INTEREST_RATE);
  const [loanTerm, setLoanTerm] = useState<number>(Config.MORTGAGE.DEFAULT_LOAN_TERM);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  interface AmortizationSchedule {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }

  interface Calculations {
    loanAmount: number;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    downPaymentAmount: number;
    amortization: AmortizationSchedule[];
  }

  const calculations: Calculations = useMemo(() => {
    const loanAmount = propertyPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = monthlyRate === 0
      ? loanAmount / numberOfPayments
      : loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    const amortization: AmortizationSchedule[] = [];
    let balance = loanAmount;
    for (let year = 1; year <= Math.min(loanTerm, 10); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 0; month < 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
      }
      amortization.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: Math.max(0, balance)
      });
    }
    
    return {
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      downPaymentAmount: propertyPrice * (downPayment / 100),
      amortization
    };
  }, [propertyPrice, downPayment, interestRate, loanTerm]);

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Mortgage Calculator</h1>
          <p>Calculate your monthly payments and total costs for your Dubai property purchase</p>
        </div>

        <div className="calculator-layout">
          <div className="calculator-inputs">
            <div className="input-group">
              <label>Property Price (AED)</label>
              <input 
                type="range" 
                min="500000" 
                max="50000000" 
                step="100000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
              />
              <div className="input-value">{formatCurrency(propertyPrice)}</div>
            </div>

            <div className="input-group">
              <label>Down Payment (%)</label>
              <input 
                type="range" 
                min="20" 
                max="80" 
                step="5"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
              />
              <div className="input-value">{downPayment}% ({formatCurrency(calculations.downPaymentAmount)})</div>
            </div>

            <div className="input-group">
              <label>Interest Rate (%)</label>
              <input 
                type="range" 
                min="2" 
                max="7" 
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
              <div className="input-value">{interestRate.toFixed(2)}%</div>
            </div>

            <div className="input-group">
              <label>Loan Term (Years)</label>
              <input 
                type="range" 
                min="5" 
                max="30" 
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
              <div className="input-value">{loanTerm} years</div>
            </div>
          </div>

          <div className="calculator-results">
            <h3>Results</h3>
            
            <div className="result-box">
              <span className="result-label">Loan Amount</span>
              <span className="result-value">{formatCurrency(calculations.loanAmount)}</span>
            </div>
            
            <div className="result-box highlight">
              <span className="result-label">Monthly Payment</span>
              <span className="result-value">{formatCurrency(calculations.monthlyPayment)}</span>
            </div>
            
            <div className="result-box">
              <span className="result-label">Total Interest Over {loanTerm} Years</span>
              <span className="result-value">{formatCurrency(calculations.totalInterest)}</span>
            </div>
            
            <div className="result-box">
              <span className="result-label">Total Amount Paid</span>
              <span className="result-value">{formatCurrency(calculations.totalPayment)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculatorPage;
