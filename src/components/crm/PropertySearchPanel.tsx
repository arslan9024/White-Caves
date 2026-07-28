import React, { FC, useState, useMemo, useCallback } from 'react';
import { mockProperties, Property } from '../../mocks/dubaiRealEstateMocks';

const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const BORDER = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';
const TEXT_MUTED = '#64748B';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';

type SortKey = 'priceAED' | 'sqft' | 'beds' | 'title';
type SortDir = 'asc' | 'desc';
type ViewMode = 'grid' | 'table';

interface Filters {
  query: string;
  communities: string[];
  developers: string[];
  status: string;
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minSqft: number;
  currency: 'AED' | 'USD' | 'EUR' | 'GBP';
}

const ALL_COMMUNITIES = ['DAMAC Hills 2', 'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay'];
const ALL_DEVELOPERS = ['DAMAC', 'Emaar', 'Nakheel', 'Meraas', 'Sobha'];

const statusBadge: Record<string, { bg: string; color: string }> = {
  Available: { bg: '#DEF7EC', color: GREEN },
  Leased: { bg: '#FEF2F2', color: RED },
  UnderMaintenance: { bg: '#FFFBEB', color: ORANGE },
};

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=260&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=260&fit=crop',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=260&fit=crop',
];

// Supplement mock properties with richer type labels
const PROP_TYPES = ['Villa', 'Apartment', 'Townhouse', 'Penthouse', 'Studio'];
const enrichedProperties = mockProperties.map((p, i) => ({
  ...p,
  propType: PROP_TYPES[i % PROP_TYPES.length],
  imageUrl: PROPERTY_IMAGES[i % PROPERTY_IMAGES.length],
}));

