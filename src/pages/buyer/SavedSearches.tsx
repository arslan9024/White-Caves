/**
 * Saved Searches Page
 * ───────────────────
 * Full CRUD interface for managing saved property search criteria.
 * Users can create, edit, delete, and check for new matches.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  fetchSavedSearches,
  createSavedSearch,
  updateSavedSearch,
  deleteSavedSearch,
  checkSearchMatches,
  selectSavedSearches,
  selectSavedSearchesLoading,
  selectSavedSearchesError,
  selectMatchResults,
  clearError,
} from '../../store/slices/savedSearchesSlice';
import type { SavedSearch, SearchFilters } from '../../services/savedSearchesApi';
import '../RolePages.css';

// ─── Inline Styles ───────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: 'var(--color-surface, #fff)',
  border: '1px solid var(--color-border, #e5e7eb)',
  borderRadius: '12px',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.2rem 0.6rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 500,
};

const btnPrimary: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: '8px',
  border: 'none',
  background: 'var(--color-primary, #2563eb)',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem',
};

const btnSecondary: React.CSSProperties = {
  padding: '0.4rem 1rem',
  borderRadius: '8px',
  border: '1px solid var(--color-border, #e5e7eb)',
  background: 'var(--color-surface, #fff)',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

const btnDanger: React.CSSProperties = {
  ...btnSecondary,
  color: '#dc2626',
  borderColor: '#fecaca',
};

// ─── Create / Edit Modal ─────────────────────────────────────────────

interface SearchFormProps {
  initial?: SavedSearch | null;
  onSave: (name: string, filters: SearchFilters, alertEnabled: boolean) => void;
  onCancel: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ initial, onSave, onCancel }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState<string>((initial?.filters?.type as string) ?? '');
  const [location, setLocation] = useState<string>((initial?.filters?.location as string) ?? '');
  const [minPrice, setMinPrice] = useState<string>(
    initial?.filters?.minPrice != null ? String(initial.filters.minPrice) : ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initial?.filters?.maxPrice != null ? String(initial.filters.maxPrice) : ''
  );
  const [bedrooms, setBedrooms] = useState<string>(
    initial?.filters?.bedrooms != null ? String(initial.filters.bedrooms) : ''
  );
  const [alertEnabled, setAlertEnabled] = useState(initial?.alertEnabled ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: SearchFilters = {};
    if (type) filters.type = type;
    if (location) filters.location = location;
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (bedrooms) filters.bedrooms = Number(bedrooms);
    onSave(name.trim(), filters, alertEnabled);
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--color-border, #e5e7eb)',
    fontSize: '0.9rem',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300, // var(--z-modal)
      }}
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-surface, #fff)',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2 style={{ margin: 0 }}>{initial ? '✏️ Edit Search' : '🔍 New Saved Search'}</h2>

        <label>
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Search Name *</span>
          <input
            style={inputStyle}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. 3BR Apartments in JBR"
            required
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <label>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Property Type</span>
            <select style={inputStyle} value={type} onChange={e => setType(e.target.value)}>
              <option value="">Any</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="townhouse">Townhouse</option>
              <option value="penthouse">Penthouse</option>
              <option value="studio">Studio</option>
              <option value="land">Land</option>
            </select>
          </label>

          <label>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Location</span>
            <input
              style={inputStyle}
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. JBR, Downtown"
            />
          </label>

          <label>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Min Price (AED)</span>
            <input
              style={inputStyle}
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="0"
              min={0}
            />
          </label>

          <label>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Max Price (AED)</span>
            <input
              style={inputStyle}
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="∞"
              min={0}
            />
          </label>

          <label>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Bedrooms</span>
            <select style={inputStyle} value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </label>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={alertEnabled}
            onChange={e => setAlertEnabled(e.target.checked)}
          />
          <span style={{ fontSize: '0.9rem' }}>🔔 Notify me when new matches appear</span>
        </label>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.5rem',
          }}
        >
          <button type="button" onClick={onCancel} style={btnSecondary}>
            Cancel
          </button>
          <button type="submit" style={btnPrimary} disabled={!name.trim()}>
            {initial ? 'Save Changes' : 'Create Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Filter Summary ──────────────────────────────────────────────────

function formatFilters(filters: SearchFilters): string {
  const parts: string[] = [];
  if (filters.type) parts.push(filters.type);
  if (filters.bedrooms != null) parts.push(`${filters.bedrooms}BR`);
  if (filters.location) parts.push(filters.location);
  if (filters.minPrice != null || filters.maxPrice != null) {
    const min = filters.minPrice ? `${(filters.minPrice / 1000).toFixed(0)}K` : '0';
    const max = filters.maxPrice ? `${(filters.maxPrice / 1000).toFixed(0)}K` : '∞';
    parts.push(`AED ${min}–${max}`);
  }
  return parts.length > 0 ? parts.join(' · ') : 'All properties';
}

// ─── Main Page Component ─────────────────────────────────────────────

const SavedSearchesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const searches = useAppSelector(selectSavedSearches);
  const loading = useAppSelector(selectSavedSearchesLoading);
  const error = useAppSelector(selectSavedSearchesError);
  const matchResults = useAppSelector(selectMatchResults);

  const [showForm, setShowForm] = useState(false);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSavedSearches());
  }, [dispatch]);

  const handleCreate = useCallback(
    (name: string, filters: SearchFilters, alertEnabled: boolean) => {
      dispatch(createSavedSearch({ name, filters, alertEnabled }));
      setShowForm(false);
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (name: string, filters: SearchFilters, alertEnabled: boolean) => {
      if (!editingSearch) return;
      dispatch(
        updateSavedSearch({
          id: editingSearch.id,
          updates: { name, filters, alertEnabled },
        })
      );
      setEditingSearch(null);
    },
    [dispatch, editingSearch]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm('Delete this saved search?')) {
        dispatch(deleteSavedSearch(id));
      }
    },
    [dispatch]
  );

  const handleCheck = useCallback(
    async (id: string) => {
      setCheckingId(id);
      await dispatch(checkSearchMatches(id));
      setCheckingId(null);
    },
    [dispatch]
  );

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div
          className="page-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1>🔍 Saved Searches</h1>
            <p>Save your search criteria and get notified when new properties match</p>
          </div>
          <button
            style={btnPrimary}
            onClick={() => setShowForm(true)}
            disabled={searches.length >= 20}
            title={searches.length >= 20 ? 'Maximum 20 saved searches' : undefined}
          >
            + New Search
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: '#dc2626',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              style={{ ...btnSecondary, padding: '0.25rem 0.75rem' }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 0',
              color: 'var(--color-text-secondary, #6b7280)',
            }}
          >
            Loading saved searches…
          </div>
        )}

        {/* Empty state */}
        {!loading && searches.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--color-surface, #f9fafb)',
              borderRadius: '12px',
              border: '2px dashed var(--color-border, #e5e7eb)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No saved searches yet</h3>
            <p
              style={{
                color: 'var(--color-text-secondary, #6b7280)',
                maxWidth: '420px',
                margin: '0 auto 1.5rem',
              }}
            >
              Create a saved search to track properties matching your criteria. You&apos;ll be
              notified when new matches appear.
            </p>
            <button style={btnPrimary} onClick={() => setShowForm(true)}>
              Create Your First Search
            </button>
          </div>
        )}

        {/* Search list */}
        {!loading && searches.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {searches.map(search => {
              const matchResult = matchResults[search.id];
              return (
                <div key={search.id} style={cardStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{search.name}</h3>
                      <p
                        style={{
                          margin: '0.25rem 0 0',
                          fontSize: '0.9rem',
                          color: 'var(--color-text-secondary, #6b7280)',
                        }}
                      >
                        {formatFilters(search.filters)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      {search.alertEnabled && (
                        <span
                          style={{
                            ...badgeStyle,
                            background: '#dbeafe',
                            color: '#2563eb',
                          }}
                        >
                          🔔 Alerts ON
                        </span>
                      )}
                      <span
                        style={{
                          ...badgeStyle,
                          background: '#f0fdf4',
                          color: '#16a34a',
                        }}
                      >
                        {search.matchCount} matches
                      </span>
                    </div>
                  </div>

                  {/* Match check result */}
                  {matchResult && matchResult.newMatches > 0 && (
                    <div
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.9rem',
                        color: '#16a34a',
                      }}
                    >
                      🎉 {matchResult.newMatches} new{' '}
                      {matchResult.newMatches === 1 ? 'property' : 'properties'} found!
                    </div>
                  )}

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      borderTop: '1px solid var(--color-border, #f3f4f6)',
                      paddingTop: '0.75rem',
                    }}
                  >
                    <button
                      style={btnSecondary}
                      onClick={() => handleCheck(search.id)}
                      disabled={checkingId === search.id}
                    >
                      {checkingId === search.id ? '⏳ Checking…' : '🔄 Check Matches'}
                    </button>
                    <button style={btnSecondary} onClick={() => setEditingSearch(search)}>
                      ✏️ Edit
                    </button>
                    <button style={btnDanger} onClick={() => handleDelete(search.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Counter */}
        {searches.length > 0 && (
          <div
            style={{
              marginTop: '1rem',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary, #6b7280)',
              textAlign: 'center',
            }}
          >
            {searches.length} of 20 saved searches used
          </div>
        )}

        {/* Create / Edit form modal */}
        {showForm && <SearchForm onSave={handleCreate} onCancel={() => setShowForm(false)} />}
        {editingSearch && (
          <SearchForm
            initial={editingSearch}
            onSave={handleUpdate}
            onCancel={() => setEditingSearch(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SavedSearchesPage;
