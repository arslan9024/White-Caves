import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:700px;font-family:'Times New Roman',serif;animation:${fadeIn} .4s ease;background:#FFF;border:1px solid #E2E8F0;padding:40px;color:#000;box-shadow:0 10px 20px rgba(0,0,0,0.1)`;

const Header = styled.div`display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:16px;margin-bottom:24px`;
const Title = styled.h1`margin:0;font-size:1.4rem;text-transform:uppercase;font-weight:900`;

const Section = styled.div`margin-bottom:24px`;
const SecTitle = styled.h2`font-size:1rem;margin:0 0 12px;background:#F1F5F9;padding:8px`;

const Row = styled.div`display:flex;margin-bottom:8px;font-size:.9rem`;
const Label = styled.div`width:200px;font-weight:700`;
const Val = styled.div`flex:1;border-bottom:1px solid #CBD5E1;padding-bottom:2px`;

const TermList = styled.ul`font-size:.85rem;line-height:1.6;padding-left:20px`;

export const RERAFormBViewer: FC = () => {
  return (
    <Wrap data-testid="rera-form-b-viewer">
      <Header>
        <div>
          <Title>Form B</Title>
          <div style={{fontSize:'.8rem',marginTop:4}}>Buyer's Agent Agreement</div>
        </div>
        <div style={{fontWeight:800,color:'#EF4444',border:'2px solid #EF4444',padding:'4px 8px',transform:'rotate(-5deg)'}}>DIGITALLY SIGNED</div>
      </Header>

      <Section>
        <SecTitle>1. Buyer Details</SecTitle>
        <Row><Label>Full Name:</Label><Val>James Montgomery</Val></Row>
        <Row><Label>Passport No:</Label><Val>UK99887766</Val></Row>
      </Section>

      <Section>
        <SecTitle>2. Property Requirements</SecTitle>
        <Row><Label>Required Areas:</Label><Val>Downtown Dubai, DIFC</Val></Row>
        <Row><Label>Max Budget (AED):</Label><Val>8,000,000</Val></Row>
        <Row><Label>Purpose:</Label><Val>Investment (ROI Target &gt; 6%)</Val></Row>
      </Section>

      <Section>
        <SecTitle>3. Agency Terms</SecTitle>
        <TermList>
          <li>The Buyer appoints White Caves Real Estate as their exclusive agent.</li>
          <li>A standard commission of 2% (+VAT) applies upon successful transfer.</li>
          <li>Agreement valid for 90 days from the date of digital execution.</li>
        </TermList>
      </Section>
    </Wrap>
  );
};
export default RERAFormBViewer;
