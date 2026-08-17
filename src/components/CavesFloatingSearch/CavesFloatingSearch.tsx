import React from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { useFloatingSearchLogic } from './CavesFloatingSearch.logic';
import { SEARCH_MODAL_TEXT } from './CavesFloatingSearch.data';
import {
  SearchPill,
  SearchText,
  SearchShortcut,
  ModalOverlay,
  ModalCard,
  ModalSearchHeader,
  ModalCategoryPills,
  ModalCategoryBtn,
  ResultsList,
  ResultItemCard,
} from './CavesFloatingSearch.style';

export const CavesFloatingSearch: React.FC = () => {
  const {
    isOpen,
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    categories,
    searchResults,
    toggleSearch,
    closeSearch,
    handleResultClick,
  } = useFloatingSearchLogic();

  return (
    <>
      <SearchPill 
        onClick={toggleSearch}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        data-testid="caves-floating-search-pill"
      >
        <Search size={18} color="#EF4444" />
        <SearchText>{SEARCH_MODAL_TEXT.pillLabel}</SearchText>
        <SearchShortcut>{SEARCH_MODAL_TEXT.pillShortcut}</SearchShortcut>
      </SearchPill>

      {/* Fullscreen Framer Motion Overlay Modal Search Viewport */}
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSearch}
          data-testid="caves-search-modal-overlay"
        >
          <ModalCard
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <ModalSearchHeader>
              <Search size={22} color="#EF4444" />
              <input 
                autoFocus
                placeholder={SEARCH_MODAL_TEXT.inputPlaceholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                data-testid="caves-search-input"
              />
              <button 
                type="button"
                className="close-btn"
                onClick={closeSearch}
              >
                {SEARCH_MODAL_TEXT.closeLabel}
              </button>
            </ModalSearchHeader>

            <ModalCategoryPills>
              {categories.map(c => (
                <ModalCategoryBtn
                  key={c.id}
                  $active={activeCategory === c.id}
                  onClick={() => setActiveCategory(c.id)}
                >
                  {c.label}
                </ModalCategoryBtn>
              ))}
            </ModalCategoryPills>

            <ResultsList>
              <div style={{ padding: '4px 0', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#EF4444" />
                <span>{SEARCH_MODAL_TEXT.trendingLabel}</span>
              </div>
              {searchResults.map(item => (
                <ResultItemCard
                  key={item.id}
                  onClick={() => handleResultClick(item.path)}
                  data-testid={`search-result-${item.id}`}
                >
                  <div className="item-meta">
                    <strong className="title">{item.title}</strong>
                    <span className="sub">{item.sub}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge">{item.badge}</span>
                    <ArrowRight size={16} color="#94A3B8" />
                  </div>
                </ResultItemCard>
              ))}
            </ResultsList>
          </ModalCard>
        </ModalOverlay>
      )}
    </>
  );
};

export default CavesFloatingSearch;
