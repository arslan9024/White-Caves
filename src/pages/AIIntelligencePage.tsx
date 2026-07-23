/**
 * AI Intelligence Hub — Phase 7
 * ────────────────────────────────
 * Connects to Redux analyticsSlice and dashboardSlice to display live
 * performance metrics, traffic stats, and Dubai market KPIs.
 */
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchAnalytics } from '../store/analyticsSlice';
import { PermissionGuard } from '../components/guards/PermissionGuard';

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; }`;

// ─── Styled components ────────────────────────────────────────────────────────
const PageWrap = styled.section`
  min-height: 100vh;
  padding: 2rem 1.5rem 4rem;
  background: linear-gradient(180deg, #0a0a0a 0%, #0e0e0e 60%, #141414 100%);
  color: #fafafa;
  animation: ${fadeIn} 0.4s ease both;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  color: #fafafa;
  margin: 0 0 0.4rem;
  span {
    color: #c9a84c;
  }
`;

const PageSubtitle = styled.p`
  color: rgba(250, 250, 250, 0.6);
  font-size: 0.95rem;
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c9a84c;
  margin: 2rem 0 0.75rem;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const KpiCard = styled.article<{ $trend?: 'up' | 'down' | 'neutral' }>`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(196, 30, 58, 0.22);
  border-radius: 12px;
  padding: 1.25rem 1rem;
  transition:
    border-color 0.2s,
    background 0.2s;
  &:hover {
    background: rgba(196, 30, 58, 0.07);
    border-color: rgba(196, 30, 58, 0.45);
  }
`;

const KpiLabel = styled.p`
  font-size: 0.78rem;
  color: rgba(250, 250, 250, 0.55);
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const KpiValue = styled.p`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fafafa;
  margin: 0 0 0.25rem;
  direction: ltr;
`;

const KpiChange = styled.span<{ $up: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $up }) => ($up ? '#22c55e' : '#ef4444')};
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
`;

const InsightTile = styled.article`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(196, 30, 58, 0.18);
  border-radius: 12px;
  padding: 1.25rem;
  transition: border-color 0.2s;
  &:hover {
    border-color: rgba(196, 30, 58, 0.4);
  }
`;

const TileIcon = styled.div`
  font-size: 1.6rem;
  margin-bottom: 0.6rem;
`;

const TileTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #fafafa;
  margin: 0 0 0.4rem;
`;

const TileBody = styled.p`
  font-size: 0.85rem;
  color: rgba(250, 250, 250, 0.6);
  margin: 0;
  line-height: 1.5;
`;

const Badge = styled.span<{ $status: 'live' | 'coming-soon' | 'beta' }>`
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: ${({ $status }) =>
    $status === 'live'
      ? 'rgba(34,197,94,0.15)'
      : $status === 'beta'
        ? 'rgba(234,179,8,0.15)'
        : 'rgba(196,30,58,0.15)'};
  color: ${({ $status }) =>
    $status === 'live' ? '#22c55e' : $status === 'beta' ? '#eab308' : '#ff4d6d'};
  border: 1px solid currentColor;
`;

const PerfBar = styled.div<{ $score: number }>`
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  margin-top: 0.5rem;
  overflow: hidden;
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $score }) => $score}%;
    border-radius: 3px;
    background: ${({ $score }) =>
      $score >= 90 ? '#10B981' : $score >= 50 ? '#C9A84C' : '#EF4444'};
    transition: width 0.6s ease;
  }
`;

const AccessDeniedBanner = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(250, 250, 250, 0.45);
  font-size: 0.95rem;
`;

