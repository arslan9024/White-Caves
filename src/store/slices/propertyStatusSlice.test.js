import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import propertyStatusReducer, {
  loadPropertyStatuses,
  updatePropertyStatus,
  setStatusFilter,
  selectFilteredPropertyStatuses,
} from './propertyStatusSlice';

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

describe('propertyStatusSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads property statuses into state', async () => {
    mockAuthFetch.mockResolvedValueOnce(
      jsonResponse([
        { _id: 'p1', occupancyStatus: 'Vacant' },
        { _id: 'p2', occupancyStatus: 'Occupied' },
      ])
    );

    const store = configureStore({ reducer: { propertyStatus: propertyStatusReducer } });
    await store.dispatch(loadPropertyStatuses());

    const state = store.getState().propertyStatus;
    expect(state.allIds).toEqual(['p1', 'p2']);
    expect(state.byId.p2.occupancyStatus).toBe('Occupied');
  });

  it('updates property status through update thunk', async () => {
    mockAuthFetch
      .mockResolvedValueOnce(jsonResponse([{ _id: 'p1', occupancyStatus: 'Vacant' }]))
      .mockResolvedValueOnce(jsonResponse({ _id: 'p1', occupancyStatus: 'Occupied' }));

    const store = configureStore({ reducer: { propertyStatus: propertyStatusReducer } });
    await store.dispatch(loadPropertyStatuses());
    await store.dispatch(
      updatePropertyStatus({ propertyId: 'p1', field: 'occupancyStatus', value: 'Occupied' })
    );

    expect(store.getState().propertyStatus.byId.p1.occupancyStatus).toBe('Occupied');
  });

  it('selector respects occupancy filter', () => {
    const seededState = {
      propertyStatus: {
        ...propertyStatusReducer(undefined, { type: 'unknown' }),
        byId: {
          p1: { _id: 'p1', occupancyStatus: 'Vacant' },
          p2: { _id: 'p2', occupancyStatus: 'Occupied' },
        },
        allIds: ['p1', 'p2'],
      },
    };

    const filteredState = {
      propertyStatus: propertyStatusReducer(
        seededState.propertyStatus,
        setStatusFilter({ field: 'occupancy', value: 'Occupied' })
      ),
    };

    const result = selectFilteredPropertyStatuses(filteredState);
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('p2');
  });
});
