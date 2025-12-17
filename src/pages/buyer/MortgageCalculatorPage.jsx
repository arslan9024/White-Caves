import React, { useState, useMemo } from 'react';
import RoleNavigation from '../../components/RoleNavigation';
import '../RolePages.css';

export default function MortgageCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(25);
  const [interestRate, setInterestRate] = useState(4.99);
  const [loanTerm, setLoanTerm] = useState(25);
  const [showAmortization, setShowAmortization] = useState(false);

  const calculations = useMemo(() => {
    const loanAmount = propertyPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    const amortization = [];
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="role-page">
      <RoleNavigation role="buyer" />
      
      <div className="role-page-content">
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
                min="3" 
                max="8" 
                step="0.01"
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
                max="25" 
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
              <div className="input-value">{loanTerm} years</div>
            </div>
          </div>

          <div className="calculator-results">
            <div className="result-highlight">
              <span className="result-label">Monthly Payment</span>
              <span className="result-value">{formatCurrency(calculations.monthlyPayment)}</span>
            </div>

            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Loan Amount</span>
                <span className="result-value">{formatCurrency(calculations.loanAmount)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Interest</span>
                <span className="result-value">{formatCurrency(calculations.totalInterest)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Payment</span>
                <span className="result-value">{formatCurrency(calculations.totalPayment)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Down Payment</span>
                <span className="result-value">{formatCurrency(calculations.downPaymentAmount)}</span>
              </div>
            </div>

            <button 
              className="btn btn-secondary"
              onClick={() => setShowAmortization(!showAmortization)}
            >
              {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
            </button>
          </div>
        </div>

        {showAmortization && (
          <div className="amortization-section">
            <h3>Amortization Schedule (First 10 Years)</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.amortization.map(row => (
                    <tr key={row.year}>
                      <td>Year {row.year}</td>
                      <td>{formatCurrency(row.principal)}</td>
                      <td>{formatCurrency(row.interest)}</td>
                      <td>{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Dubai Mortgage Information</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>LTV Limits for Expats</h4>
              <ul>
                <li>Up to 75% for properties under AED 5M</li>
                <li>Up to 65% for properties over AED 5M</li>
                <li>Up to 50% for off-plan properties</li>
              </ul>
            </div>
            <div className="info-card">
              <h4>LTV Limits for UAE Nationals</h4>
              <ul>
                <li>Up to 80% for properties under AED 5M</li>
                <li>Up to 70% for properties over AED 5M</li>
                <li>Up to 50% for off-plan properties</li>
              </ul>
            </div>
            <div className="info-card">
              <h4>Required Documents</h4>
              <ul>
                <li>Valid Emirates ID & Passport</li>
                <li>Salary certificate & bank statements</li>
                <li>Property valuation report</li>
                <li>Signed MOU or Sales Agreement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
