import React, { useState, useEffect } from 'react';

interface PriceIndexRow {
  area: string;
  zone: string;
  avgPricePerSqft: number;
  avgAnnualRent: number;
  grossYield: number;
  transactionVol: number;
  daysOnMarket: number;
  source: string;
  dataDate: string | null;
}

interface IndicatorData {
  avgDaysOnMarket: number;
  absorptionRate: number;
  newListings: number;
  activeListings: number;
  areasIncluded?: number;
  source: string;
  note?: string;
}

interface ReraRow {
  area: string;
  propertyType: string;
  bedrooms: string;
  avgRentAed: number;
  allowedIncreaseBelow10Pct: string;
  allowedIncrease10to20Pct: string;
  allowedIncrease20to30Pct: string;
  allowedIncrease30to40Pct: string;
  allowedIncreaseAbove40Pct: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(n);

const zoneBadge = (z: string) => {
  const map: Record<string, string> = {
    premium: 'bg-yellow-100 text-yellow-800',
    prime: 'bg-purple-100 text-purple-800',
    mid: 'bg-blue-100 text-blue-800',
    affordable: 'bg-green-100 text-green-800',
  };
  return map[z] ?? 'bg-gray-100 text-gray-800';
};

type Tab = 'price-index' | 'indicators' | 'rera-index';

export default function MarketIntelligencePage() {
  const [activeTab, setActiveTab] = useState<Tab>('price-index');
  const [priceIndex, setPriceIndex] = useState<PriceIndexRow[]>([]);
  const [indicators, setIndicators] = useState<IndicatorData | null>(null);
  const [reraIndex, setReraIndex] = useState<ReraRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [sortBy, setSortBy] = useState<'avgPricePerSqft' | 'grossYield'>('grossYield');

  const token = localStorage.getItem('token') ?? '';
  const authFetch = (url: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  const loadPriceIndex = async () => {
    setLoading(true);
    setError('');
    try {
      const url = `/api/market/price-index${zoneFilter ? `?zone=${zoneFilter}` : ''}`;
      const res = await authFetch(url);
      const json = await res.json();
      if (json.success) setPriceIndex(json.data);
      else setError(json.message ?? 'Failed to load price index.');
    } catch {
      setError('Network error loading price index.');
    } finally {
      setLoading(false);
    }
  };

  const loadIndicators = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/api/market/indicators');
      const json = await res.json();
      if (json.success) setIndicators(json.data);
      else setError(json.message ?? 'Failed to load indicators.');
    } catch {
      setError('Network error loading indicators.');
    } finally {
      setLoading(false);
    }
  };

