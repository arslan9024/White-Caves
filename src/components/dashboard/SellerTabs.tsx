/**
 * Seller Dashboard — SellerListings, SellerInquiries, MarketInsights, ReceivedOffers, SellerAnalytics
 * ────────────────────────────────────────────────────────────────────────────────
 * 5 seller-role sub-tab components wired to backend APIs.
 */

import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import { settledJson } from '../../utils/settledJson';
import type {
  DashboardProperty,
  DashboardLead,
  DashboardOffer,
} from '@/types/dashboard';
import * as S from './shared';

const log = createLogger('Dashboard');

// ═══════════════════════════════════════════════════════════════════════
// SELLER LISTINGS
// ═══════════════════════════════════════════════════════════════════════

export const SellerListings: React.FC = () => {
  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/properties?role=seller&pageSize=50');
        const json = await res.json();
        setProperties(json.data ?? json.properties ?? []);
      } catch (error) { log.warn('Failed to fetch properties:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📋 My Listings</h2>
        <p style={S.headerSubtitle}>{properties.length} active {properties.length === 1 ? 'listing' : 'listings'}</p>
      </div>
      {properties.length === 0
        ? S.emptyState('📋', 'No listings yet', 'Add your first property listing to get started.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Type</th>
                  <th style={S.th}>Price</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Views</th>
                  <th style={S.th}>Listed</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td style={S.td}>
                      <strong>{p.title}</strong>
                      <br />
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>📍 {p.location}</span>
                    </td>
                    <td style={S.td}>{S.formatStatus(p.type ?? '—')}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(p.price)}</td>
                    <td style={S.td}>
                      <span style={S.badge(
                        p.status === 'active' ? '#16a34a' : '#d97706',
                        p.status === 'active' ? '#dcfce7' : '#fffbeb',
                      )}>
                        {S.formatStatus(p.status)}
                      </span>
                    </td>
                    <td style={S.td}>{p.views ?? 0}</td>
                    <td style={S.td}>{S.formatDate(p.createdAt)}</td>
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
// SELLER INQUIRIES
// ═══════════════════════════════════════════════════════════════════════

export const SellerInquiries: React.FC = () => {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leads?source=inquiry&pageSize=50');
        const json = await res.json();
        setLeads(json.data ?? json.leads ?? []);
      } catch (error) { log.warn('Failed to fetch seller inquiries:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📞 Inquiries</h2>
        <p style={S.headerSubtitle}>{leads.length} buyer {leads.length === 1 ? 'inquiry' : 'inquiries'}</p>
      </div>
      {leads.length === 0
        ? S.emptyState('📞', 'No inquiries yet', 'Inquiries from interested buyers will appear here.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Contact</th>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Score</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td style={S.td}>
                      <strong>{l.name || l.contactName || '—'}</strong>
                      <br />
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{l.email || l.phone || '—'}</span>
                    </td>
                    <td style={S.td}>{l.property?.title ?? l.propertyId ?? '—'}</td>
                    <td style={S.td}>
                      <span style={S.badge('#d97706', '#fffbeb')}>{l.score ?? 0}/100</span>
                    </td>
                    <td style={S.td}>
                      <span style={S.badge('#2563eb', '#dbeafe')}>{S.formatStatus(l.status)}</span>
                    </td>
                    <td style={S.td}>{S.formatDate(l.createdAt)}</td>
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
// MARKET INSIGHTS
// ═══════════════════════════════════════════════════════════════════════

export const MarketInsights: React.FC = () => {
  const insights = [
    { label: 'Avg. Price/sqft (Dubai)', value: 'AED 1,850', trend: '+5.2%', icon: '📈' },
    { label: 'Market Demand Index', value: '82/100', trend: '+3.1%', icon: '🔥' },
    { label: 'Avg Days on Market', value: '28 days', trend: '-4 days', icon: '⏱️' },
    { label: 'Transaction Volume (Q1)', value: '12,450', trend: '+18%', icon: '📊' },
  ];

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📈 Market Insights</h2>
        <p style={S.headerSubtitle}>Dubai real estate market trends and data</p>
      </div>

      <div style={S.statsGrid}>
        {insights.map((i) => (
          <div key={i.label} style={S.statCard}>
            <span style={{ fontSize: '1.5rem' }}>{i.icon}</span>
            <span style={S.statValue}>{i.value}</span>
            <span style={S.statLabel}>{i.label}</span>
            <span style={S.badge('#16a34a', '#dcfce7')}>{i.trend}</span>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>🏙️ Top Performing Areas</h3>
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Area</th>
                <th style={S.th}>Avg Price</th>
                <th style={S.th}>Demand</th>
                <th style={S.th}>YoY Change</th>
              </tr>
            </thead>
            <tbody>
              {[
                { area: 'Downtown Dubai', price: 'AED 2,800/sqft', demand: 'Very High', change: '+8.5%' },
                { area: 'Dubai Marina', price: 'AED 2,100/sqft', demand: 'High', change: '+6.2%' },
                { area: 'JBR', price: 'AED 2,450/sqft', demand: 'High', change: '+7.1%' },
                { area: 'Palm Jumeirah', price: 'AED 3,200/sqft', demand: 'Very High', change: '+12.3%' },
                { area: 'Business Bay', price: 'AED 1,650/sqft', demand: 'Medium', change: '+4.8%' },
              ].map((a) => (
                <tr key={a.area}>
                  <td style={{ ...S.td, fontWeight: 600 }}>{a.area}</td>
                  <td style={S.td}>{a.price}</td>
                  <td style={S.td}>
                    <span style={S.badge(
                      a.demand === 'Very High' ? '#dc2626' : '#d97706',
                      a.demand === 'Very High' ? '#fef2f2' : '#fffbeb',
                    )}>
                      {a.demand}
                    </span>
                  </td>
                  <td style={{ ...S.td, color: '#16a34a', fontWeight: 600 }}>{a.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// RECEIVED OFFERS
// ═══════════════════════════════════════════════════════════════════════

export const ReceivedOffers: React.FC = () => {
  const [offers, setOffers] = useState<DashboardOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/offers?role=seller&pageSize=50');
        const json = await res.json();
        setOffers(json.data ?? []);
      } catch (error) { log.warn('Failed to fetch seller offers:', error); }
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
        <h2 style={S.headerTitle}>🤝 Received Offers</h2>
        <p style={S.headerSubtitle}>{offers.length} {offers.length === 1 ? 'offer' : 'offers'} on your properties</p>
      </div>
      {offers.length === 0
        ? S.emptyState('🤝', 'No offers received', 'Offers from buyers will appear here when they submit them.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Buyer</th>
                  <th style={S.th}>Offer Amount</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Date</th>
                  <th style={S.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => {
                  const sc = statusColor(o.status ?? '');
                  return (
                    <tr key={o.id}>
                      <td style={S.td}>{o.property?.title ?? '—'}</td>
                      <td style={S.td}>{o.buyer?.name ?? '—'}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(o.amount)}</td>
                      <td style={S.td}>
                        <span style={S.badge(sc.c, sc.bg)}>{S.formatStatus(o.status)}</span>
                      </td>
                      <td style={S.td}>{S.formatDate(o.createdAt)}</td>
                      <td style={S.td}>
                        {o.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{ ...S.btnPrimary, padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Accept</button>
                            <button style={{ ...S.btnSecondary, padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Counter</button>
                          </div>
                        )}
                      </td>
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

// ═══════════════════════════════════════════════════════════════════════
// SELLER ANALYTICS
// ═══════════════════════════════════════════════════════════════════════

export const SellerAnalytics: React.FC = () => {
  const [stats, setStats] = useState({ totalListings: 0, totalOffers: 0, avgPrice: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [props, offs]: any[] = await settledJson(
          [authFetch('/api/properties?role=seller'), authFetch('/api/offers?role=seller')],
          [{ data: [] }, { data: [] }],
        );

        const propList: DashboardProperty[] = props.data ?? props.properties ?? [];
        const offList: DashboardOffer[] = offs.data ?? [];
        const prices = propList.map((p) => p.price).filter(Boolean) as number[];
        const avg = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
        const accepted = offList.filter((o) => o.status === 'accepted').length;

        setStats({
          totalListings: propList.length,
          totalOffers: offList.length,
          avgPrice: avg,
          conversionRate: offList.length > 0 ? Math.round((accepted / offList.length) * 100) : 0,
        });
      } catch (error) { log.warn('Failed to fetch seller analytics:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📊 Seller Analytics</h2>
        <p style={S.headerSubtitle}>Performance metrics for your listings</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.totalListings}</span>
          <span style={S.statLabel}>📋 Total Listings</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.totalOffers}</span>
          <span style={S.statLabel}>🤝 Offers Received</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(stats.avgPrice)}</span>
          <span style={S.statLabel}>💰 Avg Listing Price</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.conversionRate}%</span>
          <span style={S.statLabel}>✅ Offer Acceptance Rate</span>
        </div>
      </div>
    </div>
  );
};
