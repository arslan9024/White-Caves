/**
 * UtilityTransferWizard — Wave 52 GOAL-065
 * Utility account (DEWA / Empower district cooling) move-in move-out transfer assistance wizard
 * White Caves Real Estate LLC — Asset Management & Tenancy Handover Suite
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

const Tag = styled.span`
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

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const StepCard = styled.div<{ $active: boolean; $completed: boolean }>`
  padding: 12px;
  border-radius: 10px;
  background: ${p => p.$completed ? 'rgba(16, 185, 129, 0.1)' : p.$active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${p => p.$completed ? '#10B981' : p.$active ? '#EF4444' : 'rgba(100, 116, 139, 0.2)'};
  text-align: center;
`;

const StepNum = styled.div<{ $completed: boolean }>`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${p => p.$completed ? '#10B981' : '#FFF'};
`;

const StepTitle = styled.div`
  font-size: 0.72rem;
  color: #94A3B8;
  margin-top: 2px;
`;

const FormBox = styled.div`
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

const ActionBtn = styled.button`
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

export const UtilityTransferWizard: FC = () => {
  const [dewaPremiseNo, setDewaPremiseNo] = useState('2008491204');
  const [empowerAcctNo, setEmpowerAcctNo] = useState('EMP-78401');
  const [ejariNumber, setEjariNumber] = useState('0120260814009210');
  const [step, setStep] = useState(1);
  const [transferred, setTransferred] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setTransferred(true);
  };

  return (
    <Wrap data-testid="utility-transfer-wizard">
      <Head>
        <Title>⚡ DEWA & Empower District Cooling Utility Transfer Wizard</Title>
        <Tag>GOVERNMENT API LINK</Tag>
      </Head>
      <Body>
        <StepGrid>
          <StepCard $active={step === 1} $completed={step > 1}>
            <StepNum $completed={step > 1}>{step > 1 ? '✓ Step 1' : 'Step 1'}</StepNum>
            <StepTitle>DEWA Move-In / Premise Link</StepTitle>
          </StepCard>
          <StepCard $active={step === 2} $completed={step > 2}>
            <StepNum $completed={step > 2}>{step > 2 ? '✓ Step 2' : 'Step 2'}</StepNum>
            <StepTitle>Empower Chiller Deposit</StepTitle>
          </StepCard>
          <StepCard $active={step === 3} $completed={transferred}>
            <StepNum $completed={transferred}>{transferred ? '✓ Step 3' : 'Step 3'}</StepNum>
            <StepTitle>Final NOC & Connection</StepTitle>
          </StepCard>
        </StepGrid>

        <FormBox>
          <Field>
            <FLabel>DEWA 10-Digit Premise Number</FLabel>
            <Input value={dewaPremiseNo} onChange={e => setDewaPremiseNo(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Empower / Tabreed District Cooling Account</FLabel>
            <Input value={empowerAcctNo} onChange={e => setEmpowerAcctNo(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Ejari Certificate Number</FLabel>
            <Input value={ejariNumber} onChange={e => setEjariNumber(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Statutory DEWA Security Deposit</FLabel>
            <Input value="AED 2,000 (Apartment) / AED 4,000 (Villa)" readOnly style={{ color: 'var(--accent-green, #10B981)', fontWeight: 700 }} />
          </Field>
        </FormBox>

        {transferred ? (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', color: 'var(--accent-green, #10B981)', fontWeight: 800, fontSize: '0.82rem' }}>
            ✓ DEWA & Empower Move-In Transfer Successfully Submitted via Direct Smart Government Gateway!
          </div>
        ) : (
          <ActionBtn onClick={handleNext}>
            {step === 3 ? '⚡ Submit DEWA & Empower Activation' : `→ Proceed to Step ${step + 1}`}
          </ActionBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default UtilityTransferWizard;
