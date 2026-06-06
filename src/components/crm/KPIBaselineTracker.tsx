import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface KPI {
  name: string;
  target: string;
  targetNum: number;
  current: number;
  unit: string;
  trend: '↑' | '↓' | '→';
  higherIsBetter: boolean;
}

const STATIC_KPIS: KPI[] = [
  {
    name: 'First Response Time',
    target: '<2h',
    targetNum: 2,
    current: 4.2,
    unit: 'h',
    trend: '↓',
    higherIsBetter: false,
  },
  {
    name: 'Viewing Conversion Rate',
    target: '35%',
    targetNum: 35,
    current: 18,
    unit: '%',
    trend: '↑',
    higherIsBetter: true,
  },
  {
    name: 'Offer-to-Viewing Ratio',
    target: '25%',
    targetNum: 25,
    current: 11,
    unit: '%',
    trend: '↑',
    higherIsBetter: true,
  },
  {
    name: 'Listing Completeness',
    target: '90%',
    targetNum: 90,
    current: 62,
    unit: '%',
    trend: '↑',
    higherIsBetter: true,
  },
  {
    name: 'Mobile CRM Sessions',
    target: '60%',
    targetNum: 60,
    current: 31,
    unit: '%',
    trend: '↑',
    higherIsBetter: true,
  },
  {
    name: 'Tenant Portal MAU',
    target: '200 users',
    targetNum: 200,
    current: 45,
    unit: ' users',
    trend: '↑',
    higherIsBetter: true,
  },
  {
    name: 'Organic Leads Share',
    target: '40%',
    targetNum: 40,
    current: 22,
    unit: '%',
    trend: '↑',
    higherIsBetter: true,
  },
  {
    name: 'UX Regressions',
    target: '0',
    targetNum: 0,
    current: 3,
    unit: '',
    trend: '↓',
    higherIsBetter: false,
  },
];

function getProgress(kpi: KPI): number {
  if (!kpi.higherIsBetter) {
    // lower is better: if targetNum === 0, progress = 0 regressions means 100%
    if (kpi.targetNum === 0) return kpi.current === 0 ? 100 : Math.max(0, 100 - kpi.current * 33);
    return Math.min(100, (kpi.targetNum / kpi.current) * 100);
  }
  return Math.min(100, (kpi.current / kpi.targetNum) * 100);
}

function barColor(pct: number): string {
  if (pct >= 80) return '#22c55e';
  if (pct >= 50) return '#f59e0b';
  return '#ef4444';
}

function trendClass(kpi: KPI): string {
  const good = kpi.higherIsBetter ? kpi.trend === '↑' : kpi.trend === '↓';
  return good ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function KPIBaselineTracker() {
  const [kpis, setKpis] = useState<KPI[]>(STATIC_KPIS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/dashboard/analytics/kpi-baseline')
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(
        (json: {
          success: boolean;
          data: {
            kpis: Array<{
              name: string;
              current: number;
              target: number;
              unit: string;
              trend: string;
              higherIsBetter: boolean;
            }>;
          };
        }) => {
          if (!active || !json?.success) return;
          const mapped: KPI[] = json.data.kpis.map(k => ({
            name: k.name,
            current: k.current,
            targetNum: k.target,
            target: `${k.target}${k.unit}`,
            unit: k.unit,
            trend: (k.trend as '↑' | '↓' | '→') ?? '→',
            higherIsBetter: k.higherIsBetter,
          }));
          setKpis(mapped);
        }
      )
      .catch(() => {
        /* keep static fallback */
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-[#0A0A0A] min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">KPI Baseline Tracker</h1>
        <p className="text-white/50 text-sm mt-1">Wave 18.1 — 90-day baseline vs. targets</p>
      </div>

      {loading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          aria-label="KPI baseline cards"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 h-28 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
          aria-label="KPI baseline cards"
        >
          {kpis.map(kpi => {
            const pct = getProgress(kpi);
            const color = barColor(pct);
            return (
              <motion.div
                key={kpi.name}
                variants={item}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <p className="text-white/70 text-sm font-medium leading-tight">{kpi.name}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${trendClass(kpi)}`}
                  >
                    {kpi.trend}
                  </span>
                </div>

                <div>
                  <p className="text-white text-xl font-bold">
                    {kpi.current}
                    {kpi.unit}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">Target: {kpi.target}</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/30 mb-1">
                    <span>{Math.round(pct)}%</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${kpi.name} progress: ${Math.round(pct)}%`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
