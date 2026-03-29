import React, { FC, useState, useMemo } from 'react';
import { formatCurrency } from '../../utils';
import { Config } from '../../config/constants';
import '../RolePages.css';

interface DLDFeesPageProps {}

const DLDFeesPage: FC<DLDFeesPageProps> = () => {
  const [propertyPrice, setPropertyPrice] = useState<number>(Config.REAL_ESTATE.DEFAULT_PROPERTY_PRICE);
  const [isMortgage, setIsMortgage] = useState<boolean>(true);
  const [mortgageAmount, setMortgageAmount] = useState<number>(Config.REAL_ESTATE.DEFAULT_PROPERTY_PRICE * 0.75);

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
    const dldFee = propertyPrice * Config.DLD_FEES.TRANSFER_FEE_RATE;
    const dldAdminFee = Config.DLD_FEES.ADMIN_FEE;
    const trusteeFee = isMortgage ? Config.DLD_FEES.TRUSTEE_FEE_MORTGAGE : Config.DLD_FEES.TRUSTEE_FEE_CASH;
    const agencyFee = propertyPrice * Config.REAL_ESTATE.AGENCY_COMMISSION_RATE;
    const agencyVAT = agencyFee * Config.REAL_ESTATE.VAT_RATE;
    const mortgageRegistration = isMortgage ? mortgageAmount * Config.DLD_FEES.MORTGAGE_REGISTRATION_RATE + Config.DLD_FEES.MORTGAGE_ADMIN_FEE : 0;
    const noC = Config.DLD_FEES.NOC_FEE;
    const valuationFee = Config.DLD_FEES.VALUATION_FEE;
    
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
