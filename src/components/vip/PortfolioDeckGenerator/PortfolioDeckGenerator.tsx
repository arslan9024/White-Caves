/**
 * PortfolioDeckGenerator — Wave 49 GOAL-036
 * Bespoke property portfolio presentation deck generator for UHNW & Family Offices
 * White Caves Real Estate LLC — VIP & Executive Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0A0614 0%, #0F172A 100%);
  border: 2px solid rgba(139, 92, 246, 0.35);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(139, 92, 246, 0.08);
  border-bottom: 1px solid rgba(139, 92, 246, 0.18);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #A78BFA;
  background: rgba(139, 92, 246, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(139, 92, 246, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  &:focus { border-color: #8B5CF6; }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  outline: none;
  &:focus { border-color: #8B5CF6; }
`;

const AssetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AssetRow = styled.div<{ $selected: boolean }>`
  padding: 10px 12px;
  border-radius: 8px;
  background: ${p => p.$selected ? 'rgba(139, 92, 246, 0.1)' : 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${p => p.$selected ? 'rgba(139, 92, 246, 0.35)' : 'rgba(100, 116, 139, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const CheckBox = styled.input`
  accent-color: #8B5CF6;
  margin-right: 8px;
`;

const SummaryBox = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.25);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const SVal = styled.div`
  font-size: 1.1rem;
  font-weight: 900;
  color: #A78BFA;
`;

const GenBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #7C3AED, #8B5CF6);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

const ASSETS = [
  { id: '1', title: 'Signature Sea Villa, Palm Jumeirah', value: 85000000, yield: 6.8, type: 'Villa' },
  { id: '2', title: 'Burj View Penthouse, Downtown Dubai', value: 45000000, yield: 7.2, type: 'Penthouse' },
  { id: '3', title: 'Private Lagoon Island Plot, World Islands', value: 120000000, yield: 5.4, type: 'Land' },
  { id: '4', title: 'Commercial Full Floor, ICD Brookfield DIFC', value: 65000000, yield: 8.5, type: 'Commercial' },
];

export const PortfolioDeckGenerator: FC = () => {
  const [clientName, setClientName] = useState('Al Maktoum Family Office');
  const [currency, setCurrency] = useState('AED');
  const [theme, setTheme] = useState('Royal Obsidian & Gold');
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2', '4']);
  const [generated, setGenerated] = useState(false);

  const toggleAsset = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectedAssets = ASSETS.filter(a => selectedIds.includes(a.id));
  const totalVal = selectedAssets.reduce((acc, a) => acc + a.value, 0);
  const avgYield = selectedAssets.length ? (selectedAssets.reduce((acc, a) => acc + a.yield, 0) / selectedAssets.length).toFixed(1) : '0';

  return (
    <Wrap data-testid="portfolio-deck-generator">
      <Head>
        <Title>📊 Bespoke UHNW Portfolio Presentation Deck Builder</Title>
        <Tag>FAMILY OFFICE DECK</Tag>
      </Head>
      <Body>
        <ControlsGrid>
          <Field>
            <FLabel>Family Office / Client Name</FLabel>
            <Input value={clientName} onChange={e => setClientName(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Reporting Currency</FLabel>
            <Select value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="AED">AED (UAE Dirham)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="GBP">GBP (British Pound)</option>
            </Select>
          </Field>
        </ControlsGrid>

        <div>
          <FLabel style={{ marginBottom: '8px', display: 'block' }}>Select Trophy Assets for Portfolio Inclusion</FLabel>
          <AssetList>
            {ASSETS.map(asset => (
              <AssetRow 
                key={asset.id} 
                $selected={selectedIds.includes(asset.id)}
                onClick={() => toggleAsset(asset.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckBox type="checkbox" checked={selectedIds.includes(asset.id)} onChange={() => {}} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF' }}>{asset.title}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{asset.type} | Projected Yield: {asset.yield}%</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#A78BFA' }}>
                  AED {(asset.value / 1000000).toFixed(1)}M
                </div>
              </AssetRow>
            ))}
          </AssetList>
        </div>

        <SummaryBox>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase' }}>Assets Selected</div>
            <SVal style={{ color: '#FFF' }}>{selectedAssets.length} Properties</SVal>
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase' }}>Portfolio AUM</div>
            <SVal>AED {(totalVal / 1000000).toFixed(1)}M</SVal>
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase' }}>Weighted Yield</div>
            <SVal style={{ color: '#10B981' }}>{avgYield}% p.a.</SVal>
          </div>
        </SummaryBox>

        {generated ? (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', color: '#10B981', fontWeight: 800, fontSize: '0.82rem' }}>
            ✓ Bespoke Portfolio Deck Compiled & PDF Ready for {clientName}!
          </div>
        ) : (
          <GenBtn onClick={() => setGenerated(true)}>
            📑 Compile Executive Confidential Portfolio Deck (PDF)
          </GenBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default PortfolioDeckGenerator;
