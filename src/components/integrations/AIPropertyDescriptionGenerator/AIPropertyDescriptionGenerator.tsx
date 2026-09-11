import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;align-items:center;gap:8px`;

const FormArea = styled.div`display:flex;gap:12px;margin-bottom:20px`;
const Input = styled.input`flex:1;padding:12px 16px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.9rem;outline:none`;
const GenBtn = styled.button`padding:0 24px;background:linear-gradient(90deg,#8B5CF6,#EC4899);color:#FFF;border:none;border-radius:8px;font-weight:800;font-size:.9rem;cursor:pointer`;

const OutputBox = styled.div`background:rgba(30,41,59,0.5);border:1px dashed rgba(139,92,246,0.4);border-radius:12px;padding:20px;min-height:150px;color:#CBD5E1;font-size:.9rem;line-height:1.6`;

export const AIPropertyDescriptionGenerator: FC = () => {
  const [desc, setDesc] = useState('');

  const generate = () => {
    setDesc('Experience unparalleled luxury in this stunning 3-bedroom apartment located in the heart of Dubai Marina. Boasting panoramic views of the Arabian Gulf and the iconic Palm Jumeirah, this residence offers floor-to-ceiling windows, premium marble finishes, and access to world-class amenities including an infinity pool and private gym...');
  };

  return (
    <Wrap data-testid="ai-description-generator">
      <Title>✨ AI Listing Description Generator</Title>
      
      <FormArea>
        <Input placeholder="E.g., 3BR Marina Heights, full sea view, upgraded kitchen, high floor" />
        <GenBtn onClick={generate}>Generate with AI</GenBtn>
      </FormArea>

      <OutputBox>
        {desc || <span style={{opacity:0.5}}>Your SEO-optimized listing description will appear here...</span>}
      </OutputBox>
    </Wrap>
  );
};
export default AIPropertyDescriptionGenerator;
