import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;justify-content:space-between;align-items:center`;
const NewBtn = styled.button`padding:8px 16px;background:#3B82F6;color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:.8rem;cursor:pointer`;

const Kanban = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:20px`;
const Col = styled.div`background:rgba(30,41,59,0.3);border-radius:12px;padding:12px;min-height:400px`;
const ColTitle = styled.div`font-size:.85rem;font-weight:800;color:#94A3B8;text-transform:uppercase;margin-bottom:16px;display:flex;justify-content:space-between`;
const Count = styled.span`background:rgba(0,0,0,0.3);padding:2px 8px;border-radius:10px;font-size:.7rem;color:#E2E8F0`;

const Card = styled.div`background:rgba(15,23,42,0.8);border:1px solid rgba(100,116,139,0.3);border-radius:8px;padding:16px;margin-bottom:12px;cursor:grab`;
const CTitle = styled.div`font-size:.9rem;font-weight:700;color:#E2E8F0;margin-bottom:4px`;
const CSub = styled.div`font-size:.75rem;color:#94A3B8;margin-bottom:12px`;

const CBottom = styled.div`display:flex;justify-content:space-between;align-items:center`;
const CTag = styled.div<{$type:string}>`
  font-size:.65rem;font-weight:700;padding:4px 8px;border-radius:4px;
  background:${p=>p.$type==='hvac'?'rgba(56,189,248,0.15)':p.$type==='plumbing'?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)'};
  color:${p=>p.$type==='hvac'?'#38BDF8':p.$type==='plumbing'?'#10B981':'#F59E0B'};
`;
const Priority = styled.div<{$high:boolean}>`font-size:.8rem;color:${p=>p.$high?'#EF4444':'#94A3B8'}`;

export const MaintenanceTicketBoard: FC = () => {
  return (
    <Wrap data-testid="maintenance-ticket-board">
      <Title>
        <span>🛠️ Maintenance Tickets</span>
        <NewBtn>+ Log Ticket</NewBtn>
      </Title>

      <Kanban>
        <Col>
          <ColTitle><span>Open</span> <Count>2</Count></ColTitle>
          <Card>
            <CTitle>AC Not Cooling</CTitle>
            <CSub>Apt 1402, Marina Heights • T. Smith</CSub>
            <CBottom>
              <CTag $type="hvac">HVAC</CTag>
              <Priority $high={true}>P1</Priority>
            </CBottom>
          </Card>
          <Card>
            <CTitle>Leaking Kitchen Sink</CTitle>
            <CSub>Villa 12, Springs 4 • A. Khan</CSub>
            <CBottom>
              <CTag $type="plumbing">Plumbing</CTag>
              <Priority $high={false}>P3</Priority>
            </CBottom>
          </Card>
        </Col>

        <Col>
          <ColTitle><span>In Progress</span> <Count>1</Count></ColTitle>
          <Card>
            <CTitle>Broken Door Lock</CTitle>
            <CSub>Apt 205, Greens • Assigned to: FixIt L.L.C</CSub>
            <CBottom>
              <CTag $type="general">General</CTag>
              <Priority $high={true}>P2</Priority>
            </CBottom>
          </Card>
        </Col>

        <Col>
          <ColTitle><span>Resolved (Last 7 Days)</span> <Count>1</Count></ColTitle>
          <Card style={{opacity:0.6}}>
            <CTitle>Water Heater Replacement</CTitle>
            <CSub>Apt 44A, Princess Tower</CSub>
            <CBottom>
              <CTag $type="plumbing">Plumbing</CTag>
              <Priority $high={false}>Done</Priority>
            </CBottom>
          </Card>
        </Col>
      </Kanban>
    </Wrap>
  );
};
export default MaintenanceTicketBoard;
