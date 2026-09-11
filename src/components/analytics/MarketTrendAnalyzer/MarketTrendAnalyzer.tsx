import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Header = styled.div`display:flex;justify-content:space-between;margin-bottom:24px`;
const Title = styled.h2`margin:0;font-size:1.1rem;font-weight:800`;

const MockChart = styled.div`width:100%;height:200px;background:rgba(30,41,59,0.4);border-radius:12px;position:relative;display:flex;align-items:flex-end;padding:20px;gap:8px`;
const Bar = styled.div<{h:number}>`flex:1;height:${p=>p.h}%;background:linear-gradient(0deg,rgba(56,189,248,0.2),#38BDF8);border-radius:4px 4px 0 0;position:relative;transition:height .5s ease;cursor:pointer;&:hover{filter:brightness(1.2)}`;

export const MarketTrendAnalyzer: FC = () => {
  return (
    <Wrap data-testid="market-trend-analyzer">
      <Header>
        <Title>📊 Dubai Marina - Avg Price/SqFt (Past 6 Months)</Title>
        <select style={{background:'#1E293B',color:'#FFF',border:'none',padding:'4px 8px',borderRadius:'6px'}}>
          <option>Dubai Marina</option>
          <option>Downtown Dubai</option>
        </select>
      </Header>
      
      <MockChart>
        <Bar h={40} title="April: AED 1,800" />
        <Bar h={45} title="May: AED 1,850" />
        <Bar h={42} title="June: AED 1,820" />
        <Bar h={60} title="July: AED 2,050" />
        <Bar h={75} title="August: AED 2,200" />
        <Bar h={85} title="September: AED 2,350" />
        
        {/* Mock Trendline */}
        <div style={{position:'absolute',top:'40%',left:0,right:0,height:2,background:'rgba(244,63,94,0.5)',transform:'rotate(-10deg)'}}></div>
      </MockChart>
    </Wrap>
  );
};
export default MarketTrendAnalyzer;
