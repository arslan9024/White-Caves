import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
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
};

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/analytics/overview');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateWebVital: (state, action) => {
      const { name, value, rating } = action.payload;
      const metricMap = {
        'LCP': 'lcp',
        'FID': 'fid',
        'CLS': 'cls',
        'FCP': 'fcp',
        'TTFB': 'ttfb',
        'INP': 'inp',
      };
      const key = metricMap[name] || name.toLowerCase();
      if (state.webVitals.hasOwnProperty(key)) {
        state.webVitals[key] = { value, rating, timestamp: Date.now() };
      }
      state.performance.lastUpdated = Date.now();
      state.performance.score = calculatePerformanceScore(state.webVitals);
      state.performance.status = getPerformanceStatus(state.performance.score);
    },
    recordPageView: (state) => {
      state.traffic.pageViews += 1;
      state.traffic.activeUsers = Math.max(1, state.traffic.activeUsers);
    },
    updateTraffic: (state, action) => {
      state.traffic = { ...state.traffic, ...action.payload };
    },
    addEvent: (state, action) => {
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.traffic) {
          state.traffic = { ...state.traffic, ...action.payload.traffic };
        }
        if (action.payload.webVitals) {
          state.webVitals = { ...state.webVitals, ...action.payload.webVitals };
        }
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

function calculatePerformanceScore(vitals) {
  const scores = [];
  
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

function getPerformanceStatus(score) {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
}

export const { updateWebVital, recordPageView, updateTraffic, addEvent, resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
