import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:700px;font-family:'Times New Roman',serif;animation:${fadeIn} .4s ease;background:#FFF;border:1px solid #E2E8F0;padding:40px;color:#000;box-shadow:0 10px 20px rgba(0,0,0,0.1)`;

const Header = styled.div`display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:16px;margin-bottom:24px`;
const Title = styled.h1`margin:0;font-size:1.4rem;text-transform:uppercase;font-weight:900`;
const DLDLogo = styled.div`width:80px;height:40px;background:#E2E8F0;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:.7rem;font-weight:800;color:#64748B`;

const Section = styled.div`margin-bottom:24px`;
const SecTitle = styled.h2`font-size:1rem;margin:0 0 12px;background:#F1F5F9;padding:8px`;

const Row = styled.div`display:flex;margin-bottom:8px;font-size:.9rem`;
const Label = styled.div`width:200px;font-weight:700`;
const Val = styled.div`flex:1;border-bottom:1px solid #CBD5E1;padding-bottom:2px`;

const SigArea = styled.div`display:flex;justify-content:space-between;margin-top:60px`;
const SigBox = styled.div`width:200px;border-top:1px dashed #000;padding-top:8px;text-align:center;font-size:.8rem`;

export const RERAFormAGenerator: FC = () => {
  return (
    <Wrap data-testid="rera-form-a-generator">
      <Header>
        <div>
          <Title>Form A</Title>
          <div style={{fontSize:'.8rem',marginTop:4}}>Broker's Contract Agreement (Seller)</div>
        </div>
        <DLDLogo>DLD LOGO</DLDLogo>
      </Header>

      <Section>
        <SecTitle>1. Seller Details</SecTitle>
        <Row><Label>Full Name:</Label><Val>Ahmad Al-Futtaim</Val></Row>
        <Row><Label>Passport / EID:</Label><Val>784-1980-1234567-1</Val></Row>
      </Section>

      <Section>
        <SecTitle>2. Property Details</SecTitle>
        <Row><Label>Title Deed No:</Label><Val>11223344</Val></Row>
        <Row><Label>Project / Area:</Label><Val>Dubai Marina / Marina Heights</Val></Row>
        <Row><Label>Listing Price (AED):</Label><Val>4,500,000</Val></Row>
      </Section>

      <Section>
        <SecTitle>3. Broker Details</SecTitle>
        <Row><Label>Agency Name:</Label><Val>White Caves Real Estate LLC</Val></Row>
        <Row><Label>ORN:</Label><Val>12345</Val></Row>
        <Row><Label>Broker BRN:</Label><Val>67890</Val></Row>
        <Row><Label>Commission (%):</Label><Val>2% + 5% VAT</Val></Row>
      </Section>

      <SigArea>
        <SigBox>Seller Signature</SigBox>
        <SigBox>Broker Signature</SigBox>
      </SigArea>
    </Wrap>
  );
};
export default RERAFormAGenerator;
