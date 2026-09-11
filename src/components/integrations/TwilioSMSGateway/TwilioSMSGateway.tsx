import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;color:#F43F5E`;

const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:24px`;

const Field = styled.div`margin-bottom:16px`;
const Label = styled.label`display:block;font-size:.8rem;color:#94A3B8;font-weight:700;margin-bottom:8px`;
const Input = styled.input`width:100%;padding:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#FFF;font-size:.9rem;outline:none`;

const CreditBox = styled.div`background:linear-gradient(135deg,rgba(244,63,94,0.1),rgba(15,23,42,0.9));border:1px solid rgba(244,63,94,0.3);padding:24px;border-radius:12px;display:flex;flex-direction:column;justify-content:center;align-items:center`;
const CVal = styled.div`font-size:2.5rem;font-weight:900;color:#F43F5E;margin-bottom:4px`;
const CText = styled.div`font-size:.85rem;color:#E2E8F0;font-weight:700`;

export const TwilioSMSGateway: FC = () => {
  return (
    <Wrap data-testid="twilio-sms-gateway">
      <Title>ðŸ“± Twilio SMS Gateway</Title>
      
      <Grid>
        <div>
          <Field>
            <Label>Sender ID (Alphanumeric)</Label>
            <Input defaultValue="WHITE CAVES" maxLength={11} />
          </Field>
          <Field>
            <Label>Account SID</Label>
            <Input type="password" defaultValue="AC_ENTER_YOUR_SID_HERE_AND_SAVE" />
          </Field>
          <Field>
            <Label>Auth Token</Label>
            <Input type="password" defaultValue="********************************" />
          </Field>
        </div>
        
        <CreditBox>
          <CVal>8,420</CVal>
          <CText>SMS Credits Remaining</CText>
          <button style={{marginTop:16,padding:'8px 16px',background:'#F43F5E',color:'#FFF',border:'none',borderRadius:'6px',fontWeight:800,cursor:'pointer'}}>Auto-Refill: ON</button>
        </CreditBox>
      </Grid>
    </Wrap>
  );
};
export default TwilioSMSGateway;
