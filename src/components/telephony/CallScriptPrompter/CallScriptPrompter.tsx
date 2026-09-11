import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#38BDF8`;

const ScriptBox = styled.div`background:rgba(30,41,59,0.5);border-left:4px solid #10B981;padding:20px;border-radius:8px;font-size:1.1rem;line-height:1.6;color:#E2E8F0;margin-bottom:24px`;
const Highlight = styled.span`background:rgba(245,158,11,0.2);color:#F59E0B;padding:0 4px;border-radius:4px`;

const Objections = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:12px`;
const ObjCard = styled.div`background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);padding:12px;border-radius:8px;cursor:pointer`;
const OTitle = styled.div`font-size:.8rem;color:#EF4444;font-weight:800;text-transform:uppercase;margin-bottom:4px`;
const OBody = styled.div`font-size:.85rem;color:#CBD5E1`;

export const CallScriptPrompter: FC = () => {
  return (
    <Wrap data-testid="call-script-prompter">
      <Title>Live Teleprompter: Off-Plan Pitch</Title>
      
      <ScriptBox>
        "Hi, is this <Highlight>[Client Name]</Highlight>? My name is Sarah from White Caves Real Estate. 
        I saw you downloaded the brochure for <Highlight>Oasis Towers</Highlight>. 
        Are you currently looking for an investment property or a place to live?"
      </ScriptBox>

      <div style={{fontSize:'.9rem',color:'#94A3B8',fontWeight:700,marginBottom:12}}>Quick Objection Handling:</div>
      <Objections>
        <ObjCard>
          <OTitle>Too Expensive</OTitle>
          <OBody>Focus on the 60/40 payment plan. It's only 10% down to secure the unit today.</OBody>
        </ObjCard>
        <ObjCard>
          <OTitle>Bad ROI</OTitle>
          <OBody>Highlight the upcoming Metro extension that will drive capital appreciation by 20%.</OBody>
        </ObjCard>
      </Objections>
    </Wrap>
  );
};
export default CallScriptPrompter;
