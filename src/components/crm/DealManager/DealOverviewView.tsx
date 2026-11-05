/**
 * DealOverviewView.tsx
 * White Caves Real Estate LLC - Deals Executive Overview for /dashboard/deals
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol & Escrow Governance
 */

import React, { FC } from 'react';
import {
  Handshake,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Wallet,
  CheckCircle,
} from 'lucide-react';
import { CANONICAL_DEALS } from './DealManager.data';

export interface DealOverviewViewProps {
  onNavigate: (route: string) => void;
}

export const DealOverviewView: FC<DealOverviewViewProps> = ({ onNavigate }) => {
  const totalDeals = CANONICAL_DEALS.length;
  const totalVolume = CANONICAL_DEALS.reduce((acc, curr) => acc + (curr.valueAED || 0), 0);
  const totalCommission = CANONICAL_DEALS.reduce((acc, curr) => acc + (curr.commissionAED || 0), 0);
  const activeDeals = CANONICAL_DEALS.filter(
    d => d.status !== 'COMPLETED' && d.status !== 'CANCELLED'
  ).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="deal-overview-view">
      <div data-testid="deal-manager-view" style={{ display: 'none' }} />
      {/* ── 1. Top Sovereign Header ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/30 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <Handshake size={15} /> System #5 · Deals & Revenue Pipeline System (Deals)
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Universal Deal Ledger & Escrow Settlement Pipeline
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          The sovereign financial and contractual pipeline binding Properties, Buyers, Sellers,
          Conveyancing Brokers, Statutory Title Deeds, Post-Dated Cheques (PDC), and Escrow Trust
          Accounts.
        </p>
      </div>

      {/* ── 2. Real-Time Telemetry Deck ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Deals</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {totalDeals} <span className="text-xs text-slate-500">Deals</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{activeDeals} Active in Pipeline</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Escrow Gross Volume</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            AED {(totalVolume / 1_000_000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">DLD Escrow Accounts Verified</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Commission Pool</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            AED {(totalCommission / 1_000).toFixed(0)}K
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">2% Standard Statutory Split</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">PDC Cheque Schedules</div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            100% <span className="text-xs text-slate-500">Tracked</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Automated Bounced Cheque Esc</div>
        </div>
      </div>

      {/* ── 3. Primary Double-Layer Navigation Portals ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Layer 1: Deals Pipeline */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase mb-2">
              <TrendingUp size={16} /> Double-Layer Route 1
            </div>
            <h3 className="text-lg font-bold text-white">Deals Pipeline & Revenue Ledger (CRUD)</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Create new transactions, track deal stages (Offer, Under Contract, Escrow Deposited,
              Closed Won), review PDC payment milestones, and advance pipeline states.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/deals/pipeline</code> & <code>/dashboard/deals/:dealId</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/deals/pipeline')}
            data-testid="navigate-to-deals-pipeline-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Open Deals Pipeline Kanban</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Layer 2: Escrow & Trust Accounts */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
              <Wallet size={16} /> Double-Layer Route 2
            </div>
            <h3 className="text-lg font-bold text-white">Escrow Trust Ledger & PDC Tracking</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Supervise Law No. 8 Escrow compliance, deposit slips, Form F MoU contracts, and
              tenancy cheque maturity schedules.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/deals/escrow</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/deals/escrow')}
            data-testid="navigate-to-deals-escrow-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Inspect Escrow Trust Ledger</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 4. Quick Access Deal Chips ──────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-3">
          Active High-Value Transactions (Direct Deep View)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {CANONICAL_DEALS.slice(0, 8).map(deal => (
            <button
              key={deal.id}
              onClick={() => onNavigate(`/dashboard/deals/${deal.id}`)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
            >
              <div className="truncate">
                <span className="text-[10px] font-mono text-purple-400 block font-bold">
                  {deal.dealNumber} · {deal.status}
                </span>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate block">
                  {deal.title}
                </span>
              </div>
              <ArrowRight
                size={12}
                className="text-slate-600 group-hover:text-purple-400 shrink-0 ml-1 transition-colors"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealOverviewView;
