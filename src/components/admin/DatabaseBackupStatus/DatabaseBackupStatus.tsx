import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:300px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF;box-shadow:0 10px 30px rgba(0,0,0,0.5)`;
const Title = styled.h2`margin:0 0 16px;font-size:1rem;font-weight:800;color:#94A3B8`;

const StatusBox = styled.div`text-align:center;padding:20px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;margin-bottom:16px`;
const Icon = styled.div`font-size:2.5rem;margin-bottom:8px`;
const StatText = styled.div`font-size:1.1rem;font-weight:900;color:#10B981`;

const DetailRow = styled.div`display:flex;justify-content:space-between;font-size:.8rem;color:#CBD5E1;margin-bottom:8px`;

export const DatabaseBackupStatus: FC = () => {
  return (
    <Wrap data-testid="database-backup-status">
      <Title>☁️ Cloud Infrastructure</Title>
      
      <StatusBox>
        <Icon>🛡️</Icon>
        <StatText>Systems Secure</StatText>
      </StatusBox>

      <DetailRow>
        <span>Last Automated Backup:</span>
        <span style={{fontWeight:800}}>02:00 AM Today</span>
      </DetailRow>
      <DetailRow>
        <span>Database Size:</span>
        <span style={{fontWeight:800}}>14.2 GB</span>
      </DetailRow>
      <DetailRow>
        <span>Replication:</span>
        <span style={{fontWeight:800}}>me-south-1 (Dubai)</span>
      </DetailRow>
    </Wrap>
  );
};
export default DatabaseBackupStatus;
