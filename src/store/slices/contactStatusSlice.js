import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = '/api/owners';

export const loadContactStatuses = createAsyncThunk(
  'contactStatus/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/contact-statuses`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load contact statuses');
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'contactStatus/update',
  async ({ ownerId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE}/${ownerId}/contact-status`,
        { contactStatus: status }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update contact status');
    }
  }
);

export const recordContact = createAsyncThunk(
  'contactStatus/record',
  async ({ ownerId, type, outcome, notes, nextFollowUp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/${ownerId}/record-contact`,
        { type, outcome, notes, nextFollowUp }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to record contact');
    }
  }
);

const initialState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  filter: 'all',
  sort: 'last-contact',
};

const contactStatusSlice = createSlice({
  name: 'contactStatus',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadContactStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadContactStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.byId = {};
        state.allIds = [];
        action.payload.forEach((status) => {
          state.byId[status._id] = status;
          state.allIds.push(status._id);
        });
      })
      .addCase(loadContactStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const { _id, ...updates } = action.payload;
        if (state.byId[_id]) {
          state.byId[_id] = { ...state.byId[_id], ...updates };
        }
      })
      .addCase(recordContact.fulfilled, (state, action) => {
        const { _id, ...updates } = action.payload;
        if (state.byId[_id]) {
          state.byId[_id] = { ...state.byId[_id], ...updates };
        }
      });
  },
});

export const { setFilter, setSort, clearError } = contactStatusSlice.actions;

export const selectContactStatusById = (state, id) => state.contactStatus.byId[id];

export const selectAllContactStatuses = (state) =>
  state.contactStatus.allIds.map((id) => state.contactStatus.byId[id]);

export const selectFilteredContactStatuses = (state) => {
  const allStatuses = selectAllContactStatuses(state);
  const filter = state.contactStatus.filter;

  if (filter === 'all') return allStatuses;
  return allStatuses.filter((status) => status.contactStatus === filter);
};

export const selectContactStatusLoading = (state) => state.contactStatus.loading;
export const selectContactStatusError = (state) => state.contactStatus.error;

export const selectOverdueFollowUps = (state) => {
  const now = new Date();
  return selectAllContactStatuses(state).filter(
    (status) =>
      status.nextFollowUpDate &&
      new Date(status.nextFollowUpDate) < now &&
      ['follow-up-due', 'contacted'].includes(status.contactStatus)
  );
};

export const selectNeverContacted = (state) =>
  selectAllContactStatuses(state).filter((s) => s.contactStatus === 'never-contacted');

export default contactStatusSlice.reducer;
