import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px;display:flex;flex-direction:column;gap:20px;height:600px`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:center`;
const Title = styled.h2`margin:0;font-size:1.1rem;font-weight:800;color:#E2E8F0`;
const SendBtn = styled.button`padding:10px 20px;background:#8B5CF6;color:#FFF;border:none;border-radius:8px;font-weight:700;font-size:.85rem;cursor:pointer;display:flex;align-items:center;gap:8px`;

const MainGrid = styled.div`display:grid;grid-template-columns:300px 1fr;gap:20px;flex:1;min-height:0`;

const LeftPanel = styled.div`display:flex;flex-direction:column;gap:16px;overflow-y:auto;padding-right:8px;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.3);border-radius:2px}`;
const Field = styled.div`display:flex;flex-direction:column;gap:6px`;
const Label = styled.label`font-size:.75rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:10px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.85rem;outline:none`;
const Select = styled.select`padding:10px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.85rem;outline:none`;

const BlockList = styled.div`display:flex;flex-direction:column;gap:10px;margin-top:20px`;
const BlockItem = styled.div`padding:12px;background:rgba(30,41,59,0.5);border:1px dashed rgba(139,92,246,0.4);border-radius:8px;color:#C4B5FD;font-size:.75rem;font-weight:600;text-align:center;cursor:grab`;

const Canvas = styled.div`background:#FFF;border-radius:12px;padding:40px;overflow-y:auto;color:#333;box-shadow:inset 0 0 20px rgba(0,0,0,0.05);&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.2);border-radius:2px}`;
const MockEmail = styled.div`max-width:480px;margin:0 auto`;
const MockHero = styled.div`height:200px;background:#E2E8F0;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-weight:600;margin-bottom:20px`;
const MockH1 = styled.h1`font-size:1.4rem;color:#0F172A;margin:0 0 10px`;
const MockP = styled.p`font-size:.9rem;color:#475569;line-height:1.5;margin:0 0 20px`;
const MockBtn = styled.div`display:inline-block;padding:12px 24px;background:#0F172A;color:#FFF;border-radius:4px;font-weight:600;font-size:.9rem`;

export const EmailCampaignBuilder: FC = () => {
  return (
    <Wrap data-testid="email-campaign-builder">
      <Header>
        <Title>✉️ Email Campaign Builder</Title>
        <SendBtn><span>Send Campaign</span> 🚀</SendBtn>
      </Header>
      
      <MainGrid>
        <LeftPanel>
          <Field>
            <Label>Campaign Name</Label>
            <Input defaultValue="Marina Off-Plan Launch" />
          </Field>
          <Field>
            <Label>Target Segment</Label>
            <Select defaultValue="vip">
              <option value="vip">VIP Investors (AED 5M+)</option>
              <option value="warm">Warm Leads (Marina)</option>
              <option value="all">All Subscribers</option>
            </Select>
          </Field>
          <Field>
            <Label>Subject Line</Label>
            <Input defaultValue="Exclusive Pre-Launch: Marina Views" />
          </Field>
          
          <BlockList>
            <Label>Drag & Drop Blocks</Label>
            <BlockItem>+ Property Hero Image</BlockItem>
            <BlockItem>+ Text Paragraph</BlockItem>
            <BlockItem>+ Floorplan Grid</BlockItem>
            <BlockItem>+ Call to Action Button</BlockItem>
          </BlockList>
        </LeftPanel>
        
        <Canvas>
          <MockEmail>
            <MockHero>Hero Image (Drop here)</MockHero>
            <MockH1>Discover Marina Views</MockH1>
            <MockP>Be the first to secure a unit in the most anticipated waterfront launch of the year. Exclusive 2% DLD waiver for VIP clients.</MockP>
            <MockBtn>View Brochure</MockBtn>
          </MockEmail>
        </Canvas>
      </MainGrid>
    </Wrap>
  );
};
export default EmailCampaignBuilder;
