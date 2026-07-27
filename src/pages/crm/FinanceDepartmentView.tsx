import React, { FC, useState } from 'react';

// --- STYLING CONSTANTS (WHITE CAVES CORPORATE PALETTE) ---
const RED = '#EF4444';
const WHITE = '#FFFFFF';
const BORDER_COLOR = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';

// --- CURRENCY CONVERSION CONSTANTS ---
const AED_TO_USD = 0.272294;
const AED_TO_EUR = 0.252391;
const AED_TO_GBP = 0.215284;
const AED_TO_INR = 22.75; // Pre-calculated local cache rate

export const FinanceDepartmentView: FC = () => {
  const [conversionAmount, setConversionAmount] = useState<number>(1000000); // 1,000,000 AED

  const convertCurrency = (aed: number, currency: 'USD' | 'EUR' | 'GBP' | 'INR') => {
    switch (currency) {
      case 'USD': return aed * AED_TO_USD;
      case 'EUR': return aed * AED_TO_EUR;
      case 'GBP': return aed * AED_TO_GBP;
      case 'INR': return aed * AED_TO_INR;
      default: return aed;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
        <h3 style={{ color: RED, marginTop: 0 }}>Zero-Overhead Client Currency Conversion</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Amount in AED:</label>
          <input
            type="number"
            value={conversionAmount}
            onChange={(e) => setConversionAmount(Number(e.target.value))}
            style={{ padding: '8px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px' }}
          />
          <div style={{ marginTop: '12px', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>USD Equivalent: <strong>${convertCurrency(conversionAmount, 'USD').toLocaleString()} USD</strong></div>
            <div>EUR Equivalent: <strong>€{convertCurrency(conversionAmount, 'EUR').toLocaleString()} EUR</strong></div>
            <div>GBP Equivalent: <strong>£{convertCurrency(conversionAmount, 'GBP').toLocaleString()} GBP</strong></div>
            <div>INR Equivalent: <strong>₹{convertCurrency(conversionAmount, 'INR').toLocaleString()} INR</strong></div>
          </div>
        </div>
      </div>

      <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
        <h3 style={{ color: RED, marginTop: 0 }}>Escrow Accounts & Milestone Trackers</h3>
        <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '10px', background: WHITE, borderRadius: '4px', borderLeft: `4px solid ${RED}` }}>
            <strong>Escrow Account A (DAMAC Hills 2 Tower):</strong> Active
            <br />
            Escrow Balance: <strong>142,500,000 AED</strong>
          </div>
          <div style={{ padding: '10px', background: WHITE, borderRadius: '4px', borderLeft: `4px solid ${RED}` }}>
            <strong>Milestone 1 (Foundation Poured):</strong> Completed & Released (12M AED)
          </div>
          <div style={{ padding: '10px', background: WHITE, borderRadius: '4px', borderLeft: `4px solid ${RED}` }}>
            <strong>Milestone 2 (Superstructure 50%):</strong> Verification Pending DLD inspection
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDepartmentView;
