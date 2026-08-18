import React from 'react';

interface HenryJourneyGuideTileProps {
  onLaunchJourney: (journeyId: string) => void;
  onOpenCatalog: () => void;
}

export const HenryJourneyGuideTile: React.FC<HenryJourneyGuideTileProps> = ({
  onLaunchJourney,
  onOpenCatalog
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 text-slate-100 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 text-slate-950 font-black">
              H
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Henry — Journey Guide Copilot
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                Active Recommendation
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Rental offer for <strong className="text-amber-300">Sycamore 131 (DAMAC Hills 2)</strong> was accepted. 
              Landlord and Tenant KYC are 100% verified. Launch the guided journey to generate the official Tenancy Contract.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenCatalog}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all"
          >
            Browse Journeys (10)
          </button>

          <button
            onClick={() => onLaunchJourney('prepare-tenancy-contract')}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 hover:scale-105"
          >
            <span>🚀 Launch Contract Journey</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="text-emerald-400 font-medium">✓ Property Linked</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">✓ Landlord KYC Ready</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">✓ 2 Cheques Schedule Pre-calculated</span>
        </div>
        <span className="text-amber-400 font-medium hidden sm:inline">
          Estimated completion: ~4 mins
        </span>
      </div>
    </div>
  );
};
