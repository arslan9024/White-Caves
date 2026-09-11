import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;color:#FFF;display:flex;align-items:center;gap:16px`;

const Face = styled.div<{$c:string}>`width:40px;height:40px;border-radius:20px;background:${p=>p.$c};display:flex;align-items:center;justify-content:center;font-size:1.2rem`;
const Info = styled.div`flex:1`;
const IText = styled.div`font-size:.9rem;font-weight:700;color:#E2E8F0`;
const ISub = styled.div`font-size:.75rem;color:#94A3B8;margin-top:2px`;

export const SentimentAnalysisWidget: FC = () => {
  return (
    <Wrap data-testid="sentiment-analysis-widget">
      <Face $c="rgba(16,185,129,0.2)">😊</Face>
      <Info>
        <IText>Positive Sentiment Detected</IText>
        <ISub>Client used words like "love it", "perfect", and "proceed" in the last call.</ISub>
      </Info>
    </Wrap>
  );
};
export default SentimentAnalysisWidget;
