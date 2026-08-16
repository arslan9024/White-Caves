/**
 * FloatingHeroSearchPill — Wave 56 FE-GOAL-003, FE-GOAL-007
 * Luxury glassmorphism search pill container with instant category filter tabs
 * White Caves Real Estate LLC — Homepage & Hero UI Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const Container = styled.div`
  width: 100%;
  max-width: 840px;
  margin: 0 auto;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  padding: 16px 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.15);
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.5s ease;
`;

const TabsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.2);
  padding-bottom: 10px;
`;

const TabBtn = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid ${p => p.$active ? '#EF4444' : 'transparent'};
  background: ${p => p.$active ? '#EF4444' : 'rgba(100, 116, 139, 0.12)'};
  color: #FFF;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: ${p => p.$active ? '#DC2626' : 'rgba(239, 68, 68, 0.2)'}; }
`;

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr auto;
  gap: 12px;
  align-items: center;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 0.65rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(7, 11, 20, 0.7);
  color: #FFF;
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(7, 11, 20, 0.7);
  color: #FFF;
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const SearchBtn = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  height: 40px;
  margin-top: 14px;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

export const FloatingHeroSearchPill: FC = () => {
  const [tab, setTab] = useState<'BUY' | 'RENT' | 'OFF-PLAN' | 'COMMERCIAL'>('BUY');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('All Luxury Types');
  const [priceRange, setPriceRange] = useState('Any Budget');

  return (
    <Container data-testid="floating-hero-search-pill">
      <TabsRow>
        {(['BUY', 'RENT', 'OFF-PLAN', 'COMMERCIAL'] as const).map(t => (
          <TabBtn key={t} $active={tab === t} onClick={() => setTab(t)}>
            {t}
          </TabBtn>
        ))}
      </TabsRow>

      <SearchGrid>
        <Field>
          <Label>Dubai Location / Community</Label>
          <Input 
            placeholder="e.g. Palm Jumeirah, Downtown, Emirates Hills" 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
          />
        </Field>
        <Field>
          <Label>Property Category</Label>
          <Select value={propertyType} onChange={e => setPropertyType(e.target.value)}>
            <option value="All Luxury Types">All Luxury Types</option>
            <option value="Signature Beachfront Villa">Signature Beachfront Villa</option>
            <option value="Ultra-Penthouse Duplex">Ultra-Penthouse Duplex</option>
            <option value="Private Golf Mansion">Private Golf Mansion</option>
            <option value="Grade A Commercial Office">Grade A Commercial Office</option>
          </Select>
        </Field>
        <Field>
          <Label>Target Price Range</Label>
          <Select value={priceRange} onChange={e => setPriceRange(e.target.value)}>
            <option value="Any Budget">Any Budget</option>
            <option value="AED 5M - 15M">AED 5M - 15M</option>
            <option value="AED 15M - 50M">AED 15M - 50M</option>
            <option value="AED 50M+ (UHNW)">AED 50M+ (UHNW)</option>
          </Select>
        </Field>
        <SearchBtn onClick={() => alert(`Searching ${tab} properties in ${location || 'Dubai'}...`)}>
          <span>🔍</span>
          <span>Search</span>
        </SearchBtn>
      </SearchGrid>
    </Container>
  );
};

export default FloatingHeroSearchPill;