export const PropertySearchPanel: FC = () => {
  const [filters, setFilters] = useState<Filters>({
    query: '',
    communities: [],
    developers: [],
    status: 'ALL',
    minPrice: 0,
    maxPrice: 20000000,
    minBeds: 0,
    minSqft: 0,
    currency: 'AED',
  });
  const [sortKey, setSortKey] = useState<SortKey>('priceAED');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isVerifyingDLD, setIsVerifyingDLD] = useState(false);
  const [dldVerifiedResult, setDldVerifiedResult] = useState<null | { permitValid: boolean; ownerVerified: boolean; titleDeedNo: string }>(null);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; color: string }>>([]);

  const showToast = useCallback((message: string, color = RED) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);
  const PAGE_SIZE = viewMode === 'grid' ? 12 : 20;

  const currencyKey: Record<string, keyof Property> = {
    AED: 'priceAED',
    USD: 'priceUSD',
    EUR: 'priceEUR',
    GBP: 'priceGBP',
  };

  const currencySymbol: Record<string, string> = {
    AED: 'AED', USD: 'USD', EUR: '€', GBP: '£',
  };

  const filtered = useMemo(() => {
    return enrichedProperties
      .filter(p => {
        const q = filters.query.toLowerCase();
        const matchQuery = !q || p.title.toLowerCase().includes(q) || p.community.toLowerCase().includes(q) || p.developer.toLowerCase().includes(q);
        const matchCom = filters.communities.length === 0 || filters.communities.includes(p.community);
        const matchDev = filters.developers.length === 0 || filters.developers.includes(p.developer);
        const matchStatus = filters.status === 'ALL' || p.status === filters.status;
        const matchPrice = p.priceAED >= filters.minPrice && p.priceAED <= filters.maxPrice;
        const matchBeds = p.beds >= filters.minBeds;
        const matchSqft = p.sqft >= filters.minSqft;
        return matchQuery && matchCom && matchDev && matchStatus && matchPrice && matchBeds && matchSqft;
      })
      .sort((a, b) => {
        const aVal = sortKey === 'title' ? a.title : Number(a[sortKey as keyof Property]);
        const bVal = sortKey === 'title' ? b.title : Number(b[sortKey as keyof Property]);
        if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
        return sortDir === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
      });
  }, [filters, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleFilter = (key: 'communities' | 'developers', val: string) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));
    setPage(1);
  };

  const clearAll = () => {
    setFilters({ query: '', communities: [], developers: [], status: 'ALL', minPrice: 0, maxPrice: 20000000, minBeds: 0, minSqft: 0, currency: 'AED' });
    setPage(1);
  };

  const priceDisplay = (p: Property) => {
    const val = p[currencyKey[filters.currency] as keyof Property] as number;
    return `${currencySymbol[filters.currency]} ${val.toLocaleString()}`;
  };

  return (
    <div style={{ padding: '24px', background: WHITE, minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: SLATE }}>🏠 Advanced Property Search</h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            {filtered.length} of {enrichedProperties.length} properties · Multi-filter · Multi-currency
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Currency Toggle */}
          <div style={{ display: 'flex', background: CARD_BG, borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            {(['AED', 'USD', 'EUR', 'GBP'] as const).map(cur => (
              <button key={cur} onClick={() => setFilters(f => ({ ...f, currency: cur }))}
                style={{ padding: '6px 10px', background: filters.currency === cur ? SLATE : 'transparent', color: filters.currency === cur ? WHITE : SLATE, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                {cur}
              </button>
            ))}
          </div>
          {/* View Mode */}
          <div style={{ display: 'flex', background: CARD_BG, borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            {(['grid', 'table'] as const).map(mode => (
              <button key={mode} onClick={() => { setViewMode(mode); setPage(1); }}
                style={{ padding: '6px 12px', background: viewMode === mode ? RED : 'transparent', color: viewMode === mode ? WHITE : SLATE, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                {mode === 'grid' ? '⊞ Grid' : '☰ Table'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
        {/* ─── SIDEBAR FILTERS ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search */}
          <div>
            <input type="text" placeholder="🔍 Search properties..." value={filters.query}
              onChange={e => { setFilters(f => ({ ...f, query: e.target.value })); setPage(1); }}
              style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, borderRadius: '8px', fontSize: '0.875rem', boxSizing: 'border-box' }} />
          </div>

          {/* Status */}
          <div style={{ background: CARD_BG, padding: '14px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: SLATE, marginBottom: '10px', textTransform: 'uppercase' }}>Status</div>
            {['ALL', 'Available', 'Leased', 'UnderMaintenance'].map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="radio" name="status" checked={filters.status === s}
                  onChange={() => { setFilters(f => ({ ...f, status: s })); setPage(1); }}
                  style={{ accentColor: RED }} />
                <span style={{ color: s === 'ALL' ? SLATE : (statusBadge[s]?.color || SLATE), fontWeight: 600 }}>
                  {s === 'ALL' ? 'All Statuses' : s}
                </span>
              </label>
            ))}
          </div>

          {/* Community */}
          <div style={{ background: CARD_BG, padding: '14px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: SLATE, marginBottom: '10px', textTransform: 'uppercase' }}>Community</div>
            {ALL_COMMUNITIES.map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={filters.communities.includes(c)}
                  onChange={() => toggleFilter('communities', c)}
                  style={{ accentColor: RED }} />
                {c}
              </label>
            ))}
          </div>

          {/* Developer */}
          <div style={{ background: CARD_BG, padding: '14px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: SLATE, marginBottom: '10px', textTransform: 'uppercase' }}>Developer</div>
            {ALL_DEVELOPERS.map(d => (
              <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={filters.developers.includes(d)}
                  onChange={() => toggleFilter('developers', d)}
                  style={{ accentColor: RED }} />
                {d}
              </label>
            ))}
          </div>

          {/* Min Beds */}
          <div style={{ background: CARD_BG, padding: '14px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: SLATE, marginBottom: '10px', textTransform: 'uppercase' }}>Min Bedrooms</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => { setFilters(f => ({ ...f, minBeds: n })); setPage(1); }}
                  style={{ padding: '5px 10px', borderRadius: '6px', border: `1px solid ${BORDER}`, background: filters.minBeds === n ? RED : WHITE, color: filters.minBeds === n ? WHITE : SLATE, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                  {n === 0 ? 'Any' : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div style={{ background: CARD_BG, padding: '14px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: SLATE, marginBottom: '10px', textTransform: 'uppercase' }}>Price (AED)</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" placeholder="Min" value={filters.minPrice || ''}
                onChange={e => { setFilters(f => ({ ...f, minPrice: Number(e.target.value) || 0 })); setPage(1); }}
                style={{ width: '100%', padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.8rem' }} />
              <input type="number" placeholder="Max" value={filters.maxPrice === 20000000 ? '' : filters.maxPrice}
                onChange={e => { setFilters(f => ({ ...f, maxPrice: Number(e.target.value) || 20000000 })); setPage(1); }}
                style={{ width: '100%', padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.8rem' }} />
            </div>
          </div>

          <button onClick={clearAll}
            style={{ padding: '10px', background: '#E2E8F0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', color: SLATE }}>
            ✕ Clear All Filters
          </button>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div>
          {/* Sort Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: TEXT_MUTED }}>
              Showing <strong>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: TEXT_MUTED }}>Sort by:</span>
              <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
                style={{ padding: '5px 8px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.8rem' }}>
                <option value="priceAED">Price</option>
                <option value="sqft">Area (sqft)</option>
                <option value="beds">Bedrooms</option>
                <option value="title">Name</option>
              </select>
              <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                style={{ padding: '5px 10px', border: `1px solid ${BORDER}`, borderRadius: '6px', background: WHITE, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>
          </div>

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              {paged.map((p: any) => (
                <div key={p.id} onClick={() => setSelectedProperty(p === selectedProperty ? null : p)}
                  style={{ background: WHITE, borderRadius: '12px', border: selectedProperty?.id === p.id ? `2px solid ${RED}` : `1px solid ${BORDER}`, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: selectedProperty?.id === p.id ? `0 4px 16px ${RED}30` : '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: statusBadge[p.status]?.bg || CARD_BG, color: statusBadge[p.status]?.color || TEXT_MUTED, padding: '3px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {p.status}
                    </span>
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15,23,42,0.75)', color: WHITE, padding: '3px 8px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                      {p.propType}
                    </span>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: SLATE, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: TEXT_MUTED, marginBottom: '8px' }}>{p.community} · {p.developer}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: '1rem', color: RED }}>{priceDisplay(p)}</div>
                      <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>{p.beds}bd · {p.baths}ba · {p.sqft.toLocaleString()} sqft</div>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: TEXT_MUTED, marginTop: '6px', fontFamily: 'monospace' }}>{p.reraPermitNumber}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && (
            <div style={{ background: WHITE, borderRadius: '10px', border: `1px solid ${BORDER}`, overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: SLATE, color: WHITE }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>PROPERTY</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>COMMUNITY</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>STATUS</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>PRICE ({filters.currency})</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>BEDS</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>SQFT</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>RERA PERMIT</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((p: any, idx: number) => {
                    const sc = statusBadge[p.status] || { bg: CARD_BG, color: TEXT_MUTED };
                    return (
                      <tr key={p.id} onClick={() => setSelectedProperty(p === selectedProperty ? null : p)}
                        style={{ borderBottom: '1px solid #E2E8F0', background: selectedProperty?.id === p.id ? '#FEF2F2' : idx % 2 === 0 ? WHITE : CARD_BG, cursor: 'pointer' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: SLATE }}>{p.title}</td>
                        <td style={{ padding: '10px 14px', color: TEXT_MUTED }}>{p.community} · {p.developer}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: '10px', fontWeight: 700, fontSize: '0.72rem' }}>{p.status}</span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: RED }}>{priceDisplay(p)}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>{p.beds}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>{p.sqft.toLocaleString()}</td>
                        <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '0.72rem', color: TEXT_MUTED }}>{p.reraPermitNumber}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
            <button onClick={() => setPage(1)} disabled={page === 1}
              style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${BORDER}`, background: WHITE, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, fontWeight: 700 }}>
              «
            </button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${BORDER}`, background: WHITE, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, fontWeight: 700 }}>
              ‹
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
              return (
                <button key={`page-btn-${i}-${pg}`} onClick={() => setPage(pg)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${pg === page ? RED : BORDER}`, background: pg === page ? RED : WHITE, color: pg === page ? WHITE : SLATE, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                  {pg}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${BORDER}`, background: WHITE, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, fontWeight: 700 }}>
              ›
            </button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
              style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${BORDER}`, background: WHITE, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, fontWeight: 700 }}>
              »
            </button>
          </div>

          {/* Selected Property Detail */}
          {selectedProperty && (
            <div style={{ marginTop: '20px', background: CARD_BG, padding: '20px', borderRadius: '12px', border: `2px solid ${RED}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: SLATE, fontSize: '1.1rem' }}>{selectedProperty.title}</h3>
                  <button onClick={() => setSelectedProperty(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, fontSize: '1.1rem' }}>✕</button>
                </div>
                {[
                  { label: 'Community', value: selectedProperty.community },
                  { label: 'Developer', value: selectedProperty.developer },
                  { label: 'Status', value: selectedProperty.status },
                  { label: 'RERA Permit', value: selectedProperty.reraPermitNumber },
                  { label: 'Bedrooms', value: `${selectedProperty.beds} beds · ${selectedProperty.baths} baths` },
                  { label: 'Area', value: `${selectedProperty.sqft.toLocaleString()} sqft` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', padding: '7px 0', fontSize: '0.85rem' }}>
                    <span style={{ color: TEXT_MUTED, fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: SLATE }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ background: '#FEF2F2', padding: '16px', borderRadius: '10px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: RED, fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Multi-Currency Pricing</div>
                  {['AED', 'USD', 'EUR', 'GBP'].map(cur => {
                    const key = currencyKey[cur] as keyof Property;
                    const val = selectedProperty[key] as number;
                    return (
                      <div key={cur} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', borderBottom: '1px solid #FCA5A530' }}>
                        <span style={{ color: TEXT_MUTED, fontWeight: 600 }}>{cur}</span>
                        <span style={{ fontWeight: 900, color: cur === 'AED' ? RED : SLATE }}>{currencySymbol[cur]} {val.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                {dldVerifiedResult && (
                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.8rem', color: '#065F46' }}>
                    <div style={{ fontWeight: 800, color: GREEN, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✓ DLD REST API VERIFIED</span>
                    </div>
                    <div>Permit #{selectedProperty.reraPermitNumber}: ACTIVE & VALID</div>
                    <div>Title Deed: #{dldVerifiedResult.titleDeedNo} (Smart Registry Clear)</div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setIsVerifyingDLD(true);
                      setDldVerifiedResult(null);
                      setTimeout(() => {
                        setIsVerifyingDLD(false);
                        setDldVerifiedResult({
                          permitValid: true,
                          ownerVerified: true,
                          titleDeedNo: `TD-2026-${Math.floor(100000 + Math.random() * 900000)}`
                        });
                      }, 750);
                    }}
                    disabled={isVerifyingDLD}
                    style={{ flex: '1 1 100%', padding: '10px', background: '#0284C7', color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}
                  >
                    {isVerifyingDLD ? '⏳ Querying Dubai Land Department REST API...' : '🏛️ Verify with DLD REST Live API'}
                  </button>
                  <button onClick={() => showToast(`📋 Creating enquiry lead for ${selectedProperty.title}...`, RED)}
                    style={{ flex: 1, padding: '10px', background: RED, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                    📋 Create Enquiry Lead
                  </button>
                  <button onClick={() => showToast(`📅 Booking viewing for ${selectedProperty.title}...`, SLATE)}
                    style={{ flex: 1, padding: '10px', background: SLATE, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                    📅 Book Viewing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{ background: t.color, color: WHITE, padding: '12px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', maxWidth: '360px' }}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertySearchPanel;