  const loadReraIndex = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/api/market/rera-index');
      const json = await res.json();
      if (json.success) setReraIndex(json.data);
      else setError(json.message ?? 'Failed to load RERA index.');
    } catch {
      setError('Network error loading RERA index.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'price-index') loadPriceIndex();
    if (activeTab === 'indicators') loadIndicators();
    if (activeTab === 'rera-index') loadReraIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, zoneFilter]);

  const sortedIndex = [...priceIndex].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Market Intelligence</h1>
          <p className="text-gray-400 mt-1">
            Dubai property price index, transaction data, and RERA rental index
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-800 p-1 rounded-xl w-fit">
          {(['price-index', 'indicators', 'rera-index'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-yellow-500 text-gray-900'
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              {tab === 'price-index'
                ? 'Price Index'
                : tab === 'indicators'
                  ? 'Indicators'
                  : 'RERA Index'}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Price Index Tab */}
        {activeTab === 'price-index' && (
          <div>
            <div className="flex gap-4 mb-4 items-center">
              <select
                value={zoneFilter}
                onChange={e => setZoneFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm"
              >
                <option value="">All Zones</option>
                <option value="premium">Premium</option>
                <option value="prime">Prime</option>
                <option value="mid">Mid-Market</option>
                <option value="affordable">Affordable</option>
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm"
              >
                <option value="grossYield">Sort: Gross Yield</option>
                <option value="avgPricePerSqft">Sort: Price/sqft</option>
              </select>
              <span className="text-gray-500 text-sm">{sortedIndex.length} areas</span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading…</div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900 text-gray-400 text-xs">
                      <th className="px-4 py-3 text-left">Area</th>
                      <th className="px-4 py-3 text-left">Zone</th>
                      <th className="px-4 py-3 text-right">Price/sqft (AED)</th>
                      <th className="px-4 py-3 text-right">Avg Annual Rent</th>
                      <th className="px-4 py-3 text-right">Gross Yield</th>
                      <th className="px-4 py-3 text-right">Transactions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {sortedIndex.map(row => (
                      <tr key={row.area} className="hover:bg-gray-700/40 transition">
                        <td className="px-4 py-3 font-medium">{row.area}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${zoneBadge(row.zone)}`}
                          >
                            {row.zone}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-yellow-400 font-semibold">
                          {row.avgPricePerSqft.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-green-400">
                          {fmt(row.avgAnnualRent)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-bold ${row.grossYield >= 7 ? 'text-green-400' : row.grossYield >= 5 ? 'text-yellow-400' : 'text-gray-400'}`}
                          >
                            {row.grossYield.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-400">
                          {row.transactionVol || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Indicators Tab */}
        {activeTab === 'indicators' && (
          <div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading…</div>
            ) : indicators ? (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
                    <div className="text-gray-400 text-xs mb-2">Avg Days on Market</div>
                    <div className="text-3xl font-bold text-yellow-400">
                      {indicators.avgDaysOnMarket}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">days</div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
                    <div className="text-gray-400 text-xs mb-2">Absorption Rate</div>
                    <div className="text-3xl font-bold text-blue-400">
                      {indicators.absorptionRate}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      units sold / active listings (%)
                    </div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
                    <div className="text-gray-400 text-xs mb-2">New Listings</div>
                    <div className="text-3xl font-bold text-green-400">
                      {indicators.newListings}
                    </div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
                    <div className="text-gray-400 text-xs mb-2">Active Listings</div>
                    <div className="text-3xl font-bold text-purple-400">
                      {indicators.activeListings}
                    </div>
                  </div>
                </div>
                {indicators.note && (
                  <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-300 text-sm">
                    ℹ️ {indicators.note}
                  </div>
                )}
                <div className="mt-4 text-gray-500 text-xs">
                  Source: {indicators.source}
                  {indicators.areasIncluded && ` · ${indicators.areasIncluded} areas included`}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* RERA Index Tab */}
        {activeTab === 'rera-index' && (
          <div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading…</div>
            ) : (
              <div>
                <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-300 text-sm">
                  ⚠️ Based on RERA Rental Index 2024. Always verify with the official RERA portal
                  before issuing Form 7 (Rent Increase Notice).
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-gray-400 text-xs">
                        <th className="px-4 py-3 text-left">Area</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Beds</th>
                        <th className="px-4 py-3 text-right">Avg Rent (AED/yr)</th>
                        <th className="px-4 py-3 text-center" colSpan={5}>
                          Max Allowed Increase
                        </th>
                      </tr>
                      <tr className="bg-gray-900 text-gray-500 text-xs">
                        <th colSpan={4} />
                        <th className="px-2 py-1 text-center">&lt;10%</th>
                        <th className="px-2 py-1 text-center">10-20%</th>
                        <th className="px-2 py-1 text-center">20-30%</th>
                        <th className="px-2 py-1 text-center">30-40%</th>
                        <th className="px-2 py-1 text-center">&gt;40%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {reraIndex.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-700/40">
                          <td className="px-4 py-3 font-medium">{r.area}</td>
                          <td className="px-4 py-3 text-gray-400 capitalize">{r.propertyType}</td>
                          <td className="px-4 py-3 text-gray-400">{r.bedrooms}</td>
                          <td className="px-4 py-3 text-right text-yellow-400 font-semibold">
                            {fmt(r.avgRentAed)}
                          </td>
                          <td className="px-2 py-3 text-center text-gray-400">
                            {r.allowedIncreaseBelow10Pct}
                          </td>
                          <td className="px-2 py-3 text-center text-yellow-400">
                            {r.allowedIncrease10to20Pct}
                          </td>
                          <td className="px-2 py-3 text-center text-orange-400">
                            {r.allowedIncrease20to30Pct}
                          </td>
                          <td className="px-2 py-3 text-center text-red-400">
                            {r.allowedIncrease30to40Pct}
                          </td>
                          <td className="px-2 py-3 text-center text-red-500">
                            {r.allowedIncreaseAbove40Pct}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
