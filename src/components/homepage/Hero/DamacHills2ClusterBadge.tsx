import React, { FC, useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface DamacHills2ClusterBadgeProps {
  clusterCount?: number;
  activeListings?: number;
  absorptionRate?: number; // e.g. 92.4%
  className?: string;
}

export const DamacHills2ClusterBadge: FC<DamacHills2ClusterBadgeProps> = ({
  clusterCount = 31,
  activeListings = 85,
  absorptionRate = 94.2,
  className = '',
}) => {
  const navigate = useNavigate();
  const [livePulses, setLivePulses] = useState(activeListings);

  // Simulated live market absorption pulses (sub-second deterministic interval)
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePulses(prev => (prev >= 88 ? 84 : prev + 1));
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="region"
      aria-label="DAMAC Hills 2 Cluster Market Pulse"
      className={`inline-flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-slate-900/90 border border-slate-700/70 backdrop-blur-xl shadow-xl hover:border-red-500/50 transition-all ${className}`}
    >
      {/* Live Cluster Pill */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-red-600/30">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span>DAMAC Hills 2</span>
      </div>

      {/* Cluster Metrics */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-extrabold text-white">{clusterCount}</span>
          <span className="text-[11px] text-slate-400">Clusters</span>
        </div>

        <span className="text-slate-700" aria-hidden="true">|</span>

        <div className="flex items-center gap-1 text-slate-300">
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-extrabold text-white">{livePulses}</span>
          <span className="text-[11px] text-slate-400">Live Deals</span>
        </div>

        <span className="text-slate-700" aria-hidden="true">|</span>

        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{absorptionRate}%</span>
          <span className="text-[10px] text-emerald-500 font-semibold uppercase">Absorption</span>
        </div>
      </div>

      {/* Instant Hub Link */}
      <button
        type="button"
        onClick={() => navigate('/properties?location=damac-hills-2')}
        className="ml-auto p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="View all DAMAC Hills 2 clusters"
        aria-label="View DAMAC Hills 2 properties"
      >
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DamacHills2ClusterBadge;
