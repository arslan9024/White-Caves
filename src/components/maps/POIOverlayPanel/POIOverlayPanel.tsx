import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:300px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;padding:20px;backdrop-filter:blur(10px);box-shadow:0 10px 30px rgba(0,0,0,0.5)`;
const Title = styled.h3`margin:0 0 16px;font-size:1rem;font-weight:800;color:#E2E8F0`;

const ToggleList = styled.div`display:flex;flex-direction:column;gap:12px`;
const ToggleRow = styled.label`display:flex;align-items:center;gap:12px;cursor:pointer`;
const Check = styled.input.attrs({type:'checkbox'})`
  appearance:none;width:18px;height:18px;border:2px solid #64748B;border-radius:4px;
  &:checked { background:#38BDF8; border-color:#38BDF8; }
`;
const LText = styled.span`font-size:.85rem;color:#CBD5E1;font-weight:600`;
const Icon = styled.span`font-size:1.1rem;margin-left:auto`;

export const POIOverlayPanel: FC = () => {
  return (
    <Wrap data-testid="poi-overlay-panel">
      <Title>Map Overlays</Title>
      <ToggleList>
        <ToggleRow>
          <Check defaultChecked />
          <LText>Metro Stations</LText>
          <Icon>🚇</Icon>
        </ToggleRow>
        <ToggleRow>
          <Check defaultChecked />
          <LText>Schools & Education</LText>
          <Icon>🎓</Icon>
        </ToggleRow>
        <ToggleRow>
          <Check />
          <LText>Hospitals & Clinics</LText>
          <Icon>🏥</Icon>
        </ToggleRow>
        <ToggleRow>
          <Check />
          <LText>Malls & Retail</LText>
          <Icon>🛍️</Icon>
        </ToggleRow>
        <ToggleRow>
          <Check />
          <LText>Parks & Beaches</LText>
          <Icon>🏖️</Icon>
        </ToggleRow>
      </ToggleList>
    </Wrap>
  );
};
export default POIOverlayPanel;
