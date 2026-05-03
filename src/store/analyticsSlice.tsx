import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import { authFetch } from '../utils/authFetch';
import { getErrorMessage } from '../constants';
// TASK-019 / Phase 27: Track homepage search lead events in analytics
import { createSearchLead } from './slices/searchLeadsSlice';

interface WebVital {
  value: number;
  rating: string;
  timestamp: number;
}

interface WebVitals {
  lcp: WebVital | null;
  fid: WebVital | null;
  cls: WebVital | null;
  fcp: WebVital | null;
  ttfb: WebVital | null;
  inp: WebVital | null;
  [key: string]: WebVital | null;
}

interface TrafficData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  activeUsers: number;
}

interface PerformanceData {
  score: number;
  status: string;
  lastUpdated: number | null;
}

interface AnalyticsEvent {
  [key: string]: unknown;
  timestamp: number;
}

interface AnalyticsState {
  webVitals: WebVitals;
  traffic: TrafficData;
  performance: PerformanceData;
  recentEvents: AnalyticsEvent[];
  loading: boolean;
  error: string | null;
  // TASK-019 / Phase 27: Homepage search lead metrics
  homepageSearchLeads: number;
  homepageSearchLeadIds: string[];
}

const initialState: AnalyticsState = {
  webVitals: {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null,
  },
  traffic: {
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    activeUsers: 0,
  },
  performance: {
    score: 0,
    status: 'unknown',
    lastUpdated: null,
  },
  recentEvents: [],
  loading: false,
  error: null,
  // TASK-019 / Phase 27
  homepageSearchLeads: 0,
  homepageSearchLeadIds: [],
};

interface FetchAnalyticsPayload {
  traffic?: Partial<TrafficData>;
  webVitals?: Partial<WebVitals>;
}

export const fetchAnalytics = createAsyncThunk<
  FetchAnalyticsPayload,
  void,
  { rejectValue: string }
>('analytics/fetchAnalytics', async (_, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/dashboard/summary');
    if (!response.ok) throw new Error('Failed to fetch analytics');
    const raw = await response.json();
    return raw.data || raw;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch analytics'));
  }
});

function calculatePerformanceScore(vitals: WebVitals): number {
  const scores: number[] = [];

  if (vitals.lcp?.value) {
    if (vitals.lcp.value <= 2500) scores.push(100);
    else if (vitals.lcp.value <= 4000) scores.push(50);
    else scores.push(0);
  }

  if (vitals.fid?.value) {
    if (vitals.fid.value <= 100) scores.push(100);
    else if (vitals.fid.value <= 300) scores.push(50);
    else scores.push(0);
  }

  if (vitals.cls?.value) {
    if (vitals.cls.value <= 0.1) scores.push(100);
    else if (vitals.cls.value <= 0.25) scores.push(50);
    else scores.push(0);
  }

  if (vitals.fcp?.value) {
    if (vitals.fcp.value <= 1800) scores.push(100);
    else if (vitals.fcp.value <= 3000) scores.push(50);
    else scores.push(0);
  }

  if (vitals.ttfb?.value) {
    if (vitals.ttfb.value <= 800) scores.push(100);
    else if (vitals.ttfb.value <= 1800) scores.push(50);
    else scores.push(0);
  }

  if (vitals.inp?.value) {
    if (vitals.inp.value <= 200) scores.push(100);
    else if (vitals.inp.value <= 500) scores.push(50);
    else scores.push(0);
  }

  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function getPerformanceStatus(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateWebVital: (
      state,
      action: PayloadAction<{ name: string; value: number; rating: string }>
    ) => {
      const { name, value, rating } = action.payload;
      const metricMap: Record<string, keyof WebVitals> = {
        LCP: 'lcp',
        FID: 'fid',
        CLS: 'cls',
        FCP: 'fcp',
        TTFB: 'ttfb',
        INP: 'inp',
      };
      // eslint-disable-next-line security/detect-object-injection
      const key = (metricMap[name] || name.toLowerCase()) as keyof WebVitals;
      if (key in state.webVitals) {
        // eslint-disable-next-line security/detect-object-injection
        state.webVitals[key] = { value, rating, timestamp: Date.now() };
      }
      state.performance.lastUpdated = Date.now();
      state.performance.score = calculatePerformanceScore(state.webVitals);
      state.performance.status = getPerformanceStatus(state.performance.score);
    },
    recordPageView: state => {
      state.traffic.pageViews += 1;
      state.traffic.activeUsers = Math.max(1, state.traffic.activeUsers);
    },
    updateTraffic: (state, action: PayloadAction<Partial<TrafficData>>) => {
      state.traffic = { ...state.traffic, ...action.payload };
    },
    addEvent: (state, action: PayloadAction<Omit<AnalyticsEvent, 'timestamp'>>) => {
      state.recentEvents.unshift({
        ...action.payload,
        timestamp: Date.now(),
      });
      if (state.recentEvents.length > 50) {
        state.recentEvents = state.recentEvents.slice(0, 50);
      }
    },
    resetAnalytics: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAnalytics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.traffic) {
          Object.assign(state.traffic, action.payload.traffic);
        }
        if (action.payload.webVitals) {
          Object.assign(state.webVitals, action.payload.webVitals);
        }
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })
      .addCase(logout, () => initialState)
      // TASK-019 / Phase 27: Record homepage search lead events in analytics
      .addCase(createSearchLead.fulfilled, (state, action) => {
        state.homepageSearchLeads += 1;
        if (action.payload.id) {
          state.homepageSearchLeadIds.push(action.payload.id);
          // Cap at 100 IDs to prevent memory bloat
          if (state.homepageSearchLeadIds.length > 100) {
            state.homepageSearchLeadIds = state.homepageSearchLeadIds.slice(-100);
          }
        }
        // Also push to the general recentEvents stream
        state.recentEvents.unshift({
          type: 'homepage_search_lead',
          leadId: action.payload.id,
          source: 'homepage_search',
          timestamp: Date.now(),
        });
        if (state.recentEvents.length > 50) {
          state.recentEvents = state.recentEvents.slice(0, 50);
        }
      });
  },
});

export const { updateWebVital, recordPageView, updateTraffic, addEvent, resetAnalytics } =
  analyticsSlice.actions;

// TASK-019 / Phase 27: Selectors for homepage search lead analytics
import type { RootState } from './store';
export const selectHomepageSearchLeadCount = (state: RootState) =>
  state.analytics.homepageSearchLeads;
export const selectHomepageSearchLeadIds = (state: RootState) =>
  state.analytics.homepageSearchLeadIds;

export default analyticsSlice.reducer;
