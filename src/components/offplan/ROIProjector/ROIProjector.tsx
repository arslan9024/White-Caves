import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:900`;

const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px`;
const Box = styled.div`background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);padding:20px;border-radius:12px`;
const BTitle = styled.div`font-size:.8rem;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px`;
const BVal = styled.div`font-size:2rem;font-weight:900;color:#10B981`;
const BSub = styled.div`font-size:.85rem;color:#CBD5E1;margin-top:4px`;

const Note = styled.div`background:rgba(56,189,248,0.1);border-left:4px solid #38BDF8;padding:12px;font-size:.85rem;color:#E2E8F0;margin-top:24px;border-radius:0 8px 8px 0`;

export const ROIProjector: FC = () => {
  return (
    <Wrap data-testid="roi-projector">
      <Title>📊 Handover ROI Projection</Title>
      
      <Grid>
        <Box>
          <BTitle>Est. Rental Yield</BTitle>
          <BVal>7.2%</BVal>
          <BSub>Net / Year (Short-Term)</BSub>
        </Box>
        <Box>
          <BTitle>Capital Appreciation</BTitle>
          <BVal>+ 15%</BVal>
          <BSub>Expected on Handover</BSub>
        </Box>
      </Grid>

      <Note>
        <strong>Market Insight:</strong> 1-bed units in this community historically see a 12-18% price bump immediately following completion due to high end-user demand.
      </Note>
    </Wrap>
  );
};
export default ROIProjector;
