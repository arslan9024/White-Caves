import React, { useState, useEffect } from 'react';
import { 
  Diamond, Plane, Car, Coins, Award, 
  CheckCircle2, Download, ShieldCheck, DollarSign, Calendar
} from 'lucide-react';
import './AssistantDashboard.css';

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

interface KairosProps {
  moduleId?: string;
  role?: string;
  user?: AuthUser;
}

export const KairosLuxuryCRM: React.FC<KairosProps> = ({ moduleId }) => {
  const [activeTab, setActiveTab] = useState<'golden-visa' | 'crypto' | 'chauffeur' | 'family-office'>('golden-visa');

  useEffect(() => {
    if (!moduleId) return;
    if (moduleId.includes('golden') || moduleId.includes('visa')) setActiveTab('golden-visa');
    else if (moduleId.includes('crypto')) setActiveTab('crypto');
    else if (moduleId.includes('chauffeur') || moduleId.includes('jet')) setActiveTab('chauffeur');
    else if (moduleId.includes('family')) setActiveTab('family-office');
  }, [moduleId]);

  // Feature 1: Golden Visa Tool
  const [totalRealEstateEquity, setTotalRealEstateEquity] = useState(2600000);
  const [isOffPlan, setIsOffPlan] = useState(false);
  const [hasMortgage, setHasMortgage] = useState(false);
  const [mortgageEquityAed, setMortgageEquityAed] = useState(2200000);

  const effectiveEquity = hasMortgage ? mortgageEquityAed : totalRealEstateEquity;
  const isGoldenVisaEligible = effectiveEquity >= 2000000;

  // Feature 2: Crypto FX Simulator
  const [propertyPriceAed, setPropertyPriceAed] = useState(15000000);
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDT'>('USDT');

  const btcRateAed = 245000;
  const ethRateAed = 12500;
  const usdtRateAed = 3.6725;

  const cryptoRequired = selectedCrypto === 'BTC'
    ? (propertyPriceAed / btcRateAed).toFixed(4)
    : selectedCrypto === 'ETH'
    ? (propertyPriceAed / ethRateAed).toFixed(2)
    : (propertyPriceAed / usdtRateAed).toFixed(2);

  // Feature 3: Chauffeur & Jet
  const [vipGuests, setVipGuests] = useState([
    { id: 'VIP-01', client: 'Sheikh Mansoor Family Office', service: 'Rolls Royce Phantom Chauffeur', date: '2026-08-26', itinerary: 'Emirates Hills Mansions', status: 'CONFIRMED' },
    { id: 'VIP-02', client: 'Lord Sterling Holdings', service: 'Helicopter Viewing Tour (DWC)', date: '2026-08-28', itinerary: 'Palm Jumeirah & World Islands', status: 'PILOT_RESERVED' },
  ]);

  return (
    <div className="crm-container" style={{ maxWidth: '100%', padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-831843, #831843) 0%, var(--color-500724, #500724) 100%)', color: 'var(--white, #FFFFFF)', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-ec4899, #EC4899) 0%, var(--color-be185d, #BE185D) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            💎
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Kairos AI — Luxury HNWI Wealth Advisory</h2>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-fbcfe8, #FBCFE8)', fontWeight: 800 }}>
                Ultra-Luxury Private Client Group
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--color-fce7f3, #FCE7F3)' }}>
              UAE 10-Year Golden Visa qualification calculator, crypto real estate payment locks, and VIP jet/chauffeur viewings.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'var(--white, #FFFFFF)', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveTab('golden-visa')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'golden-visa' ? '1px solid var(--color-be185d, #BE185D)' : '1px solid transparent', background: activeTab === 'golden-visa' ? 'var(--color-be185d, #BE185D)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'golden-visa' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.25.1 UAE Golden Visa Eligibility Tool
        </button>
        <button onClick={() => setActiveTab('crypto')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'crypto' ? '1px solid var(--color-be185d, #BE185D)' : '1px solid transparent', background: activeTab === 'crypto' ? 'var(--color-be185d, #BE185D)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'crypto' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.25.2 Real Estate Crypto FX Simulator
        </button>
        <button onClick={() => setActiveTab('chauffeur')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'chauffeur' ? '1px solid var(--color-be185d, #BE185D)' : '1px solid transparent', background: activeTab === 'chauffeur' ? 'var(--color-be185d, #BE185D)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'chauffeur' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.25.3 Private Jet & Chauffeur Desk
        </button>
        <button onClick={() => setActiveTab('family-office')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'family-office' ? '1px solid var(--color-be185d, #BE185D)' : '1px solid transparent', background: activeTab === 'family-office' ? 'var(--color-be185d, #BE185D)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'family-office' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.25.4 Family Office Strategy Deck
        </button>
      </div>

      {/* Tab 1: Golden Visa */}
      {activeTab === 'golden-visa' && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            UAE 10-Year Real Estate Investor Golden Visa Eligibility Engine
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)' }}>
            Statutory requirement: Minimum <strong>AED 2,000,000</strong> property value/equity owned directly under applicant's name.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Total Property Valuation (AED)</label>
              <input type="number" value={totalRealEstateEquity} onChange={e => setTotalRealEstateEquity(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Property Category</label>
              <select value={isOffPlan ? 'OFF_PLAN' : 'READY'} onChange={e => setIsOffPlan(e.target.value === 'OFF_PLAN')} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem' }}>
                <option value="READY">Ready Property (Title Deed Issued)</option>
                <option value="OFF_PLAN">Off-Plan (Oqood Initial Contract)</option>
              </select>
            </div>
          </div>

          <div style={{ background: isGoldenVisaEligible ? 'var(--color-ecfdf5, #ECFDF5)' : 'var(--color-fef2f2, #FEF2F2)', border: `1px solid ${isGoldenVisaEligible ? 'var(--color-a7f3d0, #A7F3D0)' : 'var(--color-fecaca, #FECACA)'}`, padding: '1.25rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: isGoldenVisaEligible ? 'var(--color-065f46, #065F46)' : 'var(--color-991b1b, #991B1B)' }}>
                {isGoldenVisaEligible ? '✓ 100% ELIGIBLE FOR 10-YEAR UAE GOLDEN VISA' : '✗ BELOW AED 2,000,000 STATUTORY THRESHOLD'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-475569, #475569)', marginTop: '4px' }}>
                Total Eligible Equity: <strong>AED {effectiveEquity.toLocaleString()}</strong> | Eligible for spouse, children, and domestic staff sponsorship.
              </div>
            </div>
            {isGoldenVisaEligible && (
              <button onClick={() => alert('Generated Golden Visa ICP Application Packet.')} style={{ background: 'var(--color-047857, #047857)', color: 'var(--white, #FFF)', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
                Generate ICP Application Pack
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Crypto FX */}
      {activeTab === 'crypto' && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Real Estate Crypto FX Rate Lock & Escrow Conversion
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)' }}>
            Fully compliant with VARA (Virtual Assets Regulatory Authority) & UAE Central Bank crypto-to-fiat escrow transfers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Property Price in AED</label>
              <input type="number" value={propertyPriceAed} onChange={e => setPropertyPriceAed(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Cryptocurrency Asset</label>
              <select value={selectedCrypto} onChange={e => setSelectedCrypto(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }}>
                <option value="USDT">USDT (Tether USD) - 1:3.6725 Peg</option>
                <option value="BTC">BTC (Bitcoin)</option>
                <option value="ETH">ETH (Ethereum)</option>
              </select>
            </div>
          </div>

          <div style={{ background: 'var(--color-fdf2f8, #FDF2F8)', border: '1px solid var(--color-fbcfe8, #FBCFE8)', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-9d174d, #9D174D)', fontWeight: 800 }}>ESTIMATED CRYPTO CONVERSION LOCK (15-MIN GUARANTEE)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-831843, #831843)', marginTop: '4px' }}>
              {cryptoRequired} {selectedCrypto}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-9d174d, #9D174D)', marginTop: '4px' }}>
              Settlement Currency: AED into White Caves Corporate Wio Escrow Account
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Chauffeur & Jet */}
      {activeTab === 'chauffeur' && (
        <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', color: 'var(--color-475569, #475569)', fontWeight: 800 }}>
                <th style={{ padding: '10px 14px' }}>VIP Guest</th>
                <th style={{ padding: '10px 14px' }}>Concierge Transport</th>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Itinerary</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {vipGuests.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>{v.client}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-be185d, #BE185D)', fontWeight: 700 }}>{v.service}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary, #64748B)' }}>{v.date}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-334155, #334155)' }}>{v.itinerary}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: 'var(--color-ecfdf5, #ECFDF5)', color: 'var(--color-047857, #047857)' }}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Family Office */}
      {activeTab === 'family-office' && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Family Office Multi-Asset Real Estate Deck
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #64748B)' }}>
            Tailored investment thesis and risk diversification across commercial, residential, and prime off-plan portfolios.
          </p>
        </div>
      )}
    </div>
  );
};

export default KairosLuxuryCRM;
