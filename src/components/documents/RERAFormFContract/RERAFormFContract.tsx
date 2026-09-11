import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:800px;font-family:'Times New Roman',serif;animation:${fadeIn} .4s ease;background:#FFF;border:1px solid #E2E8F0;padding:40px;color:#000;box-shadow:0 10px 20px rgba(0,0,0,0.1)`;

const Header = styled.div`text-align:center;border-bottom:2px solid #000;padding-bottom:16px;margin-bottom:32px`;
const Title = styled.h1`margin:0 0 8px;font-size:1.6rem;text-transform:uppercase;font-weight:900`;
const Sub = styled.div`font-size:.9rem;font-weight:700`;

const TwoCol = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px`;
const Box = styled.div`border:1px solid #000;padding:16px`;
const BTitle = styled.div`font-weight:900;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #E2E8F0;padding-bottom:4px`;

const Row = styled.div`display:flex;margin-bottom:8px;font-size:.85rem`;
const Label = styled.div`width:100px;font-weight:700`;
const Val = styled.div`flex:1`;

const Table = styled.table`width:100%;border-collapse:collapse;margin-bottom:32px;font-size:.85rem`;
const TH = styled.th`border:1px solid #000;padding:8px;background:#F1F5F9;text-align:left`;
const TD = styled.td`border:1px solid #000;padding:8px`;

export const RERAFormFContract: FC = () => {
  return (
    <Wrap data-testid="rera-form-f-contract">
      <Header>
        <Title>Form F / Memorandum of Understanding</Title>
        <Sub>Contract of Sale between Buyer and Seller</Sub>
      </Header>

      <TwoCol>
        <Box>
          <BTitle>First Party (Seller)</BTitle>
          <Row><Label>Name:</Label><Val>Ahmad Al-Futtaim</Val></Row>
          <Row><Label>ID:</Label><Val>784-1980-1234567-1</Val></Row>
        </Box>
        <Box>
          <BTitle>Second Party (Buyer)</BTitle>
          <Row><Label>Name:</Label><Val>James Montgomery</Val></Row>
          <Row><Label>ID:</Label><Val>UK99887766</Val></Row>
        </Box>
      </TwoCol>

      <Table>
        <thead>
          <tr>
            <TH>Property Details</TH>
            <TH>Financials</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD>
              <div><strong>Project:</strong> Marina Heights</div>
              <div><strong>Unit:</strong> Apt 1402</div>
              <div><strong>Size:</strong> 1,200 Sq.Ft</div>
            </TD>
            <TD>
              <div><strong>Sale Price:</strong> AED 4,500,000</div>
              <div><strong>Deposit (10%):</strong> AED 450,000</div>
              <div><strong>Broker Fee:</strong> AED 90,000 (+VAT)</div>
            </TD>
          </tr>
        </tbody>
      </Table>
      
      <div style={{fontSize:'.8rem',lineHeight:1.5,textAlign:'justify'}}>
        <strong>Special Conditions:</strong> The property is sold vacant on transfer. The seller agrees to clear all outstanding service charges prior to the DLD transfer date. NOC to be applied for immediately upon signing.
      </div>
    </Wrap>
  );
};
export default RERAFormFContract;
