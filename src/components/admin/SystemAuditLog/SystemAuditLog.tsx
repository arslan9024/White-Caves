import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;color:#F43F5E`;

const LogList = styled.div`display:flex;flex-direction:column;gap:8px`;
const LogRow = styled.div`display:flex;align-items:flex-start;gap:12px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;font-family:monospace;font-size:.85rem`;
const LTime = styled.div`color:#94A3B8;white-space:nowrap`;
const LUser = styled.div`color:#38BDF8;font-weight:700;width:120px`;
const LAct = styled.div`color:#E2E8F0;flex:1`;
const LType = styled.div<{$t:string}>`
  padding:2px 6px;border-radius:4px;font-size:.7rem;font-weight:800;
  background:${p=>p.$t==='DELETE'?'rgba(239,68,68,0.2)':'rgba(16,185,129,0.2)'};
  color:${p=>p.$t==='DELETE'?'#EF4444':'#10B981'};
`;

export const SystemAuditLog: FC = () => {
  return (
    <Wrap data-testid="system-audit-log">
      <Title>👁️ System Audit Log</Title>
      
      <LogList>
        <LogRow>
          <LTime>10:42:15 AM</LTime>
          <LUser>sarah.j@</LUser>
          <LType $t="UPDATE">UPDATE</LType>
          <LAct>Modified deal #4492 (Status: Pending -&gt; Closed Won)</LAct>
        </LogRow>
        <LogRow>
          <LTime>09:15:02 AM</LTime>
          <LUser>admin.root@</LUser>
          <LType $t="DELETE">DELETE</LType>
          <LAct>Permanently deleted lead #9921 (Requested by User)</LAct>
        </LogRow>
        <LogRow>
          <LTime>08:30:00 AM</LTime>
          <LUser>system</LUser>
          <LType $t="UPDATE">UPDATE</LType>
          <LAct>Automated DB Backup completed successfully (Region: me-south-1)</LAct>
        </LogRow>
      </LogList>
    </Wrap>
  );
};
export default SystemAuditLog;
