import React from 'react';
import { Search } from 'lucide-react';
import { useFloatingSearchLogic } from './CavesFloatingSearch.logic';
import { SearchPill, SearchText, SearchShortcut } from './CavesFloatingSearch.style';

export const CavesFloatingSearch: React.FC = () => {
  const { isOpen, toggleSearch } = useFloatingSearchLogic();

  return (
    <>
      <SearchPill 
        onClick={toggleSearch}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Search size={20} color="#EF4444" />
        <SearchText>Search Network</SearchText>
        <SearchShortcut>⌘K</SearchShortcut>
      </SearchPill>

      {/* Basic Fullscreen Modal Placeholder */}
      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255,255,255,0.95)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10vh'
        }}>
          <input 
            autoFocus
            placeholder="Search properties, leads, docs..." 
            style={{ fontSize: '2rem', border: 'none', borderBottom: '2px solid #EF4444', outline: 'none', background: 'transparent', width: '80%', color: '#1E293B' }} 
          />
          <button onClick={toggleSearch} style={{ position: 'absolute', top: '2rem', right: '2rem', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </>
  );
};

export default CavesFloatingSearch;
