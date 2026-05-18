import React, { useEffect, useMemo, useState } from 'react';
import { ReactReduxContext } from 'react-redux';
import { selectSearchLeadCount } from '../../../store/slices/searchLeadsSlice';
import type { OverviewTabProps } from './types';
import { colors } from '../../../styles/theme/colors';
import './TabStyles.css';
import type { RootState } from '../../../store/store';
import { Skeleton } from '../../ui/Skeleton';

const PRIMARY_COLOR: string = colors.primary;

interface AnimatedMetricProps {
  value: number;
  formatter?: (value: number) => string;
}

const formatPlainNumber = (value: number): string =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

const Sparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const points = useMemo(() => {
    if (values.length <= 1) return '0,20 100,20';
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    const range = highest - lowest || 1;

    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 100;
        const y = 24 - ((value - lowest) / range) * 20;
        return `${x},${y}`;
      })
      .join(' ');
  }, [values]);

  return (
    <svg
      className="kpi-tile__sparkline"
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" points={points} />
    </svg>
  );
};

const AnimatedMetric: React.FC<AnimatedMetricProps> = ({
  value,
  formatter = formatPlainNumber,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    let startTime = 0;
    const duration = 800;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <>{formatter(displayValue)}</>;
};

const OverviewTab: React.FC<OverviewTabProps> = ({ data, loading, onQuickAction }) => {
  const reduxContext = React.useContext(ReactReduxContext);
  const homepageSearchLeads = reduxContext?.store
    ? selectSearchLeadCount(reduxContext.store.getState() as RootState)
    : 0;

  if (loading) {
    return (
      <div className="overview-tab">
        <div className="kpi-grid" role="status" aria-label="Loading dashboard overview">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} variant="card" height={100} />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Properties',
      value: data?.totalProperties ?? 0,
      formatter: formatPlainNumber,
      icon: '🏠',
      color: PRIMARY_COLOR,
      change: '+12%',
      trend: [54, 58, 63, 68, 73, 77, 82],
    },
    {
      title: 'Active Agents',
      value: data?.activeAgents ?? 0,
      formatter: formatPlainNumber,
      icon: '👥',
      color: '#2563EB',
      change: '+5%',
      trend: [8, 9, 10, 11, 12, 13, 15],
    },
    {
      title: 'Monthly Revenue',
      value: data?.monthlyRevenue ?? 0,
      formatter: (value: number) =>
        new Intl.NumberFormat('en-AE', {
          style: 'currency',
          currency: 'AED',
          maximumFractionDigits: 0,
        }).format(value),
      icon: '💰',
      color: PRIMARY_COLOR,
      change: '+18%',
      trend: [1.4, 1.8, 1.7, 2.0, 2.2, 2.35, 2.5],
    },
    {
      title: 'WhatsApp Leads',
      value: data?.whatsappLeads ?? 0,
      formatter: formatPlainNumber,
      icon: '💬',
      color: '#25D366',
      change: '+25%',
      trend: [16, 18, 23, 26, 31, 39, 45],
    },
    {
      title: 'UAE Pass Users',
      value: data?.uaepassUsers ?? 0,
      formatter: formatPlainNumber,
      icon: '🆔',
      color: '#ce1126',
      change: '+15%',
      trend: [28, 35, 42, 51, 61, 72, 80],
    },
    {
      title: 'Chatbot Chats',
      value: data?.chatbotConversations ?? 0,
      formatter: formatPlainNumber,
      icon: '🤖',
      color: '#8B5CF6',
      change: '+30%',
      trend: [120, 156, 189, 220, 258, 288, 320],
    },
    {
      title: 'Homepage Searches',
      value: homepageSearchLeads,
      formatter: formatPlainNumber,
      icon: '🌐',
      color: PRIMARY_COLOR,
      change: homepageSearchLeads > 0 ? `+${homepageSearchLeads}` : '—',
      trend: [0, 1, 1, 2, 3, 4, homepageSearchLeads || 4],
    },
  ];

  const quickActions = [
    { id: 1, title: 'Add Property', icon: '➕', action: 'addProperty', color: '#22C55E' },
    { id: 2, title: 'Assign Agent', icon: '👤', action: 'assignAgent', color: '#3B82F6' },
    { id: 3, title: 'Generate Report', icon: '📊', action: 'generateReport', color: '#8B5CF6' },
    { id: 4, title: 'Train Chatbot', icon: '🤖', action: 'trainChatbot', color: '#F59E0B' },
    {
      id: 5,
      title: 'WhatsApp Broadcast',
      icon: '📢',
      action: 'whatsappBroadcast',
      color: '#25D366',
    },
    { id: 6, title: 'UAE Pass Users', icon: '🆔', action: 'viewUaePassUsers', color: '#ce1126' },
  ];

  const recentActivities = data?.recentActivities || [];

  return (
    <div className="overview-tab">
      <section className="overview-hero">
        <div>
          <span className="tab-section-kicker">Executive snapshot</span>
          <h2>Performance at a glance</h2>
          <p>
            Track live portfolio health, team activity, and the channels driving pipeline quality.
          </p>
        </div>
        <div className="overview-hero__meta">
          <span>Live view</span>
          <strong>Updated from CRM data</strong>
        </div>
      </section>

      <div className="kpi-grid">
        {stats.map(stat => (
          <article
            key={stat.title}
            className="kpi-tile"
            style={{ '--accent-color': stat.color } as React.CSSProperties}
          >
            <div className="kpi-tile__header">
              <span className="kpi-tile__icon">{stat.icon}</span>
              <span
                className={`kpi-tile__change ${stat.change.startsWith('+') ? 'positive' : 'neutral'}`}
              >
                {stat.change}
              </span>
            </div>
            <div className="kpi-tile__value">
              <AnimatedMetric value={stat.value} formatter={stat.formatter} />
            </div>
            <div className="kpi-tile__title">{stat.title}</div>
            <Sparkline values={stat.trend} color={stat.color} />
          </article>
        ))}
      </div>

      <div className="quick-actions-section">
        <div className="tab-section-heading">
          <div>
            <span className="tab-section-kicker">Actions</span>
            <h3>Quick Actions</h3>
          </div>
          <p>Shortcuts for the most common portfolio and team operations.</p>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map(action => (
            <button
              key={action.id}
              className="quick-action-btn"
              style={{ '--action-color': action.color } as React.CSSProperties}
              onClick={() => onQuickAction?.(action.action)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-row">
        <div className="chart-card">
          <div className="tab-section-heading">
            <div>
              <span className="tab-section-kicker">Revenue</span>
              <h3>Revenue Trend (2024)</h3>
            </div>
            <p>Month-over-month performance in AED millions.</p>
          </div>
          <div className="simple-chart">
            {[1.2, 1.8, 1.5, 2.2, 1.9, 2.5, 2.1, 2.8, 2.4, 3.0, 2.7, 3.2].map((value, i) => (
              <div key={`revenue-month-${i}`} className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{
                    height: `${(value / 3.5) * 100}%`,
                    background: `linear-gradient(to top, ${PRIMARY_COLOR}, #F87171)`,
                  }}
                />
                <span className="chart-label">
                  {(['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as const)[i]}
                </span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span>Revenue in Millions (AED)</span>
          </div>
        </div>

        <div className="chart-card">
          <div className="tab-section-heading">
            <div>
              <span className="tab-section-kicker">Mix</span>
              <h3>Property Distribution</h3>
            </div>
            <p>Portfolio weighting by asset class.</p>
          </div>
          <div className="pie-chart-placeholder">
            <div className="pie-segments">
              <div
                className="pie-segment"
                style={
                  {
                    '--segment-color': PRIMARY_COLOR,
                    '--segment-percent': '45%',
                  } as React.CSSProperties
                }
              >
                <span>Apartments 45%</span>
              </div>
              <div
                className="pie-segment"
                style={
                  {
                    '--segment-color': '#3B82F6',
                    '--segment-percent': '25%',
                  } as React.CSSProperties
                }
              >
                <span>Villas 25%</span>
              </div>
              <div
                className="pie-segment"
                style={
                  {
                    '--segment-color': '#22C55E',
                    '--segment-percent': '15%',
                  } as React.CSSProperties
                }
              >
                <span>Townhouses 15%</span>
              </div>
              <div
                className="pie-segment"
                style={
                  {
                    '--segment-color': '#F59E0B',
                    '--segment-percent': '10%',
                  } as React.CSSProperties
                }
              >
                <span>Commercial 10%</span>
              </div>
              <div
                className="pie-segment"
                style={
                  { '--segment-color': '#8B5CF6', '--segment-percent': '5%' } as React.CSSProperties
                }
              >
                <span>Land 5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="activity-section">
        <div className="tab-section-heading">
          <div>
            <span className="tab-section-kicker">Timeline</span>
            <h3>Recent Activity</h3>
          </div>
          <p>Latest operational signals across properties, leads, and contracts.</p>
        </div>
        <div className="activity-timeline">
          {recentActivities.map((activity, index) => (
            <div
              key={`activity-${index}-${activity.timestamp}`}
              className={`activity-item ${activity.type}`}
            >
              <div className="activity-dot"></div>
              <div className="activity-content">
                <strong>{activity.title}</strong>
                <p>{activity.description}</p>
                <small>
                  {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ''}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverviewTab);