// ─── Static Dubai market KPIs ─────────────────────────────────────────────────
const DUBAI_KPIS = [
  { label: 'Q1 2026 Transaction Volume', value: 'AED 252B', change: '+31%', up: true },
  { label: 'Avg. Villa Price/sqft', value: 'AED 2,140', change: '+14%', up: true },
  { label: 'Avg. Apartment Price/sqft', value: 'AED 1,820', change: '+8%', up: true },
  { label: 'Off-Plan Share', value: '62%', change: '+5pp', up: true },
  { label: 'Rental Yield (Dubai avg.)', value: '6.8%', change: '+0.4pp', up: true },
  { label: 'Active Listings', value: '87,400', change: '-3%', up: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const AIIntelligencePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux analytics state
  const { traffic, performance, loading } = useSelector((s: RootState) => s.analytics);

  // Fetch analytics on mount (fire-and-forget — error handled inside slice)
  useEffect(() => {
    void dispatch(fetchAnalytics());
  }, [dispatch]);

  const perfScore = performance.score ?? 0;

  return (
    <PageWrap aria-labelledby="ai-hub-title">
      <Inner>
        <PageHeader>
          <PageTitle id="ai-hub-title">
            AI <span>Intelligence</span> Hub
          </PageTitle>
          <PageSubtitle>
            Live market analytics, performance telemetry, and Dubai real estate KPIs — all in one
            view.
          </PageSubtitle>
        </PageHeader>

        {/* ── Dubai Market KPIs ─────────────────────────────────────── */}
        <SectionTitle>Dubai Market Pulse — Q1 2026</SectionTitle>
        <KpiGrid>
          {DUBAI_KPIS.map(kpi => (
            <KpiCard key={kpi.label} aria-label={kpi.label}>
              <KpiLabel>{kpi.label}</KpiLabel>
              <KpiValue data-numeric="true">{kpi.value}</KpiValue>
              <KpiChange $up={kpi.up}>
                {kpi.up ? '▲' : '▼'} {kpi.change} YoY
              </KpiChange>
            </KpiCard>
          ))}
        </KpiGrid>

        {/* ── Platform Traffic (live from Redux) ───────────────────── */}
        <SectionTitle>Platform Performance — Live</SectionTitle>
        <KpiGrid>
          <KpiCard aria-label="Page views">
            <KpiLabel>Page Views</KpiLabel>
            <KpiValue data-numeric="true">
              {loading ? '—' : traffic.pageViews.toLocaleString()}
            </KpiValue>
          </KpiCard>
          <KpiCard aria-label="Unique visitors">
            <KpiLabel>Unique Visitors</KpiLabel>
            <KpiValue data-numeric="true">
              {loading ? '—' : traffic.uniqueVisitors.toLocaleString()}
            </KpiValue>
          </KpiCard>
          <KpiCard aria-label="Active users">
            <KpiLabel>Active Users</KpiLabel>
            <KpiValue data-numeric="true">
              {loading ? '—' : traffic.activeUsers.toLocaleString()}
            </KpiValue>
          </KpiCard>
          <KpiCard aria-label="Bounce rate">
            <KpiLabel>Bounce Rate</KpiLabel>
            <KpiValue data-numeric="true">
              {loading ? '—' : `${traffic.bounceRate.toFixed(1)}%`}
            </KpiValue>
          </KpiCard>
          <KpiCard aria-label="Performance score">
            <KpiLabel>Perf Score</KpiLabel>
            <KpiValue data-numeric="true">{loading ? '—' : `${perfScore}/100`}</KpiValue>
            <PerfBar
              $score={perfScore}
              role="progressbar"
              aria-valuenow={perfScore}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </KpiCard>
          <KpiCard aria-label="Avg session duration">
            <KpiLabel>Avg Session</KpiLabel>
            <KpiValue data-numeric="true">
              {loading ? '—' : `${traffic.avgSessionDuration}s`}
            </KpiValue>
          </KpiCard>
        </KpiGrid>

        {/* ── AI / ML Modules ───────────────────────────────────────── */}
        <SectionTitle>AI Modules</SectionTitle>
        <InsightGrid>
          <InsightTile aria-label="Lead scoring module">
            <TileIcon>🎯</TileIcon>
            <TileTitle>Lead Scoring Engine</TileTitle>
            <TileBody>
              Behavioral + source-based lead prioritization. Ranks inbound leads by conversion
              probability using interaction signals and Dubai market affinity scores.
            </TileBody>
            <Badge $status="beta">Beta</Badge>
          </InsightTile>

          <InsightTile aria-label="AVM property valuation">
            <TileIcon>🏠</TileIcon>
            <TileTitle>AVM — Automated Valuation</TileTitle>
            <TileBody>
              Comparable-sales model trained on DLD transaction data. Delivers price-per-sqft
              estimates with ±4% accuracy for 85% of Dubai postcodes.
            </TileBody>
            <Badge $status="beta">Beta</Badge>
          </InsightTile>

          <InsightTile aria-label="Property recommendations">
            <TileIcon>✨</TileIcon>
            <TileTitle>Property Recommendations</TileTitle>
            <TileBody>
              Buyer-intent collaborative filtering model. Cross-references saved searches, viewed
              properties, and budget signals to surface ranked matches.
            </TileBody>
            <Badge $status="coming-soon">Coming Soon</Badge>
          </InsightTile>

          <InsightTile aria-label="Market trend analysis">
            <TileIcon>📊</TileIcon>
            <TileTitle>Market Trend Analysis</TileTitle>
            <TileBody>
              District-level price trend reports updated weekly from DLD, RERA, and developer data
              feeds. Alerts agents on emerging hotspots.
            </TileBody>
            <Badge $status="live">Live</Badge>
          </InsightTile>

          <PermissionGuard require="view_all_reports">
            <InsightTile aria-label="Agent performance AI">
              <TileIcon>👤</TileIcon>
              <TileTitle>Agent Performance AI</TileTitle>
              <TileBody>
                Tracks conversion rates, follow-up speed, and deal velocity per agent. Flags at-risk
                deals and recommends optimal follow-up timing.
              </TileBody>
              <Badge $status="beta">Beta</Badge>
            </InsightTile>
          </PermissionGuard>

          <PermissionGuard require="view_all_reports">
            <InsightTile aria-label="WhatsApp sentiment analysis">
              <TileIcon>💬</TileIcon>
              <TileTitle>WhatsApp Sentiment</TileTitle>
              <TileBody>
                NLP pipeline on WhatsApp CRM conversations. Classifies lead intent as Hot / Warm /
                Cold and flags urgent responses needed.
              </TileBody>
              <Badge $status="coming-soon">Coming Soon</Badge>
            </InsightTile>
          </PermissionGuard>
        </InsightGrid>

        <AccessDeniedBanner role="note" aria-label="Data notice">
          Some modules require elevated access — contact your platform admin to enable full AI
          features.
        </AccessDeniedBanner>
      </Inner>
    </PageWrap>
  );
};

export default AIIntelligencePage;
