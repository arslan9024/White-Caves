import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;height:600px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#000;position:relative;overflow:hidden`;

const VideoPlaceholder = styled.div`position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80') center/cover;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#FFF`;

const TitleBox = styled.div`text-align:center;max-width:800px;padding:20px`;
const MainText = styled.h1`font-size:4rem;font-weight:200;letter-spacing:8px;text-transform:uppercase;margin:0 0 16px;font-family:'Playfair Display',serif`;
const SubText = styled.p`font-size:1.2rem;color:#E2E8F0;font-weight:300;letter-spacing:2px`;

const PlayIcon = styled.div`width:80px;height:80px;border-radius:40px;border:1px solid rgba(255,255,255,0.5);display:flex;align-items:center;justify-content:center;font-size:1.5rem;cursor:pointer;margin-top:40px;transition:all .3s;&:hover{background:rgba(255,255,255,0.1);transform:scale(1.05)}`;

export const CinematicVideoHeader: FC = () => {
  return (
    <Wrap data-testid="cinematic-video-header">
      <VideoPlaceholder>
        <TitleBox>
          <MainText>The Sky Penthouse</MainText>
          <SubText>A new standard of living above the clouds.</SubText>
        </TitleBox>
        <PlayIcon>▶</PlayIcon>
      </VideoPlaceholder>
    </Wrap>
  );
};
export default CinematicVideoHeader;
