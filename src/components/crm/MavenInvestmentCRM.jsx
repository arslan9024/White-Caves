import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, BarChart3, Calculator, PieChart, 
  CheckCircle2, DollarSign, Download, Layers, Sparkles
} from 'lucide-react';
import './AssistantDashboard.css';

export const MavenInvestmentCRM = ({ moduleId, role, user }) => {
  const [activeTab, setActiveTab] = useState('dcf');

  useEffect(() => {
    if (!moduleId) return;
    if (moduleId.includes('dcf')) setActiveTab('dcf');
    else if (moduleId.includes('yield')) setActiveTab('yield');
    else if (moduleId.includes('rebalancer') || moduleId.includes('portfolio')) setActiveTab('rebalancer');
    else if (moduleId.includes('appreciation')) setActiveTab('appreciation');
  }, [moduleId]);

  // Feature 1: DCF Calculator
  const [initialInvestment, setInitialInvestment] = useState(5000000);
  const [holdingYears, setHoldingYears] = useState(5);
  const [annualRentalGrowth, setAnnualRentalGrowth] = useState(5);
  const [initialRent, setInitialRent] = useState(380000);
  const [exitCapRate, setExitCapRate] = useState(6.5);

  const calculateDcf = () => {
    let totalCashFlow = 0;
    let currentRent = initialRent;
    for (let i = 1; i <= holdingYears; i++) {
      totalCashFlow += currentRent;
      currentRent *= (1 + (annualRentalGrowth / 100));
    }
    const exitPrice = currentRent / (exitCapRate / 100);
    const totalReturn = totalCashFlow + exitPrice - initialInvestment;
    const irr = (((exitPrice + totalCashFlow) / initialInvestment) ** (1 / holdingYears) - 1) * 100;
    return {
      totalCashFlow: Math.round(totalCashFlow),
      exitPrice: Math.round(exitPrice),
      totalReturn: Math.round(totalReturn),
      irr: irr.toFixed(1),
    };
  };

  const dcfResults = calculateDcf();

  // Feature 2: Yield Comparator
  const [propValue, setPropValue] = useState(2400000);
  const longTermRent = 165000;
  const longTermNet = longTermRent * 0.95; // 5% maintenance
  const shortTermGross = 245000;
  const shortTermNet = shortTermGross * 0.78; // 22% operator + DTCM fees

  const longTermYield = ((longTermNet / propValue) * 100).toFixed(2);
  const shortTermYield = ((shortTermNet / propValue) * 100).toFixed(2);

  return (
    <div className="crm-container" style={{ maxWidth: '100%', padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-14532d, #14532D) 0%, var(--color-052e16, #052E16) 100%)', color: 'var(--white, #FFFFFF)', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-green, #22C55E) 0%, var(--accent-green, #16A34A) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            📌
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Maven AI — Investment Portfolio & Feasibility</h2>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-bbf7d0, #BBF7D0)', fontWeight: 800 }}>
                Financial Engineering
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--color-dcfce7, #DCFCE7)' }}>
              10-Year DCF / IRR financial modeling, Short-Term Airbnb vs Long-Term Ejari yield comparator, and portfolio risk rebalancing.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'var(--white, #FFFFFF)', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveTab('dcf')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'dcf' ? '1px solid var(--accent-green, #16A34A)' : '1px solid transparent', background: activeTab === 'dcf' ? 'var(--accent-green, #16A34A)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'dcf' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.26.1 10-Year DCF & IRR Model
        </button>
        <button onClick={() => setActiveTab('yield')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'yield' ? '1px solid var(--accent-green, #16A34A)' : '1px solid transparent', background: activeTab === 'yield' ? 'var(--accent-green, #16A34A)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'yield' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.26.2 Short vs Long-Term Yields
        </button>
        <button onClick={() => setActiveTab('rebalancer')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'rebalancer' ? '1px solid var(--accent-green, #16A34A)' : '1px solid transparent', background: activeTab === 'rebalancer' ? 'var(--accent-green, #16A34A)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'rebalancer' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.26.3 Portfolio Rebalancer
        </button>
        <button onClick={() => setActiveTab('appreciation')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'appreciation' ? '1px solid var(--accent-green, #16A34A)' : '1px solid transparent', background: activeTab === 'appreciation' ? 'var(--accent-green, #16A34A)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'appreciation' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.26.4 Capital Appreciation
        </button>
      </div>

      {/* Tab 1: DCF Model */}
      {activeTab === 'dcf' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem' }}>
          <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
              DCF Simulation Variables
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Initial Purchase Price (AED)</label>
                <input type="number" value={initialInvestment} onChange={e => setInitialInvestment(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Holding Horizon ({holdingYears} Yrs)</label>
                  <input type="number" min="1" max="15" value={holdingYears} onChange={e => setHoldingYears(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Annual Rent Growth ({annualRentalGrowth}%)</label>
                  <input type="number" value={annualRentalGrowth} onChange={e => setAnnualRentalGrowth(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Year 1 Annual Net Rent (AED)</label>
                <input type="number" value={initialRent} onChange={e => setInitialRent(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem' }} />
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-f0fdf4, #F0FDF4)', border: '1px solid var(--color-bbf7d0, #BBF7D0)', padding: '1.25rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-166534, #166534)', fontWeight: 800 }}>ESTIMATED INTERNAL RATE OF RETURN (IRR)</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-15803d, #15803D)', marginTop: '4px' }}>
                {dcfResults.irr}% p.a.
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-166534, #166534)', marginTop: '4px' }}>
                Projected {holdingYears}-Year Net Profit: <strong>AED {dcfResults.totalReturn.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--color-f8fafc, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)' }}>Cumulative Rental Cash Flow</div>
                <div style={{ fontWeight: 800, color: 'var(--color-1e293b, #1E293B)', fontSize: '0.85rem', marginTop: '2px' }}>
                  AED {dcfResults.totalCashFlow.toLocaleString()}
                </div>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--color-f8fafc, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)' }}>Projected Year {holdingYears} Exit Value</div>
                <div style={{ fontWeight: 800, color: 'var(--accent-green, #16A34A)', fontSize: '0.85rem', marginTop: '2px' }}>
                  AED {dcfResults.exitPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Short vs Long-Term Yields */}
      {activeTab === 'yield' && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Short-Term Holiday Home (Airbnb) vs Long-Term (Ejari) Yield Analysis
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-1e293b, #1E293B)', fontSize: '1rem' }}>🏢 Long-Term Annual Lease (Ejari)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-green, #16A34A)', margin: '8px 0' }}>{longTermYield}% Net Yield</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)' }}>
                • Gross Rent: AED {longTermRent.toLocaleString()} / yr<br />
                • Zero management fee, 1-4 PDC Cheques<br />
                • 100% Guaranteed occupancy for 12 months
              </div>
            </div>

            <div style={{ background: 'var(--color-f0fdf4, #F0FDF4)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-bbf7d0, #BBF7D0)' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-15803d, #15803D)', fontSize: '1rem' }}>🏖️ Short-Term Holiday Home (DTCM)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-15803d, #15803D)', margin: '8px 0' }}>{shortTermYield}% Net Yield</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-166534, #166534)' }}>
                • Gross Booking Revenue: AED {shortTermGross.toLocaleString()} / yr<br />
                • Net after 20% operator fee + DTCM taxes: AED {shortTermNet.toLocaleString()}<br />
                • Seasonal premium during Q4/Q1 Dubai peak tourism
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3 & 4: Rebalancer & Appreciation */}
      {(activeTab === 'rebalancer' || activeTab === 'appreciation') && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            {activeTab === 'rebalancer' ? 'Real Estate Portfolio Diversification Matrix' : '10-Year Capital Growth Forecasting'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #64748B)' }}>
            Optimizes client holdings across high-yield residential apartments, luxury capital appreciation villas, and commercial real estate.
          </p>
        </div>
      )}
    </div>
  );
};

export default MavenInvestmentCRM;
