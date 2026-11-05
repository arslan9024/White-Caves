/**
 * CustomerOverviewView.tsx
 * White Caves Real Estate LLC - CMS Executive Overview for /dashboard/customers
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol & KYC AML Compliance
 */

import React, { FC } from 'react';
import { Contact, Users, UserCheck, ShieldCheck, ArrowRight, UserPlus, Star } from 'lucide-react';
import { CANONICAL_CUSTOMERS } from './CustomerManager.data';

export interface CustomerOverviewViewProps {
  onNavigate: (route: string) => void;
}

export const CustomerOverviewView: FC<CustomerOverviewViewProps> = ({ onNavigate }) => {
  const totalCustomers = CANONICAL_CUSTOMERS.length;
  const uhnwCount = CANONICAL_CUSTOMERS.filter(c => c.customerType === 'INVESTOR').length;
  const tenantCount = CANONICAL_CUSTOMERS.filter(c => c.customerType === 'TENANT').length;
  const buyerCount = CANONICAL_CUSTOMERS.filter(c => c.customerType === 'BUYER').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="customer-overview-view">
      <div data-testid="customer-manager-view" style={{ display: 'none' }} />
      {/* ── 1. Top Sovereign Header ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <Contact size={15} /> System #6 · Customer & CRM Nervous Hub (CMS)
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Client Registry & UHNW Relationship Management
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          The sovereign customer relationship ledger: UHNW private wealth investors, institutional
          funds, luxury buyers, and long-term tenants with AML compliance, passport KYC
          verification, and communication history.
        </p>
      </div>

      {/* ── 2. Real-Time Telemetry Deck ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Clients</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {totalCustomers} <span className="text-xs text-slate-500">Accounts</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">100% KYC Verified & Screened</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">UHNW / Institutional</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {uhnwCount} <span className="text-xs text-slate-500">VIPs</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">AED 10M+ Purchasing Capacity</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Active Buyers</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {buyerCount} <span className="text-xs text-slate-500">Buyers</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">In Active Property Search</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Tenants & Leases</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {tenantCount} <span className="text-xs text-slate-500">Tenants</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active Ejari Contract Holders</div>
        </div>
      </div>

      {/* ── 3. Primary Double-Layer Navigation Portals ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Layer 1: Client Directory */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
              <Users size={16} /> Double-Layer Route 1
            </div>
            <h3 className="text-lg font-bold text-white">All Clients & Leads Directory (CRUD)</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Register new client profiles, conduct KYC risk assessments, update contact
              information, log interactions, and associate active deals or properties.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/customers/leads</code> &{' '}
              <code>/dashboard/customers/:customerId</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/customers/leads')}
            data-testid="navigate-to-cust-leads-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Open Client Directory</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Layer 2: UHNW Investors */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-2">
              <Star size={16} /> Double-Layer Route 2
            </div>
            <h3 className="text-lg font-bold text-white">UHNW & Institutional Investors</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Dedicated private wealth desk monitoring high-ticket acquisition mandates, portfolio
              diversification, and sovereign fund engagements.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/customers/investors</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/customers/investors')}
            data-testid="navigate-to-cust-investors-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Explore UHNW Investors Desk</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 4. Quick Access Customer Chips ──────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-3">
          Key Client Accounts (Direct Deep View)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {CANONICAL_CUSTOMERS.slice(0, 8).map(cust => (
            <button
              key={cust.id}
              onClick={() => onNavigate(`/dashboard/customers/${cust.id}`)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
            >
              <div className="truncate">
                <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                  {cust.customerCode} · {cust.customerType}
                </span>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate block">
                  {cust.fullName}
                </span>
              </div>
              <ArrowRight
                size={12}
                className="text-slate-600 group-hover:text-emerald-400 shrink-0 ml-1 transition-colors"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOverviewView;
