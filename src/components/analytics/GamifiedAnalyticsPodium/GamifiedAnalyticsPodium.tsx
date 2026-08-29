/**
 * GamifiedAnalyticsPodium.tsx — Pure Presentational View (Leaderboard, Sparklines, SLA Tickers)
 */

import React, { FC } from 'react';
import {
  AnalyticsCockpitCard,
  VictoryPodiumStage,
  PodiumPillar,
  SlaPulseBadge,
} from './styles/GamifiedAnalyticsPodium.style';
import { useGamifiedAnalyticsPodiumLogic } from './logic/GamifiedAnalyticsPodium.logic';
import { Trophy, Clock, TrendingUp, Award } from 'lucide-react';

export const GamifiedAnalyticsPodium: FC = () => {
  const { isDark, podiumBrokers, managerSparklines, formattedSlaTime } =
    useGamifiedAnalyticsPodiumLogic();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="gamified-analytics-podium">
      {/* ── 3-Tier Victory Podium Card ───────────────────────────────────── */}
      <AnalyticsCockpitCard $isDark={isDark}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-red-500" />
            <h3 className="font-extrabold text-sm tracking-wide uppercase">Top Closed Volume Podiums</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">August 2026</span>
        </div>

        <VictoryPodiumStage>
          {/* Rank 2 Podium */}
          {podiumBrokers.find(b => b.rank === 2) && (
            <PodiumPillar $rank={2} $isDark={isDark}>
              <div className="text-center">
                <span className="text-[10px] font-bold opacity-80">2ND PLACE</span>
                <div className="text-xs font-extrabold truncate w-24">
                  {podiumBrokers.find(b => b.rank === 2)?.name.split(' ')[0]}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-black">
                  {podiumBrokers.find(b => b.rank === 2)?.grossVolumeAED}
                </div>
                <span className="text-[9px] opacity-75">
                  {podiumBrokers.find(b => b.rank === 2)?.dealsClosed} Deals
                </span>
              </div>
            </PodiumPillar>
          )}

          {/* Rank 1 Podium */}
          {podiumBrokers.find(b => b.rank === 1) && (
            <PodiumPillar $rank={1} $isDark={isDark}>
              <div className="absolute -top-6">
                <Award className="w-8 h-8 text-amber-300 drop-shadow-md animate-bounce" />
              </div>
              <div className="text-center pt-2">
                <span className="text-[10px] font-black text-amber-200">1ST PLACE</span>
                <div className="text-xs font-black truncate w-28 text-white">
                  {podiumBrokers.find(b => b.rank === 1)?.name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-white">
                  {podiumBrokers.find(b => b.rank === 1)?.grossVolumeAED}
                </div>
                <span className="text-[10px] text-amber-100 font-bold">
                  {podiumBrokers.find(b => b.rank === 1)?.dealsClosed} Deals Closed
                </span>
              </div>
            </PodiumPillar>
          )}

          {/* Rank 3 Podium */}
          {podiumBrokers.find(b => b.rank === 3) && (
            <PodiumPillar $rank={3} $isDark={isDark}>
              <div className="text-center">
                <span className="text-[10px] font-bold opacity-80">3RD PLACE</span>
                <div className="text-xs font-extrabold truncate w-24">
                  {podiumBrokers.find(b => b.rank === 3)?.name.split(' ')[0]}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-black">
                  {podiumBrokers.find(b => b.rank === 3)?.grossVolumeAED}
                </div>
                <span className="text-[9px] opacity-75">
                  {podiumBrokers.find(b => b.rank === 3)?.dealsClosed} Deals
                </span>
              </div>
            </PodiumPillar>
          )}
        </VictoryPodiumStage>
      </AnalyticsCockpitCard>

      {/* ── 7-Day Performance Sparklines & 15-Min SLA Watchdog ───────────── */}
      <AnalyticsCockpitCard $isDark={isDark}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h3 className="font-extrabold text-sm tracking-wide uppercase">Department SLA & 7-Day Target Trends</h3>
          </div>
          <SlaPulseBadge>
            <Clock className="w-3.5 h-3.5" />
            <span>SLA: {formattedSlaTime}</span>
          </SlaPulseBadge>
        </div>

        <div className="space-y-3">
          {managerSparklines.map(item => (
            <div
              key={item.dept}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-200">{item.dept}</div>
                <div className="text-[11px] text-slate-400">{item.manager}</div>
              </div>

              {/* Mini SVG Sparkline */}
              <div className="flex items-center gap-3">
                <svg width="80" height="24" className="overflow-visible">
                  <polyline
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    points={item.trend
                      .map((val, idx) => `${idx * 13},${24 - (val / 110) * 20}`)
                      .join(' ')}
                  />
                </svg>
                <span className="text-xs font-black text-red-500">{item.targetAchieved}</span>
              </div>
            </div>
          ))}
        </div>
      </AnalyticsCockpitCard>
    </div>
  );
};

export default GamifiedAnalyticsPodium;
