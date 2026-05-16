import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import contactStatusReducer, {
  loadContactStatuses,
  updateContactStatus,
  selectContactStatusError,
  setFilter,
  selectFilteredContactStatuses,
} from './contactStatusSlice';

const mockAuthFetch = vi.fn();

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args) => mockAuthFetch(...args),
}));

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(payload),
  };
}

describe('contactStatusSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads contact statuses into byId/allIds', async () => {
    mockAuthFetch.mockResolvedValueOnce(
      jsonResponse([
        { _id: 'o1', contactStatus: 'contacted' },
        { _id: 'o2', contactStatus: 'never-contacted' },
      ])
    );

    const store = configureStore({ reducer: { contactStatus: contactStatusReducer } });
    await store.dispatch(loadContactStatuses());

    const state = store.getState().contactStatus;
    expect(state.allIds).toEqual(['o1', 'o2']);
    expect(state.byId.o1.contactStatus).toBe('contacted');
  });

  it('updates an existing contact status via thunk payload', async () => {
    mockAuthFetch
      .mockResolvedValueOnce(jsonResponse([{ _id: 'o1', contactStatus: 'contacted' }]))
      .mockResolvedValueOnce(jsonResponse({ _id: 'o1', contactStatus: 'follow-up-due' }));

    const store = configureStore({ reducer: { contactStatus: contactStatusReducer } });
    await store.dispatch(loadContactStatuses());
    await store.dispatch(updateContactStatus({ ownerId: 'o1', status: 'follow-up-due' }));

    expect(store.getState().contactStatus.byId.o1.contactStatus).toBe('follow-up-due');
  });

  it('selector filters by selected status', () => {
    const rootState = {
      contactStatus: contactStatusReducer(undefined, { type: 'unknown' }),
    };

    const seeded = {
      contactStatus: {
        ...rootState.contactStatus,
        byId: {
          o1: { _id: 'o1', contactStatus: 'contacted' },
          o2: { _id: 'o2', contactStatus: 'never-contacted' },
        },
        allIds: ['o1', 'o2'],
      },
    };

    const filteredState = {
      contactStatus: contactStatusReducer(seeded.contactStatus, setFilter('contacted')),
    };

    const filtered = selectFilteredContactStatuses(filteredState);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]._id).toBe('o1');
  });

  it('stores rejected error message when API responds non-OK', async () => {
    mockAuthFetch.mockResolvedValueOnce(jsonResponse({ error: 'Backend exploded' }, 500));

    const store = configureStore({ reducer: { contactStatus: contactStatusReducer } });
    await store.dispatch(loadContactStatuses());

    const root = store.getState();
    expect(selectContactStatusError(root)).toBe('Backend exploded');
  });
});
