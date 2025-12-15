import React, { useState, useMemo } from 'react';
import './MortgageCalculator.css';

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
    <div className="mortgage-calculator">
      <div className="calculator-header">
        <div className="calculator-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h4M14 16h4"/>
          </svg>
        </div>
        <div>
          <h3>Mortgage Calculator</h3>
          <p>Estimate your monthly payments</p>
        </div>
      </div>

      <div className="calculator-body">
        <div className="calculator-inputs">
          <div className="input-group">
            <label>Property Price</label>
            <div className="input-with-prefix">
              <span className="prefix">AED</span>
              <input
                type="number"
                value={values.propertyPrice}
                onChange={(e) => handleChange('propertyPrice', Number(e.target.value))}
                min="0"
                step="100000"
              />
            </div>
            <input
              type="range"
              min="500000"
              max="100000000"
              step="100000"
              value={values.propertyPrice}
              onChange={(e) => handleChange('propertyPrice', Number(e.target.value))}
              className="range-slider"
            />
          </div>

          <div className="input-group">
            <label>Down Payment: {values.downPayment}%</label>
            <div className="down-payment-display">
              <span className="amount">{formatCurrency(calculations.downPaymentAmount)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={values.downPayment}
              onChange={(e) => handleChange('downPayment', Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-labels">
              <span>10%</span>
              <span>80%</span>
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Loan Term</label>
              <select
                value={values.loanTerm}
                onChange={(e) => handleChange('loanTerm', Number(e.target.value))}
              >
                <option value="5">5 Years</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="25">25 Years</option>
              </select>
            </div>

            <div className="input-group">
              <label>Interest Rate</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={values.interestRate}
                  onChange={(e) => handleChange('interestRate', Number(e.target.value))}
                  min="1"
                  max="15"
                  step="0.1"
                />
                <span className="suffix">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="calculator-results">
          <div className="monthly-payment">
            <span className="label">Monthly Payment</span>
            <span className="amount">{formatCurrency(calculations.monthlyPayment)}</span>
          </div>

          <div className="payment-breakdown">
            <div className="breakdown-bar">
              <div 
                className="principal-bar" 
                style={{ width: `${principalPercent}%` }}
              />
              <div 
                className="interest-bar" 
                style={{ width: `${interestPercent}%` }}
              />
            </div>
            <div className="breakdown-legend">
              <div className="legend-item">
                <span className="legend-color principal"></span>
                <span className="legend-label">Principal</span>
                <span className="legend-value">{formatCurrency(calculations.principal)}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color interest"></span>
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
