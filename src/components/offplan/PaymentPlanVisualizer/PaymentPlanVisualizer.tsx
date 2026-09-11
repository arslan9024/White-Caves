import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800`;

const Timeline = styled.div`display:flex;flex-direction:column;gap:12px`;

const Milestone = styled.div<{$paid?:boolean}>`
  display:flex;justify-content:space-between;align-items:center;padding:16px;border-radius:12px;
  background:${p=>p.$paid?'rgba(16,185,129,0.1)':'rgba(255,255,255,0.03)'};
  border:1px solid ${p=>p.$paid?'rgba(16,185,129,0.3)':'rgba(255,255,255,0.05)'};
`;

const Pct = styled.div<{$paid?:boolean}>`font-size:1.5rem;font-weight:900;color:${p=>p.$paid?'#10B981':'#38BDF8'};width:60px`;
const Detail = styled.div`flex:1`;
const DTitle = styled.div`font-weight:800;color:#E2E8F0`;
const DDate = styled.div`font-size:.8rem;color:#94A3B8;margin-top:2px`;
const Amt = styled.div`font-weight:900;font-size:1.1rem;color:#FFF`;

export const PaymentPlanVisualizer: FC = () => {
  return (
    <Wrap data-testid="payment-plan-visualizer">
      <Title>💳 Payment Plan (60/40)</Title>
      
      <Timeline>
        <Milestone $paid={true}>
          <Pct $paid={true}>20%</Pct>
          <Detail>
            <DTitle>Booking Deposit</DTitle>
            <DDate>Paid on 12 Aug 2026</DDate>
          </Detail>
          <Amt>AED 400,000</Amt>
        </Milestone>
        
        <Milestone>
          <Pct>10%</Pct>
          <Detail>
            <DTitle>1st Installment</DTitle>
            <DDate>Due 12 Feb 2027</DDate>
          </Detail>
          <Amt>AED 200,000</Amt>
        </Milestone>

        <Milestone>
          <Pct>30%</Pct>
          <Detail>
            <DTitle>During Construction (1% Monthly)</DTitle>
            <DDate>Mar 2027 - Aug 2029</DDate>
          </Detail>
          <Amt>AED 600,000</Amt>
        </Milestone>

        <Milestone style={{border:'1px dashed #38BDF8',background:'transparent'}}>
          <Pct style={{color:'#FFF'}}>40%</Pct>
          <Detail>
            <DTitle>On Handover</DTitle>
            <DDate>Expected Q4 2029</DDate>
          </Detail>
          <Amt>AED 800,000</Amt>
        </Milestone>
      </Timeline>
    </Wrap>
  );
};
export default PaymentPlanVisualizer;
