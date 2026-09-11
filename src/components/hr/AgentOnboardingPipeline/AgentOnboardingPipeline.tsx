import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const Kanban = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:16px`;
const Col = styled.div`background:rgba(30,41,59,0.3);border-radius:12px;padding:12px;min-height:300px`;
const ColTitle = styled.div`font-size:.75rem;font-weight:800;color:#94A3B8;text-transform:uppercase;margin-bottom:12px;display:flex;justify-content:space-between`;

const Card = styled.div`background:rgba(15,23,42,0.8);border:1px solid rgba(100,116,139,0.3);border-radius:8px;padding:12px;margin-bottom:12px;cursor:grab`;
const CName = styled.div`font-size:.85rem;font-weight:700;color:#E2E8F0;margin-bottom:4px`;
const CDesc = styled.div`font-size:.65rem;color:#94A3B8`;

export const AgentOnboardingPipeline: FC = () => {
  return (
    <Wrap data-testid="agent-onboarding-pipeline">
      <Title>👩‍💼 Agent Onboarding Pipeline</Title>
      
      <Kanban>
        <Col>
          <ColTitle><span>1. Visa & ID (HR)</span></ColTitle>
          <Card>
            <CName>Elena Rostova</CName>
            <CDesc>Waiting for Emirates ID typing</CDesc>
          </Card>
        </Col>

        <Col>
          <ColTitle><span>2. RERA Exam Prep</span></ColTitle>
          <Card>
            <CName>Mark Davies</CName>
            <CDesc>Exam booked: 14 Oct</CDesc>
          </Card>
        </Col>

        <Col>
          <ColTitle><span>3. CRM & System Training</span></ColTitle>
          <Card>
            <CName>Sana Al Hashmi</CName>
            <CDesc>Completed: 2/5 Modules</CDesc>
          </Card>
        </Col>

        <Col>
          <ColTitle><span>4. Ready for Leads</span></ColTitle>
          <Card style={{borderColor:'rgba(16,185,129,0.3)'}}>
            <CName style={{color:'#10B981'}}>Tariq Mansoor</CName>
            <CDesc>Added to Round Robin</CDesc>
          </Card>
        </Col>
      </Kanban>
    </Wrap>
  );
};
export default AgentOnboardingPipeline;
