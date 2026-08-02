'use client';

/**
 * app/properties/search/PropertySearchForm.tsx — Client Filter Component
 */

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchParams {
  community?: string;
  type?: string;
  beds?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
}

export default function PropertySearchForm({ initialParams }: { initialParams: SearchParams }) {
  const router = useRouter();

  const [q, setQ]                 = useState(initialParams.q ?? '');
  const [community, setCommunity] = useState(initialParams.community ?? 'All');
  const [type, setType]           = useState(initialParams.type ?? 'All');
  const [beds, setBeds]           = useState(initialParams.beds ?? 'All');
  const [minPrice, setMinPrice]   = useState(initialParams.minPrice ?? '');
  const [maxPrice, setMaxPrice]   = useState(initialParams.maxPrice ?? '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (community && community !== 'All') params.set('community', community);
    if (type && type !== 'All') params.set('type', type);
    if (beds && beds !== 'All') params.set('beds', beds);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    router.push(`/properties/search?${params.toString()}`);
  };

  const selectStyle: React.CSSProperties = {
    padding: '10px 14px',
    minHeight: '44px',
    borderRadius: '8px',
    border: '1px solid var(--color-334155, #334155)',
    backgroundColor: 'var(--color-0f172a, #0F172A)',
    color: 'var(--white, #FFFFFF)',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <form onSubmit={handleSearch} style={{ background: 'var(--color-1e293b, #1E293B)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-334155, #334155)', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Main Search Input */}
      <div>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by keywords or title..."
          style={{ ...selectStyle, padding: '12px 16px', fontSize: '0.95rem' }}
        />
      </div>

      {/* Filter Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)', marginBottom: '4px' }}>COMMUNITY</label>
          <select value={community} onChange={(e) => setCommunity(e.target.value)} style={selectStyle}>
            <option value="All">All Communities</option>
            <option value="DAMAC Hills 2">DAMAC Hills 2</option>
            <option value="Downtown Dubai">Downtown Dubai</option>
            <option value="Palm Jumeirah">Palm Jumeirah</option>
            <option value="Dubai Marina">Dubai Marina</option>
            <option value="Business Bay">Business Bay</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)', marginBottom: '4px' }}>TYPE</label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
            <option value="All">All Types</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Townhouse">Townhouse</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)', marginBottom: '4px' }}>BEDROOMS</label>
          <select value={beds} onChange={(e) => setBeds(e.target.value)} style={selectStyle}>
            <option value="All">Any Beds</option>
            <option value="1">1+ Bed</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
            <option value="5">5+ Beds</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)', marginBottom: '4px' }}>MIN PRICE (AED)</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="e.g. 1000000"
            style={selectStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)', marginBottom: '4px' }}>MAX PRICE (AED)</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="e.g. 5000000"
            style={selectStyle}
          />
        </div>

      </div>

      <button
        type="submit"
        style={{ padding: '12px 24px', minHeight: '44px', borderRadius: '8px', background: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', fontWeight: 700, border: 'none', cursor: 'pointer', alignSelf: 'flex-end', fontSize: '0.9rem' }}
      >
        Apply Filters →
      </button>

    </form>
  );
}
