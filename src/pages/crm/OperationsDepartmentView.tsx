import React, { FC } from 'react';

// --- STYLING CONSTANTS (WHITE CAVES CORPORATE PALETTE) ---
const RED = '#EF4444';
const BORDER_COLOR = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';

export const OperationsDepartmentView: FC = () => {
  return (
    <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
      <h3 style={{ color: RED, marginTop: 0 }}>High-Density Tabular Viewport (Managed Units)</h3>
      <p>Total Managed Portfolios in DAMAC Hills 2: <strong>9,378+ Managed Units</strong></p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ background: '#E2E8F0', borderBottom: `2px solid ${RED}` }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Unit Reference</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Cluster Block</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Occupancy State</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Active Tenant</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--text-secondary, #E2E8F0)' }}>
            <td style={{ padding: '8px' }}>DH2-VL-9421</td>
            <td style={{ padding: '8px' }}>Vardon Cluster</td>
            <td style={{ padding: '8px', color: RED, fontWeight: 'bold' }}>Leased (Occupied)</td>
            <td style={{ padding: '8px' }}>Alex Rivera</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--text-secondary, #E2E8F0)' }}>
            <td style={{ padding: '8px' }}>DH2-TH-0284</td>
            <td style={{ padding: '8px' }}>Amazonia Cluster</td>
            <td style={{ padding: '8px', fontWeight: 'bold' }}>Vacant (Available)</td>
            <td style={{ padding: '8px' }}>-</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--text-secondary, #E2E8F0)' }}>
            <td style={{ padding: '8px' }}>DH2-AP-1049</td>
            <td style={{ padding: '8px' }}>Claret Block B</td>
            <td style={{ padding: '8px', fontWeight: 'bold' }}>Maintenance Underway</td>
            <td style={{ padding: '8px' }}>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OperationsDepartmentView;
