import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;align-items:center;gap:8px`;

const FormGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:16px`;
const FormCard = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.3);border-radius:12px;padding:20px;display:flex;flex-direction:column;justify-content:space-between`;
const FName = styled.div`font-size:.9rem;font-weight:800;color:#E2E8F0;margin-bottom:8px`;
const FDesc = styled.div`font-size:.7rem;color:#94A3B8;line-height:1.4;margin-bottom:20px;flex:1`;
const GenBtn = styled.button`width:100%;padding:10px;background:#3B82F6;color:#FFF;border:none;border-radius:8px;font-weight:700;font-size:.8rem;cursor:pointer`;

const FORMS = [
  { name: 'Form A', desc: 'Broker\'s Agreement between Seller and Broker. Required to list a property legally.' },
  { name: 'Form B', desc: 'Buyer\'s Agreement between Buyer and Broker. Used when representing a buyer.' },
  { name: 'Form F', desc: 'Memorandum of Understanding (MOU) / Purchase Agreement between Buyer and Seller.' },
  { name: 'Form I', desc: 'Agency Agreement between two Brokers (Agent to Agent).' },
  { name: 'Form U', desc: 'Cancellation of Agreement (Form A/B termination).' },
];

export const DLDFormGenerator: FC = () => {
  return (
    <Wrap data-testid="dld-form-generator">
      <Title>🏛️ DLD Unified Form Generator</Title>
      
      <FormGrid>
        {FORMS.map(f => (
          <FormCard key={f.name}>
            <FName>{f.name}</FName>
            <FDesc>{f.desc}</FDesc>
            <GenBtn>Generate from CRM Data</GenBtn>
          </FormCard>
        ))}
      </FormGrid>
    </Wrap>
  );
};
export default DLDFormGenerator;
