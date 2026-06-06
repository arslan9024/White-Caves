import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type Period = '7d' | '30d' | '90d';

interface FunnelStage {
  stage: string;
  count: number;
  dropOffPct: number;
  avgDays: number;
}
interface FunnelData {
  totalLeads: number;
  viewingRate: number;
  offerRate: number;
  wonRate: number;
  stages: FunnelStage[];
}

const MOCK: Record<Period, FunnelData> = {
  '7d': {
    totalLeads: 142,
    viewingRate: 28.2,
    offerRate: 12.7,
    wonRate: 4.9,
    stages: [
      { stage: 'New', count: 142, dropOffPct: 0, avgDays: 0 },
      { stage: 'Contacted', count: 98, dropOffPct: 31, avgDays: 0.8 },
      { stage: 'Qualified', count: 61, dropOffPct: 38, avgDays: 1.5 },
      { stage: 'Viewing Scheduled', count: 40, dropOffPct: 34, avgDays: 2.1 },
      { stage: 'Offer Made', count: 18, dropOffPct: 55, avgDays: 3.4 },
      { stage: 'Won', count: 7, dropOffPct: 61, avgDays: 5.2 },
    ],
  },
  '30d': {
    totalLeads: 614,
    viewingRate: 31.4,
    offerRate: 14.2,
    wonRate: 6.1,
    stages: [
      { stage: 'New', count: 614, dropOffPct: 0, avgDays: 0 },
      { stage: 'Contacted', count: 432, dropOffPct: 30, avgDays: 1.2 },
      { stage: 'Qualified', count: 271, dropOffPct: 37, avgDays: 2.8 },
      { stage: 'Viewing Scheduled', count: 193, dropOffPct: 29, avgDays: 4.5 },
      { stage: 'Offer Made', count: 87, dropOffPct: 55, avgDays: 7.1 },
      { stage: 'Won', count: 37, dropOffPct: 57, avgDays: 10.3 },
    ],
  },
  '90d': {
    totalLeads: 1847,
    viewingRate: 33.8,
    offerRate: 15.9,
    wonRate: 7.4,
    stages: [
      { stage: 'New', count: 1847, dropOffPct: 0, avgDays: 0 },
      { stage: 'Contacted', count: 1298, dropOffPct: 30, avgDays: 1.5 },
      { stage: 'Qualified', count: 812, dropOffPct: 37, avgDays: 3.2 },
      { stage: 'Viewing Scheduled', count: 624, dropOffPct: 23, avgDays: 5.8 },
      { stage: 'Offer Made', count: 294, dropOffPct: 53, avgDays: 9.4 },
      { stage: 'Won', count: 137, dropOffPct: 53, avgDays: 14.2 },
    ],
  },
};

const GOLD = '#C9A84C';

export default function FunnelEconomicsDashboard() {
  const [period, setPeriod] = useState<Period>('30d');
  const [data, setData] = useState<FunnelData>(MOCK['30d']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/leads/analytics/funnel?period=${period}`)
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json() as Promise<FunnelData>;
      })
      .then(d => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(MOCK[period]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const kpis = [
    { label: 'Total Leads', value: data.totalLeads, unit: '', max: 2000 },
    { label: 'Viewing Rate', value: data.viewingRate, unit: '%', max: 100 },
    { label: 'Offer Rate', value: data.offerRate, unit: '%', max: 100 },
    { label: 'Won Rate', value: data.wonRate, unit: '%', max: 100 },
  ];

  return (
    <div className="bg-[#0A0A0A] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Funnel Economics</h1>
          <p className="text-white/50 text-sm mt-0.5">Pipeline conversion analytics</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Date range">
          {(['7d', '30d', '90d'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${period === p ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpis.map(k => {
          const pct = Math.min((k.value / k.max) * 100, 100);
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{k.label}</p>
              <p className="text-white text-2xl font-bold mb-3">
                {k.unit === '%' ? `${k.value.toFixed(1)}%` : k.value.toLocaleString()}
              </p>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: GOLD }}
                  role="progressbar"
                  aria-valuenow={k.value}
                  aria-valuemin={0}
                  aria-valuemax={k.max}
                  aria-label={k.label}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bar chart */}
      <motion.div
        animate={{ opacity: loading ? 0.4 : 1 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-5 mb-6"
        aria-label="Funnel stages chart"
      >
        <h2 className="text-white/70 text-sm font-semibold mb-4 uppercase tracking-wider">
          Pipeline Stages
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data.stages.map(s => ({ name: s.stage, count: s.count }))}
            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.stages.map((_, i) => (
                <Cell key={`c-${i}`} fill={GOLD} fillOpacity={1 - i * 0.1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stage table */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm" aria-label="Stage breakdown">
          <thead>
            <tr className="border-b border-white/10">
              {['Stage', 'Count', 'Drop-off %', 'Avg Days'].map(h => (
                <th
                  key={h}
                  className={`text-white/40 font-medium px-4 py-3 text-xs uppercase tracking-wider ${h === 'Stage' ? 'text-left' : 'text-right'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.stages.map((s, i) => (
              <tr
                key={s.stage}
                className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
              >
                <td className="px-4 py-3 text-white font-medium">{s.stage}</td>
                <td className="px-4 py-3 text-white/70 text-right">{s.count.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${s.dropOffPct === 0 ? 'text-white/30' : s.dropOffPct < 35 ? 'bg-green-500/10 text-green-400' : s.dropOffPct < 55 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}
                  >
                    {s.dropOffPct === 0 ? '—' : `−${s.dropOffPct}%`}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/50 text-right">
                  {s.avgDays === 0 ? '—' : `${s.avgDays}d`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
