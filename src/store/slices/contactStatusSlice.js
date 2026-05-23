import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch } from '../../utils/authFetch';

const API_BASE = '/api/owners';

const readJson = async (response, fallbackMessage) => {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || fallbackMessage;
    throw new Error(message);
  }

  return payload;
};

export const loadContactStatuses = createAsyncThunk(
  'contactStatus/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/contact-statuses`);
      return await readJson(response, 'Failed to load contact statuses');
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load contact statuses');
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'contactStatus/update',
  async ({ ownerId, status }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/${ownerId}/contact-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactStatus: status }),
      });
      return await readJson(response, 'Failed to update contact status');
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update contact status');
    }
  }
);

export const recordContact = createAsyncThunk(
  'contactStatus/record',
  async ({ ownerId, type, outcome, notes, nextFollowUp }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/${ownerId}/record-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, outcome, notes, nextFollowUp }),
      });
      return await readJson(response, 'Failed to record contact');
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to record contact');
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
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadContactStatuses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadContactStatuses.fulfilled, (state, action) => {
        state.loading = false;
        const entities = Object.fromEntries(action.payload.map(status => [status._id, status]));
        state.byId = entities;
        state.allIds = action.payload.map(status => status._id);
      })
      .addCase(loadContactStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const { _id, ...updates } = action.payload;
        if (state.allIds.includes(_id)) {
          state.byId = Object.fromEntries(
            Object.entries(state.byId).map(([entityId, entity]) =>
              entityId === _id ? [entityId, { ...entity, ...updates }] : [entityId, entity]
            )
          );
        }
      })
      .addCase(recordContact.fulfilled, (state, action) => {
        const { _id, ...updates } = action.payload;
        if (state.allIds.includes(_id)) {
          state.byId = Object.fromEntries(
            Object.entries(state.byId).map(([entityId, entity]) =>
              entityId === _id ? [entityId, { ...entity, ...updates }] : [entityId, entity]
            )
          );
        }
      });
  },
});

export const { setFilter, setSort, clearError } = contactStatusSlice.actions;

export const selectContactStatusById = (state, id) =>
  Object.values(state.contactStatus.byId).find(status => status?._id === id);

export const selectAllContactStatuses = state => Object.values(state.contactStatus.byId);

export const selectFilteredContactStatuses = state => {
  const allStatuses = selectAllContactStatuses(state);
  const filter = state.contactStatus.filter;

  if (filter === 'all') return allStatuses;
  return allStatuses.filter(status => status.contactStatus === filter);
};

export const selectContactStatusLoading = state => state.contactStatus.loading;
export const selectContactStatusError = state => state.contactStatus.error;

export const selectOverdueFollowUps = state => {
  const now = new Date();
  return selectAllContactStatuses(state).filter(
    status =>
      status.nextFollowUpDate &&
      new Date(status.nextFollowUpDate) < now &&
      ['follow-up-due', 'contacted'].includes(status.contactStatus)
  );
};

export const selectNeverContacted = state =>
  selectAllContactStatuses(state).filter(s => s.contactStatus === 'never-contacted');

export default contactStatusSlice.reducer;
