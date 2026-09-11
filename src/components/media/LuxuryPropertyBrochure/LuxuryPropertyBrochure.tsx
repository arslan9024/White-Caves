import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:800px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border-radius:0;overflow:hidden;color:#FFF;box-shadow:0 30px 60px rgba(0,0,0,0.8)`;

const HeroImage = styled.div`width:100%;height:400px;background:linear-gradient(to bottom, rgba(0,0,0,0.2), #0F172A), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80') center/cover;position:relative`;

const HeroText = styled.div`position:absolute;bottom:40px;left:40px`;
const SuperTitle = styled.div`font-size:.8rem;letter-spacing:4px;text-transform:uppercase;color:#94A3B8;margin-bottom:8px`;
const Title = styled.h1`margin:0;font-size:3rem;font-weight:300;font-family:'Playfair Display',serif;letter-spacing:2px;color:#FFF`;

const Content = styled.div`padding:40px;display:grid;grid-template-columns:1fr 1fr;gap:40px`;
const Desc = styled.p`font-size:.95rem;line-height:1.8;color:#CBD5E1;margin:0`;

const Specs = styled.div`display:flex;flex-direction:column;gap:16px`;
const SpecRow = styled.div`display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px`;
const SLabel = styled.div`font-size:.8rem;color:#94A3B8;text-transform:uppercase;letter-spacing:1px`;
const SVal = styled.div`font-size:.9rem;font-weight:700;color:#FFF`;

export const LuxuryPropertyBrochure: FC = () => {
  return (
    <Wrap data-testid="luxury-property-brochure">
      <HeroImage>
        <HeroText>
          <SuperTitle>Signature Collection</SuperTitle>
          <Title>Villa Aurelia</Title>
        </HeroText>
      </HeroImage>

      <Content>
        <Desc>
          A masterpiece of contemporary architecture situated on the coveted fronds of Palm Jumeirah. 
          Villa Aurelia offers unparalleled panoramic views of the Arabian Gulf and the Dubai Marina skyline. 
          Every detail, from the imported Italian marble to the bespoke smart home automation, has been curated for the absolute highest echelon of luxury living.
        </Desc>
        
        <Specs>
          <SpecRow><SLabel>Location</SLabel><SVal>Palm Jumeirah, Frond N</SVal></SpecRow>
          <SpecRow><SLabel>Bedrooms</SLabel><SVal>6 (En-Suite)</SVal></SpecRow>
          <SpecRow><SLabel>Built-Up Area</SLabel><SVal>14,500 Sq.Ft</SVal></SpecRow>
          <SpecRow><SLabel>Price</SLabel><SVal>AED 125,000,000</SVal></SpecRow>
        </Specs>
      </Content>
    </Wrap>
  );
};
export default LuxuryPropertyBrochure;
