import React, { FC, useState, useMemo } from 'react';
import '../RolePages.css';

interface DLDFeesPageProps {}

const DLDFeesPage: FC<DLDFeesPageProps> = () => {
  const [propertyPrice, setPropertyPrice] = useState<number>(5000000);
  const [isMortgage, setIsMortgage] = useState<boolean>(true);
  const [mortgageAmount, setMortgageAmount] = useState<number>(3750000);

  interface Fees {
    dldFee: number;
    dldAdminFee: number;
    trusteeFee: number;
    agencyFee: number;
    agencyVAT: number;
    mortgageRegistration: number;
    noC: number;
    valuationFee: number;
    totalBuyerCost: number;
    totalSellerCost: number;
    grandTotal: number;
  }

  const fees: Fees = useMemo(() => {
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

  const formatCurrency = (amount: number): string => {
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
                <h4>Buyer Costs</h4>
                <div className="fee-item">
                  <span>DLD Transfer (50%)</span>
                  <span>{formatCurrency(fees.dldFee / 2)}</span>
                </div>
                <div className="fee-item">
                  <span>Agency Fee</span>
                  <span>{formatCurrency(fees.agencyFee)}</span>
                </div>
                <div className="fee-item">
                  <span>Agency VAT</span>
                  <span>{formatCurrency(fees.agencyVAT)}</span>
                </div>
                <div className="fee-item highlight">
                  <span><strong>Total Buyer Cost</strong></span>
                  <span><strong>{formatCurrency(fees.totalBuyerCost)}</strong></span>
                </div>
              </div>

              <div className="fee-section">
                <h4>Seller Costs</h4>
                <div className="fee-item highlight">
                  <span><strong>DLD Transfer (50%)</strong></span>
                  <span><strong>{formatCurrency(fees.totalSellerCost)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DLDFeesPage;
