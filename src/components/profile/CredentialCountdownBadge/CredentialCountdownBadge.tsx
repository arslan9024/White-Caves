import React, { FC } from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.div`
  padding: 1.25rem;
  background: #1E293B;
  border: 2px solid #EF4444;
  border-radius: 14px;
  color: #FFFFFF;
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const CredentialItem = styled.div`
  padding: 10px;
  background: #0F172A;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;

  .days {
    font-size: 1.1rem;
    font-weight: 800;
    color: #10B981;
    margin-top: 4px;
  }
`;

export const CredentialCountdownBadge: FC = () => {
  return (
    <BadgeContainer data-testid="credential-countdown-badge">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: '#EF4444' }}>🏛️ Governing Credentials Renewal Countdown</h4>
        <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>✓ All Active</span>
      </div>

      <BadgeGrid>
        <CredentialItem>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>DET License</span>
          <div className="days">717 Days</div>
        </CredentialItem>
        <CredentialItem>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>RERA ORN</span>
          <div className="days">717 Days</div>
        </CredentialItem>
        <CredentialItem>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>HQ Ejari</span>
          <div className="days">365 Days</div>
        </CredentialItem>
        <CredentialItem>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>ICP Card</span>
          <div className="days">749 Days</div>
        </CredentialItem>
      </BadgeGrid>
    </BadgeContainer>
  );
};

export default CredentialCountdownBadge;
