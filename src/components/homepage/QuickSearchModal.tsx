import React, { FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_TAGS = [
  'Palm Jumeirah Villa',
  'Downtown Penthouse',
  'Dubai Marina',
  'DAMAC Hills 2',
  'Waterfront Estate',
  'Off-Plan Investment',
];

export const QuickSearchModal: FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    navigate(`/properties?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit((e.target as HTMLInputElement).value);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Quick Property Search"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-slate-900/95 border border-red-500/30 rounded-3xl p-6 shadow-2xl shadow-red-500/10 text-slate-100 backdrop-blur-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-red-500" />
                  Luxury Property Search
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Press <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-mono">ESC</kbd> to exit or <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-mono">Ctrl + K</kbd> to toggle
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full border border-slate-700 hover:border-red-500 text-slate-400 hover:text-white transition-colors"
                aria-label="Close search dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Bar */}
            <div className="relative mb-5">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by community, villa name, penthouse, or RERA ID..."
                onKeyDown={handleKeyDown}
                className="w-full pl-4 pr-12 py-3.5 bg-slate-800/90 border border-red-500/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-inner text-sm md:text-base"
              />
              <button
                type="button"
                onClick={() => inputRef.current && handleSearchSubmit(inputRef.current.value)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                aria-label="Execute search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Tags */}
            <div>
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-2.5">
                Popular Luxury Destinations
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSearchSubmit(tag)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-200 shadow-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickSearchModal;
