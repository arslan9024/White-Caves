import React, { useState, useMemo } from 'react';
import '../RolePages.css';

export default function DLDFeesPage() {
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [isMortgage, setIsMortgage] = useState(true);
  const [mortgageAmount, setMortgageAmount] = useState(3750000);

  const fees = useMemo(() => {
    const dldFee = propertyPrice * 0.04;
    const dldAdminFee = 580;
    const trusteeFee = isMortgage ? 4200 : 2100;
    const agencyFee = propertyPrice * 0.02;
    const agencyVAT = agencyFee * 0.05;
    const mortgageRegistration = isMortgage ? mortgageAmount * 0.0025 + 290 : 0;
    const noC = 5000;
    const valuationFee = 3000;
    
    const totalBuyerCost = dldFee / 2 + dldAdminFee + trusteeFee + agencyFee + agencyVAT + mortgageRegistration + noC + valuationFee;
    const totalSellerCost = dldFee / 2;
    
    return {
      dldFee,
      dldAdminFee,
      trusteeFee,
      agencyFee,
      agencyVAT,
      mortgageRegistration,
      noC,
      valuationFee,
      totalBuyerCost,
      totalSellerCost,
      grandTotal: totalBuyerCost + totalSellerCost
    };
  }, [propertyPrice, isMortgage, mortgageAmount]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>DLD Fee Calculator</h1>
          <p>Calculate Dubai Land Department fees and property transfer costs</p>
        </div>

        <div className="calculator-layout">
          <div className="calculator-inputs">
            <div className="input-group">
              <label>Property Price (AED)</label>
              <input 
                type="number" 
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="text-input"
              />
            </div>

            <div className="input-group">
              <label>Payment Method</label>
              <div className="toggle-group">
                <button 
                  className={`toggle-btn ${isMortgage ? 'active' : ''}`}
                  onClick={() => setIsMortgage(true)}
                >
                  Mortgage
                </button>
                <button 
                  className={`toggle-btn ${!isMortgage ? 'active' : ''}`}
                  onClick={() => setIsMortgage(false)}
                >
                  Cash
                </button>
              </div>
            </div>

            {isMortgage && (
              <div className="input-group">
                <label>Mortgage Amount (AED)</label>
                <input 
                  type="number" 
                  value={mortgageAmount}
                  onChange={(e) => setMortgageAmount(Number(e.target.value))}
                  className="text-input"
                />
              </div>
            )}
          </div>

          <div className="calculator-results">
            <h3>Fee Breakdown</h3>
            
            <div className="fees-breakdown">
              <div className="fee-section">
                <h4>Dubai Land Department Fees</h4>
                <div className="fee-item">
                  <span>Transfer Fee (4% of property value)</span>
                  <span>{formatCurrency(fees.dldFee)}</span>
                </div>
                <div className="fee-item sub">
                  <span>Buyer's Share (2%)</span>
                  <span>{formatCurrency(fees.dldFee / 2)}</span>
                </div>
                <div className="fee-item sub">
                  <span>Seller's Share (2%)</span>
                  <span>{formatCurrency(fees.dldFee / 2)}</span>
                </div>
                <div className="fee-item">
                  <span>DLD Admin Fee</span>
                  <span>{formatCurrency(fees.dldAdminFee)}</span>
                </div>
              </div>

              <div className="fee-section">
                <h4>Trustee & Registration Fees</h4>
                <div className="fee-item">
                  <span>Trustee Fee</span>
                  <span>{formatCurrency(fees.trusteeFee)}</span>
                </div>
                {isMortgage && (
                  <div className="fee-item">
                    <span>Mortgage Registration (0.25% + AED 290)</span>
                    <span>{formatCurrency(fees.mortgageRegistration)}</span>
                  </div>
                )}
              </div>

              <div className="fee-section">
                <h4>Agency & Other Fees</h4>
                <div className="fee-item">
                  <span>Agency Commission (2%)</span>
                  <span>{formatCurrency(fees.agencyFee)}</span>
                </div>
                <div className="fee-item">
                  <span>VAT on Commission (5%)</span>
                  <span>{formatCurrency(fees.agencyVAT)}</span>
                </div>
                <div className="fee-item">
                  <span>NOC from Developer (approx)</span>
                  <span>{formatCurrency(fees.noC)}</span>
                </div>
                <div className="fee-item">
                  <span>Property Valuation</span>
                  <span>{formatCurrency(fees.valuationFee)}</span>
                </div>
              </div>

              <div className="fee-section total">
                <div className="fee-item highlight">
                  <span>Total Buyer Cost</span>
                  <span>{formatCurrency(fees.totalBuyerCost)}</span>
                </div>
                <div className="fee-item">
                  <span>As % of Property Price</span>
                  <span>{((fees.totalBuyerCost / propertyPrice) * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Important Information</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>DLD Transfer Fee</h4>
              <p>The standard DLD transfer fee is 4% of the property value, typically split equally between buyer and seller (2% each). However, this can be negotiated.</p>
            </div>
            <div className="info-card">
              <h4>Trustee Fee</h4>
              <p>Trustee fees are paid to the registered trustee company handling the transfer. They vary based on whether you're purchasing with cash or mortgage.</p>
            </div>
            <div className="info-card">
              <h4>Agency Commission</h4>
              <p>Standard real estate agency commission in Dubai is 2% of the property value, plus 5% VAT. This is typically paid by the buyer.</p>
            </div>
            <div className="info-card">
              <h4>NOC (No Objection Certificate)</h4>
              <p>Required from the developer before transfer. Fees vary by developer, typically ranging from AED 500 to AED 5,000.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
