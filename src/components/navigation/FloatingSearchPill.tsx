import React, { FC, useState, useEffect } from 'react';
import { Search, Command, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FloatingSearchPillProps {
  onSearch?: (query: string) => void;
}

export const FloatingSearchPill: FC<FloatingSearchPillProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/properties?search=${encodeURIComponent(query)}`);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Centered Floating Trigger Pill */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.12), 0 2px 6px rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          userSelect: 'none',
        }}
        onClick={() => setIsOpen(true)}
        title="Quick Search (Ctrl+K)"
        data-testid="floating-search-pill"
      >
        <Search size={14} color="var(--brand-red, #EF4444)" />
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--wc-text-primary, #1E293B)', letterSpacing: '0.2px' }}>
          Search Properties, Leads & Departments
        </span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: '700',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--brand-red, #EF4444)',
            padding: '2px 6px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <Command size={10} /> K
        </span>
      </div>

      {/* Glassmorphic Search Modal Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '120px',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: 'var(--wc-surface-dark, #FFFFFF)',
              borderRadius: '16px',
              border: '2px solid var(--brand-red, #EF4444)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--wc-border, #E2E8F0)' }}>
              <Search size={20} color="var(--brand-red, #EF4444)" style={{ marginRight: '12px' }} />
              <input
                type="text"
                autoFocus
                placeholder="Search by property ID, cluster, tenant name, or lead..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  color: 'var(--wc-text-primary, #1E293B)',
                  backgroundColor: 'transparent',
                }}
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wc-text-secondary, #64748B)' }}
              >
                <X size={20} />
              </button>
            </form>

            <div style={{ padding: '16px 20px', backgroundColor: 'var(--wc-surface-card, #F8FAFC)', fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Press <strong>Enter</strong> to search</span>
              <span>Press <strong>Esc</strong> to exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingSearchPill;
