import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.95);border:1px dashed rgba(100,116,139,0.5);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:24px`;
const Title = styled.h2`margin:0;font-size:1.1rem;font-weight:800`;
const GenBtn = styled.button`padding:8px 16px;background:#38BDF8;color:#0F172A;border:none;border-radius:6px;font-weight:800;cursor:pointer`;

const LayoutBox = styled.div`border:2px dashed rgba(255,255,255,0.1);border-radius:12px;padding:20px;min-height:200px;display:flex;gap:16px;flex-wrap:wrap`;
const MetricChip = styled.div`background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:12px 16px;border-radius:8px;font-size:.85rem;font-weight:700;display:flex;align-items:center;gap:8px;cursor:grab`;

export const CustomReportBuilder: FC = () => {
  return (
    <Wrap data-testid="custom-report-builder">
      <Header>
        <Title>📑 Custom PDF Report Builder</Title>
        <GenBtn>Generate PDF</GenBtn>
      </Header>
      
      <div style={{fontSize:'.8rem',color:'#94A3B8',marginBottom:12}}>Drag blocks to include in report layout:</div>
      
      <LayoutBox>
        <MetricChip>☰ Executive Summary</MetricChip>
        <MetricChip>📊 Q3 Revenue Chart</MetricChip>
        <MetricChip>🏆 Top 10 Agents Table</MetricChip>
        <MetricChip style={{borderStyle:'dashed',borderColor:'#38BDF8',color:'#38BDF8',background:'none'}}>+ Drop Metric Here</MetricChip>
      </LayoutBox>
    </Wrap>
  );
};
export default CustomReportBuilder;
