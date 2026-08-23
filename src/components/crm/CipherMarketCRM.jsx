import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, BarChart3, Calculator, Search, Filter, 
  MapPin, CheckCircle, ArrowUp, ArrowDown, Download,
  Layers, Sparkles, RefreshCw, FileText, DollarSign
} from 'lucide-react';
import './AssistantDashboard.css';

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

interface CipherProps {
  moduleId?: string;
  role?: string;
  user?: AuthUser;
}

export const CipherMarketCRM: React.FC<CipherProps> = ({ moduleId }) => {
  const [activeTab, setActiveTab] = useState<'cma' | 'dld' | 'trends' | 'forecast'>('cma');

  useEffect(() => {
    if (!moduleId) return;
    if (moduleId.includes('dld')) setActiveTab('dld');
    else if (moduleId.includes('trend')) setActiveTab('trends');
    else if (moduleId.includes('forecast')) setActiveTab('forecast');
    else if (moduleId.includes('cma')) setActiveTab('cma');
  }, [moduleId]);

  // Feature 1: Automated CMA Builder
  const [community, setCommunity] = useState('Palm Jumeirah');
  const [propertyType, setPropertyType] = useState('Villa');
  const [bedrooms, setBedrooms] = useState('4');
  const [builtUpArea, setBuiltUpArea] = useState(5500);
  const [cmaValuation, setCmaValuation] = useState<any>(null);

  const calculateCma = () => {
    const avgSqftRate = community === 'Palm Jumeirah' ? 3450 : community === 'Downtown Dubai' ? 2600 : 1850;
    const estimatedValue = builtUpArea * avgSqftRate;
    const lowerBound = estimatedValue * 0.95;
    const upperBound = estimatedValue * 1.05;
    const suggestedRent = (estimatedValue * 0.065).toFixed(0);
    setCmaValuation({
      sqftRate: avgSqftRate,
      estimatedValue,
      lowerBound,
      upperBound,
      suggestedRent,
      confidenceScore: 94,
    });
  };

  // Feature 2: DLD Live Cluster Regressor
  const [dldCluster, setDldCluster] = useState([
    { ref: 'DLD-TX-88210', date: '2026-08-20', unit: 'Signature Villa Frond N', sqft: 7200, priceAed: 32000000, rateSqft: 4444, type: 'Secondary Sale' },
    { ref: 'DLD-TX-88204', date: '2026-08-19', unit: 'Garden Homes Frond C', sqft: 5000, priceAed: 18500000, rateSqft: 3700, type: 'Secondary Sale' },
    { ref: 'DLD-TX-88192', date: '2026-08-18', unit: 'The Royal Residences', sqft: 3400, priceAed: 14200000, rateSqft: 4176, type: 'Off-Plan Oqood' },
    { ref: 'DLD-TX-88180', date: '2026-08-15', unit: 'Palm Views East Apt', sqft: 1100, priceAed: 2400000, rateSqft: 2181, type: 'Secondary Sale' },
  ]);

  // Feature 3: Community Trend
  const communitiesTrend = [
    { name: 'Palm Jumeirah', avgPriceSqft: 'AED 3,450', change12m: '+18.4%', demand: 'ULTRA_HIGH' },
    { name: 'Downtown Dubai', avgPriceSqft: 'AED 2,600', change12m: '+12.1%', demand: 'HIGH' },
    { name: 'Dubai Hills Estate', avgPriceSqft: 'AED 1,950', change12m: '+15.2%', demand: 'VERY_HIGH' },
    { name: 'Business Bay', avgPriceSqft: 'AED 1,820', change12m: '+9.8%', demand: 'HIGH' },
  ];

  return (
    <div className="crm-container" style={{ maxWidth: '100%', padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--accent-teal, #0F766E) 0%, var(--color-115e59, #115E59) 100%)', color: 'var(--white, #FFFFFF)', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-teal, #14B8A6) 0%, var(--accent-teal, #0D9488) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            📊
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Cipher AI — Market Pricing & CMA Valuations</h2>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-ccfbf1, #CCFBF1)', fontWeight: 800 }}>
                DLD Transaction Regression Engine
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--color-ccfbf1, #CCFBF1)' }}>
              Automated Comparative Market Analysis (CMA), DLD historical transaction regressions, and price projection models.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'var(--white, #FFFFFF)', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveTab('cma')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'cma' ? '1px solid var(--accent-teal, #0D9488)' : '1px solid transparent', background: activeTab === 'cma' ? 'var(--accent-teal, #0D9488)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'cma' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.22.3 Automated CMA Builder
        </button>
        <button onClick={() => setActiveTab('dld')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'dld' ? '1px solid var(--accent-teal, #0D9488)' : '1px solid transparent', background: activeTab === 'dld' ? 'var(--accent-teal, #0D9488)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'dld' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.22.1 DLD Transaction Regressor
        </button>
        <button onClick={() => setActiveTab('trends')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'trends' ? '1px solid var(--accent-teal, #0D9488)' : '1px solid transparent', background: activeTab === 'trends' ? 'var(--accent-teal, #0D9488)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'trends' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.22.2 Community Price-Per-SqFt Trends
        </button>
        <button onClick={() => setActiveTab('forecast')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'forecast' ? '1px solid var(--accent-teal, #0D9488)' : '1px solid transparent', background: activeTab === 'forecast' ? 'var(--accent-teal, #0D9488)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'forecast' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.22.4 12-Month Price Projection
        </button>
      </div>

      {/* Tab 1: CMA Builder */}
      {activeTab === 'cma' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem' }}>
          <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
              CMA Valuation Parameters
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Community / Location</label>
                <select value={community} onChange={e => setCommunity(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }}>
                  <option value="Palm Jumeirah">Palm Jumeirah</option>
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="Dubai Hills Estate">Dubai Hills Estate</option>
                  <option value="Business Bay">Business Bay</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Property Type</label>
                  <select value={propertyType} onChange={e => setPropertyType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem' }}>
                    <option value="Villa">Villa / Mansion</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Bedrooms</label>
                  <input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Built-Up Area (Sq.Ft)</label>
                <input type="number" value={builtUpArea} onChange={e => setBuiltUpArea(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }} />
              </div>
              <button onClick={calculateCma} style={{ marginTop: '0.5rem', background: 'var(--accent-teal, #0D9488)', color: 'var(--white, #FFF)', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                Generate AI Comparative Market Analysis
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
              Appraisal Valuation Output
            </h4>
            {cmaValuation ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--color-f0fdfa, #F0FDFA)', border: '1px solid var(--color-99f6e4, #99F6E4)', padding: '1.25rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-teal, #0F766E)', fontWeight: 800 }}>ESTIMATED FAIR MARKET VALUE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-115e59, #115E59)', marginTop: '4px' }}>
                    AED {cmaValuation.estimatedValue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-teal, #0F766E)', marginTop: '4px' }}>
                    Benchmark Rate: AED {cmaValuation.sqftRate} / sqft | Confidence: {cmaValuation.confidenceScore}%
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', background: 'var(--color-f8fafc, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)' }}>Recommended Listing Band</div>
                    <div style={{ fontWeight: 800, color: 'var(--color-1e293b, #1E293B)', fontSize: '0.85rem', marginTop: '2px' }}>
                      AED {(cmaValuation.lowerBound / 1000000).toFixed(2)}M - {(cmaValuation.upperBound / 1000000).toFixed(2)}M
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'var(--color-f8fafc, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)' }}>Suggested Annual Rent</div>
                    <div style={{ fontWeight: 800, color: 'var(--accent-teal, #0D9488)', fontSize: '0.85rem', marginTop: '2px' }}>
                      AED {Number(cmaValuation.suggestedRent).toLocaleString()} / yr
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-94a3b8, #94A3B8)', fontSize: '0.85rem' }}>
                Enter property parameters on the left and click "Generate AI CMA" to view real-time valuation metrics.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: DLD Transaction Regressor */}
      {activeTab === 'dld' && (
        <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-1e293b, #1E293B)' }}>Recent DLD Registered Transfers</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal, #0D9488)', fontWeight: 800 }}>Live Telemetry Sync</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', color: 'var(--color-475569, #475569)', fontWeight: 800 }}>
                <th style={{ padding: '10px 14px' }}>DLD Ref</th>
                <th style={{ padding: '10px 14px' }}>Property Unit</th>
                <th style={{ padding: '10px 14px' }}>Area (SqFt)</th>
                <th style={{ padding: '10px 14px' }}>Transfer Price</th>
                <th style={{ padding: '10px 14px' }}>Price / SqFt</th>
                <th style={{ padding: '10px 14px' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {dldCluster.map(d => (
                <tr key={d.ref} style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--accent-teal, #0D9488)' }}>{d.ref}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-1e293b, #1E293B)' }}>{d.unit}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary, #64748B)' }}>{d.sqft.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>AED {d.priceAed.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--accent-teal, #0D9488)' }}>AED {d.rateSqft.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px', fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)' }}>{d.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Trends */}
      {activeTab === 'trends' && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Dubai Prime Neighborhood Price Growth & Demand Index
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {communitiesTrend.map(c => (
              <div key={c.name} style={{ padding: '1.25rem', background: 'var(--color-f8fafc, #F8FAFC)', borderRadius: '8px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
                <div style={{ fontWeight: 800, color: 'var(--color-1e293b, #1E293B)', fontSize: '0.95rem' }}>{c.name}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-teal, #0D9488)', marginTop: '4px' }}>{c.avgPriceSqft}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--accent-green, #10B981)', fontWeight: 800 }}>{c.change12m} (12 Mo)</span>
                  <span style={{ background: 'var(--color-ccfbf1, #CCFBF1)', color: 'var(--accent-teal, #0F766E)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{c.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Forecast */}
      {activeTab === 'forecast' && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            12-Month Predictive Price Appreciation Model
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)' }}>
            Multi-variable forecast taking into account supply pipeline, DLD velocity, and interest rate macro trends.
          </p>
          <div style={{ background: 'var(--color-f0fdfa, #F0FDFA)', border: '1px solid var(--color-99f6e4, #99F6E4)', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ fontWeight: 800, color: 'var(--accent-teal, #0F766E)' }}>Projected Dubai Prime Capital Appreciation: +11.2% in 2026-2027</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-475569, #475569)', marginTop: '4px' }}>
              Highest velocity forecast in luxury waterfront properties and green master-planned villa communities.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CipherMarketCRM;
