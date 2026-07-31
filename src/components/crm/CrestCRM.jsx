import React, { useState } from 'react';
import { Home, TrendingUp, MapPin, BarChart2, AlertCircle, CheckCircle } from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const VALUATIONS = [
  {
    id: 1,
    property: 'Palm Jumeirah Villa G-12',
    area: 'Palm Jumeirah',
    beds: 5,
    sqft: 8200,
    estimate: 'AED 14.8M',
    range: 'AED 14.1M – 15.5M',
    confidence: 91,
    comparable: 4,
    requested: '1h ago',
  },
  {
    id: 2,
    property: 'Marina Gate 2BR #2204',
    area: 'Dubai Marina',
    beds: 2,
    sqft: 1320,
    estimate: 'AED 1.92M',
    range: 'AED 1.78M – 2.06M',
    confidence: 88,
    comparable: 7,
    requested: '3h ago',
  },
  {
    id: 3,
    property: 'Emirates Hills Sector E',
    area: 'Emirates Hills',
    beds: 7,
    sqft: 14500,
    estimate: 'AED 28.4M',
    range: 'AED 26M – 31M',
    confidence: 76,
    comparable: 2,
    requested: '1d ago',
  },
  {
    id: 4,
    property: 'JVC Studio Bloom #304',
    area: 'JVC',
    beds: 0,
    sqft: 480,
    estimate: 'AED 582K',
    range: 'AED 540K – 620K',
    confidence: 94,
    comparable: 12,
    requested: '2d ago',
  },
];

const COMPS = [
  {
    address: 'Palm Jumeirah Frond N, Villa',
    sold: 'AED 13.9M',
    sqft: 7800,
    psf: 1782,
    date: '2 weeks ago',
  },
  {
    address: 'Palm Jumeirah Frond L, Villa',
    sold: 'AED 15.2M',
    sqft: 8600,
    psf: 1767,
    date: '1 month ago',
  },
  {
    address: 'Palm Jumeirah Frond H, Villa',
    sold: 'AED 14.5M',
    sqft: 8100,
    psf: 1790,
    date: '6 weeks ago',
  },
  {
    address: 'Palm Jumeirah Frond G, Villa',
    sold: 'AED 16.1M',
    sqft: 9200,
    psf: 1750,
    date: '2 months ago',
  },
];

const CrestCRM = () => {
  const [activeTab, setActiveTab] = useState('valuations');
  const [calcSqft, setCalcSqft] = useState(1500);
  const [calcBeds, setCalcBeds] = useState(2);
  const [calcArea, setCalcArea] = useState('Dubai Marina');

  const areaRates = {
    'Palm Jumeirah': 4250,
    'Dubai Marina': 1950,
    'Emirates Hills': 2800,
    'Downtown Dubai': 3100,
    'Business Bay': 1600,
    JVC: 850,
  };
  // eslint-disable-next-line security/detect-object-injection
  const estVal = (areaRates[calcArea] || 1500) * calcSqft;

  const tabs = [
    { id: 'valuations', label: '🏷️ Valuations' },
    { id: 'comparables', label: '🔍 Comparables' },
    { id: 'calculator', label: '🧮 Estimator' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard crest">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, var(--accent-red, #E31E24) 0%, var(--accent-red, #9B1C1C) 100%)' }}
        >
          <Home size={28} />
        </div>
        <div className="assistant-info">
          <h2>Crest — Property Valuation Engine</h2>
          <p>AI-powered AVM valuations using live DLD data and comparable sales</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Valuing
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: 'var(--color-e31e24, #E31E24)' }}
          >
            <Home size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{VALUATIONS.length}</span>
            <span className="stat-label">Valuations</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green, #22C55E)' }}
          >
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">87%</span>
            <span className="stat-label">Avg Confidence</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue, #3B82F6)' }}
          >
            <BarChart2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">25</span>
            <span className="stat-label">Comparables Used</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-gold, #F59E0B)' }}
          >
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">±3.2%</span>
            <span className="stat-label">Margin of Error</span>
          </div>
        </div>
      </div>

      <div className="crm-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`crm-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'valuations' && (
        <div className="tab-content">
          {VALUATIONS.map(v => (
            <div
              key={v.id}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <strong style={{ fontSize: 15 }}>{v.property}</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginTop: 2 }}>
                    <MapPin size={11} style={{ display: 'inline' }} /> {v.area} ·{' '}
                    {v.beds || 'Studio'} bed · {v.sqft.toLocaleString()} sqft
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-e31e24, #E31E24)' }}>
                    {v.estimate}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary, #6b7280)' }}>{v.range}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)' }}>Confidence:</span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: '#e5e7eb',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${v.confidence}%`,
                      height: '100%',
                      background:
                        v.confidence >= 90 ? '#22C55E' : v.confidence >= 75 ? '#F59E0B' : '#E31E24',
                      borderRadius: 4,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: v.confidence >= 90 ? '#22C55E' : '#F59E0B',
                  }}
                >
                  {v.confidence}%
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)' }}>
                {v.comparable} comparable sales · Requested {v.requested}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'comparables' && (
        <div className="tab-content">
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: 16,
              fontSize: 12,
              color: '#6b7280',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 8,
              padding: '10px 14px',
            }}
          >
            <AlertCircle size={14} color="#0EA5E9" />
            Showing comparables for Palm Jumeirah Villa G-12
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Sold Price</th>
                <th>Sqft</th>
                <th>PSF (AED)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {COMPS.map((c, i) => (
                <tr key={i}>
                  <td>
                    <strong>{c.address}</strong>
                  </td>
                  <td>{c.sold}</td>
                  <td>{c.sqft.toLocaleString()}</td>
                  <td>{c.psf.toLocaleString()}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)' }}>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Quick Valuation Estimator</h3>
          <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-secondary, #6b7280)', marginBottom: 6, display: 'block' }}>
                Area
              </label>
              <select
                value={calcArea}
                onChange={e => setCalcArea(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 14,
                }}
              >
                {Object.keys(areaRates).map(a => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-secondary, #6b7280)', marginBottom: 6, display: 'block' }}>
                Size (sqft)
              </label>
              <input
                type="number"
                value={calcSqft}
                onChange={e => setCalcSqft(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-secondary, #6b7280)', marginBottom: 6, display: 'block' }}>
                Bedrooms
              </label>
              <select
                value={calcBeds}
                onChange={e => setCalcBeds(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 14,
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map(n => (
                  <option key={n} value={n}>
                    {n === 0 ? 'Studio' : `${n} BR`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            style={{
              background: '#fff7f7',
              border: '1px solid #fecaca',
              borderRadius: 12,
              padding: 20,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginBottom: 8 }}>Estimated Value</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--color-e31e24, #E31E24)' }}>
              AED {estVal.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary, #9ca3af)', marginTop: 6 }}>
              {/* eslint-disable-next-line security/detect-object-injection */}
              Based on {areaRates[calcArea]} AED/sqft avg for {calcArea}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="crest" color="#E31E24" assistantName="Crest" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="crest" color="#E31E24" assistantName="Crest" />
      )}
    </div>
  );
};

export default CrestCRM;
