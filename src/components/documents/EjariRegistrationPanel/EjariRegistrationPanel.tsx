import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:350px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(135deg,#0F172A,#1E293B);border:1px solid rgba(16,185,129,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF;box-shadow:0 10px 30px rgba(0,0,0,0.5)`;
const Title = styled.h2`margin:0 0 16px;font-size:1.1rem;font-weight:900;color:#10B981`;

const StatusBox = styled.div`background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.4);padding:16px;border-radius:12px;text-align:center;margin-bottom:20px`;
const SText = styled.div`font-size:1.2rem;font-weight:900;color:#10B981;letter-spacing:1px;margin-bottom:4px`;
const SNum = styled.div`font-family:monospace;font-size:.85rem;color:#E2E8F0`;

const DetailRow = styled.div`display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:.85rem`;
const Label = styled.div`color:#94A3B8`;
const Val = styled.div`font-weight:700;color:#FFF`;

const Btn = styled.button`width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#FFF;font-weight:800;margin-top:20px;cursor:pointer;transition:all .2s;&:hover{background:rgba(255,255,255,0.1)}`;

export const EjariRegistrationPanel: FC = () => {
  return (
    <Wrap data-testid="ejari-registration-panel">
      <Title>🏡 Ejari Registration</Title>
      
      <StatusBox>
        <SText>REGISTERED ✓</SText>
        <SNum>EJ-2026-998842</SNum>
      </StatusBox>

      <DetailRow><Label>Tenant</Label><Val>Sarah Jenkins</Val></DetailRow>
      <DetailRow><Label>Property</Label><Val>Apt 405, Greens</Val></DetailRow>
      <DetailRow><Label>Start Date</Label><Val>01 Sep 2026</Val></DetailRow>
      <DetailRow><Label>End Date</Label><Val>31 Aug 2027</Val></DetailRow>
      <DetailRow style={{border:0}}><Label>Rent (AED)</Label><Val>120,000 / year</Val></DetailRow>

      <Btn>Download Ejari Certificate (PDF)</Btn>
    </Wrap>
  );
};
export default EjariRegistrationPanel;
