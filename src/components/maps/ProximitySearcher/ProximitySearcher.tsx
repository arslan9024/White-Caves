import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const SearchRow = styled.div`display:flex;align-items:center;gap:12px;margin-bottom:24px;background:rgba(30,41,59,0.5);padding:16px;border-radius:12px;border:1px solid rgba(100,116,139,0.3)`;
const Text = styled.span`font-size:.9rem;color:#94A3B8;font-weight:600`;
const Select = styled.select`padding:8px 12px;background:#0F172A;border:1px solid rgba(100,116,139,0.5);border-radius:8px;color:#E2E8F0;font-weight:800;font-size:.9rem;outline:none`;
const Btn = styled.button`padding:10px 20px;background:#3B82F6;color:#FFF;border:none;border-radius:8px;font-weight:800;cursor:pointer;margin-left:auto`;

const ResultGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px`;
const RCard = styled.div`background:rgba(0,0,0,0.2);border:1px solid rgba(100,116,139,0.2);padding:16px;border-radius:12px`;
const RTitle = styled.div`font-size:1rem;font-weight:800;color:#E2E8F0;margin-bottom:4px`;
const RDist = styled.div`font-size:.8rem;color:#10B981;font-weight:700;display:flex;align-items:center;gap:6px`;

export const ProximitySearcher: FC = () => {
  return (
    <Wrap data-testid="proximity-searcher">
      <Title>📍 POI Proximity Search</Title>
      
      <SearchRow>
        <Text>Show me properties within</Text>
        <Select defaultValue="5">
          <option value="5">5 mins</option>
          <option value="10">10 mins</option>
          <option value="15">15 mins</option>
        </Select>
        <Text>drive of a</Text>
        <Select defaultValue="metro">
          <option value="metro">Metro Station</option>
          <option value="school">GEMS School</option>
          <option value="mall">Major Mall</option>
        </Select>
        <Btn>Search</Btn>
      </SearchRow>

      <ResultGrid>
        <RCard>
          <RTitle>Marina Heights Apt 1402</RTitle>
          <RDist>🚶 3 mins to Sobha Realty Metro</RDist>
        </RCard>
        <RCard>
          <RTitle>JLT Cluster X - 804</RTitle>
          <RDist>🚶 5 mins to DMCC Metro</RDist>
        </RCard>
      </ResultGrid>
    </Wrap>
  );
};
export default ProximitySearcher;
