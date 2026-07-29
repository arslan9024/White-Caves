import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RED = '#EF4444';
const SLATE = '#1E293B';

interface SearchCommandProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SearchCommandTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        background: '#FFFFFF',
        color: SLATE,
        border: '1.5px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '9999px',
        padding: '10px 24px',
        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '0.9rem',
      }}
    >
      <span style={{ background: RED, color: '#FFFFFF', padding: '4px 8px', borderRadius: '50%', fontSize: '0.75rem' }}>
        🔍
      </span>
      <span>Search Dubai Luxury Properties...</span>
      <kbd style={{ background: '#F1F5F9', color: '#64748B', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
        Ctrl+K
      </kbd>
    </motion.button>
  );
};

export const SearchCommandModal: React.FC<SearchCommandProps> = ({ isOpen = false, onClose }) => {
  const navigate = useNavigate();
  const [community, setCommunity] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [beds, setBeds] = useState('any');

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (community !== 'all') query.set('community', community);
    if (propertyType !== 'all') query.set('type', propertyType);
    if (maxPrice) query.set('maxPrice', String(maxPrice));
    if (beds !== 'any') query.set('beds', beds);

    if (onClose) onClose();
    navigate(`/properties?${query.toString()}`);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span style={{ color: RED, fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                WHITE CAVES INTELLIGENT SEARCH
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: SLATE, margin: '4px 0 0' }}>
                Find Your Dubai Sanctuary
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#F1F5F9',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 800,
                color: SLATE,
              }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: SLATE, marginBottom: '6px' }}>
                  Community / Area
                </label>
                <select
                  value={community}
                  onChange={e => setCommunity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    background: '#F8FAFC',
                    fontWeight: 600,
                    color: SLATE,
                  }}
                >
                  <option value="all">🌟 All Communities</option>
                  <option value="DAMAC Hills 2">🌴 DAMAC Hills 2</option>
                  <option value="Downtown Dubai">🏙️ Downtown Dubai</option>
                  <option value="Palm Jumeirah">🏝️ Palm Jumeirah</option>
                  <option value="Dubai Marina">⛵ Dubai Marina</option>
                  <option value="Business Bay">💼 Business Bay</option>
                  <option value="Jumeirah Village Circle">🏡 Jumeirah Village Circle</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: SLATE, marginBottom: '6px' }}>
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    background: '#F8FAFC',
                    fontWeight: 600,
                    color: SLATE,
                  }}
                >
                  <option value="all">🏢 All Types</option>
                  <option value="Villa">🏰 Villa</option>
                  <option value="Apartment">🏢 Apartment</option>
                  <option value="Townhouse">🏡 Townhouse</option>
                  <option value="Penthouse">💎 Penthouse</option>
                  <option value="Off-Plan">🏗️ Off-Plan Project</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: SLATE }}>
                  Max Price Ceiling (AED)
                </label>
                <span style={{ fontWeight: 800, color: RED }}>
                  AED {(maxPrice / 1000000).toFixed(1)} Million
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={500000}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: RED }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: SLATE, marginBottom: '8px' }}>
                Bedrooms Requirement
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['any', '1', '2', '3', '4', '5+'].map(b => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setBeds(b)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: beds === b ? `2px solid ${RED}` : '1px solid #E2E8F0',
                      background: beds === b ? 'rgba(239, 68, 68, 0.1)' : '#FFFFFF',
                      color: beds === b ? RED : SLATE,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {b === 'any' ? 'Any' : `${b} Bed`}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${RED} 0%, #DC2626 100%)`,
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.35)',
              }}
            >
              Search Available Inventory →
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
