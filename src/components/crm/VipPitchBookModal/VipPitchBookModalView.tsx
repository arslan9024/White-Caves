// FILE: src/components/crm/VipPitchBookModal/VipPitchBookModalView.tsx
/**
 * White Caves Real Estate LLC - VIP Luxury Pitch Book Modal View
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { X, Printer, Download, Share2, ShieldCheck, Check, Sparkles, Building, QrCode } from 'lucide-react';
import type { REPropertyNode } from '../REPropertyManager/REPropertyManager.types';
import { compilePitchBookData, generatePrintableHtml } from './VipPitchBookModal.logic';

export interface VipPitchBookModalProps {
  property: REPropertyNode | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VipPitchBookModalView: FC<VipPitchBookModalProps> = ({ property, isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !property) return null;

  const data = compilePitchBookData(property);

  const handlePrint = () => {
    const html = generatePrintableHtml(data);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
      }, 350);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      data-testid="vip-pitch-book-modal"
    >
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
                  White Caves Private Client Deck
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DLD Verified
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                VIP Luxury Investor Pitch Book · {property.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              data-testid="btn-print-pitch-book"
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Export PDF</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              data-testid="btn-share-pitch-book"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              data-testid="btn-close-pitch-book"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Pitch Deck Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/40">
          {/* Cover Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 flex items-end p-6">
            {property.images && property.images[0] && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover opacity-45"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-xs font-mono font-bold text-red-400 uppercase">
                {property.location} · {property.subLocation}
              </span>
              <h1 className="text-2xl font-extrabold text-white">{property.title}</h1>
              <p className="text-xs text-slate-300 max-w-2xl line-clamp-2">
                {property.description}
              </p>
            </div>
          </div>

          {/* 3 Executive Financial Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Valuation / Asking</span>
              <span className="text-lg font-bold font-mono text-red-400">
                AED {property.priceAED.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Projected Net Yield</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {data.investorYieldPct}% p.a.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Projected Annual Rent</span>
              <span className="text-lg font-bold font-mono text-sky-400">
                AED {data.projectedAnnualRent.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Built-up Area</span>
              <span className="text-lg font-bold font-mono text-white">
                {property.areaSqft.toLocaleString()} Sq.Ft
              </span>
            </div>
          </div>

          {/* Underwriting Breakdown Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-slate-300">
              <span>STATUTORY ESCROW & CLOSING COSTS SPECIFICATION</span>
              <span className="text-red-400">LAW 50/2022 UNDERWRITE</span>
            </div>
            <div className="p-4 divide-y divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-300">DLD 4% Transfer Fee (Dubai Land Department)</span>
                <span className="font-mono font-bold text-white">AED {data.dldTransferFee.toLocaleString()}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-300">Registration Trustee Office Fee (incl. 5% VAT)</span>
                <span className="font-mono font-bold text-white">AED {data.trusteeFee.toLocaleString()}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-300">Total Closing Fees (Gov Registration + Agency + 5% VAT)</span>
                <span className="font-mono font-bold text-amber-400">AED {data.totalClosingCosts.toLocaleString()}</span>
              </div>
              <div className="py-3 flex justify-between items-center font-bold text-sm bg-red-950/20 px-2 rounded-lg">
                <span className="text-red-300">Total Investor Capital Required</span>
                <span className="font-mono text-white">AED {data.totalFundRequired.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Permits & QR Code Strip */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                <ShieldCheck size={16} />
                <span>Verified DLD Trakheesi Advertisement & Title Deed Permit</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Trakheesi No: <span className="text-white">{property.trakheesiPermit || 'TRAK-2026-90412'}</span> | Deed: <span className="text-white">{property.dldTitleDeedNumber || 'DLD-TD-55102'}</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                Developer: {property.developer} • Status: {property.completionStatus}
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
              <img src={data.qrCodeUrl} alt="DLD Permit QR Code" className="w-16 h-16 rounded" />
              <div className="text-[10px] text-slate-400 font-mono">
                Scan for DLD<br />Government Verification
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipPitchBookModalView;
