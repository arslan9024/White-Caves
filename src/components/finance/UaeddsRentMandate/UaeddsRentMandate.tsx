/**
 * UaeddsRentMandate — Wave 50 GOAL-044
 * Direct Debit System (UAEDDS) digital recurring rent mandate setup
 * White Caves Real Estate LLC — Digital Banking & Finance Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(16, 185, 129, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(16, 185, 129, 0.06);
  border-bottom: 1px solid rgba(16, 185, 129, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BankTag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #10B981;
  background: rgba(16, 185, 129, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  &:focus { border-color: #10B981; }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  outline: none;
  &:focus { border-color: #10B981; }
`;

const MandateSummary = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.15);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const MItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MLabel = styled.div`
  font-size: 0.65rem;
  color: #94A3B8;
  font-weight: 700;
  text-transform: uppercase;
`;

const MVal = styled.div`
  font-size: 0.95rem;
  color: #10B981;
  font-weight: 900;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #059669, #10B981);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

const ConfirmationBox = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
`;

export const UaeddsRentMandate: FC = () => {
  const [bank, setBank] = useState('Emirates NBD');
  const [iban, setIban] = useState('AE45 0330 0000 1234 5678 901');
  const [annualRent, setAnnualRent] = useState('180000');
  const [frequency, setFrequency] = useState('4'); // 4 installments
  const [startDate, setStartDate] = useState('2026-09-01');
  const [mandateActive, setMandateActive] = useState(false);

  const installmentAmount = Math.round(Number(annualRent) / Number(frequency));

  return (
    <Wrap data-testid="uaedds-rent-mandate">
      <Head>
        <Title>🏦 UAEDDS Digital Rent Mandate</Title>
        <BankTag>CENTRAL BANK OF UAE</BankTag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Tenant Bank Name</FLabel>
            <Select value={bank} onChange={e => setBank(e.target.value)}>
              <option value="Emirates NBD">Emirates NBD</option>
              <option value="Abu Dhabi Commercial Bank (ADCB)">Abu Dhabi Commercial Bank (ADCB)</option>
              <option value="Dubai Islamic Bank (DIB)">Dubai Islamic Bank (DIB)</option>
              <option value="First Abu Dhabi Bank (FAB)">First Abu Dhabi Bank (FAB)</option>
              <option value="Mashreq Bank">Mashreq Bank</option>
            </Select>
          </Field>

          <Field>
            <FLabel>Payment Frequency</FLabel>
            <Select value={frequency} onChange={e => setFrequency(e.target.value)}>
              <option value="1">1 Payment (Annual)</option>
              <option value="2">2 Payments (Bi-Annual)</option>
              <option value="4">4 Payments (Quarterly)</option>
              <option value="12">12 Payments (Monthly)</option>
            </Select>
          </Field>

          <Field>
            <FLabel>Tenant IBAN Number</FLabel>
            <Input value={iban} onChange={e => setIban(e.target.value)} />
          </Field>

          <Field>
            <FLabel>Annual Rent Total (AED)</FLabel>
            <Input type="number" value={annualRent} onChange={e => setAnnualRent(e.target.value)} />
          </Field>
        </FormGrid>

        <MandateSummary>
          <MItem>
            <MLabel>Per Installment</MLabel>
            <MVal>AED {installmentAmount.toLocaleString()}</MVal>
          </MItem>
          <MItem>
            <MLabel>Total Mandates</MLabel>
            <MVal>{frequency} Debit(s)</MVal>
          </MItem>
          <MItem>
            <MLabel>PDC Cheques Needed</MLabel>
            <MVal style={{ color: '#E2E8F0' }}>0 (Paperless)</MVal>
          </MItem>
        </MandateSummary>

        {mandateActive ? (
          <ConfirmationBox>
            <div style={{ fontSize: '1.2rem' }}>✅</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10B981' }}>
              UAEDDS Direct Debit Mandate Registered
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              Mandate UMRN: <strong>AE-DDS-2026-894109</strong> | Bank Authorization Token Active
            </div>
          </ConfirmationBox>
        ) : (
          <SubmitBtn onClick={() => setMandateActive(true)}>
            📝 Register UAEDDS Electronic Rent Mandate
          </SubmitBtn>
        )}

        <div style={{ fontSize: '0.68rem', color: '#64748B', textAlign: 'center', lineHeight: '1.4' }}>
          Paperless rent payment replaces post-dated physical cheques under Dubai DLD & Central Bank of UAE UAEDDS Framework.
        </div>
      </Body>
    </Wrap>
  );
};

export default UaeddsRentMandate;
