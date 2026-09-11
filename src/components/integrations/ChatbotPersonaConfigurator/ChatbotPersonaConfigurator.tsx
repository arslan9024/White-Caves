import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const Field = styled.div`margin-bottom:20px`;
const Label = styled.label`display:block;font-size:.75rem;font-weight:700;color:#94A3B8;margin-bottom:8px`;
const Select = styled.select`width:100%;padding:10px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.85rem;outline:none`;
const Textarea = styled.textarea`width:100%;padding:10px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.85rem;outline:none;min-height:80px;resize:none`;

const ToggleRow = styled.div`display:flex;justify-content:space-between;align-items:center;padding:12px;background:rgba(30,41,59,0.5);border-radius:8px;margin-bottom:12px`;
const TName = styled.div`font-size:.85rem;font-weight:700;color:#E2E8F0`;
const TDesc = styled.div`font-size:.65rem;color:#94A3B8`;
const ToggleSwitch = styled.div<{$on:boolean}>`width:36px;height:20px;background:${p=>p.$on?'#10B981':'#475569'};border-radius:10px;position:relative;cursor:pointer;transition:all .2s;&::after{content:'';position:absolute;top:2px;left:${p=>p.$on?'18px':'2px'};width:16px;height:16px;background:#FFF;border-radius:8px;transition:all .2s}`;

export const ChatbotPersonaConfigurator: FC = () => {
  return (
    <Wrap data-testid="chatbot-persona-configurator">
      <Title>🤖 AI Agent Persona Setup</Title>
      
      <Field>
        <Label>Communication Tone</Label>
        <Select defaultValue="professional">
          <option value="professional">Professional & Luxury (Recommended)</option>
          <option value="friendly">Friendly & Casual</option>
          <option value="direct">Direct & Concise</option>
        </Select>
      </Field>

      <Field>
        <Label>System Prompt (Base Instructions)</Label>
        <Textarea defaultValue="You are an elite real estate advisor for White Caves Dubai. Always offer VIP service. Never disclose exact commission splits. Guide users to book a viewing." />
      </Field>

      <ToggleRow>
        <div>
          <TName>Live Agent Handoff</TName>
          <TDesc>Automatically transfer chat if user seems frustrated or requests a human.</TDesc>
        </div>
        <ToggleSwitch $on={true} />
      </ToggleRow>

      <ToggleRow>
        <div>
          <TName>Inventory Access</TName>
          <TDesc>Allow AI to quote real-time prices from the active CRM database.</TDesc>
        </div>
        <ToggleSwitch $on={true} />
      </ToggleRow>
    </Wrap>
  );
};
export default ChatbotPersonaConfigurator;
