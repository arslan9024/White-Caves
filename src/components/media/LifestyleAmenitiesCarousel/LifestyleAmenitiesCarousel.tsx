import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;padding:24px 0;overflow:hidden`;
const Title = styled.h2`margin:0 0 24px 24px;font-size:1.4rem;font-weight:900;color:#0F172A`;

const Carousel = styled.div`display:flex;gap:20px;padding:0 24px;overflow-x:auto;scrollbar-width:none;&::-webkit-scrollbar{display:none}`;
const Card = styled.div`min-width:300px;background:#FFF;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);transition:all .3s;&:hover{transform:translateY(-5px)}`;
const Img = styled.div<{$bg:string}>`width:100%;height:200px;background:url(${p=>p.$bg}) center/cover`;
const Content = styled.div`padding:20px`;
const CTitle = styled.div`font-size:1.1rem;font-weight:900;color:#0F172A;margin-bottom:8px`;
const CDesc = styled.div`font-size:.85rem;color:#64748B;line-height:1.5`;

export const LifestyleAmenitiesCarousel: FC = () => {
  return (
    <Wrap data-testid="lifestyle-amenities-carousel">
      <Title>Five-Star Lifestyle Amenities</Title>
      
      <Carousel>
        <Card>
          <Img $bg="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80" />
          <Content>
            <CTitle>Infinity Edge Pool</CTitle>
            <CDesc>Temperature-controlled infinity pool offering sweeping views of the Arabian Gulf.</CDesc>
          </Content>
        </Card>
        
        <Card>
          <Img $bg="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" />
          <Content>
            <CTitle>State-of-the-Art Gym</CTitle>
            <CDesc>Fully equipped fitness center with Technogym equipment and private yoga studios.</CDesc>
          </Content>
        </Card>
        
        <Card>
          <Img $bg="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" />
          <Content>
            <CTitle>Private Spa & Wellness</CTitle>
            <CDesc>Exclusive resident access to sauna, steam rooms, and bespoke massage therapy rooms.</CDesc>
          </Content>
        </Card>
      </Carousel>
    </Wrap>
  );
};
export default LifestyleAmenitiesCarousel;
