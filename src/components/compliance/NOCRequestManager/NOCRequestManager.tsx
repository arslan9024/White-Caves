import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;justify-content:space-between;align-items:center`;
const NewBtn = styled.button`padding:8px 16px;background:#10B981;color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:.8rem;cursor:pointer`;

const Kanban = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:20px`;
const Col = styled.div`background:rgba(30,41,59,0.3);border-radius:12px;padding:12px;min-height:300px`;
const ColTitle = styled.div`font-size:.8rem;font-weight:800;color:#94A3B8;text-transform:uppercase;margin-bottom:12px;display:flex;justify-content:space-between`;
const Count = styled.span`background:rgba(0,0,0,0.3);padding:2px 8px;border-radius:10px;font-size:.7rem;color:#E2E8F0`;

const Card = styled.div`background:rgba(15,23,42,0.8);border:1px solid rgba(100,116,139,0.3);border-radius:8px;padding:12px;margin-bottom:12px;cursor:grab`;
const CTitle = styled.div`font-size:.85rem;font-weight:700;color:#E2E8F0;margin-bottom:4px`;
const CSub = styled.div`font-size:.7rem;color:#94A3B8;margin-bottom:8px`;
const DevBadge = styled.div`display:inline-block;padding:2px 6px;background:rgba(56,189,248,0.1);color:#38BDF8;border-radius:4px;font-size:.65rem;font-weight:700`;

export const NOCRequestManager: FC = () => {
  return (
    <Wrap data-testid="noc-request-manager">
      <Title>
        <span>📑 NOC Requests Tracker</span>
        <NewBtn>+ New NOC Request</NewBtn>
      </Title>

      <Kanban>
        <Col>
          <ColTitle><span>Pending Submission</span> <Count>2</Count></ColTitle>
          <Card>
            <CTitle>Unit 402 - Marina Heights</CTitle>
            <CSub>Buyer: K. Ahmed • Seller: M. Al Fayed</CSub>
            <DevBadge>Emaar Properties</DevBadge>
          </Card>
          <Card>
            <CTitle>Villa 14 - Sidra</CTitle>
            <CSub>Buyer: J. Doe • Seller: L. Croft</CSub>
            <DevBadge>Emaar Properties</DevBadge>
          </Card>
        </Col>
        
        <Col>
          <ColTitle><span>Under Developer Review</span> <Count>1</Count></ColTitle>
          <Card>
            <CTitle>Apt 1104 - Burj Vista</CTitle>
            <CSub>Processing Fee Paid (AED 5,000)</CSub>
            <DevBadge>Emaar Properties</DevBadge>
          </Card>
        </Col>

        <Col>
          <ColTitle><span>NOC Issued / Ready</span> <Count>1</Count></ColTitle>
          <Card style={{borderColor:'rgba(16,185,129,0.3)'}}>
            <CTitle style={{color:'#10B981'}}>Unit 88 - Jumeirah Park</CTitle>
            <CSub>Valid until: 15 Oct 2026</CSub>
            <DevBadge>Nakheel</DevBadge>
          </Card>
        </Col>
      </Kanban>
    </Wrap>
  );
};
export default NOCRequestManager;
