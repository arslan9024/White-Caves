import React, { FC, useState } from 'react';
import styled from 'styled-components';

const SessionsContainer = styled.div`
  padding: 1.25rem;
  background: #0F172A;
  border: 2px solid #EF4444;
  border-radius: 14px;
  color: #FFFFFF;
  margin-top: 1rem;
`;

const SessionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #1E293B;
  border-radius: 8px;
  margin-top: 8px;
`;

export const ActiveLoginSessionsList: FC = () => {
  const [revoked, setRevoked] = useState(false);

  return (
    <SessionsContainer data-testid="active-login-sessions-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: '#EF4444' }}>💻 Active Login Sessions</h4>
        <button
          onClick={() => setRevoked(true)}
          style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', color: '#EF4444', padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
        >
          {revoked ? '✓ Other Devices Revoked' : 'Revoke All Other Devices'}
        </button>
      </div>

      <SessionRow>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block' }}>Chrome 124 (Windows 11) — Current Session</span>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>IP: 192.168.1.1 · Dubai, UAE · Active Now</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>ACTIVE</span>
      </SessionRow>

      {!revoked && (
        <SessionRow>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block' }}>Safari (iPhone 15 Pro)</span>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>IP: 86.98.11.45 · Dubai Marina · 2h ago</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>IDLE</span>
        </SessionRow>
      )}
    </SessionsContainer>
  );
};

export default ActiveLoginSessionsList;
