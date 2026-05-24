import React, { useState, useEffect } from 'react';

interface ValuationRecord {
  id: string;
  propertyId: string;
  estimatedValueAed: number;
  rentAnnualAed: number;
  grossYieldPct: number;
  netYieldPct: number;
  confidence: string;
  method: string;
  ageDiscount: number;
  amenityPremium: number;
  priceRangeLow?: number;
  priceRangeHigh?: number;
  overrideReason?: string;
  bankRequestStatus?: string;
  createdAt: string;
}

const confidenceBadge = (c: string) => {
  const map: Record<string, string> = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800',
  };
  return map[c] ?? 'bg-gray-100 text-gray-800';
};

const methodLabel = (m: string) => {
  const map: Record<string, string> = {
    avm: 'AVM',
    manual_override: 'Manual Override',
    bank: 'Bank Valuation',
  };
  return map[m] ?? m;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(n);

export default function ValuationPage() {
  const [propertyId, setPropertyId] = useState('');
  const [inputId, setInputId] = useState('');
  const [latest, setLatest] = useState<ValuationRecord | null>(null);
  const [history, setHistory] = useState<ValuationRecord[]>([]);
  const [totalHistory, setTotalHistory] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Yield calculator state
  const [calcSalePrice, setCalcSalePrice] = useState('');
  const [calcRent, setCalcRent] = useState('');
  const [calcSC, setCalcSC] = useState('');
  const [calcResult, setCalcResult] = useState<{
    grossYieldPct: number;
    netYieldPct: number;
  } | null>(null);

  // Override form state
  const [showOverride, setShowOverride] = useState(false);
  const [overrideValue, setOverrideValue] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideLoading, setOverrideLoading] = useState(false);

  const token = localStorage.getItem('token') ?? '';

  const authFetch = (url: string, opts: RequestInit = {}) =>
    fetch(url, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(opts.headers ?? {}),
      },
    });

  const loadValuation = async (pid: string) => {
    setLoading(true);
    setError('');
    try {
      const [latestRes, histRes] = await Promise.all([
        authFetch(`/api/valuations/${pid}`),
        authFetch(`/api/valuations/${pid}/history?pageSize=10`),
      ]);
      const latestJson = await latestRes.json();
      const histJson = await histRes.json();
      setLatest(latestJson.data?.latest ?? null);
      setHistory(histJson.data ?? []);
      setTotalHistory(histJson.pagination?.total ?? 0);
    } catch {
      setError('Failed to load valuation data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputId.trim()) return;
    setPropertyId(inputId.trim());
    loadValuation(inputId.trim());
  };

  const handleRecalculate = async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const res = await authFetch(`/api/valuations/${propertyId}/recalculate`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setLatest(json.data);
        loadValuation(propertyId);
      } else {
        setError(json.message ?? 'Recalculation failed.');
      }
    } catch {
      setError('Failed to recalculate valuation.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId) return;
    setOverrideLoading(true);
    try {
      const res = await authFetch(`/api/valuations/${propertyId}/override`, {
        method: 'POST',
        body: JSON.stringify({
          overrideValueAed: parseFloat(overrideValue),
          reason: overrideReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setLatest(json.data);
        setShowOverride(false);
        setOverrideValue('');
        setOverrideReason('');
        loadValuation(propertyId);
      } else {
        setError(json.message ?? 'Override failed.');
      }
    } catch {
      setError('Failed to submit override.');
    } finally {
      setOverrideLoading(false);
    }
  };

  const handleYieldCalc = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch(
      `/api/valuations/yield-calculator?salePrice=${calcSalePrice}&annualRent=${calcRent}&serviceCharge=${calcSC}`
    );
    const json = await res.json();
    if (json.success) setCalcResult(json.data);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Property Valuation</h1>
          <p className="text-gray-400 mt-1">
            AVM estimates, manual overrides, and bank valuation requests
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={inputId}
            onChange={e => setInputId(e.target.value)}
            placeholder="Enter Property ID"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-yellow-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition"
          >
            Load
          </button>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Latest Valuation Card */}
        {latest && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Latest Valuation</h2>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${confidenceBadge(latest.confidence)}`}
                >
                  {latest.confidence} confidence
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {methodLabel(latest.method)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 text-xs mb-1">Estimated Value</div>
                <div className="text-yellow-400 text-xl font-bold">
                  {fmt(latest.estimatedValueAed)}
                </div>
                {latest.priceRangeLow && latest.priceRangeHigh && (
                  <div className="text-gray-500 text-xs mt-1">
                    {fmt(latest.priceRangeLow)} – {fmt(latest.priceRangeHigh)}
                  </div>
                )}
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 text-xs mb-1">Annual Rent</div>
                <div className="text-green-400 text-xl font-bold">{fmt(latest.rentAnnualAed)}</div>
                <div className="text-gray-500 text-xs mt-1">
                  {fmt(latest.rentAnnualAed / 12)}/mo
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 text-xs mb-1">Gross Yield</div>
                <div className="text-blue-400 text-xl font-bold">{latest.grossYieldPct}%</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 text-xs mb-1">Net Yield</div>
                <div className="text-purple-400 text-xl font-bold">{latest.netYieldPct}%</div>
              </div>
            </div>

            <div className="text-gray-500 text-xs mb-4">
              {latest.overrideReason && <span>Reason: {latest.overrideReason} · </span>}
              Calculated {new Date(latest.createdAt).toLocaleDateString('en-AE')} · {totalHistory}{' '}
              snapshot{totalHistory !== 1 ? 's' : ''}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRecalculate}
                disabled={loading}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
              >
                {loading ? 'Calculating…' : '↻ Recalculate AVM'}
              </button>
              <button
                onClick={() => setShowOverride(!showOverride)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg text-sm font-medium transition"
              >
                Manual Override
              </button>
            </div>
          </div>
        )}

        {/* Override Form */}
        {showOverride && (
          <form
            onSubmit={handleOverride}
            className="bg-gray-800 border border-yellow-700 rounded-xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Manual Override</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Override Value (AED)</label>
                <input
                  type="number"
                  value={overrideValue}
                  onChange={e => setOverrideValue(e.target.value)}
                  required
                  min="1"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Reason (required)</label>
                <input
                  type="text"
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  required
                  minLength={5}
                  placeholder="e.g. RERA-certified valuer assessment"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={overrideLoading}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
              >
                {overrideLoading ? 'Saving…' : 'Save Override'}
              </button>
              <button
                type="button"
                onClick={() => setShowOverride(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* History Table */}
        {history.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Valuation History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-gray-700">
                    <th className="pb-2 text-left">Date</th>
                    <th className="pb-2 text-right">Est. Value</th>
                    <th className="pb-2 text-right">Gross Yield</th>
                    <th className="pb-2 text-left">Method</th>
                    <th className="pb-2 text-left">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {history.map(h => (
                    <tr key={h.id} className="hover:bg-gray-700/30">
                      <td className="py-2 text-gray-300">
                        {new Date(h.createdAt).toLocaleDateString('en-AE')}
                      </td>
                      <td className="py-2 text-right text-yellow-400">
                        {fmt(h.estimatedValueAed)}
                      </td>
                      <td className="py-2 text-right text-green-400">{h.grossYieldPct}%</td>
                      <td className="py-2 text-gray-300">{methodLabel(h.method)}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${confidenceBadge(h.confidence)}`}
                        >
                          {h.confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Yield Calculator */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Yield Calculator</h3>
          <form onSubmit={handleYieldCalc} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Sale Price (AED)</label>
              <input
                type="number"
                value={calcSalePrice}
                onChange={e => setCalcSalePrice(e.target.value)}
                required
                placeholder="2,000,000"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Annual Rent (AED)</label>
              <input
                type="number"
                value={calcRent}
                onChange={e => setCalcRent(e.target.value)}
                required
                placeholder="90,000"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Service Charge (AED/yr)</label>
              <input
                type="number"
                value={calcSC}
                onChange={e => setCalcSC(e.target.value)}
                placeholder="15,000"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm"
              >
                Calculate
              </button>
            </div>
          </form>
          {calcResult && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-400 mb-1">Gross Yield</div>
                <div className="text-2xl font-bold text-blue-400">{calcResult.grossYieldPct}%</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-400 mb-1">Net Yield</div>
                <div className="text-2xl font-bold text-purple-400">{calcResult.netYieldPct}%</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
