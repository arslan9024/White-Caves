import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:350px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#FFF;border-radius:24px;overflow:hidden;padding:32px;color:#0F172A;box-shadow:0 20px 40px rgba(0,0,0,0.2)`;
const Title = styled.h2`margin:0 0 8px;font-size:1.4rem;font-weight:900;text-align:center`;
const Sub = styled.div`font-size:.85rem;color:#64748B;text-align:center;margin-bottom:24px`;

const AmountBox = styled.div`text-align:center;font-size:2.5rem;font-weight:900;color:#0F172A;margin-bottom:24px`;

const CardUI = styled.div`background:linear-gradient(135deg,#1E293B,#0F172A);border-radius:12px;padding:20px;color:#FFF;margin-bottom:24px;position:relative;overflow:hidden`;
const Chip = styled.div`width:40px;height:30px;background:linear-gradient(135deg,#FDE047,#EAB308);border-radius:6px;margin-bottom:16px`;
const CardNum = styled.div`font-size:1.1rem;font-family:monospace;letter-spacing:2px;margin-bottom:16px;color:#CBD5E1`;

const PayBtn = styled.button`width:100%;padding:16px;background:#10B981;color:#FFF;border:none;border-radius:12px;font-weight:900;font-size:1.1rem;cursor:pointer;transition:all .2s;&:hover{background:#059669;transform:translateY(-2px)}`;

export const PaymentGatewayTerminal: FC = () => {
  return (
    <Wrap data-testid="payment-gateway-terminal">
      <Title>Holding Deposit</Title>
      <Sub>Secure unit: Apt 1402, Marina Heights</Sub>

      <AmountBox>AED 10,000</AmountBox>

      <CardUI>
        <Chip />
        <CardNum>**** **** **** 4921</CardNum>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:'.8rem',color:'#94A3B8'}}>
          <span>Sarah Jenkins</span>
          <span>12/28</span>
        </div>
      </CardUI>

      <PayBtn>Process Payment</PayBtn>
      <div style={{textAlign:'center',fontSize:'.7rem',color:'#94A3B8',marginTop:12}}>🔒 Secured by Stripe</div>
    </Wrap>
  );
};
export default PaymentGatewayTerminal;
