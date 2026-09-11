import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const RuleBox = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.3);border-radius:12px;padding:20px;margin-bottom:16px`;
const RuleHeader = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:16px`;
const RName = styled.div`font-size:.9rem;font-weight:700;color:#38BDF8`;
const Priority = styled.div`font-size:.65rem;color:#94A3B8;background:rgba(0,0,0,0.3);padding:4px 8px;border-radius:4px`;

const LogicRow = styled.div`display:flex;align-items:center;gap:12px;margin-bottom:12px`;
const LogicToken = styled.div`font-size:.75rem;font-weight:800;color:#F59E0B`;
const Select = styled.select`padding:8px 12px;border-radius:6px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.8rem;outline:none`;

const ActionRow = styled.div`display:flex;align-items:center;gap:12px;margin-top:16px;padding-top:16px;border-top:1px dashed rgba(100,116,139,0.3)`;

const AddBtn = styled.button`width:100%;padding:12px;background:transparent;border:1px dashed rgba(100,116,139,0.5);color:#94A3B8;border-radius:12px;font-weight:700;cursor:pointer;transition:all .2s;&:hover{background:rgba(100,116,139,0.1)}`;

export const LeadRoutingRuleEngine: FC = () => {
  return (
    <Wrap data-testid="lead-routing-engine">
      <Title>🔀 Lead Routing Engine</Title>
      
      <RuleBox>
        <RuleHeader>
          <RName>Russian Speaking High-Net-Worth</RName>
          <Priority>Priority: 1</Priority>
        </RuleHeader>
        <LogicRow>
          <LogicToken>IF</LogicToken>
          <Select defaultValue="lang"><option value="lang">Language</option></Select>
          <Select defaultValue="eq"><option value="eq">Equals</option></Select>
          <Select defaultValue="ru"><option value="ru">Russian</option></Select>
        </LogicRow>
        <LogicRow>
          <LogicToken>AND</LogicToken>
          <Select defaultValue="budget"><option value="budget">Budget</option></Select>
          <Select defaultValue="gt"><option value="gt">Greater Than</option></Select>
          <Select defaultValue="5m"><option value="5m">AED 5,000,000</option></Select>
        </LogicRow>
        <ActionRow>
          <LogicToken style={{color:'#10B981'}}>THEN ROUTE TO</LogicToken>
          <Select defaultValue="agent"><option value="agent">Agent: Ivan Petrov</option></Select>
        </ActionRow>
      </RuleBox>

      <RuleBox>
        <RuleHeader>
          <RName>General Off-Plan Inquiries</RName>
          <Priority>Priority: 2</Priority>
        </RuleHeader>
        <LogicRow>
          <LogicToken>IF</LogicToken>
          <Select defaultValue="type"><option value="type">Property Type</option></Select>
          <Select defaultValue="eq"><option value="eq">Equals</option></Select>
          <Select defaultValue="offplan"><option value="offplan">Off-Plan</option></Select>
        </LogicRow>
        <ActionRow>
          <LogicToken style={{color:'#10B981'}}>THEN ROUTE TO</LogicToken>
          <Select defaultValue="rr"><option value="rr">Round Robin: Primary Sales Team</option></Select>
        </ActionRow>
      </RuleBox>

      <AddBtn>+ Add New Rule</AddBtn>
    </Wrap>
  );
};
export default LeadRoutingRuleEngine;
