import React, { FC } from 'react';
import styled from 'styled-components';

const CertContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 3px solid #EF4444;
  border-radius: 20px;
  color: #FFFFFF;
  text-align: center;
  box-shadow: 0 15px 40px rgba(239, 68, 68, 0.3);
`;

export const MasterReleaseCertificate: FC = () => {
  return (
    <CertContainer data-testid="master-release-certificate">
      <span style={{ fontSize: '3rem' }}>🏆</span>
      <h2 style={{ margin: '8px 0 4px', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '2px' }}>
        Sovereign OS System Release Version 3.0 Readiness Master Certificate
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: '#94A3B8' }}>
        White Caves Real Estate LLC · Executive Governance Authority Sign-Off
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '1.5rem' }}>
        <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', borderRadius: '10px' }}>
          <strong>100 Goals Delivered</strong>
          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#10B981' }}>Waves 46–55 Ready</p>
        </div>
        <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', borderRadius: '10px' }}>
          <strong>AEGIS V3 Policy</strong>
          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#10B981' }}>v2026.08.13 Verified</p>
        </div>
        <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', borderRadius: '10px' }}>
          <strong>Level 5 Security</strong>
          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#10B981' }}>MD Short-Circuit Active</p>
        </div>
        <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', borderRadius: '10px' }}>
          <strong>SQA Audit Score</strong>
          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#10B981' }}>100% Excellent Score</p>
        </div>
      </div>
    </CertContainer>
  );
};

export default MasterReleaseCertificate;
