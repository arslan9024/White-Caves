/**
 * UAEMortgageCalculatorModal.tsx
 *
 * White Caves Real Estate LLC — Statutory UAE Mortgage & DLD Transfer Fee Calculator.
 * Models CBUAE Maximum Loan-To-Value (80% / 60%), DLD 4% Transfer Fees, Trustee Fees,
 * Title Deed issuance (AED 580), and monthly EMI amortization for prime UAE real estate.
 */

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface UAEMortgageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
}

export const UAEMortgageCalculatorModal: FC<UAEMortgageCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialPrice = 3200000,
}) => {
  const [propertyPrice, setPropertyPrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // 20% standard
  const [loanTenureYears, setLoanTenureYears] = useState(25);
  const [interestRate, setInterestRate] = useState(4.25); // 4.25% standard fixed

  if (!isOpen) return null;

  // Financial Calculations
  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPaymentAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalMonths = loanTenureYears * 12;
  
  const monthlyEMI =
    loanAmount > 0 && monthlyInterestRate > 0
      ? (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
      : 0;

  // Statutory DLD & Transaction Fees
  const dldTransferFee = propertyPrice * 0.04; // 4% DLD
  const dldAdminFee = 580; // Title Deed
  const registrationTrusteeFee = propertyPrice >= 500000 ? 4200 : 2100; // Registration Trustee (AED 4,000 + 5% VAT)
  const mortgageRegistrationFee = loanAmount > 0 ? loanAmount * 0.0025 + 290 : 0; // 0.25% + admin
  const agencyCommissionFee = propertyPrice * 0.02 * 1.05; // 2% + 5% VAT
  const totalUpfrontFees =
    downPaymentAmount +
    dldTransferFee +
    dldAdminFee +
    registrationTrusteeFee +
    mortgageRegistrationFee +
    agencyCommissionFee;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'inherit',
        }}
        data-testid="uae-mortgage-calculator-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '580px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            color: '#0F172A',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              padding: '1.5rem',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <span
                style={{
                  background: '#3B82F6',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                CBUAE & DLD Compliance Engine
              </span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.25rem', fontWeight: 800 }}>
                UAE Mortgage & Transaction Fee Calculator
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>
                Accurate monthly EMI and DLD transfer cost breakdown
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              ✕
            </button>
          </div>

          {/* Calculator Body */}
          <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
            {/* Price Input */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Property Value</label>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#EF4444' }}>
                  AED {propertyPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={250000}
                value={propertyPrice}
                onChange={e => setPropertyPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#EF4444' }}
              />
            </div>

            {/* Down Payment & Tenure Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Down Payment ({downPaymentPercent}%)
                </label>
                <select
                  value={downPaymentPercent}
                  onChange={e => setDownPaymentPercent(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                >
                  <option value={20}>20% (Standard UAE First Home)</option>
                  <option value={25}>25% (Expat Standard)</option>
                  <option value={30}>30% (High Equity)</option>
                  <option value={40}>40% (Second / Investment Home)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Tenure ({loanTenureYears} Years)
                </label>
                <select
                  value={loanTenureYears}
                  onChange={e => setLoanTenureYears(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                >
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={25}>25 Years (Max Standard)</option>
                </select>
              </div>
            </div>

            {/* Monthly Payment Hero Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Estimated Monthly Mortgage (EMI)
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1E40AF', margin: '4px 0' }}>
                AED {Math.round(monthlyEMI).toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>/ mo</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Based on {interestRate}% fixed rate over {loanTenureYears} years
              </span>
            </div>

            {/* Statutory Upfront Fee Breakdown */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0', fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                🏛️ Total Upfront Cash Required (Statutory UAE Fees):
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Down Payment ({downPaymentPercent}%):</span>
                <strong>AED {downPaymentAmount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Dubai Land Department (4% DLD Fee):</span>
                <strong>AED {dldTransferFee.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>DLD Trustee & Title Deed Fees:</span>
                <strong>AED {(registrationTrusteeFee + dldAdminFee).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Mortgage Registration (0.25% + admin):</span>
                <strong>AED {Math.round(mortgageRegistrationFee).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #CBD5E1', paddingTop: '6px', marginTop: '6px' }}>
                <span style={{ fontWeight: 800 }}>Total Upfront Required:</span>
                <strong style={{ color: '#EF4444', fontSize: '0.9rem' }}>
                  AED {Math.round(totalUpfrontFees).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UAEMortgageCalculatorModal;
