import React, { FC, useState } from 'react';
import styled from 'styled-components';

const PinContainer = styled.div`
  padding: 1.5rem;
  background: #1E293B;
  border: 2px solid #EF4444;
  border-radius: 16px;
  color: #FFFFFF;
`;

export const SmartLockPinGenerator: FC = () => {
  const [pin, setPin] = useState('481920');

  const generateNewPin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPin(randomPin);
  };

  return (
    <PinContainer data-testid="smart-lock-pin-generator">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: '#EF4444' }}>🔑 IoT Smart Lock PIN Generator (Self-Guided Viewings)</h4>
        <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>IoT Lock Online</span>
      </div>

      <div style={{ padding: '1rem', background: '#0F172A', borderRadius: '8px', textAlign: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Temporary 1-Hour Access PIN</span>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#EF4444', letterSpacing: '6px', margin: '8px 0' }}>
          {pin}
        </div>
        <button
          onClick={generateNewPin}
          style={{ padding: '6px 14px', background: '#EF4444', border: 'none', borderRadius: '6px', color: '#FFF', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Generate New Temporary PIN
        </button>
      </div>
    </PinContainer>
  );
};

export default SmartLockPinGenerator;
