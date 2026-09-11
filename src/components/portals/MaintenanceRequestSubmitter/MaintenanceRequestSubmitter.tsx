import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:480px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#FFF;border-radius:24px;overflow:hidden;padding:32px;box-shadow:0 20px 40px rgba(0,0,0,0.1);color:#0F172A`;
const Title = styled.h2`margin:0 0 24px;font-size:1.4rem;font-weight:900`;

const Field = styled.div`margin-bottom:20px`;
const Label = styled.label`display:block;font-size:.8rem;font-weight:800;color:#475569;margin-bottom:8px`;
const Select = styled.select`width:100%;padding:14px;border-radius:12px;border:1px solid #CBD5E1;background:#F8FAFC;font-size:.9rem;outline:none`;
const Textarea = styled.textarea`width:100%;padding:14px;border-radius:12px;border:1px solid #CBD5E1;background:#F8FAFC;font-size:.9rem;outline:none;min-height:100px;resize:none`;

const PhotoDrop = styled.div`border:2px dashed #CBD5E1;background:#F8FAFC;border-radius:12px;padding:24px;text-align:center;color:#64748B;font-size:.8rem;font-weight:700;cursor:pointer`;

const SubmitBtn = styled.button`width:100%;padding:16px;background:#0F172A;color:#FFF;border:none;border-radius:12px;font-weight:900;font-size:1rem;cursor:pointer;margin-top:12px;transition:all .2s;&:hover{background:#1E293B}`;

export const MaintenanceRequestSubmitter: FC = () => {
  return (
    <Wrap data-testid="maintenance-request-submitter">
      <Title>Report an Issue 🔧</Title>
      
      <Field>
        <Label>Issue Category</Label>
        <Select defaultValue="plumbing">
          <option value="ac">Air Conditioning / HVAC</option>
          <option value="plumbing">Plumbing / Leaks</option>
          <option value="electrical">Electrical</option>
          <option value="general">General Handyman</option>
        </Select>
      </Field>

      <Field>
        <Label>Description of the problem</Label>
        <Textarea placeholder="E.g., The sink in the master bathroom is leaking from the pipe underneath..." />
      </Field>

      <Field>
        <Label>Attach Photos (Optional)</Label>
        <PhotoDrop>📷 Tap to take photo or upload</PhotoDrop>
      </Field>

      <SubmitBtn>Submit Request</SubmitBtn>
    </Wrap>
  );
};
export default MaintenanceRequestSubmitter;
