import React, { FC, useState } from 'react';
import { Search, MapPin, Building, ChevronDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type SearchCategory = 'buy' | 'rent' | 'off-plan' | 'commercial';

interface LuxuryMultiTabSearchBarProps {
  onSearchSubmit?: (filters: { category: SearchCategory; area: string; priceRange: string; propertyType: string }) => void;
}

export const LuxuryMultiTabSearchBar: FC<LuxuryMultiTabSearchBarProps> = ({ onSearchSubmit }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SearchCategory>('buy');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('any');
  const [selectedType, setSelectedType] = useState<string>('any');

  const areas = [
    { id: 'all', label: 'All Dubai Prime' },
    { id: 'palm-jumeirah', label: 'Palm Jumeirah' },
    { id: 'downtown-dubai', label: 'Downtown Dubai' },
    { id: 'dubai-hills-estate', label: 'Dubai Hills Estate' },
    { id: 'damac-hills-2', label: 'DAMAC Hills 2' },
    { id: 'emirates-hills', label: 'Emirates Hills' },
    { id: 'dubai-marina', label: 'Dubai Marina' },
  ];

  const priceRangesBuy = [
    { id: 'any', label: 'Price: Any' },
    { id: '1m-3m', label: 'AED 1M – 3M' },
    { id: '3m-7m', label: 'AED 3M – 7M' },
    { id: '7m-15m', label: 'AED 7M – 15M' },
    { id: '15m-30m', label: 'AED 15M – 30M' },
    { id: '30m-plus', label: 'AED 30M+ (Ultra-Prime)' },
  ];

  const priceRangesRent = [
    { id: 'any', label: 'Rent: Any' },
    { id: '80k-150k', label: 'AED 80k – 150k/yr' },
    { id: '150k-300k', label: 'AED 150k – 300k/yr' },
    { id: '300k-600k', label: 'AED 300k – 600k/yr' },
    { id: '600k-plus', label: 'AED 600k+/yr' },
  ];

  const types = [
    { id: 'any', label: 'All Types' },
    { id: 'villa', label: 'Signature Villa' },
    { id: 'penthouse', label: 'Sky Penthouse' },
    { id: 'apartment', label: 'Luxury Apartment' },
    { id: 'townhouse', label: 'Townhouse' },
    { id: 'mansion', label: 'Waterfront Mansion' },
  ];

  const handleExecuteSearch = () => {
    if (onSearchSubmit) {
      onSearchSubmit({
        category: activeTab,
        area: selectedArea,
        priceRange: selectedPrice,
        propertyType: selectedType,
      });
    } else {
      const params = new URLSearchParams();
      params.set('mode', activeTab);
      if (selectedArea !== 'all') params.set('location', selectedArea);
      if (selectedType !== 'any') params.set('type', selectedType);
      navigate(`/properties?${params.toString()}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 transition-all">
      {/* Segmented Category Pill Selector */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-700/60 rounded-2xl w-fit backdrop-blur-xl shadow-2xl mb-2">
        <button
          type="button"
          onClick={() => setActiveTab('buy')}
          className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider transition-all uppercase ${
            activeTab === 'buy'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400/50'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Buy Luxury
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rent')}
          className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider transition-all uppercase ${
            activeTab === 'rent'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400/50'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Rent Premium
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('off-plan')}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black tracking-wider transition-all uppercase ${
            activeTab === 'off-plan'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400/50'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <span>Off-Plan Launches</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('commercial')}
          className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider transition-all uppercase ${
            activeTab === 'commercial'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400/50'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Commercial &amp; Land
        </button>
      </div>

      {/* Main Glass Search Bar HUD */}
      <div className="bg-slate-950/85 border border-slate-700/80 rounded-2xl p-3 md:p-3.5 backdrop-blur-2xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-2.5 items-center">
        {/* Prime Area Selection */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5">
          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Prime Location</span>
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-100 focus:outline-none cursor-pointer truncate"
              aria-label="Prime Location"
            >
              {areas.map(a => (
                <option key={a.id} value={a.id} className="bg-slate-900 text-slate-100">
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Type Selection */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5">
          <Building className="w-4 h-4 text-sky-400 shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Property Class</span>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-100 focus:outline-none cursor-pointer truncate"
              aria-label="Property Class"
            >
              {types.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-slate-100">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Tier Selection */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Budget Tier</span>
            <select
              value={selectedPrice}
              onChange={e => setSelectedPrice(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-100 focus:outline-none cursor-pointer truncate"
              aria-label="Budget Tier"
            >
              {(activeTab === 'rent' ? priceRangesRent : priceRangesBuy).map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Submission Action Button */}
        <button
          type="button"
          onClick={handleExecuteSearch}
          className="flex items-center justify-center gap-2 h-full min-h-[46px] px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Search className="w-4 h-4" />
          <span>Find Luxury Home</span>
        </button>
      </div>
    </div>
  );
};

export default LuxuryMultiTabSearchBar;
