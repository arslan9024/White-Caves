import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:32px;color:#FFF`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:24px`;
const Title = styled.h2`margin:0;font-size:1.2rem;font-weight:900;color:#38BDF8`;
const GenBtn = styled.button`padding:8px 16px;background:#38BDF8;color:#0F172A;border:none;border-radius:8px;font-weight:800;cursor:pointer`;

const KeyRow = styled.div`background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);padding:16px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;margin-bottom:12px`;
const KName = styled.div`font-weight:800;color:#E2E8F0`;
const KString = styled.div`font-family:monospace;font-size:.9rem;color:#10B981;background:rgba(0,0,0,0.5);padding:8px 12px;border-radius:6px;margin-top:8px;letter-spacing:1px`;

const RevokeBtn = styled.button`padding:6px 12px;background:rgba(239,68,68,0.1);color:#EF4444;border:1px solid rgba(239,68,68,0.3);border-radius:6px;font-weight:700;font-size:.75rem;cursor:pointer`;

export const DeveloperAPIKeys: FC = () => {
  return (
    <Wrap data-testid="developer-api-keys">
      <Header>
        <Title>🔑 Developer API Keys</Title>
        <GenBtn>+ Generate New Key</GenBtn>
      </Header>
      
      <p style={{fontSize:'.85rem',color:'#94A3B8',marginBottom:24}}>Keys grant full access to the CRM backend. Do not share them publicly.</p>

      <KeyRow>
        <div>
          <KName>Zapier Production Webhooks</KName>
          <div style={{fontSize:'.75rem',color:'#94A3B8',marginTop:4}}>Last used: 2 mins ago</div>
          <KString>wc_prod_8f92a4b1c3d...</KString>
        </div>
        <RevokeBtn>Revoke</RevokeBtn>
      </KeyRow>

      <KeyRow>
        <div>
          <KName>Custom Website Lead Form</KName>
          <div style={{fontSize:'.75rem',color:'#94A3B8',marginTop:4}}>Last used: 1 hour ago</div>
          <KString>wc_prod_44a1b2c3d4e...</KString>
        </div>
        <RevokeBtn>Revoke</RevokeBtn>
      </KeyRow>
    </Wrap>
  );
};
export default DeveloperAPIKeys;
