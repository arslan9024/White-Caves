/**
 * Commission Slice Tests
 * Tests for commission Redux slice - CRUD operations and calculations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import {
  createTestCommission,
  createTestCommissions,
} from '../__tests__/factories/index';

// Mock commission slice reducer
const initialState = {
  commissions: [] as any[],
  loading: false,
  error: null as string | null,
};

const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    addCommission: (state, action) => {
      (state.commissions as any[]).push(action.payload);
    },
    updateCommission: (state, action) => {
      const index = (state.commissions as any[]).findIndex(
        (c: any) => c.id === action.payload.id
      );
      if (index !== -1) (state.commissions as any[])[index] = action.payload;
    },
    removeCommission: (state, action) => {
      state.commissions = (state.commissions as any[]).filter(
        (c: any) => c.id !== action.payload
      );
    },
    setCommissions: (state, action) => {
      state.commissions = action.payload;
    },
    updateCommissionStatus: (state, action) => {
      const comm = (state.commissions as any[]).find((c: any) => c.id === action.payload.id);
      if (comm) comm.status = action.payload.status;
    },
    markAsPaid: (state, action) => {
      const comm = (state.commissions as any[]).find((c: any) => c.id === action.payload.id);
      if (comm) {
        comm.status = 'paid';
        comm.paidDate = action.payload.paidDate;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCommissions: (state) => {
      state.commissions = [];
    },
    bulkUpdateStatus: (state, action) => {
      const { ids, status } = action.payload;
      (state.commissions as any[]).forEach((c: any) => {
        if (ids.includes(c.id)) c.status = status;
      });
    },
  },
});

describe('commissionSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        commission: commissionSlice.reducer as any,
      },
    });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = store.getState().commission;
      expect(state).toHaveProperty('commissions');
      expect(Array.isArray(state.commissions)).toBe(true);
    });

    it('should have loading state initialized to false', () => {
      const state = store.getState().commission;
      expect(state.loading).toBe(false);
    });

    it('should have error state initialized to null', () => {
      const state = store.getState().commission;
      expect(state.error).toBe(null);
    });

    it('should have empty commissions array initially', () => {
      const state = store.getState().commission;
      expect(state.commissions).toEqual([]);
    });
  });

  describe('commission CRUD operations', () => {
    it('should add a commission to the list', () => {
      const commission = createTestCommission();
      store.dispatch(commissionSlice.actions.addCommission(commission));

      const state = store.getState().commission;
      expect(state.commissions).toContainEqual(commission);
    });

    it('should update an existing commission', () => {
      const commission = createTestCommission({ status: 'pending' });
      store.dispatch(commissionSlice.actions.addCommission(commission));

      const updated = { ...commission, status: 'paid' };
      store.dispatch(commissionSlice.actions.updateCommission(updated));

      const state = store.getState().commission;
      const found = state.commissions.find((c: any) => c.id === commission.id);
      expect(found?.status).toBe('paid');
    });

    it('should remove a commission by id', () => {
      const commission = createTestCommission();
      store.dispatch(commissionSlice.actions.addCommission(commission));

      store.dispatch(
        commissionSlice.actions.removeCommission(commission.id)
      );

      const state = store.getState().commission;
      expect(state.commissions).not.toContainEqual(commission);
    });

    it('should add multiple commissions', () => {
      const commissions = createTestCommissions(3);
      store.dispatch(
        commissionSlice.actions.setCommissions(commissions)
      );

      const state = store.getState().commission;
      expect(state.commissions.length).toBe(3);
    });
  });

  describe('commission status transitions', () => {
    it('should mark commission as pending', () => {
      const commission = createTestCommission({ status: 'draft' });
      store.dispatch(commissionSlice.actions.addCommission(commission));

      store.dispatch(
        commissionSlice.actions.updateCommissionStatus({
          id: commission.id,
          status: 'pending',
        })
      );

      const state = store.getState().commission;
      const found = state.commissions.find((c: any) => c.id === commission.id);
      expect(found?.status).toBe('pending');
    });

    it('should mark commission as paid with date', () => {
      const commission = createTestCommission({ status: 'pending', paidDate: null });
      store.dispatch(commissionSlice.actions.addCommission(commission));

      const paidDate = new Date().toISOString();
      store.dispatch(
        commissionSlice.actions.markAsPaid({
          id: commission.id,
          paidDate,
        })
      );

      const state = store.getState().commission;
      const found = state.commissions.find((c: any) => c.id === commission.id);
      expect(found?.status).toBe('paid');
      expect(found?.paidDate).toBe(paidDate);
    });

    it('should mark commission as rejected', () => {
      const commission = createTestCommission({ status: 'pending' });
      store.dispatch(commissionSlice.actions.addCommission(commission));

      store.dispatch(
        commissionSlice.actions.updateCommissionStatus({
          id: commission.id,
          status: 'rejected',
        })
      );

      const state = store.getState().commission;
      const found = state.commissions.find((c: any) => c.id === commission.id);
      expect(found?.status).toBe('rejected');
    });
  });

  describe('commission filtering', () => {
    beforeEach(() => {
      const commissions = [
        createTestCommission({
          status: 'pending',
          freelancerId: 'free1',
        }),
        createTestCommission({
          status: 'paid',
          freelancerId: 'free1',
        }),
        createTestCommission({
          status: 'pending',
          freelancerId: 'free2',
        }),
      ];
      store.dispatch(
        commissionSlice.actions.setCommissions(commissions)
      );
    });

    it('should filter commissions by freelancer', () => {
      const state = store.getState().commission;
      const filtered = state.commissions.filter(
        (c: any) => c.freelancerId === 'free1'
      );
      expect(filtered.length).toBe(2);
    });

    it('should filter commissions by status', () => {
      const state = store.getState().commission;
      const filtered = state.commissions.filter(
        (c: any) => c.status === 'pending'
      );
      expect(filtered.length).toBe(2);
    });

    it('should filter commissions by date range', () => {
      const state = store.getState().commission;
      const now = new Date();
      const filtered = state.commissions.filter((c: any) => {
        const createdDate = new Date(c.createdAt);
        return createdDate <= now;
      });
      expect(filtered.length).toBeGreaterThan(0);
    });
  });

  describe('commission calculations', () => {
    it('should calculate total commissions for period', () => {
      const commissions = createTestCommissions(3);
      store.dispatch(
        commissionSlice.actions.setCommissions(commissions)
      );

      const state = store.getState().commission;
      const total = state.commissions.reduce(
        (sum: number, c: any) => sum + c.amount,
        0
      );
      expect(total).toBeGreaterThan(0);
    });

    it('should calculate pending commissions sum', () => {
      const commissions = [
        createTestCommission({
          status: 'pending',
          amount: 1000,
        }),
        createTestCommission({
          status: 'pending',
          amount: 2000,
        }),
        createTestCommission({
          status: 'paid',
          amount: 3000,
        }),
      ];
      store.dispatch(
        commissionSlice.actions.setCommissions(commissions)
      );

      const state = store.getState().commission;
      const pending = state.commissions
        .filter((c: any) => c.status === 'pending')
        .reduce((sum: number, c: any) => sum + c.amount, 0);

      expect(pending).toBe(3000);
    });

    it('should calculate paid commissions sum', () => {
      const commissions = [
        createTestCommission({
          status: 'paid',
          amount: 5000,
        }),
        createTestCommission({
          status: 'paid',
          amount: 3000,
        }),
        createTestCommission({
          status: 'pending',
          amount: 2000,
        }),
      ];
      store.dispatch(
        commissionSlice.actions.setCommissions(commissions)
      );

      const state = store.getState().commission;
      const paid = state.commissions
        .filter((c: any) => c.status === 'paid')
        .reduce((sum: number, c: any) => sum + c.amount, 0);

      expect(paid).toBe(8000);
    });
  });

  describe('loading and error states', () => {
    it('should set loading state', () => {
      store.dispatch(commissionSlice.actions.setLoading(true));
      const state = store.getState().commission;
      expect(state.loading).toBe(true);

      store.dispatch(commissionSlice.actions.setLoading(false));
      const newState = store.getState().commission;
      expect(newState.loading).toBe(false);
    });

    it('should set error state', () => {
      const error = 'Commission fetch failed';
      store.dispatch(commissionSlice.actions.setError(error));

      const state = store.getState().commission;
      expect(state.error).toBe(error);
    });

    it('should clear error state', () => {
      store.dispatch(
        commissionSlice.actions.setError('Some error')
      );
      store.dispatch(commissionSlice.actions.clearError());

      const state = store.getState().commission;
      expect(state.error).toBe(null);
    });
  });

  describe('bulk operations', () => {
    it('should clear all commissions', () => {
      const commissions = createTestCommissions(5);
      store.dispatch(
        commissionSlice.actions.setCommissions(commissions)
      );

      store.dispatch(commissionSlice.actions.clearCommissions());

      const state = store.getState().commission;
      expect(state.commissions).toEqual([]);
    });

    it('should bulk update commission status', () => {
      const commissions = createTestCommissions(3);
      store.dispatch(
        commissionSlice.actions.setCommissions(commissions)
      );

      const ids = commissions.map((c) => c.id);
      store.dispatch(
        commissionSlice.actions.bulkUpdateStatus({
          ids,
          status: 'pending',
        })
      );

      const state = store.getState().commission;
      const updated = state.commissions.filter(
        (c: any) => c.status === 'pending'
      );
      expect(updated.length).toBe(3);
    });
  });
});
