import React, { FC, useState } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, ExternalLink, Info } from 'lucide-react';

export interface LuxuryComplianceTrustBadgeProps {
  trakheesiPermit?: string;
  isTruCheckVerified?: boolean;
  dldQrUrl?: string;
  className?: string;
}

export const LuxuryComplianceTrustBadge: FC<LuxuryComplianceTrustBadgeProps> = ({
  trakheesiPermit = 'TRAK-2026-981144',
  isTruCheckVerified = true,
  dldQrUrl = 'https://dubailand.gov.ae/en/eservices/trakheesi-system/',
  className = '',
}) => {
  const [showQrPreview, setShowQrPreview] = useState(false);

  return (
    <div className={`relative inline-flex items-center gap-2.5 flex-wrap ${className}`}>
      {/* Bayut TruCheck™ Verified Stamp (Target T-0002) */}
      {isTruCheckVerified && (
        <div
          role="status"
          aria-label="Bayut TruCheck Verified Listing"
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-extrabold tracking-wide backdrop-blur-md shadow-lg shadow-emerald-950/40 hover:border-emerald-400 transition-all cursor-default"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>TruCheck™ Verified</span>
          <span className="text-[10px] text-emerald-500/80 uppercase font-black px-1.5 py-0.5 rounded bg-emerald-900/50">
            DLD Valid
          </span>
        </div>
      )}

      {/* DLD Trakheesi QR Code Interactive Hover Chip (Target T-0003) */}
      <div
        className="relative"
        onMouseEnter={() => setShowQrPreview(true)}
        onMouseLeave={() => setShowQrPreview(false)}
      >
        <button
          type="button"
          onClick={() => window.open(dldQrUrl, '_blank', 'noopener,noreferrer')}
          aria-label={`Verify DLD Trakheesi Permit ${trakheesiPermit}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 hover:border-red-500/60 text-slate-200 text-[11px] font-bold tracking-wide backdrop-blur-md transition-all shadow-md group cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
          <span className="text-slate-400">Permit:</span>
          <span className="text-white font-mono">{trakheesiPermit}</span>
          <QrCode className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 transition-colors ml-0.5" />
        </button>

        {/* Interactive QR Popover Inspection Card */}
        {showQrPreview && (
          <div
            role="dialog"
            aria-label="DLD Trakheesi Permit Details"
            className="absolute bottom-full mb-2 left-0 z-50 w-64 p-3 bg-slate-950/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-2xl transition-all animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                DLD Verified Trakheesi
              </span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </div>

            <div className="flex gap-2.5 items-center">
              {/* Synthetic SVG QR Code */}
              <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-slate-950">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v4h-2v-2h-2v-2zm4 2v2h-2v-2h2zm-2-6h2v2h-2v-2z" />
                </svg>
              </div>

              <div className="flex flex-col text-[10px] text-slate-300 gap-0.5 leading-snug">
                <span className="text-slate-400">RERA Brokerage ID:</span>
                <span className="font-bold text-white">#28819 (White Caves)</span>
                <span className="text-slate-400 mt-1">Direct Government Registry:</span>
                <span className="text-emerald-400 font-semibold">100% Authentic &amp; Active</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3 text-sky-400" />
                Dubai Law No. 7/2013
              </span>
              <span className="text-slate-500">Click to verify on DLD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuxuryComplianceTrustBadge;
