/**
 * CryptoPaymentSimulator — Wave 49 GOAL-034
 * Crypto real estate payment gateway simulation with instant FX rate locks
 * White Caves Real Estate LLC — VIP Concierge Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.4; }`;

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

const VipBadge = styled.span`
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

const AssetSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const AssetCard = styled.button<{ $selected: boolean }>`
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid ${p => p.$selected ? '#8B5CF6' : 'rgba(100, 116, 139, 0.2)'};
  background: ${p => p.$selected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.7)'};
  color: ${p => p.$selected ? '#FFF' : '#94A3B8'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  &:hover { border-color: #8B5CF6; }
`;

const RateLockBanner = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RateLockText = styled.div`
  font-size: 0.75rem;
  color: #CBD5E1;
`;

const TimerText = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #A78BFA;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ConversionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const FieldBox = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.2);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.div`
  font-size: 0.65rem;
  color: #94A3B8;
  text-transform: uppercase;
  font-weight: 700;
`;

const FVal = styled.div`
  font-size: 1.2rem;
  font-weight: 900;
  color: #FFF;
`;

const PayBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #7C3AED, #8B5CF6);
  color: #FFF;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

const CRYPTO_RATES: Record<string, { rateUsd: number; symbol: string; icon: string }> = {
  USDT: { rateUsd: 1.00, symbol: '₮', icon: '💵' },
  USDC: { rateUsd: 1.00, symbol: '$', icon: '🔵' },
  BTC: { rateUsd: 64200, symbol: '₿', icon: '🪙' },
  ETH: { rateUsd: 3450, symbol: 'Ξ', icon: '🔷' },
};

export const CryptoPaymentSimulator: FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>('USDT');
  const [propertyPriceAed, setPropertyPriceAed] = useState(12500000); // 12.5M AED Luxury Villa
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins rate lock (in seconds)
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const usdAmount = propertyPriceAed / 3.6725;
  const assetConfig = CRYPTO_RATES[selectedAsset];
  const cryptoAmount = usdAmount / assetConfig.rateUsd;

  return (
    <Wrap data-testid="crypto-payment-simulator">
      <Head>
        <Title>⚡ VIP Crypto Real Estate Gateway</Title>
        <VipBadge>ESCROW SETTLEMENT</VipBadge>
      </Head>
      <Body>
        <AssetSelector>
          {Object.entries(CRYPTO_RATES).map(([key, item]) => (
            <AssetCard 
              key={key}
              $selected={selectedAsset === key}
              onClick={() => { setSelectedAsset(key); setPaid(false); }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>{key}</span>
              <span style={{ fontSize: '0.62rem', color: '#64748B' }}>${item.rateUsd.toLocaleString()}</span>
            </AssetCard>
          ))}
        </AssetSelector>

        <RateLockBanner>
          <RateLockText>
            🔒 Guaranteed OTC Instant Exchange Rate Lock
          </RateLockText>
          <TimerText>
            <span>⏱ {formatTime(timeLeft)}</span>
          </TimerText>
        </RateLockBanner>

        <ConversionGrid>
          <FieldBox>
            <FLabel>Purchase Price (AED)</FLabel>
            <FVal>AED {(propertyPriceAed / 1000000).toFixed(2)}M</FVal>
            <div style={{ fontSize: '0.68rem', color: '#64748B' }}>≈ ${usdAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</div>
          </FieldBox>
          <FieldBox>
            <FLabel>Payable in {selectedAsset}</FLabel>
            <FVal style={{ color: '#A78BFA' }}>
              {selectedAsset === 'BTC' || selectedAsset === 'ETH' 
                ? cryptoAmount.toFixed(4) 
                : cryptoAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} {selectedAsset}
            </FVal>
            <div style={{ fontSize: '0.68rem', color: '#10B981' }}>0.00% Slippage Protected</div>
          </FieldBox>
        </ConversionGrid>

        {paid ? (
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>✅</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10B981' }}>
              Crypto Escrow Deposit Confirmed!
            </div>
            <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '4px' }}>
              Transaction Hash: 0x8f9c...4a2b | Direct Settlement into DLD Escrow Vault
            </div>
          </div>
        ) : (
          <PayBtn onClick={() => setPaid(true)}>
            💳 Authorize {selectedAsset} Smart Escrow Payment
          </PayBtn>
        )}

        <div style={{ fontSize: '0.68rem', color: '#64748B', textAlign: 'center', lineHeight: '1.4' }}>
          Regulated under VARA (Virtual Assets Regulatory Authority) Dubai & UAE Central Bank Compliance Directives.
        </div>
      </Body>
    </Wrap>
  );
};

export default CryptoPaymentSimulator;
