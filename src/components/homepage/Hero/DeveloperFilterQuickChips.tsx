import React, { FC } from 'react';
import { Sparkles } from 'lucide-react';

export interface DeveloperFilterQuickChipsProps {
  developers?: string[];
  selectedDeveloper?: string | null;
  onSelectDeveloper?: (developer: string) => void;
  className?: string;
}

const DEFAULT_DEVELOPERS = [
  'Emaar Properties',
  'DAMAC',
  'Meraas',
  'Sobha Realty',
  'Nakheel',
  'Ellington Properties',
];

export const DeveloperFilterQuickChips: FC<DeveloperFilterQuickChipsProps> = ({
  developers = DEFAULT_DEVELOPERS,
  selectedDeveloper = null,
  onSelectDeveloper,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
        <Sparkles className="w-3 h-3 text-red-500" />
        Tier-1 Developers:
      </span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {developers.map(dev => {
          const isSelected = selectedDeveloper === dev;
          return (
            <button
              key={dev}
              type="button"
              onClick={() => onSelectDeveloper?.(dev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white'
              }`}
            >
              {dev}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeveloperFilterQuickChips;
