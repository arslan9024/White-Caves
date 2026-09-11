import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%{opacity:1}50%{opacity:0.4}100%{opacity:1}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;align-items:center;gap:8px`;
const LiveDot = styled.div`width:8px;height:8px;background:#10B981;border-radius:4px;animation:${pulse} 1.5s infinite`;

const SyncCard = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.3);border-radius:12px;padding:16px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center`;

const LeftBox = styled.div`display:flex;align-items:center;gap:16px`;
const Logo = styled.div`width:40px;height:40px;background:#FFF;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;color:#0F172A;font-size:.8rem`;
const Info = styled.div``;
const PName = styled.div`font-size:.95rem;font-weight:700;color:#E2E8F0`;
const LastSync = styled.div`font-size:.7rem;color:#94A3B8;margin-top:4px`;

const RightBox = styled.div`text-align:right`;
const Status = styled.div<{$ok:boolean}>`font-size:.85rem;font-weight:800;color:${p=>p.$ok?'#10B981':'#EF4444'};margin-bottom:4px`;
const ListingsCount = styled.div`font-size:.7rem;color:#94A3B8`;

export const PortalSyncStatusMonitor: FC = () => {
  return (
    <Wrap data-testid="portal-sync-monitor">
      <Title><span>🌐 External Portals XML Sync</span> <LiveDot/></Title>
      
      <SyncCard>
        <LeftBox>
          <Logo>PF</Logo>
          <Info>
            <PName>PropertyFinder UAE</PName>
            <LastSync>Last successful sync: 2 mins ago</LastSync>
          </Info>
        </LeftBox>
        <RightBox>
          <Status $ok={true}>Healthy</Status>
          <ListingsCount>412 Active Listings</ListingsCount>
        </RightBox>
      </SyncCard>

      <SyncCard>
        <LeftBox>
          <Logo style={{color:'#EF4444'}}>BY</Logo>
          <Info>
            <PName>Bayut.com</PName>
            <LastSync>Last successful sync: 15 mins ago</LastSync>
          </Info>
        </LeftBox>
        <RightBox>
          <Status $ok={false}>API Error (401)</Status>
          <ListingsCount>Retrying in 5m...</ListingsCount>
        </RightBox>
      </SyncCard>
    </Wrap>
  );
};
export default PortalSyncStatusMonitor;
