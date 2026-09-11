import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;justify-content:space-between`;
const ReqBtn = styled.button`padding:8px 16px;background:#3B82F6;color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:.8rem;cursor:pointer`;

const ReqList = styled.div`display:flex;flex-direction:column;gap:12px`;
const ReqCard = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.3);border-radius:12px;padding:16px;display:flex;justify-content:space-between;align-items:center`;

const RName = styled.div`font-size:.9rem;font-weight:800;color:#E2E8F0`;
const RDates = styled.div`font-size:.75rem;color:#94A3B8;margin-top:4px`;

const Status = styled.div<{$status:'pending'|'approved'}>`
  padding:4px 12px;border-radius:6px;font-size:.7rem;font-weight:800;text-transform:uppercase;
  background:${p=>p.$status==='pending'?'rgba(245,158,11,0.15)':'rgba(16,185,129,0.15)'};
  color:${p=>p.$status==='pending'?'#F59E0B':'#10B981'};
`;

const Actions = styled.div`display:flex;gap:8px`;
const ActionBtn = styled.button<{$act:'ok'|'no'}>`padding:6px 12px;border-radius:6px;border:none;font-size:.7rem;font-weight:700;cursor:pointer;background:${p=>p.$act==='ok'?'#10B981':'#EF4444'};color:#FFF`;

export const LeaveRequestManager: FC = () => {
  return (
    <Wrap data-testid="leave-request-manager">
      <Title>
        <span>🌴 Annual Leave & Time Off</span>
        <ReqBtn>Request Leave</ReqBtn>
      </Title>
      
      <ReqList>
        <ReqCard>
          <div>
            <RName>Laila O. (Compliance)</RName>
            <RDates>Annual Leave: 20 Dec 2026 - 05 Jan 2027 (12 days)</RDates>
          </div>
          <Actions>
            <ActionBtn $act="ok">Approve</ActionBtn>
            <ActionBtn $act="no">Reject</ActionBtn>
          </Actions>
        </ReqCard>
        
        <ReqCard>
          <div>
            <RName>Ivan Petrov (Sales)</RName>
            <RDates>Sick Leave: 10 Sep 2026 (1 day)</RDates>
          </div>
          <Status $status="approved">Approved</Status>
        </ReqCard>
      </ReqList>
    </Wrap>
  );
};
export default LeaveRequestManager;
