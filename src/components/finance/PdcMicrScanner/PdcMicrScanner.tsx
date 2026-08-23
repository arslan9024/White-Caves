import React, { FC } from 'react';
import styled from 'styled-components';

const ScannerContainer = styled.div`
  padding: 1.5rem;
  background: #1E293B;
  border: 2px solid #EF4444;
  border-radius: 16px;
  color: #FFFFFF;
`;

export const PdcMicrScanner: FC = () => {
  return (
    <ScannerContainer data-testid="pdc-micr-scanner">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: 'var(--accent-red, #EF4444)' }}>💳 PDC Cheque Vault & MICR Line OCR Scanner</h4>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-green, #10B981)', fontWeight: 800 }}>✓ Bank Clearance Active</span>
      </div>

      <div style={{ padding: '1.5rem', border: '2px dashed rgba(239,68,68,0.4)', borderRadius: '10px', textAlign: 'center', background: 'var(--color-0f172a, #0F172A)' }}>
        <span style={{ fontSize: '2rem' }}>🧾</span>
        <p style={{ margin: '8px 0 0', fontSize: '0.85rem', fontWeight: 'bold' }}>Scan or Upload Emirates NBD / FAB PDC Cheque</p>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Automated MICR routing code extraction & 7-day deposit alert</span>
      </div>
    </ScannerContainer>
  );
};

export default PdcMicrScanner;
