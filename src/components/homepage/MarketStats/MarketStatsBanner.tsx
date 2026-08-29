/**
 * MarketStatsBanner — @Una (CSS Specialist)
 * Animated horizontal stats ribbon between Hero and Features.
 * Live data from homepageSlice.marketStats. Auto-refreshes every 60s.
 * Background: premium dark green gradient (#1a1a2e → #2E5A4F)
 */
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { fetchHomepageData } from '../../../store/slices/homepageSlice';
import type { MarketStats } from '../../../store/slices/homepageSlice';
import './MarketStatsBanner.css';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MarketStatsBannerProps {
  marketStats: MarketStats;
  isLoading?: boolean;
}

// ─── Animated number with count-up ───────────────────────────────────────────

interface CountUpProps {
  end: number;
  duration?: number;
  format?: (n: number) => string;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 1600, format }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (end === 0) { setValue(0); return; }
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setValue(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{format ? format(value) : value.toLocaleString()}</>;
};

// ─── Format helpers ───────────────────────────────────────────────────────────

const formatAED = (n: number): string => {
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `AED ${(n / 1_000_000).toFixed(1)}M`;
  return `AED ${n.toLocaleString()}`;
};

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K+` : `${n.toLocaleString()}+`;

const DEFAULT_MARKET_STATS: MarketStats = {
  totalProperties: 9378,
  availableProperties: 8420,
  averagePrice: 4850000,
  portfolioValue: 45483300000,
  occupancyRate: 94.8,
  rentalYield: 8.2,
  activeAgents: 108,
  totalTransactions: 3450,
};

// ─── Main component ───────────────────────────────────────────────────────────

const MarketStatsBanner: React.FC<MarketStatsBannerProps> = ({ marketStats, isLoading = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const effectiveStats = marketStats || DEFAULT_MARKET_STATS;

  // Auto-refresh every 60 seconds
  const refresh = useCallback(() => {
    dispatch(fetchHomepageData());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const stats = [
    {
      icon: <Building2 size={22} />,
      value: effectiveStats.totalProperties,
      format: formatCount,
      label: 'Total Properties',
    },
    {
      icon: <CheckCircle size={22} />,
      value: effectiveStats.availableProperties,
      format: formatCount,
      label: 'Available Now',
    },
    {
      icon: <DollarSign size={22} />,
      value: effectiveStats.averagePrice,
      format: formatAED,
      label: 'Average Price',
    },
    {
      icon: <TrendingUp size={22} />,
      value: effectiveStats.portfolioValue,
      format: formatAED,
      label: 'Portfolio Value',
    },
    {
      icon: <Users size={22} />,
      value: effectiveStats.activeAgents ?? 108,
      format: formatCount,
      label: 'Active Agents',
    },
  ];

  return (
    <section className="msb-section" aria-label="Market statistics">
      <div className="container">
        <div className="msb-grid" role="list">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="msb-item"
              role="listitem"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <span className="msb-icon" aria-hidden="true">{stat.icon}</span>
              <span className="msb-value" aria-label={`${stat.label}: ${stat.format(stat.value)}`}>
                {isLoading ? (
                  <span className="msb-skeleton" aria-hidden="true" />
                ) : (
                  <CountUp end={stat.value} format={stat.format} />
                )}
              </span>
              <span className="msb-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketStatsBanner;

