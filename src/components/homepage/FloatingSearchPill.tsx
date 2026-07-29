import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSearchLead } from '../../store/slices/searchLeadsSlice';
import { setFilters, clearFilters } from '../../store/propertySlice';
import type { AppDispatch } from '../../store/store';
import { Search } from 'lucide-react';

const RED = '#EF4444';
const SLATE = '#1E293B';

interface FloatingSearchPillProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const FloatingSearchPill: React.FC<FloatingSearchPillProps> = ({ isOpen, onOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [mode, setMode] = useState<'buy' | 'rent'>('rent');
  const [community, setCommunity] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(15000000);
  const [beds, setBeds] = useState('any');

  // Trigger Session ID if not present
  useEffect(() => {
    if (!sessionStorage.getItem('wc_session_id')) {
      sessionStorage.setItem(
        'wc_session_id',
        `wc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      );
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearFilters());

    const bedNum = beds === 'any' ? 0 : beds === '5+' ? 5 : parseInt(beds, 10);
    const locations: string[] = [];
    if (community !== 'all') locations.push(community);

    const types: string[] = [];
    if (propertyType !== 'all') types.push(propertyType);

    // Update Redux Filters
    const reduxPayload: Record<string, unknown> = {};
    if (locations.length > 0) reduxPayload['locations'] = locations;
    if (types.length > 0) reduxPayload['propertyTypes'] = types;
    if (bedNum > 0) reduxPayload['beds'] = bedNum;
    reduxPayload['maxPrice'] = maxPrice;

    dispatch(setFilters(reduxPayload));

    // Lead Capture
    void dispatch(
      createSearchLead({
        mode,
        location: community !== 'all' ? community : null,
        propertyType: propertyType !== 'all' ? propertyType : null,
        beds: bedNum,
        minPrice: 0,
        maxPrice,
        sessionId: sessionStorage.getItem('wc_session_id') ?? undefined,
        searchedAt: new Date().toISOString(),
      })
    );

    // Build query params
    const query = new URLSearchParams();
    query.set('mode', mode);
    if (community !== 'all') query.set('location', community);
    if (propertyType !== 'all') query.set('type', propertyType);
    if (beds !== 'any') query.set('beds', beds);
    query.set('maxPrice', String(maxPrice));

    onClose();
    navigate(`/properties?${query.toString()}`);
  };

  return (
    <>
      {/* Floating Pill Trigger */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          pointerEvents: 'auto',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(239, 68, 68, 0.25)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#FFFFFF',
            color: SLATE,
            border: '2px solid #EF4444',
            borderRadius: '9999px',
            padding: '10px 24px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
          }}
        >
          <Search size={16} color={RED} strokeWidth={3} />
          <span>Search Dubai Luxury Properties...</span>
          <kbd
            style={{
              background: '#F1F5F9',
              color: '#64748B',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              border: '1px solid #E2E8F0',
            }}
          >
            Ctrl+K
          </kbd>
        </motion.button>
      </div>

      {/* Modal Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(12px)',
              zIndex: 2000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
            }}
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                maxWidth: '640px',
                width: '100%',
                padding: '36px',
                boxShadow: '0 30px 60px -15px rgba(239, 68, 68, 0.2)',
                border: '2px solid rgba(239, 68, 68, 0.1)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                  <span style={{ color: RED, fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                    WHITE CAVES EXCLUSIVE SEARCH
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: SLATE, margin: '4px 0 0' }}>
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
                    fontWeight: 900,
                    color: SLATE,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#E2E8F0')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F1F5F9')}
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSearchSubmit}>
                {/* Mode Selector */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {['rent', 'buy'].map(m => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMode(m as 'rent' | 'buy')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        border: 'none',
                        background: mode === m ? RED : '#F1F5F9',
                        color: mode === m ? '#FFFFFF' : SLATE,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {m === 'rent' ? '🔑 Rent' : '💰 Buy'}
                    </button>
                  ))}
                </div>

                {/* Grid inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: SLATE, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Community / Area
                    </label>
                    <select
                      value={community}
                      onChange={e => setCommunity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #E2E8F0',
                        background: '#FFFFFF',
                        fontWeight: 700,
                        color: SLATE,
                        outline: 'none',
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
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: SLATE, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={e => setPropertyType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #E2E8F0',
                        background: '#FFFFFF',
                        fontWeight: 700,
                        color: SLATE,
                        outline: 'none',
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

                {/* Price ceiling slider */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Max Price Ceiling
                    </label>
                    <span style={{ fontWeight: 900, color: RED, fontSize: '0.95rem' }}>
                      AED {(maxPrice / 1000000).toFixed(1)} Million
                    </span>
                  </div>
                  <input
                    type="range"
                    min={mode === 'rent' ? 50000 : 1000000}
                    max={mode === 'rent' ? 2000000 : 80000000}
                    step={mode === 'rent' ? 10000 : 500000}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: RED,
                      cursor: 'pointer',
                    }}
                  />
                </div>

                {/* Bedroom Selector */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: SLATE, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                          padding: '10px 0',
                          borderRadius: '10px',
                          border: beds === b ? `2px solid ${RED}` : '1.5px solid #E2E8F0',
                          background: beds === b ? 'rgba(239, 68, 68, 0.08)' : '#FFFFFF',
                          color: beds === b ? RED : SLATE,
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {b === 'any' ? 'Any' : `${b} Bed`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${RED} 0%, #DC2626 100%)`,
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)';
                  }}
                >
                  Search Available Inventory →
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSearchPill;
