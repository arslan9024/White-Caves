import React, { useState } from 'react';
import { getAllJourneys } from './registry/journeyRegistry';
import { JourneyDefinition, JourneyCategory } from '../../types/journey';

interface JourneyCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectJourney: (journey: JourneyDefinition) => void;
}

export const JourneyCatalogModal: React.FC<JourneyCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectJourney
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const journeys = getAllJourneys();

  const categories = [
    { id: 'all', label: 'All 20 Journeys' },
    { id: 'leasing', label: 'Leasing' },
    { id: 'sales', label: 'Sales' },
    { id: 'finance', label: 'Finance' },
    { id: 'wealth', label: 'VIP Wealth' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'property', label: 'Property' },
    { id: 'projects', label: 'Off-Plan' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'community', label: 'Community' },
    { id: 'property-management', label: 'Management' },
  ];

  const filtered = journeys.filter(j => {
    const matchesCategory = selectedCategory === 'all' || j.category === selectedCategory;
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          j.family.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🗺️</span>
              <h2 className="text-xl font-bold text-white tracking-wide">White Caves Journey Hub</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                20 Flagship Journeys
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select a guided business mission to execute compliant, end-to-end real estate operations.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-4 px-6 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === c.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 border border-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journeys..."
              className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            />
            <span className="absolute right-2.5 top-1.5 text-slate-400 text-xs">🔍</span>
          </div>
        </div>

        {/* Journey Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((journey) => (
            <div
              key={journey.id}
              onClick={() => onSelectJourney(journey)}
              className="bg-slate-850/80 hover:bg-slate-800/90 border border-slate-700/70 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer transition-all shadow-md flex flex-col justify-between group hover:scale-[1.01]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {journey.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {journey.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {journey.family}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    ⏱ ~{journey.estimatedMinutes}m
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {journey.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-750 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {journey.steps.length} Structured Steps
                </span>
                <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Start Journey →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
