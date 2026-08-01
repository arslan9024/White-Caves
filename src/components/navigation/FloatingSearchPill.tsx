import React, { FC, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FloatingSearchPillProps {
  onSearchSubmit?: (query: string) => void;
}

export const FloatingSearchPill: FC<FloatingSearchPillProps> = ({ onSearchSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Centered Pill Button */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 990,
          display: 'flex',
          alignItems: 'center',
        }}
        data-testid="floating-search-pill"
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            backgroundColor: 'var(--wc-bg-card, #FFFFFF)',
            color: 'var(--wc-text-primary, #1E293B)',
            border: '1px solid var(--wc-border-light, #CBD5E1)',
            borderRadius: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.25s ease-in-out',
          }}
        >
          <Search size={16} color="var(--wc-red-primary, #EF4444)" />
          <span>Search DAMAC Hills 2, Ejari, Investors, Leads...</span>
          <span
            style={{
              fontSize: '11px',
              backgroundColor: 'var(--wc-bg-subtle, #F1F5F9)',
              color: 'var(--wc-text-secondary, #64748B)',
              padding: '2px 8px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            ⌘K
          </span>
        </button>
      </div>

      {/* Framer Motion Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 1100,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '120px',
            }}
            onClick={() => setIsOpen(false)}
            data-testid="search-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'var(--wc-bg-card, #FFFFFF)',
                borderRadius: '16px',
                border: '1px solid var(--wc-red-primary, #EF4444)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
              }}
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--wc-border-light, #E2E8F0)' }}>
                <Search size={20} color="var(--wc-red-primary, #EF4444)" style={{ marginRight: '12px' }} />
                <input
                  type="text"
                  placeholder="Search properties, Ejari contracts, leads, brokers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    color: 'var(--wc-text-primary, #1E293B)',
                    backgroundColor: 'transparent',
                  }}
                />
                <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={18} color="var(--wc-text-secondary, #64748B)" />
                </button>
              </form>

              <div style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)' }}>
                Press <strong>Enter</strong> to execute unified search across 12 White Caves departments.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSearchPill;
