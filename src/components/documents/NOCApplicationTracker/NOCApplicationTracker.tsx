import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;display:flex;align-items:center;gap:8px`;

const StepFlow = styled.div`display:flex;flex-direction:column;gap:0;position:relative`;
const Line = styled.div`position:absolute;left:15px;top:20px;bottom:20px;width:2px;background:rgba(255,255,255,0.1)`;

const Step = styled.div`display:flex;align-items:flex-start;gap:16px;position:relative;margin-bottom:24px`;
const Node = styled.div<{$done:boolean,$active?:boolean}>`
  width:32px;height:32px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:900;z-index:2;
  background:${p=>p.$done?'#10B981':p.$active?'#38BDF8':'#1E293B'};
  color:${p=>p.$done||p.$active?'#FFF':'#64748B'};
  border:2px solid ${p=>p.$done?'#10B981':p.$active?'#38BDF8':'rgba(255,255,255,0.2)'};
`;
const SText = styled.div`flex:1;padding-top:6px`;
const SName = styled.div<{$active?:boolean}>`font-weight:800;font-size:.95rem;color:${p=>p.$active?'#38BDF8':'#E2E8F0'}`;
const SDesc = styled.div`font-size:.8rem;color:#94A3B8;margin-top:4px`;

export const NOCApplicationTracker: FC = () => {
  return (
    <Wrap data-testid="noc-application-tracker">
      <Title>📄 Developer NOC Tracker</Title>
      
      <div style={{background:'rgba(255,255,255,0.03)',padding:16,borderRadius:12,marginBottom:24}}>
        <div style={{fontSize:'.85rem',color:'#94A3B8'}}>Property: <strong style={{color:'#FFF'}}>Apt 1402, Marina Heights (Emaar)</strong></div>
        <div style={{fontSize:'.85rem',color:'#94A3B8',marginTop:4}}>Status: <strong style={{color:'#F59E0B'}}>Pending Developer Approval</strong></div>
      </div>

      <StepFlow>
        <Line />
        <Step>
          <Node $done={true}>✓</Node>
          <SText>
            <SName>Service Charges Cleared</SName>
            <SDesc>Seller paid AED 14,500 outstanding balance.</SDesc>
          </SText>
        </Step>
        <Step>
          <Node $done={true}>✓</Node>
          <SText>
            <SName>Application Submitted to Emaar</SName>
            <SDesc>Docs uploaded via Emaar e-Services portal.</SDesc>
          </SText>
        </Step>
        <Step>
          <Node $done={false} $active={true}>3</Node>
          <SText>
            <SName $active={true}>Under Review by Developer</SName>
            <SDesc>Usually takes 3-5 working days.</SDesc>
          </SText>
        </Step>
        <Step style={{marginBottom:0}}>
          <Node $done={false}>4</Node>
          <SText>
            <SName>NOC Issued</SName>
            <SDesc>Required for DLD Transfer appointment.</SDesc>
          </SText>
        </Step>
      </StepFlow>
    </Wrap>
  );
};
export default NOCApplicationTracker;
