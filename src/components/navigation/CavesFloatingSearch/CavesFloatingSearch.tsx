/**
 * CavesFloatingSearch.tsx — Pure Presentational View (Balanced Floating Search Pill)
 */

import React, { FC } from 'react';
import {
  FloatingSearchPill,
  SearchOverlayModal,
  SearchModalCard,
} from './styles/CavesFloatingSearch.style';
import { useCavesFloatingSearchLogic } from './logic/CavesFloatingSearch.logic';
import { FLOATING_SEARCH_DATA } from './data/CavesFloatingSearch.data';
import { Search, X, Sparkles, MapPin } from 'lucide-react';

export const CavesFloatingSearch: FC = () => {
  const {
    isDark,
    isOpen,
    query,
    setQuery,
    inputRef,
    openModal,
    closeModal,
    handleSearchSubmit,
    handleTagClick,
  } = useCavesFloatingSearchLogic();

  return (
    <>
      {/* ── Fixed Symmetrical Bottom-Left Floating Search Token ─────────── */}
      <FloatingSearchPill
        $isDark={isDark}
        onClick={openModal}
        title="Open Fullscreen Property Search (⌘K)"
        data-testid="caves-floating-search-pill"
      >
        <Search className="w-4 h-4 text-red-500" />
        <span className="hidden sm:inline">{FLOATING_SEARCH_DATA.pillLabel}</span>
        <span
          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${
            isDark
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {FLOATING_SEARCH_DATA.pillShortcut}
        </span>
      </FloatingSearchPill>

      {/* ── Fullscreen High-Fidelity Search Overlay Modal ────────────────── */}
      {isOpen && (
        <SearchOverlayModal
          $isDark={isDark}
          onClick={closeModal}
          data-testid="caves-search-overlay-modal"
        >
          <SearchModalCard
            $isDark={isDark}
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-red-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={FLOATING_SEARCH_DATA.inputPlaceholder}
                className="w-full bg-transparent border-none outline-none text-base font-medium placeholder-slate-400 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>POPULAR LUXURY DESTINATIONS</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FLOATING_SEARCH_DATA.quickTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-500 text-slate-700 dark:text-slate-300 hover:text-red-500 transition-all shadow-sm"
                  >
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </SearchModalCard>
        </SearchOverlayModal>
      )}
    </>
  );
};

export default CavesFloatingSearch;
