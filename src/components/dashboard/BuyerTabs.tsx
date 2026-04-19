/**
 * Buyer Dashboard — Overview, SavedProperties, ViewingSchedule, PriceAlerts, BuyerOffers
 * ──────────────────────────────────────────────────────────────────────────────
 * 5 buyer-role sub-tab components wired to backend APIs via authFetch.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import { settledJson } from '../../utils/settledJson';
import type {
  DashboardViewing,
  DashboardFavorite,
  DashboardSavedSearch,
  DashboardOffer,
} from '@/types/dashboard';
import * as S from './shared';

const log = createLogger('Dashboard');

// ═══════════════════════════════════════════════════════════════════════
// BUYER OVERVIEW
// ═══════════════════════════════════════════════════════════════════════

export const BuyerOverview: React.FC = () => {
  const [stats, setStats] = useState({ favorites: 0, viewings: 0, offers: 0, savedSearches: 0 });
  const [recentViewings, setRecentViewings] = useState<DashboardViewing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {

        const [fav, view, off, sSearch] = await settledJson([authFetch('/api/favorites/ids'), authFetch('/api/viewings?pageSize=5'), authFetch('/api/offers?role=buyer&pageSize=5'), authFetch('/api/saved-searches')],
          [{ data: [] }, { data: [] }, { data: [] }, { data: [] }],
        ) as any[];

        setStats({
          favorites: fav.data?.length ?? 0,
          viewings: view.pagination?.total ?? view.data?.length ?? 0,
          offers: off.pagination?.total ?? off.data?.length ?? 0,
          savedSearches: sSearch.data?.length ?? 0,
        });
        setRecentViewings(view.data?.slice?.(0, 5) ?? []);
      } catch (error) { log.warn('Failed to fetch buyer stats:', error); }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🏠 Buyer Dashboard</h2>
        <p style={S.headerSubtitle}>Your property search at a glance</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.favorites}</span>
          <span style={S.statLabel}>❤️ Favorites</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.viewings}</span>
          <span style={S.statLabel}>👁️ Scheduled Viewings</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.offers}</span>
          <span style={S.statLabel}>💰 Active Offers</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.savedSearches}</span>
          <span style={S.statLabel}>🔍 Saved Searches</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>📅 Upcoming Viewings</h3>
        {recentViewings.length === 0 ? (
          <p style={S.headerSubtitle}>No upcoming viewings scheduled.</p>
        ) : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Date</th>
                  <th style={S.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentViewings.map((v) => (
                  <tr key={v.id}>
                    <td style={S.td}>{v.property?.title ?? v.propertyId}</td>
                    <td style={S.td}>{S.formatDate(v.scheduledAt)}</td>
                    <td style={S.td}>
                      <span style={S.badge('#2563eb', '#dbeafe')}>{S.formatStatus(v.status ?? '')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SAVED PROPERTIES (Wrapper for /api/favorites)
// ═══════════════════════════════════════════════════════════════════════

export const SavedProperties: React.FC = () => {
  const [properties, setProperties] = useState<DashboardFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/favorites?pageSize=50');
      const json = await res.json();
      setProperties(json.data ?? []);
    } catch (error) { log.warn('Failed to fetch saved properties:', error); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>💾 Saved Properties</h2>
        <p style={S.headerSubtitle}>{properties.length} saved {properties.length === 1 ? 'property' : 'properties'}</p>
      </div>
      {properties.length === 0
        ? S.emptyState('💾', 'No saved properties', 'Browse listings and tap the heart icon to save properties here.')
        : (
          <div style={S.listGrid}>
            {properties.map((fav) => (
              <div key={fav.id} style={S.card}>
                <h4 style={{ margin: 0 }}>{fav.property?.title ?? 'Property'}</h4>
                <p style={S.headerSubtitle}>📍 {fav.property?.location ?? '—'}</p>
                <p style={{ fontWeight: 600, color: 'var(--color-primary, #D4AF37)' }}>
                  {S.formatCurrency(fav.property?.price ?? 0)}
                </p>
                {fav.property?.bedrooms != null && (
                  <span style={S.badge('#6b7280', '#f3f4f6')}>
                    🛏️ {fav.property.bedrooms} BR · 🚿 {fav.property.bathrooms ?? 0}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// VIEWING SCHEDULE
// ═══════════════════════════════════════════════════════════════════════

export const ViewingSchedule: React.FC = () => {
  const [viewings, setViewings] = useState<DashboardViewing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/viewings?pageSize=50');
        const json = await res.json();
        setViewings(json.data ?? []);
      } catch (error) { log.warn('Failed to fetch viewing schedule:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>👁️ Viewing Schedule</h2>
        <p style={S.headerSubtitle}>Manage your property viewing appointments</p>
      </div>
      {viewings.length === 0
        ? S.emptyState('👁️', 'No viewings scheduled', 'Request a viewing from any property listing.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Agent</th>
                  <th style={S.th}>Date</th>
                  <th style={S.th}>Time</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {viewings.map((v) => (
                  <tr key={v.id}>
                    <td style={S.td}>{v.property?.title ?? v.propertyId}</td>
                    <td style={S.td}>{v.agent?.name ?? '—'}</td>
                    <td style={S.td}>{S.formatDate(v.scheduledAt)}</td>
                    <td style={S.td}>{v.scheduledAt ? new Date(v.scheduledAt).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td style={S.td}>
                      <span style={S.badge(
                        v.status === 'completed' ? '#16a34a' : '#2563eb',
                        v.status === 'completed' ? '#dcfce7' : '#dbeafe',
                      )}>
                        {S.formatStatus(v.status ?? '')}
                      </span>
                    </td>
                    <td style={S.td}>{v.rating ? `${'⭐'.repeat(v.rating)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PRICE ALERTS
// ═══════════════════════════════════════════════════════════════════════

export const PriceAlerts: React.FC = () => {
  const [searches, setSearches] = useState<DashboardSavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/saved-searches');
        const json = await res.json();
        setSearches((json.data ?? []).filter((s: DashboardSavedSearch) => s.alertEnabled));
      } catch (error) { log.warn('Failed to fetch saved searches:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🔔 Price Alerts</h2>
        <p style={S.headerSubtitle}>Get notified when properties match your criteria</p>
      </div>
      {searches.length === 0
        ? S.emptyState('🔔', 'No price alerts active', 'Enable alerts on your saved searches to track price changes.')
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {searches.map((s) => (
              <div key={s.id} style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{s.name}</h4>
                    <p style={S.headerSubtitle}>
                      {s.filters?.type ?? 'Any type'} · {s.filters?.location ?? 'Any location'}
                      {s.filters?.bedrooms ? ` · ${s.filters.bedrooms} BR` : ''}
                    </p>
                  </div>
                  <span style={S.badge('#16a34a', '#dcfce7')}>
                    {s.matchCount} matches
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// BUYER OFFERS
// ═══════════════════════════════════════════════════════════════════════

export const BuyerOffers: React.FC = () => {
  const [offers, setOffers] = useState<DashboardOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/offers?role=buyer&pageSize=50');
        const json = await res.json();
        setOffers(json.data ?? []);
      } catch (error) { log.warn('Failed to fetch buyer offers:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const statusColor = (s: string) => {
    if (s === 'accepted') return { c: '#16a34a', bg: '#dcfce7' };
    if (s === 'rejected' || s === 'expired') return { c: '#dc2626', bg: '#fef2f2' };
    if (s === 'countered') return { c: '#d97706', bg: '#fffbeb' };
    return { c: '#2563eb', bg: '#dbeafe' };
  };

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>💰 My Offers</h2>
        <p style={S.headerSubtitle}>Track your property offers and negotiations</p>
      </div>
      {offers.length === 0
        ? S.emptyState('💰', 'No offers submitted', 'Make an offer on a property you love.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Amount</th>
                  <th style={S.th}>Counter</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => {
                  const sc = statusColor(o.status ?? '');
                  return (
                    <tr key={o.id}>
                      <td style={S.td}>{o.property?.title ?? o.propertyId}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(o.amount ?? 0)}</td>
                      <td style={S.td}>{o.counterAmount ? S.formatCurrency(o.counterAmount ?? 0) : '—'}</td>
                      <td style={S.td}>
                        <span style={S.badge(sc.c, sc.bg)}>{S.formatStatus(o.status ?? '')}</span>
                      </td>
                      <td style={S.td}>{S.formatDate(o.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};
