/**
 * ErmsContextTriadBar.tsx
 * White Caves Real Estate LLC - Sovereign Context Triad & UX Density Controller
 * Pillar 8: Upgrade 71 (Native RTL Arabic), Upgrade 72 (Context Triad Sync: Theme/Language/Currency),
 *           Upgrade 73 (Keyboard Shortcuts), Upgrade 75 (Density: Comfortable/Compact/Ultra-Dense)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { Globe, DollarSign, Moon, Sun, Monitor, Keyboard, Sliders, Layers } from 'lucide-react';

export type ErmsDensityMode = 'comfortable' | 'compact' | 'ultra-dense';
export type ErmsCurrency = 'AED' | 'USD' | 'EUR' | 'GBP';
export type ErmsLanguage = 'en' | 'ar' | 'ru' | 'fr';

export interface ErmsContextTriadBarProps {
  density?: ErmsDensityMode;
  currency?: ErmsCurrency;
  language?: ErmsLanguage;
  onDensityChange?: (density: ErmsDensityMode) => void;
  onCurrencyChange?: (currency: ErmsCurrency) => void;
  onLanguageChange?: (language: ErmsLanguage) => void;
  onToggleShortcutsModal?: () => void;
}

export const ErmsContextTriadBar: FC<ErmsContextTriadBarProps> = ({
  density = 'compact',
  currency = 'AED',
  language = 'en',
  onDensityChange,
  onCurrencyChange,
  onLanguageChange,
  onToggleShortcutsModal,
}) => {
  const [selectedDensity, setSelectedDensity] = useState<ErmsDensityMode>(density);
  const [selectedCurrency, setSelectedCurrency] = useState<ErmsCurrency>(currency);
  const [selectedLang, setSelectedLang] = useState<ErmsLanguage>(language);

  const handleDensitySelect = (mode: ErmsDensityMode) => {
    setSelectedDensity(mode);
    onDensityChange?.(mode);
  };

  const handleCurrencySelect = (cur: ErmsCurrency) => {
    setSelectedCurrency(cur);
    onCurrencyChange?.(cur);
  };

  const handleLangSelect = (lang: ErmsLanguage) => {
    setSelectedLang(lang);
    onLanguageChange?.(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  return (
    <div
      className="px-4 py-2 bg-zinc-950/90 border-y border-zinc-800 flex items-center justify-between flex-wrap gap-2 text-xs text-zinc-300"
      data-testid="erms-context-triad-bar"
    >
      {/* Left: Context Triad (Language & Currency) */}
      <div className="flex items-center gap-3">
        {/* Language & RTL Toggle (Upgrades 71 & 72) */}
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] font-semibold text-zinc-400">Language:</span>
          <div className="flex items-center p-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
            {(['en', 'ar', 'ru', 'fr'] as ErmsLanguage[]).map(l => (
              <button
                key={l}
                type="button"
                onClick={() => handleLangSelect(l)}
                className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${
                  selectedLang === l
                    ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Currency Switcher (Upgrade 72) */}
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-zinc-400">Currency:</span>
          <div className="flex items-center p-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
            {(['AED', 'USD', 'EUR', 'GBP'] as ErmsCurrency[]).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => handleCurrencySelect(c)}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  selectedCurrency === c
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Density Mode & Shortcuts (Upgrades 73 & 75) */}
      <div className="flex items-center gap-3">
        {/* Density Toggle */}
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] font-semibold text-zinc-400">Density:</span>
          <div className="flex items-center p-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
            {(['comfortable', 'compact', 'ultra-dense'] as ErmsDensityMode[]).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => handleDensitySelect(d)}
                className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                  selectedDensity === d
                    ? 'bg-zinc-800 text-zinc-100 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {d === 'ultra-dense' ? 'Dense' : d}
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts Trigger */}
        <button
          type="button"
          onClick={onToggleShortcutsModal}
          className="flex items-center gap-1 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Hotkeys</span>
          <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
            ⌘K
          </span>
        </button>
      </div>
    </div>
  );
};
