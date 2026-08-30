import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const HeroSearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock recent searches
  const recentSearches = ['Palm Jumeirah Villas', 'Downtown Dubai Penthouses', 'Dubai Marina'];
  // Mock auto-complete suggestions
  const suggestions = ['Palm Jumeirah', 'Palm Jebel Ali', 'Palm View Estate'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchTerm: string) => {
    navigate(`/properties?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div ref={searchRef} className="hero-search-container relative w-full max-w-2xl mx-auto mt-8 z-50">
      <motion.div
        className="glass-search-bar flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 pr-4 shadow-xl"
        animate={{
          boxShadow: isFocused ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.2)',
          borderColor: isFocused ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.4)'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-red-500 text-white p-3 rounded-full flex items-center justify-center">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              handleSearch(query.trim());
            }
          }}
          placeholder="Search Dubai Luxury Properties..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/70 ml-4 font-semibold text-lg"
        />
        <button
          onClick={() => query.trim() && handleSearch(query.trim())}
          className="bg-white/20 hover:bg-white/30 transition-colors text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider"
        >
          Explore
        </button>
      </motion.div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-left"
          >
            {query.length === 0 ? (
              <div className="p-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Recent Searches</h4>
                <ul>
                  {recentSearches.map((term, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handleSearch(term)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg text-gray-700 transition-colors"
                      >
                        <History size={16} className="text-gray-400" />
                        <span className="font-medium">{term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Suggestions</h4>
                <ul>
                  {suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())).map((term, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handleSearch(term)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg text-gray-700 transition-colors"
                      >
                        <MapPin size={16} className="text-red-500" />
                        <span className="font-medium">{term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-100 mt-2 pt-2">
                   <button
                        onClick={() => handleSearch(query)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      >
                        <Search size={16} />
                        <span className="font-bold">See all results for "{query}"</span>
                    </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
