import React, { FC, useState } from 'react';
import styled from 'styled-components';

const ModelerContainer = styled.div`
  padding: 1.5rem;
  background: #1E293B;
  border: 2px solid #EF4444;
  border-radius: 16px;
  color: #FFFFFF;
`;

export const CapRateNoiModeler: FC = () => {
  const [purchasePrice, setPurchasePrice] = useState(25000000);
  const [grossRent, setGrossRent] = useState(2100000);
  const [operatingExpenses, setOperatingExpenses] = useState(350000);

  const noi = grossRent - operatingExpenses;
  const capRate = ((noi / purchasePrice) * 100).toFixed(2);

  return (
    <ModelerContainer data-testid="cap-rate-noi-modeler">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#EF4444' }}>🏢 Commercial CRE Building Cap Rate & NOI Modeler</h3>
        <span style={{ fontSize: '0.75rem', background: '#0F172A', color: '#10B981', padding: '4px 10px', borderRadius: '12px', border: '1px solid #10B981' }}>
          IRR Model Active
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px' }}>
        <div style={{ background: '#0F172A', padding: '12px', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Net Operating Income (NOI)</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>AED {noi.toLocaleString()}</div>
        </div>
        <div style={{ background: '#0F172A', padding: '12px', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Capitalization Rate (Cap Rate)</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>{capRate}%</div>
        </div>
        <div style={{ background: '#0F172A', padding: '12px', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Asset Purchase Price</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#EF4444', marginTop: '4px' }}>AED {(purchasePrice / 1000000).toFixed(1)}M</div>
        </div>
      </div>
    </ModelerContainer>
  );
};

export default CapRateNoiModeler;
