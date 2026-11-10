/**
 * ErmsCorporateUmbrellaBanner.tsx
 * White Caves Real Estate LLC - Sovereign Corporate Umbrella Banner for ERMS
 * Anchors the Apex Company, Trade License Activities, and External Counterparty Ecosystem
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Building2, ShieldCheck, Landmark, FileText, CheckCircle2, Globe, ExternalLink } from 'lucide-react';

export interface ErmsCorporateUmbrellaBannerProps {
  onNavigate?: (route: string) => void;
}

export const ErmsCorporateUmbrellaBanner: FC<ErmsCorporateUmbrellaBannerProps> = ({ onNavigate }) => {
  return (
    <div
      className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/30 text-zinc-100 shadow-xl space-y-4"
      data-testid="erms-corporate-umbrella-banner"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-inner">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-wide">
                White Caves Real Estate LLC
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase">
                Apex Corporate Umbrella
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Governing Body for all 12 Corporate Departments, AI Mesh Supervisors, and Real Estate Deals
            </p>
          </div>
        </div>

        {/* Official Credentials Badge */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-300 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-red-400 font-bold">DLD ORN: 28491</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400 font-bold">DET: CN-1094821</span>
          <span className="text-zinc-600">|</span>
          <span className="text-blue-400 font-bold">FTA TRN: 100458920100003</span>
        </div>
      </div>

      {/* Dual Trade License Activities & Ecosystem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Activity 1 */}
        <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
              <span>Real Estate Buying & Selling Brokerage</span>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1 rounded">
                Code 7010.01
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
              Luxury freehold off-plan sales, secondary acquisitions, DLD Form F MOUs, and conveyancing trustees.
            </p>
          </div>
        </div>

        {/* Activity 2 */}
        <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
              <span>Leasing Property Brokerage Agents</span>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1 rounded">
                Code 7020.01
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
              Annual tenancy registrations, Ejari compliance, 90-day statutory notice indexing, and PDC rent collections.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Ecosystem Footprint Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-zinc-300 text-[11px]">
            <Landmark className="w-3.5 h-3.5 text-zinc-500" />
            <span>Escrow Trust: ADCB Bank</span>
          </span>
          <span className="flex items-center gap-1 text-zinc-300 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span>HQ: Boulevard Plaza, Downtown Dubai</span>
          </span>
          <span className="flex items-center gap-1 text-zinc-300 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>goAML FIU ID: FIU-AE-ORG-9182</span>
          </span>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/overview')}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            <span>View Corporate Command Center</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
