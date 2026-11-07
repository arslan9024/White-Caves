import React, { FC, useState } from 'react';
import { ShieldCheck, QrCode, ExternalLink, X, Building, CheckCircle2 } from 'lucide-react';

export const DldTrakheesiModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Pill inside Regulatory Trust Strip */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all shadow-sm group"
        title="Verify official Dubai Land Department Trakheesi License"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span>DLD / RERA Electronic Permit Verification</span>
        <QrCode className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close DLD verification modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white m-0">
                  Government of Dubai — Regulatory Compliance
                </h3>
                <p className="text-xs text-slate-400 m-0">
                  Dubai Land Department (DLD) &amp; Real Estate Regulatory Agency (RERA)
                </p>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 mb-5">
              <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Legal Corporate Entity:</span>
                <strong className="text-slate-100 font-mono">White Caves Real Estate LLC</strong>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">RERA Office Registration No. (ORN):</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  44483
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">DET Commercial License:</span>
                <strong className="text-slate-200 font-mono">1388443</strong>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Official Ejari Portal Registration:</span>
                <span className="text-slate-200 font-mono">0120250814005322</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Federal Tax Authority (FTA VAT):</span>
                <span className="text-slate-200 font-mono">100582914300003</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 mb-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                All luxury listings, off-plan allocations, and client deposits are protected under statutory UAE Escrow and goAML laws.
              </span>
            </div>

            <div className="flex gap-3">
              <a
                href="https://dubailand.gov.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-600/30 text-decoration-none"
              >
                <span>Verify on DubaiLand.gov.ae</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DldTrakheesiModal;
